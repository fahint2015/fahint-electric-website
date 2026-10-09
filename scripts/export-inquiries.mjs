import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const COLUMNS = [
  ['request_id', '询盘编号'], ['created_at', '提交时间（UTC）'], ['status', '跟进状态'],
  ['name', '姓名'], ['email', '邮箱'], ['company', '公司'], ['country', '国家或地区'],
  ['topic', '询盘类型'], ['category', '产品类别'], ['model', '型号'], ['quantity', '数量'],
  ['finish', '颜色'], ['source', '来源页'], ['message', '客户需求'], ['items_json', '多款产品清单'],
  ['inquiry_text', '完整询盘'], ['notes', '跟进备注'], ['email_status', '邮件通知状态'],
  ['email_id', '邮件编号'], ['email_updated_at', '邮件状态时间（UTC）']
];

function csvCell(value) {
  if (value !== null && typeof value === 'object') throw new Error('Invalid export field');
  let text = String(value ?? '');
  // CSV quoting alone does not prevent Excel from interpreting buyer text as a formula.
  if (/^[\s\uFEFF]*[=+\-@]|^[\t\r\n]/u.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function inquiriesToCsv(input) {
  if (!Array.isArray(input)) throw new Error('Expected query results');
  const wrapped = input.some(entry => entry && typeof entry === 'object'
    && ('results' in entry || 'success' in entry || 'error' in entry));
  if (wrapped && !input.every(query => query?.success === true && Array.isArray(query.results))) {
    throw new Error('Query did not succeed');
  }
  const rows = wrapped ? input.flatMap(query => query.results) : input;
  if (!rows.every(row => row && typeof row.request_id === 'string' && row.request_id)) {
    throw new Error('Invalid inquiry rows');
  }
  return '\uFEFF' + [
    COLUMNS.map(([, title]) => csvCell(title)).join(','),
    ...rows.map(row => COLUMNS.map(([field]) => csvCell(row[field])).join(','))
  ].join('\r\n') + '\r\n';
}

function publicPath(path) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  return ['public', 'dist'].some(folder => {
    const part = relative(resolve(root, folder), path);
    return part === '' || (part !== '..' && !part.startsWith(`..${sep}`) && !isAbsolute(part));
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 4) throw new Error('Expected input and output paths');
    const input = resolve(process.argv[2]);
    const output = resolve(process.argv[3]);
    if (publicPath(input) || publicPath(output)) throw new Error('Use private file paths');
    const data = JSON.parse((await readFile(input, 'utf8')).replace(/^\uFEFF/, ''));
    const csv = inquiriesToCsv(data);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, csv, { encoding: 'utf8', flag: 'wx' });
    console.log(`CSV saved: ${output}`);
  } catch {
    console.error('Export failed. Use valid query JSON and private file paths; the output file must not already exist.');
    process.exitCode = 1;
  }
}
