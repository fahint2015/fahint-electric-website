const MAX_BYTES = 16_384;
const reply = status => new Response(null, {status, headers: {'Cache-Control': 'no-store', ...(status === 405 ? {Allow: 'POST'} : {})}});

function safeLocation(value, origin, document = false) {
  if (!document && ['inline', 'eval', 'wasm-eval', 'data', 'blob'].includes(value)) return value;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    if (document) return url.origin === origin ? url.pathname.slice(0, 200) : '';
    // External origins suffice for an allowlist; omit paths, queries and samples.
    return url.origin === origin ? url.pathname.slice(0, 200) : url.origin;
  } catch { return ''; }
}

export async function onRequest({request}) {
  if (request.method !== 'POST') return reply(405);
  const origin = new URL(request.url).origin;
  if (request.headers.has('Origin') && request.headers.get('Origin') !== origin) return reply(403);
  const type = request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase();
  if (!['application/csp-report', 'application/reports+json'].includes(type)) return reply(415);
  if (Number(request.headers.get('Content-Length')) > MAX_BYTES) return reply(413);
  if (!request.body) return reply(400);
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let text = '', size = 0, payload;
  try {
    while (true) {
      const {value, done} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); return reply(413); }
      text += decoder.decode(value, {stream: true});
    }
    payload = JSON.parse(text + decoder.decode());
  } catch { return reply(400); }
  finally { reader.releaseLock(); }
  const reports = Array.isArray(payload) ? payload.filter(item=>item?.type === 'csp-violation').map(item=>item.body) : [payload?.['csp-report']];
  for (const report of reports.slice(0, 10)) {
    if (!report || typeof report !== 'object') continue;
    const document = safeLocation(report['document-uri'] || report.documentURL, origin, true);
    const directive = report['effective-directive'] || report.effectiveDirective;
    if (!document || typeof directive !== 'string' || !/^[a-z][a-z-]{0,63}$/.test(directive)) continue;
    console.warn('[csp-report]', JSON.stringify({document, directive,
      blocked: safeLocation(report['blocked-uri'] || report.blockedURL, origin),
      source: safeLocation(report['source-file'] || report.sourceFile, origin)}));
  }
  return reply(204);
}
