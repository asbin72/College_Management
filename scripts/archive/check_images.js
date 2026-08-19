import fs from 'fs';
import https from 'https';

const content = fs.readFileSync('src/pages/public/CampusLife.jsx', 'utf8');
const urls = [...content.matchAll(/https:\/\/images\.unsplash\.com\/photo-[^"'\s]+/g)].map(m => m[0]);
console.log(`Checking ${urls.length} images in CampusLife.jsx...`);

for (const url of urls) {
  https.get(url, (res) => {
    if (res.statusCode !== 200) {
      console.log(`BROKEN [${res.statusCode}]: ${url}`);
    } else {
      console.log(`VALID [200]: ${url.substring(0, 70)}...`);
    }
  }).on('error', (err) => {
    console.log(`ERROR: ${url} -> ${err.message}`);
  });
}
