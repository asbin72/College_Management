import mysql from 'mysql2/promise';

const LEAVE_ENTRIES = [
  {
    id: 'LEV-2026-001',
    applicantId: 'EMP-108',
    applicantName: 'Prof. Amit Verma',
    applicantRole: 'TEACHER',
    department: 'Computer Science and Engineering',
    leaveType: 'Academic / Conference Duty',
    fromDate: '2026-08-20',
    toDate: '2026-08-22',
    days: 3,
    reason: 'Presenting research paper on Neural Networks at IEEE International Computing Conference, IIT Delhi.',
    status: 'Pending',
    appliedOn: '2026-08-14'
  },
  {
    id: 'LEV-2026-002',
    applicantId: 'STU-CSE-101',
    applicantName: 'Aarav Patel',
    applicantRole: 'STUDENT',
    department: 'Computer Science and Engineering',
    leaveType: 'Medical Leave',
    fromDate: '2026-08-18',
    toDate: '2026-08-19',
    days: 2,
    reason: 'Acute viral fever and doctor recommended bed rest. Medical certificate attached.',
    status: 'Pending',
    appliedOn: '2026-08-15'
  },
  {
    id: 'LEV-2026-003',
    applicantId: 'EMP-114',
    applicantName: 'Dr. Harish Nambiar',
    applicantRole: 'TEACHER',
    department: 'Electronics and Communication Engineering',
    leaveType: 'Casual Leave',
    fromDate: '2026-08-25',
    toDate: '2026-08-26',
    days: 2,
    reason: 'Attending family wedding ceremony out of station.',
    status: 'Approved',
    appliedOn: '2026-08-10'
  },
  {
    id: 'LEV-2026-004',
    applicantId: 'STU-ECE-201',
    applicantName: 'Ananya Sharma',
    applicantRole: 'STUDENT',
    department: 'Electronics and Communication Engineering',
    leaveType: 'On-Duty (Hackathon)',
    fromDate: '2026-08-21',
    toDate: '2026-08-23',
    days: 3,
    reason: 'Representing university in Smart India Hackathon grand finale at Bangalore Tech Park.',
    status: 'Approved',
    appliedOn: '2026-08-11'
  },
  {
    id: 'LEV-2026-005',
    applicantId: 'EMP-105',
    applicantName: 'Dr. Vikramaditya Singh',
    applicantRole: 'TEACHER',
    department: 'Mechanical Engineering',
    leaveType: 'Special Casual Leave',
    fromDate: '2026-08-28',
    toDate: '2026-08-29',
    days: 2,
    reason: 'Invited as Doctoral Defense Examiner at NIT Surathkal.',
    status: 'Pending',
    appliedOn: '2026-08-15'
  },
  {
    id: 'LEV-2026-006',
    applicantId: 'STU-ME-301',
    applicantName: 'Rohan Joshi',
    applicantRole: 'STUDENT',
    department: 'Mechanical Engineering',
    leaveType: 'Family Emergency',
    fromDate: '2026-08-17',
    toDate: '2026-08-18',
    days: 2,
    reason: 'Urgent family emergency travel to hometown.',
    status: 'Pending',
    appliedOn: '2026-08-14'
  }
];

async function seedLeaves() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaaa_education_db'
  });

  console.log('🔄 Connected to MySQL kalpanaaa_education_db...');
  await conn.query('DELETE FROM leave_requests');

  for (const l of LEAVE_ENTRIES) {
    await conn.query(`
      INSERT INTO leave_requests (
        id, applicantId, applicantName, applicantRole, department,
        leaveType, fromDate, toDate, days, reason, status, appliedOn
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      l.id, l.applicantId, l.applicantName, l.applicantRole, l.department,
      l.leaveType, l.fromDate, l.toDate, l.days, l.reason, l.status, l.appliedOn
    ]);
  }

  const [rows] = await conn.query('SELECT id, applicantName, applicantRole, leaveType, days, status FROM leave_requests');
  console.log('✅ Real Leave Requests Seeded into MySQL Database:');
  console.table(rows);

  await conn.end();
}

seedLeaves().catch(err => {
  console.error('❌ Error seeding leaves:', err);
  process.exit(1);
});
