const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

function testMerge(filename) {
  const filePath = path.join('src/assets/images', filename);
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
  function getBgMask(black) {
    const isBg = new Uint8Array(total);
    const q = [];
    for (let x = 0; x < w; x++) {
      if (!black[x]) { isBg[x] = 1; q.push(x); }
      const b = (h - 1) * w + x;
      if (!black[b] && !isBg[b]) { isBg[b] = 1; q.push(b); }
    }
    for (let y = 0; y < h; y++) {
      const l = y * w;
      if (!black[l] && !isBg[l]) { isBg[l] = 1; q.push(l); }
      const r = y * w + (w - 1);
      if (!black[r] && !isBg[r]) { isBg[r] = 1; q.push(r); }
    }
    while (q.length > 0) {
      const curr = q.pop();
      const cx = curr % w, cy = Math.floor(curr / w);
      for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const ni = ny * w + nx;
          if (!black[ni] && !isBg[ni]) {
            isBg[ni] = 1;
            q.push(ni);
          }
        }
      }
    }
    return isBg;
  }

  function getRegions(black, isBg) {
    const labels = new Int32Array(total);
    labels.fill(-1);
    const regions = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        if (!black[idx] && !isBg[idx] && labels[idx] === -1) {
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
                if (!black[ni] && !isBg[ni] && labels[ni] === -1) {
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
    return { labels, regions };
  }

  let bg = getBgMask(isBlack);
  let { labels, regions } = getRegions(isBlack, bg);
  console.log(`Initial non-bg regions for ${filename}:`, regions.length);
}

testMerge('coloring_turtle.png');
testMerge('coloring_apple.png');
testMerge('coloring_boat.png');
