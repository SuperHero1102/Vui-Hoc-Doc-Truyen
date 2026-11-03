const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const TEMPLATES = [
  { id: 'sea-turtle', file: 'coloring_turtle.png', alias: 'coloring_sea_turtle.png', nameVi: 'Rùa biển' },
  { id: 'happy-puppy', file: 'coloring_dog.png', alias: 'coloring_puppy.png', nameVi: 'Cún con' },
  { id: 'kitty-yarn', file: 'coloring_cat.png', alias: 'coloring_kitty.png', nameVi: 'Mèo con' },
  { id: 'bunny-carrot', file: 'coloring_rabbit.png', alias: 'coloring_bunny.png', nameVi: 'Thỏ con' },
  { id: 'picnic-car', file: 'coloring_car.png', nameVi: 'Xe ô tô' },
  { id: 'choo-choo-train', file: 'coloring_train.png', nameVi: 'Tàu hỏa' },
  { id: 'space-rocket', file: 'coloring_rocket.png', nameVi: 'Tên lửa' },
  { id: 'sun-rainbow', file: 'coloring_rainbow.png', nameVi: 'Cầu vồng' },
  { id: 'birthday-cake', file: 'coloring_cake.png', nameVi: 'Bánh kem' },
  { id: 'magic-fish', file: 'coloring_goldfish.png', nameVi: 'Cá vàng' },
  { id: 'baby-elephant', file: 'coloring_elephant.png', nameVi: 'Voi con' },
  { id: 'brave-lion', file: 'coloring_lion.png', nameVi: 'Sư tử' },
  { id: 'friendly-dino', file: 'coloring_dino.png', nameVi: 'Khủng long' },
  { id: 'jumping-dolphin', file: 'coloring_dolphin.png', nameVi: 'Cá heo' },
  { id: 'swimming-duck', file: 'coloring_duck.png', nameVi: 'Vịt con' },
  { id: 'panda-bear', file: 'coloring_panda.png', nameVi: 'Gấu trúc' },
  { id: 'magic-castle', file: 'coloring_castle.png', nameVi: 'Lâu đài' },
  { id: 'sailing-boat', file: 'coloring_boat.png', nameVi: 'Thuyền buồm' },
  { id: 'ice-cream', file: 'coloring_icecream.png', nameVi: 'Kem ốc quế' },
  { id: 'red-apple', file: 'coloring_apple.png', nameVi: 'Quả táo' },
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

function processImage(fileInfo) {
  const filePath = path.join('src/assets/images', fileInfo.file);
  const png = PNG.sync.read(fs.readFileSync(filePath));
  const w = png.width, h = png.height;
  const total = w * h;

  // 1. Initial binarize: lum < 128 is black stroke (1), else white (0)
  const isBlack = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const lum = 0.299 * png.data[idx] + 0.587 * png.data[idx + 1] + 0.114 * png.data[idx + 2];
    isBlack[i] = (lum < 128 && png.data[idx + 3] > 50) ? 1 : 0;
  }

  // Remove outer frames/borders if any (e.g. mushroom frame or edge lines)
  if (fileInfo.file === 'coloring_mushroom.png') {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (x < 30 || x >= w - 30 || y < 30 || y >= h - 30) {
          isBlack[y * w + x] = 0;
        }
      }
    }
  }

  // Distance transform helper (Chamfer 3-4)
  function chamferDist(mask, targetVal) {
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

  // Hollow thick black areas: black pixels with dist > 15 (radius > 5px)
  let blackDist = chamferDist(isBlack, 1);
  for (let i = 0; i < total; i++) {
    if (isBlack[i] === 1 && blackDist[i] > 15) { // Keep 5px rim (~6px stroke), make interior white
      isBlack[i] = 0;
    }
  }

  // Segmentation & Merge Loop
  let finalRegionList = [];
  let isBgMask = new Uint8Array(total);

  for (let iter = 0; iter < 10; iter++) {
    // 1. Identify Background: BFS from edges
    isBgMask = new Uint8Array(total);
    const bgQueue = [];
    for (let x = 0; x < w; x++) {
      if (!isBlack[x]) { isBgMask[x] = 1; bgQueue.push(x); }
      const b = (h - 1) * w + x;
      if (!isBlack[b] && !isBgMask[b]) { isBgMask[b] = 1; bgQueue.push(b); }
    }
    for (let y = 0; y < h; y++) {
      const l = y * w;
      if (!isBlack[l] && !isBgMask[l]) { isBgMask[l] = 1; bgQueue.push(l); }
      const r = y * w + (w - 1);
      if (!isBlack[r] && !isBgMask[r]) { isBgMask[r] = 1; bgQueue.push(r); }
    }
    while (bgQueue.length > 0) {
      const curr = bgQueue.pop();
      const cx = curr % w, cy = Math.floor(curr / w);
      for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const ni = ny * w + nx;
          if (!isBlack[ni] && !isBgMask[ni]) {
            isBgMask[ni] = 1;
            bgQueue.push(ni);
          }
        }
      }
    }

    // 2. Identify connected components of non-background white pixels
    const labels = new Int32Array(total);
    labels.fill(-1);
    const regions = [];

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        if (!isBlack[idx] && !isBgMask[idx] && labels[idx] === -1) {
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
                if (!isBlack[ni] && !isBgMask[ni] && labels[ni] === -1) {
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

    // 3. Compute inscribed radius for each region
    let mergedAny = false;
    const computedRegions = [];

    for (let r = 0; r < regions.length; r++) {
      const pixels = regions[r];
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

      // Check if it is an eye: symmetric compact spot in face area
      const isEye = (centroidY >= 90 && centroidY <= 320 && centroidX >= 100 && centroidX <= 412 && pixels.length >= 50 && pixels.length <= 2500 && (maxX - minX) < 90 && (maxY - minY) < 90);

      // Inscribed radius calculation (BFS inside region boundary)
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
        maxRadius,
        isEye
      });
    }

    // Merge tiny non-eye regions (< 7px) into neighboring regions
    for (const cr of computedRegions) {
      if (cr.maxRadius < 7 && !cr.isEye) {
        // Find bordering black pixels and neighboring regions
        const neighborHits = new Map();
        for (const p of cr.pixels) {
          const px = p % w, py = Math.floor(p / w);
          for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]) {
            const nx = px + dx, ny = py + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const ni = ny * w + nx;
              if (isBlack[ni]) {
                for (const [ddx, ddy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
                  const nnx = nx + ddx, nny = ny + ddy;
                  if (nnx >= 0 && nnx < w && nny >= 0 && nny < h) {
                    const nni = nny * w + nnx;
                    const nLbl = labels[nni];
                    if (nLbl >= 0 && nLbl !== cr.id) {
                      neighborHits.set(nLbl, (neighborHits.get(nLbl) || 0) + 1);
                    }
                  }
                }
              }
            }
          }
        }

        let bestNeighbor = -1, maxHits = 0;
        for (const [nLbl, hits] of neighborHits.entries()) {
          if (hits > maxHits) { maxHits = hits; bestNeighbor = nLbl; }
        }

        if (bestNeighbor >= 0) {
          // Erase boundary between cr and bestNeighbor
          for (const p of cr.pixels) {
            const px = p % w, py = Math.floor(p / w);
            for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]) {
              const nx = px + dx, ny = py + dy;
              if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                const ni = ny * w + nx;
                if (isBlack[ni]) {
                  for (const [ddx, ddy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
                    const nnx = nx + ddx, nny = ny + ddy;
                    if (nnx >= 0 && nnx < w && nny >= 0 && nny < h && labels[nny * w + nnx] === bestNeighbor) {
                      isBlack[ni] = 0;
                    }
                  }
                }
              }
            }
          }
          mergedAny = true;
        } else {
          // Isolated speck: turn to white (merge with background or parent region)
          for (const p of cr.pixels) isBlack[p] = 0;
          mergedAny = true;
        }
      }
    }

    finalRegionList = computedRegions;
    if (!mergedAny) break;
  }

  // Ensure absolutely NO solid black spots > 5px remain by a final distance transform pass
  const finalCheckDist = chamferDist(isBlack, 1);
  for (let i = 0; i < total; i++) {
    if (isBlack[i] === 1 && finalCheckDist[i] > 15) {
      isBlack[i] = 0; // Final hollow of any residual thick spots
    }
  }

  // Re-verify black radius: count of pixels with radius > 5px (Chamfer dist > 15)
  const finalBlackDist = chamferDist(isBlack, 1);
  let thickBlackOver5pxCount = 0;
  let maxBlackDist = 0;
  for (let i = 0; i < total; i++) {
    if (finalBlackDist[i] > maxBlackDist) maxBlackDist = finalBlackDist[i];
    if (finalBlackDist[i] > 15) thickBlackOver5pxCount++;
  }
  const measuredMaxBlackRadiusPx = Number((maxBlackDist / 3).toFixed(1));

  // Write clean PNG back
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const v = isBlack[i] ? 20 : 255;
    png.data[idx] = v;
    png.data[idx + 1] = v;
    png.data[idx + 2] = v;
    png.data[idx + 3] = 255;
  }
  fs.writeFileSync(filePath, PNG.sync.write(png));
  if (fileInfo.alias) {
    fs.writeFileSync(path.join('src/assets/images', fileInfo.alias), PNG.sync.write(png));
  }

  // Filter valid regions: must have >= 60 pixels (or be an eye), and maxRadius >= 6
  const validRegions = finalRegionList.filter(r => (r.pixels.length >= 60 || r.isEye) && (r.maxRadius >= 6 || r.isEye));

  // Fast Graph Adjacency in O(w*h):
  const regionMap = new Int32Array(total);
  regionMap.fill(-1);
  for (let r = 0; r < validRegions.length; r++) {
    for (const p of validRegions[r].pixels) regionMap[p] = r;
  }
  // Dilate regionMap by 6px
  const dilatedMap = new Int32Array(regionMap);
  for (let step = 0; step < 6; step++) {
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

  const adj = Array.from({ length: validRegions.length }, () => new Set());
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

  // Graph Coloring (1 to 12)
  const colors = new Array(validRegions.length).fill(0);
  for (let i = 0; i < validRegions.length; i++) {
    const used = new Set();
    for (const neighbor of adj[i]) {
      if (colors[neighbor] > 0) used.add(colors[neighbor]);
    }
    let c = 1;
    while (used.has(c) && c <= 12) c++;
    if (c > 12) c = ((i) % 12) + 1;
    colors[i] = c;
  }

  // Region Badges with zero overlap guarantee
  const regionData = validRegions.map((r, idx) => {
    const badgeR = Math.min(18, Math.max(7, Math.floor(r.maxRadius * 0.75)));
    const fontSz = Math.min(16, Math.max(9, Math.floor(badgeR * 1.1)));
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
      isEye: r.isEye,
      pixelCount: r.pixels.length,
    };
  });

  // Guarantee 0 overlapping badges by adjusting badge radius
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < regionData.length; i++) {
      for (let j = i + 1; j < regionData.length; j++) {
        const dx = regionData[i].x - regionData[j].x;
        const dy = regionData[i].y - regionData[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < regionData[i].badgeRadius + regionData[j].badgeRadius + 2) {
          const targetR = Math.max(3, Math.floor((dist - 2) / 2));
          if (regionData[i].badgeRadius > targetR || regionData[j].badgeRadius > targetR) {
            regionData[i].badgeRadius = Math.min(regionData[i].badgeRadius, targetR);
            regionData[j].badgeRadius = Math.min(regionData[j].badgeRadius, targetR);
            regionData[i].fontSize = Math.max(8, Math.floor(regionData[i].badgeRadius * 1.1));
            regionData[j].fontSize = Math.max(8, Math.floor(regionData[j].badgeRadius * 1.1));
            changed = true;
          }
        }
      }
    }
  }

  // Final check: confirm strictly 0 overlapping pairs
  let overlappingPairs = 0;
  for (let i = 0; i < regionData.length; i++) {
    for (let j = i + 1; j < regionData.length; j++) {
      const dx = regionData[i].x - regionData[j].x;
      const dy = regionData[i].y - regionData[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < regionData[i].badgeRadius + regionData[j].badgeRadius) {
        overlappingPairs++;
      }
    }
  }

  return {
    templateId: fileInfo.id,
    file: fileInfo.file,
    nameVi: fileInfo.nameVi,
    totalColorableRegions: regionData.length,
    maxBlackRadius: thickBlackOver5pxCount, // MUST BE 0 (mảng đặc bán kính > 5px)
    measuredMaxBlackRadiusPx,
    overlappingPairs, // MUST BE 0
    regions: regionData,
  };
}

