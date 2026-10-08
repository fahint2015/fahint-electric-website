// Millimeter values transcribed from each model's original drawing, not from
// photograph scale. A changed/unreviewed source must not inherit these dimensions.
const profiles = {
  conventional: { width: 43.5, overallHeight: 103.3, depth: 44.7, plateWidth: 70, plateHeight: 115 },
  range4200: { width: 43.5, bodyHeight: 69, depth: 44.7, boxDepth: 37.5, mountingPitch: 83.5, tabPitch: 23.8, faceWidth: 33.1, faceHeight: 66.5,
    scope: 'Shared non-65W dimensional reference supplied in the 4200mA product folder.' },
  fourPort: { width: 43.5, overallHeight: 103.3, depth: 41.1, plateWidth: 70, plateHeight: 115 },
  pd: { width: 43.5, bodyHeight: 69, depth: 44.7, mountingPitch: 83.5, tabPitch: 23.8, faceWidth: 33.1, faceHeight: 66.5 },
  pd65: { width: 43.5, bodyHeight: 69, overallHeight: 103.8, depth: 47, boxDepth: 39.8, mountingPitch: 83.5, tabPitch: 23.8 }
};

const sources = {
  ...Object.fromEntries(['FTR15-4200', 'FTR15C-4200', 'FTR15DC-4200', 'FTR20-4200', 'FTR20C-4200', 'FTR20DC-4200']
    .map(sku => [sku, ['2ffcc303e8934622', 'range4200']])),
  'F4P': ['1a6c5d181e1183f1', 'fourPort'],
  'FTR15-3100': ['fcb256f01acf3f42', 'conventional'],
  'FTR15-3600': ['258e96bbf8f5fe4b', 'conventional'],
  'FTR15-5000': ['4559895cde8901d0', 'conventional'],
  'FTR15C-3100': ['d7ab306bc75dc29f', 'conventional'],
  'FTR15C-3600': ['9152f3ce053dc1d8', 'conventional'],
  'FTR15C-5000': ['70bf684d63ad23ff', 'conventional'],
  'FTR15DC-3100': ['3e836e2e5dcbb379', 'conventional'],
  'FTR15DC-3600': ['b1503abaa7263f92', 'conventional'],
  'FTR15DC-5000': ['b74ac38a8da486f0', 'conventional'],
  'FTR20-3100': ['65d47de55181c3ea', 'conventional'],
  'FTR20-3600': ['fc7b5a052d985bf2', 'conventional'],
  'FTR20-5000': ['3e3874ea25b9af3a', 'conventional'],
  'FTR20C-3100': ['e248f16a0234a28c', 'conventional'],
  'FTR20C-3600': ['c8bcb722cd96608e', 'conventional'],
  'FTR20C-5000': ['a5c7ad724a63dcaa', 'conventional'],
  'FTR20DC-3100': ['679f584217faeabb', 'conventional'],
  'FTR20DC-3600': ['8ba4dfe70aff3321', 'conventional'],
  'FTR20DC-5000': ['b19067f1b9a625e4', 'conventional'],
  'FTR15QC-AC20W': ['191d780e4c5bae4b', 'pd'],
  'FTR15QC-AC36W': ['3b7c07dd83d2bf4f', 'pd'],
  'FTR15QC-AC65W': ['b5d85fff01a75312', 'pd65'],
  'FTR15QC-DC20W': ['603e1dbf4edad50a', 'pd'],
  'FTR15QC-DC36W': ['acdd392d54c3c758', 'pd'],
  'FTR15QC-DC65W': ['00b69585246ac863', 'pd65'],
  'FTR20QC-AC20W': ['4618fe2e568f15f6', 'pd'],
  'FTR20QC-AC36W': ['26d5694300b0ea09', 'pd'],
  'FTR20QC-AC65W': ['c1c25e5b0cbbf6aa', 'pd65'],
  'FTR20QC-DC20W': ['a19692e8db943de4', 'pd'],
  'FTR20QC-DC36W': ['77aa0407f1a2e1fe', 'pd'],
  'FTR20QC-DC65W': ['46d5d0ae84a7b6b1', 'pd65']
};

export function usbDimensionReference(product) {
  if (product.line !== 'usb-outlets') return null;
  const [id, profile] = sources[product.sku] || [];
  const source = product.assets.drawings.find((drawing) => drawing.src === `assets/images/catalog/models/${id}.webp`);
  return source ? { ...profiles[profile], source: source.src } : null;
}
