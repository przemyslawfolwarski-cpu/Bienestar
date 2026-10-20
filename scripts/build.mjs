import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = JSON.parse(await readFile(path.join(root, 'source/site_content.json'), 'utf8'));
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const s = Object.fromEntries(data.sections.map(section => [section.id, section]));
const heading = section => `<h2 id="${section.id}-heading">${esc(section.heading)}<span class="heading-mark" aria-hidden="true"></span></h2>`;
const header = `<header class="site-header"><div class="container"><a class="brand" href="/" aria-label="${esc(data.brand.name)}"><img src="/${data.brand.wordmark_asset}" width="325" height="120" alt="${esc(data.brand.name)}"></a><p class="brand-name">${esc(data.person.name)}</p></div></header>`;
const contacts = line => esc(line).replace(/^Telefon:/, '<span class="footer-label">Telefon:</span>').replace(esc(data.person.phone_display), `<a href="${data.person.phone_href}">${esc(data.person.phone_display)}</a>`);
const footer = `<footer class="site-footer"><div class="container footer-grid">${Object.entries(data.footer).map(([name, lines]) => `<div class="footer-${name}">${lines.map(line=>`<p>${contacts(line)}</p>`).join('')}${name === 'right' ? '<p class="footer-reading"><a href="/czytelnia/">Czytelnia</a></p>' : ''}</div>`).join('')}</div></footer>`;
const document = (title, body) => `<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <link rel="preload" href="/assets/fonts/LinLibertine_R.otf" as="font" type="font/otf" crossorigin>
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/reading.css">
</head>
<body>${header}${body}${footer}</body>
</html>
`;
const listCards = (items, className) => `<ul class="${className}">${items.map(item=>`<li><span class="small-mark" aria-hidden="true"></span><p>${esc(item)}</p></li>`).join('')}</ul>`;
const body = `<main id="main">
<section id="hero" class="hero container" aria-labelledby="hero-heading">
  <div class="hero-copy"><h1 id="hero-heading">${esc(s.hero.name)}</h1><p class="profession">${esc(s.hero.title)}</p><span class="hero-mark" aria-hidden="true"></span></div>
  <img class="portrait" src="/${s.hero.photo}" width="960" height="1280" alt="${esc(s.hero.name)}" fetchpriority="high">
</section>
<section id="mozesz-przyjsc" class="section container reasons" aria-labelledby="mozesz-przyjsc-heading">
  ${heading(s['mozesz-przyjsc'])}<ul>${s['mozesz-przyjsc'].items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>
</section>
<section id="o-mojej-pracy" class="section container about" aria-labelledby="o-mojej-pracy-heading">
  ${heading(s['o-mojej-pracy'])}<p>${esc(s['o-mojej-pracy'].text)}</p>
</section>
<section id="fundamenty" class="section container" aria-labelledby="fundamenty-heading">
  ${heading(s.fundamenty)}${listCards(s.fundamenty.items, 'foundation-grid')}
</section>
<section id="organizacja" class="section container" aria-labelledby="organizacja-heading">
  ${heading(s.organizacja)}${listCards(s.organizacja.items, 'organization-strip')}
</section>
<section id="oferta" class="section container" aria-labelledby="oferta-heading">
  ${heading(s.oferta)}<div class="offer-grid">${s.oferta.items.map(item=>`<div class="offer-card"><span class="small-mark" aria-hidden="true"></span><h3>${esc(item.name)}</h3>${item.subtitle ? `<p class="offer-subtitle">${esc(item.subtitle)}</p>` : '<span class="offer-subtitle" aria-hidden="true"></span>'}<p class="offer-price">${esc(item.duration)} / ${esc(item.price)}</p></div>`).join('')}</div>
  <section id="pierwsze-spotkania" class="first-meetings" aria-labelledby="pierwsze-spotkania-heading">${heading({...s.oferta.first_meetings,id:'pierwsze-spotkania'})}<p>${esc(s.oferta.first_meetings.text)}</p></section>
</section>
<section id="kontakt" class="section container contact" aria-labelledby="kontakt-heading">
  <div class="contact-grid"><div class="contact-copy">${heading(s.kontakt)}<dl><div><dt>Telefon</dt><dd><a href="${data.person.phone_href}">${esc(data.person.phone_display)}</a></dd></div></dl></div><div class="qr-wrap"><img src="/${s.kontakt.qr_asset}" width="650" height="650" alt="vCard — ${esc(data.person.name)}" loading="lazy"><div class="qr-caption"><p>${esc(s.kontakt.scan_label)}</p><p>${esc(s.kontakt.save_label)}</p></div></div></div>
</section>
<section id="komfort" class="section container comfort" aria-labelledby="komfort-heading">
  ${heading(s.komfort)}<ul class="comfort-grid">${s.komfort.items.map((item,i)=>`<li><span class="comfort-icon icon-${i}" aria-hidden="true"></span><span class="small-mark" aria-hidden="true"></span><p>${esc(item)}</p></li>`).join('')}</ul>
</section>
</main>`;
await writeFile(path.join(root, 'public/index.html'), document(`${data.brand.name} — ${data.person.name} — ${data.person.title}`, body));


