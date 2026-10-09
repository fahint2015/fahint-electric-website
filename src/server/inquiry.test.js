// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

// An API double for unit behavior; the actual SQL is also exercised in local D1.
function inquiryDatabase() {
  const rows = new Map();
  const prepare = vi.fn(sql => ({ bind: (...values) => ({
    first: async () => {
      if (sql.startsWith('INSERT')) {
        const columns = sql.match(/INSERT INTO inquiries\s*\((.*?)\)/s)[1].split(',').map(value => value.trim());
        const row = Object.fromEntries(columns.map((column, index) => [column, values[index]]));
        if (rows.has(row.request_id)) return null;
        rows.set(row.request_id, { status: 'new', notes: '', email_status: 'pending', email_id: '', ...row });
        return row;
      }
      return rows.get(values[0]) ?? null;
    },
    run: async () => {
      const row = rows.get(values.at(-1));
      if (row) { row.email_status = values[0]; row.email_id = values[1]; }
      return { success: true };
    }
  }) }));
  return { prepare, rows };
}

beforeEach(() => { env.INQUIRY_DB = inquiryDatabase(); });
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

describe('Cloudflare inquiry email', () => {
  it('forwards a verified inquiry to the fixed business inbox with the customer as reply-to', async () => {
    const fetcher = vi.fn(async (url, options) => {
      // workerd rejects redirect: 'error' before sending any request.
      if (!['follow', 'manual'].includes(options.redirect)) throw new TypeError('Invalid redirect value');
      return url.includes('siteverify') ? Response.json(verified) : Response.json({ id: 'accepted-email-id' });
    });
    vi.stubGlobal('fetch', fetcher);
    const response = await onRequest({ request: requestFor({ ...inquiry, to: 'attacker@example.com' }), env });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    for (const [, options] of fetcher.mock.calls) expect(options.redirect).toBe('manual');
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

  it.each(['INQUIRY_DB', 'TURNSTILE_SECRET_KEY'])('fails safely before calling services when %s is absent', async key => {
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
    expect(env.INQUIRY_DB.rows.size).toBe(0);
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
    const row = env.INQUIRY_DB.rows.get(inquiry.requestId);
    expect(JSON.parse(row.items_json)).toHaveLength(2);
    expect(row.inquiry_text).toContain('Quantity: 1200 pcs\nFinish: Black');
    expect(row.items_json).not.toMatch(/Forged|evil/);
  });

  it.each([429, 403, 500])('retains the received inquiry when the email service returns %s', async status => {
    const fetcher = vi.fn(async url => url.includes('siteverify')
      ? Response.json(verified) : Response.json({ message: 'provider-secret-details' }, { status }));
    vi.stubGlobal('fetch', fetcher);
    const response = await onRequest({ request: requestFor(), env });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(env.INQUIRY_DB.rows.get(inquiry.requestId)).toMatchObject({ email_status: 'failed', message: inquiry.message });
  });

  it('marks notification failure when no provider email ID is returned', async () => {
    vi.stubGlobal('fetch', vi.fn(async url => url.includes('siteverify')
      ? Response.json(verified) : Response.json({ success: true })));
    expect((await onRequest({ request: requestFor(), env })).status).toBe(200);
    expect(env.INQUIRY_DB.rows.get(inquiry.requestId).email_status).toBe('failed');
  });

  it('stores normalized buyer data before requesting a notification and excludes private verification data', async () => {
    const fetcher = vi.fn(async url => {
      if (url.includes('siteverify')) return Response.json(verified);
      expect(env.INQUIRY_DB.rows.get(inquiry.requestId)).toMatchObject({
        name: inquiry.name, email: inquiry.email, message: inquiry.message, status: 'new', email_status: 'pending'
      });
      return Response.json({ id: 'stored-email-id' });
    });
    vi.stubGlobal('fetch', fetcher);
    expect((await onRequest({ request: requestFor({ ...inquiry, name: ` ${inquiry.name} ` }), env })).status).toBe(200);
    const row = env.INQUIRY_DB.rows.get(inquiry.requestId);
    expect(row).toMatchObject({ email_status: 'accepted', email_id: 'stored-email-id' });
    expect(row.payload_sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(row)).not.toMatch(/human-token|test-server-secret|test-verification-secret/);
  });

  it('does not confirm or send when database storage fails', async () => {
    const fetcher = vi.fn(async () => Response.json(verified));
    vi.stubGlobal('fetch', fetcher);
    const database = { prepare: () => { throw new Error('private database details'); } };
    const response = await onRequest({ request: requestFor(), env: { ...env, INQUIRY_DB: database } });
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('deduplicates retries without replacing operator notes or sending a second email', async () => {
    const fetcher = vi.fn(async url => url.includes('siteverify') ? Response.json(verified) : Response.json({ id: 'one-email' }));
    vi.stubGlobal('fetch', fetcher);
    expect((await onRequest({ request: requestFor(), env })).status).toBe(200);
    Object.assign(env.INQUIRY_DB.rows.get(inquiry.requestId), { notes: 'Quote prepared', status: 'quoted' });
    expect((await onRequest({ request: requestFor({ ...inquiry, turnstileToken: 'fresh-token' }), env })).status).toBe(200);
    expect(env.INQUIRY_DB.rows.size).toBe(1);
    expect(env.INQUIRY_DB.rows.get(inquiry.requestId)).toMatchObject({ notes: 'Quote prepared', status: 'quoted' });
    expect(fetcher.mock.calls.filter(([url]) => url === 'https://api.resend.com/emails')).toHaveLength(1);
  });

  it('rejects a reused request ID with different content instead of overwriting a lead', async () => {
    const fetcher = vi.fn(async url => url.includes('siteverify') ? Response.json(verified) : Response.json({ id: 'one-email' }));
    vi.stubGlobal('fetch', fetcher);
    await onRequest({ request: requestFor(), env });
    const response = await onRequest({ request: requestFor({ ...inquiry, message: 'Different requirement' }), env });
    expect(response.status).toBe(409);
    expect(env.INQUIRY_DB.rows.get(inquiry.requestId).message).toBe(inquiry.message);
    expect(fetcher.mock.calls.filter(([url]) => url === 'https://api.resend.com/emails')).toHaveLength(1);
  });

  it('stores one row and requests one notification for simultaneous retries', async () => {
    const fetcher = vi.fn(async url => url.includes('siteverify') ? Response.json(verified) : Response.json({ id: 'one-email' }));
    vi.stubGlobal('fetch', fetcher);
    const responses = await Promise.all([onRequest({ request: requestFor(), env }), onRequest({ request: requestFor(), env })]);
    expect(responses.map(response => response.status)).toEqual([200, 200]);
    expect(env.INQUIRY_DB.rows.size).toBe(1);
    expect(fetcher.mock.calls.filter(([url]) => url === 'https://api.resend.com/emails')).toHaveLength(1);
  });

  it('preserves a saved inquiry when notification fails at the network layer', async () => {
    vi.stubGlobal('fetch', vi.fn(async url => {
      if (url.includes('siteverify')) return Response.json(verified);
      throw new Error('private provider details');
    }));
    expect((await onRequest({ request: requestFor(), env })).status).toBe(200);
    expect(env.INQUIRY_DB.rows.get(inquiry.requestId)).toMatchObject({ email_status: 'failed', message: inquiry.message });
  });

  it('keeps the stored row and logs no buyer data when notification status cannot be saved', async () => {
    const diagnostic = vi.spyOn(console, 'error').mockImplementation(() => {});
    const prepare = env.INQUIRY_DB.prepare;
    env.INQUIRY_DB.prepare = sql => sql.startsWith('UPDATE')
      ? { bind: () => ({ run: async () => { throw new Error('private database details'); } }) } : prepare(sql);
    vi.stubGlobal('fetch', vi.fn(async url => url.includes('siteverify') ? Response.json(verified) : Response.json({ id: 'accepted-id' })));
    try {
      expect((await onRequest({ request: requestFor(), env })).status).toBe(200);
      expect(env.INQUIRY_DB.rows.get(inquiry.requestId)).toMatchObject({ email_status: 'pending', message: inquiry.message });
      expect(diagnostic).toHaveBeenCalledWith('Inquiry notification status could not be saved', inquiry.requestId);
      expect(JSON.stringify(diagnostic.mock.calls)).not.toMatch(/Avery|avery@example|private database/);
    } finally { diagnostic.mockRestore(); }
  });

  it('confirms the stored inquiry without waiting for a background notification', async () => {
    let acceptEmail;
    const background = [];
    vi.stubGlobal('fetch', vi.fn(async url => url.includes('siteverify') ? Response.json(verified)
      : new Promise(resolve => { acceptEmail = resolve; })));
    const response = await onRequest({ request: requestFor(), env, waitUntil: task => background.push(task) });
    expect(response.status).toBe(200);
    expect(env.INQUIRY_DB.rows.get(inquiry.requestId).email_status).toBe('pending');
    expect(background).toHaveLength(1);
    acceptEmail(Response.json({ id: 'background-email' }));
    await Promise.all(background);
    expect(env.INQUIRY_DB.rows.get(inquiry.requestId)).toMatchObject({ email_status: 'accepted', email_id: 'background-email' });
  });

  it.each(['RESEND_API_KEY', 'INQUIRY_FROM'])('still receives and saves an inquiry when %s is unconfigured', async key => {
    const fetcher = vi.fn(async () => Response.json(verified));
    vi.stubGlobal('fetch', fetcher);
    expect((await onRequest({ request: requestFor(), env: { ...env, [key]: '' } })).status).toBe(200);
    expect(env.INQUIRY_DB.rows.get(inquiry.requestId).email_status).toBe('failed');
    expect(fetcher).toHaveBeenCalledTimes(1);
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
