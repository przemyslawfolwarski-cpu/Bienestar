import {readFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const headers=await readFile(path.join(root,'public/_headers'),'utf8');
for(const required of ["default-src 'none'","script-src-attr 'none'","frame-ancestors 'none'","object-src 'none'","base-uri 'none'","form-action 'none'",'X-Frame-Options: DENY','X-Content-Type-Options: nosniff','Strict-Transport-Security: max-age=15552000','Permissions-Policy: camera=(), microphone=(), geolocation=()']) assert.ok(headers.includes(required),`Missing security rule: ${required}`);
assert.ok(!headers.includes("'unsafe-inline'")&&!headers.includes("'unsafe-eval'"),'No inline/eval script exemptions');
assert.ok(!headers.includes('includeSubDomains')&&!headers.includes('preload'),'HSTS must not commit unrelated subdomains or preload');
assert.ok(headers.includes('Content-Type: text/vcard; charset=utf-8'),'Keep contact MIME type');
async function inspect(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await inspect(p);else if(p.endsWith('.html')){const html=await readFile(p,'utf8');assert.ok(!/<(?:form|iframe|object|embed)\b/i.test(html),`Unexpected active element: ${p}`);assert.ok(!/\son[a-z]+\s*=/i.test(html),`Unexpected inline handler: ${p}`);assert.ok(!/\sstyle\s*=/i.test(html),`Inline styles would break strict CSP: ${p}`);assert.ok(!/<script\b(?![^>]*type="application\/ld\+json")/i.test(html),`Unexpected executable script: ${p}`);}}}
await inspect(path.join(root,'public'));
console.log('PASS: browser security policy, contact headers and static HTML restrictions.');
