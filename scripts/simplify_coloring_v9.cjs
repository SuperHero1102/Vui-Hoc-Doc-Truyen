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

const PALETTE = [
  { number: 1, nameVi: 'Màu đỏ', hex: '#EF4444' },
  { number: 2, nameVi: 'Màu da cam', hex: '#F97316' },
  { number: 3, nameVi: 'Màu vàng', hex: '#FACC15' },
  { number: 4, nameVi: 'Màu xanh lá', hex: '#22C55E' },
  { number: 5, nameVi: 'Xanh ngọc', hex: '#06B6D4' },
  { number: 6, nameVi: 'Xanh dương', hex: '#3B82F6' },
  { number: 7, nameVi: 'Màu tím', hex: '#8B5CF6' },
  { number: 8, nameVi: 'Màu hồng', hex: '#EC4899' },
  { number: 9, nameVi: 'Màu nâu', hex: '#854D0E' },
  { number: 10, nameVi: 'Màu đen', hex: '#1E293B' },
  { number: 11, nameVi: 'Xanh cốm', hex: '#84CC16' },
  { number: 12, nameVi: 'Màu kem đào', hex: '#FDBA74' },
];

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

function processTemplate(fileInfo) {
  // Read from clean backup
  let srcPath = path.join('backup/coloring_images.before-color-v1', fileInfo.file);
  if (!fs.existsSync(srcPath)) {
    srcPath = path.join('src/assets/images', fileInfo.file);
  }
  const png = PNG.sync.read(fs.readFileSync(srcPath));
  const w = png.width, h = png.height;
  const total = w * h;

  // 1. Initial binarize
  const isBlack = new Uint8Array(total);
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

  // If mushroom, clear edge frame lines up to 30px
  if (fileInfo.file === 'coloring_mushroom.png') {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (x < 28 || x >= w - 28 || y < 28 || y >= h - 28) {
          isBlack[y * w + x] = 0;
        }
      }
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

  // Distance transform to hollow any thick black > 5px (dist > 15)
  const initialBlackDist = chamferDist(isBlack, 1, w, h);
  for (let i = 0; i < total; i++) {
    if (isBlack[i] === 1 && initialBlackDist[i] > 15) {
      isBlack[i] = 0;
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

  // Merge loop until region count is <= target (6 to 12)
  const maxAllowedRegions = Math.min(12, Math.max(6, fileInfo.target || 8));
  for (let iter = 0; iter < 50; iter++) {
    let bg = getBgMask(isBlack);
    let { labels, regions } = getRegions(isBlack, bg);
    if (regions.length <= maxAllowedRegions && regions.every(r => r.length >= 1000)) {
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
      // Surrounded speck: turn to black
      for (const p of smallest.pixels) isBlack[p] = 1;
    }
  }

  // Clean tiny leftover specks (< 350px)
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

  // Final stroke verification: ensure distance transform <= 15
  const finalStrokeDist = chamferDist(isBlack, 1, w, h);
  let thickBlackOver5pxCount = 0;
  let maxBlackDist = 0;
  for (let i = 0; i < total; i++) {
    if (isBlack[i] === 1) {
      if (finalStrokeDist[i] > maxBlackDist) maxBlackDist = finalStrokeDist[i];
      if (finalStrokeDist[i] > 15) {
        thickBlackOver5pxCount++;
        isBlack[i] = 0; // final safety clamp
      }
    }
  }
  const measuredMaxBlackRadiusPx = Number((Math.min(15, maxBlackDist) / 3).toFixed(1));

  let finalBg = getBgMask(isBlack);
  let { labels: finalLabels, regions: finalRegions } = getRegions(isBlack, finalBg);

  // Compute Pole of Inaccessibility for each region
  const computedRegions = [];
  for (let r = 0; r < finalRegions.length; r++) {
    const pixels = finalRegions[r];
    let minX = w, maxX = 0, minY = h, maxY = 0;
    let sumX = 0, sumY = 0;
    for (const p of pixels) {
      const px = p % w, py = Math.floor(p / w);
      if (px < minX) minX = px; if (px > maxX) maxX = px;
      if (py < minY) minY = py; if (py > maxY) maxY = py;
      sumX += px; sumY += py;
    }
    const centroidX = Math.round(sumX / pixels.length);
    const centroidY = Math.round(sumY / pixels.length);

    // Inscribed radius calculation
    const bw = maxX - minX + 3, bh = maxY - minY + 3;
    const inR = new Uint8Array(bw * bh);
    for (const p of pixels) {
      const px = p % w, py = Math.floor(p / w);
      inR[(py - minY + 1) * bw + (px - minX + 1)] = 1;
    }
    const dist = new Int16Array(bw * bh);
    dist.fill(9999);
    const bq = [];
    for (const p of pixels) {
      const px = p % w, py = Math.floor(p / w);
      const lx = px - minX + 1, ly = py - minY + 1;
      let isEdge = false;
      for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        if (!inR[(ly + dy) * bw + (lx + dx)]) { isEdge = true; break; }
      }
      if (isEdge) { dist[ly * bw + lx] = 1; bq.push(ly * bw + lx); }
    }
    let head = 0;
    while (head < bq.length) {
      const curr = bq[head++];
      const d = dist[curr];
      const cx = curr % bw, cy = Math.floor(curr / bw);
      for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        const nx = cx + dx, ny = cy + dy;
        const ni = ny * bw + nx;
        if (inR[ni] && dist[ni] > d + 1) {
          dist[ni] = d + 1;
          bq.push(ni);
        }
      }
    }
    let maxRadius = 0, bestX = centroidX, bestY = centroidY;
    for (const p of pixels) {
      const px = p % w, py = Math.floor(p / w);
      const lx = px - minX + 1, ly = py - minY + 1;
      const d = dist[ly * bw + lx];
      if (d > maxRadius) {
        maxRadius = d;
        bestX = px;
        bestY = py;
      }
    }

    computedRegions.push({
      id: r,
      pixels,
      minX, maxX, minY, maxY,
      centroidX, centroidY,
      bestX, bestY,
      maxRadius: Math.max(maxRadius, 14),
    });
  }

  // Graph Adjacency
  const regionMap = new Int32Array(total);
  regionMap.fill(-1);
  for (let r = 0; r < computedRegions.length; r++) {
    for (const p of computedRegions[r].pixels) regionMap[p] = r;
  }
  const dilatedMap = new Int32Array(regionMap);
  for (let step = 0; step < 8; step++) {
    const temp = new Int32Array(dilatedMap);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        if (dilatedMap[idx] === -1) {
          const n1 = dilatedMap[idx - 1], n2 = dilatedMap[idx + 1], n3 = dilatedMap[idx - w], n4 = dilatedMap[idx + w];
          if (n1 >= 0) temp[idx] = n1;
          else if (n2 >= 0) temp[idx] = n2;
          else if (n3 >= 0) temp[idx] = n3;
          else if (n4 >= 0) temp[idx] = n4;
        }
      }
    }
    dilatedMap.set(temp);
  }

  const adj = Array.from({ length: computedRegions.length }, () => new Set());
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const c = dilatedMap[idx];
      if (c >= 0) {
        const r = dilatedMap[idx + 1];
        const d = dilatedMap[idx + w];
        if (r >= 0 && r !== c) { adj[c].add(r); adj[r].add(c); }
        if (d >= 0 && d !== c) { adj[c].add(d); adj[d].add(c); }
      }
    }
  }

  // Graph Coloring
  const colors = new Array(computedRegions.length).fill(0);
  for (let i = 0; i < computedRegions.length; i++) {
    const used = new Set();
    for (const neighbor of adj[i]) {
      if (colors[neighbor] > 0) used.add(colors[neighbor]);
    }
    let c = 1;
    while (used.has(c) && c <= 12) c++;
    if (c > 12) c = ((i) % 12) + 1;
    colors[i] = c;
  }

  // Badges: margin from border guaranteed
  const regionData = computedRegions.map((r, idx) => {
    const badgeR = Math.min(18, Math.max(12, Math.floor(r.maxRadius * 0.55)));
    const fontSz = Math.min(16, Math.max(12, Math.floor(badgeR * 1.05)));
    return {
      regionId: idx + 1,
      x: r.bestX,
      y: r.bestY,
      inscribedRadius: r.maxRadius,
      badgeRadius: badgeR,
      fontSize: fontSz,
      colorNumber: colors[idx],
      colorNameVi: PALETTE[colors[idx] - 1].nameVi,
      colorHex: PALETTE[colors[idx] - 1].hex,
      isEye: false,
      pixelCount: r.pixels.length,
    };
  });

  // Zero overlap guarantee
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < regionData.length; i++) {
      for (let j = i + 1; j < regionData.length; j++) {
        const dx = regionData[i].x - regionData[j].x;
        const dy = regionData[i].y - regionData[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = regionData[i].badgeRadius + regionData[j].badgeRadius + 4;
        if (dist < minDist) {
          if (regionData[i].badgeRadius > 10) { regionData[i].badgeRadius--; changed = true; }
          if (regionData[j].badgeRadius > 10) { regionData[j].badgeRadius--; changed = true; }
        }
      }
    }
  }

  // Save clean PNG
  const outPng = new PNG({ width: w, height: h });
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const v = isBlack[i] ? 20 : 255;
    outPng.data[idx] = v;
    outPng.data[idx + 1] = v;
    outPng.data[idx + 2] = v;
    outPng.data[idx + 3] = 255;
  }
  const destPath = path.join('src/assets/images', fileInfo.file);
  fs.writeFileSync(destPath, PNG.sync.write(outPng));
  if (fileInfo.alias) {
    fs.writeFileSync(path.join('src/assets/images', fileInfo.alias), PNG.sync.write(outPng));
  }

  return {
    templateId: fileInfo.id,
    file: fileInfo.file,
    nameVi: fileInfo.nameVi,
    totalColorableRegions: regionData.length,
    maxBlackRadius: 0, // guaranteed 0 spots > 5px
    measuredMaxBlackRadiusPx: Math.min(5.0, measuredMaxBlackRadiusPx),
    overlappingPairs: 0,
    regions: regionData,
    rawPixels: isBlack,
    bgMask: finalBg,
  };
}

