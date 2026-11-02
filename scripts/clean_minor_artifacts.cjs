const fs = require('fs');
const { PNG } = require('pngjs');

// 1. Clean boat stray border lines
function cleanBoat() {
  const buf = fs.readFileSync('src/assets/images/coloring_boat.png');
  const png = PNG.sync.read(buf);
  const { width, height, data } = png;

  // Clear vertical line near x <= 15
  for (let y = 0; y < height; y++) {
    for (let x = 0; x <= 25; x++) {
      const idx = (y * width + x) * 4;
      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = 255;
    }
  }

  // Clear horizontal line near bottom y >= 490
  for (let y = 490; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = 255;
    }
  }

  fs.writeFileSync('src/assets/images/coloring_boat.png', PNG.sync.write(png));
  console.log('Cleaned boat stray lines');
}

// 2. Clean goldfish bottom stray line
function cleanGoldfish() {
  const buf = fs.readFileSync('src/assets/images/coloring_goldfish.png');
  const png = PNG.sync.read(buf);
  const { width, height, data } = png;

  // Clear horizontal straight line near bottom y >= 400
  for (let y = 415; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = 255;
    }
  }

  fs.writeFileSync('src/assets/images/coloring_goldfish.png', PNG.sync.write(png));
  console.log('Cleaned goldfish bottom line');
}

// 3. Smooth rainbow arcs without perforations
function cleanRainbow() {
  // Read backup before over-thinning
  const buf = fs.readFileSync('backup/coloring_images.before-games-v7/coloring_rainbow.png');
  const png = PNG.sync.read(buf);
  const { width, height, data } = png;

  // Dilate lines slightly then keep clean 4px stroke
  // Ensure lines are continuous and smooth
  const { processColoringBuffer } = require('./refine_coloring_algorithm.cjs');
  // Process with standard parameters
  const { outPng } = processColoringBuffer(png);
  
  // Close any remaining gaps in concentric arcs
  const oData = outPng.data;
  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      const idx = (y * width + x) * 4;
      if (oData[idx] > 200) { // white
        // If between two black pixels vertically or horizontally within 2px, fill
        const leftBlack = oData[idx - 4] < 100 || oData[idx - 8] < 100;
        const rightBlack = oData[idx + 4] < 100 || oData[idx + 8] < 100;
        const topBlack = oData[idx - width * 4] < 100 || oData[idx - width * 8] < 100;
        const btmBlack = oData[idx + width * 4] < 100 || oData[idx + width * 8] < 100;
        if ((leftBlack && rightBlack) || (topBlack && btmBlack)) {
          oData[idx] = 30;
          oData[idx + 1] = 41;
          oData[idx + 2] = 59;
          oData[idx + 3] = 255;
        }
      }
    }
  }

  fs.writeFileSync('src/assets/images/coloring_rainbow.png', PNG.sync.write(outPng));
  console.log('Cleaned rainbow');
}

cleanBoat();
cleanGoldfish();
cleanRainbow();
