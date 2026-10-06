import { colors, findProduct } from '../data/products.js';
import { catalogProducts, modelKey, productHref } from '../data/catalogProducts.js';
import { findLine } from '../data/lines.js';

export function resolveInquiryContext(model, finishSlug = '') {
  const product = findProduct(model) || catalogProducts.find(candidate =>
    !candidate.draft && modelKey(candidate.sku) === modelKey(model));
  if (!product || product.draft) return null;

  const finish = (product.finishes ?? colors).find(item => item.slug === finishSlug);
  return {
    model: product.sku,
    category: findLine(product.line || 'gfci').name,
    finish: finish?.name || 'Not specified',
    finishSlug: finish?.slug || '',
    source: product.line ? productHref(product) : `/products/gfci/${product.sku.toLowerCase()}`
  };
}

export function inquiryContactHref(context, topic) {
  const params = new URLSearchParams();
  if (['products', 'oem', 'technical'].includes(topic)) params.set('topic', topic);
  if (context) {
    params.set('model', context.model);
    if (context.finishSlug) params.set('finish', context.finishSlug);
  }
  return `/contact${params.size ? `?${params}` : ''}`;
}
