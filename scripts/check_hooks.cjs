const fs = require('fs');
const path = require('path');

function checkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      checkDir(full);
    } else if (f.endsWith('.jsx') || f.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      
      const hooks = ['useState', 'useEffect', 'useMemo', 'useCallback', 'useRef', 'useContext'];
      for (const hook of hooks) {
        // check if hook is used as a function call e.g. useMemo(
        const regexUsage = new RegExp('\\b' + hook + '\\s*\\(', 'g');
        if (regexUsage.test(content)) {
          // check if imported from react
          const importMatch = content.match(/import\s+[\s\S]*?from\s+['"]react['"]/);
          if (!importMatch || !new RegExp('\\b' + hook + '\\b').test(importMatch[0])) {
            console.log(`❌ MISSING ${hook} in: ${full}`);
          }
        }
      }
    }
  }
}

checkDir('src');
