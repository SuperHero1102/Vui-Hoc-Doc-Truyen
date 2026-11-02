const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const TEMPLATE_FILES = [
  'coloring_turtle.png', 'coloring_dog.png', 'coloring_cat.png', 'coloring_rabbit.png',
  'coloring_car.png', 'coloring_train.png', 'coloring_rocket.png', 'coloring_rainbow.png',
  'coloring_cake.png', 'coloring_goldfish.png', 'coloring_elephant.png', 'coloring_lion.png',
  'coloring_dino.png', 'coloring_dolphin.png', 'coloring_duck.png', 'coloring_panda.png',
  'coloring_castle.png', 'coloring_boat.png', 'coloring_icecream.png', 'coloring_apple.png',
];

for (const file of TEMPLATE_FILES) {
  const filePath = path.join('src/assets/images', file);
  const buf = fs.readFileSync(filePath);
  const png = PNG.sync.read(buf);
  const { width, height } = png;
  const bin = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    bin[i] = png.data[i * 4] < 128 ? 1 : 0;
  }

  // Connected component labeling for black pixels
  const visited = new Uint8Array(width * height);
  let cleanedCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (bin[idx] === 1 && !visited[idx]) {
        // BFS component
        const comp = [idx];
        visited[idx] = 1;
        let head = 0;
        while (head < comp.length) {
          const curr = comp[head++];
          const cy = Math.floor(curr / width);
          const cx = curr % width;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dy === 0 && dx === 0) continue;
              const ny = cy + dy;
              const nx = cx + dx;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nidx = ny * width + nx;
                if (bin[nidx] === 1 && !visited[nidx]) {
                  visited[nidx] = 1;
                  comp.push(nidx);
                }
              }
            }
          }
        }

        // If the black connected component has fewer than 25 pixels, it's a speckle/stray mark!
        if (comp.length < 25) {
          for (const p of comp) {
            bin[p] = 0;
            png.data[p * 4] = 255;
            png.data[p * 4 + 1] = 255;
            png.data[p * 4 + 2] = 255;
            png.data[p * 4 + 3] = 255;
          }
          cleanedCount += comp.length;
        }
      }
    }
  }

  if (cleanedCount > 0) {
    console.log(`Cleaned ${cleanedCount} stray pixels in ${file}`);
    fs.writeFileSync(filePath, PNG.sync.write(png));
  }
}
