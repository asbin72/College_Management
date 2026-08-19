import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const allFiles = [];

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
    if (relPath.startsWith('node_modules') || relPath.startsWith('dist') || relPath.startsWith('.git')) {
      continue;
    }
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else {
      allFiles.push({ fullPath, relPath, size: stat.size, ext: path.extname(file) });
    }
  }
}

walk(rootDir);

const fileContents = {};
for (const f of allFiles) {
  if (['.js', '.jsx', '.json', '.html', '.css'].includes(f.ext)) {
    fileContents[f.relPath] = fs.readFileSync(f.fullPath, 'utf8');
  }
}

console.log('Total files found (excluding node_modules/dist/.git):', allFiles.length);

// 1. Files in src/
const srcFiles = allFiles.filter(f => f.relPath.startsWith('src/'));

console.log('\n--- Checking src/ files for unused status ---');
const unusedSrcFiles = [];
for (const file of srcFiles) {
  if (['src/main.jsx', 'src/App.jsx', 'src/index.css'].includes(file.relPath)) continue;
  const baseName = path.basename(file.relPath, file.ext);
  
  let refs = [];
  for (const [rPath, content] of Object.entries(fileContents)) {
    if (rPath === file.relPath) continue;
    // Check direct import or reference
    const cleanBase = baseName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(`['"\`][^'"\`]*${cleanBase}(\\.[a-zA-Z0-9]+)?['"\`]|<${cleanBase}[\\s/>]|\\b${cleanBase}\\b`, 'g');
    if (regex.test(content)) {
      refs.push(rPath);
    }
  }
  
  // Also filter refs: are the refs only from scratch/ or tests?
  const nonScratchRefs = refs.filter(r => !r.startsWith('scratch/'));
  if (nonScratchRefs.length === 0) {
    unusedSrcFiles.push({ file: file.relPath, size: file.size, scratchOnly: refs.length > 0 });
    console.log(`[UNUSED] ${file.relPath} (${file.size}B) - non-scratch refs: ${nonScratchRefs.length}, scratch refs: ${refs.length}`);
  }
}

console.log('\n--- Checking components in src/components/ ---');
const compFiles = allFiles.filter(f => f.relPath.startsWith('src/components/'));
for (const comp of compFiles) {
  const baseName = path.basename(comp.relPath, comp.ext);
  let appRefs = [];
  for (const [rPath, content] of Object.entries(fileContents)) {
    if (rPath === comp.relPath || rPath.startsWith('scratch/')) continue;
    if (content.includes(baseName)) {
      appRefs.push(rPath);
    }
  }
  console.log(`Comp: ${baseName} -> used in ${appRefs.length} app files: ${JSON.stringify(appRefs)}`);
}

console.log('\n--- Checking scratch/ files ---');
const scratchFiles = allFiles.filter(f => f.relPath.startsWith('scratch/'));
scratchFiles.forEach(f => {
  console.log(`Scratch file: ${f.relPath} (${f.size}B)`);
});
