import 'dotenv/config';
import mysql from 'mysql2/promise';
import { initializeDatabase } from '../server/init_db.js';

async function clearAllDemoData() {
  const dbPool = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'root',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'kalpanaa_education_db',
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 5,
    ssl: process.env.MYSQLHOST ? { rejectUnauthorized: false } : undefined
  });

  const operationalTablesToClear = [
    'attendance_logs',
    'teacher_attendance_logs',
    'examinations',
    'marks',
    'internal_marks',
    'results',
    'assignments',
    'assignment_submissions',
    'notifications',
    'leave_requests',
    'fee_payments',
    'admission_applications',
    'helpdesk_tickets',
    'audit_logs'
  ];

  console.log('🧹 Clearing operational demo data from MySQL database...');

  try {
    for (const table of operationalTablesToClear) {
      try {
        await dbPool.query(`DELETE FROM \`${table}\``);
        console.log(`  ✓ Cleared table: ${table}`);
      } catch (err) {
        console.warn(`  ⚠️ Could not clear ${table}:`, err.message);
      }
    }

    // Clean up any test departments or test accounts if present
    await dbPool.query(`DELETE FROM departments WHERE id LIKE 'dept-TEST%' OR code LIKE 'TEST%' OR name LIKE 'Department of Test%'`);
    await dbPool.query(`DELETE FROM students WHERE studentId LIKE 'TEST%' OR studentId LIKE 'DEMO-TEST%'`);
    await dbPool.query(`DELETE FROM teachers WHERE employeeId LIKE 'TEST%' OR id LIKE 'user-test%'`);

    console.log('✨ Operational data cleared. Ensuring institutional baseline is healthy...');
    await initializeDatabase();
    console.log('🎉 Database is clean, secure, and ready!');
  } catch (err) {
    console.error('❌ Error clearing database:', err);
  } finally {
    await dbPool.end();
  }
}

clearAllDemoData();
