const fs = require('fs');
const { PNG } = require('pngjs');

function analyzeAccessory(name) {
  const buf = fs.readFileSync(`src/assets/accessories/${name}`);
  const png = PNG.sync.read(buf);
  const colorMap = {};
  for (let i = 0; i < png.width * png.height; i++) {
    const r = png.data[i * 4];
    const g = png.data[i * 4 + 1];
    const b = png.data[i * 4 + 2];
    const a = png.data[i * 4 + 3];
    const key = `${Math.round(r/32)*32},${Math.round(g/32)*32},${Math.round(b/32)*32},${a}`;
    colorMap[key] = (colorMap[key] || 0) + 1;
  }
  console.log(`--- ${name} ---`);
  const sorted = Object.entries(colorMap).sort((a,b) => b[1] - a[1]).slice(0, 8);
  console.log(sorted);
}

analyzeAccessory('hat_doctor_hat.png');
analyzeAccessory('hat_chef_hat.png');
analyzeAccessory('hat_crown.png');
analyzeAccessory('face_round_glasses.png');
