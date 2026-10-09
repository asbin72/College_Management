import mysql from 'mysql2/promise';

async function verify() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaaa_education_db'
  });

  console.log('================================================================');
  console.log('      KALPANAAA EDUCATION DATABASE — COMPLETE END-TO-END AUDIT   ');
  console.log('================================================================\n');

  const tables = [
    'users', 'students', 'teachers', 'departments', 'courses', 'classes',
    'subjects', 'faculty_class_assignments', 'attendance_logs', 'teacher_attendance_logs',
    'examinations', 'internal_marks', 'results', 'fee_payments',
    'leave_requests', 'helpdesk_tickets', 'announcements', 'audit_logs'
  ];

  console.log('--- 1. TABLE RECORD COUNTS ---');
  for (const t of tables) {
    try {
      const [[{ cnt }]] = await conn.query(`SELECT COUNT(*) as cnt FROM ${t}`);
      console.log(`  ✓ ${t.padEnd(28)} : ${cnt} records`);
    } catch (e) {
      console.log(`  ✗ ${t.padEnd(28)} : ERROR (${e.message})`);
    }
  }

  console.log('\n--- 2. STUDENT COHORTS & CLASS DISTRIBUTION ---');
  const [studentCohorts] = await conn.query(`
    SELECT departmentCode, year, semester, section, COUNT(*) as studentCount 
    FROM students 
    GROUP BY departmentCode, year, semester, section 
    ORDER BY departmentCode, year, semester
  `);
  console.table(studentCohorts);

  console.log('\n--- 3. FACULTY WORKLOAD & DEPARTMENT ASSIGNMENTS ---');
  const [facultyWorkload] = await conn.query(`
    SELECT t.employeeId, t.name, t.department, t.designation, 
           COUNT(fca.assignmentId) as assignedClasses
    FROM teachers t
    LEFT JOIN faculty_class_assignments fca ON t.employeeId = fca.facultyId
    GROUP BY t.employeeId, t.name, t.department, t.designation
    ORDER BY t.department, t.employeeId
  `);
  console.table(facultyWorkload);

  console.log('\n--- 4. SUBJECTS DISTRIBUTION PER DEPARTMENT ---');
  const [subjectDist] = await conn.query(`
    SELECT department, COUNT(*) as totalSubjects, 
           SUM(CASE WHEN credits >= 4 THEN 1 ELSE 0 END) as coreCredits,
           SUM(CASE WHEN credits < 4 THEN 1 ELSE 0 END) as practicalOrElective
    FROM subjects 
    GROUP BY department 
    ORDER BY department
  `);
  console.table(subjectDist);

  console.log('\n--- 5. RELATIONAL INTEGRITY & ORPHAN CHECKS ---');
  
  const [[{ orphanAtt }]] = await conn.query(`
    SELECT COUNT(*) as orphanAtt FROM attendance_logs a 
    LEFT JOIN students s ON a.studentId = s.studentId OR a.studentId = s.id 
    WHERE s.id IS NULL
  `);
  console.log(`  • Orphan Attendance Logs (Missing Student): ${orphanAtt} ${orphanAtt === 0 ? '✓ PASS' : '✗ FAIL'}`);

  const [[{ orphanMarks }]] = await conn.query(`
    SELECT COUNT(*) as orphanMarks FROM internal_marks m 
    LEFT JOIN students s ON m.studentId = s.studentId OR m.studentId = s.id 
    WHERE s.id IS NULL
  `);
  console.log(`  • Orphan Internal Marks Records (Missing Student): ${orphanMarks} ${orphanMarks === 0 ? '✓ PASS' : '✗ FAIL'}`);

  const [[{ orphanResults }]] = await conn.query(`
    SELECT COUNT(*) as orphanResults FROM results r 
    LEFT JOIN students s ON r.student_id = s.studentId OR r.student_id = s.id 
    WHERE s.id IS NULL
  `);
  console.log(`  • Orphan Results Summary Records (Missing Student): ${orphanResults} ${orphanResults === 0 ? '✓ PASS' : '✗ FAIL'}`);

  const [[{ orphanFca }]] = await conn.query(`
    SELECT COUNT(*) as orphanFca FROM faculty_class_assignments fca 
    LEFT JOIN teachers t ON fca.facultyId = t.employeeId OR fca.facultyId = t.id 
    WHERE t.id IS NULL
  `);
  console.log(`  • Orphan Faculty Assignments (Missing Teacher): ${orphanFca} ${orphanFca === 0 ? '✓ PASS' : '✗ FAIL'}`);

  const [[{ invalidAtt }]] = await conn.query(`
    SELECT COUNT(*) as invalidAtt FROM attendance_logs WHERE status NOT IN ('Present', 'Absent', 'Late', 'Excused')
  `);
  console.log(`  • Invalid Attendance Status Values: ${invalidAtt} ${invalidAtt === 0 ? '✓ PASS' : '✗ FAIL'}`);

  console.log('\n================================================================');
  console.log('       ALL DATABASE CHECKS COMPLETED SUCCESSFULLY!              ');
  console.log('================================================================');

  await conn.end();
}

verify().catch(console.error);
