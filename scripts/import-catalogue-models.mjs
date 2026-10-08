import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalogueFinishSources, catalogueModelSources } from './catalogue-model-sources.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const library = path.resolve(root, '../../产品图片');
const output = path.join(root, 'src/data/catalog/catalogue-products.json');
const imageDir = path.join(root, 'public/assets/images/catalog/models');
const family = process.argv[process.argv.indexOf('--family') + 1];
if (!process.argv.includes('--family') || !family) throw new Error('Pass --family to process one family in sequence.');
const selected = process.argv.includes('--finishes-only') ? [] : catalogueModelSources.filter((record) => record.family === family);
const selectedFinishes = catalogueFinishSources.filter((record) => record.family === family);
if (!selected.length && !selectedFinishes.length) throw new Error(`No catalogue source records for ${family}.`);
const recordKey = (record) => `${record.family}/${record.model.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
const records = new Map((existsSync(output) ? JSON.parse(readFileSync(output, 'utf8')) : []).map((record) => [recordKey(record), record]));
const imageCache = new Map();
for (const record of selectedFinishes) {
  for (const finish of record.finishSources) {
    const file = path.resolve(library, finish.source);
    if (!file.startsWith(`${library}${path.sep}`) || !existsSync(file)) throw new Error(`Missing finish source for ${record.model}: ${finish.source}`);
  }
}
mkdirSync(imageDir, { recursive: true });

function image(source) {
  const file = path.resolve(library, source);
  if (!file.startsWith(`${library}${path.sep}`) || !existsSync(file)) throw new Error(`Missing or invalid source photograph: ${file}`);
  const hash = createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 16);
  if (imageCache.has(hash)) return imageCache.get(hash);
  const target = path.join(imageDir, `${hash}.webp`);
  if (!existsSync(target)) execFileSync('ffmpeg', ['-nostdin', '-v', 'error', '-i', file,
    '-vf', "scale=w='min(1400,iw)':h='min(1400,ih)':force_original_aspect_ratio=decrease:flags=lanczos",
    '-frames:v', '1', '-c:v', 'libwebp', '-quality', '84', '-compression_level', '6', target], { windowsHide: true });
  const { streams: [{ width, height }] } = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height', '-of', 'json', target], { encoding: 'utf8', windowsHide: true }));
  const asset = { src: `assets/images/catalog/models/${hash}.webp`, width, height };
  imageCache.set(hash, asset);
  return asset;
}

for (const record of selected) {
  const gallery = record.gallerySources.map(image);
  const drawings = (record.drawingSources || []).map((source, index) => ({
    ...image(source), source,
    ...(record.drawingCaptions?.[index] ? { caption: record.drawingCaptions[index] } : {}),
    ...(record.drawingKinds?.[index] ? { kind: record.drawingKinds[index] } : {})
  }));
  records.set(recordKey(record), {
    features: [], materials: [], rows: [], breadcrumb: '', ...record,
    sourceKind: 'catalogue', sourceFile: 'FAHINT PRODUCT CATALOG -Louis 13MB.pdf',
    gallery, drawings
  });
  console.log(`${record.model}: ${record.imageOnly ? 'model-specific photo correction' : `${record.rows.length} catalogue rows`}; ${gallery.length} photographs`);
}
for (const record of selectedFinishes) {
  const previous = records.get(recordKey(record));
  records.set(recordKey(record), {
    ...(previous || { model: record.model, family, imageOnly: true, sourceKind: 'product-library', gallery: [], drawings: [] }),
    finishSources: record.finishSources,
    finishImages: record.finishSources.map(({ slug, source }) => ({ slug, ...image(source) }))
  });
  console.log(`${record.model}: ${record.finishSources.length} model-specific finish photographs`);
}
mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify([...records.values()], null, 2)}\n`, 'utf8');
const documentDir = path.join(root, 'public/assets/documents');
mkdirSync(documentDir, { recursive: true });
const pdf = path.join(documentDir, 'fahint-product-catalog.pdf');
if (!existsSync(pdf)) copyFileSync(path.resolve(root, '../公司资料&产品/FAHINT PRODUCT CATALOG -Louis 13MB.pdf'), pdf);
