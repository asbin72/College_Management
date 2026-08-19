import mysql from 'mysql2/promise';

const FACULTY_LIST = [
  // CSE
  { empId: 'EMP-101', name: 'Dr. Rajesh Sharma', deptCode: 'CSE', dept: 'Computer Science and Engineering', role: 'HOD' },
  { empId: 'EMP-118', name: 'Dr. Arvind Mukhopadhyay', deptCode: 'CSE', dept: 'Computer Science and Engineering', role: 'Dean' },
  { empId: 'EMP-108', name: 'Prof. Amit Verma', deptCode: 'CSE', dept: 'Computer Science and Engineering', role: 'Professor' },
  { empId: 'EMP-111', name: 'Prof. Nidhi Agarwal', deptCode: 'CSE', dept: 'Computer Science and Engineering', role: 'Professor' },

  // ISE
  { empId: 'EMP-102', name: 'Prof. Sunita Reddy', deptCode: 'ISE', dept: 'Information Science and Engineering', role: 'HOD' },
  { empId: 'EMP-112', name: 'Dr. Alok Banerjee', deptCode: 'ISE', dept: 'Information Science and Engineering', role: 'Professor' },
  { empId: 'EMP-109', name: 'Prof. Preeti Kulkarni', deptCode: 'ISE', dept: 'Information Science and Engineering', role: 'Professor' },

  // ECE
  { empId: 'EMP-103', name: 'Dr. Suresh Kumar', deptCode: 'ECE', dept: 'Electronics and Communication Engineering', role: 'HOD' },
  { empId: 'EMP-114', name: 'Dr. Harish Nambiar', deptCode: 'ECE', dept: 'Electronics and Communication Engineering', role: 'Professor' },

  // EEE
  { empId: 'EMP-104', name: 'Prof. Ramesh Rao', deptCode: 'EEE', dept: 'Electrical and Electronics Engineering', role: 'HOD' },
  { empId: 'EMP-115', name: 'Prof. Vandana Joshi', deptCode: 'EEE', dept: 'Electrical and Electronics Engineering', role: 'Professor' },

  // ME
  { empId: 'EMP-105', name: 'Dr. Vikramaditya Singh', deptCode: 'ME', dept: 'Mechanical Engineering', role: 'HOD' },
  { empId: 'EMP-116', name: 'Dr. Chetan Gokhale', deptCode: 'ME', dept: 'Mechanical Engineering', role: 'Professor' },

  // CE
  { empId: 'EMP-106', name: 'Dr. Meenakshi Sundaram', deptCode: 'CE', dept: 'Civil Engineering', role: 'HOD' },
  { empId: 'EMP-117', name: 'Prof. Smita Hegde', deptCode: 'CE', dept: 'Civil Engineering', role: 'Professor' },

  // MBA
  { empId: 'EMP-107', name: 'Dr. Brijesh Malhotra', deptCode: 'MBA', dept: 'Management Studies', role: 'HOD' },
  { empId: 'EMP-110', name: 'Dr. Sanjay Bhattacharya', deptCode: 'MBA', dept: 'Management Studies', role: 'Professor' },
  { empId: 'EMP-113', name: 'Prof. Rashmi Deshpande', deptCode: 'MBA', dept: 'Management Studies', role: 'Professor' }
];

const DEPARTMENTS = [
  { code: 'CSE', name: 'Computer Science and Engineering', course: 'B.Tech Computer Science & Engineering', years: 4 },
  { code: 'ISE', name: 'Information Science and Engineering', course: 'B.Tech Information Science & Engineering', years: 4 },
  { code: 'ECE', name: 'Electronics and Communication Engineering', course: 'B.Tech Electronics & Communication Engineering', years: 4 },
  { code: 'EEE', name: 'Electrical and Electronics Engineering', course: 'B.Tech Electrical & Electronics Engineering', years: 4 },
  { code: 'ME', name: 'Mechanical Engineering', course: 'B.Tech Mechanical Engineering', years: 4 },
  { code: 'CE', name: 'Civil Engineering', course: 'B.Tech Civil & Environmental Engineering', years: 4 },
  { code: 'MBA', name: 'Management Studies', course: 'Master of Business Administration (MBA)', years: 2 }
];

const YEAR_SEMS = [
  { year: '1st Year', sem: 'Semester 1', semCode: 'SEM1' },
  { year: '2nd Year', sem: 'Semester 3', semCode: 'SEM3' },
  { year: '3rd Year', sem: 'Semester 5', semCode: 'SEM5' },
  { year: '4th Year', sem: 'Semester 7', semCode: 'SEM7' }
];

