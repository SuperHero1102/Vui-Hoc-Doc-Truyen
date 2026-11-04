const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const TEMPLATES = [
  { id: 'sea-turtle', file: 'coloring_turtle.png', alias: 'coloring_sea_turtle.png', nameVi: 'Rùa biển', target: 9 },
  { id: 'happy-puppy', file: 'coloring_dog.png', alias: 'coloring_puppy.png', nameVi: 'Cún con', target: 8 },
  { id: 'kitty-yarn', file: 'coloring_cat.png', alias: 'coloring_kitty.png', nameVi: 'Mèo con', target: 8 },
  { id: 'bunny-carrot', file: 'coloring_rabbit.png', alias: 'coloring_bunny.png', nameVi: 'Thỏ con', target: 8 },
  { id: 'picnic-car', file: 'coloring_car.png', nameVi: 'Xe ô tô', target: 9 },
  { id: 'choo-choo-train', file: 'coloring_train.png', nameVi: 'Tàu hỏa', target: 9 },
  { id: 'space-rocket', file: 'coloring_rocket.png', nameVi: 'Tên lửa', target: 8 },
  { id: 'sun-rainbow', file: 'coloring_rainbow.png', nameVi: 'Cầu vồng', target: 8 },
  { id: 'birthday-cake', file: 'coloring_cake.png', nameVi: 'Bánh kem', target: 7 },
  { id: 'magic-fish', file: 'coloring_goldfish.png', nameVi: 'Cá vàng', target: 7 },
  { id: 'baby-elephant', file: 'coloring_elephant.png', nameVi: 'Voi con', target: 8 },
  { id: 'brave-lion', file: 'coloring_lion.png', nameVi: 'Sư tử', target: 9 },
  { id: 'friendly-dino', file: 'coloring_dino.png', nameVi: 'Khủng long', target: 8 },
  { id: 'jumping-dolphin', file: 'coloring_dolphin.png', nameVi: 'Cá heo', target: 7 },
  { id: 'swimming-duck', file: 'coloring_duck.png', nameVi: 'Vịt con', target: 7 },
  { id: 'panda-bear', file: 'coloring_panda.png', nameVi: 'Gấu trúc', target: 9 },
  { id: 'magic-castle', file: 'coloring_castle.png', nameVi: 'Lâu đài', target: 8 },
  { id: 'sailing-boat', file: 'coloring_boat.png', nameVi: 'Thuyền buồm', target: 9 },
  { id: 'ice-cream', file: 'coloring_icecream.png', nameVi: 'Kem ốc quế', target: 7 },
  { id: 'red-apple', file: 'coloring_apple.png', nameVi: 'Quả táo', target: 7 },
  { id: 'rescue-helicopter', file: 'coloring_helicopter.png', nameVi: 'Trực thăng', target: 8 },
  { id: 'magic-mushroom', file: 'coloring_mushroom.png', nameVi: 'Cây nấm', target: 7 },
];

function processTest(t) {
  let srcPath = path.join('backup/coloring_images.before-color-v1', t.file);
  const png = PNG.sync.read(fs.readFileSync(srcPath));
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

  // Pre-clean specks (< 250px)
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

  // Merge loop
  for (let iter = 0; iter < 50; iter++) {
    let bg = getBgMask(isBlack);
    let { labels, regions } = getRegions(isBlack, bg);
    if (regions.length <= t.target && regions.every(r => r.length >= 1000)) {
      break;
    }
    if (regions.length <= 6) {
      break;
    }

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

  // Clean tiny specks (< 350px)
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
  console.log(`${t.nameVi.padEnd(12)} (${t.file.padEnd(23)}): ${finalRegions.length} regions, min=${Math.min(...finalRegions.map(r=>r.length))}, max=${Math.max(...finalRegions.map(r=>r.length))}`);
}

for (const t of TEMPLATES) {
  processTest(t);
}
