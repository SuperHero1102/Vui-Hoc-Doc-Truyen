const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

function processTest(filename, targetMaxRegions = 10) {
  const filePath = path.join('src/assets/images', filename);
  const png = PNG.sync.read(fs.readFileSync(filePath));
  const w = png.width, h = png.height;
  const total = w * h;

  let isBlack = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const lum = 0.299 * png.data[idx] + 0.587 * png.data[idx + 1] + 0.114 * png.data[idx + 2];
    isBlack[i] = (lum < 128 && png.data[idx + 3] > 50) ? 1 : 0;
  }

  // Clear outer border 12px
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x < 12 || x >= w - 12 || y < 12 || y >= h - 12) {
        isBlack[y * w + x] = 0;
      }
    }
  }

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

  // 1. Remove tiny specks / noise (< 200 pixels)
  for (let pass = 0; pass < 5; pass++) {
    let bg = getBgMask(isBlack);
    let { regions } = getRegions(isBlack, bg);
    let changed = false;
    for (let r = 0; r < regions.length; r++) {
      if (regions[r].length < 250) {
        for (const p of regions[r]) isBlack[p] = 1;
        changed = true;
      }
    }
    if (!changed) break;
  }

  // 2. Iteratively merge small regions into their largest neighbor
  for (let iter = 0; iter < 50; iter++) {
    let bg = getBgMask(isBlack);
    let { labels, regions } = getRegions(isBlack, bg);
    if (regions.length <= targetMaxRegions && regions.every(r => r.length >= 1200)) {
      break;
    }
    if (regions.length <= 6) {
      break;
    }

    const sorted = regions.map((comp, idx) => ({ id: idx, count: comp.length, pixels: comp }))
                          .sort((a, b) => a.count - b.count);
    const smallest = sorted[0];

    // Find border black pixels of smallest
    const borderBlack = new Set();
    for (const p of smallest.pixels) {
      const cx = p % w, cy = Math.floor(p / w);
      for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const ni = ny * w + nx;
          if (isBlack[ni]) borderBlack.add(ni);
        }
      }
    }

    const dist = new Int16Array(total);
    dist.fill(999);
    const q = [];
    for (const bp of borderBlack) {
      dist[bp] = 1;
      q.push(bp);
    }

    const neighborCounts = new Map();
    const dividingPixels = new Map();

    let head = 0;
    while (head < q.length) {
      const curr = q[head++];
      const d = dist[curr];
      const cx = curr % w, cy = Math.floor(curr / w);
      if (d >= 8) continue;
      for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const ni = ny * w + nx;
          if (isBlack[ni] && dist[ni] > d + 1) {
            dist[ni] = d + 1;
            q.push(ni);
          } else if (!isBlack[ni]) {
            const nLbl = labels[ni];
            if (nLbl >= 0 && nLbl !== smallest.id) {
              neighborCounts.set(nLbl, (neighborCounts.get(nLbl) || 0) + 1);
              if (!dividingPixels.has(nLbl)) dividingPixels.set(nLbl, []);
              dividingPixels.get(nLbl).push(curr);
            }
          }
        }
      }
    }

    let bestNeighbor = -1, maxContact = 0;
    for (const [nLbl, contact] of neighborCounts.entries()) {
      if (contact > maxContact) {
        maxContact = contact;
        bestNeighbor = nLbl;
      }
    }

    if (bestNeighbor >= 0 && dividingPixels.has(bestNeighbor)) {
      const wallPixels = dividingPixels.get(bestNeighbor);
      for (const wp of wallPixels) {
        isBlack[wp] = 0;
        const cx = wp % w, cy = Math.floor(wp / w);
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = cx + dx, ny = cy + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const ni = ny * w + nx;
              if (isBlack[ni] && !bg[ni]) {
                isBlack[ni] = 0;
              }
            }
          }
        }
      }
    } else {
      // Surrounded speck: turn to black
      for (const p of smallest.pixels) isBlack[p] = 1;
    }
  }

  // Final speck cleanup
  for (let pass = 0; pass < 3; pass++) {
    let bg = getBgMask(isBlack);
    let { regions } = getRegions(isBlack, bg);
    let changed = false;
    for (let r = 0; r < regions.length; r++) {
      if (regions[r].length < 350) {
        for (const p of regions[r]) isBlack[p] = 1;
        changed = true;
      }
    }
    if (!changed) break;
  }

  let finalBg = getBgMask(isBlack);
  let { regions: finalRegions } = getRegions(isBlack, finalBg);
  console.log(`${filename}: final regions = ${finalRegions.length}, sizes:`,
    finalRegions.map(r => r.length).sort((a,b) => a-b)
  );
}

processTest('coloring_dog.png', 8);
processTest('coloring_rabbit.png', 8);
processTest('coloring_rocket.png', 8);
processTest('coloring_panda.png', 10);
