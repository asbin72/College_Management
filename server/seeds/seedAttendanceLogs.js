import mysql from 'mysql2/promise';

async function seedAttendance() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaaa_education_db'
  });

  console.log('🔄 Connecting to MySQL kalpanaaa_education_db...');

  // Fetch 1st Year & 2nd Year students across departments
  const [students] = await conn.query('SELECT studentId, name, department, departmentCode, semester FROM students ORDER BY departmentCode, year, studentId');

  await conn.query('DELETE FROM attendance_logs');

  const logs = [];
  const dates = ['2026-08-14', '2026-08-15'];

  for (const d of dates) {
    for (const stu of students) {
      const subjectCode = `${stu.departmentCode}-101`;
      const subjectName = 
        stu.departmentCode === 'CSE' ? 'Engineering Mathematics & Computing' :
        stu.departmentCode === 'ISE' ? 'Principles of Information Systems' :
        stu.departmentCode === 'ECE' ? 'Basic Electronics & Circuit Analysis' :
        stu.departmentCode === 'EEE' ? 'Electric Circuit Analysis' :
        stu.departmentCode === 'ME'  ? 'Engineering Mechanics & Statics' :
        stu.departmentCode === 'CE'  ? 'Surveying & Geomatics' : 'Corporate Financial Strategy';

      // 95% present, 5% absent
      const isAbsent = (stu.studentId.endsWith('03') && d === '2026-08-15') || (stu.studentId.endsWith('07') && d === '2026-08-14');
      const status = isAbsent ? 'Absent' : 'Present';

      logs.push([
        `att-${d}-${stu.studentId}`,
        stu.studentId,
        stu.name,
        subjectCode,
        subjectName,
        `CLS-${stu.departmentCode}-1-SEM1`,
        d,
        '09:30 AM',
        status,
        'EMP-101'
      ]);
    }
  }

  await conn.query(`
    INSERT INTO attendance_logs (
      id, studentId, studentName, subjectCode, subjectName,
      classId, date, period, status, markedBy
    ) VALUES ?
  `, [logs]);

  const [count] = await conn.query('SELECT COUNT(*) as total, SUM(CASE WHEN status="Present" THEN 1 ELSE 0 END) as present, SUM(CASE WHEN status="Absent" THEN 1 ELSE 0 END) as absent FROM attendance_logs');
  console.log('✅ Real Attendance Logs Seeded into Database:');
  console.log(`Total: ${count[0].total} | Present: ${count[0].present} | Absent: ${count[0].absent}`);

  await conn.end();
}

seedAttendance().catch(err => {
  console.error('❌ Error seeding attendance:', err);
  process.exit(1);
});
