// One-shot: render each compressed GLB to a 512×512 transparent WebP thumbnail
// in public/thumbs/<id>.webp. Driven by puppeteer + thumb.html.

import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { readdir, writeFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { extname, join } from 'node:path';

const ROOT = resolve('.');

const MIME = {
  '.html': 'text/html',
  '.glb': 'model/gltf-binary',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

// Tiny static server for the puppeteer page (so file:// + CORS issues vanish).
const server = createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const path = join(ROOT, u === '/' ? '/scripts/thumb.html' : u);
  stat(path).then(s => {
    if (!s.isFile()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' });
    createReadStream(path).pipe(res);
  }).catch(() => { res.writeHead(404); res.end(); });
});
await new Promise(r => server.listen(0, r));
const port = server.address().port;
console.log(`local server :${port}`);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 2 });
await page.goto(`http://127.0.0.1:${port}/scripts/thumb.html`);
await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });

const files = (await readdir('public/models')).filter(f => f.endsWith('.glb'));
console.log(`Capturing ${files.length} models...`);

for (const f of files) {
  const id = f.replace(/\.glb$/, '');
  const url = `/public/models/${f}`;
  try {
    const dataUrl = await page.evaluate(u => window.captureModel(u), url);
    const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
    const out = `public/thumbs/${id}.webp`;
    await sharp(buf).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 88, alphaQuality: 90 }).toFile(out);
    const s = (await stat(out)).size;
    console.log(`  ${id.padEnd(8)} -> ${out}  ${(s/1024).toFixed(0)} KB`);
  } catch (e) {
    console.error(`  ${id} FAILED:`, e.message);
  }
}

await browser.close();
server.close();
console.log('done');
