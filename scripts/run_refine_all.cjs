const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const { processColoringBuffer } = require('./refine_coloring_algorithm.cjs');

const TEMPLATE_FILES = [
  'coloring_turtle.png',
  'coloring_dog.png',
  'coloring_cat.png',
  'coloring_rabbit.png',
  'coloring_car.png',
  'coloring_train.png',
  'coloring_rocket.png',
  'coloring_rainbow.png',
  'coloring_cake.png',
  'coloring_goldfish.png',
  'coloring_elephant.png',
  'coloring_lion.png',
  'coloring_dino.png',
  'coloring_dolphin.png',
  'coloring_duck.png',
  'coloring_panda.png',
  'coloring_castle.png',
  'coloring_boat.png',
  'coloring_icecream.png',
  'coloring_apple.png',
];

console.log('--- REFINING ALL 20 COLORING IMAGES ---');
const results = [];

for (const file of TEMPLATE_FILES) {
  const filePath = path.join('src/assets/images', file);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    continue;
  }
  const buf = fs.readFileSync(filePath);
  const png = PNG.sync.read(buf);

  const { outPng, stats } = processColoringBuffer(png);

  // Write refined image back to src/assets/images/
  const outBuf = PNG.sync.write(outPng);
  fs.writeFileSync(filePath, outBuf);

  // Also check if there is an alias file like coloring_sea_turtle.png, coloring_puppy.png, coloring_kitty.png, coloring_bunny.png
  const aliases = {
    'coloring_turtle.png': 'coloring_sea_turtle.png',
    'coloring_dog.png': 'coloring_puppy.png',
    'coloring_cat.png': 'coloring_kitty.png',
    'coloring_rabbit.png': 'coloring_bunny.png',
  };
  if (aliases[file]) {
    fs.writeFileSync(path.join('src/assets/images', aliases[file]), outBuf);
  }

  const okRadius = stats.maxRadiusPx <= 5.0;
  const okRatio = stats.blackRatio < 12.0;
  const okRegions = stats.regionCount >= 4 && stats.regionCount <= 30;
  const pass = okRadius && okRatio && okRegions;

  results.push({
    file,
    maxRadiusPx: stats.maxRadiusPx,
    blackRatio: stats.blackRatio,
    regionCount: stats.regionCount,
    status: pass ? 'ĐẠT' : 'CHƯA ĐẠT',
  });

  console.log(
    `${file.padEnd(24)}\tMax Radius: ${stats.maxRadiusPx}px\tBlack: ${stats.blackRatio}%\tRegions: ${stats.regionCount}\t[${pass ? 'ĐẠT' : 'CHƯA ĐẠT'}]`
  );
}

// Also process helicopter and mushroom if they exist
for (const extra of ['coloring_helicopter.png', 'coloring_mushroom.png']) {
  const filePath = path.join('src/assets/images', extra);
  if (fs.existsSync(filePath)) {
    const buf = fs.readFileSync(filePath);
    const png = PNG.sync.read(buf);
    const { outPng } = processColoringBuffer(png);
    fs.writeFileSync(filePath, PNG.sync.write(outPng));
  }
}

fs.writeFileSync('scripts/coloring_results.json', JSON.stringify(results, null, 2));
console.log('\nProcessing complete. Saved results to scripts/coloring_results.json');
