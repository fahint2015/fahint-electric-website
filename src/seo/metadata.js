// Shared by browser pages and build-time HTML heads. Do not import the full catalogue here.
import { findModelCertificate } from '../data/certificates.js';
import { conciseSpecificationRows } from '../utils/productSpecifications.js';
import { modelGuideLink } from '../data/modelGuideLinks.js';
import { organizationEntity, organizationUpdated, certificateId, supportingEntities } from './entities.js';
import { modelNoteDate } from '../data/smartSwitchNotes.js';
const organization = { '@type': 'Organization', name: 'FAHINT', legalName: 'Wenzhou Fahint Electric Co., Ltd.' };
const homeImage = 'assets/images/brand-home/generated/hero-family-belief-background.webp';
export const staticMetadata = Object.fromEntries(Object.entries({
  '/': {
    title: 'FAHINT | Safer Power. Better Living.',
    description: 'FAHINT manufactures GFCI outlets, USB wall outlets, switches and dimmers for North American markets, with OEM/ODM support for brands and distributors.',
    image: homeImage, imageAlt: 'A family in a bright home — FAHINT brand concept', organization: true,
  },
  '/applications': {
    updated: '2026-10-28', // Residential, workplace and hospitality selection guidance revised.
    title: 'Residential, Workplace & Hospitality Applications | FAHINT',
    description: 'Explore FAHINT protection, charging and lighting controls for residential, workplace and hospitality spaces. Review the model for your application.',
    image: 'assets/images/brand-home/generated/application-residential-scene.webp', imageAlt: 'Residential interior — FAHINT brand concept', label: 'Applications',
  },
  '/applications/residential': {
    title: 'Residential Outlets, Charging & Lighting Controls | FAHINT',
    description: 'Explore FAHINT GFCI outlets, USB charging, dimmers and smart controls for residential spaces. Compare models and plan your next home project.',
    image: 'assets/images/brand-home/applications/residential-cutaway-v2.webp', imageAlt: 'Illustrated residential cutaway with kitchen, living room and bedroom', label: 'Residential applications',
  },
  '/applications/workplace': {
    title: 'Workplace Outlets, USB Charging & Lighting Controls | FAHINT',
    description: 'Explore FAHINT receptacles, USB-C charging, switches and dimmers for offices, meeting rooms and shared spaces. Compare models for your workplace project.',
    image: 'assets/images/brand-home/applications/workplace-cutaway-v2.webp', imageAlt: 'Commercial office cutaway with open workstations, glass meeting room and reception', label: 'Workplace applications',
  },
  '/applications/hospitality': {
    title: 'Hospitality Outlets, Charging & Room Controls | FAHINT',
    description: 'Explore FAHINT USB outlets, GFCI protection, switches and dimmers for hotel guest rooms. Compare charging, lighting controls and coordinated finishes.',
    image: 'assets/images/brand-home/applications/hospitality-cutaway-v3.webp', imageAlt: 'Hotel guest floor with a shared corridor and three separate rooms with ensuite bathrooms', label: 'Hospitality applications',
  },
  '/products': {
    title: 'FAHINT | Product Catalog',
    description: 'Compare GFCI and USB outlets, receptacles, dimmers, switches and wallplates. Find model specifications, photographs and purchasing information from FAHINT.',
    image: 'assets/images/editorial-home/brand-system-family-final-optimized.webp', imageAlt: 'FAHINT wiring-device collection', label: 'Products',
  },
  '/capabilities': {
    updated: '2026-10-28', // Private-label selection copy and product-family links revised.
    title: 'OEM Wiring Devices & Private-Label Manufacturing | FAHINT',
    description: 'Source OEM wiring devices from FAHINT. Review model selection, private-label packaging, samples and manufacturing support for your distribution range.',
    image: 'assets/images/company/capabilities/workshop-editorial-v1.webp', imageAlt: 'FAHINT electronics workshop — AI-refined from a factory photograph', label: 'Manufacturing & OEM / ODM',
  },
  '/about': {
    title: 'About FAHINT | Wiring Device Manufacturer in Wenzhou',
    description: 'Meet Wenzhou Fahint Electric, established in 2015. Explore our team, wiring-device manufacturing and original product-family certification documents.',
    image: 'assets/images/company/factory/electronics-workshop-v2.webp', imageAlt: 'FAHINT electronics workshop', label: 'About FAHINT', organization: true,
  },
  '/contact': {
    updated: '2026-10-26', // Owner-confirmed full street address added to the page.
    title: 'Contact FAHINT | Product & OEM Inquiries',
    description: 'Send FAHINT your models, quantities, market and packaging needs. Contact our Wenzhou team about product quotations, OEM/ODM projects or technical documents.',
    image: 'assets/images/company/fahint-showroom-front-v1.webp', imageAlt: 'FAHINT showroom and product display', label: 'Contact',
  },
  '/resources': {
    updated: '2026-10-25', // Original ISO number and model-specific certification graph.
    title: 'Product Catalog & Certificate Downloads | FAHINT',
    description: 'Download the FAHINT product catalog and original product-family certificates. Find model references and request installation or technical documents for your device.',
    image: 'assets/images/company/factory/showroom-samples-v1.webp', imageAlt: 'FAHINT wiring-device samples', label: 'Resources',
  },
  '/blog': {
    updated: '2026-10-28', // Revised guide dates are shown in the article listing.
    title: 'Wiring Device Guides | FAHINT',
    description: 'Read FAHINT buyer guides on GFCI selection, sourcing, finishes and product documentation. Compare options using practical questions and original references.',
    image: 'assets/images/company/factory/showroom-samples-v1.webp', imageAlt: 'Wiring-device samples in the FAHINT showroom', label: 'Guides & insights',
  },
}).map(([path, meta]) => [path, { ...meta, structuredDataUpdated: organizationUpdated }]));

