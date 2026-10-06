import { getCatalogProducts } from './catalogProducts.js';
import { usbFilters, usbFilterValues } from './usbFilters.js';
import { usbDimensionReference } from './usbDimensions.js';

const models = getCatalogProducts('usb-outlets');
const missing = 'Not published — please confirm';
const portNames = new Map(usbFilters.find(filter => filter.name === 'ports').options);

export function resolveUsbComparison(value = '') {
  const skus = [...new Set(value.split(',').map(sku => sku.trim().toUpperCase()))];
  return skus.map(sku => models.find(product => product.sku === sku)).filter(Boolean).slice(0, 3);
}

function comparisonFacts(product) {
  const facts = new Map(product.specificationGroups.flatMap(group => group.rows));
  const { ports, rating, charging } = usbFilterValues(product);
  const dimensions = usbDimensionReference(product);
  const pd = charging.startsWith('pd-');
  const receptacle = facts.get('Receptacle rating')?.replace(/\s*,\s*|\s*·\s*/g, ' · ').replace(/V\s+NEMA/, 'V · NEMA');
  const dimension = key => dimensions?.[key] ? `${dimensions[key]} mm` : missing;
  return [
    ['USB ports', portNames.get(ports) || missing],
    ['Receptacle rating', rating === 'usb-only' ? `No AC receptacle · ${facts.get('Input rating')} input` : receptacle || missing],
    ['Charging type', pd ? 'USB Power Delivery' : charging ? 'Conventional 5V' : missing],
    ['Combined USB output', pd ? 'Confirm dual-port power sharing' : charging ? `5V DC · ${charging.slice(3)}A` : missing],
    ['USB-C PD maximum', pd ? `Up to ${charging.slice(3).toUpperCase()} per USB-C port` : 'Not applicable (non-PD)'],
    ['Wiring method', facts.get('Wiring method') || missing],
    ['Device width', dimension('width')],
    ['Overall height', dimension('overallHeight')],
    ['Device depth', dimension('depth')],
  ];
}

export function usbComparisonRows(products) {
  const facts = products.map(comparisonFacts);
  return (facts[0] || []).map(([label], index) => {
    const values = facts.map(rows => rows[index][1]);
    return { label, values, different: new Set(values).size > 1 };
  });
}
