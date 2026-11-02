const fs = require('fs');
const { PNG } = require('pngjs');

// Create a 600x320 test image showing:
// Left: Baby photo auto contain-fit (100% zoom) with accessories
// Right: Baby photo zoomed in (200% zoom) with accessories
const w = 620, h = 320;
const testPng = new PNG({ width: w, height: h });

for (let i = 0; i < w * h; i++) {
  testPng.data[i * 4] = 248;
  testPng.data[i * 4 + 1] = 250;
  testPng.data[i * 4 + 2] = 252;
  testPng.data[i * 4 + 3] = 255;
}

const docHat = PNG.sync.read(fs.readFileSync('src/assets/accessories/hat_doctor_hat.png'));
const glasses = PNG.sync.read(fs.readFileSync('src/assets/accessories/face_round_glasses.png'));

// Panel 1 (100% contain fit)
const p1X = 20, p1Y = 20, pSize = 270;
for (let y = 0; y < pSize; y++) {
  for (let x = 0; x < pSize; x++) {
    const idx = ((p1Y + y) * w + (p1X + x)) * 4;
    testPng.data[idx] = 255;
    testPng.data[idx + 1] = 241; // pastel pink bg
    testPng.data[idx + 2] = 242;
  }
}

// Draw baby portrait (simulated chibi baby face)
const faceCenterX = p1X + 135;
const faceCenterY = p1Y + 145;
for (let y = 0; y < pSize; y++) {
  for (let x = 0; x < pSize; x++) {
    const dx = p1X + x - faceCenterX;
    const dy = p1Y + y - faceCenterY;
    if (dx * dx / (65 * 65) + dy * dy / (75 * 75) <= 1.0) {
      const idx = ((p1Y + y) * w + (p1X + x)) * 4;
      testPng.data[idx] = 255;
      testPng.data[idx + 1] = 224;
      testPng.data[idx + 2] = 205; // warm skin tone
    }
  }
}

function drawSubImage(targetPng, targetX, targetY, targetW, targetH, srcPng) {
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

// Add Doctor hat and glasses to Panel 1 (100% zoom)
drawSubImage(testPng, p1X + 45, p1Y + 25, 180, 110, docHat);
drawSubImage(testPng, p1X + 85, p1Y + 115, 100, 60, glasses);

// Panel 2 (Zoomed 200%)
const p2X = 330, p2Y = 20;
for (let y = 0; y < pSize; y++) {
  for (let x = 0; x < pSize; x++) {
    const idx = ((p2Y + y) * w + (p2X + x)) * 4;
    testPng.data[idx] = 255;
    testPng.data[idx + 1] = 241;
    testPng.data[idx + 2] = 242;
  }
}

const face2CenterX = p2X + 135;
const face2CenterY = p2Y + 165;
for (let y = 0; y < pSize; y++) {
  for (let x = 0; x < pSize; x++) {
    const dx = p2X + x - face2CenterX;
    const dy = p2Y + y - face2CenterY;
    // 2x zoomed
    if (dx * dx / (130 * 130) + dy * dy / (150 * 150) <= 1.0) {
      const idx = ((p2Y + y) * w + (p2X + x)) * 4;
      testPng.data[idx] = 255;
      testPng.data[idx + 1] = 224;
      testPng.data[idx + 2] = 205;
    }
  }
}

// Add Doctor hat and glasses to Panel 2 (zoomed)
drawSubImage(testPng, p2X + 25, p2Y - 10, 220, 135, docHat);
drawSubImage(testPng, p2X + 65, p2Y + 95, 140, 85, glasses);

fs.writeFileSync('public/assets/test/test_photo_zoom_pan_v7.png', PNG.sync.write(testPng));
console.log('Saved test_photo_zoom_pan_v7.png successfully!');
