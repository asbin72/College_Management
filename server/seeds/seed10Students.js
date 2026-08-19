import mysql from 'mysql2/promise';

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Sneha', 'Aditya', 'Pooja', 'Vikram', 'Priya', 'Karthik', 'Divya',
  'Rahul', 'Neha', 'Siddharth', 'Kavya', 'Gautam', 'Ishita', 'Arjun', 'Meera', 'Varun', 'Rhea',
  'Nikhil', 'Tanvi', 'Manish', 'Shreya', 'Abhishek', 'Swati', 'Harsh', 'Ankita', 'Kunal', 'Deepika',
  'Pranav', 'Ritu', 'Akash', 'Shruti', 'Vishal', 'Pallavi', 'Sanjay', 'Natasha', 'Rajesh', 'Bhavna'
];

const LAST_NAMES = [
  'Patel', 'Deshmukh', 'Mehta', 'Kulkarni', 'Verma', 'Sharma', 'Nair', 'Iyer', 'Reddy', 'Gupta',
  'Banerjee', 'Chatterjee', 'Mukherjee', 'Joshi', 'Bhat', 'Rao', 'Shetty', 'Pillai', 'Menon', 'Hegde',
  'Singhania', 'Kapoor', 'Malhotra', 'Chauhan', 'Saxena', 'Pandey', 'Mishra', 'Tripathi', 'Dubey', 'Tiwari'
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
  { year: '1st Year', sem: 'Semester 1' },
  { year: '2nd Year', sem: 'Semester 3' },
  { year: '3rd Year', sem: 'Semester 5' },
  { year: '4th Year', sem: 'Semester 7' }
];

const BLOOD_GROUPS = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-'];

async function seed() {
  console.log('🔄 Connecting to MySQL kalpanaaa_education_db...');
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaaa_education_db'
  });

  console.log('🗑️ Cleaning legacy students, extra attendance logs and old test tickets...');
  await conn.query('DELETE FROM students');
  await conn.query('DELETE FROM attendance_logs WHERE date < "2026-08-01"');

  const students = [];
  let globalStudentNum = 1;

  for (const dept of DEPARTMENTS) {
    const yearsToGenerate = dept.years;

    for (let y = 0; y < yearsToGenerate; y++) {
      const yearInfo = YEAR_SEMS[y];

      // Exactly 10 students per year
      for (let s = 1; s <= 10; s++) {
        const fName = FIRST_NAMES[(globalStudentNum * 3 + s) % FIRST_NAMES.length];
        const lName = LAST_NAMES[(globalStudentNum * 7 + s) % LAST_NAMES.length];
        const fullName = `${fName} ${lName}`;
        const emailSlug = `${fName.toLowerCase()}.${lName.toLowerCase().slice(0, 3)}_${dept.code.toLowerCase()}${y+1}_${s}@kalpanaaa.edu`;

        const studentId = `STU-${dept.code}-${y + 1}${String(s).padStart(2, '0')}`;
        const rollNo = `24${dept.code}${y + 1}${String(s).padStart(3, '0')}`;
        const regNo = `REG-2024-${dept.code}-${String(100 + globalStudentNum).padStart(4, '0')}`;

        const gpa = (3.40 + ((s * 7 + y * 13) % 60) / 100).toFixed(2);
        const attNum = 85 + ((s * 3 + y * 5) % 14);
        const overallAttendance = `${attNum}%`;
        const pendingFees = s % 3 === 0 ? 15000 : s % 4 === 0 ? 25000 : 0;
        const blood = BLOOD_GROUPS[(s + y) % BLOOD_GROUPS.length];

        students.push([
          `stu-${dept.code.toLowerCase()}-${y + 1}-${s}`,
          fullName,
          emailSlug,
          'student123',
          studentId,
          rollNo,
          regNo,
          dept.name,
          dept.code,
          dept.course,
          yearInfo.year,
          yearInfo.sem,
          'Sec A',
          '2026-2027',
          overallAttendance,
          attNum,
          gpa,
          pendingFees,
          `+91 98${String(10000000 + globalStudentNum * 12345).slice(0, 8)}`,
          `Enrolled scholar in ${dept.course}, batch of ${2026 + (4 - y)}. Actively engaged in technical clubs and coursework.`,
          blood,
          `Room ${100 + s}, Student Residence Hall Block ${dept.code.charAt(0)}, Campus West, Bangalore, Karnataka - 560064`,
          `${LAST_NAMES[(s + 5) % LAST_NAMES.length]} Guardian`,
          `+91 97${String(20000000 + globalStudentNum * 54321).slice(0, 8)}`,
          `https://images.unsplash.com/photo-${1534528741775 + s}?auto=format&fit=crop&q=80&w=300`,
          `https://images.unsplash.com/photo-${1534528741775 + s}?auto=format&fit=crop&q=80&w=300`,
          'Active'
        ]);

        globalStudentNum++;
      }
    }
  }

  console.log(`📥 Inserting exactly ${students.length} clean student records (10 students per year per department)...`);

  const insertSql = `
    INSERT INTO students (
      id, name, email, password, studentId, rollNo, registerNumber,
      department, departmentCode, course, year, semester, section,
      academicYear, overallAttendance, attendanceNum, gpa, pendingFees,
      phone, bio, bloodGroup, address, guardianName, guardianPhone,
      avatar, photoUrl, status
    ) VALUES ?
  `;

  await conn.query(insertSql, [students]);

  const [verifyRows] = await conn.query('SELECT department, year, semester, COUNT(*) as count FROM students GROUP BY department, year, semester ORDER BY department, year, semester');
  console.log('✅ Verification of Clean Database Records (10 students per year):');
  console.table(verifyRows);

  const [totalRow] = await conn.query('SELECT COUNT(*) as total FROM students');
  console.log(`\n🎉 Total Real Students in Database: ${totalRow[0].total} (All excess data deleted).\n`);

  await conn.end();
}

seed().catch(err => {
  console.error('❌ Seeding Error:', err);
  process.exit(1);
});
