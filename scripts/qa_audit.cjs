const fs = require('fs');
const mysql = require('mysql2/promise');

async function runFullQASuite() {
  console.log('====================================================');
  console.log('       MASTER QA BUG HUNT & AUDIT SUITE             ');
  console.log('====================================================\n');

  let conn;
  try {
    conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'kalpanaa_education_db'
    });
    console.log('✅ [DATABASE] Connected to MySQL: kalpanaa_education_db');
  } catch (e) {
    console.error('❌ [DATABASE] Failed to connect to MySQL:', e.message);
  }

  // 1. Check all MySQL tables & record counts
  if (conn) {
    const [tables] = await conn.query('SHOW TABLES');
    console.log(`✅ [DATABASE] Total Tables Found: ${tables.length}`);
    for (const t of tables) {
      const tableName = Object.values(t)[0];
      const [count] = await conn.query(`SELECT COUNT(*) as c FROM \`${tableName}\``);
      console.log(`   - ${tableName.padEnd(26)} : ${count[0].c} records`);
    }
  }

  // 2. Test Live REST Endpoints
  console.log('\n--- 1. Testing Live API GET Endpoints (http://localhost:5000) ---');
  const serverContent = fs.readFileSync('server/index.js', 'utf8');
  const routeRegex = /app\.(get|post|put|delete)\(['"]([^'"]+)['"]/g;
  let match;
  const routes = [];
  while ((match = routeRegex.exec(serverContent)) !== null) {
    routes.push({ method: match[1].toUpperCase(), path: match[2] });
  }

  const getEndpoints = routes.filter(r => r.method === 'GET' && !r.path.includes(':') && r.path !== '/api/events' && r.path !== '/');
  for (const ep of getEndpoints) {
    try {
      const res = await fetch(`http://localhost:5000${ep.path}`);
      const status = res.status;
      let count = 0;
      if (res.ok) {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          count = Array.isArray(json) ? json.length : (typeof json === 'object' ? Object.keys(json).length : 1);
        } catch (je) {
          count = text.length;
        }
      }
      console.log(` [GET] ${ep.path.padEnd(32)} -> Status ${status} (${count} records)`);
    } catch (err) {
      console.log(` ❌ [GET] ${ep.path.padEnd(32)} -> Error: ${err.message}`);
    }
  }

  // 3. Test Authentication Workflows
  console.log('\n--- 2. Testing Authentication Workflows ---');
  const testLogins = [
    { role: 'ADMIN', id: 'admin@kalpanaaa.edu', pass: 'admin123' },
    { role: 'ADMIN', id: 'admin@kalpanaa.edu', pass: 'admin' },
    { role: 'STUDENT', id: 'student@kalpanaaa.edu', pass: 'student123' },
    { role: 'TEACHER', id: 'teacher@kalpanaaa.edu', pass: 'teacher123' },
    { role: 'STUDENT', id: 'STU-CE-101', pass: 'student123' },
    { role: 'TEACHER', id: 'EMP-101', pass: 'teacher123' }
  ];

  let studentToken = null;
  let teacherToken = null;
  let adminToken = null;

  for (const l of testLogins) {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: l.id, password: l.pass })
      });
      const data = await res.json();
      if (data.success) {
        if (l.role === 'STUDENT' && !studentToken) studentToken = data.token;
        if (l.role === 'TEACHER' && !teacherToken) teacherToken = data.token;
        if (l.role === 'ADMIN' && !adminToken) adminToken = data.token;
        console.log(` [AUTH] ${l.role.padEnd(8)} (${l.id}) -> ✅ PASSED (User: ${data.user?.name})`);
      } else {
        console.log(` ❌ [AUTH] ${l.role.padEnd(8)} (${l.id}) -> FAILED (${data.message})`);
      }
    } catch (e) {
      console.log(` ❌ [AUTH] ${l.role} (${l.id}) -> Error: ${e.message}`);
    }
  }

  // 4. Test Assignment Workflow: Creation -> Submission -> Grading
  console.log('\n--- 3. Testing Assignment & Grading Workflow ---');
  let testAsnId = null;
  let testSubId = null;
  try {
    // Teacher creates assignment
    const createRes = await fetch('http://localhost:5000/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'QA Automated Distributed Systems Lab',
        subject: 'Distributed Computing',
        code: 'CSE-401',
        teacherId: 'EMP-101',
        teacherName: 'Dr. Rajesh Sharma',
        description: 'Implement Paxos consensus simulation in Python',
        dueDate: '2026-09-10',
        maxMarks: 50,
        status: 'Active'
      })
    });
    const createData = await createRes.json();
    testAsnId = createData.id;
    console.log(` [ASSIGNMENT] Teacher Creation -> ${createData.success ? `✅ PASSED (ID: ${testAsnId})` : '❌ FAILED'}`);

    // Student submits work
    const submitRes = await fetch(`http://localhost:5000/api/assignments/${testAsnId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'STU-CE-101',
        studentName: 'Asbin T S',
        fileName: 'Paxos_Consensus_Asbin.py',
        comments: 'Implemented with 5 node failover tests'
      })
    });
    const submitData = await submitRes.json();
    testSubId = submitData.subId;
    console.log(` [ASSIGNMENT] Student Submission -> ${submitData.success ? `✅ PASSED (SubID: ${testSubId})` : '❌ FAILED'}`);

    // Teacher grades submission
    const gradeRes = await fetch(`http://localhost:5000/api/assignments/${testAsnId}/submissions/${testSubId}/grade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        marks: 49,
        feedback: 'Outstanding consensus algorithm implementation.',
        gradedBy: 'Dr. Rajesh Sharma'
      })
    });
    const gradeData = await gradeRes.json();
    console.log(` [ASSIGNMENT] Teacher Evaluation -> ${gradeData.success ? '✅ PASSED' : '❌ FAILED'}`);
  } catch (e) {
    console.log(` ❌ [ASSIGNMENT WORKFLOW ERROR]: ${e.message}`);
  }

  // 5. Test Fee Payment & Balance Deduction
  console.log('\n--- 4. Testing Fee Payment & Balance Deduction Workflow ---');
  try {
    const feeRes = await fetch('http://localhost:5000/api/fees/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'STU-CE-101',
        amount: 25000,
        feeType: 'Semester Tuition Fee',
        paymentMethod: 'Net Banking (SBI)'
      })
    });
    const feeData = await feeRes.json();
    console.log(` [FEES] Payment Processing -> ${feeData.success ? `✅ PASSED (Txn: ${feeData.txnId})` : '❌ FAILED'}`);
  } catch (e) {
    console.log(` ❌ [FEES ERROR]: ${e.message}`);
  }

  // 6. Test Leave Request Workflow: Submission -> Approval
  console.log('\n--- 5. Testing Leave Request & Approval Workflow ---');
  let testLeaveId = null;
  try {
    const leaveRes = await fetch('http://localhost:5000/api/leave-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantId: 'STU-CE-101',
        applicantName: 'Asbin T S',
        applicantRole: 'STUDENT',
        department: 'Civil Engineering',
        leaveType: 'Academic Event',
        fromDate: '2026-09-15',
        toDate: '2026-09-17',
        days: 3,
        reason: 'Presenting research at National Structural Engineering Conclave'
      })
    });
    const leaveData = await leaveRes.json();
    testLeaveId = leaveData.id;
    console.log(` [LEAVE] Submission -> ${leaveData.success ? `✅ PASSED (ID: ${testLeaveId})` : '❌ FAILED'}`);

    // Update status to Approved
    const approveRes = await fetch(`http://localhost:5000/api/leave-requests/${testLeaveId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Approved' })
    });
    const approveData = await approveRes.json();
    console.log(` [LEAVE] Admin Approval -> ${approveData.success ? '✅ PASSED' : '❌ FAILED'}`);
  } catch (e) {
    console.log(` ❌ [LEAVE ERROR]: ${e.message}`);
  }

  // 7. Test Helpdesk Workflow: Creation -> Official Reply
  console.log('\n--- 6. Testing Helpdesk & Official Reply Workflow ---');
  try {
    const ticketRes = await fetch('http://localhost:5000/api/helpdesk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'WiFi Access & Smart Card Integration',
        category: 'Network & Systems',
        priority: 'High',
        description: 'Requesting WiFi access token renewal for engineering lab workstation.',
        studentId: 'STU-CE-101',
        studentName: 'Asbin T S',
        source: 'STUDENT',
        targetDesk: 'ADMIN'
      })
    });
    const ticketData = await ticketRes.json();
    console.log(` [HELPDESK] Ticket Raised -> ${ticketData.success ? `✅ PASSED (ID: ${ticketData.id})` : '❌ FAILED'}`);

    if (ticketData.id) {
      const replyRes = await fetch(`http://localhost:5000/api/helpdesk/${ticketData.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'Campus Network Administration',
          role: 'ADMIN',
          message: 'Access credentials refreshed. Please connect to Kalpanaa-Secure-WiFi using your institutional ID.'
        })
      });
      const replyData = await replyRes.json();
      console.log(` [HELPDESK] Admin Resolution Reply -> ${replyData.success ? '✅ PASSED' : '❌ FAILED'}`);
    }
  } catch (e) {
    console.log(` ❌ [HELPDESK ERROR]: ${e.message}`);
  }

  // 8. Test Notifications Mark Read & Clear
  console.log('\n--- 7. Testing Notifications Lifecycle ---');
  try {
    const notifRes = await fetch('http://localhost:5000/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'STU-CE-101',
        userRole: 'STUDENT',
        title: 'QA System Automated Notification',
        message: 'Verifying end-to-end notification delivery and acknowledgement.'
      })
    });
    const notifData = await notifRes.json();
    console.log(` [NOTIFICATIONS] Dispatch -> ${notifData.success ? `✅ PASSED (ID: ${notifData.id})` : '❌ FAILED'}`);

    if (notifData.id) {
      const readRes = await fetch(`http://localhost:5000/api/notifications/${notifData.id}/read`, { method: 'PUT' });
      const readData = await readRes.json();
      console.log(` [NOTIFICATIONS] Mark As Read -> ${readData.success ? '✅ PASSED' : '❌ FAILED'}`);
    }
  } catch (e) {
    console.log(` ❌ [NOTIFICATIONS ERROR]: ${e.message}`);
  }

  if (conn) await conn.end();
  console.log('\n====================================================');
  console.log('       ALL WORKFLOW VERIFICATIONS COMPLETE          ');
  console.log('====================================================');
}

runFullQASuite();
