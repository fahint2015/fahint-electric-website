import { studioRanges } from './studioCatalog.js';

const gfciGroups = { standard: 'Standard', tr: 'Tamper-resistant', wr: 'Tamper & weather-resistant', blank: 'Blank face' };
export function productCategory(product) {
  return product.line === 'gfci' ? gfciGroups[product.category] || product.group : product.group;
}
export const productCategories = studioRanges.map(range => ({
  ...range,
  children: [...new Set(range.models.map(productCategory))].filter(Boolean)
}));
const sceneModels = { gfci: 'GF15', 'usb-outlets': 'FTR15C-3100', receptacles: 'DT15', dimmers: 'DM2010', 'smart-switches': 'UST8811', 'lighting-switches': 'DS15', wallplates: 'BS1807' };
export const categoryImages = Object.fromEntries(studioRanges.map(range => [range.slug, {
  src: `assets/images/brand-home/catalog-products/${range.slug}-product.webp`,
  alt: range.slug === 'wallplates' ? 'FAHINT BS1807 blank wallplate on a white background' : `FAHINT ${sceneModels[range.slug]} with its original cover plate on a white background`,
  width: 1536, height: 1024
}]));
