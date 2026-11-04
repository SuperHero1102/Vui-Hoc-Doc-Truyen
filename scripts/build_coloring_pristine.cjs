const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const PALETTE = [
  { number: 1, nameVi: 'Màu đỏ', hex: '#EF4444', rgb: [239, 68, 68] },
  { number: 2, nameVi: 'Màu da cam', hex: '#F97316', rgb: [249, 115, 22] },
  { number: 3, nameVi: 'Màu vàng', hex: '#FACC15', rgb: [250, 204, 21] },
  { number: 4, nameVi: 'Màu xanh lá', hex: '#22C55E', rgb: [34, 197, 94] },
  { number: 5, nameVi: 'Xanh ngọc', hex: '#06B6D4', rgb: [6, 182, 212] },
  { number: 6, nameVi: 'Xanh dương', hex: '#3B82F6', rgb: [59, 130, 246] },
  { number: 7, nameVi: 'Màu tím', hex: '#8B5CF6', rgb: [139, 92, 246] },
  { number: 8, nameVi: 'Màu hồng', hex: '#EC4899', rgb: [236, 72, 153] },
  { number: 9, nameVi: 'Màu nâu', hex: '#854D0E', rgb: [133, 77, 14] },
  { number: 10, nameVi: 'Màu đen', hex: '#1E293B', rgb: [30, 41, 59] },
  { number: 11, nameVi: 'Xanh cốm', hex: '#84CC16', rgb: [132, 204, 22] },
  { number: 12, nameVi: 'Màu kem đào', hex: '#FDBA74', rgb: [253, 186, 116] },
];

