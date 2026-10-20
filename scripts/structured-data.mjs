// Only facts already published on the site. No inferred qualifications or office address.
export const siteOrigin = 'https://przemyslawfolwarski.pl';
export function structuredData({data, title, pathname, description, article, articles}) {
  const url = siteOrigin + pathname;
  const personId = siteOrigin + '/#person';
  const websiteId = siteOrigin + '/#website';
  const pageId = url + '#webpage';
  const graph = [
    {'@type':'Person', '@id':personId, name:data.person.name, url:siteOrigin + '/', jobTitle:data.person.title, image:siteOrigin + '/' + data.sections.find(s=>s.id==='hero').photo},
    {'@type':'WebSite', '@id':websiteId, url:siteOrigin + '/', name:data.brand.name, inLanguage:'pl-PL', publisher:{'@id':personId}},
    {'@type':articles ? 'CollectionPage' : 'WebPage', '@id':pageId, url, name:title, description, inLanguage:'pl-PL', isPartOf:{'@id':websiteId}, ...(article ? {mainEntity:{'@id':url+'#article'}} : articles ? {mainEntity:{'@id':url+'#entries'}} : {mainEntity:{'@id':personId}})}
  ];
  if (article) graph.push({
    '@type':'BlogPosting', '@id':url+'#article', url, headline:article.title,
    datePublished:article.date, inLanguage:'pl-PL', author:{'@id':personId}, publisher:{'@id':personId},
    mainEntityOfPage:{'@id':pageId}, isPartOf:{'@id':siteOrigin+'/czytelnia/#webpage'},
    description, articleBody:article.paragraphs.join('\n\n')
  });
  if (articles) graph.push({
    '@type':'ItemList', '@id':url+'#entries', numberOfItems:articles.length,
    itemListElement:articles.map((a,i)=>({'@type':'ListItem',position:i+1,url:siteOrigin+'/czytelnia/'+a.slug+'/',name:a.title}))
  });
  // Escape HTML delimiters: JSON-LD is data, never executable page code.
  return JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
}
