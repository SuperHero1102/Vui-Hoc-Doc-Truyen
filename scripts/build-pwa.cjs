const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const PUBLIC = path.join(ROOT, 'public');

function hashFile(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function getAllFiles(dir, baseDir = dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      getAllFiles(full, baseDir, list);
    } else {
      const rel = '/' + path.relative(baseDir, full).replace(/\\/g, '/');
      list.push({ fullPath: full, relPath: rel });
    }
  }
  return list;
}

console.log('=== STARTING PWA PRODUCTION BUILD ===');

// 1. Run standard Vite build
console.log('Running: npm run build...');
execSync('npm run build', { stdio: 'inherit', cwd: ROOT });

if (!fs.existsSync(DIST)) {
  console.error('Build directory dist/ does not exist!');
  process.exit(1);
}

// 2. Gather all files in dist/
console.log('Scanning dist/ files and computing SHA-256 hashes...');
const allDistFiles = getAllFiles(DIST, DIST);

const fileHashes = {};
const priority1 = []; // Core app shell & critical assets
const priority2 = []; // Core UI sounds, common graphics, first songs
const priority3 = []; // Remaining music and high-res media

for (const f of allDistFiles) {
  const rel = f.relPath;
  if (rel === '/version.json' || rel === '/sw-offline.js') continue;
  
  const hash = hashFile(f.fullPath);
  fileHashes[rel] = hash;

  if (
    rel === '/' ||
    rel === '/index.html' ||
    rel === '/manifest.webmanifest' ||
    rel === '/icon.svg' ||
    rel.includes('/apple-touch-icon') ||
    rel.includes('/pwa-') ||
    rel.endsWith('.css') ||
    (rel.endsWith('.js') && rel.includes('index-'))
  ) {
    priority1.push(rel);
  } else if (
    rel.includes('/assets/music/chau-len-ba') ||
    rel.includes('/assets/music/rua-mat-nhu-meo') ||
    rel.includes('/assets/music/con-co-be-be') ||
    rel.includes('/assets/music/ca-nha-thuong-nhau') ||
    rel.includes('/assets/music/the-abc-alphabet-song') ||
    rel.includes('real_') ||
    rel.includes('toon3d_')
  ) {
    priority2.push(rel);
  } else {
    priority3.push(rel);
  }
}

// 3. Compute overall core hash
const coreHashString = priority1.map(p => fileHashes[p] || '').join(':');
const coreHash = crypto.createHash('sha256').update(coreHashString).digest('hex').slice(0, 16);

// Package version or timestamp-based version
let pkgVersion = '1.0.0';
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  pkgVersion = pkg.version || '1.0.0';
} catch {}

const versionData = {
  version: `${pkgVersion}-${coreHash}`,
  buildTime: new Date().toISOString(),
  coreHash,
  killSwitch: false, // Emergency kill-switch: if true, clients clear cache and reload clean
  totalFiles: Object.keys(fileHashes).length,
  priorities: {
    priority1: priority1.sort(),
    priority2: priority2.sort(),
    priority3: priority3.sort(),
  },
  files: fileHashes
};

// 4. Write version.json to dist/ and public/
const versionJsonDist = path.join(DIST, 'version.json');
const versionJsonPublic = path.join(PUBLIC, 'version.json');

fs.writeFileSync(versionJsonDist, JSON.stringify(versionData, null, 2));
fs.writeFileSync(versionJsonPublic, JSON.stringify(versionData, null, 2));

console.log(`Generated version.json: version ${versionData.version} with ${versionData.totalFiles} files.`);
console.log(`- Priority 1 (Core shell): ${priority1.length} files`);
console.log(`- Priority 2 (High usage): ${priority2.length} files`);
console.log(`- Priority 3 (Remaining media): ${priority3.length} files`);
console.log('=== PWA BUILD COMPLETED SUCCESSFULLY ===');