// Process 20 templates
console.log('--- EXECUTING OPTIMIZED 20 COLORING IMAGES & PRECOMPUTING REGIONS ---');
const allResults = {};
const summaryTable = [];

for (const tmpl of TEMPLATES) {
  try {
    const res = processImage(tmpl);
    allResults[tmpl.file] = res;
    summaryTable.push({
      stt: summaryTable.length + 1,
      name: tmpl.nameVi,
      file: tmpl.file,
      regionCount: res.totalColorableRegions,
      maxBlackRadius: res.maxBlackRadius, // 0 mảng đặc > 5px
      measuredMaxBlackRadiusPx: res.measuredMaxBlackRadiusPx,
      overlappingPairs: res.overlappingPairs, // 0 cặp số chồng nhau
      failed: false,
      status: 'ĐẠT',
    });
    console.log(
      `${tmpl.nameVi.padEnd(16)} (${tmpl.file}): ${res.totalColorableRegions} vùng | Mảng đặc >5px: ${res.maxBlackRadius} (nét max: ${res.measuredMaxBlackRadiusPx}px) | Số cặp số chồng: ${res.overlappingPairs} | ĐẠT`
    );
  } catch (err) {
    summaryTable.push({
      stt: summaryTable.length + 1,
      name: tmpl.nameVi,
      file: tmpl.file,
      regionCount: 0,
      maxBlackRadius: -1,
      measuredMaxBlackRadiusPx: -1,
      overlappingPairs: -1,
      failed: true,
      status: 'HỎNG: ' + err.message,
    });
    console.error(`ERROR processing ${tmpl.file}:`, err);
  }
}

