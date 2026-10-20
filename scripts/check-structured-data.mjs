import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = JSON.parse(await readFile(path.join(root,'source/site_content.json'),'utf8'));
const articles = JSON.parse(await readFile(path.join(root,'source/articles.json'),'utf8')).filter(a=>a.approved);
const origin = 'https://przemyslawfolwarski.pl';
const pages = ['/', '/czytelnia/', ...articles.map(a=>'/czytelnia/'+a.slug+'/')];
for (const pathname of pages) {
  const html = await readFile(path.join(root,'public',pathname,'index.html'),'utf8');
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length,1);
  const schema = JSON.parse(scripts[0][1]);
  assert.equal(schema['@context'],'https://schema.org');
  const graph = schema['@graph'];
  const ids = graph.map(n=>n['@id']);
  assert.equal(new Set(ids).size,ids.length,'Duplicate schema identity');
  const person = graph.find(n=>n['@type']==='Person');
  assert.equal(person.name,source.person.name);
  assert.equal(person.jobTitle,source.person.title);
  const page = graph.find(n=>['WebPage','CollectionPage'].includes(n['@type']));
  assert.equal(page.url,origin+pathname);
  assert.ok(html.includes('rel="canonical" href="'+page.url+'"'));
  for(const node of graph) {
    for(const field of ['email','address','aggregateRating','review','hasCredential','dateModified']) assert.ok(!(field in node),'Unapproved or invented fact: '+field);
  }
  const article = articles.find(a=>pathname==='/czytelnia/'+a.slug+'/');
  if(article) {
    const post=graph.find(n=>n['@type']==='BlogPosting');
    assert.equal(post.headline,article.title);
    assert.equal(post.datePublished,article.date);
    assert.equal(post.articleBody,article.paragraphs.join('\n\n'));
    assert.equal(post.author['@id'],person['@id']);
    assert.equal(post.mainEntityOfPage['@id'],page['@id']);
    assert.ok(!post.image,'Do not invent article images');
  } else if(pathname==='/czytelnia/') {
    const list=graph.find(n=>n['@type']==='ItemList');
    assert.equal(list.numberOfItems,articles.length);
    assert.deepEqual(list.itemListElement.map(i=>i.name),articles.map(a=>a.title));
    assert.deepEqual(list.itemListElement.map(i=>i.position),articles.map((_,i)=>i+1));
  }
  assert.ok(html.includes('href="/favicon.ico"'));
}
const error=await readFile(path.join(root,'public/404.html'),'utf8');
assert.ok(!error.includes('application/ld+json'),'404 must not describe a real page');
assert.ok(error.includes('content="noindex"'));
console.log('PASS: schema on all 11 canonical pages, exact authorship/text/dates, collection order, no invented qualifications or article images, no schema on 404.');
