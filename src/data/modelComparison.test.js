import { describe, expect, it } from 'vitest';
import { productLines } from './lines.js';
import { getCatalogProducts } from './catalogProducts.js';
import { modelComparisonRows, resolveModelComparison } from './modelComparison.js';
import { usbComparisonRows } from './usbComparison.js';

describe('Category model comparison', () => {
  it.each(productLines.map(line => [line.slug]))('resolves only published models in %s and keeps the first three valid distinct choices', line => {
    const models = line === 'gfci'
      ? resolveModelComparison(line, 'GF15,GF20,GT15,GT20')
      : getCatalogProducts(line).slice(0, 4);
    const expected = models.slice(0, 3);
    const query = ['invalid', models[0].sku.toLowerCase(), models[0].sku, ...models.slice(1).map(model => model.sku)].join(',');
    expect(resolveModelComparison(line, query).map(model => model.sku)).toEqual(expected.map(model => model.sku));
    expect(resolveModelComparison(line, 'unknown,<script>,https://example.invalid')).toEqual([]);
    const rows = modelComparisonRows(expected, line);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every(row => row.values.length === expected.length)).toBe(true);
  });

  it('uses the existing USB facts and output cautions', () => {
    const models = resolveModelComparison('usb-outlets', 'FTR15-3100,FTR20QC-DC65W');
    expect(modelComparisonRows(models, 'usb-outlets')).toEqual(usbComparisonRows(models));
  });

  it('compares actual receptacle terminals and distinguishes missing published details', () => {
    const models = resolveModelComparison('receptacles', 'R15,R15Q');
    expect(modelComparisonRows(models, 'receptacles').find(row => row.label === 'Wiring method'))
      .toMatchObject({ values: ['Side Wire / Back Wire', 'Side Wire / Push-In Quick Wire'], different: true });
    const rows = modelComparisonRows([{ ...models[0], specificationGroups: [] }, models[1]], 'receptacles');
    expect(rows.find(row => row.label === 'Wiring method').values[0]).toBe('Not published — please confirm');
  });

  it('preserves GFCI certification distinctions and canonical model paths', () => {
    const models = resolveModelComparison('gfci', 'GF15,GL20,GTN20,DM2010');
    expect(models.map(model => model.slug)).toEqual(['gf15', 'gl20', 'gtn20']);
    const rows = modelComparisonRows(models, 'gfci');
    const certification = rows.find(row => row.label === 'Certification');
    expect(certification.values[0]).toMatch(/E504391/);
    expect(certification.values[1]).toMatch(/review/i);
    expect(certification.different).toBe(true);
  });
});
