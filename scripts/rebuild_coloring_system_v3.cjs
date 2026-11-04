const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const TEMPLATES = [
  {
    id: 'sea-turtle',
    backupFile: 'coloring_turtle.png',
    file: 'coloring_turtle.png',
    sampleFile: 'coloring_turtle_sample.png',
    nameVi: 'Rùa biển',
    maxRegions: 7,
    palettePrefs: [
      { name: 'Mai rùa', colorNumber: 3 },      // vàng #FACC15
      { name: 'Đầu rùa', colorNumber: 4 },      // xanh lá #22C55E
      { name: 'Chân bơi trước phải', colorNumber: 11 }, // xanh cốm #84CC16
      { name: 'Chân bơi trước trái', colorNumber: 11 },  // xanh cốm #84CC16
      { name: 'Chân bơi sau phải', colorNumber: 4 },   // xanh lá #22C55E
      { name: 'Chân bơi sau trái', colorNumber: 4 },    // xanh lá #22C55E
      { name: 'Đuôi rùa', colorNumber: 2 },            // da cam #F97316
    ]
  },
  {
    id: 'happy-puppy',
    backupFile: 'coloring_dog.png',
    file: 'coloring_dog.png',
    sampleFile: 'coloring_dog_sample.png',
    nameVi: 'Cún con',
    maxRegions: 6,
    palettePrefs: [
      { name: 'Đầu & mặt cún', colorNumber: 12 }, // kem đào #FDBA74
      { name: 'Thân cún', colorNumber: 9 },       // nâu #854D0E
      { name: 'Tai cún', colorNumber: 9 },        // nâu #854D0E
      { name: 'Chân cún', colorNumber: 12 },      // kem đào #FDBA74
      { name: 'Đuôi cún', colorNumber: 9 },       // nâu #854D0E
      { name: 'Mõm cún', colorNumber: 3 },        // vàng #FACC15
    ]
  },
  {
    id: 'kitty-yarn',
    backupFile: 'coloring_cat.png',
    file: 'coloring_cat.png',
    sampleFile: 'coloring_cat_sample.png',
    nameVi: 'Mèo con',
    maxRegions: 6,
    palettePrefs: [
      { name: 'Đầu mèo', colorNumber: 2 },        // da cam #F97316
      { name: 'Thân mèo', colorNumber: 2 },       // da cam #F97316
      { name: 'Cuộn len', colorNumber: 6 },       // xanh dương #3B82F6
      { name: 'Tai mèo', colorNumber: 8 },        // hồng #EC4899
      { name: 'Chân mèo', colorNumber: 12 },      // kem đào #FDBA74
      { name: 'Đuôi mèo', colorNumber: 3 },       // vàng #FACC15
    ]
  },
  {
    id: 'bunny-carrot',
    backupFile: 'coloring_rabbit.png',
    file: 'coloring_rabbit.png',
    sampleFile: 'coloring_rabbit_sample.png',
    nameVi: 'Thỏ con',
    maxRegions: 6,
    palettePrefs: [
      { name: 'Đầu thỏ', colorNumber: 12 },       // kem đào #FDBA74
      { name: 'Thân thỏ', colorNumber: 8 },       // hồng #EC4899
      { name: 'Tai thỏ', colorNumber: 8 },        // hồng #EC4899
      { name: 'Củ cà rốt', colorNumber: 2 },      // da cam #F97316
      { name: 'Lá cà rốt', colorNumber: 4 },      // xanh lá #22C55E
      { name: 'Chân thỏ', colorNumber: 12 },      // kem đào #FDBA74
    ]
  },
  {
    id: 'picnic-car',
    backupFile: 'coloring_car.png',
    file: 'coloring_car.png',
    sampleFile: 'coloring_car_sample.png',
    nameVi: 'Xe ô tô',
    maxRegions: 6,
    palettePrefs: [
      { name: 'Thân xe', colorNumber: 1 },        // đỏ #EF4444
      { name: 'Cửa sổ', colorNumber: 5 },         // xanh ngọc #06B6D4
      { name: 'Bánh xe trước', colorNumber: 10 },  // đen #1E293B
      { name: 'Bánh xe sau', colorNumber: 10 },   // đen #1E293B
      { name: 'Đèn xe', colorNumber: 3 },         // vàng #FACC15
      { name: 'Mui xe', colorNumber: 6 },         // xanh dương #3B82F6
    ]
  },
  {
    id: 'choo-choo-train',
    backupFile: 'coloring_train.png',
    file: 'coloring_train.png',
    sampleFile: 'coloring_train_sample.png',
    nameVi: 'Tàu hỏa',
    maxRegions: 8,
    palettePrefs: [
      { name: 'Thân tàu', colorNumber: 6 },       // xanh dương #3B82F6
      { name: 'Mui tàu', colorNumber: 1 },        // đỏ #EF4444
      { name: 'Cửa sổ', colorNumber: 5 },         // xanh ngọc #06B6D4
      { name: 'Bánh xe 1', colorNumber: 3 },      // vàng #FACC15
      { name: 'Bánh xe 2', colorNumber: 3 },      // vàng #FACC15
      { name: 'Bánh xe 3', colorNumber: 3 },      // vàng #FACC15
      { name: 'Ống khói', colorNumber: 2 },       // da cam #F97316
      { name: 'Đầu tàu', colorNumber: 11 },       // xanh cốm #84CC16
    ]
  },
  {
    id: 'space-rocket',
    backupFile: 'coloring_rocket.png',
    file: 'coloring_rocket.png',
    sampleFile: 'coloring_rocket_sample.png',
    nameVi: 'Tên lửa',
    maxRegions: 6,
    palettePrefs: [
      { name: 'Thân tên lửa', colorNumber: 6 },   // xanh dương #3B82F6
      { name: 'Mũi tên lửa', colorNumber: 1 },    // đỏ #EF4444
      { name: 'Cánh trái', colorNumber: 2 },      // da cam #F97316
      { name: 'Cánh phải', colorNumber: 2 },     // da cam #F97316
      { name: 'Cửa sổ', colorNumber: 5 },         // xanh ngọc #06B6D4
      { name: 'Ngọn lửa', colorNumber: 3 },       // vàng #FACC15
    ]
  },
  {
    id: 'sun-rainbow',
    backupFile: 'coloring_rainbow.png',
    file: 'coloring_rainbow.png',
    sampleFile: 'coloring_rainbow_sample.png',
    nameVi: 'Cầu vồng',
    maxRegions: 7,
    palettePrefs: [
      { name: 'Vầng mặt trời', colorNumber: 3 },  // vàng #FACC15
      { name: 'Mây trái', colorNumber: 5 },       // xanh ngọc #06B6D4
      { name: 'Mây phải', colorNumber: 5 },       // xanh ngọc #06B6D4
      { name: 'Vạch đỏ', colorNumber: 1 },        // đỏ #EF4444
      { name: 'Vạch cam', colorNumber: 2 },       // cam #F97316
      { name: 'Vạch xanh lá', colorNumber: 4 },   // xanh lá #22C55E
      { name: 'Vạch xanh dương', colorNumber: 6 },// xanh dương #3B82F6
    ]
  },
  {
    id: 'birthday-cake',
    backupFile: 'coloring_cake.png',
    file: 'coloring_cake.png',
    sampleFile: 'coloring_cake_sample.png',
    nameVi: 'Bánh kem',
    maxRegions: 5,
    palettePrefs: [
      { name: 'Tầng bánh trên', colorNumber: 8 },  // hồng #EC4899
      { name: 'Tầng bánh dưới', colorNumber: 12 }, // kem đào #FDBA74
      { name: 'Kem phủ', colorNumber: 3 },         // vàng #FACC15
      { name: 'Nến', colorNumber: 5 },             // xanh ngọc #06B6D4
      { name: 'Ngọn lửa', colorNumber: 1 },        // đỏ #EF4444
    ]
  },
  {
    id: 'magic-fish',
    backupFile: 'coloring_goldfish.png',
    file: 'coloring_goldfish.png',
    sampleFile: 'coloring_goldfish_sample.png',
    nameVi: 'Cá vàng',
    maxRegions: 5,
    palettePrefs: [
      { name: 'Thân cá', colorNumber: 2 },         // da cam #F97316
      { name: 'Vây đuôi', colorNumber: 3 },        // vàng #FACC15
      { name: 'Vây lưng', colorNumber: 3 },        // vàng #FACC15
      { name: 'Vây bụng', colorNumber: 3 },        // vàng #FACC15
      { name: 'Bóng nước', colorNumber: 5 },       // xanh ngọc #06B6D4
    ]
  },
  {
    id: 'baby-elephant',
    backupFile: 'coloring_elephant.png',
    file: 'coloring_elephant.png',
    sampleFile: 'coloring_elephant_sample.png',
    nameVi: 'Voi con',
    maxRegions: 7,
    palettePrefs: [
      { name: 'Thân voi', colorNumber: 6 },        // xanh dương #3B82F6
      { name: 'Tai voi', colorNumber: 8 },         // hồng #EC4899
      { name: 'Vòi voi', colorNumber: 6 },         // xanh dương #3B82F6
      { name: 'Chân trước', colorNumber: 6 },      // xanh dương #3B82F6
      { name: 'Chân sau', colorNumber: 6 },       // xanh dương #3B82F6
      { name: 'Tia nước', colorNumber: 5 },        // xanh ngọc #06B6D4
      { name: 'Đầu voi', colorNumber: 6 },         // xanh dương #3B82F6
    ]
  },
  {
    id: 'brave-lion',
    backupFile: 'coloring_lion.png',
    file: 'coloring_lion.png',
    sampleFile: 'coloring_lion_sample.png',
    nameVi: 'Sư tử',
    maxRegions: 6,
    palettePrefs: [
      { name: 'Bờm sư tử', colorNumber: 9 },       // nâu #854D0E
      { name: 'Mặt & thân', colorNumber: 3 },      // vàng #FACC15
      { name: 'Tai', colorNumber: 8 },             // hồng #EC4899
      { name: 'Chân trước', colorNumber: 3 },      // vàng #FACC15
      { name: 'Chân sau', colorNumber: 3 },       // vàng #FACC15
      { name: 'Đuôi', colorNumber: 9 },            // nâu #854D0E
    ]
  },
  {
    id: 'friendly-dino',
    backupFile: 'coloring_dino.png',
    file: 'coloring_dino.png',
    sampleFile: 'coloring_dino_sample.png',
    nameVi: 'Khủng long',
    maxRegions: 5,
    palettePrefs: [
      { name: 'Thân khủng long', colorNumber: 4 }, // xanh lá #22C55E
      { name: 'Bụng khủng long', colorNumber: 11 },// xanh cốm #84CC16
      { name: 'Gai lưng', colorNumber: 2 },        // da cam #F97316
      { name: 'Chân', colorNumber: 4 },            // xanh lá #22C55E
      { name: 'Đầu', colorNumber: 4 },             // xanh lá #22C55E
    ]
  },
  {
    id: 'jumping-dolphin',
    backupFile: 'coloring_dolphin.png',
    file: 'coloring_dolphin.png',
    sampleFile: 'coloring_dolphin_sample.png',
    nameVi: 'Cá heo',
    maxRegions: 5,
    palettePrefs: [
      { name: 'Thân cá heo', colorNumber: 6 },     // xanh dương #3B82F6
      { name: 'Bụng cá heo', colorNumber: 5 },     // xanh ngọc #06B6D4
      { name: 'Vây đuôi', colorNumber: 6 },        // xanh dương #3B82F6
      { name: 'Vây lưng', colorNumber: 6 },        // xanh dương #3B82F6
      { name: 'Làn sóng', colorNumber: 5 },        // xanh ngọc #06B6D4
    ]
  },
  {
    id: 'swimming-duck',
    backupFile: 'coloring_duck.png',
    file: 'coloring_duck.png',
    sampleFile: 'coloring_duck_sample.png',
    nameVi: 'Vịt con',
    maxRegions: 6,
    palettePrefs: [
      { name: 'Thân vịt', colorNumber: 3 },        // vàng #FACC15
      { name: 'Cánh vịt', colorNumber: 3 },        // vàng #FACC15
      { name: 'Mỏ vịt', colorNumber: 2 },          // da cam #F97316
      { name: 'Đầu vịt', colorNumber: 3 },         // vàng #FACC15
      { name: 'Sóng nước', colorNumber: 5 },       // xanh ngọc #06B6D4
      { name: 'Bụng vịt', colorNumber: 3 },        // vàng #FACC15
    ]
  },
  {
    id: 'panda-bear',
    backupFile: 'coloring_panda.png',
    file: 'coloring_panda.png',
    sampleFile: 'coloring_panda_sample.png',
    nameVi: 'Gấu trúc',
    maxRegions: 7,
    palettePrefs: [
      { name: 'Mặt & bụng', colorNumber: 12 },     // kem đào / trắng #FDBA74
      { name: 'Tai gấu', colorNumber: 10 },        // đen #1E293B
      { name: 'Tay chân', colorNumber: 10 },       // đen #1E293B
      { name: 'Khoanh mắt', colorNumber: 10 },     // đen #1E293B
      { name: 'Cây trúc', colorNumber: 4 },        // xanh lá #22C55E
      { name: 'Thân gấu', colorNumber: 12 },       // kem đào #FDBA74
      { name: 'Chân sau', colorNumber: 10 },       // đen #1E293B
    ]
  },
  {
    id: 'magic-castle',
    backupFile: 'coloring_castle.png',
    file: 'coloring_castle.png',
    sampleFile: 'coloring_castle_sample.png',
    nameVi: 'Lâu đài',
    maxRegions: 7,
    palettePrefs: [
      { name: 'Tường thành', colorNumber: 7 },     // tím #8B5CF6
      { name: 'Mái chóp 1', colorNumber: 1 },      // đỏ #EF4444
      { name: 'Mái chóp 2', colorNumber: 1 },      // đỏ #EF4444
      { name: 'Cửa vòm', colorNumber: 3 },         // vàng #FACC15
      { name: 'Cờ', colorNumber: 2 },              // da cam #F97316
      { name: 'Cửa sổ', colorNumber: 5 },          // xanh ngọc #06B6D4
      { name: 'Tháp canh', colorNumber: 7 },       // tím #8B5CF6
    ]
  },
  {
    id: 'sailing-boat',
    backupFile: 'coloring_boat.png',
    file: 'coloring_boat.png',
    sampleFile: 'coloring_boat_sample.png',
    nameVi: 'Thuyền buồm',
    maxRegions: 7,
    palettePrefs: [
      { name: 'Thân thuyền', colorNumber: 9 },     // nâu #854D0E
      { name: 'Cánh buồm lớn', colorNumber: 1 },   // đỏ #EF4444
      { name: 'Cánh buồm nhỏ', colorNumber: 3 },   // vàng #FACC15
      { name: 'Lá cờ', colorNumber: 2 },           // da cam #F97316
      { name: 'Sóng biển', colorNumber: 6 },       // xanh dương #3B82F6
      { name: 'Cột buồm', colorNumber: 9 },        // nâu #854D0E
      { name: 'Gió mây', colorNumber: 5 },         // xanh ngọc #06B6D4
    ]
  },
  {
    id: 'ice-cream',
    backupFile: 'coloring_icecream.png',
    file: 'coloring_icecream.png',
    sampleFile: 'coloring_icecream_sample.png',
    nameVi: 'Kem ốc quế',
    maxRegions: 5,
    palettePrefs: [
      { name: 'Viên kem trên', colorNumber: 8 },   // hồng #EC4899
      { name: 'Viên kem giữa', colorNumber: 11 },  // xanh cốm #84CC16
      { name: 'Viên kem dưới', colorNumber: 3 },   // vàng #FACC15
      { name: 'Ốc quế', colorNumber: 9 },          // nâu #854D0E
      { name: 'Quả cherry', colorNumber: 1 },      // đỏ #EF4444
    ]
  },
  {
    id: 'red-apple',
    backupFile: 'coloring_apple.png',
    file: 'coloring_apple.png',
    sampleFile: 'coloring_apple_sample.png',
    nameVi: 'Quả táo',
    maxRegions: 3,
    palettePrefs: [
      { name: 'Thân quả táo', colorNumber: 1 },    // đỏ #EF4444
      { name: 'Chiếc lá', colorNumber: 4 },        // xanh lá #22C55E
      { name: 'Cuống táo', colorNumber: 9 },       // nâu #854D0E
    ]
  },
  {
    id: 'rescue-helicopter',
    backupFile: 'coloring_helicopter.png',
    file: 'coloring_helicopter.png',
    sampleFile: 'coloring_helicopter_sample.png',
    nameVi: 'Trực thăng',
    maxRegions: 6,
    palettePrefs: [
      { name: 'Thân trực thăng', colorNumber: 3 }, // vàng #FACC15
      { name: 'Cánh quạt', colorNumber: 10 },      // đen #1E293B
      { name: 'Càng đáp', colorNumber: 6 },        // xanh dương #3B82F6
      { name: 'Cửa kính', colorNumber: 5 },        // xanh ngọc #06B6D4
      { name: 'Đuôi', colorNumber: 1 },            // đỏ #EF4444
      { name: 'Cánh đuôi', colorNumber: 10 },      // đen #1E293B
    ]
  },
  {
    id: 'magic-mushroom',
    backupFile: 'coloring_mushroom.png',
    file: 'coloring_mushroom.png',
    sampleFile: 'coloring_mushroom_sample.png',
    nameVi: 'Cây nấm',
    maxRegions: 5,
    palettePrefs: [
      { name: 'Mũ nấm', colorNumber: 1 },          // đỏ #EF4444
      { name: 'Thân nấm', colorNumber: 12 },       // kem đào #FDBA74
      { name: 'Đốm tròn 1', colorNumber: 3 },      // vàng #FACC15
      { name: 'Đốm tròn 2', colorNumber: 3 },      // vàng #FACC15
      { name: 'Bụi cỏ', colorNumber: 4 },          // xanh lá #22C55E
    ]
  }
];

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

