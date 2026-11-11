import { build } from 'esbuild';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const project=process.cwd();
const sqlite=new DatabaseSync(':memory:');
sqlite.exec(readFileSync('drizzle/0000_freezing_overlord.sql','utf8'));
globalThis.testSqlite=sqlite;
globalThis.testUser=null;
mkdirSync('.sites-runtime/tests',{recursive:true});
await build({
 entryPoints:['app/api/platform/route.ts'],outfile:'.sites-runtime/tests/api.mjs',bundle:true,platform:'node',format:'esm',packages:'external',
 plugins:[{name:'test-bindings',setup(b){
 b.onResolve({filter:/^\.\.\/\.\.\/\.\.\/db$/},()=>({path:'test-database',namespace:'test'}));
 b.onResolve({filter:/chatgpt-auth$/},()=>({path:'test-auth',namespace:'test'}));
 b.onLoad({filter:/.*/,namespace:'test'},a=>({resolveDir:project,contents:a.path==='test-auth'?'export async function getChatGPTUser(){return globalThis.testUser}':`
 import { drizzle } from 'drizzle-orm/d1';
 const binding={prepare(sql){return {bind(...args){return {
 async run(){const r=globalThis.testSqlite.prepare(sql).run(...args);return {success:true,meta:{changes:r.changes,last_row_id:Number(r.lastInsertRowid)}}},
 async all(){return {results:globalThis.testSqlite.prepare(sql).all(...args)}},
 async raw(){const s=globalThis.testSqlite.prepare(sql);s.setReturnArrays(true);return s.all(...args)}
 }}}}};
 export function getDb(){return drizzle(binding)}
 `}));
 }}]
});
const api=await import(pathToFileURL(path.resolve('.sites-runtime/tests/api.mjs')));
const origin='https://alhamesh.test';
const post=(data,source=origin)=>api.POST(new Request(origin+'/api/platform',{method:'POST',headers:{origin:source,'content-type':'application/json'},body:JSON.stringify(data)}));
const data={action:'publish',author:'كاتب الاختبار',title:'نص اختبار',category:'مقالات',body:'هذا نص طويل بما يكفي لاختبار حفظ النصوص في قاعدة البيانات.\n\nوهذه فقرة ثانية لاختبار الهوامش.'};
assert.equal((await post(data)).status,401);
globalThis.testUser={userId:'user-a',email:'private@example.test'};
assert.equal((await post(data,'https://foreign.test')).status,403);
assert.equal((await post({...data,title:'x'})).status,400);
const created=await post(data);assert.equal(created.status,201);const {id}=await created.json();
const state=await (await api.GET()).json();assert.equal(state.posts[0].id,id);assert.equal(state.posts[0].mine,true);assert.ok(!JSON.stringify(state).includes('private@example.test'));assert.ok(!('userId' in state.posts[0]));
const response={action:'respond',author:'قارئ',postId:id,body:'هل يمكن قراءة هذه الفكرة بطريقة أخرى؟',kind:'سؤال',paragraph:1};
assert.equal((await post({...response,paragraph:99})).status,400);
assert.equal((await post({...response,postId:'missing'})).status,404);
const saved=await post(response);assert.equal(saved.status,201);const root=await saved.json();
const reply=await post({...response,parentId:root.id});assert.equal(reply.status,201);
const child=await reply.json();assert.equal((await post({...response,parentId:child.id})).status,400);
globalThis.testUser={userId:'user-b',email:'reader@example.test'};
assert.equal((await post({action:'delete-response',id:root.id})).status,403);
const other=await post({...data,title:'نص آخر'});const second=await other.json();
assert.equal((await post({...response,postId:second.id,parentId:root.id})).status,400);
globalThis.testUser={userId:'user-a',email:'private@example.test'};
assert.equal((await post({action:'delete-response',id:root.id})).status,200);
const final=await (await api.GET()).json();assert.equal(final.responses.length,2);assert.ok(final.responses.some(r=>r.body.includes('حُذفت')));assert.equal(final.posts.length,2);
sqlite.close();console.log('PASS: migration, authentication, origin check, validation, publish/read, paragraph annotation, replies, ownership, deletion, and privacy (SQLite-backed API harness).');
