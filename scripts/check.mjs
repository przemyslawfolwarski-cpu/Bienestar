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
    if (section.id === 'kontakt') expected.push('Telefon',source.person.phone_display,section.scan_label,section.save_label);
  }
}
expected.push(...Object.values(source.footer).flat(), 'Czytelnia');
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
assert.ok(!/<script\b(?![^>]*type="application\/ld\+json")/.test(html), 'Only non-executable structured data scripts are allowed');
assert.ok(!/copy-controls|copy-number|Kopiuj numer/.test(html));
for (const href of [source.person.phone_href]) assert.ok(html.includes(`href="${href}"`));
for (const match of html.matchAll(/(?:src|href)="(\/[^"#]*)"/g)) {
  if (match[1] !== '/') await access(path.join(root, 'public', match[1].split('?')[0]));
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
console.log('PASS: exact approved text and order, original photo and approved QR SHA-256, links/assets, Linux Libertine, no copy action; approved Czytelnia.');

const articles = JSON.parse(await readFile(path.join(root,'source/articles.json'),'utf8'));
const footer = html.match(/<footer[\s\S]*?<\/footer>/)[0];
assert.ok(!footer.includes('class="container footer-grid" data-nosnippet'), 'Selected footer facts must remain available');
for (const line of [source.person.name, source.person.title, source.person.public_location]) assert.ok(footer.includes(`<span>${line}</span>`), 'Approved homepage footer fact must remain available for snippets');
assert.ok(footer.includes('<span data-nosnippet><span class="footer-label">Telefon:'), 'Contact details must be excluded from snippets');
assert.equal((footer.match(/<span>/g)||[]).length,3,'Exactly three approved footer lines may be used in snippets');
assert.ok(html.includes(`<title>${source.person.name} · ${source.person.title}</title>`), 'Approved homepage title');
for (const article of articles) {
  const page = await readFile(path.join(root,'public/czytelnia',article.slug,'index.html'),'utf8');
  const articleFooter = page.match(/<footer[\s\S]*?<\/footer>/)[0];
  if (article.facebook_url) assert.ok(page.includes(`<h1><a class="reading-facebook-title" href="${article.facebook_url.replace(/&/g,'&amp;')}"`),'Article heading must link to its original Facebook post');
  assert.equal(articleFooter, footer, 'Footer content, layout and snippet rules must be identical');
  const text = clean(page.match(/<article>[\s\S]*?<\/article>/)[0]);
  assert.ok(text.endsWith([article.title,...article.paragraphs].join(' ')), 'Article content must be verbatim');
  assert.ok(!/[—–]/.test(article.title), 'Titles must not contain dashes');
  for (const m of page.matchAll(/href="(\/czytelnia\/[^"#]*)"/g)) await access(path.join(root,'public',m[1],'index.html'));
}
console.log(`PASS: ${articles.length} article texts, dates, navigation and shared footer.`);
const readingPage = await readFile(path.join(root,'public/czytelnia/index.html'),'utf8');
assert.equal(readingPage.match(/<footer[\s\S]*?<\/footer>/)[0],footer,'Reading-list footer must have identical snippet rules');
assert.ok(!html.includes('class="home-return-bar"')&&!html.includes('class="side-home"'),'Do not add reading navigation to homepage');
for (const page of [readingPage,...await Promise.all(articles.map(a=>readFile(path.join(root,'public/czytelnia',a.slug,'index.html'),'utf8')))]) {
  for (const name of ['home-return-bar','side-home']) assert.ok(page.includes(`class="${name}" href="https://przemyslawfolwarski.pl/"`),'Both permanent links must lead to the primary homepage');
  assert.ok(page.includes('<body class="reading-view">'));
  assert.ok(!page.includes('class="reading-back"'),'Remove duplicate inline home link');
}
const newestFirst = [...articles].filter(a=>a.approved).sort((a,b)=>b.date.localeCompare(a.date));
const listingDates = [...readingPage.matchAll(/<time class="reading-date" datetime="([^"]+)"/g)].map(m=>m[1]);
const facebookLinks = [...readingPage.matchAll(/class="reading-facebook-title" href="([^"]+)"/g)].map(m=>decode(m[1]));
assert.deepEqual(facebookLinks,newestFirst.filter(a=>a.facebook_url).map(a=>a.facebook_url),'Facebook title links must match approved post URLs in reading order');
const readingLinks = [...readingPage.matchAll(/class="reading-more" href="([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(readingLinks,newestFirst.map(a=>'/czytelnia/'+a.slug+'/'),'Read-more links must continue opening local articles');
assert.deepEqual(listingDates,newestFirst.map(a=>a.date),'Reading list must show newest dates first');
for (const [i,a] of newestFirst.entries()) {
  const page=await readFile(path.join(root,'public/czytelnia',a.slug,'index.html'),'utf8');
  const nav=page.split('<nav class="reading-nav">')[1].split('</nav>')[0];
  const links=[...nav.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
  const expected=[newestFirst[i-1],newestFirst[i+1]].filter(Boolean).map(a=>'/czytelnia/'+a.slug+'/');
  assert.deepEqual(links,expected,'Article navigation must follow the newest-first list');
}
await import('./check-structured-data.mjs');