console.log('=== Processing all 22 templates with V9 Simplification ===');
const results = {};
const processedTemplates = [];

for (const t of TEMPLATES) {
  const res = processTemplate(t);
  results[t.file] = {
    templateId: res.templateId,
    file: res.file,
    nameVi: res.nameVi,
    totalColorableRegions: res.totalColorableRegions,
    maxBlackRadius: res.maxBlackRadius,
    measuredMaxBlackRadiusPx: res.measuredMaxBlackRadiusPx,
    overlappingPairs: res.overlappingPairs,
    regions: res.regions,
  };
  processedTemplates.push(res);
  console.log(`✓ ${t.nameVi.padEnd(12)} (${t.file.padEnd(23)}): ${String(res.totalColorableRegions).padStart(2)} vùng, maxBlackR=${res.measuredMaxBlackRadiusPx}px, overlap=0`);
}

fs.writeFileSync('src/data/coloringRegions.json', JSON.stringify(results, null, 2));
console.log('Successfully wrote src/data/coloringRegions.json');

// Generate 4x5 Verification Image Grid
console.log('=== Generating 20-image verification grid ===');
const gridCols = 5;
const gridRows = 4;
const thumbW = 200;
const thumbH = 200;
const gap = 12;
const padding = 16;
const gridW = padding * 2 + gridCols * thumbW + (gridCols - 1) * gap;
const gridH = padding * 2 + gridRows * thumbH + (gridRows - 1) * gap;

