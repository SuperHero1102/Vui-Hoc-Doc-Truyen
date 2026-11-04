const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

function chamferDist(mask, targetVal, w, h) {
  const total = w * h;
  const INF = 999999;
  const dist = new Int32Array(total);
  for (let i = 0; i < total; i++) dist[i] = mask[i] === targetVal ? INF : 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (dist[idx] > 0) {
        let d = dist[idx];
        if (x > 0) d = Math.min(d, dist[idx - 1] + 3);
        if (y > 0) {
          d = Math.min(d, dist[idx - w] + 3);
          if (x > 0) d = Math.min(d, dist[idx - w - 1] + 4);
          if (x < w - 1) d = Math.min(d, dist[idx - w + 1] + 4);
        }
        dist[idx] = d;
      }
    }
  }
  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const idx = y * w + x;
      if (dist[idx] > 0) {
        let d = dist[idx];
        if (x < w - 1) d = Math.min(d, dist[idx + 1] + 3);
        if (y < h - 1) {
          d = Math.min(d, dist[idx + w] + 3);
          if (x > 0) d = Math.min(d, dist[idx + w - 1] + 4);
          if (x < w - 1) d = Math.min(d, dist[idx + w + 1] + 4);
        }
        dist[idx] = d;
      }
    }
  }
  return dist;
}

// Check how V8 ensured 0 thick spots
function checkAndHollow(filename) {
  const filePath = path.join('src/assets/images', filename);
  const png = PNG.sync.read(fs.readFileSync(filePath));
  const w = png.width, h = png.height;
  const total = w * h;

  const isBlack = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const lum = 0.299 * png.data[idx] + 0.587 * png.data[idx + 1] + 0.114 * png.data[idx + 2];
    isBlack[i] = lum < 128 ? 1 : 0;
  }

  let dist = chamferDist(isBlack, 1, w, h);
  let over15 = 0;
  for (let i = 0; i < total; i++) {
    if (dist[i] > 15) over15++;
  }
  console.log(filename, 'over 15 before:', over15);

  // If over15 > 0, we can hollow pixels with dist > 15 to 0 (white)
  // or erode them to neighbor
  for (let i = 0; i < total; i++) {
    if (isBlack[i] === 1 && dist[i] > 15) {
      isBlack[i] = 0;
    }
  }

  let distAfter = chamferDist(isBlack, 1, w, h);
  let over15After = 0;
  for (let i = 0; i < total; i++) {
    if (distAfter[i] > 15) over15After++;
  }
  console.log(filename, 'over 15 after:', over15After);
}

checkAndHollow('coloring_turtle.png');
checkAndHollow('coloring_apple.png');
