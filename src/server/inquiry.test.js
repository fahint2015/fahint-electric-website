// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { onRequest } from './inquiry.js';

const env = {
  RESEND_API_KEY: 'test-server-secret',
  INQUIRY_FROM: 'FAHINT Website <inquiries@notify.fahint.com>',
  TURNSTILE_SECRET_KEY: 'test-verification-secret'
};
const inquiry = {
  name: 'Avery Chen', email: 'avery@example.com', company: 'Northstar',
  country: 'Canada', model: 'GF15', quantity: '5,000 pcs',
  message: 'Please quote private-label packaging.',
  requestId: '1b8c1e42-467c-4a74-87f9-a4c63e51a2d6', turnstileToken: 'human-token'
};
const requestFor = (body = inquiry, options = {}) => new Request('https://fahint.com/api/inquiry', {
  method: 'POST', headers: { Origin: 'https://fahint.com', 'Content-Type': 'application/json' },
  body: JSON.stringify(body), ...options
});
const verified = { success: true, hostname: 'fahint.com', action: 'inquiry' };

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

describe('Cloudflare inquiry email', () => {
  it('forwards a verified inquiry to the fixed business inbox with the customer as reply-to', async () => {
    const fetcher = vi.fn(async url => url.includes('siteverify')
      ? Response.json(verified) : Response.json({ id: 'accepted-email-id' }));
    vi.stubGlobal('fetch', fetcher);
    const response = await onRequest({ request: requestFor({ ...inquiry, to: 'attacker@example.com' }), env });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    const [url, options] = fetcher.mock.calls.find(([url]) => url === 'https://api.resend.com/emails');
    expect(url).toBe('https://api.resend.com/emails');
    expect(options.headers.Authorization).toBe('Bearer test-server-secret');
    expect(options.headers['Idempotency-Key']).toBe(`fahint-inquiry/${inquiry.requestId}`);
    expect(JSON.parse(options.body)).toMatchObject({
      from: env.INQUIRY_FROM, to: ['louis@fahint.com'], reply_to: inquiry.email,
      subject: 'FAHINT inquiry from Northstar'
    });
    expect(JSON.parse(options.body).text).toContain('Estimated quantity: 5,000 pcs');
    expect(JSON.parse(options.body).text).toContain(inquiry.message);
  });

  it.each(['RESEND_API_KEY', 'INQUIRY_FROM', 'TURNSTILE_SECRET_KEY'])('fails safely before calling services when %s is absent', async key => {
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    const response = await onRequest({ request: requestFor(), env: { ...env, [key]: '' } });
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain('secret');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each(['https://evil.example', 'null', ''])('rejects a request from another origin: %s', async origin => {
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    const response = await onRequest({ request: requestFor(inquiry, {
      headers: { Origin: origin, 'Content-Type': 'application/json' }
    }), env });
    expect(response.status).toBe(403);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('rejects GET and non-JSON submissions', async () => {
    const get = await onRequest({ request: new Request('https://fahint.com/api/inquiry'), env });
    expect(get.status).toBe(405);
    expect(get.headers.get('Allow')).toBe('POST');
    expect((await onRequest({ request: requestFor(inquiry, {
      headers: { Origin: 'https://fahint.com', 'Content-Type': 'text/plain' }
    }), env })).status).toBe(415);
  });

  it.each([
    { name: '' }, { email: 'not-an-email' }, { email: 'customer@example.com\nBcc: other@example.com' },
    { email: 'customer@example.com,other@example.com' }, { email: 'Customer <customer@example.com>' },
    { company: 'Company\nInjected header' }, { message: '' }, { message: 'x'.repeat(5001) },
    { requestId: 'bad-request-id' }, { turnstileToken: '' }, { turnstileToken: 'x'.repeat(2049) },
    { name: { html: 'not a string' } },
    { items: [{ model: 'unknown', quantity: '1' }] },
    { items: [{ model: 'FTR15-3100', quantity: '1.5' }] },
    { items: [{ model: 'FTR15-3100', quantity: 100 }] },
    { items: [{ model: 'FTR15-3100' }, { model: 'FTR15-3100' }] }
  ])('rejects invalid buyer data before verifying or sending (case %#)', async change => {
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    const response = await onRequest({ request: requestFor({ ...inquiry, ...change }), env });
    expect(response.status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON and stops reading oversized bodies', async () => {
    expect((await onRequest({ request: requestFor(inquiry, { body: '{broken' }), env })).status).toBe(400);
    const response = await onRequest({ request: requestFor(inquiry, { body: ' '.repeat(32_769) }), env });
    expect(response.status).toBe(413);
  });

  it('accepts UTF-8 buyer text within field limits even with a long verification token', async () => {
    vi.stubGlobal('fetch', vi.fn(async url => url.includes('siteverify')
      ? Response.json(verified) : Response.json({ id: 'accepted-id' })));
    const response = await onRequest({ request: requestFor({ ...inquiry,
      name: '刘'.repeat(120), company: '厂'.repeat(160), country: '中'.repeat(80),
      message: '询'.repeat(5000), turnstileToken: 'x'.repeat(2048)
    }), env });
    expect(response.status).toBe(200);
  });

  it.each([
    { success: false }, { ...verified, hostname: 'evil.example' }, { ...verified, action: 'login' }
  ])('does not send after failed, foreign or wrong-action verification: %j', async receipt => {
    const fetcher = vi.fn(async () => Response.json(receipt));
    vi.stubGlobal('fetch', fetcher);
    const response = await onRequest({ request: requestFor(), env });
    expect(response.status).toBe(403);
    expect(fetcher.mock.calls.some(([url]) => url === 'https://api.resend.com/emails')).toBe(false);
  });

  it('uses canonical product details for all items instead of client-supplied labels or links', async () => {
    const fetcher = vi.fn(async url => url.includes('siteverify')
      ? Response.json(verified) : Response.json({ id: 'accepted-id' }));
    vi.stubGlobal('fetch', fetcher);
    const response = await onRequest({ request: requestFor({ ...inquiry, items: [
      { model: 'FTR15-3100', quantity: '1200', finishSlug: 'black', finish: 'Forged', source: 'https://evil.example' },
      { model: 'FTR15C-3100', quantity: '600', finishSlug: 'white' }
    ] }), env });
    expect(response.status).toBe(200);
    const email = JSON.parse(fetcher.mock.calls.find(([url]) => url === 'https://api.resend.com/emails')[1].body);
    expect(email.text).toContain('Inquiry list (2 models)');
    expect(email.text).toContain('Quantity: 1200 pcs\nFinish: Black');
    expect(email.text).toContain('Quantity: 600 pcs\nFinish: White');
    expect(email.text).not.toMatch(/Forged|evil/);
  });

  it.each([429, 403, 500])('does not claim success when the email service returns %s', async status => {
    const fetcher = vi.fn(async url => url.includes('siteverify')
      ? Response.json(verified) : Response.json({ message: 'provider-secret-details' }, { status }));
    vi.stubGlobal('fetch', fetcher);
    const response = await onRequest({ request: requestFor(), env });
    expect(response.status).toBe(status === 429 ? 429 : 502);
    expect(await response.json()).toEqual({ ok: false });
  });

  it('requires a provider email ID before confirming receipt', async () => {
    vi.stubGlobal('fetch', vi.fn(async url => url.includes('siteverify')
      ? Response.json(verified) : Response.json({ success: true })));
    expect((await onRequest({ request: requestFor(), env })).status).toBe(502);
  });

  it('stops a stalled verification request and leaves the inquiry unconfirmed', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn((_, { signal }) => new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(new Error('private failure details')), { once: true });
    }));
    vi.stubGlobal('fetch', fetcher);
    const pending = onRequest({ request: requestFor(), env });
    await vi.advanceTimersByTimeAsync(3_000);
    const response = await pending;
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ ok: false });
  });
});
