import { buildInquiryBody } from '../utils/inquiry.js';

const FIELDS = ['name', 'email', 'company', 'country', 'topic', 'category', 'model', 'quantity', 'finish', 'source', 'message'];
const COLUMNS = ['request_id', 'payload_sha256', ...FIELDS, 'items_json', 'inquiry_text'];
const INSERT = `INSERT INTO inquiries (${COLUMNS.join(', ')})
  VALUES (${COLUMNS.map(() => '?').join(', ')})
  ON CONFLICT(request_id) DO NOTHING RETURNING request_id`;

export async function saveInquiry(db, requestId, values) {
  const fields = FIELDS.map(field => values[field] ?? '');
  const items = JSON.stringify(values.items ?? []);
  const content = new TextEncoder().encode(JSON.stringify([...fields, items]));
  const digest = await crypto.subtle.digest('SHA-256', content);
  const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  const saved = await db.prepare(INSERT).bind(requestId, hash, ...fields, items, buildInquiryBody(values)).first();
  if (saved) return { inserted: true, conflict: false };

  const existing = await db.prepare('SELECT payload_sha256 FROM inquiries WHERE request_id = ?').bind(requestId).first();
  if (!existing) throw new Error('Inquiry storage was not confirmed');
  return { inserted: false, conflict: existing.payload_sha256 !== hash };
}

export async function recordNotification(db, requestId, status, emailId) {
  const result = await db.prepare(`UPDATE inquiries SET email_status = ?, email_id = ?,
    email_updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE request_id = ?`)
    .bind(status, emailId, requestId).run();
  if (!result.success) throw new Error('Notification status storage was not confirmed');
}
