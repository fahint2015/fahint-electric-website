// Shared by browser pages and build-time HTML heads. Do not import the full catalogue here.
const organization = { '@type': 'Organization', name: 'FAHINT', legalName: 'Wenzhou Fahint Electric Co., Ltd.' };
const homeImage = 'assets/images/hero/hero-interior.webp';
export const staticMetadata = {
  '/': {
    title: 'FAHINT | Wiring Devices & OEM/ODM Manufacturing',
    description: 'Explore FAHINT wiring devices for North American markets. Compare seven product families, model documentation and OEM/ODM options for your brand.',
    image: homeImage, imageAlt: 'FAHINT wiring devices in an interior setting', organization: true,
  },
  '/products': {
    title: 'FAHINT | Product Catalog',
    description: 'Compare GFCI and USB outlets, receptacles, dimmers, switches and wallplates. Find model specifications, photographs and purchasing information from FAHINT.',
    image: 'assets/images/editorial-home/brand-system-family-final-optimized.webp', imageAlt: 'FAHINT wiring-device collection', label: 'Products',
  },
  '/capabilities': {
    title: 'Wiring Device Manufacturing & OEM/ODM | FAHINT',
    description: 'Explore FAHINT assembly, product testing and OEM/ODM support. Prepare model, finish, packaging and documentation requirements for your wiring-device order.',
    image: 'assets/images/company/capabilities/workshop-editorial-v1.webp', imageAlt: 'FAHINT electronics workshop — AI-refined from a factory photograph', label: 'Manufacturing & OEM / ODM',
  },
  '/about': {
    title: 'About FAHINT | Wiring Device Manufacturer in Wenzhou',
    description: 'Meet Wenzhou Fahint Electric, established in 2015. Explore our team, wiring-device manufacturing and original product-family certification documents.',
    image: 'assets/images/company/factory/electronics-workshop-v2.webp', imageAlt: 'FAHINT electronics workshop', label: 'About FAHINT', organization: true,
  },
  '/contact': {
    title: 'Contact FAHINT | Product & OEM Inquiries',
    description: 'Send FAHINT your models, quantities, market and packaging needs. Contact our Wenzhou team about product quotations, OEM/ODM projects or technical documents.',
    image: 'assets/images/company/fahint-showroom-front-v1.webp', imageAlt: 'FAHINT showroom and product display', label: 'Contact',
  },
  '/resources': {
    title: 'Product Catalog & Certificate Downloads | FAHINT',
    description: 'Download the FAHINT product catalog and original product-family certificates. Find model references and request installation or technical documents for your device.',
    image: 'assets/images/company/factory/showroom-samples-v1.webp', imageAlt: 'FAHINT wiring-device samples', label: 'Resources',
  },
  '/blog': {
    title: 'Wiring Device Guides | FAHINT',
    description: 'Read FAHINT buyer guides on GFCI selection, sourcing, finishes and product documentation. Compare options using practical questions and original references.',
    image: 'assets/images/company/factory/showroom-samples-v1.webp', imageAlt: 'Wiring-device samples in the FAHINT showroom', label: 'Guides & insights',
  },
};

export const notFoundMetadata = {
  title: 'Page not found | FAHINT', description: 'The requested FAHINT page could not be found. Browse products or contact the team.', noindex: true,
};

export function familyMetadata(line) {
  const descriptions = {
    gfci: 'Compare 15A and 20A GFCI outlets, TR/WR variants and blank-face models. Review ratings, model-specific documentation and OEM options with FAHINT.',
    'usb-outlets': 'Compare USB-A, USB-C and PD charging outlets, from 3.1A USB to 65W GaN models. Check port outputs, receptacle ratings and model documentation.',
    receptacles: 'Compare FAHINT duplex and decorator receptacles by voltage, current, TR/WR features and wiring method. Review the exact model before ordering.',
    dimmers: 'Compare FAHINT digital slide and 0-10V dimmers. Check load-specific ratings, control type, wiring requirements and product documentation.',
    'smart-switches': 'Compare Wi-Fi, Zigbee and touch-only switches by wiring, control function and US/EU format. Review the exact FAHINT model and required accessories.',
    'lighting-switches': 'Compare FAHINT paddle, toggle and combination switches. Check single-pole or 3-way operation, electrical ratings and model-specific approvals.',
    wallplates: 'Compare FAHINT standard and screwless wallplates by opening, gang count and finish. Review dimensions and the matching device before ordering.',
  };
  return {
    path: `/products/${line.slug}`, title: `${line.name} · Models & Specifications | FAHINT`, description: descriptions[line.slug] || line.summary,
    image: line.cover, imageAlt: `${line.name} from FAHINT`,
    breadcrumbs: [['Home', '/'], ['Products', '/products'], [line.name, `/products/${line.slug}`]],
  };
}

export function productMetadata(product, line) {
  const path = `/products/${line.slug}/${product.slug || product.sku.toLowerCase()}`;
  return {
    path, title: `${product.sku} ${product.name} | FAHINT`, description: product.summary,
    image: product.assets.hero, imageAlt: `FAHINT ${product.sku} ${product.name}`,
    breadcrumbs: [['Home', '/'], ['Products', '/products'], [line.name, `/products/${line.slug}`], [product.sku, path]],
    entity: { '@type': 'Product', name: `${product.sku} ${product.name}`, sku: product.sku, description: product.summary,
      category: line.name, brand: { '@type': 'Brand', name: 'FAHINT' }, manufacturer: organization },
  };
}

export function articleMetadata(post) {
  const path = `/blog/${post.slug}`;
  return {
    path, title: `${post.title} | FAHINT`, description: post.excerpt, image: post.cover, imageAlt: post.coverAlt, type: 'article',
    breadcrumbs: [['Home', '/'], ['Guides & insights', '/blog'], [post.title, path]],
    entity: { '@type': 'Article', headline: post.title, description: post.excerpt, datePublished: post.date,
      dateModified: post.updated || post.date, publisher: organization, inLanguage: 'en' },
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
    if (meta.organization) graph.push({ ...organization, ...(base ? { url: base, logo: new URL('assets/images/brand/fahint-logo-navy.png', base).href } : {}) });
    if (meta.entity) graph.push({ ...meta.entity, ...(image ? { image: [image] } : {}), ...(pageUrl ? { url: pageUrl } : {}) });
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
