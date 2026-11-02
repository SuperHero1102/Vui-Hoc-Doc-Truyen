const fs = require('fs');
const { PNG } = require('pngjs');

const buf = fs.readFileSync('src/assets/images/coloring_boat.png');
const png = PNG.sync.read(buf);
const { width, height, data } = png;

// Clear vertical line near x <= 45
for (let y = 0; y < height; y++) {
  for (let x = 0; x <= 45; x++) {
    const idx = (y * width + x) * 4;
    data[idx] = 255;
    data[idx + 1] = 255;
    data[idx + 2] = 255;
    data[idx + 3] = 255;
  }
}

// Clear horizontal line near bottom y >= 475
for (let y = 475; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    data[idx] = 255;
    data[idx + 1] = 255;
    data[idx + 2] = 255;
    data[idx + 3] = 255;
  }
}

fs.writeFileSync('src/assets/images/coloring_boat.png', PNG.sync.write(png));
console.log('Boat frame border lines removed completely!');
