// @vitest-environment node
import { describe, expect, it, vi, afterEach } from 'vitest';
import { onRequest } from './csp-report.js';
afterEach(()=>vi.restoreAllMocks());
const send=(body,headers={})=>onRequest({request:new Request('https://fahint.com/api/csp-report',{method:'POST',body,headers:{'Content-Type':'application/csp-report',...headers}})});
describe('CSP reports',()=>{
  it('logs only the directive and sanitized locations, never query values or script samples',async()=>{
    const log=vi.spyOn(console,'warn').mockImplementation(()=>{});
    const response=await send(JSON.stringify({'csp-report':{'document-uri':'https://fahint.com/contact/?email=private@example.com#token','effective-directive':'script-src-elem','blocked-uri':'https://other.example/private?secret=123','source-file':'https://fahint.com/assets/main.js?key=secret','script-sample':'PRIVATE',referrer:'PRIVATE'}}));
    expect(response.status).toBe(204);expect(log).toHaveBeenCalledOnce();
    const logged=JSON.stringify(log.mock.calls);
    expect(logged).toContain('/contact/');expect(logged).toContain('https://other.example');
    expect(logged).not.toMatch(/private|secret|token|PRIVATE|referrer/i);
  });
  it('accepts modern reports but ignores foreign documents and unrelated report types',async()=>{
    const log=vi.spyOn(console,'warn').mockImplementation(()=>{});
    const body=[{type:'csp-violation',url:'https://fahint.com/products/',body:{documentURL:'https://fahint.com/products/',effectiveDirective:'img-src',blockedURL:'inline'}},{type:'csp-violation',body:{documentURL:'https://other.example/',effectiveDirective:'script-src',blockedURL:'eval'}},{type:'deprecation',body:{}}];
    expect((await send(JSON.stringify(body),{'Content-Type':'application/reports+json'})).status).toBe(204);
    expect(log).toHaveBeenCalledOnce();
  });
  it('rejects unsupported methods, origins, formats, malformed and oversized payloads',async()=>{
    expect((await onRequest({request:new Request('https://fahint.com/api/csp-report')})).status).toBe(405);
    expect((await send('{}',{'Origin':'https://other.example'})).status).toBe(403);
    expect((await send('{}',{'Content-Type':'text/plain'})).status).toBe(415);
    expect((await send('invalid')).status).toBe(400);
    expect((await send('x'.repeat(16_385))).status).toBe(413);
  });
});
