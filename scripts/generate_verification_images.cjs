const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

// 1. Generate 5x4 Grid of 20 Coloring Images (each resized to 200x200 in a 1040x840 canvas)
const TEMPLATES = [
  { name: '1. Rùa biển', file: 'coloring_turtle.png' },
  { name: '2. Cún con', file: 'coloring_dog.png' },
  { name: '3. Mèo con', file: 'coloring_cat.png' },
  { name: '4. Thỏ con', file: 'coloring_rabbit.png' },
  { name: '5. Xe ô tô', file: 'coloring_car.png' },
  { name: '6. Tàu hỏa', file: 'coloring_train.png' },
  { name: '7. Tên lửa', file: 'coloring_rocket.png' },
  { name: '8. Cầu vồng', file: 'coloring_rainbow.png' },
  { name: '9. Bánh kem', file: 'coloring_cake.png' },
  { name: '10. Cá vàng', file: 'coloring_goldfish.png' },
  { name: '11. Voi con', file: 'coloring_elephant.png' },
  { name: '12. Sư tử', file: 'coloring_lion.png' },
  { name: '13. Khủng long', file: 'coloring_dino.png' },
  { name: '14. Cá heo', file: 'coloring_dolphin.png' },
  { name: '15. Vịt vàng', file: 'coloring_duck.png' },
  { name: '16. Gấu trúc', file: 'coloring_panda.png' },
  { name: '17. Lâu đài', file: 'coloring_castle.png' },
  { name: '18. Thuyền buồm', file: 'coloring_boat.png' },
  { name: '19. Kem ốc quế', file: 'coloring_icecream.png' },
  { name: '20. Quả táo', file: 'coloring_apple.png' },
];

const cellW = 200;
const cellH = 200;
const cols = 5;
const rows = 4;
const padding = 10;
const gridW = cols * (cellW + padding) + padding;
const gridH = rows * (cellH + padding) + padding;

const gridPng = new PNG({ width: gridW, height: gridH });
// Fill with light background #F1F5F9 (241, 245, 249)
for (let i = 0; i < gridW * gridH; i++) {
  gridPng.data[i * 4] = 241;
  gridPng.data[i * 4 + 1] = 245;
  gridPng.data[i * 4 + 2] = 249;
  gridPng.data[i * 4 + 3] = 255;
}

TEMPLATES.forEach((tmpl, idx) => {
  const col = idx % cols;
  const row = Math.floor(idx / cols);
  const startX = padding + col * (cellW + padding);
  const startY = padding + row * (cellH + padding);

  const filePath = path.join('src/assets/images', tmpl.file);
  const buf = fs.readFileSync(filePath);
  const srcPng = PNG.sync.read(buf);

  // Resize and copy srcPng (512x512) into cell (200x200) with border
  for (let cy = 0; cy < cellH; cy++) {
    for (let cx = 0; cx < cellW; cx++) {
      const targetIdx = ((startY + cy) * gridW + (startX + cx)) * 4;
      const isBorder = cx === 0 || cx === cellW - 1 || cy === 0 || cy === cellH - 1;

      if (isBorder) {
        gridPng.data[targetIdx] = 203; // slate-300
        gridPng.data[targetIdx + 1] = 213;
        gridPng.data[targetIdx + 2] = 225;
        gridPng.data[targetIdx + 3] = 255;
      } else {
        const srcX = Math.floor((cx / cellW) * srcPng.width);
        const srcY = Math.floor((cy / cellH) * srcPng.height);
        const srcIdx = (srcY * srcPng.width + srcX) * 4;

        gridPng.data[targetIdx] = srcPng.data[srcIdx];
        gridPng.data[targetIdx + 1] = srcPng.data[srcIdx + 1];
        gridPng.data[targetIdx + 2] = srcPng.data[srcIdx + 2];
        gridPng.data[targetIdx + 3] = 255;
      }
    }
  }
});

fs.mkdirSync('public/assets/test', { recursive: true });
fs.writeFileSync('public/assets/test/grid_20_coloring_pages.png', PNG.sync.write(gridPng));
console.log('Saved grid_20_coloring_pages.png successfully!');

// 2. Generate DressUp Makeover Test Showcase:
// 4 panels (each 280x280) on a 1180x320 canvas:
// Panel 1: Doctor Hat on Pure White Background (shows thin 2px contrast border + pure white interior)
// Panel 2: Chef Hat on Pure White Background (shows thin 2px contrast border + pure white interior)
// Panel 3: Baby Character with Doctor Hat + Round Glasses
// Panel 4: Baby Character with Chef Hat + Cat Plush
const showcaseW = 1180;
const showcaseH = 320;
const showPng = new PNG({ width: showcaseW, height: showcaseH });

