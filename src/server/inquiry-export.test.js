// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { inquiriesToCsv } from '../../scripts/export-inquiries.mjs';

const row = {
  request_id: '1b8c1e42-467c-4a74-87f9-a4c63e51a2d6', created_at: '2026-10-09T06:00:00.000Z',
  name: '刘先生', email: 'buyer@example.com', company: 'ACME, "North"',
  message: '第一行\n第二行', status: 'quoted', notes: '已报价'
};

describe('private inquiry CSV export', () => {
  it('converts Wrangler query results with stable columns, Unicode, quotes and multiline text', () => {
    const csv = inquiriesToCsv([{ success: true, results: [row], meta: { rows_read: 1 } }]);
    expect(csv.startsWith('\uFEFF"询盘编号","提交时间（UTC）","跟进状态"')).toBe(true);
    expect(csv).toContain('"刘先生"');
    expect(csv).toContain('"ACME, ""North"""');
    expect(csv).toContain('"第一行\n第二行"');
    expect(csv).toContain('"quoted"');
    expect(csv).toContain('"已报价"');
    expect(csv.endsWith('\r\n')).toBe(true);
  });

  it.each(['=SUM(1,2)', '+cmd', '-cmd', '@SUM(A1)', '\t=cmd', '\r=cmd', '\n=cmd', '  =cmd'])
  ('exports potentially executable spreadsheet values as text: %j', value => {
    expect(inquiriesToCsv([{ ...row, notes: value }])).toContain(`"'${value}"`);
  });

  it('exports an empty result as headers and rejects failed or malformed query output', () => {
    expect(inquiriesToCsv([{ success: true, results: [] }]).split('\r\n')).toHaveLength(2);
    expect(() => inquiriesToCsv([{ success: false, results: [], error: 'query failed' }])).toThrow();
    expect(() => inquiriesToCsv({ error: 'unauthorized' })).toThrow();
    expect(() => inquiriesToCsv([{ success: true, results: [null] }])).toThrow();
    expect(() => inquiriesToCsv([{ results: [] }])).toThrow();
  });
});
