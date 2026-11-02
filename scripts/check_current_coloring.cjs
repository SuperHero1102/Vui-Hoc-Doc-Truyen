const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const { analyzeBinaryImage } = require('./analyze_coloring.cjs');

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

console.log('--- CURRENT STATS OF 20 COLORING IMAGES ---');
console.log('File\t\t\tMax Radius\tBlack %\t\tRegions\tStatus');

for (const file of TEMPLATE_FILES) {
  const filePath = path.join('src/assets/images', file);
  if (!fs.existsSync(filePath)) {
    console.log(`${file}\tNOT FOUND`);
    continue;
  }
  const buf = fs.readFileSync(filePath);
  const png = PNG.sync.read(buf);
  const { width, height, data } = png;

  const blackArr = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
    const alpha = data[idx + 3];
    blackArr[i] = (lum < 128 && alpha > 50) ? 1 : 0;
  }

  const stats = analyzeBinaryImage(blackArr, width, height);
  const okRadius = stats.maxRadiusPx <= 5.0;
  const okRatio = stats.blackRatio < 12.0;
  const okRegions = stats.regionCount >= 4 && stats.regionCount <= 30;
  const pass = okRadius && okRatio && okRegions;

  console.log(
    `${file.padEnd(24)}\t${stats.maxRadiusPx}px\t\t${stats.blackRatio}%\t\t${stats.regionCount}\t${pass ? 'PASS' : 'FAIL'}`
  );
}