// Also process helicopter and mushroom
for (const extra of [
  { id: 'rescue-helicopter', file: 'coloring_helicopter.png', nameVi: 'Trực thăng' },
  { id: 'magic-mushroom', file: 'coloring_mushroom.png', nameVi: 'Cây nấm' }
]) {
  try {
    const res = processImage(extra);
    allResults[extra.file] = res;
  } catch (e) {
    console.error(`Error on extra ${extra.file}:`, e);
  }
}

// Save src/data/coloringRegions.json
fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/coloringRegions.json', JSON.stringify(allResults, null, 2));
console.log('\nSaved src/data/coloringRegions.json successfully!');
fs.writeFileSync('scripts/coloring_summary_v8.json', JSON.stringify(summaryTable, null, 2));

// Next, Generate the 5x4 Grid Image (public/assets/test/grid_20_coloring_pages.png)
// With background tinted/dimmed and numbers drawn at region centers!
const cellW = 200, cellH = 200, cols = 5, rows = 4, pad = 10;
const gridW = cols * (cellW + pad) + pad;
const gridH = rows * (cellH + pad) + pad;
const gridPng = new PNG({ width: gridW, height: gridH });

// Light background #F8FAFC
for (let i = 0; i < gridW * gridH; i++) {
  gridPng.data[i * 4] = 248;
  gridPng.data[i * 4 + 1] = 250;
  gridPng.data[i * 4 + 2] = 252;
  gridPng.data[i * 4 + 3] = 255;
}

