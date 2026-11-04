const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const regionsData = JSON.parse(fs.readFileSync('src/data/coloringRegions.json', 'utf8'));

const TEMPLATES = [
  { id: 'sea-turtle', file: 'coloring_turtle.png', nameVi: 'Rùa biển' },
  { id: 'happy-puppy', file: 'coloring_dog.png', nameVi: 'Cún con' },
  { id: 'kitty-yarn', file: 'coloring_cat.png', nameVi: 'Mèo con' },
  { id: 'bunny-carrot', file: 'coloring_rabbit.png', nameVi: 'Thỏ con' },
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

const DIGITS_3x5 = {
  '0': [1,1,1, 1,0,1, 1,0,1, 1,0,1, 1,1,1],
  '1': [0,1,0, 1,1,0, 0,1,0, 0,1,0, 1,1,1],
  '2': [1,1,1, 0,0,1, 1,1,1, 1,0,0, 1,1,1],
  '3': [1,1,1, 0,0,1, 1,1,1, 0,0,1, 1,1,1],
  '4': [1,0,1, 1,0,1, 1,1,1, 0,0,1, 0,0,1],
  '5': [1,1,1, 1,0,0, 1,1,1, 0,0,1, 1,1,1],
  '6': [1,1,1, 1,0,0, 1,1,1, 1,0,1, 1,1,1],
  '7': [1,1,1, 0,0,1, 0,1,0, 0,1,0, 0,1,0],
  '8': [1,1,1, 1,0,1, 1,1,1, 1,0,1, 1,1,1],
  '9': [1,1,1, 1,0,1, 1,1,1, 0,0,1, 1,1,1],
};

const gridCols = 5;
const gridRows = 4;
const thumbW = 240;
const thumbH = 240;
const gap = 16;
const padding = 20;
const gridW = padding * 2 + gridCols * thumbW + (gridCols - 1) * gap;
const gridH = padding * 2 + gridRows * thumbH + (gridRows - 1) * gap;

const gridPng = new PNG({ width: gridW, height: gridH });
// Fill with light backdrop (#F1F5F9)
for (let i = 0; i < gridW * gridH; i++) {
  const idx = i * 4;
  gridPng.data[idx] = 241;
  gridPng.data[idx + 1] = 245;
  gridPng.data[idx + 2] = 249;
  gridPng.data[idx + 3] = 255;
}

function setPixel(gx, gy, r, g, b) {
  if (gx < 0 || gx >= gridW || gy < 0 || gy >= gridH) return;
  const idx = (gy * gridW + gx) * 4;
  gridPng.data[idx] = r;
  gridPng.data[idx + 1] = g;
  gridPng.data[idx + 2] = b;
  gridPng.data[idx + 3] = 255;
}

function drawNumber(cx, cy, numStr, r, g, b) {
  const charW = 3;
  const charH = 5;
  const spacing = 1;
  const totalW = numStr.length * charW + (numStr.length - 1) * spacing;
  let startX = Math.round(cx - totalW / 2);
  let startY = Math.round(cy - charH / 2);

  for (let ci = 0; ci < numStr.length; ci++) {
    const digit = numStr[ci];
    const bitmap = DIGITS_3x5[digit];
    if (bitmap) {
      for (let dy = 0; dy < charH; dy++) {
        for (let dx = 0; dx < charW; dx++) {
          if (bitmap[dy * charW + dx]) {
            setPixel(startX + dx, startY + dy, r, g, b);
          }
        }
      }
    }
    startX += charW + spacing;
  }
}

for (let idx = 0; idx < 20; idx++) {
  const t = TEMPLATES[idx];
  const tData = regionsData[t.file];
  const col = idx % gridCols;
  const row = Math.floor(idx / gridCols);
  const startX = padding + col * (thumbW + gap);
  const startY = padding + row * (thumbH + gap);

  const pngPath = path.join('src/assets/images', t.file);
  const imgPng = PNG.sync.read(fs.readFileSync(pngPath));
  const w = imgPng.width, h = imgPng.height;

  // Background BFS on this image
  const total = w * h;
  const isBlack = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const pIdx = i * 4;
    const lum = 0.299 * imgPng.data[pIdx] + 0.587 * imgPng.data[pIdx + 1] + 0.114 * imgPng.data[pIdx + 2];
    isBlack[i] = lum < 128 ? 1 : 0;
  }
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

  // Render thumbnail
  for (let ty = 0; ty < thumbH; ty++) {
    for (let tx = 0; tx < thumbW; tx++) {
      const srcX = Math.floor((tx / thumbW) * 512);
      const srcY = Math.floor((ty / thumbH) * 512);
      const srcIdx = srcY * 512 + srcX;

      if (isBlack[srcIdx]) {
        setPixel(startX + tx, startY + ty, 30, 41, 59); // bold stroke
      } else if (isBg[srcIdx]) {
        setPixel(startX + tx, startY + ty, 203, 213, 225); // dimmed locked background #CBD5E1
      } else {
        setPixel(startX + tx, startY + ty, 255, 255, 255); // colorable pure white
      }
    }
  }

  // Card outline
  for (let tx = 0; tx < thumbW; tx++) {
    setPixel(startX + tx, startY, 148, 163, 184);
    setPixel(startX + tx, startY + thumbH - 1, 148, 163, 184);
  }
  for (let ty = 0; ty < thumbH; ty++) {
    setPixel(startX, startY + ty, 148, 163, 184);
    setPixel(startX + thumbW - 1, startY + ty, 148, 163, 184);
  }

  // Draw badges with numbers
  for (const reg of tData.regions) {
    const bx = Math.round(startX + (reg.x / 512) * thumbW);
    const by = Math.round(startY + (reg.y / 512) * thumbH);
    const br = 8; // badge radius

    const hex = reg.colorHex.replace('#', '');
    const cr = parseInt(hex.substring(0, 2), 16);
    const cg = parseInt(hex.substring(2, 4), 16);
    const cb = parseInt(hex.substring(4, 6), 16);

    for (let dy = -br; dy <= br; dy++) {
      for (let dx = -br; dx <= br; dx++) {
        const d2 = dx * dx + dy * dy;
        if (d2 <= br * br) {
          if (d2 >= (br - 1) * (br - 1)) {
            setPixel(bx + dx, by + dy, 15, 23, 42); // border
          } else {
            setPixel(bx + dx, by + dy, cr, cg, cb); // background fill
          }
        }
      }
    }

    // Draw digit inside badge
    // Choose contrast color (white or black)
    const lum = 0.299 * cr + 0.587 * cg + 0.114 * cb;
    const textR = lum > 140 ? 15 : 255;
    const textG = lum > 140 ? 23 : 255;
    const textB = lum > 140 ? 42 : 255;
    drawNumber(bx, by, String(reg.colorNumber), textR, textG, textB);
  }
}

fs.writeFileSync('public/assets/test/grid_20_coloring_pages.png', PNG.sync.write(gridPng));
console.log('Saved enhanced verification grid to public/assets/test/grid_20_coloring_pages.png');
