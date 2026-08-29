import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const HOD_FACULTY_LIST = [
  {
    id: 'user-teacher-101',
    empId: 'EMP-101',
    name: 'Dr. Rajesh Sharma',
    email: 'hod.cse@kalpanaaa.edu',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    designation: 'Head of Department (HOD) & Senior Professor',
    qualification: 'Ph.D. in Computer Science (IIT Bombay)',
    specialization: 'Artificial Intelligence & Neural Networks',
    experience: '18 Years'
  },
  {
    id: 'user-teacher-102',
    empId: 'EMP-102',
    name: 'Prof. Sunita Reddy',
    email: 'hod.ise@kalpanaaa.edu',
    department: 'Information Science & Engineering',
    deptCode: 'ISE',
    designation: 'Head of Department (HOD) & Professor',
    qualification: 'M.Tech, Ph.D. in Information Technology',
    specialization: 'Cloud Infrastructure & DevOps Systems',
    experience: '15 Years'
  },
  {
    id: 'user-teacher-103',
    empId: 'EMP-103',
    name: 'Dr. Suresh Kumar',
    email: 'hod.ece@kalpanaaa.edu',
    department: 'Electronics & Communication Engineering',
    deptCode: 'ECE',
    designation: 'Head of Department (HOD) & Senior Professor',
    qualification: 'Ph.D. in Electronics (IISc Bangalore)',
    specialization: 'VLSI Microchip Design & 5G Wireless',
    experience: '20 Years'
  },
  {
    id: 'user-teacher-104',
    empId: 'EMP-104',
    name: 'Prof. Ramesh Rao',
    email: 'hod.eee@kalpanaaa.edu',
    department: 'Electrical & Electronics Engineering',
    deptCode: 'EEE',
    designation: 'Head of Department (HOD) & Professor',
    qualification: 'M.Tech, Ph.D. in Electrical Systems',
    specialization: 'Smart Grids & EV Power Electronics',
    experience: '16 Years'
  },
  {
    id: 'user-teacher-105',
    empId: 'EMP-105',
    name: 'Dr. Vikramaditya Singh',
    email: 'hod.me@kalpanaaa.edu',
    department: 'Mechanical Engineering',
    deptCode: 'ME',
    designation: 'Head of Department (HOD) & Senior Professor',
    qualification: 'Ph.D. in Mechanical Robotics (IIT Madras)',
    specialization: 'Industrial Robotics & CAD/CAM Automation',
    experience: '19 Years'
  },
  {
    id: 'user-teacher-106',
    empId: 'EMP-106',
    name: 'Dr. Meenakshi Sundaram',
    email: 'hod.ce@kalpanaaa.edu',
    department: 'Civil & Environmental Engineering',
    deptCode: 'CE',
    designation: 'Head of Department (HOD) & Senior Professor',
    qualification: 'Ph.D. in Structural & Environmental Eng.',
    specialization: 'Sustainable Smart Cities & BIM Structural Analysis',
    experience: '17 Years'
  },
  {
    id: 'user-teacher-107',
    empId: 'EMP-107',
    name: 'Dr. Brijesh Malhotra',
    email: 'hod.mba@kalpanaaa.edu',
    department: 'Management Studies',
    deptCode: 'MBA',
    designation: 'Head of Department (HOD) & Professor',
    qualification: 'Ph.D. in Strategic Management (IIM Ahmedabad)',
    specialization: 'Corporate Governance & Business Analytics',
    experience: '14 Years'
  }
];

async function seedAndAssignHODs() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'kalpanaa_education_db'
    });

    console.log('🔌 Connected to MySQL database kalpanaa_education_db');
    const defaultPasswordHash = await bcrypt.hash('teacher123', 10);

    for (const h of HOD_FACULTY_LIST) {
      // 1. Upsert Departments Table
      await conn.query(`
        INSERT INTO departments (id, name, code, hod, description, status)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name), hod = VALUES(hod)
      `, [`dept-${h.deptCode.toLowerCase()}`, h.department, h.deptCode, h.name, `Department of ${h.department}`, 'Active']);

      // 2. Upsert Teachers Table
      await conn.query(`
        INSERT INTO teachers (
          id, employeeId, name, email, password, designation, department,
          qualification, specialization, experience, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          name = VALUES(name),
          designation = VALUES(designation),
          department = VALUES(department),
          qualification = VALUES(qualification),
          specialization = VALUES(specialization),
          experience = VALUES(experience)
      `, [
        h.id, h.empId, h.name, h.email, defaultPasswordHash, h.designation, h.department,
        h.qualification, h.specialization, h.experience, 'Active'
      ]);

      console.log(`✅ HOD Seeded & Assigned: ${h.name} (${h.empId}) -> ${h.deptCode}`);
    }

    const [depts] = await conn.query('SELECT code, name, hod FROM departments ORDER BY code');
    console.log('\n🏛️ Departments in MySQL:');
    console.table(depts);

    const [tch] = await conn.query('SELECT employeeId, name, department, designation FROM teachers ORDER BY employeeId');
    console.log('\n👨‍🏫 Staff Members & HODs in MySQL:');
    console.table(tch);

    await conn.end();
  } catch (err) {
    console.error('❌ Error seeding/assigning HODs:', err);
  }
}

seedAndAssignHODs();
