const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const files = fs.readdirSync('src/assets/accessories').filter(f => f.endsWith('.png'));
console.log(`Found ${files.length} accessories in src/assets/accessories`);

const whiteOrPaleItems = [];
const allStats = [];

for (const file of files) {
  const filePath = path.join('src/assets/accessories', file);
  const buf = fs.readFileSync(filePath);
  const png = PNG.sync.read(buf);
  const { width, height, data } = png;

  let opaquePixels = 0;
  let whitePixels = 0;
  let blackBorderPixels = 0;
  let transparentPixels = 0;

  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    const a = data[idx + 3];
    if (a < 20) {
      transparentPixels++;
      continue;
    }
    opaquePixels++;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum > 220) whitePixels++;
    if (lum < 60) blackBorderPixels++;
  }

  const whiteRatio = opaquePixels > 0 ? (whitePixels / opaquePixels) * 100 : 0;
  const isPale = whiteRatio > 30 || file.includes('doctor') || file.includes('chef') || file.includes('bunny') || file.includes('pearl') || file.includes('bear_mask');

  allStats.push({
    file,
    width,
    height,
    opaquePixels,
    transparentPixels,
    whiteRatio: whiteRatio.toFixed(1),
    isPale,
  });

  if (isPale) {
    whiteOrPaleItems.push(file);
  }
}

console.log('White / Pale items needing thin high-contrast border check:');
console.log(whiteOrPaleItems);
