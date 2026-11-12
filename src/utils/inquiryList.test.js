import { describe, expect, it } from 'vitest';
import { parseInquiryItems, resolveInquiryItems, serializeInquiryItems, inquiryListHref, validInquiryQuantity } from './inquiryList.js';

describe('Outlet inquiry items', () => {
  it('uses known supported models, preserving order, deduplicating and limiting to three', () => {
    const items = resolveInquiryItems([
      { model: 'DM2010S' }, { model: 'unknown' }, { model: ' ftr15-3100 ', finishSlug: 'black', source: 'https://evil.example' },
      { model: 'FTR15-3100', quantity: '99' }, { model: 'FTR15C-3100' }, { model: 'F4P' }, { model: 'FTR20-3100' }
    ]);
    expect(items.map(item => item.model)).toEqual(['FTR15-3100', 'FTR15C-3100', 'F4P']);
    expect(items[0]).toEqual({ model: 'FTR15-3100', category: 'USB Outlets', finish: 'Black', finishSlug: 'black',
      source: '/products/usb-outlets/ftr15-3100', quantity: '' });
    expect(items[1].finish).toBe('Not specified');
  });

  it('round trips only selection fields, not customer data, untrusted labels or links', () => {
    const input = [{ model: 'FTR15-3100', quantity: '1200', finishSlug: 'grey', email: 'private@example.com', finish: 'Invented', source: 'https://evil.example' },
      { model: 'FTR20QC-DC65W', quantity: '', finishSlug: 'unknown' }];
    const href = inquiryListHref(input, 'technical');
    const params = new URL(href, 'https://example.com').searchParams;
    expect(params.get('topic')).toBe('technical');
    expect(params.get('items')).toBe(serializeInquiryItems(input));
    expect(parseInquiryItems(params.get('items'))).toEqual(resolveInquiryItems(input));
    expect(parseInquiryItems(params.get('items'))[1].finishSlug).toBe('');
    expect(href).not.toMatch(/private|Invented|evil/);
    expect(inquiryListHref([], 'invalid')).toBe('/contact');
  });

  it.each([
    [['gf15', 'GF20', 'GTN15', 'GTN20'], 'GFCI Outlets', '/products/gfci/gf15'],
    [['r15', 'R15Q', 'D15', 'R20'], 'Standard Receptacles', '/products/receptacles/r15']
  ])('restores a canonical, limited inquiry list for %s', (models, category, source) => {
    const input = models.map(model => ({ model, quantity: '500', finishSlug: 'black', category: 'Forged', source: 'https://evil.example' }));
    const href = inquiryListHref(input);
    const items = parseInquiryItems(new URL(href, 'https://example.com').searchParams.get('items'));
    expect(items.map(item => item.model)).toEqual(models.slice(0, 3).map(model => model.toUpperCase()));
    expect(items[0]).toMatchObject({ category, source, quantity: '500', finish: 'Black', finishSlug: 'black' });
    expect(href).not.toMatch(/Forged|evil/);
  });

  it('keeps a single product category per list and excludes unsupported families', () => {
    expect(resolveInquiryItems([{ model: 'GF15' }, { model: 'R15' }, { model: 'FTR15-3100' }, { model: 'DM2010S' }])
      .map(item => item.model)).toEqual(['GF15']);
  });

  it.each([null, '', 'broken', '{}', '[null,123,{}]', 'x'.repeat(1025)])('discards malformed or oversized URL input: %s', value => {
    expect(parseInquiryItems(value)).toEqual([]);
  });

  it('ignores non-string fields without crashing and does not silently repair an invalid quantity', () => {
    expect(resolveInquiryItems(null)).toEqual([]);
    expect(resolveInquiryItems([null, {}, { model: {} }])).toEqual([]);
    const items = parseInquiryItems(JSON.stringify([['FTR15-3100', '1.5', {}]]));
    expect(items[0]).toMatchObject({ quantity: '1.5', finish: 'Not specified', finishSlug: '' });
    expect(validInquiryQuantity(items[0].quantity)).toBe(false);
  });

  it.each(['', '1', '5000', '9999999'])('accepts optional whole-piece quantities: %s', value => {
    expect(validInquiryQuantity(value)).toBe(true);
  });
  it.each(['0', '-1', '1.5', '1e3', '5,000', '10000000', '005', '100\nInjected'])('rejects ambiguous or invalid quantities: %s', value => {
    expect(validInquiryQuantity(value)).toBe(false);
  });
});
