const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const TEMPLATES = [
  { id: 'sea-turtle', file: 'coloring_turtle.png', alias: 'coloring_sea_turtle.png', nameVi: 'Rùa biển', target: 9 },
  { id: 'happy-puppy', file: 'coloring_dog.png', alias: 'coloring_puppy.png', nameVi: 'Cún con', target: 8 },
  { id: 'kitty-yarn', file: 'coloring_cat.png', alias: 'coloring_kitty.png', nameVi: 'Mèo con', target: 9 },
  { id: 'bunny-carrot', file: 'coloring_rabbit.png', alias: 'coloring_bunny.png', nameVi: 'Thỏ con', target: 8 },
  { id: 'picnic-car', file: 'coloring_car.png', nameVi: 'Xe ô tô', target: 10 },
  { id: 'choo-choo-train', file: 'coloring_train.png', nameVi: 'Tàu hỏa', target: 10 },
  { id: 'space-rocket', file: 'coloring_rocket.png', nameVi: 'Tên lửa', target: 8 },
  { id: 'sun-rainbow', file: 'coloring_rainbow.png', nameVi: 'Cầu vồng', target: 9 },
  { id: 'birthday-cake', file: 'coloring_cake.png', nameVi: 'Bánh kem', target: 7 },
  { id: 'magic-fish', file: 'coloring_goldfish.png', nameVi: 'Cá vàng', target: 6 },
  { id: 'baby-elephant', file: 'coloring_elephant.png', nameVi: 'Voi con', target: 9 },
  { id: 'brave-lion', file: 'coloring_lion.png', nameVi: 'Sư tử', target: 9 },
  { id: 'friendly-dino', file: 'coloring_dino.png', nameVi: 'Khủng long', target: 8 },
  { id: 'jumping-dolphin', file: 'coloring_dolphin.png', nameVi: 'Cá heo', target: 8 },
  { id: 'swimming-duck', file: 'coloring_duck.png', nameVi: 'Vịt con', target: 7 },
  { id: 'panda-bear', file: 'coloring_panda.png', nameVi: 'Gấu trúc', target: 10 },
  { id: 'magic-castle', file: 'coloring_castle.png', nameVi: 'Lâu đài', target: 9 },
  { id: 'sailing-boat', file: 'coloring_boat.png', nameVi: 'Thuyền buồm', target: 10 },
  { id: 'ice-cream', file: 'coloring_icecream.png', nameVi: 'Kem ốc quế', target: 7 },
  { id: 'red-apple', file: 'coloring_apple.png', nameVi: 'Quả táo', target: 7 },
  { id: 'rescue-helicopter', file: 'coloring_helicopter.png', nameVi: 'Trực thăng', target: 9 },
  { id: 'magic-mushroom', file: 'coloring_mushroom.png', nameVi: 'Cây nấm', target: 8 },
];

for (const t of TEMPLATES) {
  const filePath = path.join('src/assets/images', t.file);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
  } else {
    const png = PNG.sync.read(fs.readFileSync(filePath));
    console.log(`Checking ${t.nameVi} (${t.file}): ${png.width}x${png.height}`);
  }
}
