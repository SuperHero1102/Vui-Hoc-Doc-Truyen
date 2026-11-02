const fs = require('fs');
const { PNG } = require('pngjs');

const files = fs.readdirSync('src/assets/accessories').filter(f => f.endsWith('.png'));

console.log('FILE\t\t\t\tTRANSPARENT\tOPAQUE\tCORNER COLOR');
for (const f of files) {
  const buf = fs.readFileSync(`src/assets/accessories/${f}`);
  const png = PNG.sync.read(buf);
  let trans = 0;
  for (let i = 0; i < png.width * png.height; i++) {
    if (png.data[i * 4 + 3] < 50) trans++;
  }
  const cornerR = png.data[0];
  const cornerG = png.data[1];
  const cornerB = png.data[2];
  const cornerA = png.data[3];
  console.log(`${f.padEnd(28)}\t${trans}\t${png.width * png.height - trans}\trgba(${cornerR},${cornerG},${cornerB},${cornerA})`);
}
