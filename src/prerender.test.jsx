// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { renderPage } from './entry-server.jsx';
import { canHydratePage } from './utils/prerender.js';
import { PUBLIC_ROUTES } from '../scripts/prepare-pages.mjs';
import { findProduct } from './data/products.js';
import { findCatalogProduct } from './data/catalogProducts.js';

describe('published page prerendering', () => {
  it.each(['/', '/fahint-electric-website/'])('prerenders complete workplace and hospitality pages and connects their entry points under %s', async base => {
    for (const [slug, name, title, models] of [
      ['workplace', 'Workplace', 'Across the office.', ['receptacles/rt20-c','usb-outlets/ftr15qc-dc65w','lighting-switches/ds15-3','dimmers/dm2010s','gfci/gt20','wallplates/bs1802']],
      ['hospitality', 'Hospitality', 'Made for your guests.', ['usb-outlets/ftr15c-3100','gfci/gt15','lighting-switches/ds15-3','dimmers/dm2010','smart-switches/usw8811','wallplates/bs1801']],
    ]) {
      expect(PUBLIC_ROUTES).toContain(`applications/${slug}`);
      const html = await renderPage(`/applications/${slug}`, base);
      expect(html).toMatch(new RegExp(`<h1[^>]*>${name}</h1>`));
      expect(html).not.toContain('Loading page…');
      expect(html).toContain(title);
      expect(html).toContain(`applications/${slug}-cutaway-${slug === 'hospitality' ? 'v3' : 'v2'}.webp`);
      expect(html).toContain(`id="${slug}-products"`);
      expect(html).toContain(`${name} application concept`);
      for (const model of models) expect(html).toContain(`href="${base}products/${model}"`);
      expect(html).toContain(`href="${base}contact?topic=technical&amp;application=${slug}"`);
      expect(await renderPage('/applications', base)).toContain(`href="${base}applications/${slug}"`);
    }
  });
  it.each(['/', '/fahint-electric-website/'])('renders the complete residential application and real model links under %s', async base => {
    expect(PUBLIC_ROUTES).toContain('applications/residential');
    const html = await renderPage('/applications/residential', base);
    expect(html).toMatch(/<h1[^>]*>Residential<\/h1>/);
    expect(html).not.toContain('Loading page…');
    for (const heading of ['What we offer.', 'Designed for home.', 'Recommended Products', 'Planning a residential project?']) expect(html).toContain(heading);
    expect(html).toContain(`${import.meta.env.BASE_URL}assets/images/brand-home/applications/residential-cutaway-v2.webp`);
    for (const model of ['gfci/gt15', 'usb-outlets/ftr15c-3100', 'lighting-switches/ds15', 'dimmers/dm2010', 'smart-switches/usw8811', 'wallplates/bs1801']) expect(html).toContain(`href="${base}products/${model}"`);
    expect(html).toContain(`href="${base}contact?topic=technical&amp;application=residential"`);
    expect(html).toContain(`href="${base}blog/outlet-planning-by-room"`);
  });
  it.each(['/', '/fahint-electric-website/'])('renders catalogue corrections while keeping commercial URLs under %s', async base => {
    const commercial = await renderPage('/products/receptacles/rt15q-c', base);
    expect(commercial).toContain('CT15Q');
    expect(commercial).toContain('Commercial Duplex Receptacle');
    expect(commercial).toContain('model=CT15Q');
    expect(commercial).toContain('products/receptacles/rt15q-c');
    expect(await renderPage('/products/receptacles/cr15', base)).toContain('15A · 125V/250V');
    const plate = await renderPage('/products/wallplates/bs1802', base);
    expect(plate).toContain('Product width</th><td>3.15 in (80 mm)');
    expect(plate).toContain('Product height</th><td>4.88 in (124 mm)');
    expect(plate).toContain('Thickness</th><td>0.26 in (6.5mm)');
  });
  it.each(['/', '/fahint-electric-website/'])('prerenders the receptacle guide and its entry points under %s', async base => {
    const path = 'blog/standard-receptacle-buying-guide';
    expect(PUBLIC_ROUTES).toContain(path);
    const html = await renderPage('/' + path, base);
    expect(html).toContain('FAHINT 125V receptacle comparison');
    expect(html).toContain('Receptacle quotation checklist');
    expect(html).toContain('E498095-20211123');
    expect(html).toContain('href="' + base + 'products/receptacles/r15q"');
    expect(html).toContain('href="' + base + 'resources?family=receptacles"');
    expect(html).toContain('href="' + base + 'contact?topic=technical"');
    expect(html).not.toContain('Loading page…');
    for (const entry of ['/products/receptacles', '/resources']) {
      expect(await renderPage(entry, base)).toContain(`href="${base}${path}"`);
    }
  });

  it.each(['/', '/fahint-electric-website/'])('includes model evidence and real PDF links in initial HTML under %s', async base => {
    vi.stubEnv('BASE_URL', base);
    try {
      const matched = await renderPage('/products/usb-outlets/ftr15c-3100', base);
      expect(matched).toContain('FTR15C-3100 is named in the supplied April 26, 2022 addendum (report E498095-20180426)');
      expect(matched).toContain(`href="${base}assets/documents/certificates/ul-usb.pdf"`);
      const missing = await renderPage('/products/usb-outlets/ftr15qc-ac65w', base);
      expect(missing).toContain('No matching certificate PDF for FTR15QC-AC65W');
      expect(missing).not.toContain('class="catalog-documentation__certificate"');
      expect(missing).not.toContain(`href="${base}assets/documents/certificates/ul-usb.pdf"`);
      expect(missing).toContain('Request model-specific documents');
    } finally { vi.unstubAllEnvs(); }
  });

  it('prerenders the light switch guide with base-safe model and purchasing links', async () => {
    expect(PUBLIC_ROUTES).toContain('blog/light-switch-buying-guide');
    const html = await renderPage('/blog/light-switch-buying-guide', '/fahint-electric-website/');
    expect(html).toContain('FAHINT lighting switch model comparison');
    expect(html).toContain('<table>');
    expect(html).toContain('15A, 120/277V AC');
    expect(html).toContain('15A, 125V AC');
    expect(html).toContain('Light switch quotation checklist');
    for (const model of ['ds15', 'ds15-3', 'ds1502', 'ds1503', 't15', 't15-3']) {
      expect(html).toContain(`href="/fahint-electric-website/products/lighting-switches/${model}"`);
    }
    expect(html).toContain('href="/fahint-electric-website/resources?family=lighting-switches"');
    expect(html).toContain('href="/fahint-electric-website/blog/dimmer-buying-guide-led-0-10v"');
    expect(html).toContain('href="/fahint-electric-website/blog/wallplate-buying-guide"');
    expect(html).not.toContain('Loading page…');
  });

  it('prerenders the wallplate guide with base-safe model, finish and document links', async () => {
    expect(PUBLIC_ROUTES).toContain('blog/wallplate-buying-guide');
    const html = await renderPage('/blog/wallplate-buying-guide', '/fahint-electric-website/');
    expect(html).toContain('FAHINT wallplate configuration comparison');
    expect(html).toContain('<table>');
    expect(html).toContain('80 × 124 mm');
    expect(html).toContain('Wallplate quotation checklist');
    for (const model of ['bs1801', 'bs1802', 'bs1804', 'bs1806', 'bs1807', 'bs18012', 'bs1803-g', 'bs1803-m']) {
      expect(html).toContain(`href="/fahint-electric-website/products/wallplates/${model}"`);
    }
    expect(html).toContain('href="/fahint-electric-website/resources?family=wallplates"');
    expect(html).toContain('href="/fahint-electric-website/blog/gfci-colour-finishes-specification"');
    expect(html).not.toContain('Loading page…');
  });

  it('prerenders the dimmer guide with base-safe model and document links', async () => {
    const html = await renderPage('/blog/dimmer-buying-guide-led-0-10v', '/fahint-electric-website/');
    expect(html).toContain('FAHINT dimmer model comparison');
    expect(html).toContain('<table>');
    expect(html).toContain('600VA');
    expect(html).toContain('Dimmer quotation checklist');
    expect(html).toContain('href="/fahint-electric-website/products/dimmers/dm2010"');
    expect(html).toContain('href="/fahint-electric-website/products/dimmers/dm2010s"');
    expect(html).toContain('href="/fahint-electric-website/resources?family=dimmers"');
    expect(html).not.toContain('Loading page…');
  });

  it('prerenders the USB guide and preserves base-safe model and filter links', async () => {
    const html = await renderPage('/blog/usb-wall-outlet-buying-guide', '/fahint-electric-website/');
    expect(html).toContain('FAHINT USB outlet shortlist');
    expect(html).toContain('<table>');
    expect(html).toContain('FTR15QC-DC65W');
    expect(html).toContain('href="/fahint-electric-website/products/usb-outlets?ports=a-c"');
    expect(html).toContain('href="/fahint-electric-website/products/usb-outlets/f4p"');
    expect(html).toContain('USB outlet quotation checklist');
    expect(html).not.toContain('Loading page…');
  });

  it.each(['/', '/fahint-electric-website/'])('waits for the actual lazy homepage with product and company links under %s', async (base) => {
    const html = await renderPage('/', base);
    expect(html).toContain('Safer Power.');
    expect(html).toContain('Better Living.');
    expect(html).toContain('Wenzhou Fahint Electric');
    expect(html).toContain(`href="${base}products/usb-outlets"`);
    expect(html).not.toContain('Loading page…');
    expect(html).not.toContain('data-motion="ready"');
    expect(html).toContain('class="hero"');
  });

  it.each([
    ['/products', 'connection.'],
    ['/products/gfci', 'GF15'],
    ['/products/usb-outlets', 'FTR15-3100'],
    ['/products/dimmers', 'DM2010'],
    ['/products/receptacles', 'CR15'],
    ['/products/smart-switches', 'USW8811'],
    ['/products/lighting-switches', 'DS15'],
    ['/products/wallplates', 'Wallplates'],
    ['/products/gfci/gf15', 'NEMA 5-15R'],
    ['/products/usb-outlets/ftr15-3100', '3.1A'],
    ['/resources', 'Product resources.'],
  ])('puts %s content in HTML without any browser globals', async (path, content) => {
    const html = await renderPage(path);
    expect(typeof window).toBe('undefined');
    expect(html).toMatch(/<main\b/);
    expect(html).toMatch(/<h1\b/);
    expect(html.includes(content), `${path} includes ${content}`).toBe(true);
    expect(html).not.toContain('Loading page…');
    expect(html).not.toContain('<!--$!-->');
  });

  it('keeps the deployment subpath on navigation, model and inquiry links', async () => {
    const html = await renderPage('/products/gfci/gf15', '/fahint-electric-website/');
    expect(html).toContain('href="/fahint-electric-website/products/gfci"');
    expect(html).toContain('href="/fahint-electric-website/products/gfci/gf20"');
    expect(html).toContain('href="/fahint-electric-website/contact?');
    expect(html).not.toContain('href="/products');
  });

  it('keeps identical markup when static hosting adds a trailing slash', async () => {
    const canonical = await renderPage('/products/gfci/gf15');
    const directory = await renderPage('/products/gfci/gf15/');
    expect(directory === canonical).toBe(true);
  });

  it('renders every published route with one real page heading', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      for (const route of PUBLIC_ROUTES) {
        const html = await renderPage(`/${route}`);
        expect(html.match(/<h1(?:\s|>)/g), route).toHaveLength(1);
        expect(html.match(/<nav class="rail" aria-label="Quick contact">/g), route).toHaveLength(1);
        const [, line, slug] = route.split('/');
        const product = route.startsWith('products/') && slug
          ? ((line === 'gfci' ? findProduct(slug) : null) || findCatalogProduct(line, slug)) : null;
        const rail = html.match(/<nav class="rail"[^>]*>(.*?)<\/nav>/s)?.[1];
        if (product) {
          const message = `Hi FAHINT, I'm interested in ${product.sku} (${product.name}). Could you share pricing and availability?`;
          expect(decodeURIComponent(rail).replaceAll('&#x27;', "'").replaceAll('&amp;', '&'), route).toContain(`?text=${message}`);
          expect(decodeURIComponent(rail), route).toContain(`subject=Inquiry about ${product.sku}&amp;body=`);
        } else {
          expect(rail, route).toContain('href="https://wa.me/8618857349189"');
          expect(rail, route).toContain('href="mailto:louis@fahint.com"');
        }
        expect(html, route).toContain('aria-label="Email louis@fahint.com"');
        expect(html.includes('Loading page…'), route).toBe(false);
        expect(html.includes('This page isn’t here.'), route).toBe(false);
        expect(errors.mock.calls.map(([message]) => message), route).toEqual([]);
      }
    } finally { errors.mockRestore(); }
    expect(PUBLIC_ROUTES).not.toContain('home-studio');
    expect(PUBLIC_ROUTES).not.toContain('products/gfci/flb20');
  }, 20000);

  it('renders a real not-found body instead of reusing the homepage', async () => {
    const html = await renderPage('/404');
    expect(html).toContain('This page isn’t here.');
    expect(html).toContain('Browse products');
    expect(html).not.toContain('Wiring devices.');
  });

  it('disables inquiry submission until JavaScript takes over, avoiding a native GET with customer details', async () => {
    const html = await renderPage('/contact');
    expect(/<button(?=[^>]*type="submit")(?=[^>]*disabled="")[^>]*>/.test(html)).toBe(true);
    expect(html).toContain('Enable JavaScript to use this form');
    expect(html).toContain('href="mailto:louis@fahint.com"');
  });

  it('renders USB parameters and drawing download links without React warnings', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const html = await renderPage('/products/usb-outlets/ftr15-3100');
      expect(errors.mock.calls.map(([message]) => message)).toEqual([]);
      expect(html).toContain('Technical Parameters');
      expect(html).toContain('Dimensions &amp; wiring reference');
      expect(html).not.toContain('class="catalog-drawings__grid"');
    } finally { errors.mockRestore(); }
  });
});

describe('client takeover of static HTML', () => {
  const root = { dataset: { prerenderPath: '/catalog/products/gfci' }, hasChildNodes: () => true };
  it('hydrates only a matching static path without URL selection state', () => {
    expect(canHydratePage(root, { pathname: '/catalog/products/gfci', search: '' })).toBe(true);
    expect(canHydratePage(root, { pathname: '/catalog/products/gfci', search: '?compare=GF15' })).toBe(false);
    expect(canHydratePage(root, { pathname: '/catalog/products/gfci/', search: '' })).toBe(true);
    expect(canHydratePage(root, { pathname: '/catalog/unknown', search: '' })).toBe(false);
    expect(canHydratePage({ dataset: {}, hasChildNodes: () => false }, { pathname: '/', search: '' })).toBe(false);
  });
});
