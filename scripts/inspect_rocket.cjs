const fs = require('fs');
const { PNG } = require('pngjs');

const buf = fs.readFileSync('src/assets/images/coloring_rocket.png');
const png = PNG.sync.read(buf);
console.log('Rocket dimension:', png.width, 'x', png.height);

// Let's check for narrow white gaps between black lines:
// A white pixel with black pixels within 1-3 pixels in both directions is a narrow white gap (double line indicator)!
const { width, height, data } = png;
const black = new Uint8Array(width * height);
for (let i = 0; i < width * height; i++) {
  const lum = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
  black[i] = lum < 128 ? 1 : 0;
}

let narrowGaps = 0;
for (let y = 5; y < height - 5; y++) {
  for (let x = 5; x < width - 5; x++) {
    const idx = y * width + x;
    if (black[idx] === 0) { // white pixel
      // check horizontal gap: black left within 3px AND black right within 3px
      const hasBlackLeft = (black[idx - 1] || black[idx - 2] || black[idx - 3]);
      const hasBlackRight = (black[idx + 1] || black[idx + 2] || black[idx + 3]);
      const hasBlackTop = (black[idx - width] || black[idx - width * 2] || black[idx - width * 3]);
      const hasBlackBottom = (black[idx + width] || black[idx + width * 2] || black[idx + width * 3]);
      if ((hasBlackLeft && hasBlackRight) || (hasBlackTop && hasBlackBottom)) {
        narrowGaps++;
      }
    }
  }
}
console.log('Narrow white gaps (potential double lines):', narrowGaps);
