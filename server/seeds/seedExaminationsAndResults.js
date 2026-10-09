import mysql from 'mysql2/promise';

async function seedExamsAndResults() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaaa_education_db'
  });

  console.log('🔄 Connecting to MySQL kalpanaaa_education_db...');

  // 1. Fetch Students
  const [students] = await conn.query('SELECT id, studentId, name, department, departmentCode, course, year, semester FROM students ORDER BY departmentCode, year, studentId');
  console.log(`📊 Found ${students.length} students in database to associate results.`);

  // 2. Clear previous exam data
  await conn.query('DELETE FROM internal_marks');
  await conn.query('DELETE FROM result_details');
  await conn.query('DELETE FROM results');
  await conn.query('DELETE FROM examinations');

  // 3. Define Standard Examinations across Departments
  const exams = [
    {
      id: 'EXAM-2026-01',
      name: 'Spring 2026 Mid-Semester Assessment',
      type: 'Mid-Term',
      department: 'Computer Science and Engineering',
      course: 'B.Tech Computer Science & Engineering',
      semester: 'Semester 1',
      subjectCode: 'CSE-101',
      subjectName: 'Engineering Mathematics & Computing',
      assignedTeacherId: 'EMP-101',
      date: '2026-08-25',
      time: '10:00 AM - 01:00 PM',
      room: 'Lab 304 - Turing Hall',
      maxMarks: 100,
      eligibilityAttendance: 75,
      status: 'Results Published',
      isPublished: 1
    },
    {
      id: 'EXAM-2026-02',
      name: 'Spring 2026 Mid-Semester Assessment',
      type: 'Mid-Term',
      department: 'Computer Science and Engineering',
      course: 'B.Tech Computer Science & Engineering',
      semester: 'Semester 3',
      subjectCode: 'CSE-201',
      subjectName: 'Data Structures & Algorithms',
      assignedTeacherId: 'EMP-118',
      date: '2026-08-27',
      time: '02:00 PM - 05:00 PM',
      room: 'Hall B - Edison Building',
      maxMarks: 100,
      eligibilityAttendance: 75,
      status: 'Results Published',
      isPublished: 1
    },
    {
      id: 'EXAM-2026-03',
      name: 'Spring 2026 Mid-Semester Assessment',
      type: 'Mid-Term',
      department: 'Information Science and Engineering',
      course: 'B.Tech Information Science & Engineering',
      semester: 'Semester 1',
      subjectCode: 'ISE-101',
      subjectName: 'Principles of Information Systems',
      assignedTeacherId: 'EMP-102',
      date: '2026-08-26',
      time: '10:00 AM - 01:00 PM',
      room: 'Hall C - Lovelace Block',
      maxMarks: 100,
      eligibilityAttendance: 75,
      status: 'Results Published',
      isPublished: 1
    },
    {
      id: 'EXAM-2026-04',
      name: 'Spring 2026 Mid-Semester Assessment',
      type: 'Mid-Term',
      department: 'Electronics and Communication Engineering',
      course: 'B.Tech Electronics & Communication Engineering',
      semester: 'Semester 1',
      subjectCode: 'ECE-101',
      subjectName: 'Basic Electronics & Circuit Analysis',
      assignedTeacherId: 'EMP-103',
      date: '2026-08-28',
      time: '10:00 AM - 01:00 PM',
      room: 'Lab 201 - Tesla Lab',
      maxMarks: 100,
      eligibilityAttendance: 75,
      status: 'Results Published',
      isPublished: 1
    },
    {
      id: 'EXAM-2026-05',
      name: 'Spring 2026 Mid-Semester Assessment',
      type: 'Mid-Term',
      department: 'Mechanical Engineering',
      course: 'B.Tech Mechanical Engineering',
      semester: 'Semester 1',
      subjectCode: 'ME-101',
      subjectName: 'Engineering Mechanics & Statics',
      assignedTeacherId: 'EMP-105',
      date: '2026-08-29',
      time: '10:00 AM - 01:00 PM',
      room: 'Workshop 102 - Watt Block',
      maxMarks: 100,
      eligibilityAttendance: 75,
      status: 'Results Published',
      isPublished: 1
    },
    {
      id: 'EXAM-2026-06',
      name: 'Spring 2026 Mid-Semester Assessment',
      type: 'Mid-Term',
      department: 'Civil Engineering',
      course: 'B.Tech Civil & Environmental Engineering',
      semester: 'Semester 1',
      subjectCode: 'CE-101',
      subjectName: 'Surveying & Geomatics',
      assignedTeacherId: 'EMP-106',
      date: '2026-08-30',
      time: '10:00 AM - 01:00 PM',
      room: 'Room 105 - Visvesvaraya Hall',
      maxMarks: 100,
      eligibilityAttendance: 75,
      status: 'Results Published',
      isPublished: 1
    },
    {
      id: 'EXAM-2026-07',
      name: 'Spring 2026 Mid-Semester Assessment',
      type: 'Mid-Term',
      department: 'Management Studies',
      course: 'Master of Business Administration (MBA)',
      semester: 'Semester 1',
      subjectCode: 'MBA-101',
      subjectName: 'Corporate Financial Strategy',
      assignedTeacherId: 'EMP-107',
      date: '2026-08-31',
      time: '02:00 PM - 05:00 PM',
      room: 'Executive Seminar Hall A',
      maxMarks: 100,
      eligibilityAttendance: 75,
      status: 'Results Published',
      isPublished: 1
    }
  ];

  for (const ex of exams) {
    await conn.query(`
      INSERT INTO examinations (
        id, name, type, department, course, semester, subjectCode,
        subjectName, assignedTeacherId, date, time, room, maxMarks,
        eligibilityAttendance, status, isPublished
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      ex.id, ex.name, ex.type, ex.department, ex.course, ex.semester, ex.subjectCode,
      ex.subjectName, ex.assignedTeacherId, ex.date, ex.time, ex.room, ex.maxMarks,
      ex.eligibilityAttendance, ex.status, ex.isPublished
    ]);
  }

  // 4. Generate & Insert Marks for all 10 students in each class
  const internalMarks = [];
  const results = [];
  const resultDetails = [];
  let resIdx = 1;

  for (const ex of exams) {
    // Find matching 10 students for this exam's department and semester
    const enrolledStudents = students.filter(s => 
      (s.departmentCode === ex.subjectCode.split('-')[0] || s.department.toLowerCase().includes(ex.department.toLowerCase().slice(0, 8))) &&
      s.semester === ex.semester
    );

    console.log(`📝 Inserting marks for ${enrolledStudents.length} students in ${ex.id} (${ex.subjectCode} - ${ex.semester})...`);

    enrolledStudents.forEach((stu, idx) => {
      const marksObtained = 72 + ((idx * 7 + 13) % 25);
      const grade = marksObtained >= 90 ? 'O' : marksObtained >= 80 ? 'A+' : marksObtained >= 70 ? 'A' : marksObtained >= 60 ? 'B+' : 'B';
      const gradePoint = marksObtained >= 90 ? 10 : marksObtained >= 80 ? 9 : marksObtained >= 70 ? 8 : marksObtained >= 60 ? 7 : 6;

      internalMarks.push([
        `MRK-${ex.id}-${stu.studentId}`,
        ex.id,
        stu.studentId,
        stu.name,
        ex.subjectCode,
        ex.subjectName,
        marksObtained,
        100,
        grade,
        'Submitted',
        1, // published
        'Official evaluation validated by Department Review Board.'
      ]);

      const resultId = `RES-${stu.studentId}-${ex.semester.replace(/\s+/g, '')}`;
      
      results.push([
        resultId,
        stu.studentId,
        ex.semester,
        (gradePoint * 0.95).toFixed(2),
        (gradePoint * 0.92).toFixed(2),
        4,
        'Published',
        new Date()
      ]);

      resultDetails.push([
        resultId,
        ex.subjectCode,
        ex.subjectName,
        4,
        Math.floor(marksObtained * 0.4),
        Math.floor(marksObtained * 0.6),
        marksObtained,
        grade,
        gradePoint
      ]);
    });
  }

  if (internalMarks.length > 0) {
    await conn.query(`
      INSERT INTO internal_marks (
        id, examId, studentId, studentName, subjectCode, subjectName,
        marksObtained, maxMarks, grade, status, published, remarks
      ) VALUES ?
    `, [internalMarks]);
  }

  if (results.length > 0) {
    await conn.query(`
      INSERT INTO results (
        id, student_id, semester, sgpa, cgpa, credits_earned, status, published_at
      ) VALUES ?
      ON DUPLICATE KEY UPDATE sgpa=VALUES(sgpa), cgpa=VALUES(cgpa), status=VALUES(status)
    `, [results]);
  }

  if (resultDetails.length > 0) {
    await conn.query(`
      INSERT INTO result_details (
        resultId, subjectCode, subjectName, credits,
        internalMarks, externalMarks, totalMarks, grade, gradePoint
      ) VALUES ?
    `, [resultDetails]);
  }

  const [exCount] = await conn.query('SELECT COUNT(*) as count FROM examinations');
  const [mrkCount] = await conn.query('SELECT COUNT(*) as count FROM internal_marks');
  const [resCount] = await conn.query('SELECT COUNT(*) as count FROM results');

  console.log(`\n🎉 Verified Examination & Results in MySQL Database:`);
  console.log(`- Scheduled Examinations: ${exCount[0].count}`);
  console.log(`- Evaluated & Published Student Marks: ${mrkCount[0].count}`);
  console.log(`- Student Semester Grade Cards: ${resCount[0].count}\n`);

  await conn.end();
}

seedExamsAndResults().catch(err => {
  console.error('❌ Error seeding exams and results:', err);
  process.exit(1);
});
