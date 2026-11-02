const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const PALE_WHITE_ITEMS = [
  'hat_doctor_hat.png',
  'hat_chef_hat.png',
  'hat_bunny_ears.png',
  'face_bear_mask.png',
  'jewelry_pearl_necklace.png',
  'plush_bunny_plush.png',
];

function processAccessory(fileName) {
  const filePath = path.join('src/assets/accessories', fileName);
  const buf = fs.readFileSync(filePath);
  const png = PNG.sync.read(buf);
  const { width, height, data } = png;
  const total = width * height;

  // 1. Flood fill to find the background from all outer border pixels
  const isBg = new Uint8Array(total);
  const queue = [];

  for (let x = 0; x < width; x++) {
    queue.push(x);
    queue.push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    queue.push(y * width);
    queue.push(y * width + (width - 1));
  }

  for (const q of queue) isBg[q] = 1;

  while (queue.length > 0) {
    const curr = queue.pop();
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    const neighbors = [
      cy > 0 ? curr - width : -1,
      cy < height - 1 ? curr + width : -1,
      cx > 0 ? curr - 1 : -1,
      cx < width - 1 ? curr + 1 : -1,
    ];

    for (const n of neighbors) {
      if (n >= 0 && isBg[n] === 0) {
        const idx = n * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        // Background is black or near-black
        if (a < 50 || lum < 55) {
          isBg[n] = 1;
          queue.push(n);
        }
      }
    }
  }

  // 2. Identify object mask (non-background)
  const isObject = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    isObject[i] = isBg[i] === 0 ? 1 : 0;
  }

  // 3. Compute distance transform from background (to find 2px border)
  const INF = 999999;
  const distFromBg = new Int32Array(total);
  for (let i = 0; i < total; i++) {
    distFromBg[i] = isBg[i] === 1 ? 0 : INF;
  }

  // Forward pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (distFromBg[idx] > 0) {
        let d = distFromBg[idx];
        if (x > 0) d = Math.min(d, distFromBg[idx - 1] + 1);
        if (y > 0) d = Math.min(d, distFromBg[idx - width] + 1);
        distFromBg[idx] = d;
      }
    }
  }

  // Backward pass
  for (let y = height - 1; y >= 0; y--) {
    for (let x = width - 1; x >= 0; x--) {
      const idx = y * width + x;
      if (distFromBg[idx] > 0) {
        let d = distFromBg[idx];
        if (x < width - 1) d = Math.min(d, distFromBg[idx + 1] + 1);
        if (y < height - 1) d = Math.min(d, distFromBg[idx + width] + 1);
        distFromBg[idx] = d;
      }
    }
  }

  const isPale = PALE_WHITE_ITEMS.includes(fileName);
  const outPng = new PNG({ width, height });

  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    if (isBg[i] === 1) {
      // 100% transparent background!
      outPng.data[idx] = 0;
      outPng.data[idx + 1] = 0;
      outPng.data[idx + 2] = 0;
      outPng.data[idx + 3] = 0;
    } else {
      const d = distFromBg[i];
      const origR = data[idx];
      const origG = data[idx + 1];
      const origB = data[idx + 2];

      if (d <= 2) {
        // Border: 2px thin outline
        if (isPale) {
          // Sharp contrast dark slate border #1E293B (30, 41, 59)
          outPng.data[idx] = 30;
          outPng.data[idx + 1] = 41;
          outPng.data[idx + 2] = 59;
          outPng.data[idx + 3] = 255;
        } else {
          // Darker shade of original color, or dark slate #334155
          outPng.data[idx] = Math.min(origR, 50);
          outPng.data[idx + 1] = Math.min(origG, 50);
          outPng.data[idx + 2] = Math.min(origB, 65);
          outPng.data[idx + 3] = 255;
        }
      } else {
        // Interior (d > 2)
        if (isPale) {
          // Check for colored feature (like red cross on doctor hat or pink inner ear on bunny)
          const isRedFeature = origR > 140 && origG < 110 && origB < 110;
          const isPinkFeature = origR > 210 && origG < 160 && origB > 160;

          if (isRedFeature) {
            // Keep vibrant red for doctor hat cross
            outPng.data[idx] = 239;
            outPng.data[idx + 1] = 68;
            outPng.data[idx + 2] = 68;
            outPng.data[idx + 3] = 255;
          } else if (isPinkFeature) {
            // Keep cute pink for bunny ear
            outPng.data[idx] = 244;
            outPng.data[idx + 1] = 114;
            outPng.data[idx + 2] = 182;
            outPng.data[idx + 3] = 255;
          } else {
            // Clean crisp white/off-white #FAFBFD (250, 251, 253)
            // Add subtle soft 3D shading if original had depth
            const origLum = 0.299 * origR + 0.587 * origG + 0.114 * origB;
            const whiteShade = origLum > 180 ? 255 : 242;
            outPng.data[idx] = whiteShade;
            outPng.data[idx + 1] = whiteShade;
            outPng.data[idx + 2] = Math.min(255, whiteShade + 2);
            outPng.data[idx + 3] = 255;
          }
        } else {
          // For colored items, retain full color vibrance
          outPng.data[idx] = origR;
          outPng.data[idx + 1] = origG;
          outPng.data[idx + 2] = origB;
          outPng.data[idx + 3] = 255;
        }
      }
    }
  }

  // Write processed PNG
  fs.writeFileSync(filePath, PNG.sync.write(outPng));
  console.log(`[FIXED] ${fileName.padEnd(28)} -> Transparent BG, thin 2px border, ${isPale ? 'pure white interior' : 'preserved color'}`);
}

const files = fs.readdirSync('src/assets/accessories').filter(f => f.endsWith('.png'));
console.log(`Processing all ${files.length} accessories...`);
for (const f of files) {
  processAccessory(f);
}
console.log('All accessories fixed successfully!');
