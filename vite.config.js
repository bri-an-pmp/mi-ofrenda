import { defineConfig } from 'vite';
import { rmSync, globSync } from 'node:fs';

// Content Security Policy for the built site: the page may only run its own code and styles, and
// may only talk to itself. If anything ever slipped untrusted code into the page, the
// browser would refuse to run it or send data anywhere else. (Not used by the dev server, which
// needs inline scripts for live reload.)
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  "media-src 'self' data: blob:",
  "connect-src 'self' blob:",
  "object-src 'none'",
  "frame-src 'none'",
  "worker-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

const securityHeaders = {
  name: 'security-meta',
  apply: 'build',
  transformIndexHtml(html) {
    return html.replace('<meta charset="UTF-8">', `<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="referrer" content="no-referrer">`);
  },
};

// The iPhone app (`vite build --mode app`) leaves out people still living (see FAMOUS in data.js),
// so their photos and recorded names aren't shipped either.
const LIVING = ['dolly'];
const appOnly = {
  name: 'app-files',
  apply: (_, env) => env.command === 'build' && env.mode === 'app',
  closeBundle() {
    for (const id of LIVING) {
      for (const f of [`dist/people/${id}.jpg`, ...globSync(`dist/audio/tails/*-${id}.mp3`)]) rmSync(f, { force: true });
    }
  },
};

// Relative paths so the same build works on GitHub Pages (a subfolder) and inside the iOS app
export default defineConfig({
  base: './',
  plugins: [securityHeaders, appOnly],
  build: { outDir: 'dist', emptyOutDir: true },
});
