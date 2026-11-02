const fs = require('fs');
const { PNG } = require('pngjs');

// 1. Create a pristine, smooth, cute 3D chibi Doctor Hat (256x256)
// Crisp thin 2px dark slate outline (#1E293B), pure white 3D curved cap, vibrant red cross in center!
function createPristineDoctorHat() {
  const w = 256, h = 256;
  const png = new PNG({ width: w, height: h });

  // Draw smooth doctor cap shape:
  // Center (128, 145), width 180, height 100
  // Top slight concave or straight, sides angled, bottom curved
  const canvas = new Uint8Array(w * h); // 0 = transparent, 1 = border, 2 = white interior, 3 = red cross

  // Geometry:
  // Top: (48, 100) to (208, 100)
  // Bottom curve: from (38, 175) curving down to (128, 195) to (218, 175)
  // Left side: (48, 100) to (38, 175)
  // Right side: (208, 100) to (218, 175)
  // Top rim curve: (48, 100) to (128, 110) to (208, 100)
  // Top dome: (48, 100) curving up to (128, 85) to (208, 100)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      // Normalised coordinates centered at (128, 140)
      const nx = (x - 128) / 88;
      // Bottom curve
      const bottomY = 185 - 12 * (1 - nx * nx);
      // Top curve
      const topY = 92 + 10 * (nx * nx);

      if (Math.abs(nx) <= 1.0 && y >= topY && y <= bottomY) {
        // Inside hat body!
        // Red cross in center: (128, 138)
        const crossW = 12;
        const crossH = 34;
        const inVertCross = Math.abs(x - 128) <= crossW / 2 && Math.abs(y - 138) <= crossH / 2;
        const inHorizCross = Math.abs(x - 128) <= crossH / 2 && Math.abs(y - 138) <= crossW / 2;

        if (inVertCross || inHorizCross) {
          canvas[idx] = 3; // Red cross
        } else {
          canvas[idx] = 2; // White cap
        }
      }
    }
  }

  // Add 2px dark border around hat and around cross
  const border = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      if (canvas[idx] !== 0) {
        // Check if adjacent to transparent
        let touchesEmpty = false;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            if (dx * dx + dy * dy <= 4) {
              const ni = (y + dy) * w + (x + dx);
              if (canvas[ni] === 0) touchesEmpty = true;
            }
          }
        }
        if (touchesEmpty) border[idx] = 1;

        // Border around red cross
        if (canvas[idx] === 3) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ni = (y + dy) * w + (x + dx);
              if (canvas[ni] === 2) border[idx] = 4; // cross outline
            }
          }
        }
      }
    }
  }

  // Render to PNG
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const c = canvas[y * w + x];
      const b = border[y * w + x];

      if (c === 0) {
        // Transparent
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0;
      } else if (b === 1) {
        // 2px crisp dark slate outline #1E293B
        png.data[idx] = 30;
        png.data[idx + 1] = 41;
        png.data[idx + 2] = 59;
        png.data[idx + 3] = 255;
      } else if (c === 3) {
        // Red cross #EF4444
        if (b === 4) {
          png.data[idx] = 185;
          png.data[idx + 1] = 28;
          png.data[idx + 2] = 28;
        } else {
          png.data[idx] = 239;
          png.data[idx + 1] = 68;
          png.data[idx + 2] = 68;
        }
        png.data[idx + 3] = 255;
      } else {
        // Pure White interior #FFFFFF with subtle soft depth gradient
        const dy = (y - 92) / (185 - 92);
        const shade = Math.round(255 - dy * 6);
        png.data[idx] = shade;
        png.data[idx + 1] = shade;
        png.data[idx + 2] = Math.min(255, shade + 2);
        png.data[idx + 3] = 255;
      }
    }
  }

  fs.writeFileSync('src/assets/accessories/hat_doctor_hat.png', PNG.sync.write(png));
  console.log('Created pristine hat_doctor_hat.png');
}

// 2. Create a pristine, smooth, cute 3D chibi Chef Hat (256x256)
// Crisp thin 2px dark slate outline (#1E293B), fluffy 3-puff mushroom crown, pure white interior, lower headband
function createPristineChefHat() {
  const w = 256, h = 256;
  const png = new PNG({ width: w, height: h });
  const canvas = new Uint8Array(w * h); // 0 = bg, 2 = white, 3 = fold shading

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;

      // Headband: x: 75..181, y: 165..198
      const inBand = x >= 72 && x <= 184 && y >= 165 && y <= 198;

      // Fluffy puffs:
      // Center puff: center (128, 105), radius 50
      const dCenter = Math.hypot(x - 128, y - 105);
      const inCenterPuff = dCenter <= 50;

      // Left puff: center (85, 125), radius 42
      const dLeft = Math.hypot(x - 85, y - 125);
      const inLeftPuff = dLeft <= 42;

      // Right puff: center (171, 125), radius 42
      const dRight = Math.hypot(x - 171, y - 125);
      const inRightPuff = dRight <= 42;

      // Middle fill: between puffs and band
      const inMiddle = x >= 70 && x <= 186 && y >= 110 && y <= 170;

      if (inBand || inCenterPuff || inLeftPuff || inRightPuff || inMiddle) {
        canvas[idx] = 2; // White chef hat interior
      }
    }
  }

  // Border: 2px thin outline
  const border = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      if (canvas[idx] === 2) {
        let touchesEmpty = false;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            if (dx * dx + dy * dy <= 4) {
              const ni = (y + dy) * w + (x + dx);
              if (canvas[ni] === 0) touchesEmpty = true;
            }
          }
        }
        if (touchesEmpty) border[idx] = 1;

        // Band fold line at y = 166
        if (y === 166 && x >= 74 && x <= 182) {
          border[idx] = 2; // Subtle inner crease
        }
      }
    }
  }

  // Render to PNG
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const c = canvas[y * w + x];
      const b = border[y * w + x];

      if (c === 0) {
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0;
      } else if (b === 1) {
        // Thin 2px crisp dark slate outline #1E293B
        png.data[idx] = 30;
        png.data[idx + 1] = 41;
        png.data[idx + 2] = 59;
        png.data[idx + 3] = 255;
      } else if (b === 2) {
        // Subtle crease #CBD5E1 (slate-300)
        png.data[idx] = 203;
        png.data[idx + 1] = 213;
        png.data[idx + 2] = 225;
        png.data[idx + 3] = 255;
      } else {
        // Pure White interior #FFFFFF
        const dy = (y - 55) / 145;
        const shade = Math.round(255 - dy * 5);
        png.data[idx] = shade;
        png.data[idx + 1] = shade;
        png.data[idx + 2] = Math.min(255, shade + 2);
        png.data[idx + 3] = 255;
      }
    }
  }

  fs.writeFileSync('src/assets/accessories/hat_chef_hat.png', PNG.sync.write(png));
  console.log('Created pristine hat_chef_hat.png');
}

createPristineDoctorHat();
createPristineChefHat();
