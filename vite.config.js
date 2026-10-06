import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project sites are served from /<repo>/.
// Set SITE_BASE=/your-repo-name/ in the deploy workflow; leave unset for a
// custom domain, a user/organisation page, or local preview.
const base = process.env.SITE_BASE || '/';

export default defineConfig({
  base,
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    include: ['src/**/*.test.{js,jsx}']
  },
  server: {
    host: '127.0.0.1'
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true,
    // Initial HTML must be styled even before lazy route JavaScript loads.
    cssCodeSplit: false,
    chunkSizeWarningLimit: 900
  }
});
