import { onRequest as legacyUrls } from '../src/server/legacy-urls.js';
import { withSecurityHeaders } from '../src/server/security-headers.js';

export function onRequest(context) {
  const response = legacyUrls(context);
  return response instanceof Response
    ? withSecurityHeaders(response, context.request)
    : Promise.resolve(response).then(result => withSecurityHeaders(result, context.request));
}