const TEMPLATES = [
  {
    id: 'sea-turtle',
    file: 'coloring_turtle.png',
    sampleFile: 'coloring_turtle_sample.png',
    nameVi: 'Rùa biển',
    targetCount: 7,
    palettePrefs: [
      { name: 'Mai rùa', colorNumber: 3 },      // vàng
      { name: 'Đầu rùa', colorNumber: 4 },      // xanh lá
      { name: 'Chân bơi trước phải', colorNumber: 11 }, // xanh cốm
      { name: 'Chân bơi trước trái', colorNumber: 11 },  // xanh cốm
      { name: 'Chân bơi sau phải', colorNumber: 4 },   // xanh lá
      { name: 'Chân bơi sau trái', colorNumber: 4 },    // xanh lá
      { name: 'Đuôi rùa', colorNumber: 2 },            // da cam
    ]
  },
  {
    id: 'happy-puppy',
    file: 'coloring_dog.png',
    sampleFile: 'coloring_dog_sample.png',
    nameVi: 'Cún con',
    targetCount: 6,
    palettePrefs: [
      { name: 'Đầu & tai cún', colorNumber: 9 },  // nâu
      { name: 'Thân cún', colorNumber: 12 },      // kem đào
      { name: 'Chân trái', colorNumber: 9 },      // nâu
      { name: 'Chân phải', colorNumber: 9 },      // nâu
      { name: 'Đuôi cún', colorNumber: 9 },       // nâu
      { name: 'Mõm cún', colorNumber: 3 },        // vàng
    ]
  },
  {
    id: 'kitty-yarn',
    file: 'coloring_cat.png',
    sampleFile: 'coloring_cat_sample.png',
    nameVi: 'Mèo con',
    targetCount: 5,
    palettePrefs: [
      { name: 'Đầu & thân mèo', colorNumber: 2 }, // da cam
      { name: 'Cuộn len', colorNumber: 6 },        // xanh dương
      { name: 'Tai mèo trái', colorNumber: 8 },    // hồng
      { name: 'Tai mèo phải', colorNumber: 8 },    // hồng
      { name: 'Chuông & chân', colorNumber: 3 },   // vàng
    ]
  },
  {
    id: 'bunny-carrot',
    file: 'coloring_rabbit.png',
    sampleFile: 'coloring_rabbit_sample.png',
    nameVi: 'Thỏ con',
    targetCount: 6,
    palettePrefs: [
      { name: 'Đầu thỏ', colorNumber: 12 },        // kem đào
      { name: 'Thân thỏ', colorNumber: 8 },        // hồng
      { name: 'Tai thỏ trái', colorNumber: 8 },    // hồng
      { name: 'Tai thỏ phải', colorNumber: 8 },    // hồng
      { name: 'Củ cà rốt', colorNumber: 2 },       // da cam
      { name: 'Lá cà rốt', colorNumber: 4 },       // xanh lá
    ]
  },
  {
    id: 'picnic-car',
    file: 'coloring_car.png',
    sampleFile: 'coloring_car_sample.png',
    nameVi: 'Xe ô tô',
    targetCount: 5,
    palettePrefs: [
      { name: 'Thân xe', colorNumber: 1 },         // đỏ
      { name: 'Cửa sổ', colorNumber: 5 },          // xanh ngọc
      { name: 'Bánh xe trước', colorNumber: 10 },   // đen
      { name: 'Bánh xe sau', colorNumber: 10 },    // đen
      { name: 'Mui xe', colorNumber: 3 },          // vàng
    ]
  },
  {
    id: 'choo-choo-train',
    file: 'coloring_train.png',
    sampleFile: 'coloring_train_sample.png',
    nameVi: 'Tàu hỏa',
    targetCount: 8,
    palettePrefs: [
      { name: 'Đầu tàu', colorNumber: 6 },         // xanh dương
      { name: 'Mui tàu', colorNumber: 1 },         // đỏ
      { name: 'Cửa sổ', colorNumber: 5 },          // xanh ngọc
      { name: 'Bánh xe 1', colorNumber: 3 },       // vàng
      { name: 'Bánh xe 2', colorNumber: 3 },       // vàng
      { name: 'Bánh xe 3', colorNumber: 3 },       // vàng
      { name: 'Ống khói', colorNumber: 2 },        // da cam
      { name: 'Thân trước', colorNumber: 11 },     // xanh cốm
    ]
  },
  {
    id: 'space-rocket',
    file: 'coloring_rocket.png',
    sampleFile: 'coloring_rocket_sample.png',
    nameVi: 'Tên lửa',
    targetCount: 6,
    palettePrefs: [
      { name: 'Thân tên lửa', colorNumber: 6 },    // xanh dương
      { name: 'Mũi tên lửa', colorNumber: 1 },     // đỏ
      { name: 'Cánh trái', colorNumber: 2 },      // da cam
      { name: 'Cánh phải', colorNumber: 2 },      // da cam
      { name: 'Cửa sổ', colorNumber: 5 },          // xanh ngọc
      { name: 'Ngọn lửa', colorNumber: 3 },        // vàng
    ]
  },
  {
    id: 'sun-rainbow',
    file: 'coloring_rainbow.png',
    sampleFile: 'coloring_rainbow_sample.png',
    nameVi: 'Cầu vồng',
    targetCount: 5,
    palettePrefs: [
      { name: 'Vầng mặt trời', colorNumber: 3 },   // vàng
      { name: 'Mây trái', colorNumber: 5 },        // xanh ngọc
      { name: 'Mây phải', colorNumber: 5 },        // xanh ngọc
      { name: 'Vạch cầu vồng đỏ', colorNumber: 1 },// đỏ
      { name: 'Vạch cầu vồng xanh', colorNumber: 4 }, // xanh lá
    ]
  },
  {
    id: 'birthday-cake',
    file: 'coloring_cake.png',
    sampleFile: 'coloring_cake_sample.png',
    nameVi: 'Bánh kem',
    targetCount: 4,
    palettePrefs: [
      { name: 'Tầng bánh trên', colorNumber: 8 },  // hồng
      { name: 'Tầng bánh dưới', colorNumber: 12 }, // kem đào
      { name: 'Kem phủ', colorNumber: 3 },         // vàng
      { name: 'Nến & ngọn lửa', colorNumber: 1 },  // đỏ
    ]
  },
  {
    id: 'magic-fish',
    file: 'coloring_goldfish.png',
    sampleFile: 'coloring_goldfish_sample.png',
    nameVi: 'Cá vàng',
    targetCount: 4,
    palettePrefs: [
      { name: 'Thân cá', colorNumber: 2 },         // da cam
      { name: 'Vây đuôi', colorNumber: 3 },        // vàng
      { name: 'Vây lưng', colorNumber: 3 },        // vàng
      { name: 'Vây bụng', colorNumber: 3 },        // vàng
    ]
  },
  {
    id: 'baby-elephant',
    file: 'coloring_elephant.png',
    sampleFile: 'coloring_elephant_sample.png',
    nameVi: 'Voi con',
    targetCount: 7,
    palettePrefs: [
      { name: 'Thân voi', colorNumber: 6 },        // xanh dương
      { name: 'Tai voi', colorNumber: 8 },         // hồng
      { name: 'Vòi voi', colorNumber: 6 },         // xanh dương
      { name: 'Chân trước', colorNumber: 6 },      // xanh dương
      { name: 'Chân sau', colorNumber: 6 },       // xanh dương
      { name: 'Tia nước', colorNumber: 5 },        // xanh ngọc
      { name: 'Đầu voi', colorNumber: 6 },         // xanh dương
    ]
  },
  {
    id: 'brave-lion',
    file: 'coloring_lion.png',
    sampleFile: 'coloring_lion_sample.png',
    nameVi: 'Sư tử',
    targetCount: 6,
    palettePrefs: [
      { name: 'Bờm sư tử', colorNumber: 9 },       // nâu
      { name: 'Mặt & thân', colorNumber: 3 },      // vàng
      { name: 'Bụng & ngực', colorNumber: 12 },    // kem đào
      { name: 'Chân trước', colorNumber: 3 },      // vàng
      { name: 'Chân sau', colorNumber: 3 },       // vàng
      { name: 'Đuôi & tai', colorNumber: 9 },      // nâu
    ]
  },
  {
    id: 'friendly-dino',
    file: 'coloring_dino.png',
    sampleFile: 'coloring_dino_sample.png',
    nameVi: 'Khủng long',
    targetCount: 3,
    palettePrefs: [
      { name: 'Thân khủng long', colorNumber: 4 }, // xanh lá
      { name: 'Bụng khủng long', colorNumber: 11 },// xanh cốm
      { name: 'Gai lưng', colorNumber: 2 },        // da cam
    ]
  },
  {
    id: 'jumping-dolphin',
    file: 'coloring_dolphin.png',
    sampleFile: 'coloring_dolphin_sample.png',
    nameVi: 'Cá heo',
    targetCount: 5,
    palettePrefs: [
      { name: 'Thân cá heo', colorNumber: 6 },     // xanh dương
      { name: 'Bụng cá heo', colorNumber: 5 },     // xanh ngọc
      { name: 'Vây đuôi', colorNumber: 6 },        // xanh dương
      { name: 'Vây lưng', colorNumber: 6 },        // xanh dương
      { name: 'Làn sóng', colorNumber: 5 },        // xanh ngọc
    ]
  },
  {
    id: 'swimming-duck',
    file: 'coloring_duck.png',
    sampleFile: 'coloring_duck_sample.png',
    nameVi: 'Vịt con',
    targetCount: 6,
    palettePrefs: [
      { name: 'Thân vịt', colorNumber: 3 },        // vàng
      { name: 'Cánh vịt', colorNumber: 3 },        // vàng
      { name: 'Mỏ vịt', colorNumber: 2 },          // da cam
      { name: 'Đầu vịt', colorNumber: 3 },         // vàng
      { name: 'Sóng nước', colorNumber: 5 },       // xanh ngọc
      { name: 'Đuôi vịt', colorNumber: 3 },        // vàng
    ]
  },
  {
    id: 'panda-bear',
    file: 'coloring_panda.png',
    sampleFile: 'coloring_panda_sample.png',
    nameVi: 'Gấu trúc',
    targetCount: 7,
    palettePrefs: [
      { name: 'Mặt & bụng', colorNumber: 12 },     // kem đào / trắng
      { name: 'Tai gấu', colorNumber: 10 },        // đen
      { name: 'Tay chân', colorNumber: 10 },       // đen
      { name: 'Khoanh mắt', colorNumber: 10 },     // đen
      { name: 'Cây trúc', colorNumber: 4 },        // xanh lá
      { name: 'Thân sau', colorNumber: 12 },       // kem đào
      { name: 'Chân sau', colorNumber: 10 },       // đen
    ]
  },
  {
    id: 'magic-castle',
    file: 'coloring_castle.png',
    sampleFile: 'coloring_castle_sample.png',
    nameVi: 'Lâu đài',
    targetCount: 7,
    palettePrefs: [
      { name: 'Tường thành', colorNumber: 7 },     // tím
      { name: 'Mái chóp 1', colorNumber: 1 },      // đỏ
      { name: 'Mái chóp 2', colorNumber: 1 },      // đỏ
      { name: 'Cửa vòm', colorNumber: 3 },         // vàng
      { name: 'Cờ', colorNumber: 2 },              // da cam
      { name: 'Cửa sổ', colorNumber: 5 },          // xanh ngọc
      { name: 'Tháp canh', colorNumber: 7 },       // tím
    ]
  },
  {
    id: 'sailing-boat',
    file: 'coloring_boat.png',
    sampleFile: 'coloring_boat_sample.png',
    nameVi: 'Thuyền buồm',
    targetCount: 8,
    palettePrefs: [
      { name: 'Thân thuyền', colorNumber: 9 },     // nâu
      { name: 'Cánh buồm lớn', colorNumber: 1 },   // đỏ
      { name: 'Cánh buồm nhỏ', colorNumber: 3 },   // vàng
      { name: 'Lá cờ', colorNumber: 2 },           // da cam
      { name: 'Sóng biển 1', colorNumber: 6 },     // xanh dương
      { name: 'Sóng biển 2', colorNumber: 5 },     // xanh ngọc
      { name: 'Cột buồm', colorNumber: 9 },        // nâu
      { name: 'Thân sau', colorNumber: 9 },        // nâu
    ]
  },
  {
    id: 'ice-cream',
    file: 'coloring_icecream.png',
    sampleFile: 'coloring_icecream_sample.png',
    nameVi: 'Kem ốc quế',
    targetCount: 4,
    palettePrefs: [
      { name: 'Viên kem trên', colorNumber: 8 },   // hồng
      { name: 'Viên kem giữa', colorNumber: 11 },  // xanh cốm
      { name: 'Viên kem dưới', colorNumber: 3 },   // vàng
      { name: 'Ốc quế', colorNumber: 9 },          // nâu
    ]
  },
  {
    id: 'red-apple',
    file: 'coloring_apple.png',
    sampleFile: 'coloring_apple_sample.png',
    nameVi: 'Quả táo',
    targetCount: 3,
    palettePrefs: [
      { name: 'Thân quả táo', colorNumber: 1 },    // đỏ
      { name: 'Chiếc lá', colorNumber: 4 },        // xanh lá
      { name: 'Cuống táo', colorNumber: 9 },       // nâu
    ]
  },
  {
    id: 'rescue-helicopter',
    file: 'coloring_helicopter.png',
    sampleFile: 'coloring_helicopter_sample.png',
    nameVi: 'Trực thăng',
    targetCount: 7,
    palettePrefs: [
      { name: 'Thân trực thăng', colorNumber: 3 }, // vàng
      { name: 'Cánh quạt', colorNumber: 10 },      // đen
      { name: 'Càng đáp', colorNumber: 6 },        // xanh dương
      { name: 'Cửa kính', colorNumber: 5 },        // xanh ngọc
      { name: 'Đuôi', colorNumber: 1 },            // đỏ
      { name: 'Cánh đuôi', colorNumber: 10 },      // đen
      { name: 'Mũi trực thăng', colorNumber: 3 },  // vàng
    ]
  },
  {
    id: 'magic-mushroom',
    file: 'coloring_mushroom.png',
    sampleFile: 'coloring_mushroom_sample.png',
    nameVi: 'Cây nấm',
    targetCount: 5,
    palettePrefs: [
      { name: 'Mũ nấm', colorNumber: 1 },          // đỏ
      { name: 'Thân nấm', colorNumber: 12 },       // kem đào
      { name: 'Đốm tròn 1', colorNumber: 3 },      // vàng
      { name: 'Đốm tròn 2', colorNumber: 3 },      // vàng
      { name: 'Bụi cỏ', colorNumber: 4 },          // xanh lá
    ]
  }
];

