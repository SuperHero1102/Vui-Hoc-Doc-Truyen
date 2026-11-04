const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

function analyzeImage(filename) {
  const filePath = path.join('src/assets/images', filename);
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  const png = PNG.sync.read(fs.readFileSync(filePath));
  const w = png.width, h = png.height;
  const total = w * h;

  const isBlack = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const lum = 0.299 * png.data[idx] + 0.587 * png.data[idx + 1] + 0.114 * png.data[idx + 2];
    isBlack[i] = (lum < 128 && png.data[idx + 3] > 50) ? 1 : 0;
  }

  // Find background
  const isBg = new Uint8Array(total);
  const q = [];
  for (let x = 0; x < w; x++) {
    if (!isBlack[x]) { isBg[x] = 1; q.push(x); }
    const b = (h - 1) * w + x;
    if (!isBlack[b] && !isBg[b]) { isBg[b] = 1; q.push(b); }
  }
  for (let y = 0; y < h; y++) {
    const l = y * w;
    if (!isBlack[l] && !isBg[l]) { isBg[l] = 1; q.push(l); }
    const r = y * w + (w - 1);
    if (!isBlack[r] && !isBg[r]) { isBg[r] = 1; q.push(r); }
  }
  while (q.length > 0) {
    const curr = q.pop();
    const cx = curr % w, cy = Math.floor(curr / w);
    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const ni = ny * w + nx;
        if (!isBlack[ni] && !isBg[ni]) {
          isBg[ni] = 1;
          q.push(ni);
        }
      }
    }
  }

  // Label white regions
  const labels = new Int32Array(total);
  labels.fill(-1);
  const regions = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (!isBlack[idx] && !isBg[idx] && labels[idx] === -1) {
        const rId = regions.length;
        const comp = [idx];
        labels[idx] = rId;
        const rq = [idx];
        while (rq.length > 0) {
          const c = rq.pop();
          const cx = c % w, cy = Math.floor(c / w);
          for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
            const nx = cx + dx, ny = cy + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const ni = ny * w + nx;
              if (!isBlack[ni] && !isBg[ni] && labels[ni] === -1) {
                labels[ni] = rId;
                rq.push(ni);
                comp.push(ni);
              }
            }
          }
        }
        regions.push(comp);
      }
    }
  }

  console.log(`${filename}: Total white non-bg regions = ${regions.length}`);
  const sorted = regions.map((r, i) => ({ id: i, count: r.length })).sort((a,b) => a.count - b.count);
  console.log('Smallest 5:', sorted.slice(0, 5));
  console.log('Largest 5:', sorted.slice(-5));
}

analyzeImage('coloring_turtle.png');
analyzeImage('coloring_boat.png');
analyzeImage('coloring_train.png');
analyzeImage('coloring_apple.png');