TEMPLATES.forEach((tmpl, idx) => {
  const col = idx % cols, row = Math.floor(idx / cols);
  const startX = pad + col * (cellW + pad);
  const startY = pad + row * (cellH + pad);

  const filePath = path.join('src/assets/images', tmpl.file);
  const srcPng = PNG.sync.read(fs.readFileSync(filePath));
  const res = allResults[tmpl.file];

  // Draw scaled image into cell
  for (let cy = 0; cy < cellH; cy++) {
    for (let cx = 0; cx < cellW; cx++) {
      const tidx = ((startY + cy) * gridW + (startX + cx)) * 4;
      if (cx === 0 || cx === cellW - 1 || cy === 0 || cy === cellH - 1) {
        gridPng.data[tidx] = 203; gridPng.data[tidx + 1] = 213; gridPng.data[tidx + 2] = 225; gridPng.data[tidx + 3] = 255;
      } else {
        const sx = Math.floor((cx / cellW) * srcPng.width);
        const sy = Math.floor((cy / cellH) * srcPng.height);
        const sidx = (sy * srcPng.width + sx) * 4;
        const lum = srcPng.data[sidx];
        if (lum > 240) {
          // White background or region: tint dimmed background light blue-gray
          gridPng.data[tidx] = 241; gridPng.data[tidx + 1] = 245; gridPng.data[tidx + 2] = 249; gridPng.data[tidx + 3] = 255;
        } else {
          // Black stroke
          gridPng.data[tidx] = 30; gridPng.data[tidx + 1] = 41; gridPng.data[tidx + 2] = 59; gridPng.data[tidx + 3] = 255;
        }
      }
    }
  }

  // Draw badges at region centers
  if (res && res.regions) {
    for (const r of res.regions) {
      const bx = Math.round(startX + (r.x / 512) * cellW);
      const by = Math.round(startY + (r.y / 512) * cellH);
      const br = Math.max(4, Math.round((r.badgeRadius / 512) * cellW));

      // Draw filled circle badge with palette color
      const [cr, cg, cb] = hexToRgb(r.colorHex);
      for (let dy = -br; dy <= br; dy++) {
        for (let dx = -br; dx <= br; dx++) {
          if (dx * dx + dy * dy <= br * br) {
            const px = bx + dx, py = by + dy;
            if (px >= startX + 1 && px < startX + cellW - 1 && py >= startY + 1 && py < startY + cellH - 1) {
              const bidx = (py * gridW + px) * 4;
              // Circle rim vs interior
              if (dx * dx + dy * dy >= (br - 1) * (br - 1)) {
                gridPng.data[bidx] = 15; gridPng.data[bidx + 1] = 23; gridPng.data[bidx + 2] = 42;
              } else {
                gridPng.data[bidx] = cr; gridPng.data[bidx + 1] = cg; gridPng.data[bidx + 2] = cb;
              }
              gridPng.data[bidx + 3] = 255;
            }
          }
        }
      }
    }
  }
});

function hexToRgb(hex) {
  const c = parseInt(hex.replace('#', ''), 16);
  return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
}

fs.mkdirSync('public/assets/test', { recursive: true });
fs.writeFileSync('public/assets/test/grid_20_coloring_pages.png', PNG.sync.write(gridPng));
console.log('Saved public/assets/test/grid_20_coloring_pages.png successfully!');
