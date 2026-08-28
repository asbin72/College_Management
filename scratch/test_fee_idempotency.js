import jwt from 'jsonwebtoken';

const API_BASE = 'http://localhost:3000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'kalpanaaa_super_secret_jwt_key_2026_prod';

const adminToken = jwt.sign(
  { id: 'adm-001', name: 'Super Admin', email: 'admin@kalpanaaa.edu', role: 'ADMIN' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

async function testFeeIdempotency() {
  console.log('=== TESTING FEE PAYMENT IDEMPOTENCY & CONCURRENCY PROTECTION ===\n');

  // 1. Fetch real student from DB
  const stdRes = await fetch(`${API_BASE}/students`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const students = await stdRes.json();
  
  let targetStudentId = 'STU-CSE-1001';
  if (Array.isArray(students) && students.length > 0) {
    targetStudentId = students[0].studentId || students[0].id;
  } else {
    // Create a student if none exists
    const createRes = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Idempotency Test Student',
        email: 'idem_student@kalpanaaa.edu',
        studentId: 'STU-IDEM-001',
        department: 'Computer Science and Engineering',
        pendingFees: 10000
      })
    });
    const createdData = await createRes.json();
    targetStudentId = createdData.studentId || 'STU-IDEM-001';
  }

  console.log(`Targeting real student for fee payment idempotency test: ${targetStudentId}`);

  const studentToken = jwt.sign(
    { id: targetStudentId, name: 'Idempotency Student', email: 'idem_student@kalpanaaa.edu', role: 'STUDENT' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const ik = `IDEM-TEST-${Date.now()}`;
  const paymentPayload = {
    studentId: targetStudentId,
    amount: 2500,
    feeType: 'Semester Tuition Fee',
    paymentMethod: 'UPI Payment',
    idempotencyKey: ik
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${studentToken}`
  };

  console.log('Firing 2 simultaneous duplicate fee payment requests...');

  const [res1, res2] = await Promise.all([
    fetch(`${API_BASE}/fees/pay`, { method: 'POST', headers, body: JSON.stringify(paymentPayload) }),
    fetch(`${API_BASE}/fees/pay`, { method: 'POST', headers, body: JSON.stringify(paymentPayload) })
  ]);

  const data1 = await res1.json();
  const data2 = await res2.json();

  console.log('Request 1 Result:', data1);
  console.log('Request 2 Result:', data2);

  const duplicateBlocked = (data1.idempotentDuplicate || data2.idempotentDuplicate);

  if (duplicateBlocked && (data1.txnId === data2.txnId)) {
    console.log('\n✅ PASS: Double-submission correctly blocked by Idempotency Engine! Single transaction created:', data1.txnId);
  } else if (data1.success && data2.success && data1.txnId === data2.txnId) {
    console.log('\n✅ PASS: Single transaction processed safely!');
  } else {
    console.error('\n❌ FAIL: Duplicate transaction created or idempotency failed!');
  }
}

testFeeIdempotency();
