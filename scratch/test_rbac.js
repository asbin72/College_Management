import jwt from 'jsonwebtoken';

const API_BASE = 'http://localhost:3000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'kalpanaaa_super_secret_jwt_key_2026_prod';

const studentToken = jwt.sign(
  { id: 'stu-test-rbac', name: 'RBAC Test Student', email: 'student_rbac@kalpanaaa.edu', role: 'STUDENT' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const teacherToken = jwt.sign(
  { id: 'tch-test-rbac', name: 'RBAC Test Teacher', email: 'teacher_rbac@kalpanaaa.edu', role: 'TEACHER' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

async function runRbacTests() {
  console.log('=== STARTING COMPREHENSIVE RBAC ENFORCEMENT AUDIT ===\n');

  const testCases = [
    // 1. Unauthenticated (No Token) -> Expect 401
    { name: 'GET /api/students (No Token)', url: '/students', method: 'GET', token: null, expected: 401 },
    { name: 'POST /api/students (No Token)', url: '/students', method: 'POST', token: null, expected: 401 },
    { name: 'GET /api/teachers (No Token)', url: '/teachers', method: 'GET', token: null, expected: 401 },
    { name: 'POST /api/teachers (No Token)', url: '/teachers', method: 'POST', token: null, expected: 401 },
    { name: 'POST /api/courses (No Token)', url: '/courses', method: 'POST', token: null, expected: 401 },
    { name: 'POST /api/departments (No Token)', url: '/departments', method: 'POST', token: null, expected: 401 },
    { name: 'POST /api/attendance (No Token)', url: '/attendance', method: 'POST', token: null, expected: 401 },
    { name: 'POST /api/marks (No Token)', url: '/marks', method: 'POST', token: null, expected: 401 },
    { name: 'POST /api/admin/clean-demo-data (No Token)', url: '/admin/clean-demo-data', method: 'POST', token: null, expected: 401 },

    // 2. Student Role Accessing Admin-Only Routes -> Expect 403
    { name: 'POST /api/students (Student JWT)', url: '/students', method: 'POST', token: studentToken, expected: 403 },
    { name: 'DELETE /api/students/sample (Student JWT)', url: '/students/sample', method: 'DELETE', token: studentToken, expected: 403 },
    { name: 'POST /api/teachers (Student JWT)', url: '/teachers', method: 'POST', token: studentToken, expected: 403 },
    { name: 'DELETE /api/teachers/sample (Student JWT)', url: '/teachers/sample', method: 'DELETE', token: studentToken, expected: 403 },
    { name: 'POST /api/courses (Student JWT)', url: '/courses', method: 'POST', token: studentToken, expected: 403 },
    { name: 'POST /api/departments (Student JWT)', url: '/departments', method: 'POST', token: studentToken, expected: 403 },
    { name: 'POST /api/faculty-assignments (Student JWT)', url: '/faculty-assignments', method: 'POST', token: studentToken, expected: 403 },
    { name: 'POST /api/admin/clean-demo-data (Student JWT)', url: '/admin/clean-demo-data', method: 'POST', token: studentToken, expected: 403 },

    // 3. Student Role Accessing Teacher/Admin Write Routes -> Expect 403
    { name: 'POST /api/attendance (Student JWT)', url: '/attendance', method: 'POST', token: studentToken, expected: 403, body: { records: [{ studentId: '1', date: '2026-08-28' }] } },
    { name: 'POST /api/marks (Student JWT)', url: '/marks', method: 'POST', token: studentToken, expected: 403, body: { examId: '1', studentId: '1' } },
    { name: 'POST /api/assignments (Student JWT)', url: '/assignments', method: 'POST', token: studentToken, expected: 403, body: { title: 'Illegal Assignment' } },

    // 4. Teacher Role Accessing Admin-Only Routes -> Expect 403
    { name: 'POST /api/admin/clean-demo-data (Teacher JWT)', url: '/admin/clean-demo-data', method: 'POST', token: teacherToken, expected: 403 },
    { name: 'POST /api/students (Teacher JWT)', url: '/students', method: 'POST', token: teacherToken, expected: 403 }
  ];

  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (tc.token) headers['Authorization'] = `Bearer ${tc.token}`;

      const res = await fetch(`${API_BASE}${tc.url}`, {
        method: tc.method,
        headers,
        body: tc.body ? JSON.stringify(tc.body) : undefined
      });

      if (res.status === tc.expected) {
        console.log(`✅ PASS: ${tc.name} returned HTTP ${res.status}`);
        passed++;
      } else {
        console.error(`❌ FAIL: ${tc.name} returned HTTP ${res.status} (expected ${tc.expected})`);
        failed++;
      }
    } catch (err) {
      console.error(`❌ ERROR testing ${tc.name}:`, err.message);
      failed++;
    }
  }

  console.log(`\n=== RBAC AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED ===`);
}

runRbacTests();