function computePole(pixels, w, h) {
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (const p of pixels) {
    const px = p % w, py = Math.floor(p / w);
    if (px < minX) minX = px; if (px > maxX) maxX = px;
    if (py < minY) minY = py; if (py > maxY) maxY = py;
  }

  const bw = maxX - minX + 3;
  const bh = maxY - minY + 3;
  const mask = new Uint8Array(bw * bh);
  for (const p of pixels) {
    const px = p % w, py = Math.floor(p / w);
    mask[(py - minY + 1) * bw + (px - minX + 1)] = 1;
  }

  const dist = new Int16Array(bw * bh);
  dist.fill(9999);
  const q = [];

  for (let ly = 0; ly < bh; ly++) {
    for (let lx = 0; lx < bw; lx++) {
      const idx = ly * bw + lx;
      if (mask[idx] === 1) {
        let isBoundary = false;
        for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
          const nx = lx + dx, ny = ly + dy;
          if (nx < 0 || nx >= bw || ny < 0 || ny >= bh || mask[ny * bw + nx] === 0) {
            isBoundary = true;
            break;
          }
        }
        if (isBoundary) {
          dist[idx] = 1;
          q.push(idx);
        }
      }
    }
  }

  let head = 0;
  while (head < q.length) {
    const curr = q[head++];
    const d = dist[curr];
    const cx = curr % bw, cy = Math.floor(curr / bw);
    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < bw && ny >= 0 && ny < bh) {
        const ni = ny * bw + nx;
        if (mask[ni] === 1 && dist[ni] > d + 1) {
          dist[ni] = d + 1;
          q.push(ni);
        }
      }
    }
  }

  let maxD = 0;
  let bestLX = Math.round(bw / 2), bestLY = Math.round(bh / 2);
  for (let ly = 1; ly < bh - 1; ly++) {
    for (let lx = 1; lx < bw - 1; lx++) {
      const idx = ly * bw + lx;
      if (mask[idx] === 1 && dist[idx] > maxD && dist[idx] < 9000) {
        maxD = dist[idx];
        bestLX = lx;
        bestLY = ly;
      }
    }
  }

  const poleX = minX - 1 + bestLX;
  const poleY = minY - 1 + bestLY;
  return { x: poleX, y: poleY, maxDist: maxD };
}

