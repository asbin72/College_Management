import mysql from 'mysql2/promise';

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

  const tablesToClear = [
    'students',
    'teachers',
    'courses',
    'subjects',
    'attendance_logs',
    'teacher_attendance_logs',
    'faculty_class_assignments',
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
    'announcements',
    'audit_logs'
  ];

  console.log('🧹 Clearing all demo data from MySQL database...');

  try {
    for (const table of tablesToClear) {
      try {
        await dbPool.query(`DELETE FROM ${table}`);
        console.log(`  ✓ Cleared table: ${table}`);
      } catch (err) {
        console.warn(`  ⚠️ Could not clear ${table}:`, err.message);
      }
    }

    // Verify Admin account exists
    const [admins] = await dbPool.query('SELECT COUNT(*) as count FROM admins');
    if (admins[0].count === 0) {
      await dbPool.query(`
        INSERT INTO admins (id, employeeId, name, email, password, designation)
        VALUES ('user-admin', 'ADM-001', 'Administrator', 'admin@kalpanaaa.edu', 'admin123', 'Super Administrator & Dean')
      `);
      console.log('  🔑 Preserved default admin account (admin@kalpanaaa.edu / admin123)');
    }

    console.log('✨ Database cleanup complete! All demo data has been removed.');
  } catch (err) {
    console.error('❌ Error clearing database:', err);
  } finally {
    await dbPool.end();
  }
}

clearAllDemoData();
