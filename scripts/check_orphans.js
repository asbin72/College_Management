import 'dotenv/config';
import mysql from 'mysql2/promise';

async function checkCols() {
  const connection = await mysql.createConnection(
    process.env.MYSQL_URL || {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'kalpanaa_edu'
    }
  );

  const [cols] = await connection.query(`DESCRIBE faculty_class_assignments`);
  console.log('faculty_class_assignments columns:', cols.map(c => c.Field));

  const [rows] = await connection.query(`SELECT fca.* FROM faculty_class_assignments fca LEFT JOIN teachers t ON fca.facultyId COLLATE utf8mb4_general_ci = t.employeeId COLLATE utf8mb4_general_ci WHERE t.employeeId IS NULL`);
  console.log(`faculty_class_assignments.facultyId -> teachers.employeeId orphans: ${rows.length}`);

  await connection.end();
}

checkCols().catch(console.error);
