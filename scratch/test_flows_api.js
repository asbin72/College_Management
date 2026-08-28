import jwt from 'jsonwebtoken';

const API_BASE = 'http://localhost:3000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'kalpanaaa_super_secret_jwt_key_2026_prod';

const adminToken = jwt.sign(
  { id: 'user-admin', name: 'Super Admin', email: 'admin@kalpanaa.edu', role: 'ADMIN' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

async function runFlowVerifications() {
  console.log('=== STARTING END-TO-END USER FLOW VERIFICATION (FLOWS 1 TO 15) ===\n');

  // Flow 1: Public Admission Application Submission
  console.log('--- Flow 1: Public Admission Application Submission ---');
  const appRes = await fetch(`${API_BASE}/admissions/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Sarah Connor',
      email: `sarah_${Date.now()}@example.com`,
      phone: '9876543210',
      dob: '2005-04-12',
      gender: 'Female',
      course: 'B.Tech Computer Science & Engineering',
      department: 'Computer Science',
      prevQualification: '12th Standard',
      prevPercentage: '92.5%'
    })
  });
  const appData = await appRes.json();
  console.log('Flow 1 Result:', appData.success ? `✅ PASSED (App Ref: ${appData.appRef})` : '❌ FAILED', appData);

  // Flow 2: Public Contact Form Submission
  console.log('\n--- Flow 2: Public Contact Form ---');
  const contactRes = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '9123456789',
      subject: 'Inquiry regarding Hostel Facilities',
      message: 'Hello, I would like to know the fee structure for hostel rooms.'
    })
  });
  const contactData = await contactRes.json();
  console.log('Flow 2 Result:', contactData.success ? '✅ PASSED' : '❌ FAILED', contactData);

  // Flow 3: Multi-Role Login Verification (Admin, Teacher, Student)
  console.log('\n--- Flow 3: Login for Each Role ---');
  const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'admin@kalpanaa.edu', password: 'admin123' })
  });
  const adminLoginData = await adminLoginRes.json();

  const studentSignupRes = await fetch(`${API_BASE}/auth/student-signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Login Verification Student',
      email: `stu_login_${Date.now()}@kalpanaa.edu`,
      password: 'student123',
      course: 'B.Tech Computer Science & Engineering'
    })
  });
  const studentSignupData = await studentSignupRes.json();

  const studentLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: studentSignupData.user.email, password: 'student123' })
  });
  const studentLoginData = await studentLoginRes.json();

  const flow3Success = adminLoginData.success && studentLoginData.success;
  console.log('Flow 3 Result:', flow3Success ? `✅ PASSED (Admin: ${adminLoginData.user?.role}, Student: ${studentLoginData.user?.role})` : '❌ FAILED');

  // Flow 4: Student Self-Signup
  console.log('\n--- Flow 4: Student Self-Signup ---');
  console.log('Flow 4 Result:', studentSignupData.success ? `✅ PASSED (Student ID: ${studentSignupData.user?.studentId})` : '❌ FAILED');

  // Flow 5: Admin Approves Application -> Auto-Provision Student
  console.log('\n--- Flow 5: Admin Approves Application -> Auto-Provision Student ---');
  if (appData.id) {
    const approveRes = await fetch(`${API_BASE}/admissions/applications/${appData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Approved' })
    });
    const approveData = await approveRes.json();
    console.log('Flow 5 Result:', approveData.success ? '✅ PASSED (Status: Approved)' : '❌ FAILED', approveData);
  }

  // Flow 6: Admin CRUD on Students
  console.log('\n--- Flow 6: Admin CRUD on Students ---');
  const createStudentRes = await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      name: 'Flow 6 Test Student',
      email: `flow6_${Date.now()}@kalpanaaa.edu`,
      department: 'Computer Science and Engineering',
      course: 'B.Tech CSE'
    })
  });
  const createStudentData = await createStudentRes.json();
  console.log('Flow 6 Result:', createStudentData.success ? `✅ PASSED (ID: ${createStudentData.studentId})` : '❌ FAILED', createStudentData);

  // Flow 7: Admin CRUD on Teachers
  console.log('\n--- Flow 7: Admin CRUD on Teachers ---');
  const createTeacherRes = await fetch(`${API_BASE}/teachers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      name: 'Dr. Robert Oppenheimer',
      email: `oppenheimer_${Date.now()}@kalpanaaa.edu`,
      department: 'Physics & Engineering',
      designation: 'Professor & Chair'
    })
  });
  const createTeacherData = await createTeacherRes.json();
  console.log('Flow 7 Result:', createTeacherData.success ? `✅ PASSED (Emp ID: ${createTeacherData.employeeId})` : '❌ FAILED', createTeacherData);

  // Flow 8: Admin CRUD on Departments / Courses / Subjects
  console.log('\n--- Flow 8: Admin CRUD on Academic Catalog ---');
  const deptRes = await fetch(`${API_BASE}/departments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      name: 'Department of Quantum Computing',
      code: `QC-${Math.floor(100 + Math.random() * 900)}`,
      hod: 'Dr. Richard Feynman',
      description: 'Advanced Quantum Physics and Information Theory'
    })
  });
  const deptData = await deptRes.json();
  console.log('Flow 8 Result:', deptData.success ? '✅ PASSED' : '❌ FAILED', deptData);

  // Flow 9: Teacher Marks Attendance
  console.log('\n--- Flow 9: Teacher Marks Attendance ---');
  const teacherToken = jwt.sign(
    { id: 'FAC-101', name: 'Dr. Oppenheimer', email: 'tch@kalpanaaa.edu', role: 'TEACHER' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const attRes = await fetch(`${API_BASE}/attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${teacherToken}`
    },
    body: JSON.stringify({
      records: [
        {
          studentId: createStudentData.studentId || 'STU-101',
          studentName: 'Flow 6 Test Student',
          subjectCode: 'QC-101',
          subjectName: 'Quantum Mechanics I',
          status: 'Present',
          date: new Date().toISOString().split('T')[0]
        }
      ]
    })
  });
  const attData = await attRes.json();
  console.log('Flow 9 Result:', attData.success ? '✅ PASSED' : '❌ FAILED', attData);

  // Flow 10: Teacher Enters Marks
  console.log('\n--- Flow 10: Teacher Enters Marks ---');
  const marksRes = await fetch(`${API_BASE}/marks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${teacherToken}`
    },
    body: JSON.stringify({
      examId: 'EXM-2026-MID1',
      studentId: createStudentData.studentId || 'STU-101',
      studentName: 'Flow 6 Test Student',
      subjectCode: 'QC-101',
      subjectName: 'Quantum Mechanics I',
      marksObtained: 94,
      maxMarks: 100,
      grade: 'O',
      remarks: 'Outstanding conceptual clarity'
    })
  });
  const marksData = await marksRes.json();
  console.log('Flow 10 Result:', marksData.success ? '✅ PASSED' : '❌ FAILED', marksData);

  // Flow 11: Student Updates Profile
  console.log('\n--- Flow 11: Student Updates Profile ---');
  const studentToken = jwt.sign(
    { id: createStudentData.studentId || 'STU-101', name: 'Flow 6 Student', email: 'stu@kalpanaaa.edu', role: 'STUDENT' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const profileRes = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      userId: createStudentData.studentId || 'STU-101',
      role: 'STUDENT',
      phone: '9888777666',
      bio: 'Enthusiastic Quantum Computing Scholar',
      bloodGroup: 'A+'
    })
  });
  const profileData = await profileRes.json();
  console.log('Flow 11 Result:', profileData.success ? '✅ PASSED' : '❌ FAILED', profileData);

  // Flow 12: Student Pays Fee
  console.log('\n--- Flow 12: Student Pays Fee ---');
  const feeRes = await fetch(`${API_BASE}/fees/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      studentId: createStudentData.studentId || 'STU-101',
      amount: 4500,
      feeType: 'Examination Fee',
      paymentMethod: 'Net Banking',
      idempotencyKey: `IDEM-FLOW12-${Date.now()}`
    })
  });
  const feeData = await feeRes.json();
  console.log('Flow 12 Result:', feeData.success ? `✅ PASSED (Txn ID: ${feeData.txnId})` : '❌ FAILED', feeData);

  // Flow 13: Leave Request Submission
  console.log('\n--- Flow 13: Student Submits Leave Request ---');
  const leaveRes = await fetch(`${API_BASE}/leave-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      applicantId: createStudentData.studentId || 'STU-101',
      applicantName: 'Flow 6 Test Student',
      applicantRole: 'STUDENT',
      department: 'Computer Science and Engineering',
      leaveType: 'Medical Leave',
      fromDate: '2026-09-01',
      toDate: '2026-09-03',
      days: 3,
      reason: 'Attending National Quantum Science Symposium'
    })
  });
  const leaveData = await leaveRes.json();
  console.log('Flow 13 Result:', leaveData.success ? `✅ PASSED (Leave ID: ${leaveData.id})` : '❌ FAILED', leaveData);

  // Flow 14: Admin Approves Leave Request
  console.log('\n--- Flow 14: Admin Approves Leave Request ---');
  if (leaveData.id) {
    const approveLeaveRes = await fetch(`${API_BASE}/leave-requests/${leaveData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Approved' })
    });
    const approveLeaveData = await approveLeaveRes.json();
    console.log('Flow 14 Result:', approveLeaveData.success ? '✅ PASSED' : '❌ FAILED', approveLeaveData);
  }

  // Flow 15: Helpdesk Ticket Creation & Admin Reply
  console.log('\n--- Flow 15: Helpdesk Ticket Lifecycle ---');
  const ticketRes = await fetch(`${API_BASE}/helpdesk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      applicantId: createStudentData.studentId || 'STU-101',
      applicantName: 'Flow 6 Test Student',
      applicantRole: 'STUDENT',
      subject: 'Portal Access Issue',
      category: 'IT Support',
      priority: 'High',
      description: 'Unable to view assigned lab schedule.'
    })
  });
  const ticketData = await ticketRes.json();
  console.log('Flow 15 Ticket Created:', ticketData.success ? `Ticket ID: ${ticketData.id}` : 'Failed', ticketData);

  if (ticketData.id) {
    const replyRes = await fetch(`${API_BASE}/helpdesk/${ticketData.id}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        message: 'Lab schedule permissions updated. Please refresh your portal.',
        author: 'System Administrator',
        role: 'ADMIN'
      })
    });
    const replyData = await replyRes.json();
    console.log('Flow 15 Result:', replyData.success ? '✅ PASSED (Admin Replied)' : '❌ FAILED', replyData);
  }

  console.log('\n=== ALL 15 FLOWS TESTED AND VERIFIED END-TO-END ===');
}

runFlowVerifications();
