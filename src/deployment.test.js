import fs from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const workflow = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');
const scriptPath = join(process.cwd(), 'scripts', 'prepare-pages.mjs');
const temporaryRoots = [];

const loadPreparePages = async () => {
  expect(fs.existsSync(scriptPath), 'prepare-pages script should exist').toBe(true);
  return import('../scripts/prepare-pages.mjs');
};

const createDist = async (html) => {
  const root = await mkdtemp(join(tmpdir(), 'fahint-pages-'));
  const distDir = join(root, 'dist');
  temporaryRoots.push(root);
  await mkdir(distDir, { recursive: true });
  if (html !== undefined) await writeFile(join(distDir, 'index.html'), html + '<!-- page-meta:start --><title>Fixture</title><!-- page-meta:end -->');
  return distDir;
};

const createClientManifest = () => ({
  'index.html': { file: 'assets/main.js', imports: ['_vendor.js'], dynamicImports: ['src/pages/About.jsx'] },
  '_vendor.js': { file: 'assets/vendor.js' },
  '_shared.js': { file: 'assets/shared.js', imports: ['_vendor.js'] },
  '_not-needed.js': { file: 'assets/not-needed.js' },
  ...Object.fromEntries(['HomeStudio', 'ProductsStudio', 'GfciSeries', 'LineDetail', 'ProductDetail', 'Blog', 'BlogPost', 'About', 'Capabilities', 'Resources', 'Contact']
    .map(name => [`src/pages/${name}.jsx`, { file: `assets/${name}.js`, imports: ['_shared.js', '_vendor.js'], dynamicImports: ['_not-needed.js'] }])),
});

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('GitHub Pages deployment', () => {
  it.each(['/', '/fahint-electric-website/'])('preloads only the current page entry without competing shared or other route modules under %s', async expectedBase => {
    const { preparePages } = await loadPreparePages();
    const distDir = await createDist(`<!doctype html><html><head><base href="${expectedBase}"><link rel="modulepreload" crossorigin href="${expectedBase}assets/vendor.js"></head><body><div id="root"></div></body></html>`);
    await preparePages({ distDir, expectedBase, clientManifest: createClientManifest() });
    for (const [route, page] of [['', 'HomeStudio'], ['products', 'ProductsStudio'], ['products/gfci', 'GfciSeries'],
      ['products/usb-outlets', 'LineDetail'], ['products/usb-outlets/ftr15-3100', 'ProductDetail'], ['products/gfci/gf15', 'ProductDetail'],
      ['blog', 'Blog'], ['blog/gfci-vs-afci-whats-the-difference', 'BlogPost'], ['about', 'About'], ['capabilities', 'Capabilities'],
      ['resources', 'Resources'], ['contact', 'Contact']]) {
      const html = await readFile(join(distDir, route, 'index.html'), 'utf8');
      const document = new DOMParser().parseFromString(html, 'text/html');
      const links = [...document.head.querySelectorAll('link[rel="modulepreload"]')];
      expect(links.map(link => link.getAttribute('href')).sort(), route)
        .toEqual(['vendor', page].map(name => `${expectedBase}assets/${name}.js`).sort());
      expect(links.every(link => link.hasAttribute('crossorigin')), route).toBe(true);
      expect(links.filter(link => !link.href.endsWith('/vendor.js')).every(link => link.getAttribute('fetchpriority') === 'low'), route).toBe(true);
    }
    const fallback = await readFile(join(distDir, '404.html'), 'utf8');
    expect(fallback).not.toContain('assets/HomeStudio.js');
    expect(fallback).not.toContain('assets/shared.js');
  });

  it.each(['missing-page', 'missing-file', 'unsafe-path', 'missing-head'])('rejects a %s preload before writing route artifacts', async failure => {
    const { preparePages } = await loadPreparePages();
    const manifest = createClientManifest();
    if (failure === 'missing-page') delete manifest['src/pages/About.jsx'];
    if (failure === 'missing-file') delete manifest['src/pages/HomeStudio.jsx'].file;
    if (failure === 'unsafe-path') manifest['src/pages/HomeStudio.jsx'].file = 'assets/../server.js';
    const distDir = await createDist(failure === 'missing-head' ? '<base href="/">' : '<head><base href="/"></head>');
    const initial = await readFile(join(distDir, 'index.html'), 'utf8');
    await expect(preparePages({ distDir, expectedBase: '/', clientManifest: manifest })).rejects.toThrow(/module|manifest|head/i);
    expect(await readFile(join(distDir, 'index.html'), 'utf8')).toBe(initial);
    expect(fs.existsSync(join(distDir, '404.html'))).toBe(false);
    expect(fs.existsSync(join(distDir, 'products/index.html'))).toBe(false);
  });

  it('covers all published pages with unique metadata and real share images', async () => {
    const { PUBLIC_ROUTES } = await loadPreparePages();
    const { routeMetadata } = await import('../scripts/page-metadata.mjs');
    const { renderHeadEntries, headEntries } = await import('./seo/metadata.js');
    expect(new Set(routeMetadata.keys())).toEqual(new Set(['/', ...PUBLIC_ROUTES.map(route => `/${route}`)]));
    const metadata = [...routeMetadata.values()];
    expect(new Set(metadata.map(meta => meta.title)).size).toBe(metadata.length);
    expect(new Set(metadata.map(meta => meta.description)).size).toBe(metadata.length);
    for (const [path, meta] of routeMetadata) {
      expect(fs.existsSync(join('public', meta.image)), path).toBe(true);
      const html = renderHeadEntries(headEntries(meta, { path, publicUrl: 'https://preview.example/catalog/' }));
      const head = new DOMParser().parseFromString(`<html><head>${html}</head></html>`, 'text/html').head;
      expect(head.querySelectorAll('title'), path).toHaveLength(1);
      expect(head.querySelector('meta[name="description"]').content, path).toBe(meta.description);
      expect(head.querySelector('meta[property="og:image"]').content, path).toMatch(/^https:\/\/preview\.example\/catalog\//);
      const schema = head.querySelector('script[type="application/ld+json"]');
      if (schema) expect(() => JSON.parse(schema.textContent), path).not.toThrow();
    }
  });

  it('ships a sitemap for every published route without preview or draft pages', async () => {
    const { PUBLIC_ROUTES } = await loadPreparePages();
    const sitemap = await readFile('public/sitemap.xml', 'utf8');
    const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname.replace(/^\/|\/$/g, ''));
    expect(new Set(paths)).toEqual(new Set(['', ...PUBLIC_ROUTES]));
    expect(sitemap).not.toMatch(/home-studio|home-next|products-studio|flb20/);
  });
  it('runs tests before the build and prepares the artifact after the build', () => {
    const testStep = workflow.indexOf('- run: npm test');
    const buildStep = workflow.indexOf('- name: Build');
    const { scripts } = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    expect(testStep).toBeGreaterThan(-1);
    expect(buildStep).toBeGreaterThan(testStep);
    expect(scripts.build).toBe('vite build && node scripts/prepare-pages.mjs');
    expect(workflow).not.toContain('run: node scripts/prepare-pages.mjs');
    expect(workflow).toContain('CUSTOM_DOMAIN: ${{ vars.CUSTOM_DOMAIN }}');
    expect(workflow).not.toMatch(/run:\s*(?:echo|printf)[^\n]*CUSTOM_DOMAIN/i);
  });

  it('writes each rendered body with its own metadata and hydration path', async () => {
    const { preparePages, PUBLIC_ROUTES } = await loadPreparePages();
    const distDir = await createDist('<!doctype html><base href="/catalog/"><div id="root"></div><script type="module" src="/catalog/app.js"></script>');
    const rendered = [];
    await preparePages({ distDir, expectedBase: '/catalog/', renderPage: async (path, base) => {
      rendered.push([path, base]);
      return `<main id="main-content"><h1>${path}</h1><a href="${base}products">Products</a></main>`;
    } });
    expect(rendered.map(([path]) => path).sort()).toEqual(['/', ...PUBLIC_ROUTES.map(route => `/${route}`), '/404'].sort());
    expect(rendered.every(([, base]) => base === '/catalog/')).toBe(true);
    const html = await readFile(join(distDir, 'products/gfci/gf15/index.html'), 'utf8');
    expect(html).toContain('data-prerender-path="/catalog/products/gfci/gf15"');
    expect(html).toContain('<h1>/products/gfci/gf15</h1>');
    expect(html).toContain('<title>GF15');
    expect(html).toContain('src="/catalog/app.js"');
    const fallback = await readFile(join(distDir, '404.html'), 'utf8');
    expect(fallback).toContain('<h1>/404</h1>');
    expect(fallback).toContain('noindex');
  });

  it.each(['throw', 'empty', 'loading'])('stops before writing routes when rendering is %s', async (failure) => {
    const { preparePages } = await loadPreparePages();
    const distDir = await createDist('<!doctype html><base href="/"><div id="root"></div>');
    const initial = await readFile(join(distDir, 'index.html'), 'utf8');
    await expect(preparePages({ distDir, expectedBase: '/', renderPage: async path => {
      if (path === '/products/usb-outlets') {
        if (failure === 'throw') throw new Error('Render failed');
        return failure === 'empty' ? '' : '<main>Loading page…</main>';
      }
      return '<main><h1>Page</h1></main>';
    } })).rejects.toThrow(/render/i);
    expect(await readFile(join(distDir, 'index.html'), 'utf8')).toBe(initial);
    expect(fs.existsSync(join(distDir, 'products/index.html'))).toBe(false);
    expect(fs.existsSync(join(distDir, '404.html'))).toBe(false);
  });

  it('rejects a missing or already populated root rather than replacing unrelated markup', async () => {
    const { preparePages } = await loadPreparePages();
    const distDir = await createDist('<!doctype html><base href="/"><div id="root"><main>Previous build</main></div>');
    await expect(preparePages({ distDir, expectedBase: '/', renderPage: async () => '<main><h1>Page</h1></main>' }))
      .rejects.toThrow(/root/i);
  });

  it('does not clone a previously prerendered homepage over model pages on a second preparation', async () => {
    const { preparePages } = await loadPreparePages();
    const distDir = await createDist('<!doctype html><base href="/"><div id="root" data-prerender-path="/"><main><h1>Home</h1></main></div>');
    await expect(preparePages({ distDir, expectedBase: '/' })).rejects.toThrow(/fresh|already/i);
    expect(fs.existsSync(join(distDir, 'products/index.html'))).toBe(false);
  });

  it('gives the fallback noindex metadata and creates .nojekyll', async () => {
    const { preparePages } = await loadPreparePages();
    const html = '<!doctype html><base href="/fahint-electric-website/"><main>fixture</main>';
    const distDir = await createDist(html);

    await preparePages({ distDir, expectedBase: '/fahint-electric-website/' });

    const fallback = await readFile(join(distDir, '404.html'), 'utf8');
    expect(fallback).toContain('<main>fixture</main>');
    expect(fallback).toContain('noindex, follow');
    expect(fallback).toContain('Page not found | FAHINT');
    expect((await stat(join(distDir, '.nojekyll'))).isFile()).toBe(true);
  });

  it('materializes every public SPA route as a real Pages entry file', async () => {
    const { preparePages } = await loadPreparePages();
    const html = '<!doctype html><base href="/fahint-electric-website/"><main>fixture</main>';
    const distDir = await createDist(html);

    await preparePages({ distDir, expectedBase: '/fahint-electric-website/' });

    const publicRoutes = [
      'products',
      'products/gfci',
      'products/gfci/gf15',
      'products/gfci/gl20',
      'products/usb-outlets',
      'products/receptacles',
      'products/dimmers',
      'products/smart-switches',
      'products/lighting-switches',
      'products/wallplates',
      'blog',
      'capabilities',
      'about',
      'contact'
    ];

    for (const route of publicRoutes) {
      const entry = await readFile(join(distDir, route, 'index.html'), 'utf8');
      expect(entry).toContain('<main>fixture</main>');
      expect(entry).not.toContain('<title>Fixture</title>');
      expect(entry).toContain('name="description"');
    }
  });

  it('writes model-specific metadata into initial HTML without requiring JavaScript', async () => {
    const { preparePages } = await loadPreparePages();
    const distDir = await createDist('<!doctype html><base href="/fahint-electric-website/"><script type="module" src="/app.js"></script>');
    await preparePages({ distDir, expectedBase: '/fahint-electric-website/', publicUrl: 'https://preview.example/fahint-electric-website/', siteUrl: '' });
    const gfci = await readFile(join(distDir, 'products/gfci/gf15/index.html'), 'utf8');
    const usb = await readFile(join(distDir, 'products/usb-outlets/ftr15-3100/index.html'), 'utf8');
    expect(gfci).toContain('<title>GF15 15A Self-Test GFCI Receptacle | FAHINT</title>');
    expect(usb).toContain('FTR15-3100');
    expect(usb).not.toContain('<title>GF15');
    expect(gfci).toContain(new URL('assets/images/products/gf15-main.webp', 'https://preview.example/fahint-electric-website/').href);
    expect(gfci).toContain('application/ld+json');
    expect(gfci).toContain('<script type="module" src="/app.js"></script>');
    expect(gfci).not.toContain('rel="canonical"');
  });

  it('fails when index.html is missing', async () => {
    const { preparePages } = await loadPreparePages();
    const distDir = await createDist();

    await expect(preparePages({ distDir, expectedBase: '/fahint-electric-website/' }))
      .rejects.toThrow(/index\.html/i);
  });

  it('fails when index.html does not contain the expected repository base', async () => {
    const { preparePages } = await loadPreparePages();
    const distDir = await createDist('<!doctype html><base href="/wrong-base/">');

    await expect(preparePages({ distDir, expectedBase: '/fahint-electric-website/' }))
      .rejects.toThrow(/expected base.*fahint-electric-website/i);
  });

  it('writes a validated custom domain with Node rather than shell interpolation', async () => {
    const { preparePages } = await loadPreparePages();
    const distDir = await createDist('<!doctype html><base href="/fahint-electric-website/">');

    await preparePages({
      distDir,
      expectedBase: '/fahint-electric-website/',
      customDomain: 'www.fahint.com'
    });

    expect(await readFile(join(distDir, 'CNAME'), 'utf8')).toBe('www.fahint.com\n');
  });

  it('removes a stale CNAME when no custom domain is configured', async () => {
    const { preparePages } = await loadPreparePages();
    const distDir = await createDist('<!doctype html><base href="/fahint-electric-website/">');
    await writeFile(join(distDir, 'CNAME'), 'stale.example\n');

    await preparePages({ distDir, expectedBase: '/fahint-electric-website/', customDomain: '' });

    expect(fs.existsSync(join(distDir, 'CNAME'))).toBe(false);
  });

  it.each([
    '$(touch injected)',
    '`touch injected`',
    'evil.example\nsecond.example',
    'https://www.fahint.com',
    'www.fahint.com/path',
    'www.fahint.com:443'
  ])('rejects unsafe custom domain %j without creating CNAME', async (customDomain) => {
    const { preparePages } = await loadPreparePages();
    const distDir = await createDist('<!doctype html><base href="/fahint-electric-website/">');

    await expect(preparePages({
      distDir,
      expectedBase: '/fahint-electric-website/',
      customDomain
    })).rejects.toThrow(/custom domain/i);
    expect(fs.existsSync(join(distDir, 'CNAME'))).toBe(false);
  });

  it.each([
    '',
    '//evil.example/',
    'https://evil.example/',
    '/repo\\name/',
    '/repo/?query=1',
    '/repo/#hash',
    '/./',
    '/../',
    '/%2e%2e/',
    '/%E0%A4%A/'
  ])('rejects unsafe site base %j before preparing files', async (expectedBase) => {
    const { preparePages } = await loadPreparePages();
    const distDir = await createDist(`<!doctype html><base href="${expectedBase}">`);

    await expect(preparePages({ distDir, expectedBase })).rejects.toThrow(/expected base/i);
    expect(fs.existsSync(join(distDir, '404.html'))).toBe(false);
  });
});
