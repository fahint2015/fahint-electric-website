import { isVerifiedListing, colors } from '../data/products.js';

export function productSpecificationRows(product) {
  const verified = isVerifiedListing(product);
  const configuration = product.nema === 'Blank face' ? product.nema : `NEMA ${product.nema}`;
  const faceDimensions = [product.dimensions?.face, product.dimensions?.width].filter(Boolean).join(' × ');
  const certification = verified
    ? `UL/cUL listed · file ${product.listing.file}`
    : 'Documentation review required';

  if (Array.isArray(product.technicalSpecifications) && product.technicalSpecifications.length > 0) {
    return [
      ['Item code', product.sku],
      ['Rating', product.rating],
      ['Certification', certification],
      ...product.technicalSpecifications,
      ['Face dimensions', faceDimensions],
      ['Body depth', product.dimensions?.depth]
    ].filter(([, value]) => value);
  }

  return [
    ['Item code', product.sku],
    ['Rating', product.rating],
    ['NEMA configuration', configuration],
    ['Variant', product.feature],
    ['Application grade', product.grade],
    ['Standard', verified ? 'UL 943' : null],
    ['Certification', certification],
    ['Face dimensions', faceDimensions],
    ['Body depth', product.dimensions?.depth]
  ].filter(([, value]) => value);
}

const SPECIFICATION_GROUPS = [
  {
    title: 'Electrical performance',
    labels: ['Amperage', 'Rated voltage', 'Working voltage', 'Trip level', 'Operating temperature']
  },
  {
    title: 'Installation & configuration',
    labels: ['NEMA configuration', 'Wiring method', 'Wire gauge', 'Pole & wire', 'Grounding', 'Face dimensions', 'Body depth']
  },
  {
    title: 'Compliance & application',
    labels: ['Item code', 'Certification', 'Standard', 'Application grade', 'Tamper-resistant', 'Weather-resistant', 'Usage']
  }
];

function selectRows(rows, labels) {
  const rowMap = new Map(rows);
  return labels.map((label) => [label, rowMap.get(label)]).filter(([, value]) => value);
}

export function productSpecificationGroups(product) {
  if (Array.isArray(product.specificationGroups)) return product.specificationGroups;
  const rows = productSpecificationRows(product);

  if (!Array.isArray(product.technicalSpecifications) || product.technicalSpecifications.length === 0) {
    return [{ title: 'Product information', rows }];
  }

  return [
    ...SPECIFICATION_GROUPS.map((group) => ({
      title: group.title,
      rows: selectRows(rows, group.labels)
    })),
    { title: 'Materials & construction', rows: product.construction?.materials || [] },
    { title: 'Quality & durability', rows: product.construction?.performance || [] }
  ].filter((group) => group.rows.length > 0);
}

export function productSpecificationSummaryRows(product) {
  if (Array.isArray(product.specificationSummary)) return product.specificationSummary;
  const rows = new Map(productSpecificationRows(product));
  return [
    ['Rating', product.rating],
    ['Configuration', rows.get('NEMA configuration')],
    ['Trip level', rows.get('Trip level')],
    ['Wiring', rows.get('Wiring method')],
    ['Certification', rows.get('Certification')]
  ].filter(([, value]) => value);
}

// All rows come from the normalized model data; the presentation adds no ratings.
export function conciseSpecificationRows(product) {
  const rows = productSpecificationGroups(product).flatMap(group => group.rows);
  const seen = new Set(['model', 'item code', 'factory inspection', 'patent protection']);
  const finishes = product.finishes || colors.filter(finish => product.assets.finishes?.[finish.slug]);
  return [['Model', product.sku], ...(finishes.length ? [['Available finishes', finishes.map(f => f.name).join(' / ')]] : []),
    ...rows.filter(([label, value]) => {
      if (!value || seen.has(label.toLowerCase())) return false;
      seen.add(label.toLowerCase()); return true;
    })];
}