export const notFoundMetadata = {
  title: 'Page not found | FAHINT', description: 'The requested FAHINT page could not be found. Browse products or contact the team.', noindex: true,
};

export function familyMetadata(line, models = []) {
  const titles = {
    gfci: 'GFCI Outlet Manufacturer | 15A & 20A Models | FAHINT',
    'usb-outlets': 'USB-C Wall Outlets | USB-A & Power Delivery | FAHINT',
    receptacles: 'Duplex & Decorator Receptacles | FAHINT',
    dimmers: 'LED & 0–10V Dimmer Switches | FAHINT',
    'smart-switches': 'Wi-Fi & Zigbee Smart Wall Switches | FAHINT',
    'lighting-switches': 'Single-Pole, 3-Way & Combination Switches | FAHINT',
    wallplates: 'Screwless & Decorator Wall Plates | FAHINT',
  };
  const descriptions = {
    gfci: 'Compare FAHINT 15A and 20A self-test GFCI outlets, including TR and WR models. Review model documents and prepare your bulk or OEM inquiry.',
    'usb-outlets': 'Compare USB-A and USB-C wall outlets, from conventional 5V to 20W, 36W and 65W Power Delivery. Check model outputs, AC ratings and OEM options.',
    receptacles: 'Compare 15A and 20A duplex and decorator receptacles, including commercial and tamper-resistant models. Review wiring, ratings and model documents.',
    dimmers: 'Compare the DM2010 LED slide dimmer and DM2010S 120/277V 0–10V dimmer switch. Check lamp or driver compatibility and load-specific ratings.',
    'smart-switches': 'Compare Wi-Fi touch switches and Zigbee wall switches by control function, wiring and US/EU format. Check the exact model and gateway requirements.',
    'lighting-switches': 'Compare single-pole and 3-way paddle switches, toggle switches, and double- or triple-rocker combination models. Review ratings and wiring.',
    wallplates: 'Compare screwless decorator wall plates, glossy and matte finishes, and 1- to 4-gang options. Find duplex, toggle and blank plates with model dimensions.',
  };
  return {
    path: `/products/${line.slug}`, title: titles[line.slug] || `${line.name} · Models & Specifications | FAHINT`, description: descriptions[line.slug] || line.summary,
    updated: '2026-10-28', // Concise selection copy revised for all seven families; five titles made specific.
    structuredDataUpdated: organizationUpdated,
    image: line.cover, imageAlt: `${line.name} from FAHINT`,
    breadcrumbs: [['Home', '/'], ['Products', '/products'], [line.name, `/products/${line.slug}`]],
    models: models.filter(model => !model.draft).map(model => ({ name: model.sku, path: `/products/${line.slug}/${model.slug || model.sku.toLowerCase()}` })),
  };
}