for (let i = 0; i < showcaseW * showcaseH; i++) {
  showPng.data[i * 4] = 248;
  showPng.data[i * 4 + 1] = 250;
  showPng.data[i * 4 + 2] = 252;
  showPng.data[i * 4 + 3] = 255;
}

function drawSubImage(targetPng, targetX, targetY, targetW, targetH, srcPng, isContain = false) {
  for (let cy = 0; cy < targetH; cy++) {
    for (let cx = 0; cx < targetW; cx++) {
      const srcX = Math.floor((cx / targetW) * srcPng.width);
      const srcY = Math.floor((cy / targetH) * srcPng.height);
      const srcIdx = (srcY * srcPng.width + srcX) * 4;
      const tIdx = ((targetY + cy) * targetPng.width + (targetX + cx)) * 4;

      const alpha = srcPng.data[srcIdx + 3] / 255;
      if (alpha > 0) {
        targetPng.data[tIdx] = Math.round(srcPng.data[srcIdx] * alpha + targetPng.data[tIdx] * (1 - alpha));
        targetPng.data[tIdx + 1] = Math.round(srcPng.data[srcIdx + 1] * alpha + targetPng.data[tIdx + 1] * (1 - alpha));
        targetPng.data[tIdx + 2] = Math.round(srcPng.data[srcIdx + 2] * alpha + targetPng.data[tIdx + 2] * (1 - alpha));
        targetPng.data[tIdx + 3] = 255;
      }
    }
  }
}

// Load Doctor Hat & Chef Hat
const docHatPng = PNG.sync.read(fs.readFileSync('src/assets/accessories/hat_doctor_hat.png'));
const chefHatPng = PNG.sync.read(fs.readFileSync('src/assets/accessories/hat_chef_hat.png'));
const glassesPng = PNG.sync.read(fs.readFileSync('src/assets/accessories/face_round_glasses.png'));
const babyPng = PNG.sync.read(fs.readFileSync('src/assets/accessories/plush_teddy_bear.png'));

// Panel 1: Doctor Hat on Pure White Card
const p1X = 20, p1Y = 20, pSize = 270;
for (let y = 0; y < pSize; y++) {
  for (let x = 0; x < pSize; x++) {
    const idx = ((p1Y + y) * showcaseW + (p1X + x)) * 4;
    showPng.data[idx] = 255;
    showPng.data[idx + 1] = 255;
    showPng.data[idx + 2] = 255;
  }
}
drawSubImage(showPng, p1X + 35, p1Y + 35, 200, 200, docHatPng);

// Panel 2: Chef Hat on Pure White Card
const p2X = 310, p2Y = 20;
for (let y = 0; y < pSize; y++) {
  for (let x = 0; x < pSize; x++) {
    const idx = ((p2Y + y) * showcaseW + (p2X + x)) * 4;
    showPng.data[idx] = 255;
    showPng.data[idx + 1] = 255;
    showPng.data[idx + 2] = 255;
  }
}
drawSubImage(showPng, p2X + 35, p2Y + 35, 200, 200, chefHatPng);

// Panel 3: Composite Teddy with Doctor Hat
const p3X = 600, p3Y = 20;
for (let y = 0; y < pSize; y++) {
  for (let x = 0; x < pSize; x++) {
    const idx = ((p3Y + y) * showcaseW + (p3X + x)) * 4;
    showPng.data[idx] = 254; // light amber-50
    showPng.data[idx + 1] = 243;
    showPng.data[idx + 2] = 199;
  }
}
drawSubImage(showPng, p3X + 20, p3Y + 30, 230, 230, babyPng);
drawSubImage(showPng, p3X + 55, p3Y + 5, 160, 110, docHatPng);
drawSubImage(showPng, p3X + 75, p3Y + 75, 120, 70, glassesPng);

// Panel 4: Composite Teddy with Chef Hat
const p4X = 890, p4Y = 20;
for (let y = 0; y < pSize; y++) {
  for (let x = 0; x < pSize; x++) {
    const idx = ((p4Y + y) * showcaseW + (p4X + x)) * 4;
    showPng.data[idx] = 252; // light pink-50
    showPng.data[idx + 1] = 231;
    showPng.data[idx + 2] = 243;
  }
}
drawSubImage(showPng, p4X + 20, p4Y + 30, 230, 230, babyPng);
drawSubImage(showPng, p4X + 50, p4Y + 5, 170, 115, chefHatPng);

fs.writeFileSync('public/assets/test/test_dressup_makeover_v7.png', PNG.sync.write(showPng));
console.log('Saved test_dressup_makeover_v7.png successfully!');
