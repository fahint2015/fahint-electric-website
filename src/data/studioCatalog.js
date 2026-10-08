import { productLines } from './lines.js';
import { colors, products } from './products.js';
import { findCatalogAliasMatch, getCatalogProducts, modelKey, productHref } from './catalogProducts.js';

// Presentation only. Model facts, finishes and photographs remain in the verified catalogues.
const selections = {
  gfci: ['GF15', 'GT20'],
  'usb-outlets': ['FTR15C-3100', 'FTR15QC-DC65W'],
  receptacles: ['R15', 'DT15'],
  dimmers: ['DM2010', 'DM2010S'],
  'smart-switches': ['USW8811', 'USW8821'],
  'lighting-switches': ['DS15', 'T15'],
  wallplates: ['BS1801', 'BS18032-M']
};

export const studioRanges = productLines.map((line) => {
  const models = [
    ...(line.slug === 'gfci' ? products.map((p) => ({ ...p, line: 'gfci',
      href: `/products/gfci/${p.sku.toLowerCase()}`,
      finishes: colors.filter((c) => p.assets.finishes[c.slug]),
      keyFacts: [['Rating', p.rating], ['Configuration', `NEMA ${p.nema}`], ['Variant', p.feature]]
    })) : []),
    ...getCatalogProducts(line.slug).map((p) => ({ ...p, href: productHref(p) }))
  ];
  return { ...line, models, featured: selections[line.slug].map((sku) => models.find((p) => p.sku === sku)).filter(Boolean) };
});

export const studioModels = studioRanges.flatMap((range) => range.models);

export function searchStudioModels(query, family = 'all') {
  const terms = query.trim().split(/\s+/).map(modelKey).filter(Boolean);
  const alias = findCatalogAliasMatch(query);
  return studioRanges.filter((r) => family === 'all' || r.slug === family).flatMap((range) => range.models.filter((p) => {
    if (alias) return p.line === alias.line && p.sku === alias.sku;
    const text = modelKey([p.sku, p.sourceModel, p.name, p.summary, range.name, ...p.keyFacts.flat()].join(' '));
    return terms.every((term) => text.includes(term));
  }));
}
