import mysql from 'mysql2/promise';

console.log("--- TESTING LIVE DATABASE PROFILE UPDATE PIPELINE ---");

async function testProfileUpdate() {
  const testPayload = {
    userId: "STU-2024-001",
    role: "STUDENT",
    name: "Aarav Patel",
    phone: "+91 99999 88888",
    bio: "Passionate Computer Science student specializing in AI.",
    bloodGroup: "B+",
    address: "Campus Hostel Block A, Room 304",
    guardianName: "Vikram Patel",
    guardianPhone: "+91 98888 77777",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
  };

  // 1. Send HTTP PUT request to Express API
  const response = await fetch('http://localhost:5000/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testPayload)
  });

  const resJson = await response.json();
  console.log("[Express API Response]:", resJson);

  // 2. Query MySQL directly to prove persistence
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaa_education_db'
  });

  const [rows] = await conn.query('SELECT name, phone, bio, bloodGroup, address, avatar FROM students WHERE studentId = ?', [testPayload.userId]);
  console.log("[Verified in MySQL Database]:", rows[0]);

  if (rows[0] && rows[0].phone === testPayload.phone && rows[0].bloodGroup === testPayload.bloodGroup) {
    console.log("✅ SUCCESS: Profile update verified directly in MySQL database!");
  } else {
    console.error("❌ FAILED: Data mismatch in MySQL!");
  }

  await conn.end();
}

testProfileUpdate().catch(console.error);
