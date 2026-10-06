import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import App from './App.jsx';

export function renderPage(path, base = import.meta.env.BASE_URL) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const output = new Writable({ write(chunk, encoding, done) { chunks.push(chunk); done(); } });
    const basename = base.replace(/\/$/, '');
    let failed = false;
    const fail = error => {
      if (failed) return;
      failed = true;
      clearTimeout(timeout);
      reject(new Error(`Cannot prerender ${path}: ${error.message}`, { cause: error }));
      stream.abort();
    };
    const stream = renderToPipeableStream(
      <StaticRouter basename={basename} location={`${basename}${path}`} future={{ v7_relativeSplatPath: true }}><App /></StaticRouter>,
      {
        // Wait for lazy routes: never publish a Suspense loading placeholder.
        onAllReady() { if (!failed) stream.pipe(output); },
        onShellError: fail,
        onError: fail,
      }
    );
    const timeout = setTimeout(() => fail(new Error('Rendering timed out.')), 15000);
    output.on('error', fail);
    output.on('finish', () => {
      clearTimeout(timeout);
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
  });
}
