import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'decor');
await mkdir(outDir, { recursive: true });

const GOLD = { r: 0xf3, g: 0xc9, b: 0x69 };

const sources = [
  { in: '123/a50a48e6f6aec74718a7a5783cd69145.png', out: 'frieze-left.png' },
  { in: '123/3be0ae3fbe0c057ea9e21e01e5561a16.png', out: 'frieze-right.png' },
];

for (const s of sources) {
  const inPath = path.join(root, s.in);
  const { data, info } = await sharp(inPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = Buffer.from(data);
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i], g = px[i + 1], b = px[i + 2];
    // brightness 0..255; white(255)→fully transparent, black(0)→fully opaque
    const brightness = (r + g + b) / 3;
    const alpha = Math.round(255 - brightness);
    px[i] = GOLD.r;
    px[i + 1] = GOLD.g;
    px[i + 2] = GOLD.b;
    px[i + 3] = alpha;
  }

  const outPath = path.join(outDir, s.out);
  await sharp(px, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(outPath);
  console.log(`${s.out}  ${info.width}x${info.height}`);
}
