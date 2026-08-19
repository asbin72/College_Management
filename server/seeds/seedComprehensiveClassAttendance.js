import mysql from 'mysql2/promise';

async function seedComprehensiveAttendance() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaa_education_db'
  });

  console.log('🔄 Connected to MySQL kalpanaaa_education_db...');

  // 1. Fetch all 260 real students
  const [students] = await conn.query('SELECT studentId, name, department, departmentCode, year, semester FROM students ORDER BY department, year, studentId');
  console.log(`Found ${students.length} students in database.`);

  // 2. Fetch all courses
  const [allSubjects] = await conn.query('SELECT code, name, department, year, semester FROM courses');

  // Map each student's year/department to corresponding subject
  const getSubjectForStudent = (s) => {
    const deptCode = s.departmentCode;
    const year = s.year;

    // Direct mapping to prominent departmental subject for that year
    const subjectMap = {
      'CSE-1st Year': { code: 'CSE-101', name: 'Engineering Mathematics & Computing' },
      'CSE-2nd Year': { code: 'CSE-401', name: 'Design & Analysis of Algorithms' },
      'CSE-3rd Year': { code: 'CSE-501', name: 'Artificial Intelligence & Neural Networks' },
      'CSE-4th Year': { code: 'CSE-701', name: 'Advanced Distributed Systems & Blockchain' },

      'ISE-1st Year': { code: 'ISE-101', name: 'Principles of Information Systems' },
      'ISE-2nd Year': { code: 'ISE-301', name: 'Data Structures & Discrete Mathematics' },
      'ISE-3rd Year': { code: 'ISE-501', name: 'Full Stack Web Engineering & Architecture' },
      'ISE-4th Year': { code: 'ISE-701', name: 'Big Data Analytics & Data Warehousing' },

      'ECE-1st Year': { code: 'ECE-101', name: 'Basic Electronics & Circuit Analysis' },
      'ECE-2nd Year': { code: 'ECE-301', name: 'Analog Electronic Circuits & Simulation' },
      'ECE-3rd Year': { code: 'ECE-501', name: 'Digital Signal Processing & Filter Design' },
      'ECE-4th Year': { code: 'ECE-701', name: 'Wireless & 5G Cellular Communications' },

      'EEE-1st Year': { code: 'EEE-101', name: 'Electric Circuit Analysis' },
      'EEE-2nd Year': { code: 'EEE-301', name: 'Electrical Machines & Electromagnetics' },
      'EEE-3rd Year': { code: 'EEE-501', name: 'Power System Analysis & Smart Grids' },
      'EEE-4th Year': { code: 'EEE-701', name: 'Electric Vehicle Dynamics & Motor Drives' },

      'ME-1st Year': { code: 'ME-101', name: 'Engineering Mechanics & Statics' },
      'ME-2nd Year': { code: 'ME-301', name: 'Thermodynamics & Thermal Power' },
      'ME-3rd Year': { code: 'ME-501', name: 'Design of Machine Elements & CAD' },
      'ME-4th Year': { code: 'ME-701', name: 'Finite Element Analysis & Robotics' },

      'CE-1st Year': { code: 'CE-101', name: 'Surveying & Geomatics' },
      'CE-2nd Year': { code: 'CE-301', name: 'Strength of Materials (Civil)' },
      'CE-3rd Year': { code: 'CE-501', name: 'Structural Analysis II' },
      'CE-4th Year': { code: 'CE-701', name: 'Design of Steel Structures' },

      'MBA-1st Year': { code: 'MBA-101', name: 'Corporate Financial Strategy' },
      'MBA-2nd Year': { code: 'MBA-301', name: 'Advanced Organizational Behavior & Leadership' }
    };

    const key = `${deptCode}-${year}`;
    if (subjectMap[key]) return subjectMap[key];

    // Fallback: match from subjects table
    const matched = allSubjects.find(sub => sub.code.startsWith(deptCode) && sub.year === year);
    if (matched) return { code: matched.code, name: matched.name };

    return { code: `${deptCode}-101`, name: `${s.department} Core Lecture` };
  };

  await conn.query('DELETE FROM attendance_logs');

  const todayStr = new Date().toISOString().split('T')[0];
  const dates = [todayStr, '2026-08-15', '2026-08-14'];
  const logs = [];

  for (const d of dates) {
    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      const sub = getSubjectForStudent(s);
      
      // Predictable realistic attendance pattern: ~91% Present, ~9% Absent
      const isAbsent = (i % 10 === 7); // Exactly 1 student absent per class of 10
      const status = isAbsent ? 'Absent' : 'Present';
      const period = '09:30 AM';
      const classId = `class-${s.departmentCode.toLowerCase()}-${s.year.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

      logs.push([
        `att-${d}-${s.studentId}`,
        s.studentId,
        s.name,
        sub.code,
        sub.name,
        classId,
        d,
        period,
        status,
        'EMP-101'
      ]);
    }
  }

  await conn.query(`
    INSERT INTO attendance_logs (id, studentId, studentName, subjectCode, subjectName, classId, date, period, status, markedBy)
    VALUES ?
  `, [logs]);

  const [count] = await conn.query('SELECT count(*) as total, count(DISTINCT subjectCode) as subCount, count(DISTINCT studentId) as studentCount FROM attendance_logs WHERE date = "2026-08-15"');
  console.log(`✅ Seeded comprehensive attendance for Today (2026-08-15): ${count[0].total} logs across ${count[0].studentCount} students and ${count[0].subCount} class subjects.`);

  const [samples] = await conn.query('SELECT subjectCode, subjectName, count(*) as studentsCount FROM attendance_logs WHERE date = "2026-08-15" GROUP BY subjectCode, subjectName ORDER BY subjectCode');
  console.table(samples);

  await conn.end();
}

seedComprehensiveAttendance().catch(err => {
  console.error('❌ Error seeding comprehensive attendance:', err);
  process.exit(1);
});
