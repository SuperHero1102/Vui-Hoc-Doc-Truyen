const fs = require('fs');
const { PNG } = require('pngjs');

function analyzeSubject(name) {
  const buf = fs.readFileSync(`src/assets/accessories/${name}`);
  const png = PNG.sync.read(buf);
  const { width, height, data } = png;

  // Flood fill background from (0,0)
  const isBg = new Uint8Array(width * height);
  const queue = [0, width - 1, (height - 1) * width, width * height - 1];
  for (const q of queue) isBg[q] = 1;

  while (queue.length > 0) {
    const curr = queue.pop();
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    const neighbors = [
      cy > 0 ? curr - width : -1,
      cy < height - 1 ? curr + width : -1,
      cx > 0 ? curr - 1 : -1,
      cx < width - 1 ? curr + 1 : -1,
    ];

    for (const n of neighbors) {
      if (n >= 0 && isBg[n] === 0) {
        const r = data[n * 4];
        const g = data[n * 4 + 1];
        const b = data[n * 4 + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        // Background is dark
        if (lum < 50) {
          isBg[n] = 1;
          queue.push(n);
        }
      }
    }
  }

  let bgCount = 0;
  for (let i = 0; i < width * height; i++) if (isBg[i] === 1) bgCount++;

  console.log(`${name}: Total pixels ${width * height}, Background pixels: ${bgCount} (${(bgCount/(width*height)*100).toFixed(1)}%)`);
}

analyzeSubject('hat_doctor_hat.png');
analyzeSubject('hat_chef_hat.png');
analyzeSubject('hat_crown.png');
analyzeSubject('plush_teddy_bear.png');
