const fs = require('fs');
const http = require('http');
const mysql = require('mysql2/promise');

async function runQAAudit() {
  console.log('====================================================');
  console.log('       MASTER QA BUG HUNT & AUDIT SUITE             ');
  console.log('====================================================\n');

  // 1. Check MySQL connection
  let conn;
  try {
    conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'kalpanaa_education_db'
    });
    console.log('✅ [DATABASE] Connected to MySQL: kalpanaa_education_db');
  } catch (e) {
    console.error('❌ [DATABASE] Failed to connect to MySQL:', e.message);
  }

  // 2. Check Database Tables
  if (conn) {
    const [tables] = await conn.query('SHOW TABLES');
    console.log(`✅ [DATABASE] Total Tables Found: ${tables.length}`);
    for (const t of tables) {
      const tableName = Object.values(t)[0];
      const [count] = await conn.query(`SELECT COUNT(*) as c FROM \`${tableName}\``);
      console.log(`   - ${tableName.padEnd(25)} : ${count[0].c} records`);
    }
  }

  // 3. Check Express Endpoints
  const serverContent = fs.readFileSync('server/index.js', 'utf8');
  const routeRegex = /app\.(get|post|put|delete)\(['"]([^'"]+)['"]/g;
  let match;
  const routes = [];
  while ((match = routeRegex.exec(serverContent)) !== null) {
    routes.push({ method: match[1].toUpperCase(), path: match[2] });
  }
  console.log(`\n✅ [API] Total Backend Endpoints Defined: ${routes.length}`);

  // 4. Test live API GET endpoints
  console.log('\n--- Testing Live API GET Endpoints (http://localhost:5000) ---');
  const getEndpoints = routes.filter(r => r.method === 'GET' && !r.path.includes(':'));
  
  for (const ep of getEndpoints) {
    try {
      const res = await fetch(`http://localhost:5000${ep.path}`);
      const status = res.status;
      let count = 0;
      if (res.ok) {
        const json = await res.json();
        count = Array.isArray(json) ? json.length : 1;
      }
      console.log(` [GET] ${ep.path.padEnd(30)} -> Status ${status} (${count} items)`);
    } catch (err) {
      console.log(` ❌ [GET] ${ep.path.padEnd(30)} -> Error: ${err.message}`);
    }
  }

  // 5. Test Cross-Portal Workflows & CRUD Operations
  console.log('\n--- Testing Core Auth Flows ---');
  
  const logins = [
    { role: 'ADMIN', id: 'admin@kalpanaaa.edu', pass: 'admin' },
    { role: 'ADMIN', id: 'admin@kalpanaa.edu', pass: 'admin123' },
    { role: 'STUDENT', id: 'student@kalpanaaa.edu', pass: 'student123' },
    { role: 'TEACHER', id: 'teacher@kalpanaaa.edu', pass: 'teacher123' },
    { role: 'STUDENT', id: 'STU-CSE-101', pass: 'student123' },
    { role: 'TEACHER', id: 'EMP-CSE-01', pass: 'teacher123' }
  ];

  for (const l of logins) {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: l.id, password: l.pass })
      });
      const data = await res.json();
      console.log(` [AUTH] ${l.role.padEnd(8)} (${l.id}) -> ${data.success ? '✅ PASSED' : `❌ FAILED (${data.message})`}`);
    } catch (e) {
      console.log(` ❌ [AUTH] ${l.role} (${l.id}) -> Error: ${e.message}`);
    }
  }

  if (conn) await conn.end();
}

runQAAudit();
