// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { onRequest } from '../../functions/_middleware.js';
import { renderSecurityHeaders } from './security-headers.js';

describe('security headers without blocking existing requests', () => {
  it('adds report-only CSP and conservative HSTS to production HTML', async () => {
    const response=await onRequest({request:new Request('https://fahint.com/'),next:()=>new Response('<h1>FAHINT</h1>',{headers:{'Content-Type':'text/html','ETag':'unchanged'}})});
    expect(response.headers.get('Content-Security-Policy-Report-Only')).toContain('report-uri /api/csp-report');
    expect(response.headers.get('Content-Security-Policy-Report-Only')).toContain('https://challenges.cloudflare.com');
    expect(response.headers.has('Content-Security-Policy')).toBe(false);
    expect(response.headers.get('Strict-Transport-Security')).toBe('max-age=86400');
    expect(response.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
    expect(response.headers.get('ETag')).toBe('unchanged');
    expect(await response.text()).toBe('<h1>FAHINT</h1>');
  });
  it('preserves inquiry body, status and cookies, and leaves local hosts out of HSTS', async () => {
    const request=new Request('http://127.0.0.1/api/inquiry',{method:'POST',body:'untouched'});
    const next=vi.fn(async()=>{expect(await request.text()).toBe('untouched');return new Response('{"ok":true}',{status:202,headers:{'Content-Type':'application/json','Set-Cookie':'test=1; Secure','Cache-Control':'no-store'}});});
    const response=await onRequest({request,next});
    expect(next).toHaveBeenCalledOnce();expect(response.status).toBe(202);
    expect(response.headers.has('Strict-Transport-Security')).toBe(false);
    expect(response.headers.get('Set-Cookie')).toBe('test=1; Secure');
    expect(await response.text()).toBe('{"ok":true}');
  });
  it('also covers legacy redirects and emits static Pages rules', async () => {
    const response=await onRequest({request:new Request('https://fahint.com/?pro1/151.html'),next:()=>{throw Error('Should redirect');}});
    expect(response.status).toBe(301);expect(response.headers.get('Location')).toBe('https://fahint.com/products/gfci/gf15/');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    const config=renderSecurityHeaders();
    expect(config).toContain('https://fahint.com/*');
    expect(config).not.toMatch(/includeSubDomains|preload|\n  Content-Security-Policy:/);
  });
});
