import { build } from 'vite';
import { resolve } from 'node:path';

// Pages' bundled Wrangler may lag behind the JSON import syntax used by our data.
// Reuse Vite to emit a standalone Worker-compatible module first.
await build({
  configFile: false,
  publicDir: false,
  build: {
    outDir: 'output/functions',
    lib: {
      entry: resolve('src/server/inquiry.js'),
      formats: ['es'],
      fileName: () => 'inquiry.mjs'
    },
    minify: true
  }
});
