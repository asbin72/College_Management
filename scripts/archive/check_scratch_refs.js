import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const nonScratchFiles = [];

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
    if (relPath.startsWith('node_modules') || relPath.startsWith('dist') || relPath.startsWith('.git') || relPath.startsWith('scratch')) {
      continue;
    }
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else {
      nonScratchFiles.push({ fullPath, relPath });
    }
  }
}

walk(rootDir);

let refsToScratch = [];
for (const f of nonScratchFiles) {
  const content = fs.readFileSync(f.fullPath, 'utf8');
  if (content.includes('scratch/')) {
    refsToScratch.push(f.relPath);
  }
}

console.log('Production / main app files referencing scratch:', refsToScratch);

const scratchDir = path.join(rootDir, 'scratch');
const scratchFiles = fs.readdirSync(scratchDir);
console.log('\nAll scratch files:');
scratchFiles.forEach(f => {
  const stats = fs.statSync(path.join(scratchDir, f));
  console.log(`- scratch/${f} (${stats.size} bytes)`);
});
