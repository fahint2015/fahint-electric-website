import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { posts } from '../src/data/posts.js';
import { products } from '../src/data/products.js';
import { catalogProducts, productHref } from '../src/data/catalogProducts.js';
import { pageHtml, routeMetadata } from './page-metadata.mjs';
import { escapeHtml, notFoundMetadata, validateSiteUrl } from '../src/seo/metadata.js';

const STATIC_ROUTES = [
  'products',
  'products/gfci',
  'products/usb-outlets',
  'products/receptacles',
  'products/dimmers',
  'products/smart-switches',
  'products/lighting-switches',
  'products/wallplates',
  'blog',
  'capabilities',
  'about',
  'resources',
  'contact'
];

export const PUBLIC_ROUTES = [
  ...STATIC_ROUTES,
  ...products.map((product) => `products/gfci/${product.sku.toLowerCase()}`),
  ...catalogProducts.filter((product) => !product.draft).map((product) => productHref(product).slice(1)),
  ...posts.map((post) => `blog/${post.slug}`)
];

function withPageModules(html, path, manifest, base) {
  if (!manifest || path === '/404') return html;
  if (!html.includes('</head>')) throw new Error('Cannot preload page modules: missing head closing tag.');
  const [, section, family, model] = path.split('/');
  const page = section === 'products'
    ? model ? 'ProductDetail' : family === 'gfci' ? 'GfciSeries' : family ? 'LineDetail' : 'ProductsStudio'
    : section === 'blog' ? family ? 'BlogPost' : 'Blog'
      : { '': 'HomeStudio', about: 'About', capabilities: 'Capabilities', resources: 'Resources', contact: 'Contact' }[section];
  if (!page) throw new Error(`Missing page module mapping for ${path}.`);

  const entry = `src/pages/${page}.jsx`;
  const file = manifest[entry]?.file;
  if (!file) throw new Error(`Missing page module in client manifest: ${entry}.`);
  if (!/^assets\/[A-Za-z0-9_./-]+\.js$/.test(file) || file.split('/').includes('..')) {
    throw new Error(`Unsafe module asset in client manifest: ${file}.`);
  }
  // Preloading the dependency tree competed with the hero image in cold mobile tests.
  // Only hint the current page entry; let Vite load its dependencies when needed.
  const tag = `<link rel="modulepreload" crossorigin fetchpriority="low" href="${escapeHtml(base + file)}">`;
  return html.replace('</head>', () => `${tag}\n</head>`);
}

