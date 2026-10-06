import { getCatalogProducts } from '../data/catalogProducts.js';
import { resolveInquiryContext } from './inquiryContext.js';

const usbModels = new Set(getCatalogProducts('usb-outlets').map(product => product.sku));
const text = value => typeof value === 'string' ? value.trim() : '';

export const validInquiryQuantity = value => value === '' || /^[1-9]\d{0,6}$/.test(value);

export function resolveUsbInquiryItems(items) {
  if (!Array.isArray(items)) return [];
  const resolved = [];
  const seen = new Set();
  for (const item of items) {
    const model = text(item?.model).toUpperCase();
    if (!usbModels.has(model) || seen.has(model)) continue;
    seen.add(model);
    resolved.push({ ...resolveInquiryContext(model, text(item.finishSlug)), quantity: text(item.quantity).slice(0, 24) });
    if (resolved.length === 3) break;
  }
  return resolved;
}

export function parseUsbInquiryItems(value) {
  if (typeof value !== 'string' || value.length > 1024) return [];
  try {
    const tuples = JSON.parse(value);
    if (!Array.isArray(tuples)) return [];
    return resolveUsbInquiryItems(tuples.filter(Array.isArray).map(([model, quantity, finishSlug]) => ({ model, quantity, finishSlug })));
  } catch { return []; }
}

export function serializeUsbInquiryItems(items) {
  const tuples = resolveUsbInquiryItems(items).map(item => [item.model, item.quantity, item.finishSlug]);
  return tuples.length ? JSON.stringify(tuples) : '';
}

export function usbInquiryHref(items, topic = 'products') {
  const params = new URLSearchParams();
  if (['products', 'oem', 'technical'].includes(topic)) params.set('topic', topic);
  const value = serializeUsbInquiryItems(items);
  if (value) params.set('items', value);
  return `/contact${params.size ? `?${params}` : ''}`;
}
