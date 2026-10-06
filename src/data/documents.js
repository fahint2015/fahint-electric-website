export const catalogueDocument = 'assets/documents/fahint-product-catalog.pdf';

export function resourcesHref(product) {
  return `/resources?${new URLSearchParams({ family: product.line || 'gfci', model: product.sku })}`;
}
