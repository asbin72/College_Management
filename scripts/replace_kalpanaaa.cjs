const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.git') && !filePath.includes('dist')) {
        getFiles(filePath, fileList);
      }
    } else if (/\.(jsx?|html|json)$/i.test(file)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const targetDirs = [
  path.join(__dirname, '../src'),
  path.join(__dirname, '../server'),
  path.join(__dirname, '../index.html')
];

let filesToUpdate = [];
targetDirs.forEach(target => {
  if (fs.existsSync(target)) {
    if (fs.statSync(target).isDirectory()) {
      getFiles(target, filesToUpdate);
    } else {
      filesToUpdate.push(target);
    }
  }
});

let modifiedCount = 0;
filesToUpdate.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace Kalpanaa (2 a's) with Kalpanaaa (3 a's)
  // 1. KALPANAA (all caps, without 3rd A) -> KALPANAAA
  // 2. Kalpanaa (Title case, without 3rd a) -> Kalpanaaa
  // 3. kalpanaa (lowercase, without 3rd a, excluding kalpanaa_education_db or updating DB strings if needed)
  
  let newContent = content
    .replace(/KALPANAA(?!A)/g, 'KALPANAAA')
    .replace(/Kalpanaa(?!a)/g, 'Kalpanaaa')
    .replace(/kalpanaa(?!a)/g, 'kalpanaaa');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    modifiedCount++;
    console.log(`Updated: ${path.relative(path.join(__dirname, '..'), file)}`);
  }
});

console.log(`\n🎉 Total ${modifiedCount} files updated with 'Kalpanaaa' (3 a's).`);