const articles = JSON.parse(await readFile(path.join(root, 'source/articles.json'), 'utf8')).filter(a => a.approved === true);
const slugs = new Set();
const dateLabel = value => new Intl.DateTimeFormat('pl-PL', {day:'numeric', month:'long', year:'numeric', timeZone:'UTC'}).format(new Date(value + 'T12:00:00Z'));
const back = '<a class="reading-back" href="/">← Strona główna</a>';
const articleLink = a => `/czytelnia/${a.slug}/`;
for (const [i, article] of articles.entries()) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) || slugs.has(article.slug)) throw new Error('Invalid or duplicate approved article slug');
  if (!article.title || !article.paragraphs?.length || !/^\d{4}-\d{2}-\d{2}$/.test(article.date)) throw new Error('Incomplete approved article');
  slugs.add(article.slug);
  const directory = path.join(root, 'public/czytelnia', article.slug);
  await mkdir(directory, {recursive:true});
  const previous = articles[i-1];
  const next = articles[i+1];
  const navigation = `<nav class="reading-nav">${previous ? `<a href="${articleLink(previous)}">← Poprzedni wpis</a>` : '<span></span>'}${next ? `<a href="${articleLink(next)}">Następny wpis →</a>` : ''}</nav>`;
  const articleBody = `<main class="container reading reading-article">${back}<article><time class="reading-date" datetime="${article.date}">${esc(dateLabel(article.date))}</time><h1>${esc(article.title)}</h1><p class="reading-lead">${esc(article.paragraphs[0])}</p><div class="reading-prose">${article.paragraphs.slice(1).map(p=>`<p>${esc(p)}</p>`).join('')}</div></article>${navigation}</main>`;
  await writeFile(path.join(directory, 'index.html'), document(`${article.title} — ${data.brand.name}`, articleBody));
}
const entries = articles.map(a=>`<article class="reading-entry"><time class="reading-date" datetime="${a.date}">${esc(dateLabel(a.date))}</time><h2>${esc(a.title)}</h2><div class="reading-row"><p>${esc(a.paragraphs[0])}</p><a class="reading-more" href="${articleLink(a)}">Czytaj dalej　 →</a></div></article>`).join('');
await mkdir(path.join(root,'public/czytelnia'),{recursive:true});
await writeFile(path.join(root,'public/czytelnia/index.html'), document(`Czytelnia — ${data.brand.name}`, `<main class="container reading">${back}<h1>Czytelnia</h1><p class="reading-intro">Teksty o relacji ze sobą, emocjach, granicach<br>i codziennym funkcjonowaniu.</p><div class="reading-list">${entries}</div></main>`));
console.log(`Built approved homepage and ${slugs.size} approved Czytelnia articles.`);
