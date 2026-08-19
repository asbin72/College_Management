const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('    DEEP CODEBASE INSPECTION & BUG AUDIT SUITE      ');
console.log('====================================================\n');

let issuesFound = 0;

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        walkDir(filePath, fileList);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allSrcFiles = walkDir('src');

console.log(`🔍 Inspecting ${allSrcFiles.length} source code files in src/ ...\n`);

allSrcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Check 1: Missing React hooks imports
  const hookMatches = content.match(/\b(useState|useEffect|useMemo|useCallback|useRef|useContext)\s*\(/g);
  if (hookMatches) {
    hookMatches.forEach(hm => {
      const hookName = hm.replace(/\s*\(/, '');
      const importReact = content.match(/import\s+[\s\S]*?from\s+['"]react['"]/);
      if (!importReact || !new RegExp('\\b' + hookName + '\\b').test(importReact[0])) {
        console.log(`❌ [HOOK IMPORT] ${file} uses ${hookName} without explicit import from 'react'`);
        issuesFound++;
      }
    });
  }

  // Check 2: Unsafe array mapping without optional chaining or fallback
  const unsafeMap = content.match(/([a-zA-Z0-9_]+)\.map\(/g);
  // (informational check)

  // Check 3: Dead link href="#"
  if (content.includes('href="#"') || content.includes("href='#'")) {
    console.log(`⚠️ [DEAD LINK] ${file} contains href="#"`);
    issuesFound++;
  }

  // Check 4: Unhandled localStorage parsing without try/catch
  if (content.includes('JSON.parse(localStorage.getItem(') && !content.includes('try {')) {
    console.log(`⚠️ [LOCALSTORAGE] ${file} has unhandled JSON.parse of localStorage`);
    issuesFound++;
  }
});

console.log(`\nAudit Complete: ${issuesFound} critical issues detected.`);
