# الهامش — Alhamesh

An independent Arabic cultural platform exploring the relationship between writer, text, and reader.

> Writing is an individual act, but meaning is not an individual act.

## Included

- Responsive Arabic RTL editorial homepage and reading view.
- Text search, category filters, and device-local reading bookmarks.
- Authenticated publication of original texts.
- Database-backed comments, interpretations, questions, and objections.
- Paragraph-specific annotations and one-level discussion replies.
- Ownership checks for withdrawing your own responses.
- Device-local writing drafts.
- Clearly labeled original sample writing; no invented authors or activity.

## Stack

React 19, TypeScript, Vinext/Vite, Cloudflare Workers, D1 SQLite, Drizzle, and Sites authentication. Fonts are Amiri and IBM Plex Sans Arabic from Google Fonts, with local fallbacks.

## Development

Node.js 22.13+ required (Node 24+ for the SQLite verification script).

```sh
npm ci
node node_modules/drizzle-kit/bin.cjs generate
node scripts/run-framework.mjs build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_freezing_overlord.sql
node scripts/run-framework.mjs dev
```

Apply each migration once. Local development sign-in is available at /signin-with-chatgpt?return_to=/ on loopback. Hosted sign-in is platform-owned. Never trust client-submitted user IDs.

```sh
node node_modules/typescript/bin/tsc --noEmit
node scripts/check-api.mjs
node scripts/run-framework.mjs build
```

The API check uses an ephemeral SQLite database with a D1-compatible adapter and mocked identity; it is not a replacement for hosted runtime verification. Direct Node commands avoid a Windows npm lifecycle launcher issue observed on the authoring host.

## Hosting

The Sites manifest is in .openai/hosting.json. DB is the durable D1 binding. Publish the built Worker through Sites, preserving its current audience. The initial deployment is owner-private. No secrets belong in Git.

## Scope

This first version supports text publication and discussion. It does not yet provide editorial moderation, article editing/deletion, notifications, email registration, or a full admin dashboard. Bookmarks and unpublished drafts are local to the current browser. Published texts and responses are stored centrally. Publishing to a wider audience should be paired with appropriate editorial moderation.
