import { company } from '../../src/data/company.js';
import { buildInquiryBody, normalizeInquiry, validateInquiry } from '../../src/utils/inquiry.js';
import { resolveUsbInquiryItems } from '../../src/utils/inquiryList.js';

const SITE_ORIGIN = 'https://fahint.com';
const MAX_BODY_BYTES = 32_768;
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const FIELD_LIMITS = {
  name: 120, email: 254, company: 160, country: 80, model: 64, category: 80,
  quantity: 64, finish: 80, topic: 80, source: 512, message: 5000
};
const json = status => new Response(JSON.stringify({ ok: status === 200 }), {
  status, headers: {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    ...(status === 405 ? { Allow: 'POST' } : {})
  }
});

async function readPayload(request) {
  if (Number(request.headers.get('Content-Length')) > MAX_BODY_BYTES) return json(413);
  if (!request.body) return json(400);
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) { await reader.cancel(); return json(413); }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } catch { return json(400); }
  finally { reader.releaseLock(); }
}

function validPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false;
  for (const [key, limit] of Object.entries(FIELD_LIMITS)) {
    if (payload[key] === undefined) continue;
    if (typeof payload[key] !== 'string' || payload[key].length > limit) return false;
    if (key !== 'message' && /[\u0000-\u001f\u007f]/.test(payload[key])) return false;
  }
  if (typeof payload.requestId !== 'string' || !UUID.test(payload.requestId)) return false;
  if (typeof payload.turnstileToken !== 'string' || !payload.turnstileToken.trim() || payload.turnstileToken.length > 2048) return false;
  if (payload.items !== undefined) {
    if (!Array.isArray(payload.items) || payload.items.length > 3) return false;
    for (const item of payload.items) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
      for (const key of ['model', 'quantity', 'finishSlug']) {
        if (item[key] !== undefined && (typeof item[key] !== 'string' || item[key].length > 64)) return false;
      }
    }
    if (resolveUsbInquiryItems(payload.items).length !== payload.items.length) return false;
  }
  return Object.keys(validateInquiry(payload)).length === 0;
}

async function fetchJson(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal, redirect: 'error' });
    return { response, data: await response.json() };
  } finally { clearTimeout(timeout); }
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return json(405);
  if (request.headers.get('Origin') !== SITE_ORIGIN) return json(403);
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return json(415);
  if (!env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY || typeof env.INQUIRY_FROM !== 'string'
    || !env.INQUIRY_FROM.trim() || /[\r\n]/.test(env.INQUIRY_FROM)) return json(503);

  const payload = await readPayload(request);
  if (payload instanceof Response) return payload;
  if (!validPayload(payload)) return json(400);

  try {
    const verificationBody = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: payload.turnstileToken });
    const ip = request.headers.get('CF-Connecting-IP');
    if (ip) verificationBody.set('remoteip', ip);
    const verification = await fetchJson('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body: verificationBody
    }, 3_000);
    if (!verification.response.ok) return json(502);
    if (verification.data?.success !== true || verification.data.hostname !== 'fahint.com'
      || verification.data.action !== 'inquiry') return json(403);

    const values = normalizeInquiry(payload);
    const sent = await fetchJson('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json',
        'Idempotency-Key': `fahint-inquiry/${payload.requestId}`
      },
      body: JSON.stringify({
        from: env.INQUIRY_FROM, to: [company.email], reply_to: values.email,
        subject: `FAHINT inquiry from ${values.company || values.name}`,
        text: buildInquiryBody(values)
      })
    }, 7_000);
    if (sent.response.status === 429) return json(429);
    if (!sent.response.ok || typeof sent.data?.id !== 'string' || !sent.data.id) return json(502);
    // This confirms provider acceptance; mailbox delivery is checked separately.
    return json(200);
  } catch { return json(502); }
}
