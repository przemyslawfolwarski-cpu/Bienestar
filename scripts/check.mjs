import {readFile, access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(path.join(root, 'public/index.html'), 'utf8');
const css = await readFile(path.join(root, 'public/styles.css'), 'utf8');
const source = JSON.parse(await readFile(path.join(root, 'source/site_content.json'), 'utf8'));
const decode = value => value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const clean = value => decode(value.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const actual = clean(html.slice(html.indexOf('<body>')));
const expected = [source.person.name];
for (const section of source.sections) {
  if (section.id === 'hero') expected.push(section.name, section.title);
  else {
    expected.push(section.heading);
    if (section.text) expected.push(section.text);
    if (section.items) for (const item of section.items) {
      if (typeof item === 'string') expected.push(item);
      else {
        expected.push(item.name);
        if (item.subtitle) expected.push(item.subtitle);
        expected.push(`${item.duration} / ${item.price}`);
      }
    }
    if (section.first_meetings) expected.push(section.first_meetings.heading, section.first_meetings.text);
    if (section.id === 'kontakt') expected.push('Telefon',source.person.phone_display,section.copy_label,section.scan_label,section.save_label);
  }
}
expected.push(...Object.values(source.footer).flat());
assert.equal(actual, expected.join(' '), 'Published text or order differs from approved content');
assert.equal((html.match(/<h1\b/g)||[]).length, 1);
assert.ok(!/mailto:|gmail\.com|>E-mail</i.test(html), 'Email must not be published in homepage HTML');
assert.ok(!/<a[^>]*>\s*<img[^>]*qr_vcard/.test(html), 'QR image must not be a link');
assert.ok(!html.includes('class="save-contact"'), 'Save-contact link must be removed');
assert.ok(!/\bdownload(?:[\s=>])/.test(html), 'Do not force a contact download');
assert.ok(!/<a[^>]*>[^<]*<img class="contact-pointer"/.test(html), 'Pointer must be outside the link');
assert.ok(!/EMAIL:|@/.test(await readFile(path.join(root,'public/assets/contact/przemyslaw_folwarski.vcf'),'utf8')), 'vCard must not publish an email');
assert.ok(html.includes('lang="pl"'));
assert.ok(html.includes('name="viewport"'));
assert.equal((html.match(/<script\b/g)||[]).length, 1);
assert.ok(html.includes('<script src="/contact.js" defer></script>'));
assert.ok(html.includes('class="copy-controls" hidden'), 'Without JS, do not show an inactive copy button');
for (const href of [source.person.phone_href]) assert.ok(html.includes(`href="${href}"`));
for (const match of html.matchAll(/(?:src|href)="(\/[^"#]*)"/g)) {
  if (match[1] !== '/') await access(path.join(root, 'public', match[1]));
}
const originals = {
  'assets/photo/przemyslaw_folwarski_kolor.jpg':'97fafb64c8793003ad56add5853a662403e5165983ca577025e9b00b74ede468',
  'assets/contact/qr_vcard_przemyslaw.svg':'3ca6607f6ddfb8f942a74b9c42b271e70aa5cf60afaafa23506d40df372e586f'
};
for (const [file, sha] of Object.entries(originals)) {
  assert.equal(createHash('sha256').update(await readFile(path.join(root,'public',file))).digest('hex'),sha,`Original asset modified: ${file}`);
}
assert.ok(!/(?<![\w-])(?:filter|mix-blend-mode|mask-image)\s*:/.test(css.replace(/\.brand img\s*\{[^}]*\}/g, '')),'Image-altering CSS is prohibited outside the approved wordmark');
assert.deepEqual([...css.matchAll(/font-family:\s*([^;]+);/g)].map(m=>m[1]),Array(3).fill('"Linux Libertine"'));
assert.ok(!/blog|aktualnoĹ›ci|przykĹ‚adowy artykuĹ‚/i.test(actual));
console.log('PASS: exact approved text and order, original photo and approved QR SHA-256, links/assets, Linux Libertine, progressive copy action and no visible articles.');
