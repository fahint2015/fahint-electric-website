import { posts } from '../src/data/posts.js';
import { products } from '../src/data/products.js';
import { catalogProducts } from '../src/data/catalogProducts.js';
import { findLine, productLines } from '../src/data/lines.js';
import { articleMetadata, familyMetadata, headEntries, productMetadata, renderHeadEntries, staticMetadata } from '../src/seo/metadata.js';

export const routeMetadata = new Map([
  ...Object.entries(staticMetadata),
  ...productLines.map(line => [`/products/${line.slug}`, familyMetadata(line)]),
  ...[...products, ...catalogProducts.filter(product => !product.draft)].map(product => {
    const meta = productMetadata(product, findLine(product.line || 'gfci'));
    return [meta.path, meta];
  }),
  ...posts.map(post => [`/blog/${post.slug}`, articleMetadata(post)]),
]);

export function pageHtml(html, metadata, options) {
  const region = /<!-- page-meta:start -->[\s\S]*?<!-- page-meta:end -->/;
  if (!region.test(html)) throw new Error('Cannot write page metadata: index.html is missing the page-meta head region.');
  return html.replace(region, () => `<!-- page-meta:start -->\n    ${renderHeadEntries(headEntries(metadata, options))}\n    <!-- page-meta:end -->`);
}