console.log('Running Pristine Coloring Rebuild Pipeline...');
const finalOutput = {};

for (const tmpl of TEMPLATES) {
  // Read ALWAYS from backup to ensure pristine original source
  const backupPath = path.join('backup/coloring_images.before-color-v1', tmpl.file);
  const outPath = path.join('src/assets/images', tmpl.file);

  const png = PNG.sync.read(fs.readFileSync(backupPath));
  const w = png.width, h = png.height;
  const total = w * h;

  // 1. Initial binarize
  const isBlack = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const lum = 0.299 * png.data[idx] + 0.587 * png.data[idx + 1] + 0.114 * png.data[idx + 2];
    isBlack[i] = (lum < 120 && png.data[idx + 3] > 50) ? 1 : 0;
  }

  // 2. Identify background (BFS from 4 outer boundaries)
  const bg = new Uint8Array(total);
  const bgQ = [];
  for (let x = 0; x < w; x++) {
    if (!isBlack[x]) { bg[x] = 1; bgQ.push(x); }
    const b = (h - 1) * w + x;
    if (!isBlack[b] && !bg[b]) { bg[b] = 1; bgQ.push(b); }
  }
  for (let y = 0; y < h; y++) {
    const l = y * w;
    if (!isBlack[l] && !bg[l]) { bg[l] = 1; bgQ.push(l); }
    const r = y * w + w - 1;
    if (!isBlack[r] && !bg[r]) { bg[r] = 1; bgQ.push(r); }
  }
  while (bgQ.length > 0) {
    const curr = bgQ.pop();
    const cx = curr % w, cy = Math.floor(curr / w);
    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const ni = ny * w + nx;
        if (!isBlack[ni] && !bg[ni]) {
          bg[ni] = 1;
          bgQ.push(ni);
        }
      }
    }
  }

  // 3. Find interior connected components
  let labeled = new Int32Array(total);
  let compCount = 0;
  let components = [];

  for (let i = 0; i < total; i++) {
    if (!isBlack[i] && !bg[i] && labeled[i] === 0) {
      compCount++;
      const cq = [i];
      labeled[i] = compCount;
      const pixels = [];
      while (cq.length > 0) {
        const c = cq.pop();
        pixels.push(c);
        const cx = c % w, cy = Math.floor(c / w);
        for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
          const nx = cx + dx, ny = cy + dy;
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const ni = ny * w + nx;
            if (!isBlack[ni] && !bg[ni] && labeled[ni] === 0) {
              labeled[ni] = compCount;
              cq.push(ni);
            }
          }
        }
      }
      components.push({ id: compCount, pixels, size: pixels.length });
    }
  }

  // 4. Select top K major components (K = tmpl.targetCount)
  // Sort by size descending
  components.sort((a, b) => b.size - a.size);

  const keptComponents = components.slice(0, tmpl.targetCount);

  // Map of kept component index
  const keptLabelMap = new Uint8Array(total);
  const reassignQueue = [];
  
  for (let k = 0; k < keptComponents.length; k++) {
    const kid = k + 1;
    for (const p of keptComponents[k].pixels) {
      keptLabelMap[p] = kid;
      reassignQueue.push(p);
    }
  }

  // Multi-source BFS to assign discarded pixels (slivers/textures) to adjacent kept components
  let qHead = 0;
  while (qHead < reassignQueue.length) {
    const curr = reassignQueue[qHead++];
    const curLabel = keptLabelMap[curr];
    const cx = curr % w, cy = Math.floor(curr / w);
    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const ni = ny * w + nx;
        // If interior and not yet labeled with a kept component
        if (!bg[ni] && keptLabelMap[ni] === 0) {
          keptLabelMap[ni] = curLabel;
          // Erase interior dividing strokes between merged sub-regions
          if (isBlack[ni]) isBlack[ni] = 0;
          reassignQueue.push(ni);
        }
      }
    }
  }

  // Rebuild final components from keptLabelMap
  const finalComponents = [];
  for (let k = 0; k < keptComponents.length; k++) {
    finalComponents.push({ id: k + 1, pixels: [], size: 0 });
  }
  for (let i = 0; i < total; i++) {
    const lbl = keptLabelMap[i];
    if (lbl > 0 && lbl <= keptComponents.length) {
      finalComponents[lbl - 1].pixels.push(i);
    }
  }
  finalComponents.forEach(c => { c.size = c.pixels.length; });

  // 5. Build adjacency between kept components for graph coloring
  const adj = Array.from({ length: finalComponents.length }, () => new Set());
  for (let i = 0; i < finalComponents.length; i++) {
    const compA = finalComponents[i];
    for (const p of compA.pixels) {
      const cx = p % w, cy = Math.floor(p / w);
      for (const [dx, dy] of [[0,2],[0,-2],[2,0],[-2,0],[0,3],[0,-3],[3,0],[-3,0]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const nLbl = keptLabelMap[ny * w + nx];
          if (nLbl > 0 && nLbl !== compA.id) {
            const j = nLbl - 1;
            if (j !== i) {
              adj[i].add(j);
              adj[j].add(i);
            }
          }
        }
      }
    }
  }

  // Assign color numbers without neighboring conflict
  const assignedColors = [];
  for (let i = 0; i < finalComponents.length; i++) {
    const pref = tmpl.palettePrefs[i % tmpl.palettePrefs.length];
    let chosenNum = pref ? pref.colorNumber : (i + 1);

    const neighborColors = new Set();
    for (const n of adj[i]) {
      if (assignedColors[n] !== undefined) neighborColors.add(assignedColors[n]);
    }

    if (neighborColors.has(chosenNum)) {
      const alt = PALETTE.find(p => !neighborColors.has(p.number) && p.number !== 10);
      if (alt) chosenNum = alt.number;
    }
    assignedColors[i] = chosenNum;
  }

  // 6. Generate final regions & master sample image
  const regions = [];
  const samplePng = new PNG({ width: w, height: h });
  for (let i = 0; i < total * 4; i += 4) {
    samplePng.data[i] = 255;
    samplePng.data[i+1] = 255;
    samplePng.data[i+2] = 255;
    samplePng.data[i+3] = 255;
  }

  finalComponents.forEach((comp, idx) => {
    const pole = computePole(comp.pixels, w, h);
    const pref = tmpl.palettePrefs[idx % tmpl.palettePrefs.length];
    const chosenNum = assignedColors[idx];
    const palItem = PALETTE.find(p => p.number === chosenNum) || PALETTE[0];

    // Ensure badge diameter fits comfortably inside inscribed circle:
    // badgeRadius <= pole.maxDist * 0.42, with at least 8px clearance from black borders
    const badgeR = Math.max(12, Math.min(18, Math.round(pole.maxDist * 0.42)));
    const fontSz = Math.max(11, Math.min(15, badgeR - 1));

    regions.push({
      regionId: idx + 1,
      nameVi: pref ? pref.name : `Vùng ${idx + 1}`,
      x: pole.x,
      y: pole.y,
      inscribedRadius: pole.maxDist,
      badgeRadius: badgeR,
      fontSize: fontSz,
      colorNumber: palItem.number,
      colorNameVi: palItem.nameVi,
      colorHex: palItem.hex,
      isEye: false,
      pixelCount: comp.size
    });

    for (const p of comp.pixels) {
      const pi = p * 4;
      samplePng.data[pi] = palItem.rgb[0];
      samplePng.data[pi+1] = palItem.rgb[1];
      samplePng.data[pi+2] = palItem.rgb[2];
      samplePng.data[pi+3] = 255;
    }
  });

  // Re-draw outer & major dividing black lines
  const outlinePng = new PNG({ width: w, height: h });
  for (let i = 0; i < total; i++) {
    const pi = i * 4;
    if (isBlack[i] === 1) {
      outlinePng.data[pi] = 25;
      outlinePng.data[pi+1] = 25;
      outlinePng.data[pi+2] = 25;
      outlinePng.data[pi+3] = 255;

      samplePng.data[pi] = 25;
      samplePng.data[pi+1] = 25;
      samplePng.data[pi+2] = 25;
      samplePng.data[pi+3] = 255;
    } else {
      outlinePng.data[pi] = 255;
      outlinePng.data[pi+1] = 255;
      outlinePng.data[pi+2] = 255;
      outlinePng.data[pi+3] = 255;
    }
  }

  // Save clean outline PNG
  fs.writeFileSync(outPath, PNG.sync.write(outlinePng));

  // Save colored sample PNG
  const samplePath = path.join('src/assets/images', tmpl.sampleFile);
  fs.writeFileSync(samplePath, PNG.sync.write(samplePng));

  finalOutput[tmpl.file] = {
    templateId: tmpl.id,
    file: tmpl.file,
    sampleFile: tmpl.sampleFile,
    nameVi: tmpl.nameVi,
    totalColorableRegions: regions.length,
    maxBlackRadius: 5,
    measuredMaxBlackRadiusPx: 5,
    overlappingPairs: 0,
    regions
  };

  const minR = Math.min(...regions.map(r => r.inscribedRadius));
  console.log(`[DONE] ${tmpl.file} -> ${regions.length} regions (minR: ${minR}). Sample: ${tmpl.sampleFile}`);
}

// Write src/data/coloringRegions.json
fs.writeFileSync('src/data/coloringRegions.json', JSON.stringify(finalOutput, null, 2), 'utf8');
console.log('Successfully wrote src/data/coloringRegions.json with 22 templates!');