export function productMetadata(product, line) {
  const path = `/products/${line.slug}/${product.slug || product.sku.toLowerCase()}`;
  return {
    // Record only actual model-copy, document or guide-link changes, never a build timestamp.
    updated: [product.updated || '2026-10-25', modelGuideLink(product.sku, line.slug)?.updated, modelNoteDate(product.sku)].filter(Boolean).sort().at(-1),
    structuredDataUpdated: organizationUpdated,
    path, title: `${product.sku} ${product.name} | FAHINT`, description: product.summary,
    image: product.assets.hero, imageAlt: `FAHINT ${product.sku} ${product.name}`,
    breadcrumbs: [['Home', '/'], ['Products', '/products'], [line.name, `/products/${line.slug}`], [product.sku, path]],
    certificate: findModelCertificate(product),
    entity: { '@type': 'Product', name: `${product.sku} ${product.name}`, sku: product.sku, mpn: product.sku, description: product.summary,
      additionalProperty: conciseSpecificationRows(product).map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
      category: line.name, brand: { '@type': 'Brand', name: 'FAHINT' }, manufacturer: organization },
  };
}

export function articleMetadata(post) {
  const path = `/blog/${post.slug}`;
  return {
    structuredDataUpdated: organizationUpdated,
    path, title: `${post.title} | FAHINT`, description: post.excerpt, image: post.cover, imageAlt: post.coverAlt, type: 'article',
    breadcrumbs: [['Home', '/'], ['Guides & insights', '/blog'], [post.title, path]],
    entity: { '@type': 'Article', headline: post.title, description: post.excerpt, datePublished: post.date,
      dateModified: [post.updated || post.date, '2026-10-25'].sort().at(-1), publisher: organization, author: organization, inLanguage: 'en' },
  };
}

export function validateSiteUrl(value = '') {
  if (!value) return '';
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('Site URL must be an HTTP(S) address without credentials, query or hash.');
  }
  return `${url.href.replace(/\/+$/, '')}/`;
}

export const serializeSchema = value => JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

// Dates describe recorded content/structured-data changes, never build or checkout time.
// Article attribution and its visible FAHINT byline were added on 2026-10-25.
export const pageModifiedDate = meta => [meta.updated, meta.structuredDataUpdated, meta.entity?.dateModified].filter(Boolean).sort().at(-1);

