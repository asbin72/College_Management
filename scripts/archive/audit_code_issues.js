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
    if (relPath.startsWith('node_modules') || relPath.startsWith('dist') || relPath.startsWith('.git') || relPath.startsWith('scratch')) {
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

const results = [];

for (const file of allFiles) {
  if (!['.js', '.jsx'].includes(file.ext)) continue;
  const content = fs.readFileSync(file.fullPath, 'utf8');
  const lines = content.split('\n');

  // Check imports
  const importMatches = [...content.matchAll(/import\s+(?:\{([^}]+)\}|([a-zA-Z0-9_$]+))\s+from\s+['"]([^'"]+)['"]/g)];
  for (const match of importMatches) {
    if (match[1]) {
      // Named imports
      const named = match[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
      for (const name of named) {
        // Count occurrences of 'name' in content (excluding the import line itself)
        const nameRegex = new RegExp(`\\b${name}\\b`, 'g');
        const count = (content.match(nameRegex) || []).length;
        if (count <= 1) {
          results.push({
            file: file.relPath,
            type: 'Unused Import',
            name,
            from: match[3],
            detail: `Imported from '${match[3]}' but never referenced in file.`
          });
        }
      }
    } else if (match[2]) {
      // Default import
      const defName = match[2].trim();
      if (defName === 'React') continue; // React is often used for JSX runtime
      const nameRegex = new RegExp(`\\b${defName}\\b`, 'g');
      const count = (content.match(nameRegex) || []).length;
      if (count <= 1) {
        results.push({
          file: file.relPath,
          type: 'Unused Default Import',
          name: defName,
          from: match[3],
          detail: `Default import from '${match[3]}' but never referenced in file.`
        });
      }
    }
  }
}

console.log(`Found ${results.length} unused imports:`);
results.forEach(r => console.log(`- [${r.file}] ${r.name} (${r.type}) from '${r.from}'`));