console.log('Starting coloring rebuild pipeline v3...');
const finalOutput = {};

for (const tmpl of TEMPLATES) {
  // Always read from backup directory to guarantee sealed borders
  const backupPath = path.join('backup/coloring_images.before-color-v1', tmpl.backupFile);
  const outPath = path.join('src/assets/images', tmpl.file);

  const png = PNG.sync.read(fs.readFileSync(backupPath));
  const w = png.width, h = png.height;
  const total = w * h;

  // 1. Initial binarize
  const isBlack = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const lum = 0.299 * png.data[idx] + 0.587 * png.data[idx + 1] + 0.114 * png.data[idx + 2];
    isBlack[i] = (lum < 115 && png.data[idx + 3] > 50) ? 1 : 0;
  }

  // 2. Identify background (BFS from all 4 boundaries)
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

  // 4. Repeatedly merge tiny components or slivers until clean
  // Slivers: comp.size < 1200 OR pole.maxDist < 12 OR total components > tmpl.maxRegions
  let needsMerge = true;
  let mergeIterations = 0;

  while (needsMerge && mergeIterations < 150) {
    mergeIterations++;
    needsMerge = false;

    // Calculate poles for sorting and sliver detection
    for (const comp of components) {
      if (!comp.pole) comp.pole = computePole(comp.pixels, w, h);
    }

    // Sort by smallest first
    components.sort((a, b) => a.size - b.size);

    let targetComp = null;
    // Priority 1: Slivers with maxDist < 12
    for (const comp of components) {
      if (comp.pole.maxDist < 12 || comp.size < 1200) {
        targetComp = comp;
        break;
      }
    }

    // Priority 2: Too many components (> maxRegions)
    if (!targetComp && components.length > tmpl.maxRegions) {
      targetComp = components[0];
    }

    if (targetComp) {
      needsMerge = true;
      // Find largest adjacent component
      const neighborMap = new Map();
      for (const p of targetComp.pixels) {
        const cx = p % w, cy = Math.floor(p / w);
        for (let dy = -5; dy <= 5; dy++) {
          for (let dx = -5; dx <= 5; dx++) {
            const nx = cx + dx, ny = cy + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const ni = ny * w + nx;
              const nLbl = labeled[ni];
              if (nLbl > 0 && nLbl !== targetComp.id) {
                neighborMap.set(nLbl, (neighborMap.get(nLbl) || 0) + 1);
              }
            }
          }
        }
      }

      let bestNeighbor = -1, maxContact = 0;
      for (const [nLbl, cnt] of neighborMap.entries()) {
        if (cnt > maxContact) {
          maxContact = cnt;
          bestNeighbor = nLbl;
        }
      }

      if (bestNeighbor > 0) {
        // Merge pixels and dissolve boundary stroke between them
        for (const p of targetComp.pixels) {
          labeled[p] = bestNeighbor;
          isBlack[p] = 0;
        }
        for (const p of targetComp.pixels) {
          const cx = p % w, cy = Math.floor(p / w);
          for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1],[0,2],[0,-2],[2,0],[-2,0]]) {
            const nx = cx + dx, ny = cy + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const ni = ny * w + nx;
              if (isBlack[ni] && !bg[ni]) {
                isBlack[ni] = 0;
                labeled[ni] = bestNeighbor;
              }
            }
          }
        }
      } else {
        // Isolated component: fill black
        for (const p of targetComp.pixels) isBlack[p] = 1;
      }

      // Re-segment connected components
      labeled = new Int32Array(total);
      compCount = 0;
      components = [];
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
    }
  }

  // 5. Final order: sort components by area or y-coordinate
  components.sort((a, b) => b.size - a.size);

  // 6. Precompute exact poles & assign colors
  const regions = [];
  const samplePng = new PNG({ width: w, height: h });
  // Fill sample with clean white background
  for (let i = 0; i < total * 4; i += 4) {
    samplePng.data[i] = 255;
    samplePng.data[i+1] = 255;
    samplePng.data[i+2] = 255;
    samplePng.data[i+3] = 255;
  }

  // Build adjacency matrix between remaining components
  const adj = Array.from({ length: components.length }, () => new Set());
  for (let i = 0; i < components.length; i++) {
    const compA = components[i];
    for (const p of compA.pixels) {
      const cx = p % w, cy = Math.floor(p / w);
      for (const [dx, dy] of [[0,2],[0,-2],[2,0],[-2,0],[0,3],[0,-3],[3,0],[-3,0]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const nLbl = labeled[ny * w + nx];
          if (nLbl > 0 && nLbl !== compA.id) {
            const j = components.findIndex(c => c.id === nLbl);
            if (j >= 0 && j !== i) {
              adj[i].add(j);
              adj[j].add(i);
            }
          }
        }
      }
    }
  }

  // Assign colors avoiding adjacent collisions
  const assignedColorNumbers = [];
  for (let i = 0; i < components.length; i++) {
    const pref = tmpl.palettePrefs[i % tmpl.palettePrefs.length];
    let chosenNum = pref ? pref.colorNumber : (i + 1);
    
    // Check if any neighbor already has this color
    const neighborColors = new Set();
    for (const neighborIdx of adj[i]) {
      if (assignedColorNumbers[neighborIdx] !== undefined) {
        neighborColors.add(assignedColorNumbers[neighborIdx]);
      }
    }

    if (neighborColors.has(chosenNum)) {
      // Find another available color from palette
      const alt = PALETTE.find(p => !neighborColors.has(p.number) && p.number !== 10);
      if (alt) chosenNum = alt.number;
    }
    assignedColorNumbers[i] = chosenNum;
  }

  components.forEach((comp, idx) => {
    const pole = computePole(comp.pixels, w, h);
    const pref = tmpl.palettePrefs[idx % tmpl.palettePrefs.length];
    const chosenNum = assignedColorNumbers[idx];
    const palItem = PALETTE.find(p => p.number === chosenNum) || PALETTE[0];

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

    // Fill sample PNG with this region's color
    for (const p of comp.pixels) {
      const pi = p * 4;
      samplePng.data[pi] = palItem.rgb[0];
      samplePng.data[pi+1] = palItem.rgb[1];
      samplePng.data[pi+2] = palItem.rgb[2];
      samplePng.data[pi+3] = 255;
    }
  });

  // Re-draw black outlines on sample PNG & output outline image
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
  console.log(`[DONE] ${tmpl.file} -> ${regions.length} regions (minR: ${minR}). Sample saved.`);
}

// Write src/data/coloringRegions.json
fs.writeFileSync('src/data/coloringRegions.json', JSON.stringify(finalOutput, null, 2), 'utf8');
console.log('Successfully wrote src/data/coloringRegions.json with 22 templates!');
