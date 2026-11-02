const fs = require('fs');
const path = require('path');

const creativeArtContent = fs.readFileSync('src/data/creativeArtData.ts', 'utf8');

// Find all template blocks in COLORING_BOOK_TEMPLATES
const templateMatches = [...creativeArtContent.matchAll(/id:\s*'([^']+)',\s*titleVi:\s*'([^']+)',\s*titleEn:\s*'([^']+)',\s*emoji:\s*'([^']+)',\s*imageUrl:\s*([a-zA-Z0-9_]+)/g)];

console.log(`Found ${templateMatches.length} templates:`);

// Map variable names to imported paths
const importMatches = [...creativeArtContent.matchAll(/import\s+([a-zA-Z0-9_]+)\s+from\s+'\.\.\/assets\/images\/([^']+)';/g)];
const importMap = {};
for (const m of importMatches) {
  importMap[m[1]] = m[2];
}

const templates = [];
for (const m of templateMatches) {
  const varName = m[5];
  const file = importMap[varName] || varName;
  templates.push({
    id: m[1],
    titleVi: m[2],
    titleEn: m[3],
    emoji: m[4],
    file: file,
  });
  console.log(`- ${m[1]} (${m[2]}): ${file}`);
}

console.log('\nAll coloring_*.png in src/assets/images:');
const allImgs = fs.readdirSync('src/assets/images').filter(f => f.startsWith('coloring_') && f.endsWith('.png'));
console.log(allImgs);
