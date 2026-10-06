import { describe, expect, it } from 'vitest';
import { inquiryContactHref, resolveInquiryContext } from './inquiryContext.js';

describe('validated inquiry context', () => {
  it('keeps the published SKU, category, explicit finish and product path', () => {
    expect(resolveInquiryContext('gf15', 'black')).toEqual({
      model: 'GF15', category: 'GFCI Outlets', finish: 'Black',
      finishSlug: 'black', source: '/products/gfci/gf15'
    });
    expect(resolveInquiryContext('FTR15C-3100', 'almond')).toMatchObject({
      model: 'FTR15C-3100', category: 'USB Outlets', finish: 'Light Almond',
      source: '/products/usb-outlets/ftr15c-3100'
    });
  });

  it.each(['', 'unknown', 'FLB20', '<script>alert(1)</script>'])('ignores unpublished product %s', model => {
    expect(resolveInquiryContext(model, 'white')).toBeNull();
  });

  it.each(['', 'invalid', 'gold'])('does not infer a finish for GF15 from %s', finish => {
    expect(resolveInquiryContext('GF15', finish)).toMatchObject({ finish: 'Not specified', finishSlug: '' });
  });

  it('builds a Contact URL with only canonical context and a supported topic', () => {
    expect(inquiryContactHref(resolveInquiryContext('FTR15C-3100', 'black'), 'technical'))
      .toBe('/contact?topic=technical&model=FTR15C-3100&finish=black');
    expect(inquiryContactHref(resolveInquiryContext('GF15'), 'unknown')).toBe('/contact?model=GF15');
    expect(inquiryContactHref(null)).toBe('/contact');
  });
});
