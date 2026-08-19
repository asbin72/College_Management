import http from 'http';
import mysql from 'mysql2/promise';

console.log("--- CHECKING BACKEND SERVER & MYSQL DATABASE ---");

// Test 1: Express API on Port 5000
const req = http.get('http://localhost:5000/api/auth/login', (res) => {
  console.log(`[API Server] Responded with status: ${res.statusCode}`);
});

req.on('error', (err) => {
  console.log(`[API Server] Not reachable on port 5000: ${err.message}`);
});

// Test 2: MySQL Connection to localhost:3306
async function testMySQL() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'kalpanaa_education_db'
    });
    console.log('[MySQL Server] Successfully connected to MySQL database: kalpanaa_education_db!');
    const [rows] = await conn.query('SELECT COUNT(*) as count FROM students');
    console.log(`[MySQL Server] Total students in MySQL database: ${rows[0].count}`);
    await conn.end();
  } catch (err) {
    console.log(`[MySQL Server] Connection failed: ${err.message}`);
  }
}

testMySQL();
