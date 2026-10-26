import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import HomeBrand from '../pages/HomeBrand.jsx';
import { staticMetadata, familyMetadata, productMetadata, articleMetadata, headEntries } from './metadata.js';
import { findLine } from '../data/lines.js';
import { products } from '../data/products.js';
import { getCatalogProducts } from '../data/catalogProducts.js';
import { posts } from '../data/posts.js';

const graph = meta => JSON.parse(headEntries(meta, {siteUrl:'https://fahint.com/'}).find(e=>e.tag==='script').text)['@graph'];
describe('GEO facts and canonical navigation', () => {
  it('renders homepage page links with canonical paths and preserves anchors', () => {
    const html=renderToString(<MemoryRouter><HomeBrand /></MemoryRouter>);
    const doc=new DOMParser().parseFromString(html,'text/html');
    for(const a of doc.querySelectorAll('a[href^="/"]')) {
      const url=new URL(a.getAttribute('href'),'https://fahint.com');
      if(!url.pathname.startsWith('/assets/')) expect(url.pathname, a.outerHTML).toMatch(/\/$/);
    }
    expect(doc.querySelector('a[href="/resources/#certifications"]')).not.toBeNull();
  });
  it('uses the owner-confirmed full address without inventing a postal code', () => {
    const nodes=graph(staticMetadata['/']);
    const org=nodes.find(n=>n['@type']==='Organization');
    expect(org['@id']).toBe('https://fahint.com/#organization');
    expect(org.address).toMatchObject({addressLocality:'Yueqing, Wenzhou',addressRegion:'Zhejiang',addressCountry:'CN'});
    expect(org.address.streetAddress).toBe('No. 130 Xinguang Avenue, Xinguang Industrial Zone, Liushi Town');
    expect(org.address.postalCode).toBeUndefined();
    expect(org.contactPoint.telephone).toBe('+8618857349189');
    expect(org.foundingDate).toBe('2015');
    expect(org.sameAs).toContain('https://www.instagram.com/fahint2015/');
    expect(org.sameAs.some(url => url.includes('/share/') || url.includes('?'))).toBe(false);
    expect(nodes.find(n=>n['@type']==='WebSite').publisher['@id']).toBe(org['@id']);
  });
  it('uses exact model certificates and real specifications, never fabricated commerce data', () => {
    const gf15=graph(productMetadata(products.find(p=>p.sku==='GF15'),findLine('gfci')));
    const p=gf15.find(n=>n['@type']==='Product');
    expect(p.mpn).toBe('GF15');
    expect(p.additionalProperty).toEqual(expect.arrayContaining([expect.objectContaining({name:'Amperage',value:'15A'}),expect.objectContaining({name:'Rated voltage',value:'125V AC'})]));
    expect(gf15.find(n=>n['@id']===p.hasCertification['@id']).identifier).toBe('E504391-20210212');
    expect(p.hasCertification['@id']).toContain('ul-gfci');
    for(const sku of ['GL20']) {
      const node=graph(productMetadata(products.find(p=>p.sku===sku),findLine('gfci'))).find(n=>n['@type']==='Product');
      expect(node.hasCertification,sku).toBeUndefined();
    }
    const usb=getCatalogProducts('usb-outlets').find(p=>p.sku==='FTR15QC-AC65W');
    expect(graph(productMetadata(usb,findLine('usb-outlets'))).find(n=>n['@type']==='Product').hasCertification).toBeUndefined();
    expect(JSON.stringify(p)).not.toMatch(/"offers"|"aggregateRating"|"review"|"gtin"/);
  });
  it('lists only published category models with canonical URLs', () => {
    const models=getCatalogProducts('usb-outlets');
    const list=graph(familyMetadata(findLine('usb-outlets'),models)).find(n=>n['@type']==='ItemList');
    expect(list.numberOfItems).toBe(models.length);
    expect(list.itemListElement.map(x=>x.name)).toEqual(models.map(p=>p.sku));
    expect(list.itemListElement.every(x=>x.url.endsWith('/'))).toBe(true);
  });
  it('publishes the certificate library without claiming every product is certified', () => {
    const nodes=graph(staticMetadata['/resources']);
    const certs=nodes.filter(n=>n['@type']==='Certification');
    expect(certs).toHaveLength(7);
    expect(certs.every(c=>c.url.endsWith('.pdf'))).toBe(true);
    const org=nodes.find(n=>n['@type']==='Organization');
    expect(org.hasCertification['@id']).toContain('iso-9001');
    expect(certs.find(c => c['@id'] === org.hasCertification['@id'])).toMatchObject({ identifier: '00125Q31531R1S/3302', issuedBy: {name: 'CQC'}, expires: '2028-04-11' });
    expect(nodes.find(n => n['@type'] === 'WebPage').hasPart).toHaveLength(7);
  });
  it('links the visible institutional byline and uses the real article update date', () => {
    const nodes=graph(articleMetadata(posts[0]));
    const article=nodes.find(n=>n['@type']==='Article');
    expect(article.author).toMatchObject({'@type':'Organization',name:'FAHINT','@id':'https://fahint.com/#organization'});
    expect(nodes.find(n=>n['@type']==='WebPage').dateModified).toBe([posts[0].updated||posts[0].date,'2026-10-26'].sort().at(-1));
  });
});
