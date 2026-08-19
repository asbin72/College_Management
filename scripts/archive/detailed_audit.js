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

const sourceFiles = allFiles.filter(f => !f.relPath.startsWith('scratch/') && f.relPath !== 'package-lock.json');
const fileContents = {};
for (const f of allFiles) {
  if (['.js', '.jsx', '.json', '.html', '.css'].includes(f.ext)) {
    fileContents[f.relPath] = fs.readFileSync(f.fullPath, 'utf8');
  }
}

// 1. Check file reference usage
const fileUsage = [];

for (const file of sourceFiles) {
  const baseName = path.basename(file.relPath, file.ext);
  const ext = file.ext;
  let refs = [];

  // Exclude entry points from being flagged as unreferenced
  const isEntryPoint = ['index.html', 'package.json', 'postcss.config.js', 'tailwind.config.js', 'vite.config.js', 'src/main.jsx', 'src/index.css', 'src/App.jsx', 'server/index.js', 'server/init_db.js'].includes(file.relPath);

  if (!isEntryPoint) {
    for (const [otherRel, content] of Object.entries(fileContents)) {
      if (otherRel === file.relPath) continue;
      // Search for import path or basename
      const cleanBase = baseName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const regex = new RegExp(`['"\`][^'"\`]*${cleanBase}(\\.[a-zA-Z0-9]+)?['"\`]|<${cleanBase}[\\s/>]`, 'g');
      if (regex.test(content)) {
        refs.push(otherRel);
      }
    }
    fileUsage.push({ file: file.relPath, refs, isUnused: refs.length === 0, size: file.size });
  }
}

console.log('=== UNUSED / ORPHANED SOURCE FILES ===');
fileUsage.filter(f => f.isUnused).forEach(f => {
  console.log(`- ${f.file} (${f.size} bytes) -> 0 references across project`);
});

console.log('\n=== ALL FILES AND REFERENCE COUNTS ===');
fileUsage.forEach(f => {
  if (f.refs.length <= 2) {
    console.log(`- ${f.file}: referenced in ${JSON.stringify(f.refs)}`);
  }
});

// 2. Check components usage in src/
console.log('\n=== COMPONENT USAGE AUDIT ===');
const components = allFiles.filter(f => f.relPath.startsWith('src/components/'));
for (const comp of components) {
  const compName = path.basename(comp.relPath, comp.ext);
  const users = [];
  for (const [rPath, content] of Object.entries(fileContents)) {
    if (rPath === comp.relPath) continue;
    if (content.includes(compName)) {
      users.push(rPath);
    }
  }
  console.log(`Component: ${compName} (${comp.relPath}) -> Used in ${users.length} files: ${JSON.stringify(users)}`);
}

// 3. Check pages usage in App.jsx or anywhere
console.log('\n=== PAGES USAGE AUDIT ===');
const pages = allFiles.filter(f => f.relPath.startsWith('src/pages/'));
for (const page of pages) {
  const pageName = path.basename(page.relPath, page.ext);
  const users = [];
  for (const [rPath, content] of Object.entries(fileContents)) {
    if (rPath === page.relPath) continue;
    if (content.includes(pageName)) {
      users.push(rPath);
    }
  }
  console.log(`Page: ${pageName} (${page.relPath}) -> Used in ${users.length} files: ${JSON.stringify(users)}`);
}

// 4. Check services & data usage
console.log('\n=== SERVICES & DATA USAGE AUDIT ===');
const servicesAndData = allFiles.filter(f => f.relPath.startsWith('src/services/') || f.relPath.startsWith('src/data/'));
for (const item of servicesAndData) {
  const itemName = path.basename(item.relPath, item.ext);
  const users = [];
  for (const [rPath, content] of Object.entries(fileContents)) {
    if (rPath === item.relPath) continue;
    if (content.includes(itemName)) {
      users.push(rPath);
    }
  }
  console.log(`Item: ${itemName} (${item.relPath}) -> Used in ${users.length} files: ${JSON.stringify(users)}`);
}
