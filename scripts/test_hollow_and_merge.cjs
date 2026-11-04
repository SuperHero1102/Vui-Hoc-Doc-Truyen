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

function run(file, target) {
  let srcPath = path.join('backup/coloring_images.before-color-v1', file);
  const png = PNG.sync.read(fs.readFileSync(srcPath));
  const w = png.width, h = png.height;
  const total = w * h;

  const isBlack = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const lum = 0.299 * png.data[idx] + 0.587 * png.data[idx + 1] + 0.114 * png.data[idx + 2];
    isBlack[i] = (lum < 128 && png.data[idx + 3] > 50) ? 1 : 0;
  }

  // 1. Initial hollow of thick black areas > 5px (Chamfer dist > 15)
  const d0 = chamferDist(isBlack, 1, w, h);
  for (let i = 0; i < total; i++) {
    if (isBlack[i] === 1 && d0[i] > 15) {
      isBlack[i] = 0;
    }
  }

  // Fill narrow white gaps < 4px between black strokes
  for (let y = 3; y < h - 3; y++) {
    for (let x = 3; x < w - 3; x++) {
      const idx = y * w + x;
      if (isBlack[idx] === 0) {
        const l = isBlack[idx - 1] || isBlack[idx - 2] || isBlack[idx - 3];
        const r = isBlack[idx + 1] || isBlack[idx + 2] || isBlack[idx + 3];
        const u = isBlack[idx - w] || isBlack[idx - 2 * w] || isBlack[idx - 3 * w];
        const d = isBlack[idx + w] || isBlack[idx + 2 * w] || isBlack[idx + 3 * w];
        if ((l && r) || (u && d)) {
          isBlack[idx] = 1;
        }
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

  // Pre-clean small hollows & specks (< 300px) by turning them to black or merging
  // If a hollow is surrounded by black, turning it to black restores stroke
  // If it's near region, it merges
  for (let pass = 0; pass < 5; pass++) {
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

  // Merge loop
  for (let iter = 0; iter < 60; iter++) {
    let bg = getBgMask(isBlack);
    let { labels, regions } = getRegions(isBlack, bg);
    if (regions.length <= target && regions.every(r => r.length >= 1000)) break;
    if (regions.length <= 5) break;

    const sorted = regions.map((comp, idx) => ({ id: idx, count: comp.length, pixels: comp }))
                          .sort((a, b) => a.count - b.count);
    const smallest = sorted[0];

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
      for (const p of smallest.pixels) isBlack[p] = 1;
    }
  }

  // Clean specks
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

  // Check final thick spots (> 5px, dist > 15)
  const dFinal = chamferDist(isBlack, 1, w, h);
  let thickCount = 0;
  for (let i = 0; i < total; i++) {
    if (isBlack[i] === 1 && dFinal[i] > 15) thickCount++;
  }

  let finalBg = getBgMask(isBlack);
  let { regions: finalRegions } = getRegions(isBlack, finalBg);
  console.log(`${file}: regions=${finalRegions.length}, thickSpotsOver5px=${thickCount}`);
}

run('coloring_turtle.png', 8);
run('coloring_dog.png', 7);
run('coloring_cat.png', 6);
run('coloring_apple.png', 5);
