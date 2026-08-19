import mysql from 'mysql2/promise';

async function updateDeptCourses() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaaa_education_db'
  });

  await conn.query(`
    INSERT INTO departments (id, name, code, hod, description, totalFaculty, totalStudents, status) 
    VALUES ('dept-mba', 'Management Studies', 'MBA', 'Dr. Brijesh Malhotra', 'Department of Management Studies and Business Administration', 3, 20, 'Active')
    ON DUPLICATE KEY UPDATE name = VALUES(name)
  `);

  await conn.query(`
    INSERT INTO courses (id, code, name, department, duration, fees, type, status) 
    VALUES ('crs-eee', 'EE-101', 'B.Tech Electrical & Electronics Engineering', 'Electrical & Electronics Engineering', '4 Years', 125000, 'Undergraduate', 'Active')
    ON DUPLICATE KEY UPDATE name = VALUES(name)
  `);

  const [d] = await conn.query('SELECT code, name FROM departments ORDER BY code');
  const [c] = await conn.query('SELECT code, name FROM courses ORDER BY code');

  console.log('✅ All Departments in Database:', d);
  console.log('✅ All Courses in Database:', c);

  await conn.end();
}

updateDeptCourses();