async function seedClasses() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaaa_education_db'
  });

  console.log('🔄 Connected to MySQL kalpanaaa_education_db.');

  // 1. Create faculty_class_assignments table if not exists
  await conn.query(`
    CREATE TABLE IF NOT EXISTS faculty_class_assignments (
      assignmentId VARCHAR(50) PRIMARY KEY,
      classId VARCHAR(100) NOT NULL,
      facultyId VARCHAR(50) NOT NULL,
      facultyName VARCHAR(100) NOT NULL,
      departmentCode VARCHAR(20) NOT NULL,
      departmentName VARCHAR(100) NOT NULL,
      year VARCHAR(50) NOT NULL,
      semester VARCHAR(50) NOT NULL,
      section VARCHAR(20) DEFAULT 'Sec A',
      subjectCode VARCHAR(50) NOT NULL,
      subjectName VARCHAR(150) NOT NULL,
      studentCount INT DEFAULT 10,
      academicYear VARCHAR(50) DEFAULT '2026-2027',
      assignedDate VARCHAR(50),
      startDate VARCHAR(50),
      endDate VARCHAR(50),
      status VARCHAR(50) DEFAULT 'ACTIVE',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Clear existing classes and assignments
  await conn.query('DELETE FROM classes');
  await conn.query('DELETE FROM faculty_class_assignments');

  const classes = [];
  const assignments = [];
  let asnIdx = 1;

  for (const dept of DEPARTMENTS) {
    const deptFaculty = FACULTY_LIST.filter(f => f.deptCode === dept.code);

    for (let y = 0; y < dept.years; y++) {
      const yearInfo = YEAR_SEMS[y];
      const assignedTeacher = deptFaculty[y % deptFaculty.length] || deptFaculty[0];

      const classId = `CLS-${dept.code}-${y + 1}-${yearInfo.semCode}`;
      const classroom = `Block ${dept.code.charAt(0)}-${200 + (y + 1) * 10 + 4}`;

      // Insert class record
      classes.push([
        classId,
        dept.course,
        dept.name,
        yearInfo.sem,
        'Sec A',
        '2026-2027',
        classroom,
        10, // 10 students per class
        assignedTeacher.empId
      ]);

      // Core subject code and name for this class
      const subjectCode = `${dept.code}-${(y + 1) * 100 + 1}`;
      const subjectName = 
        dept.code === 'CSE' ? (y === 0 ? 'Engineering Mathematics & Computing' : y === 1 ? 'Data Structures & Algorithms' : y === 2 ? 'Artificial Intelligence & Neural Networks' : 'Cloud Architecture & DevOps') :
        dept.code === 'ISE' ? (y === 0 ? 'Principles of Information Systems' : y === 1 ? 'Object-Oriented Programming' : y === 2 ? 'Big Data Analytics & Engineering' : 'Cyber Security & Network Defense') :
        dept.code === 'ECE' ? (y === 0 ? 'Basic Electronics & Circuit Analysis' : y === 1 ? 'Digital System Design & HDL' : y === 2 ? 'VLSI Microchip Architecture' : '5G Wireless & RF Communications') :
        dept.code === 'EEE' ? (y === 0 ? 'Electric Circuit Analysis' : y === 1 ? 'Transformers & AC Electrical Machines' : y === 2 ? 'Power Electronics & Converters' : 'Smart Grid & Renewable Integration') :
        dept.code === 'ME'  ? (y === 0 ? 'Engineering Mechanics & Statics' : y === 1 ? 'Thermodynamics & Energy Systems' : y === 2 ? 'Industrial Robotics & Mechatronics' : 'CAD/CAM/CIM Digital Manufacturing') :
        dept.code === 'CE'  ? (y === 0 ? 'Surveying & Geomatics' : y === 1 ? 'Fluid Mechanics & Hydraulics' : y === 2 ? 'Structural Analysis & Seismic Design' : 'BIM & Smart Transportation Systems') :
        (y === 0 ? 'Corporate Financial Strategy' : 'Strategic Global Brand Management');

      // Insert assignment record
      assignments.push([
        `FAC-ASN-${String(asnIdx++).padStart(3, '0')}`,
        classId,
        assignedTeacher.empId,
        assignedTeacher.name,
        dept.code,
        dept.name,
        yearInfo.year,
        yearInfo.sem,
        'Sec A',
        subjectCode,
        subjectName,
        10, // 10 students
        '2026-2027',
        '2026-08-01',
        '2026-08-01',
        '2026-12-20',
        'ACTIVE'
      ]);
    }
  }

  // Insert into classes
  await conn.query(`
    INSERT INTO classes (id, course, department, semester, section, academicYear, classroom, studentCount, teacherId)
    VALUES ?
  `, [classes]);

  // Insert into faculty_class_assignments
  await conn.query(`
    INSERT INTO faculty_class_assignments (
      assignmentId, classId, facultyId, facultyName, departmentCode,
      departmentName, year, semester, section, subjectCode, subjectName,
      studentCount, academicYear, assignedDate, startDate, endDate, status
    ) VALUES ?
  `, [assignments]);

  const [resRows] = await conn.query('SELECT assignmentId, facultyName, departmentCode, year, semester, subjectName, studentCount FROM faculty_class_assignments ORDER BY departmentCode, year');
  console.log('✅ Successfully Created and Assigned Staff to all Classes in Database (10 Students / Class):');
  console.table(resRows);

  await conn.end();
}

seedClasses().catch(err => {
  console.error('❌ Error seeding classes:', err);
  process.exit(1);
});
