import fs from 'fs';
import path from 'path';

const logosDir = path.join(process.cwd(), 'public', 'logos');

// Amazon: white text, orange smile
let amazon = fs.readFileSync(path.join(logosDir, 'amazon.svg'), 'utf8');
amazon = amazon.replace(/fill:#221f1f/g, 'fill:#ffffff');
fs.writeFileSync(path.join(logosDir, 'amazon.svg'), amazon);

// Accenture: white text + purple arrow
let acc = fs.readFileSync(path.join(logosDir, 'accenture.svg'), 'utf8');
acc = acc.replace(/fill="#000000"/g, 'fill="#ffffff"').replace(/fill="#000"/g, 'fill="#ffffff"');
if (!acc.includes('fill="#ffffff"') && !acc.includes('fill="#fff"')) {
  acc = acc.replace(/<path d=/g, '<path fill="#ffffff" d=');
}
fs.writeFileSync(path.join(logosDir, 'accenture.svg'), acc);

// Deloitte: white text + green dot
let del = fs.readFileSync(path.join(logosDir, 'deloitte.svg'), 'utf8');
del = del.replace(/fill="#000000"/g, 'fill="#ffffff"').replace(/fill="#000"/g, 'fill="#ffffff"').replace(/fill="#002776"/g, 'fill="#ffffff"');
fs.writeFileSync(path.join(logosDir, 'deloitte.svg'), del);

// Microsoft: white text
let ms = fs.readFileSync(path.join(logosDir, 'microsoft.svg'), 'utf8');
ms = ms.replace(/fill="#737373"/g, 'fill="#ffffff"');
fs.writeFileSync(path.join(logosDir, 'microsoft.svg'), ms);

// Cisco: white text and blue bridge
let cisco = fs.readFileSync(path.join(logosDir, 'cisco.svg'), 'utf8');
cisco = cisco.replace(/fill="#000000"/g, 'fill="#ffffff"').replace(/fill="#049fd9"/gi, 'fill="#00bceb"');
fs.writeFileSync(path.join(logosDir, 'cisco.svg'), cisco);

// TCS
let tcs = fs.readFileSync(path.join(logosDir, 'tcs.svg'), 'utf8');
tcs = tcs.replace(/fill="#000000"/g, 'fill="#ffffff"').replace(/fill="#000"/g, 'fill="#ffffff"');
fs.writeFileSync(path.join(logosDir, 'tcs.svg'), tcs);

// Wipro
let wipro = fs.readFileSync(path.join(logosDir, 'wipro.svg'), 'utf8');
wipro = wipro.replace(/fill="#231F20"/gi, 'fill="#ffffff"').replace(/fill="#000000"/g, 'fill="#ffffff"');
fs.writeFileSync(path.join(logosDir, 'wipro.svg'), wipro);

// Oracle
let oracle = fs.readFileSync(path.join(logosDir, 'oracle.svg'), 'utf8');
oracle = oracle.replace(/fill="#F80000"/gi, 'fill="#EA1B24"');
fs.writeFileSync(path.join(logosDir, 'oracle.svg'), oracle);

// Intel
let intel = fs.readFileSync(path.join(logosDir, 'intel.svg'), 'utf8');
intel = intel.replace(/fill="#000000"/g, 'fill="#0071C5"').replace(/fill="#0068B5"/gi, 'fill="#00C7FD"');
fs.writeFileSync(path.join(logosDir, 'intel.svg'), intel);

console.log('All 12 logos adjusted for dark background!');