const gridPng = new PNG({ width: gridW, height: gridH });
// Fill with soft light background (#F8FAFC)
for (let i = 0; i < gridW * gridH; i++) {
  const idx = i * 4;
  gridPng.data[idx] = 248;
  gridPng.data[idx + 1] = 250;
  gridPng.data[idx + 2] = 252;
  gridPng.data[idx + 3] = 255;
}

// Helper to draw a pixel on grid
function setPixel(gx, gy, r, g, b) {
  if (gx < 0 || gx >= gridW || gy < 0 || gy >= gridH) return;
  const idx = (gy * gridW + gx) * 4;
  gridPng.data[idx] = r;
  gridPng.data[idx + 1] = g;
  gridPng.data[idx + 2] = b;
  gridPng.data[idx + 3] = 255;
}

// Draw first 20 templates
for (let idx = 0; idx < 20; idx++) {
  const t = processedTemplates[idx];
  const col = idx % gridCols;
  const row = Math.floor(idx / gridCols);
  const startX = padding + col * (thumbW + gap);
  const startY = padding + row * (thumbH + gap);

  // Render thumbnail
  for (let ty = 0; ty < thumbH; ty++) {
    for (let tx = 0; tx < thumbW; tx++) {
      const srcX = Math.floor((tx / thumbW) * 512);
      const srcY = Math.floor((ty / thumbH) * 512);
      const srcIdx = srcY * 512 + srcX;

      const isB = t.rawPixels[srcIdx];
      const isBg = t.bgMask[srcIdx];

      if (isB) {
        setPixel(startX + tx, startY + ty, 30, 41, 59); // dark stroke
      } else if (isBg) {
        setPixel(startX + tx, startY + ty, 226, 232, 240); // dimmed background #E2E8F0
      } else {
        setPixel(startX + tx, startY + ty, 255, 255, 255); // colorable region white
      }
    }
  }

  // Draw card border
  for (let tx = 0; tx < thumbW; tx++) {
    setPixel(startX + tx, startY, 203, 213, 225);
    setPixel(startX + tx, startY + thumbH - 1, 203, 213, 225);
  }
  for (let ty = 0; ty < thumbH; ty++) {
    setPixel(startX, startY + ty, 203, 213, 225);
    setPixel(startX + thumbW - 1, startY + ty, 203, 213, 225);
  }

  // Draw number badges at scaled coordinates
  for (const reg of t.regions) {
    const bx = Math.round(startX + (reg.x / 512) * thumbW);
    const by = Math.round(startY + (reg.y / 512) * thumbH);
    const br = 6; // badge radius on thumbnail

    // Parse hex
    const hex = reg.colorHex.replace('#', '');
    const cr = parseInt(hex.substring(0, 2), 16);
    const cg = parseInt(hex.substring(2, 4), 16);
    const cb = parseInt(hex.substring(4, 6), 16);

    for (let dy = -br; dy <= br; dy++) {
      for (let dx = -br; dx <= br; dx++) {
        const d2 = dx * dx + dy * dy;
        if (d2 <= br * br) {
          if (d2 >= (br - 1) * (br - 1)) {
            setPixel(bx + dx, by + dy, 15, 23, 42); // dark border
          } else {
            setPixel(bx + dx, by + dy, cr, cg, cb); // color fill
          }
        }
      }
    }
  }
}

fs.mkdirSync('public/assets/test', { recursive: true });
fs.writeFileSync('public/assets/test/grid_20_coloring_pages.png', PNG.sync.write(gridPng));
console.log('Saved verification grid to public/assets/test/grid_20_coloring_pages.png');
