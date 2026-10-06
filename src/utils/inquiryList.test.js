import { describe, expect, it } from 'vitest';
import { parseUsbInquiryItems, resolveUsbInquiryItems, serializeUsbInquiryItems, usbInquiryHref, validInquiryQuantity } from './inquiryList.js';

describe('USB inquiry items', () => {
  it('uses only known USB models, preserving order, deduplicating and limiting to three', () => {
    const items = resolveUsbInquiryItems([
      { model: 'GF15' }, { model: 'unknown' }, { model: ' ftr15-3100 ', finishSlug: 'black', source: 'https://evil.example' },
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
    const href = usbInquiryHref(input, 'technical');
    const params = new URL(href, 'https://example.com').searchParams;
    expect(params.get('topic')).toBe('technical');
    expect(params.get('items')).toBe(serializeUsbInquiryItems(input));
    expect(parseUsbInquiryItems(params.get('items'))).toEqual(resolveUsbInquiryItems(input));
    expect(parseUsbInquiryItems(params.get('items'))[1].finishSlug).toBe('');
    expect(href).not.toMatch(/private|Invented|evil/);
    expect(usbInquiryHref([], 'invalid')).toBe('/contact');
  });

  it.each([null, '', 'broken', '{}', '[null,123,{}]', 'x'.repeat(1025)])('discards malformed or oversized URL input: %s', value => {
    expect(parseUsbInquiryItems(value)).toEqual([]);
  });

  it('ignores non-string fields without crashing and does not silently repair an invalid quantity', () => {
    expect(resolveUsbInquiryItems(null)).toEqual([]);
    expect(resolveUsbInquiryItems([null, {}, { model: {} }])).toEqual([]);
    const items = parseUsbInquiryItems(JSON.stringify([['FTR15-3100', '1.5', {}]]));
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
