import { getDb } from '../../../db';
import { posts, responses } from '../../../db/schema';
import { desc, eq } from 'drizzle-orm';
import { getChatGPTUser } from '../../chatgpt-auth';
import { samples, categories, kinds } from '../../content';
export const dynamic = 'force-dynamic';
const fail = (message: string, status = 400) => Response.json({error:message}, {status});
export async function GET() {
 try {
  const user = await getChatGPTUser(); const db = getDb();
  const [p,r] = await Promise.all([db.select().from(posts).orderBy(desc(posts.createdAt)), db.select().from(responses).orderBy(desc(responses.createdAt))]);
  return Response.json({posts:p.map(({userId,...v})=>({...v,mine:userId===user?.userId})),responses:r.map(({userId,...v})=>({...v,mine:userId===user?.userId})),signedIn:!!user}, {headers:{'Cache-Control':'no-store'}});
 } catch { return fail('تعذّر تحميل المشاركات. حاول مرة أخرى.',503); }
}
export async function POST(request: Request) {
 try {
  if (request.headers.get('origin') !== new URL(request.url).origin) return fail('طلب غير صالح.',403);
  const user = await getChatGPTUser(); if(!user) return fail('سجّل الدخول للمشاركة.',401);
  if(Number(request.headers.get('content-length')||0)>120000) return fail('النص أطول من الحد المسموح.',413);
  const raw = await request.text(); if(raw.length>60000) return fail('النص أطول من الحد المسموح.',413);
  let v; try { v=JSON.parse(raw); } catch { return fail('بيانات غير صالحة.'); }
  if(!v || typeof v!=='object') return fail('بيانات غير صالحة.');
  const db=getDb(); const id=crypto.randomUUID(); const createdAt=Date.now();
  if(v.action==='delete-response') {
   const row=await db.select().from(responses).where(eq(responses.id,String(v.id))).get();
   if(!row || row.userId!==user.userId) return fail('لا يمكنك حذف هذه المشاركة.',403);
   await db.update(responses).set({body:'[حُذفت هذه المشاركة بواسطة صاحبها]',author:'مشاركة محذوفة'}).where(eq(responses.id,row.id));
   return Response.json({ok:true});
  }
  const author=typeof v.author==='string'?v.author.trim():'';
  const body=typeof v.body==='string'?v.body.trim():'';
  if(!author || author.length>60 || !body) return fail('أضف اسمك ونص المشاركة.');
  if(v.action==='publish') {
   const title=typeof v.title==='string'?v.title.trim():'';
   if(title.length<3 || title.length>140 || body.length<40 || body.length>40000 || !categories.slice(1).includes(v.category)) return fail('راجع العنوان والتصنيف. يجب أن يكون النص بين ٤٠ و٤٠٬٠٠٠ حرف.');
   await db.insert(posts).values({id,userId:user.userId,author,title,category:v.category,body,createdAt});
   return Response.json({id}, {status:201});
  }
  if(v.action==='respond') {
   if(body.length>4000 || !kinds.includes(v.kind)) return fail('راجع المشاركة (الحد الأقصى ٤٬٠٠٠ حرف).');
   const postId=String(v.postId); const post=samples.find(p=>p.id===postId) || await db.select().from(posts).where(eq(posts.id,postId)).get();
   if(!post) return fail('النص غير موجود.',404);
   const paragraph=v.paragraph??null;
   if(paragraph!==null && (!Number.isInteger(paragraph)||paragraph<0||paragraph>=post.body.split(/\n\s*\n/).length)) return fail('الفقرة غير صالحة.');
   const parentId=v.parentId??null;
   if(parentId!==null) { const parent=await db.select().from(responses).where(eq(responses.id,String(parentId))).get(); if(!parent||parent.postId!==postId||parent.parentId) return fail('المشاركة الأصلية غير موجودة.'); }
   await db.insert(responses).values({id,postId,userId:user.userId,author,kind:v.kind,body,paragraph,parentId,createdAt});
   return Response.json({id},{status:201});
  }
  return fail('طلب غير معروف.');
 } catch { return fail('لم تُحفظ المشاركة. حاول مرة أخرى.',503); }
}
