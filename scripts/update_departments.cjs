const mysql = require('mysql2/promise');

const departmentsData = [
  {
    id: 'd1',
    code: 'CSE',
    name: 'Computer Science & Engineering',
    hod: 'Dr. Rajesh Sharma',
    description: 'Pioneering research in Artificial Intelligence, Neural Networks, Cyber Security, and Cloud Architecture.',
    email: 'hod.cse@kalpanaa.edu',
    phone: '+91 98765 43210',
    totalFaculty: 24,
    totalStudents: 480,
    status: 'Active'
  },
  {
    id: 'd2',
    code: 'ISE',
    name: 'Information Science & Engineering',
    hod: 'Prof. Sunita Reddy',
    description: 'Specialized in Cloud Infrastructure, DevOps Engineering, Big Data Analytics, and Web Systems.',
    email: 'hod.ise@kalpanaa.edu',
    phone: '+91 98765 43211',
    totalFaculty: 18,
    totalStudents: 360,
    status: 'Active'
  },
  {
    id: 'd3',
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    hod: 'Dr. Suresh Kumar',
    description: 'Advanced research in VLSI microchip design, 5G RF wireless communications, and Embedded IoT systems.',
    email: 'hod.ece@kalpanaa.edu',
    phone: '+91 98765 43212',
    totalFaculty: 20,
    totalStudents: 360,
    status: 'Active'
  },
  {
    id: 'd4',
    code: 'EEE',
    name: 'Electrical & Electronics Engineering',
    hod: 'Prof. Ramesh Rao',
    description: 'Smart grid technologies, renewable solar/wind energy integration, power electronics, and EV motor drives.',
    email: 'hod.eee@kalpanaa.edu',
    phone: '+91 98765 43213',
    totalFaculty: 16,
    totalStudents: 240,
    status: 'Active'
  },
  {
    id: 'd5',
    code: 'ME',
    name: 'Mechanical Engineering',
    hod: 'Dr. Vikramaditya Singh',
    description: 'Robotics and industrial automation, additive manufacturing, CAD/CAM prototyping, and thermal systems.',
    email: 'hod.me@kalpanaa.edu',
    phone: '+91 98765 43214',
    totalFaculty: 18,
    totalStudents: 240,
    status: 'Active'
  },
  {
    id: 'd6',
    code: 'CE',
    name: 'Civil & Environmental Engineering',
    hod: 'Dr. Meenakshi Sundaram',
    description: 'Sustainable smart city infrastructure, structural BIM analysis, seismic engineering, and environmental stewardship.',
    email: 'hod.ce@kalpanaa.edu',
    phone: '+91 98765 43215',
    totalFaculty: 16,
    totalStudents: 240,
    status: 'Active'
  },
  {
    id: 'dept-mba',
    code: 'MBA',
    name: 'Management Studies',
    hod: 'Dr. Brijesh Malhotra',
    description: 'Excellence in Strategic Management, Corporate Finance, Business Analytics, and Global Leadership.',
    email: 'hod.mba@kalpanaa.edu',
    phone: '+91 98765 43216',
    totalFaculty: 14,
    totalStudents: 180,
    status: 'Active'
  }
];

(async () => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaa_education_db'
  });

  for (const d of departmentsData) {
    await conn.query(
      'UPDATE departments SET hod = ?, name = ?, description = ?, totalFaculty = ?, totalStudents = ? WHERE code = ? OR id = ?',
      [d.hod, d.name, d.description, d.totalFaculty, d.totalStudents, d.code, d.id]
    );
  }

  const [rows] = await conn.query('SELECT id, code, name, hod, totalFaculty, totalStudents FROM departments');
  console.log('✅ Updated MySQL Departments Table:');
  console.table(rows);

  await conn.end();
})();
