import { products as gfciProducts } from './products.js';
import { getCatalogProducts } from './catalogProducts.js';
import { usbComparisonRows } from './usbComparison.js';
import { conciseSpecificationRows } from '../utils/productSpecifications.js';

export function resolveModelComparison(line, value = '') {
  const models = line === 'gfci'
    ? [...gfciProducts.map(product => ({ ...product, line, slug: product.sku.toLowerCase() })), ...getCatalogProducts(line)]
    : getCatalogProducts(line);
  const skus = [...new Set(String(value).split(',').map(sku => sku.trim().toUpperCase()))];
  return skus.map(sku => models.find(product => product.sku === sku)).filter(product => product && !product.draft).slice(0, 3);
}

export function modelComparisonRows(products, line) {
  if (line === 'usb-outlets') return usbComparisonRows(products);
  const facts = products.map(product => new Map(conciseSpecificationRows(product).filter(([label]) => label !== 'Model')));
  const labels = [...new Set(facts.flatMap(rows => [...rows.keys()]))];
  return labels.map(label => {
    const values = facts.map(rows => String(rows.get(label) ?? 'Not published — please confirm'));
    return { label, values, different: new Set(values).size > 1 };
  });
}
