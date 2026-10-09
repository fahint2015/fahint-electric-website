import { company } from '../data/company.js';
import { resolveUsbInquiryItems, validInquiryQuantity } from './inquiryList.js';

export const EMPTY_INQUIRY = {
  name: '', email: '', company: '', country: '', model: '', category: '', quantity: '', message: ''
};
const clean = value => String(value ?? '').trim();
const EMAIL_PATTERN = /^[^\s<>(),;:"\\@]+@[^\s<>(),;:"\\@]+\.[^\s<>(),;:"\\@]+$/;

export function normalizeInquiry(form) {
  const fields = Object.keys(EMPTY_INQUIRY).filter(key => key !== 'category'
    && !(key === 'model' && Object.hasOwn(form, 'category') && !clean(form.model)));
  for (const key of ['category', 'finish', 'topic', 'source']) {
    if (Object.hasOwn(form, key)) fields.push(key);
  }
  const values = Object.fromEntries(fields.map(key => [key, clean(form[key])]));
  const items = resolveUsbInquiryItems(form.items);
  if (items.length) {
    values.items = items;
    values.category = 'USB Outlets';
    for (const key of ['model', 'finish', 'source', 'quantity']) delete values[key];
  }
  return values;
}

export function buildInquiryBody(form) {
  const values = normalizeInquiry(form);
  return [
    `Name: ${values.name}`, `Email: ${values.email}`, `Company: ${values.company}`, `Country: ${values.country}`,
    ...(Object.hasOwn(values, 'category') ? [`Product category: ${values.category || 'Not specified'}`] : []),
    ...(Object.hasOwn(values, 'model') ? [`Model of interest: ${values.model || 'Not specified'}`] : []),
    ...(Object.hasOwn(values, 'finish') ? [`Finish: ${values.finish || 'Not specified'}`] : []),
    ...(values.topic ? [`Inquiry type: ${values.topic}`] : []),
    ...(values.source ? [`Product page: ${values.source}`] : []),
    ...(values.items ? [
      '', `Inquiry list (${values.items.length} ${values.items.length === 1 ? 'model' : 'models'}):`,
      ...values.items.map((item, index) => `${index + 1}. ${item.model}\nQuantity: ${item.quantity ? `${item.quantity} pcs` : 'Not specified'}\nFinish: ${item.finish}\nProduct page: ${item.source}`)
    ] : [`Estimated quantity: ${values.quantity || 'Not specified'}`]),
    '', 'Requirements:', values.message
  ].join('\n');
}

export function validateInquiry(form) {
  const errors = {};
  if (!clean(form.name)) errors.name = 'Enter your name.';
  if (!EMAIL_PATTERN.test(clean(form.email))) errors.email = 'Enter a valid business email.';
  if (!clean(form.message)) errors.message = 'Describe the product or project you need.';
  if (resolveUsbInquiryItems(form.items).some(item => !validInquiryQuantity(item.quantity))) errors.items = 'Check each model quantity.';
  return errors;
}

export function buildMailtoUrl(form) {
  const values = normalizeInquiry(form);
  const sender = values.company || values.name || 'website visitor';
  const subject = encodeURIComponent(`Product inquiry from ${sender}`);
  return `mailto:${company.email}?subject=${subject}&body=${encodeURIComponent(buildInquiryBody(values))}`;
}

export function buildInquiryText(form) {
  return `To: ${company.email}\n\n${buildInquiryBody(form)}`;
}
