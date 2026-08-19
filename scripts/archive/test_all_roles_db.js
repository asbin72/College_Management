import mysql from 'mysql2/promise';

async function testAllRoleUpdates() {
  // 1. Staff Update
  const staffRes = await fetch('http://localhost:5000/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: "EMP-101",
      role: "TEACHER",
      name: "Dr. Rajesh Sharma",
      phone: "+91 98765 11111",
      bio: "Senior Professor & Department Chair of Computer Science.",
      designation: "Professor & HOD",
      specialization: "Quantum Computing & Advanced Neural Networks"
    })
  });
  console.log("Staff Update:", await staffRes.json());

  // 2. Admin Update
  const adminRes = await fetch('http://localhost:5000/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: "ADM-001",
      role: "ADMIN",
      name: "Administrator",
      phone: "+91 98765 00000",
      designation: "Super Administrator & Dean of Institution",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
    })
  });
  console.log("Admin Update:", await adminRes.json());

  // Verify in MySQL
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'root', database: 'kalpanaa_education_db' });
  const [tch] = await conn.query('SELECT name, phone, designation, specialization FROM teachers WHERE employeeId = "EMP-101"');
  console.log("Verified Teacher in MySQL:", tch[0]);
  const [adm] = await conn.query('SELECT name, phone, designation, avatar FROM admins WHERE employeeId = "ADM-001"');
  console.log("Verified Admin in MySQL:", adm[0]);
  await conn.end();
}

testAllRoleUpdates().catch(console.error);
