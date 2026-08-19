const mysql = require('mysql2/promise');

async function setupTable() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaa_education_db'
  });

  await conn.query(`
    CREATE TABLE IF NOT EXISTS admission_applications (
      id VARCHAR(50) PRIMARY KEY,
      app_ref VARCHAR(50) NOT NULL UNIQUE,
      full_name VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      dob VARCHAR(20) NOT NULL,
      gender VARCHAR(20) DEFAULT 'Male',
      course VARCHAR(150) NOT NULL,
      department VARCHAR(150) NOT NULL,
      prev_qualification VARCHAR(150),
      prev_percentage VARCHAR(20),
      guardian_name VARCHAR(150),
      guardian_phone VARCHAR(20),
      doc_10th VARCHAR(255),
      doc_12th VARCHAR(255),
      doc_tc VARCHAR(255),
      status VARCHAR(50) DEFAULT 'Under Verification',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ admission_applications table ready in MySQL');
  await conn.end();
}

setupTable().catch(console.error);
