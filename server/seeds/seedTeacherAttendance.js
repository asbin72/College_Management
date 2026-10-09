import mysql from 'mysql2/promise';

async function seedTeacherAttendance() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaaa_education_db'
  });

  console.log('🔄 Connected to MySQL kalpanaaa_education_db...');

  // 1. Create table if not exists
  await conn.query(`
    CREATE TABLE IF NOT EXISTS teacher_attendance_logs (
      id VARCHAR(50) PRIMARY KEY,
      teacherId VARCHAR(50) NOT NULL,
      teacherName VARCHAR(100) NOT NULL,
      department VARCHAR(100) NOT NULL,
      designation VARCHAR(100) DEFAULT 'Faculty Member',
      date VARCHAR(50) NOT NULL,
      checkInTime VARCHAR(50) DEFAULT '08:45 AM',
      checkOutTime VARCHAR(50) DEFAULT '04:45 PM',
      status VARCHAR(20) DEFAULT 'Present',
      biometricMode VARCHAR(50) DEFAULT 'Biometric Punch / Smart Card',
      remarks VARCHAR(255) DEFAULT 'Regular Academic Day',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await conn.query('DELETE FROM teacher_attendance_logs');

  // 2. Fetch all 18 real teachers
  const [teachers] = await conn.query('SELECT employeeId, name, department, designation FROM teachers ORDER BY employeeId');

  const dates = ['2026-08-14', '2026-08-15'];
  const logs = [];

  for (const d of dates) {
    for (const t of teachers) {
      let status = 'Present';
      let checkInTime = '08:45 AM';
      let checkOutTime = '04:45 PM';
      let remarks = 'Regular Academic Day';

      // Realistic variation: Prof. Amit Verma on IEEE Conference leave on 2026-08-15
      if (t.employeeId === 'EMP-108' && d === '2026-08-15') {
        status = 'On-Duty';
        checkInTime = '---';
        checkOutTime = '---';
        remarks = 'Academic Conference Duty (Approved)';
      } else if (t.employeeId === 'EMP-114' && d === '2026-08-14') {
        status = 'Leave';
        checkInTime = '---';
        checkOutTime = '---';
        remarks = 'Casual Leave (Approved)';
      } else {
        const min = 40 + ((t.name.charCodeAt(0) + (d === '2026-08-15' ? 5 : 0)) % 15);
        checkInTime = `08:${min < 10 ? '0' + min : min} AM`;
        checkOutTime = '04:55 PM';
      }

      logs.push([
        `tatt-${d}-${t.employeeId}`,
        t.employeeId,
        t.name,
        t.department,
        t.designation || 'Faculty Member',
        d,
        checkInTime,
        checkOutTime,
        status,
        'Biometric Smart Card',
        remarks
      ]);
    }
  }

  await conn.query(`
    INSERT INTO teacher_attendance_logs (
      id, teacherId, teacherName, department, designation, date,
      checkInTime, checkOutTime, status, biometricMode, remarks
    ) VALUES ?
  `, [logs]);

  const [count] = await conn.query('SELECT COUNT(*) as total, SUM(CASE WHEN status="Present" OR status="On-Duty" THEN 1 ELSE 0 END) as present, SUM(CASE WHEN status="Leave" OR status="Absent" THEN 1 ELSE 0 END) as absent FROM teacher_attendance_logs');
  console.log('✅ Real Teacher Attendance Logs Seeded into Database:');
  console.log(`Total Logs: ${count[0].total} | Present/On-Duty: ${count[0].present} | Leave/Absent: ${count[0].absent}`);

  await conn.end();
}

seedTeacherAttendance().catch(err => {
  console.error('❌ Error seeding teacher attendance:', err);
  process.exit(1);
});
