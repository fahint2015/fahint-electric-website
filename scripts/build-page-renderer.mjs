import { build } from 'vite';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function buildPageRenderer(base) {
  await build({
    base,
    build: {
      ssr: 'src/entry-server.jsx',
      manifest: false,
      outDir: 'output/prerender',
      copyPublicDir: false,
      rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
    },
  });
  const entry = pathToFileURL(resolve('output/prerender/entry-server.mjs'));
  return (await import(entry.href)).renderPage;
}
