// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { publicReferenceFiles } from '../../scripts/public-reference-files.mjs';
import { routeMetadata } from '../../scripts/page-metadata.mjs';

describe('optional public reading files', () => {
  it('uses the confirmed address and links all FAQ answers to existing family pages', () => {
    const files=publicReferenceFiles();
    const summary=JSON.parse(files['ai/summary.json']);
    const faq=JSON.parse(files['ai/faq.json']);
    expect(summary.addressText).toContain('No. 130 Xinguang Avenue');
    expect(summary.productFamilies).toHaveLength(7);
    expect(summary.certifications).toHaveLength(7);
    expect(faq.faqs).toHaveLength(22);
    for(const q of faq.faqs)expect(routeMetadata.has(new URL(q.source).pathname.replace(/\/$/,''))).toBe(true);
    for(const match of files['llms.txt'].matchAll(/\]\(([^)]+)\)/g)) {
      const path=new URL(match[1]).pathname.replace(/\/$/,'');
      expect(routeMetadata.has(path)||path==='/ai/summary.json'||path==='/ai/faq.json'||path==='/ai/service.json',path).toBe(true);
    }
    expect(files['llms.txt']).not.toMatch(/guaranteed|ranking|best supplier/i);
  });

  it('exposes the discovery fields answer engines read', () => {
    const files=publicReferenceFiles();
    const summary=JSON.parse(files['ai/summary.json']);
    const faq=JSON.parse(files['ai/faq.json']);
    const service=JSON.parse(files['ai/service.json']);
    expect(summary.name).toBe('FAHINT');
    expect(summary.description.length).toBeGreaterThan(40);
    expect(faq.faqs[0]).toMatchObject({question: expect.any(String), answer: expect.any(String)});
    expect(service.name).toBe('FAHINT');
    expect(service.capabilities.length).toBeGreaterThanOrEqual(3);
  });
});