function validateExpectedBase(expectedBase) {
  if (typeof expectedBase !== 'string' || expectedBase.length === 0) {
    throw new Error('Unsafe expected base: a non-empty pathname is required.');
  }

  let decodedBase;
  try {
    decodedBase = decodeURIComponent(expectedBase);
  } catch {
    throw new Error(`Unsafe expected base "${expectedBase}": invalid percent encoding.`);
  }

  const isInvalidPathname = (value) => (
    !value.startsWith('/')
    || value.startsWith('//')
    || !value.endsWith('/')
    || /[\\?#\s\u0000-\u001f\u007f]/.test(value)
  );

  if (isInvalidPathname(expectedBase) || isInvalidPathname(decodedBase)) {
    throw new Error(`Unsafe expected base "${expectedBase}": use an internal pathname with one leading slash and a trailing slash.`);
  }

  const segments = decodedBase.slice(1, -1).split('/');
  if (decodedBase !== '/' && segments.some((segment) => !segment || segment === '.' || segment === '..')) {
    throw new Error(`Unsafe expected base "${expectedBase}": empty, dot and parent-directory segments are not allowed.`);
  }

  return expectedBase;
}

function validateCustomDomain(customDomain) {
  if (customDomain === undefined || customDomain === null || customDomain === '') return '';
  if (typeof customDomain !== 'string' || customDomain.length > 253 || /\s/.test(customDomain)) {
    throw new Error('Unsafe custom domain: provide a hostname of 1-253 ASCII characters.');
  }

  const labels = customDomain.split('.');
  const validLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
  if (labels.some((label) => !validLabel.test(label))) {
    throw new Error(`Unsafe custom domain "${customDomain}": schemes, ports, paths and shell syntax are not allowed.`);
  }

  return customDomain.toLowerCase();
}

export async function preparePages({
  distDir = 'dist',
  expectedBase = process.env.SITE_BASE,
  customDomain = process.env.CUSTOM_DOMAIN,
  siteUrl = process.env.VITE_SITE_URL || '',
  publicUrl,
  renderPage,
  clientManifest
} = {}) {
  const validatedBase = validateExpectedBase(expectedBase);
  const validatedDomain = validateCustomDomain(customDomain);
  const canonicalBase = validateSiteUrl(siteUrl);
  const actualPublicUrl = validateSiteUrl(publicUrl ?? (canonicalBase || (validatedDomain
    ? `https://${validatedDomain}${validatedBase}`
    : process.env.GITHUB_REPOSITORY ? `https://${process.env.GITHUB_REPOSITORY.split('/')[0]}.github.io${validatedBase}` : '')));

  const outputDir = resolve(distDir);
  const indexPath = join(outputDir, 'index.html');
  let indexHtml;

  try {
    indexHtml = await readFile(indexPath, 'utf8');
  } catch (error) {
    throw new Error(`Cannot prepare Pages artifact: index.html is missing at ${indexPath}.`, { cause: error });
  }

  const actualBase = indexHtml.match(/<base\s+href=["']([^"']+)["']/i)?.[1];
  if (actualBase !== validatedBase) {
    throw new Error(`Cannot prepare Pages artifact: expected base "${validatedBase}", found "${actualBase || 'none'}".`);
  }
  if (indexHtml.includes('data-prerender-path=')) {
    throw new Error('Pages are already prerendered. Run npm run build to prepare a fresh artifact.');
  }

  const metadataOptions = { siteUrl: canonicalBase, publicUrl: actualPublicUrl };
  // Prepare all heads before writing: a missing route or malformed template must fail the build.
  const preparedRoutes = ['', ...PUBLIC_ROUTES].map(route => {
    const path = `/${route}`;
    const metadata = routeMetadata.get(path);
    if (!metadata) throw new Error(`Missing page metadata for ${path}`);
    return [route, withPageModules(pageHtml(indexHtml, metadata, { ...metadataOptions, path }), path, clientManifest, validatedBase)];
  });
  let fallback = pageHtml(indexHtml, notFoundMetadata, { ...metadataOptions, path: '/404' });
  if (renderPage) {
    const root = '<div id="root"></div>';
    if (!indexHtml.includes(root)) throw new Error('Cannot prerender: expected an empty root in the fresh Vite build.');
    const withBody = async (html, path) => {
      const body = await renderPage(path, validatedBase);
      if (typeof body !== 'string' || !/<main\b/.test(body) || !/<h1\b/.test(body) || body.includes('<!--$!-->')) {
        throw new Error(`Incomplete prerender for ${path}.`);
      }
      const pathname = escapeHtml(`${validatedBase.slice(0, -1)}${path}`);
      return html.replace(root, () => `<div id="root" data-prerender-path="${pathname}">${body}</div>`);
    };
    // Finish every render before writing any routes, including the noindex fallback.
    for (const entry of preparedRoutes) entry[1] = await withBody(entry[1], `/${entry[0]}`);
    fallback = await withBody(fallback, '/404');
  }
  await writeFile(join(outputDir, '404.html'), fallback);
  await Promise.all(preparedRoutes.map(async ([route, html]) => {
    const routeDir = join(outputDir, ...route.split('/'));
    await mkdir(routeDir, { recursive: true });
    await writeFile(join(routeDir, 'index.html'), html);
  }));
  await writeFile(join(outputDir, '.nojekyll'), '');

  const cnamePath = join(outputDir, 'CNAME');
  if (validatedDomain) {
    await writeFile(cnamePath, `${validatedDomain}\n`, 'utf8');
  } else {
    await rm(cnamePath, { force: true });
  }
}

const isDirectRun = process.argv[1]
  && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectRun) {
  const { loadEnv } = await import('vite');
  const expectedBase = process.env.SITE_BASE || '/';
  const { VITE_SITE_URL: siteUrl } = loadEnv('production', process.cwd(), 'VITE_');
  import('./build-page-renderer.mjs')
    .then(async ({ buildPageRenderer }) => preparePages({
      expectedBase,
      siteUrl,
      clientManifest: JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8')),
      renderPage: await buildPageRenderer(expectedBase)
    }))
    .then(() => console.log(`Prerendered ${PUBLIC_ROUTES.length + 1} published pages and the 404 fallback.`))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
