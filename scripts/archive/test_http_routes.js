import http from 'http';

const routesToTest = [
  '/',
  '/about',
  '/about/leadership',
  '/academics',
  '/academics/curriculum',
  '/academics/departments',
  '/academics/courses',
  '/admissions',
  '/admissions/application',
  '/campus-life',
  '/library',
  '/faculty',
  '/news',
  '/events',
  '/gallery',
  '/faq',
  '/contact',
  '/login'
];

let completed = 0;
let passed = 0;
let failed = 0;

console.log("Testing HTTP status on all public routes...");

routesToTest.forEach(route => {
  const req = http.get(`http://localhost:5173${route}`, (res) => {
    completed++;
    if (res.statusCode === 200) {
      passed++;
      console.log(`[HTTP 200 OK] http://localhost:5173${route}`);
    } else {
      failed++;
      console.error(`[HTTP ${res.statusCode} ERROR] http://localhost:5173${route}`);
    }

    if (completed === routesToTest.length) {
      console.log(`\nHTTP TEST SUMMARY: ${passed}/${routesToTest.length} Routes Responded 200 OK`);
      process.exit(failed > 0 ? 1 : 0);
    }
  });

  req.on('error', (err) => {
    completed++;
    failed++;
    console.error(`[NETWORK ERROR] http://localhost:5173${route} -> ${err.message}`);
    if (completed === routesToTest.length) {
      process.exit(1);
    }
  });
});