export function headEntries(meta, { path = '/', siteUrl = '', publicUrl = '' } = {}) {
  const configured = validateSiteUrl(siteUrl);
  const base = configured || validateSiteUrl(publicUrl);
  const route = (meta.path || path).split(/[?#]/)[0].replace(/^\/+|\/+$/g, '');
  const pageUrl = base ? new URL(route ? `${route}/` : '', base).href : '';
  const image = base && meta.image ? new URL(meta.image.replace(/^\/+/, ''), base).href : '';
  const entries = [{ tag: 'title', text: meta.title }];
  const addMeta = (key, name, content) => entries.push({ tag: 'meta', attributes: { [key]: name, ...(content ? { content } : {}) }, remove: !content });
  const description = meta.description.replace(/\s+/g, ' ').trim();
  addMeta('name', 'description', description);
  addMeta('name', 'robots', meta.robots || (meta.noindex ? 'noindex, follow' : 'index, follow'));
  for (const [key, value] of Object.entries({ title: meta.title, description, type: meta.type || 'website', image, 'image:alt': image ? meta.imageAlt : '', url: pageUrl, site_name: 'FAHINT', locale: 'en_US' })) {
    addMeta('property', `og:${key}`, value);
  }
  for (const [key, value] of Object.entries({ card: 'summary_large_image', title: meta.title, description, image, 'image:alt': image ? meta.imageAlt : '' })) {
    addMeta('name', `twitter:${key}`, value);
  }
  addMeta('property', 'article:published_time', meta.entity?.datePublished);
  addMeta('property', 'article:modified_time', meta.entity?.dateModified);
  entries.push({ tag: 'link', attributes: { rel: 'canonical', ...(configured && !meta.noindex ? { href: pageUrl } : {}) }, remove: !configured || meta.noindex });

  const graph = [];
  if (!meta.noindex) {
    const org = base ? organizationEntity(base) : organization;
    const orgRef = base ? { '@type': 'Organization', '@id': org['@id'], name: org.name } : organization;
    if (base || meta.organization) graph.push(org);
    if (base) {
      graph.push(...supportingEntities(meta, base));
      graph.push({ '@type': 'WebSite', '@id': `${base}#website`, name: 'FAHINT', url: base, publisher: orgRef });
      graph.push({ '@type': 'WebPage', '@id': `${pageUrl}#webpage`, name: meta.title, url: pageUrl, isPartOf: { '@id': `${base}#website` },
        ...(meta.label === 'Resources' ? { hasPart: supportingEntities(meta, base).map(c => ({ '@id': c['@id'] })) } : {}),
        ...(meta.models?.length ? { mainEntity: { '@id': `${pageUrl}#models` } } : {}),
        ...(pageModifiedDate(meta) ? { dateModified: pageModifiedDate(meta) } : {}) });
      if (meta.models?.length) graph.push({ '@type': 'ItemList', '@id': `${pageUrl}#models`, numberOfItems: meta.models.length,
        itemListElement: meta.models.map((model, index) => ({ '@type': 'ListItem', position: index + 1, name: model.name, url: new URL(`${model.path.replace(/^\/+|\/+$/g, '')}/`, base).href })) });
    }
    if (meta.entity) {
      const entity = { ...meta.entity, ...(image ? { image: [image] } : {}), ...(pageUrl ? { url: pageUrl } : {}) };
      if (entity['@type'] === 'Product') {
        entity.manufacturer = orgRef;
        if (base && meta.certificate) entity.hasCertification = { '@id': certificateId(meta.certificate, base) };
      }
      if (entity['@type'] === 'Article') { entity.publisher = orgRef; entity.author = { ...orgRef, ...(base ? { url: new URL('about/', base).href } : {}) }; }
      graph.push(entity);
    }
    const crumbs = meta.breadcrumbs || (meta.label ? [['Home', '/'], [meta.label, `/${route}`]] : []);
    if (base && crumbs.length) graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs.map(([name, href], index) => ({
      '@type': 'ListItem', position: index + 1, name, item: new URL(href.replace(/^\/+|\/+$/g, '') + (href === '/' ? '' : '/'), base).href,
    })) });
  }
  entries.push({ tag: 'script', attributes: { type: 'application/ld+json', 'data-fahint-schema': '' },
    text: graph.length ? serializeSchema({ '@context': 'https://schema.org', '@graph': graph }) : '', remove: graph.length === 0 });
  return entries;
}

export const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
export function renderHeadEntries(entries) {
  return entries.filter(entry => !entry.remove).map(({ tag, attributes = {}, text = '' }) => {
    const attrs = Object.entries(attributes).map(([key, value]) => ` ${key}="${escapeHtml(value)}"`).join('');
    return ['meta', 'link'].includes(tag) ? `<${tag}${attrs}>` : `<${tag}${attrs}>${tag === 'script' ? text : escapeHtml(text)}</${tag}>`;
  }).join('\n    ');
}
