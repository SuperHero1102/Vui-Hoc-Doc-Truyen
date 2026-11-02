const fs = require('fs');
const { PNG } = require('pngjs');

function inspectAccessory(file) {
  const buf = fs.readFileSync(`src/assets/accessories/${file}`);
  const png = PNG.sync.read(buf);
  console.log(`\n--- ${file} (${png.width}x${png.height}) ---`);
  const { width, height, data } = png;

  let transparent = 0;
  let semiTransparent = 0;
  let darkBorder = 0;
  let brightWhite = 0;

  for (let i = 0; i < width * height; i++) {
    const a = data[i * 4 + 3];
    if (a === 0) transparent++;
    else if (a < 240) semiTransparent++;
    else {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum < 70) darkBorder++;
      else if (lum > 220) brightWhite++;
    }
  }

  console.log(`Transparent: ${transparent}, Semi: ${semiTransparent}, Dark Border: ${darkBorder}, Bright White: ${brightWhite}`);
}

inspectAccessory('hat_doctor_hat.png');
inspectAccessory('hat_chef_hat.png');
inspectAccessory('hat_bunny_ears.png');
