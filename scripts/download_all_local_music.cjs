const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// We load the existing songs from kidsMusicData.ts
const content = fs.readFileSync('src/data/kidsMusicData.ts', 'utf8');

// Parse song blocks
const songBlockRegex = /{\s*id:\s*['"]([^'"]+)['"][\s\S]*?audioUrl:\s*['"]([^'"]+)['"]/g;
const matches = [...content.matchAll(songBlockRegex)];

console.log(`Found ${matches.length} songs with audioUrl in kidsMusicData.ts`);

const outDir = path.resolve('public/assets/music');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

let downloadedCount = 0;
for (const match of matches) {
  const id = match[1];
  const url = match[2];
  
  if (url.startsWith('/assets/music')) {
    continue; // already local
  }

  const destFile = path.join(outDir, `${id}.mp3`);
  if (fs.existsSync(destFile) && fs.statSync(destFile).size > 10000) {
    console.log(`[SKIP] Already exists: ${id}.mp3`);
    continue;
  }

  const tmpFile = `/tmp/${id}-raw.mp3`;
  console.log(`[DOWNLOADING] ${id} from ${url.substring(0, 50)}...`);
  try {
    execSync(`curl -sL --max-time 30 "${url}" -o "${tmpFile}"`);
    if (fs.existsSync(tmpFile) && fs.statSync(tmpFile).size > 1000) {
      execSync(`ffmpeg -y -i "${tmpFile}" -ac 1 -ab 64k "${destFile}" 2>/dev/null`);
      fs.unlinkSync(tmpFile);
      const sizeKB = (fs.statSync(destFile).size / 1024).toFixed(1);
      console.log(`[OK] Saved ${id}.mp3 (${sizeKB} KB)`);
      downloadedCount++;
    } else {
      console.warn(`[WARN] Download empty for ${id}`);
    }
  } catch (err) {
    console.error(`[ERROR] Failed to download/transcode ${id}:`, err.message);
  }
}

console.log(`Completed downloading ${downloadedCount} songs to public/assets/music/`);
