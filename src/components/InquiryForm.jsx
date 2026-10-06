import { useEffect, useId, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { company } from '../data/company.js';
import { products } from '../data/products.js';
import { resolveInquiryContext } from '../utils/inquiryContext.js';
import { resolveUsbInquiryItems, serializeUsbInquiryItems, validInquiryQuantity } from '../utils/inquiryList.js';
import InquiryList from './InquiryList.jsx';
import './inquiry-context.css';

const EMPTY = {
  name: '',
  email: '',
  company: '',
  country: '',
  model: '',
  category: '',
  quantity: '',
  message: ''
};

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const SUCCESS_MESSAGE = 'Your email app should now be open with the inquiry pre-filled.';
const MINIMUM_HANDOFF_LOCK_MS = 1_500;
const MAX_MAILTO_URL_LENGTH = 1_800;
const REQUEST_TIMEOUT_MS = 12_000;

const clean = (value) => String(value ?? '').trim();
const normalizeInquiry = (form) => {
  const fields = Object.keys(EMPTY).filter(key => key !== 'category'
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
};

const buildInquiryBody = (form) => {
  const values = normalizeInquiry(form);

  return [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Company: ${values.company}`,
    `Country: ${values.country}`,
    ...(Object.hasOwn(values, 'category') ? [`Product category: ${values.category || 'Not specified'}`] : []),
    ...(Object.hasOwn(values, 'model') ? [`Model of interest: ${values.model || 'Not specified'}`] : []),
    ...(Object.hasOwn(values, 'finish') ? [`Finish: ${values.finish || 'Not specified'}`] : []),
    ...(values.topic ? [`Inquiry type: ${values.topic}`] : []),
    ...(values.source ? [`Product page: ${values.source}`] : []),
    ...(values.items ? [
      '', `Inquiry list (${values.items.length} ${values.items.length === 1 ? 'model' : 'models'}):`,
      ...values.items.map((item, index) => `${index + 1}. ${item.model}\nQuantity: ${item.quantity ? `${item.quantity} pcs` : 'Not specified'}\nFinish: ${item.finish}\nProduct page: ${item.source}`)
    ] : [`Estimated quantity: ${values.quantity || 'Not specified'}`]),
    '',
    'Requirements:',
    values.message
  ].join('\n');
};

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
  const body = encodeURIComponent(buildInquiryBody(values));

  return `mailto:${company.email}?subject=${subject}&body=${body}`;
}

export function buildInquiryText(form) {
  return `To: ${company.email}\n\n${buildInquiryBody(form)}`;
}

const defaultDelivery = (url) => window.location.assign(url);
const defaultRequest = (...args) => fetch(...args);
const secureEndpoint = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
};
const defaultClipboardWriter = (text) => {
  if (!navigator.clipboard?.writeText) return Promise.reject(new Error('Clipboard unavailable'));
  return navigator.clipboard.writeText(text);
};

export default function InquiryForm({
  defaultModel = '',
  defaultCategory = '',
  productContext = null,
  inquiryItems = [],
  onItemsChange,
  topic = 'Product inquiry',
  onClearProduct,
  onModelChange,
  title = 'Send a message',
  modelOptions = products,
  categoryOptions = null,
  delivery = defaultDelivery,
  endpoint = import.meta.env.VITE_INQUIRY_ENDPOINT || '',
  request = defaultRequest,
  clipboardWriter = defaultClipboardWriter
}) {
  const submissionEndpoint = secureEndpoint(endpoint);
  const [form, setForm] = useState({ ...EMPTY, model: defaultModel, category: defaultCategory });
  const items = form.category === 'USB Outlets' ? resolveUsbInquiryItems(inquiryItems) : [];
  const itemsKey = serializeUsbInquiryItems(items);
  const context = items.length ? null : categoryOptions
    ? (productContext?.category === form.category ? productContext : null)
    : resolveInquiryContext(form.model, productContext?.model === form.model ? productContext.finishSlug : '');
  const { model, category, ...details } = form;
  const inquiry = { ...details, ...(categoryOptions ? { category } : { model }), ...context, topic, ...(items.length ? { items } : {}) };
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const formRef = useRef(null);
  const removedItemRef = useRef(false);
  const inFlightRef = useRef(false);
  const copyInFlightRef = useRef(false);
  const cooldownRef = useRef(null);
  const requestControllerRef = useRef(null);
  const mountedRef = useRef(true);
  const modelVersionRef = useRef(0);
  const idPrefix = useId();
  const ids = {
    name: `${idPrefix}-name`,
    nameError: `${idPrefix}-name-error`,
    email: `${idPrefix}-email`,
    emailError: `${idPrefix}-email-error`,
    company: `${idPrefix}-company`,
    country: `${idPrefix}-country`,
    model: `${idPrefix}-model`,
    quantity: `${idPrefix}-quantity`,
    message: `${idPrefix}-message`,
    messageError: `${idPrefix}-message-error`
  };

  useEffect(() => {
    modelVersionRef.current += 1;
    setForm((current) => ({ ...current, model: defaultModel }));
    setErrors({});
    setStatus('');
    setCopyStatus('');
  }, [defaultModel]);

  useEffect(() => {
    if (defaultCategory) setForm(current => ({ ...current, category: defaultCategory }));
  }, [defaultCategory]);

  useEffect(() => {
    modelVersionRef.current += 1;
    setStatus('');
    setCopyStatus('');
    if (removedItemRef.current) {
      removedItemRef.current = false;
      (formRef.current?.querySelector('[data-inquiry-quantity]') || formRef.current?.querySelector('select'))?.focus({ preventScroll: true });
    }
    setErrors(current => {
      const { items: _itemError, ...remaining } = current;
      return remaining;
    });
  }, [context?.model, context?.finishSlug, topic, itemsKey]);

  useEffect(() => {
    mountedRef.current = true;
    setInteractive(true);

    return () => {
      mountedRef.current = false;
      requestControllerRef.current?.abort();
      if (cooldownRef.current) {
        window.clearTimeout(cooldownRef.current.id);
        cooldownRef.current.resolve();
        cooldownRef.current = null;
      }
    };
  }, []);

  const update = (key) => (event) => {
    // Pending delivery/copy feedback belongs to the draft that started it.
    modelVersionRef.current += 1;
    const nextValue = event.target.value;
    const nextErrors = validateInquiry({ ...form, [key]: nextValue });

    setForm((current) => ({ ...current, [key]: nextValue }));
    if (key === 'model') onModelChange?.(nextValue);
    if (key === 'category' && productContext && nextValue !== productContext.category) onClearProduct?.();
    if (key === 'category' && items.length && nextValue !== 'USB Outlets') onItemsChange?.([]);
    setErrors((currentErrors) => {
      if (!currentErrors[key]) return currentErrors;
      if (nextErrors[key]) return { ...currentErrors, [key]: nextErrors[key] };

      const { [key]: _clearedError, ...remainingErrors } = currentErrors;
      return remainingErrors;
    });
    setStatus('');
    setCopyStatus('');
  };

  const copyInquiryDetails = async () => {
    if (copyInFlightRef.current) return;
    if (items.some(item => !validInquiryQuantity(item.quantity))) {
      setErrors(current => ({ ...current, items: 'Check each model quantity.' }));
      formRef.current?.querySelector('[data-inquiry-quantity][aria-invalid="true"]')?.focus();
      return;
    }

    const modelVersion = modelVersionRef.current;
    copyInFlightRef.current = true;
    setIsCopying(true);
    setCopyStatus('');

    try {
      await clipboardWriter(buildInquiryText(inquiry));
      if (mountedRef.current && modelVersionRef.current === modelVersion) setCopyStatus('copied');
    } catch {
      if (mountedRef.current && modelVersionRef.current === modelVersion) setCopyStatus('copy-failure');
    } finally {
      copyInFlightRef.current = false;
      if (mountedRef.current) setIsCopying(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (inFlightRef.current) return;

    const nextErrors = validateInquiry(inquiry);
    setErrors(nextErrors);
    setStatus('');
    setCopyStatus('');

    if (Object.keys(nextErrors).length > 0) {
      requestAnimationFrame(() => {
        formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    const mailtoUrl = buildMailtoUrl(inquiry);
    if (!submissionEndpoint && mailtoUrl.length > MAX_MAILTO_URL_LENGTH) {
      setStatus('too-long');
      return;
    }

    inFlightRef.current = true;
    setIsSubmitting(true);
    const handoffStartedAt = Date.now();
    const modelVersion = modelVersionRef.current;
    let requestTimeout;

    try {
      if (submissionEndpoint) {
        const controller = new AbortController();
        requestControllerRef.current = controller;
        requestTimeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        const response = await request(submissionEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(normalizeInquiry(inquiry)),
          signal: controller.signal,
          credentials: 'omit',
          redirect: 'error'
        });
        if (!response.ok) throw new Error('Delivery failed');
        const receipt = await response.json();
        if (receipt.ok !== true && receipt.success !== true) throw new Error('Delivery not confirmed');
      } else {
        await delivery(mailtoUrl);
      }
      if (mountedRef.current && modelVersionRef.current === modelVersion) setStatus(submissionEndpoint ? 'received' : 'success');
    } catch {
      if (mountedRef.current && modelVersionRef.current === modelVersion) setStatus(submissionEndpoint ? 'delivery-failure' : 'failure');
    } finally {
      window.clearTimeout(requestTimeout);
      requestControllerRef.current = null;
      const remainingLockMs = Math.max(0, MINIMUM_HANDOFF_LOCK_MS - (Date.now() - handoffStartedAt));
      if (remainingLockMs > 0 && mountedRef.current) {
        await new Promise((resolve) => {
          const id = window.setTimeout(() => {
            cooldownRef.current = null;
            resolve();
          }, remainingLockMs);
          cooldownRef.current = { id, resolve };
        });
      }
      inFlightRef.current = false;
      if (mountedRef.current) setIsSubmitting(false);
    }
  };

  const validationProps = (key, errorId) => ({
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? errorId : undefined
  });

  return (
    <form ref={formRef} className="form-card" noValidate onSubmit={submit} aria-busy={isSubmitting}>
      {title && <h3 className="form-card__title">{title}</h3>}

      {Object.keys(errors).length > 0 && (
        <div className="alert alert--error" role="alert">
          Please correct the highlighted fields.
        </div>
      )}
      {status === 'success' && (
        <div className="alert alert--ok" role="status">
          {SUCCESS_MESSAGE}
        </div>
      )}
      {status === 'received' && (
        <div className="alert alert--ok" role="status">Your inquiry has been received. We will reply to the email address you provided.</div>
      )}
      {status === 'delivery-failure' && (
        <div className="alert alert--error" role="alert">
          We could not confirm delivery. Your details are still here. Retry or <a href={`mailto:${company.email}`}>email us directly</a>.
        </div>
      )}
      {status === 'failure' && (
        <div className="alert alert--error" role="alert">
          We could not open your email app. <a href={`mailto:${company.email}`}>Email us directly</a> or try again.
        </div>
      )}
      {status === 'too-long' && (
        <div className="alert alert--error" role="alert">
          This inquiry is too long to open reliably in an email app. Copy the inquiry details instead.
        </div>
      )}
      {!items.length && ['success', 'failure', 'too-long', 'delivery-failure'].includes(status) && (
        <div className="form-card__recovery">
          <p>
            {status === 'delivery-failure' ? 'You can copy the inquiry details and send them to ' : 'If it did not open, copy the inquiry details and send them to '}<strong>{company.email}</strong>.
          </p>
          <button type="button" className="btn btn--ghost" onClick={copyInquiryDetails} disabled={isCopying}>
            {isCopying ? 'Copying…' : 'Copy inquiry details'}
          </button>
        </div>
      )}
      {copyStatus === 'copied' && (
        <p className="form-card__copy-status form-card__copy-status--ok" role="status">
          Inquiry details copied.
        </p>
      )}
      {copyStatus === 'copy-failure' && (
        <p className="form-card__copy-status form-card__copy-status--error" role="alert">
          We could not copy the inquiry details. Please copy them manually.
        </p>
      )}

      <div className="field-row">
        <div className="field">
          <label htmlFor={ids.name}>Your name *</label>
          <input
            id={ids.name}
            name="name"
            autoComplete="name"
            required
            value={form.name}
            onChange={update('name')}
            placeholder="John Miller"
            {...validationProps('name', ids.nameError)}
          />
          {errors.name && (
            <p className="field__error" id={ids.nameError}>
              {errors.name}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor={ids.email}>Business email *</label>
          <input
            id={ids.email}
            name="email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            required
            value={form.email}
            onChange={update('email')}
            placeholder="john@company.com"
            {...validationProps('email', ids.emailError)}
          />
          {errors.email && (
            <p className="field__error" id={ids.emailError}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor={ids.company}>Company</label>
          <input
            id={ids.company}
            name="company"
            autoComplete="organization"
            value={form.company}
            onChange={update('company')}
            placeholder="Company name"
          />
        </div>
        <div className="field">
          <label htmlFor={ids.country}>Country / region</label>
          <input
            id={ids.country}
            name="country"
            autoComplete="country-name"
            value={form.country}
            onChange={update('country')}
            placeholder="United States"
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor={ids.model}>{categoryOptions ? 'Product category' : 'Model of interest'}</label>
          <select id={ids.model} name={categoryOptions ? 'category' : 'model'} value={categoryOptions ? form.category : form.model} onChange={update(categoryOptions ? 'category' : 'model')}>
            <option value="">{categoryOptions ? 'Select a product category' : 'Select a model'}</option>
            {categoryOptions ? categoryOptions.map((category) => (
              <option key={category.slug} value={category.name}>{category.name}</option>
            )) : <>
              {form.model && form.model !== 'Mixed / multiple' && !modelOptions.some((product) => product.sku === form.model) && (
                <option value={form.model}>{form.model}</option>
              )}
              {modelOptions.map((product) => (
                <option key={product.sku} value={product.sku}>
                  {product.sku} — {product.name}
                </option>
              ))}
              <option value="Mixed / multiple">Mixed / multiple models</option>
            </>}
          </select>
        </div>
        {!items.length && <div className="field">
          <label htmlFor={ids.quantity}>Estimated quantity</label>
          <input
            id={ids.quantity}
            name="quantity"
            value={form.quantity}
            onChange={update('quantity')}
            placeholder="e.g. 5,000 pcs"
          />
        </div>}
      </div>

      {items.length > 0 && <InquiryList items={items} onChange={next => {
        removedItemRef.current = next.length < items.length;
        onItemsChange?.(next);
      }} />}

      {context && <div className="inquiry-product-context" role="group" aria-label="Selected product">
        <div aria-live="polite" aria-atomic="true">
          <span className="inquiry-product-context__label">Selected product</span>
          <p><strong>{context.model}</strong><span> · Finish: {context.finish}</span></p>
        </div>
        {onClearProduct && <button type="button" onClick={() => {
          onClearProduct();
          formRef.current?.querySelector('select')?.focus({ preventScroll: true });
        }} aria-label="Clear selected product">Clear</button>}
      </div>}

      <div className="field">
        <label htmlFor={ids.message}>Requirements *</label>
        <textarea
          id={ids.message}
          name="message"
          required
          value={form.message}
          onChange={update('message')}
          placeholder="Tell us about colors, packaging, private label, certification or delivery requirements."
          {...validationProps('message', ids.messageError)}
        />
        {errors.message && (
          <p className="field__error" id={ids.messageError}>
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="btn btn--primary"
        style={{ width: '100%', justifyContent: 'center' }}
        disabled={!interactive || isSubmitting}
      >
        {isSubmitting ? (submissionEndpoint ? 'Sending inquiry…' : 'Opening email app…') : (submissionEndpoint ? 'Send inquiry' : 'Open email app')} <Send size={16} aria-hidden="true" />
      </button>

      <noscript className="form-note">Enable JavaScript to use this form, or contact us using the email and WhatsApp links below.</noscript>

      {items.length > 0 && <button type="button" className="btn btn--ghost inquiry-list__copy" onClick={copyInquiryDetails} disabled={isCopying}>
        {isCopying ? 'Copying…' : 'Copy inquiry details'}
      </button>}

      <p className="form-note">
        {submissionEndpoint
          ? 'Your details will be sent to our inquiry service so we can respond to your request. '
          : 'This opens your email app with your inquiry filled in. You can review and send the message from there. '}
        You can also <a href={`mailto:${company.email}`}>email us directly</a> or <a href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}`}>use WhatsApp</a>.
      </p>
    </form>
  );
}
