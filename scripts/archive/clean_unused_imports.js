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
      if (['.jsx', '.js'].includes(path.extname(file))) {
        allFiles.push({ fullPath, relPath });
      }
    }
  }
}

walk(path.join(rootDir, 'src'));

let totalCleaned = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file.fullPath, 'utf8');
  let originalContent = content;

  // Match import { a, b, c } from '...'
  const importBlockRegex = /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/g;
  
  content = content.replace(importBlockRegex, (fullMatch, identifiersStr, importPath) => {
    const identifiers = identifiersStr.split(',').map(s => s.trim()).filter(Boolean);
    const keptIdentifiers = [];

    for (const item of identifiers) {
      // Handle "X as Y"
      const parts = item.split(/\s+as\s+/);
      const usedName = (parts[1] || parts[0]).trim();

      // Check how many times usedName occurs outside this specific import statement
      const cleanUsed = usedName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const nameRegex = new RegExp(`\\b${cleanUsed}\\b`, 'g');
      const allMatches = originalContent.match(nameRegex) || [];
      
      // If it appears more than once in the file, it's used
      if (allMatches.length > 1) {
        keptIdentifiers.push(item);
      } else {
        // Unused!
        // console.log(`[${file.relPath}] Removing unused import: ${usedName} from ${importPath}`);
        totalCleaned++;
      }
    }

    if (keptIdentifiers.length === 0) {
      return ''; // Remove entire import line if nothing kept
    }

    if (keptIdentifiers.length === identifiers.length) {
      return fullMatch; // Unchanged
    }

    return `import { ${keptIdentifiers.join(', ')} } from '${importPath}';`;
  });

  // Clean up any double blank lines created
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  if (content !== originalContent) {
    fs.writeFileSync(file.fullPath, content, 'utf8');
    console.log(`Updated imports in: ${file.relPath}`);
  }
}

console.log(`\nSuccessfully cleaned ${totalCleaned} unused imports across codebase.`);
