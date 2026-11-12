import { resolveInquiryContext } from './inquiryContext.js';

const inquiryCategories = ['GFCI Outlets', 'USB Outlets', 'Standard Receptacles'];
const text = value => typeof value === 'string' ? value.trim() : '';

export const validInquiryQuantity = value => value === '' || /^[1-9]\d{0,6}$/.test(value);

export function resolveInquiryItems(items) {
  if (!Array.isArray(items)) return [];
  const resolved = [];
  const seen = new Set();
  for (const item of items) {
    const context = resolveInquiryContext(text(item?.model).toUpperCase(), text(item?.finishSlug));
    if (!context || !inquiryCategories.includes(context.category) || seen.has(context.model)
      || (resolved.length && context.category !== resolved[0].category)) continue;
    seen.add(context.model);
    resolved.push({ ...context, quantity: text(item.quantity).slice(0, 24) });
    if (resolved.length === 3) break;
  }
  return resolved;
}

export function parseInquiryItems(value) {
  if (typeof value !== 'string' || value.length > 1024) return [];
  try {
    const tuples = JSON.parse(value);
    if (!Array.isArray(tuples)) return [];
    return resolveInquiryItems(tuples.filter(Array.isArray).map(([model, quantity, finishSlug]) => ({ model, quantity, finishSlug })));
  } catch { return []; }
}

export function serializeInquiryItems(items) {
  const tuples = resolveInquiryItems(items).map(item => [item.model, item.quantity, item.finishSlug]);
  return tuples.length ? JSON.stringify(tuples) : '';
}

export function inquiryListHref(items, topic = 'products') {
  const params = new URLSearchParams();
  if (['products', 'oem', 'technical'].includes(topic)) params.set('topic', topic);
  const value = serializeInquiryItems(items);
  if (value) params.set('items', value);
  return `/contact${params.size ? `?${params}` : ''}`;
}
