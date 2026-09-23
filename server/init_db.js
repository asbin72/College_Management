import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function createTablesIfNotExist(connection) {
  const tableSchemas = [
    `CREATE TABLE IF NOT EXISTS admins (
      id VARCHAR(50) PRIMARY KEY,
      employeeId VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      designation VARCHAR(100) DEFAULT 'Super Administrator',
      phone VARCHAR(20),
      avatar VARCHAR(255),
      photoUrl VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS students (
      id VARCHAR(50) PRIMARY KEY,
      studentId VARCHAR(50) UNIQUE NOT NULL,
      rollNo VARCHAR(50) UNIQUE,
      registerNumber VARCHAR(100) UNIQUE,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      password VARCHAR(255) NOT NULL,
      department VARCHAR(100) NOT NULL,
      departmentCode VARCHAR(50),
      course VARCHAR(150),
      year VARCHAR(50) DEFAULT '1st Year',
      semester VARCHAR(50) DEFAULT 'Semester 1',
      section VARCHAR(10) DEFAULT 'Sec A',
      classId VARCHAR(100),
      academicYear VARCHAR(50) DEFAULT '2026-2027',
      overallAttendance VARCHAR(50) DEFAULT '90%',
      attendanceNum INT DEFAULT 90,
      gpa VARCHAR(20) DEFAULT '3.50',
      pendingFees DECIMAL(10,2) DEFAULT 0.00,
      phone VARCHAR(20),
      dob VARCHAR(20),
      gender VARCHAR(10),
      bloodGroup VARCHAR(10),
      address TEXT,
      bio TEXT,
      guardianName VARCHAR(150),
      guardianPhone VARCHAR(20),
      avatar LONGTEXT,
      photoUrl LONGTEXT,
      admissionYear INT DEFAULT 2026,
      status VARCHAR(20) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS teachers (
      id VARCHAR(50) PRIMARY KEY,
      employeeId VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      password VARCHAR(255) NOT NULL,
      department VARCHAR(100) NOT NULL,
      designation VARCHAR(100) DEFAULT 'Assistant Professor',
      phone VARCHAR(20),
      qualification VARCHAR(100),
      experienceYears INT DEFAULT 5,
      experience VARCHAR(50) DEFAULT '5 Years',
      joiningDate VARCHAR(20),
      specialization VARCHAR(150),
      assignedClasses TEXT,
      bio TEXT,
      avatar LONGTEXT,
      photoUrl LONGTEXT,
      status VARCHAR(20) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS departments (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      code VARCHAR(20) UNIQUE NOT NULL,
      hod VARCHAR(150),
      description TEXT,
      status VARCHAR(20) DEFAULT 'Active'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS courses (
      id VARCHAR(50) PRIMARY KEY,
      code VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(150) NOT NULL,
      department VARCHAR(100) NOT NULL,
      departmentCode VARCHAR(50),
      semester VARCHAR(50) DEFAULT 'Semester 1',
      year VARCHAR(50) DEFAULT '1st Year',
      credits INT DEFAULT 4,
      type VARCHAR(50) DEFAULT 'Core',
      courseType VARCHAR(50) DEFAULT 'Core Theory',
      assignedTeacherName VARCHAR(150),
      academicYear VARCHAR(50) DEFAULT '2026-2027',
      status VARCHAR(20) DEFAULT 'Active',
      syllabus TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS subjects (
      id VARCHAR(50) PRIMARY KEY,
      code VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(150) NOT NULL,
      department VARCHAR(100) NOT NULL,
      courseId VARCHAR(50),
      assignedTeacherId VARCHAR(50),
      assignedTeacherName VARCHAR(150),
      semester VARCHAR(50) DEFAULT 'Semester 1',
      credits INT DEFAULT 4
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS timetable_slots (
      id VARCHAR(100) PRIMARY KEY,
      subjectId VARCHAR(50) NOT NULL,
      subjectCode VARCHAR(20) NOT NULL,
      subjectName VARCHAR(150) NOT NULL,
      courseId VARCHAR(50),
      department VARCHAR(100) NOT NULL,
      semester VARCHAR(50) NOT NULL,
      section VARCHAR(10) DEFAULT 'A',
      teacherId VARCHAR(50),
      teacherName VARCHAR(150),
      dayOfWeek VARCHAR(10) NOT NULL,
      period VARCHAR(20) NOT NULL,
      startTime VARCHAR(10),
      endTime VARCHAR(10),
      room VARCHAR(50),
      classId VARCHAR(100),
      status VARCHAR(20) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_dept_sem_sec_day (department, semester, section, dayOfWeek),
      INDEX idx_teacher (teacherId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS attendance_logs (
      id VARCHAR(100) PRIMARY KEY,
      studentId VARCHAR(50) NOT NULL,
      studentName VARCHAR(150),
      subjectCode VARCHAR(20),
      subjectName VARCHAR(150),
      classId VARCHAR(100),
      date VARCHAR(20) NOT NULL,
      period VARCHAR(20) DEFAULT 'P1',
      status VARCHAR(20) DEFAULT 'Present',
      markedBy VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_student_date (studentId, date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS teacher_attendance_logs (
      id VARCHAR(100) PRIMARY KEY,
      teacherId VARCHAR(50) NOT NULL,
      teacherName VARCHAR(150) NOT NULL,
      department VARCHAR(100),
      designation VARCHAR(100),
      date VARCHAR(20) NOT NULL,
      checkInTime VARCHAR(20),
      checkOutTime VARCHAR(20),
      status VARCHAR(20) DEFAULT 'Present',
      biometricMode VARCHAR(50) DEFAULT 'Biometric Smart Card',
      remarks VARCHAR(255),
      INDEX idx_teacher_date (teacherId, date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS faculty_class_assignments (
      id VARCHAR(100) PRIMARY KEY,
      assignmentId VARCHAR(100),
      teacherId VARCHAR(50) NOT NULL,
      teacherName VARCHAR(150) NOT NULL,
      subjectCode VARCHAR(20) NOT NULL,
      subjectName VARCHAR(150) NOT NULL,
      department VARCHAR(100) NOT NULL,
      departmentCode VARCHAR(50),
      year VARCHAR(50) DEFAULT '1st Year',
      semester VARCHAR(50) DEFAULT 'Semester 1',
      section VARCHAR(10) DEFAULT 'A',
      classId VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS examinations (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      type VARCHAR(50) DEFAULT 'Internal Assessment',
      semester VARCHAR(50) DEFAULT 'Semester 1',
      department VARCHAR(100),
      course VARCHAR(150),
      subjectCode VARCHAR(20),
      subjectName VARCHAR(150),
      assignedTeacherId VARCHAR(50),
      examDate VARCHAR(20),
      date VARCHAR(20),
      time VARCHAR(50),
      room VARCHAR(100),
      maxMarks INT DEFAULT 100,
      weightage INT DEFAULT 20,
      eligibilityAttendance INT DEFAULT 75,
      status VARCHAR(50) DEFAULT 'Scheduled',
      isPublished INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS marks (
      id VARCHAR(100) PRIMARY KEY,
      examId VARCHAR(50) NOT NULL,
      studentId VARCHAR(50) NOT NULL,
      studentName VARCHAR(150) NOT NULL,
      subjectCode VARCHAR(20) NOT NULL,
      subjectName VARCHAR(150) NOT NULL,
      marksObtained INT NOT NULL,
      maxMarks INT NOT NULL DEFAULT 100,
      grade VARCHAR(10) NOT NULL,
      remarks VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS internal_marks (
      id VARCHAR(100) PRIMARY KEY,
      examId VARCHAR(50) NOT NULL,
      studentId VARCHAR(50) NOT NULL,
      studentName VARCHAR(150) NOT NULL,
      subjectCode VARCHAR(20) NOT NULL,
      subjectName VARCHAR(150) NOT NULL,
      marksObtained INT NOT NULL,
      maxMarks INT NOT NULL DEFAULT 100,
      grade VARCHAR(10) NOT NULL,
      status VARCHAR(50) DEFAULT 'Submitted',
      published INT DEFAULT 0,
      remarks VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS results (
      id VARCHAR(100) PRIMARY KEY,
      student_id VARCHAR(50) NOT NULL,
      student_name VARCHAR(150),
      semester INT NOT NULL,
      gpa DECIMAL(4,2),
      cgpa DECIMAL(4,2),
      status VARCHAR(20) DEFAULT 'Passed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS assignments (
      id VARCHAR(100) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      subject VARCHAR(150) NOT NULL,
      code VARCHAR(20),
      classId VARCHAR(100),
      teacherId VARCHAR(50) NOT NULL,
      teacherName VARCHAR(150) NOT NULL,
      description TEXT,
      instructions TEXT,
      assignedDate VARCHAR(20),
      dueDate VARCHAR(20),
      maxMarks INT DEFAULT 50,
      status VARCHAR(20) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS assignment_submissions (
      id VARCHAR(100) PRIMARY KEY,
      assignmentId VARCHAR(100) NOT NULL,
      studentId VARCHAR(50) NOT NULL,
      studentName VARCHAR(150) NOT NULL,
      submittedDate VARCHAR(20),
      fileName VARCHAR(255),
      comments TEXT,
      marks INT,
      feedback TEXT,
      gradedBy VARCHAR(50),
      status VARCHAR(20) DEFAULT 'Submitted',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(100) PRIMARY KEY,
      userId VARCHAR(50) NOT NULL,
      userRole VARCHAR(50) DEFAULT 'ALL',
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      date VARCHAR(20),
      isRead INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS leave_requests (
      id VARCHAR(100) PRIMARY KEY,
      applicantId VARCHAR(50) NOT NULL,
      applicantName VARCHAR(150) NOT NULL,
      applicantRole VARCHAR(50) NOT NULL,
      department VARCHAR(100),
      leaveType VARCHAR(50) NOT NULL,
      fromDate VARCHAR(20) NOT NULL,
      toDate VARCHAR(20) NOT NULL,
      days INT DEFAULT 1,
      reason TEXT,
      status VARCHAR(20) DEFAULT 'Pending',
      appliedOn VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS audit_logs (
      id VARCHAR(100) PRIMARY KEY,
      actorId VARCHAR(50) NOT NULL,
      actorRole VARCHAR(50) NOT NULL,
      action VARCHAR(100) NOT NULL,
      entityType VARCHAR(50),
      entityId VARCHAR(100),
      details TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS fee_payments (
      id VARCHAR(100) PRIMARY KEY,
      student_id VARCHAR(50) NOT NULL,
      fee_type VARCHAR(100) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      payment_method VARCHAR(50),
      transaction_id VARCHAR(100),
      idempotency_key VARCHAR(100) UNIQUE,
      status VARCHAR(20) DEFAULT 'Completed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_student_fee (student_id),
      UNIQUE KEY idx_idempotency_key (idempotency_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS admission_applications (
      id VARCHAR(100) PRIMARY KEY,
      app_ref VARCHAR(50) UNIQUE NOT NULL,
      full_name VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      dob VARCHAR(20),
      gender VARCHAR(10),
      course VARCHAR(150) NOT NULL,
      department VARCHAR(100) NOT NULL,
      prev_qualification VARCHAR(100),
      prev_percentage VARCHAR(20),
      guardian_name VARCHAR(150),
      guardian_phone VARCHAR(20),
      doc_10th VARCHAR(255),
      doc_12th VARCHAR(255),
      doc_tc VARCHAR(255),
      status VARCHAR(50) DEFAULT 'Under Verification',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS helpdesk_tickets (
      id VARCHAR(100) PRIMARY KEY,
      ticketNumber VARCHAR(50) UNIQUE NOT NULL,
      subject VARCHAR(255) NOT NULL,
      category VARCHAR(50),
      priority VARCHAR(20) DEFAULT 'Medium',
      status VARCHAR(20) DEFAULT 'Open',
      source VARCHAR(50),
      targetDesk VARCHAR(100),
      studentId VARCHAR(50),
      studentName VARCHAR(150),
      staffId VARCHAR(50),
      staffName VARCHAR(150),
      department VARCHAR(100),
      description TEXT,
      replies TEXT,
      date VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS announcements (
      id VARCHAR(100) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(50) DEFAULT 'General',
      target VARCHAR(50) DEFAULT 'ALL',
      author VARCHAR(150),
      date VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS staff_subject_assignments (
      id VARCHAR(100) PRIMARY KEY,
      teacherId VARCHAR(50) NOT NULL,
      teacherName VARCHAR(150) NOT NULL,
      subjectId VARCHAR(50) NOT NULL,
      subjectCode VARCHAR(20) NOT NULL,
      subjectName VARCHAR(150),
      courseId VARCHAR(50),
      courseName VARCHAR(150),
      department VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_staff_subject (teacherId, subjectId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
  ];

  for (const sql of tableSchemas) {
    await connection.query(sql);
  }

  const columnMigrations = [
    "ALTER TABLE students MODIFY COLUMN semester VARCHAR(50) DEFAULT 'Semester 1'",
    "ALTER TABLE courses MODIFY COLUMN semester VARCHAR(50) DEFAULT 'Semester 1'",
    "ALTER TABLE subjects MODIFY COLUMN semester VARCHAR(50) DEFAULT 'Semester 1'",
    "ALTER TABLE faculty_class_assignments MODIFY COLUMN semester VARCHAR(50) DEFAULT 'Semester 1'",
    "ALTER TABLE examinations MODIFY COLUMN semester VARCHAR(50) DEFAULT 'Semester 1'",
    "ALTER TABLE students ADD COLUMN registerNumber VARCHAR(100)",
    "ALTER TABLE students ADD COLUMN departmentCode VARCHAR(50)",
    "ALTER TABLE students ADD COLUMN year VARCHAR(50) DEFAULT '1st Year'",
    "ALTER TABLE students ADD COLUMN academicYear VARCHAR(50) DEFAULT '2026-2027'",
    "ALTER TABLE students ADD COLUMN overallAttendance VARCHAR(50) DEFAULT '90%'",
    "ALTER TABLE students ADD COLUMN attendanceNum INT DEFAULT 90",
    "ALTER TABLE students ADD COLUMN gpa VARCHAR(20) DEFAULT '3.50'",
    "ALTER TABLE students ADD COLUMN pendingFees DECIMAL(10,2) DEFAULT 0.00",
    "ALTER TABLE students ADD COLUMN bio TEXT",
    "ALTER TABLE students ADD COLUMN guardianName VARCHAR(150)",
    "ALTER TABLE students ADD COLUMN guardianPhone VARCHAR(20)",
    "ALTER TABLE students ADD COLUMN avatar LONGTEXT",
    "ALTER TABLE students ADD COLUMN photoUrl LONGTEXT",
    "ALTER TABLE teachers ADD COLUMN experience VARCHAR(50) DEFAULT '5 Years'",
    "ALTER TABLE teachers ADD COLUMN bio TEXT",
    "ALTER TABLE teachers ADD COLUMN avatar LONGTEXT",
    "ALTER TABLE teachers ADD COLUMN photoUrl LONGTEXT",
    "ALTER TABLE courses ADD COLUMN departmentCode VARCHAR(50)",
    "ALTER TABLE courses ADD COLUMN year VARCHAR(50) DEFAULT '1st Year'",
    "ALTER TABLE courses ADD COLUMN courseType VARCHAR(50) DEFAULT 'Core Theory'",
    "ALTER TABLE courses ADD COLUMN assignedTeacherName VARCHAR(150)",
    "ALTER TABLE courses ADD COLUMN academicYear VARCHAR(50) DEFAULT '2026-2027'",
    "ALTER TABLE courses ADD COLUMN status VARCHAR(20) DEFAULT 'Active'",
    "ALTER TABLE faculty_class_assignments ADD COLUMN departmentCode VARCHAR(50)",
    "ALTER TABLE faculty_class_assignments ADD COLUMN year VARCHAR(50) DEFAULT '1st Year'",
    "ALTER TABLE faculty_class_assignments ADD COLUMN assignmentId VARCHAR(100)",
    "ALTER TABLE examinations ADD COLUMN course VARCHAR(150)",
    "ALTER TABLE examinations ADD COLUMN assignedTeacherId VARCHAR(50)",
    "ALTER TABLE examinations ADD COLUMN date VARCHAR(20)",
    "ALTER TABLE examinations ADD COLUMN time VARCHAR(50)",
    "ALTER TABLE examinations ADD COLUMN room VARCHAR(100)",
    "ALTER TABLE examinations ADD COLUMN eligibilityAttendance INT DEFAULT 75",
    "ALTER TABLE examinations ADD COLUMN isPublished INT DEFAULT 0",
    "ALTER TABLE subjects ADD COLUMN courseId VARCHAR(50)",
    "ALTER TABLE subjects ADD COLUMN assignedTeacherId VARCHAR(50)",
    "ALTER TABLE subjects ADD COLUMN assignedTeacherName VARCHAR(150)",
    "ALTER TABLE leave_requests ADD COLUMN rejectionReason TEXT",
    "ALTER TABLE students ADD UNIQUE INDEX uq_students_rollNo (rollNo)",
    "ALTER TABLE students ADD UNIQUE INDEX uq_students_registerNumber (registerNumber)"
  ];

  for (const mig of columnMigrations) {
    try {
      await connection.query(mig);
    } catch (e) {
      // Column already exists, ignore error
    }
  }
}

export async function initializeDatabase(customDatabaseName = null) {
  try {
    let connectionUrl = process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.MYSQL_PRIVATE_URL;
    if (connectionUrl) {
      if (connectionUrl.includes('${{')) {
        connectionUrl = null;
      } else {
        try {
          new URL(connectionUrl);
        } catch (e) {
          connectionUrl = null;
        }
      }
    }
    let connConfig;
    if (connectionUrl) {
      connConfig = { uri: connectionUrl, ssl: { rejectUnauthorized: false } };
    } else {
      const host = process.env.MYSQLPUBLICHOST || process.env.MYSQLHOST || process.env.DB_HOST;
      const user = process.env.MYSQLUSER || process.env.DB_USER;
      const password = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD;
      const database = customDatabaseName || process.env.MYSQLDATABASE || process.env.DB_NAME;

      if (!host || !user || !database) {
        console.error('❌ FATAL ERROR: Database configuration missing in init_db.js.');
        return;
      }

      connConfig = {
        host,
        user,
        password: password || '',
        database,
        port: parseInt(process.env.MYSQLPUBLICPORT || process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
        ssl: (process.env.MYSQLHOST || process.env.MYSQLPUBLICHOST) ? { rejectUnauthorized: false } : undefined
      };
    }

    const connection = await mysql.createConnection(connConfig);

    console.log('🔌 Connected to MySQL server:', customDatabaseName || process.env.MYSQLDATABASE || process.env.DB_NAME || 'kalpanaa_education_db');
    await createTablesIfNotExist(connection);

    // Seed/Ensure Default Admin, Teacher, Student demo accounts
    const adminPassHash = await bcrypt.hash('admin123', 10);
    await connection.query(`
      INSERT INTO admins (id, employeeId, name, email, password, designation)
      VALUES ('user-admin', 'ADM-001', 'Administrator', 'admin@kalpanaaa.edu', ?, 'Super Administrator & Dean')
      ON DUPLICATE KEY UPDATE email = 'admin@kalpanaaa.edu', password = ?
    `, [adminPassHash, adminPassHash]);

    const teacherPassHash = await bcrypt.hash('teacher123', 10);
    // Seed primary senior professor (EMP-100 / Dr. Sanjay Kulkarni)
    await connection.query(`
      INSERT INTO teachers (
        id, employeeId, name, email, password, department, designation,
        phone, qualification, experienceYears, experience, specialization,
        bio, avatar, photoUrl, status
      ) VALUES (
        'user-teacher-demo', 'EMP-100', 'Dr. Sanjay Kulkarni', 'teacher@kalpanaaa.edu', ?,
        'Computer Science & Engineering', 'Senior Professor & Research Dean',
        '+91 98765 43200', 'Ph.D. in Computer Science (IIT Bombay)', 18, '18 Years',
        'Artificial Intelligence & Neural Networks',
        'Dr. Sanjay Kulkarni is a distinguished Senior Professor and Dean of Research with over 18 years of experience in neural networks, machine intelligence, and advanced computing paradigms.',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
        'Active'
      )
      ON DUPLICATE KEY UPDATE 
        name = 'Dr. Sanjay Kulkarni',
        email = 'teacher@kalpanaaa.edu',
        password = ?,
        designation = 'Senior Professor & Research Dean',
        qualification = 'Ph.D. in Computer Science (IIT Bombay)',
        specialization = 'Artificial Intelligence & Neural Networks',
        experience = '18 Years',
        experienceYears = 18,
        avatar = VALUES(avatar),
        photoUrl = VALUES(photoUrl),
        status = 'Active'
    `, [teacherPassHash, teacherPassHash]);

    // 1. Seed Institutional Departments
    const [dptCount] = await connection.query('SELECT COUNT(*) as count FROM departments');
    if (dptCount[0].count === 0) {
      console.log('🏛️ Seeding institutional departments into MySQL...');
      const depts = [
        { id: 'dept-1', name: 'Computer Science & Engineering', code: 'CSE', hod: 'Dr. Rajesh Sharma', description: 'Department of Computer Science & Engineering', status: 'Active' },
        { id: 'dept-2', name: 'Information Science & Engineering', code: 'ISE', hod: 'Prof. Sunita Reddy', description: 'Department of Information Science & Engineering', status: 'Active' },
        { id: 'dept-3', name: 'Electronics & Communication Engineering', code: 'ECE', hod: 'Dr. Suresh Kumar', description: 'Department of Electronics & Communication Engineering', status: 'Active' },
        { id: 'dept-4', name: 'Electrical & Electronics Engineering', code: 'EEE', hod: 'Prof. Ramesh Rao', description: 'Department of Electrical & Electronics Engineering', status: 'Active' },
        { id: 'dept-5', name: 'Mechanical Engineering', code: 'ME', hod: 'Dr. Vikramaditya Singh', description: 'Department of Mechanical Engineering', status: 'Active' },
        { id: 'dept-6', name: 'Civil & Environmental Engineering', code: 'CE', hod: 'Dr. Meenakshi Sundaram', description: 'Department of Civil & Environmental Engineering', status: 'Active' },
        { id: 'dept-7', name: 'Management Studies', code: 'MBA', hod: 'Dr. Brijesh Malhotra', description: 'Department of Management Studies', status: 'Active' }
      ];
      for (const d of depts) {
        await connection.query(`
          INSERT INTO departments (id, name, code, hod, description, status)
          VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE name = VALUES(name), hod = VALUES(hod), description = VALUES(description), status = VALUES(status)
        `, [d.id, d.name, d.code, d.hod, d.description, d.status]);
      }
    }

    // 2. Seed Institutional Faculty across all 7 departments
    const [tchCount] = await connection.query("SELECT COUNT(*) as count FROM teachers WHERE employeeId != 'EMP-100'");
    if (tchCount[0].count === 0) {
      console.log('🌱 Seeding institutional faculty across all 7 departments...');
      const facultyList = [
        { id: 'fac-cse-01', employeeId: 'EMP-CSE-101', name: 'Dr. Rajesh Sharma', email: 'rajesh.sharma@kalpanaaa.edu', department: 'Computer Science & Engineering', designation: 'Head of Department & Professor', qualification: 'Ph.D. in Computer Science (IIT Bombay)', experienceYears: 18, experience: '18 Years', specialization: 'Artificial Intelligence & Neural Networks', phone: '+91 98765 43210', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', bio: 'Dr. Sharma leads AI research initiatives and has authored over 45 international IEEE publications in deep learning and autonomous robotics.' },
        { id: 'fac-cse-02', employeeId: 'EMP-CSE-102', name: 'Dr. Priya Nair', email: 'priya.nair@kalpanaaa.edu', department: 'Computer Science & Engineering', designation: 'Associate Professor', qualification: 'Ph.D. in Distributed Computing (IISc Bangalore)', experienceYears: 12, experience: '12 Years', specialization: 'Distributed Systems & Cloud Architecture', phone: '+91 98765 43211', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300', bio: 'Specialist in cloud-native microservices, containerization frameworks, and high-throughput distributed transaction engines.' },
        { id: 'fac-cse-03', employeeId: 'EMP-CSE-103', name: 'Prof. Amitav Sen', email: 'amitav.sen@kalpanaaa.edu', department: 'Computer Science & Engineering', designation: 'Assistant Professor', qualification: 'M.Tech in Cyber Security (IIT Delhi)', experienceYears: 7, experience: '7 Years', specialization: 'Full-Stack Architecture & Cryptographic Systems', phone: '+91 98765 43212', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', bio: 'Passionate educator and researcher focusing on zero-trust architectures, modern web frameworks, and application security.' },
        { id: 'fac-ise-01', employeeId: 'EMP-ISE-101', name: 'Prof. Sunita Reddy', email: 'sunita.reddy@kalpanaaa.edu', department: 'Information Science & Engineering', designation: 'Head of Department & Professor', qualification: 'Ph.D. in Information Systems (IIT Madras)', experienceYears: 15, experience: '15 Years', specialization: 'Cloud Infrastructure & DevOps Systems', phone: '+91 98765 43220', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300', bio: 'Leader in scalable IT infrastructure, automated CI/CD pipelines, and multi-cloud resilience architecture.' },
        { id: 'fac-ise-02', employeeId: 'EMP-ISE-102', name: 'Dr. Rohan Varma', email: 'rohan.varma@kalpanaaa.edu', department: 'Information Science & Engineering', designation: 'Associate Professor', qualification: 'Ph.D. in Data Science (BITS Pilani)', experienceYears: 11, experience: '11 Years', specialization: 'Big Data Analytics & Distributed DBMS', phone: '+91 98765 43221', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', bio: 'Expertise in Apache Spark, real-time data streaming architectures, and predictive machine learning models.' },
        { id: 'fac-ise-03', employeeId: 'EMP-ISE-103', name: 'Prof. Ananya Roy', email: 'ananya.roy@kalpanaaa.edu', department: 'Information Science & Engineering', designation: 'Assistant Professor', qualification: 'M.Tech in Information Security (NITK Surathkal)', experienceYears: 6, experience: '6 Years', specialization: 'Information Security & Blockchain Technology', phone: '+91 98765 43222', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', bio: 'Conducts research in decentralized consensus protocols, smart contract audits, and applied modern cryptography.' },
        { id: 'fac-ece-01', employeeId: 'EMP-ECE-101', name: 'Dr. Suresh Kumar', email: 'suresh.kumar@kalpanaaa.edu', department: 'Electronics & Communication Engineering', designation: 'Head of Department & Senior Professor', qualification: 'Ph.D. in Microelectronics (IISc Bangalore)', experienceYears: 20, experience: '20 Years', specialization: 'VLSI Microchip Design & 5G Wireless', phone: '+91 98765 43230', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300', bio: 'Industry veteran with 20+ patents in nanoscale semiconductor layout, RF circuit design, and 5G transceiver modules.' },
        { id: 'fac-ece-02', employeeId: 'EMP-ECE-102', name: 'Dr. Kavita Iyer', email: 'kavita.iyer@kalpanaaa.edu', department: 'Electronics & Communication Engineering', designation: 'Associate Professor', qualification: 'Ph.D. in Embedded Systems (IIT Kharagpur)', experienceYears: 13, experience: '13 Years', specialization: 'Embedded Systems & IoT Architectures', phone: '+91 98765 43231', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300', bio: 'Pioneers ultra-low-power microcontrollers, sensor mesh networks, and intelligent biomedical wearable telemetry.' },
        { id: 'fac-ece-03', employeeId: 'EMP-ECE-103', name: 'Prof. Deepak Chawla', email: 'deepak.chawla@kalpanaaa.edu', department: 'Electronics & Communication Engineering', designation: 'Assistant Professor', qualification: 'M.Tech in Signal Processing (IIT Roorkee)', experienceYears: 8, experience: '8 Years', specialization: 'Digital Signal Processing & FPGA Design', phone: '+91 98765 43232', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300', bio: 'Specializes in real-time acoustic signal processing, radar imaging algorithms, and hardware accelerator synthesis.' },
        { id: 'fac-eee-01', employeeId: 'EMP-EEE-101', name: 'Prof. Ramesh Rao', email: 'ramesh.rao@kalpanaaa.edu', department: 'Electrical & Electronics Engineering', designation: 'Head of Department & Professor', qualification: 'Ph.D. in Electrical Systems (IIT Kanpur)', experienceYears: 16, experience: '16 Years', specialization: 'Smart Grids & EV Power Electronics', phone: '+91 98765 43240', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300', bio: 'Advisor to state power distribution utilities on grid modernization, EV fast-charging topologies, and energy storage.' },
        { id: 'fac-eee-02', employeeId: 'EMP-EEE-102', name: 'Dr. Neha Deshmukh', email: 'neha.deshmukh@kalpanaaa.edu', department: 'Electrical & Electronics Engineering', designation: 'Associate Professor', qualification: 'Ph.D. in Renewable Power (VNIT Nagpur)', experienceYears: 10, experience: '10 Years', specialization: 'Renewable Energy Integration & High-Voltage Systems', phone: '+91 98765 43241', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300', bio: 'Focuses on solar inverter optimization, wind turbine generator controls, and hybrid microgrid stability.' },
        { id: 'fac-me-01', employeeId: 'EMP-ME-101', name: 'Dr. Vikramaditya Singh', email: 'vikram.singh@kalpanaaa.edu', department: 'Mechanical Engineering', designation: 'Head of Department & Senior Professor', qualification: 'Ph.D. in Robotics & Mechatronics (IIT Madras)', experienceYears: 19, experience: '19 Years', specialization: 'Industrial Robotics & CAD/CAM Automation', phone: '+91 98765 43250', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300', bio: 'Principal investigator on autonomous manufacturing cells, kinematics simulation, and precision CNC manufacturing.' },
        { id: 'fac-me-02', employeeId: 'EMP-ME-102', name: 'Dr. Siddharth Mukherjee', email: 'siddharth.m@kalpanaaa.edu', department: 'Mechanical Engineering', designation: 'Associate Professor', qualification: 'Ph.D. in Thermal Engineering (IIT Guwahati)', experienceYears: 12, experience: '12 Years', specialization: 'Computational Fluid Dynamics & Thermodynamics', phone: '+91 98765 43251', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300', bio: 'Author of advanced CFD textbooks and consultant for aerospace aerodynamic cooling and heat exchanger performance.' },
        { id: 'fac-ce-01', employeeId: 'EMP-CE-101', name: 'Dr. Meenakshi Sundaram', email: 'meenakshi.s@kalpanaaa.edu', department: 'Civil & Environmental Engineering', designation: 'Head of Department & Senior Professor', qualification: 'Ph.D. in Structural Engineering (Anna University)', experienceYears: 17, experience: '17 Years', specialization: 'Sustainable Smart Cities & BIM Structural Analysis', phone: '+91 98765 43260', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300', bio: 'Consultant for mega-infrastructure metro projects, earthquake-resistant high-rise structures, and green concrete tech.' },
        { id: 'fac-ce-02', employeeId: 'EMP-CE-102', name: 'Dr. Arvind Swaminathan', email: 'arvind.swami@kalpanaaa.edu', department: 'Civil & Environmental Engineering', designation: 'Associate Professor', qualification: 'Ph.D. in Geotechnical Engg (IIT Roorkee)', experienceYears: 14, experience: '14 Years', specialization: 'Geotechnical Engineering & Soil Mechanics', phone: '+91 98765 43261', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=300', bio: 'Expert in deep foundation analysis, slope stability engineering, and tunneling geomechanics.' },
        { id: 'fac-mba-01', employeeId: 'EMP-MBA-101', name: 'Dr. Brijesh Malhotra', email: 'brijesh.malhotra@kalpanaaa.edu', department: 'Management Studies', designation: 'Head of Department & Professor', qualification: 'Ph.D. in Strategic Management (IIM Ahmedabad)', experienceYears: 14, experience: '14 Years', specialization: 'Corporate Governance & Business Analytics', phone: '+91 98765 43270', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300', bio: 'Former McKinsey consultant and advisor to Fortune 500 boards on organizational strategy, mergers, and financial modeling.' },
        { id: 'fac-mba-02', employeeId: 'EMP-MBA-102', name: 'Dr. Radhika Singhal', email: 'radhika.singhal@kalpanaaa.edu', department: 'Management Studies', designation: 'Associate Professor', qualification: 'Ph.D. in Marketing Strategy (FMS Delhi)', experienceYears: 11, experience: '11 Years', specialization: 'Strategic Marketing & FinTech Innovation', phone: '+91 98765 43271', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300', bio: 'Specialist in digital consumer psychology, omni-channel customer lifecycle marketing, and venture capital strategy.' }
      ];

      for (const f of facultyList) {
        await connection.query(`
          INSERT INTO teachers (
            id, employeeId, name, email, password, department, designation,
            phone, qualification, experienceYears, experience, specialization,
            bio, avatar, photoUrl, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            department = VALUES(department),
            designation = VALUES(designation),
            phone = VALUES(phone),
            qualification = VALUES(qualification),
            experienceYears = VALUES(experienceYears),
            experience = VALUES(experience),
            specialization = VALUES(specialization),
            bio = VALUES(bio),
            avatar = VALUES(avatar),
            photoUrl = VALUES(photoUrl),
            status = 'Active'
        `, [
          f.id, f.employeeId, f.name, f.email, teacherPassHash, f.department, f.designation,
          f.phone, f.qualification, f.experienceYears, f.experience, f.specialization,
          f.bio, f.avatar, f.avatar
        ]);
      }
    }

    // 3. Seed Institutional Courses & Subjects
    const [crsCount] = await connection.query('SELECT COUNT(*) as count FROM courses');
    if (crsCount[0].count === 0) {
      console.log('📚 Seeding institutional courses & subjects curriculum...');
      const institutionalCourses = [
        // CSE
        { id: 'crs-cse-601', code: 'CS-601', name: 'Artificial Intelligence & Neural Networks', department: 'Computer Science & Engineering', departmentCode: 'CSE', semester: 'Semester 6', year: '3rd Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'user-teacher-demo', assignedTeacherName: 'Dr. Sanjay Kulkarni' },
        { id: 'crs-cse-401', code: 'CS-401', name: 'Distributed Systems & Cloud Computing', department: 'Computer Science & Engineering', departmentCode: 'CSE', semester: 'Semester 4', year: '2nd Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-cse-02', assignedTeacherName: 'Dr. Priya Nair' },
        { id: 'crs-cse-201', code: 'CS-201', name: 'Data Structures & Algorithms', department: 'Computer Science & Engineering', departmentCode: 'CSE', semester: 'Semester 2', year: '1st Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-cse-03', assignedTeacherName: 'Prof. Amitav Sen' },
        // ISE
        { id: 'crs-ise-601', code: 'IS-601', name: 'Cloud Infrastructure & DevOps Systems', department: 'Information Science & Engineering', departmentCode: 'ISE', semester: 'Semester 6', year: '3rd Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-ise-01', assignedTeacherName: 'Prof. Sunita Reddy' },
        { id: 'crs-ise-401', code: 'IS-401', name: 'Big Data Analytics & Data Streams', department: 'Information Science & Engineering', departmentCode: 'ISE', semester: 'Semester 4', year: '2nd Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-ise-02', assignedTeacherName: 'Dr. Rohan Varma' },
        { id: 'crs-ise-201', code: 'IS-201', name: 'Object-Oriented Programming & Java', department: 'Information Science & Engineering', departmentCode: 'ISE', semester: 'Semester 2', year: '1st Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-ise-03', assignedTeacherName: 'Prof. Ananya Roy' },
        // ECE
        { id: 'crs-ece-601', code: 'EC-601', name: 'VLSI Microchip Design & CMOS', department: 'Electronics & Communication Engineering', departmentCode: 'ECE', semester: 'Semester 6', year: '3rd Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-ece-01', assignedTeacherName: 'Dr. Suresh Kumar' },
        { id: 'crs-ece-401', code: 'EC-401', name: 'Embedded Systems & IoT Architectures', department: 'Electronics & Communication Engineering', departmentCode: 'ECE', semester: 'Semester 4', year: '2nd Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-ece-02', assignedTeacherName: 'Dr. Kavita Iyer' },
        { id: 'crs-ece-201', code: 'EC-201', name: 'Digital Signal Processing & Logic', department: 'Electronics & Communication Engineering', departmentCode: 'ECE', semester: 'Semester 2', year: '1st Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-ece-03', assignedTeacherName: 'Prof. Deepak Chawla' },
        // EEE
        { id: 'crs-eee-601', code: 'EE-601', name: 'Smart Grids & EV Power Electronics', department: 'Electrical & Electronics Engineering', departmentCode: 'EEE', semester: 'Semester 6', year: '3rd Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-eee-01', assignedTeacherName: 'Prof. Ramesh Rao' },
        { id: 'crs-eee-401', code: 'EE-401', name: 'Renewable Energy Integration & Power', department: 'Electrical & Electronics Engineering', departmentCode: 'EEE', semester: 'Semester 4', year: '2nd Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-eee-02', assignedTeacherName: 'Dr. Neha Deshmukh' },
        // ME
        { id: 'crs-me-601', code: 'ME-601', name: 'Industrial Robotics & CAD/CAM Automation', department: 'Mechanical Engineering', departmentCode: 'ME', semester: 'Semester 6', year: '3rd Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-me-01', assignedTeacherName: 'Dr. Vikramaditya Singh' },
        { id: 'crs-me-401', code: 'ME-401', name: 'Computational Fluid Dynamics & Thermodynamics', department: 'Mechanical Engineering', departmentCode: 'ME', semester: 'Semester 4', year: '2nd Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-me-02', assignedTeacherName: 'Dr. Siddharth Mukherjee' },
        // CE
        { id: 'crs-ce-601', code: 'CE-601', name: 'Sustainable Smart Cities & BIM Analysis', department: 'Civil & Environmental Engineering', departmentCode: 'CE', semester: 'Semester 6', year: '3rd Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-ce-01', assignedTeacherName: 'Dr. Meenakshi Sundaram' },
        { id: 'crs-ce-401', code: 'CE-401', name: 'Geotechnical Engineering & Deep Foundations', department: 'Civil & Environmental Engineering', departmentCode: 'CE', semester: 'Semester 4', year: '2nd Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-ce-02', assignedTeacherName: 'Dr. Arvind Swaminathan' },
        // MBA
        { id: 'crs-mba-201', code: 'MBA-201', name: 'Corporate Governance & Business Analytics', department: 'Management Studies', departmentCode: 'MBA', semester: 'Semester 2', year: '1st Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-mba-01', assignedTeacherName: 'Dr. Brijesh Malhotra' },
        { id: 'crs-mba-401', code: 'MBA-401', name: 'Strategic Marketing & FinTech Innovation', department: 'Management Studies', departmentCode: 'MBA', semester: 'Semester 4', year: '2nd Year', credits: 4, type: 'Core Theory', assignedTeacherId: 'fac-mba-02', assignedTeacherName: 'Dr. Radhika Singhal' }
      ];

      for (const c of institutionalCourses) {
        await connection.query(`
          INSERT INTO courses (id, code, name, department, departmentCode, semester, year, credits, type, courseType, assignedTeacherName, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')
          ON DUPLICATE KEY UPDATE name = VALUES(name), assignedTeacherName = VALUES(assignedTeacherName), credits = VALUES(credits)
        `, [c.id, c.code, c.name, c.department, c.departmentCode, c.semester, c.year, c.credits, c.type, c.type, c.assignedTeacherName]);

        await connection.query(`
          INSERT INTO subjects (id, code, name, department, courseId, assignedTeacherId, assignedTeacherName, semester, credits)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE name = VALUES(name), assignedTeacherId = VALUES(assignedTeacherId), assignedTeacherName = VALUES(assignedTeacherName)
        `, [c.id, c.code, c.name, c.department, c.id, c.assignedTeacherId, c.assignedTeacherName, c.semester, c.credits]);
      }
    }

    // 4. Seed Faculty Class Assignments (Always upsert to guarantee all faculty have assigned courses and cohorts)
    console.log('📋 Seeding faculty class assignments...');
    const assignments = [
        // Primary Senior Professor (EMP-100)
        { id: 'fca-0', assignmentId: 'ASN-CSE-600', teacherId: 'EMP-100', teacherName: 'Dr. Sanjay Kulkarni', subjectCode: 'CS-601', subjectName: 'Artificial Intelligence & Neural Networks', department: 'Computer Science & Engineering', departmentCode: 'CSE', year: '3rd Year', semester: 'Semester 6', section: 'A', classId: 'CSE-SEM6-A' },
        // CSE
        { id: 'fca-1', assignmentId: 'ASN-CSE-601', teacherId: 'EMP-CSE-101', teacherName: 'Dr. Rajesh Sharma', subjectCode: 'CS-601', subjectName: 'Artificial Intelligence & Neural Networks', department: 'Computer Science & Engineering', departmentCode: 'CSE', year: '3rd Year', semester: 'Semester 6', section: 'A', classId: 'CSE-SEM6-A' },
        { id: 'fca-2', assignmentId: 'ASN-CSE-401', teacherId: 'EMP-CSE-102', teacherName: 'Dr. Priya Nair', subjectCode: 'CS-401', subjectName: 'Distributed Systems & Cloud Computing', department: 'Computer Science & Engineering', departmentCode: 'CSE', year: '2nd Year', semester: 'Semester 4', section: 'A', classId: 'CSE-SEM4-A' },
        { id: 'fca-3', assignmentId: 'ASN-CSE-201', teacherId: 'EMP-CSE-103', teacherName: 'Prof. Amitav Sen', subjectCode: 'CS-201', subjectName: 'Data Structures & Algorithms', department: 'Computer Science & Engineering', departmentCode: 'CSE', year: '1st Year', semester: 'Semester 2', section: 'A', classId: 'CSE-SEM2-A' },
        // ISE
        { id: 'fca-4', assignmentId: 'ASN-ISE-601', teacherId: 'EMP-ISE-101', teacherName: 'Prof. Sunita Reddy', subjectCode: 'IS-601', subjectName: 'Cloud Infrastructure & DevOps Systems', department: 'Information Science & Engineering', departmentCode: 'ISE', year: '3rd Year', semester: 'Semester 6', section: 'A', classId: 'ISE-SEM6-A' },
        { id: 'fca-5', assignmentId: 'ASN-ISE-401', teacherId: 'EMP-ISE-102', teacherName: 'Dr. Rohan Varma', subjectCode: 'IS-401', subjectName: 'Big Data Analytics & Data Streams', department: 'Information Science & Engineering', departmentCode: 'ISE', year: '2nd Year', semester: 'Semester 4', section: 'A', classId: 'ISE-SEM4-A' },
        { id: 'fca-6', assignmentId: 'ASN-ISE-201', teacherId: 'EMP-ISE-103', teacherName: 'Prof. Ananya Roy', subjectCode: 'IS-201', subjectName: 'Object-Oriented Programming & Java', department: 'Information Science & Engineering', departmentCode: 'ISE', year: '1st Year', semester: 'Semester 2', section: 'A', classId: 'ISE-SEM2-A' },
        // ECE
        { id: 'fca-7', assignmentId: 'ASN-ECE-601', teacherId: 'EMP-ECE-101', teacherName: 'Dr. Suresh Kumar', subjectCode: 'EC-601', subjectName: 'VLSI Microchip Design & CMOS', department: 'Electronics & Communication Engineering', departmentCode: 'ECE', year: '3rd Year', semester: 'Semester 6', section: 'A', classId: 'ECE-SEM6-A' },
        { id: 'fca-8', assignmentId: 'ASN-ECE-401', teacherId: 'EMP-ECE-102', teacherName: 'Dr. Kavita Iyer', subjectCode: 'EC-401', subjectName: 'Embedded Systems & IoT Architectures', department: 'Electronics & Communication Engineering', departmentCode: 'ECE', year: '2nd Year', semester: 'Semester 4', section: 'A', classId: 'ECE-SEM4-A' },
        { id: 'fca-9', assignmentId: 'ASN-ECE-201', teacherId: 'EMP-ECE-103', teacherName: 'Prof. Deepak Chawla', subjectCode: 'EC-201', subjectName: 'Digital Signal Processing & Logic', department: 'Electronics & Communication Engineering', departmentCode: 'ECE', year: '1st Year', semester: 'Semester 2', section: 'A', classId: 'ECE-SEM2-A' },
        // EEE
        { id: 'fca-10', assignmentId: 'ASN-EEE-601', teacherId: 'EMP-EEE-101', teacherName: 'Prof. Ramesh Rao', subjectCode: 'EE-601', subjectName: 'Smart Grids & EV Power Electronics', department: 'Electrical & Electronics Engineering', departmentCode: 'EEE', year: '3rd Year', semester: 'Semester 6', section: 'A', classId: 'EEE-SEM6-A' },
        { id: 'fca-11', assignmentId: 'ASN-EEE-401', teacherId: 'EMP-EEE-102', teacherName: 'Dr. Neha Deshmukh', subjectCode: 'EE-401', subjectName: 'Renewable Energy Integration & Power', department: 'Electrical & Electronics Engineering', departmentCode: 'EEE', year: '2nd Year', semester: 'Semester 4', section: 'A', classId: 'EEE-SEM4-A' },
        // ME
        { id: 'fca-12', assignmentId: 'ASN-ME-601', teacherId: 'EMP-ME-101', teacherName: 'Dr. Vikramaditya Singh', subjectCode: 'ME-601', subjectName: 'Industrial Robotics & CAD/CAM Automation', department: 'Mechanical Engineering', departmentCode: 'ME', year: '3rd Year', semester: 'Semester 6', section: 'A', classId: 'ME-SEM6-A' },
        { id: 'fca-13', assignmentId: 'ASN-ME-401', teacherId: 'EMP-ME-102', teacherName: 'Dr. Siddharth Mukherjee', subjectCode: 'ME-401', subjectName: 'Computational Fluid Dynamics & Thermodynamics', department: 'Mechanical Engineering', departmentCode: 'ME', year: '2nd Year', semester: 'Semester 4', section: 'A', classId: 'ME-SEM4-A' },
        // CE
        { id: 'fca-14', assignmentId: 'ASN-CE-601', teacherId: 'EMP-CE-101', teacherName: 'Dr. Meenakshi Sundaram', subjectCode: 'CE-601', subjectName: 'Sustainable Smart Cities & BIM Analysis', department: 'Civil & Environmental Engineering', departmentCode: 'CE', year: '3rd Year', semester: 'Semester 6', section: 'A', classId: 'CE-SEM6-A' },
        { id: 'fca-15', assignmentId: 'ASN-CE-401', teacherId: 'EMP-CE-102', teacherName: 'Dr. Arvind Swaminathan', subjectCode: 'CE-401', subjectName: 'Geotechnical Engineering & Deep Foundations', department: 'Civil & Environmental Engineering', departmentCode: 'CE', year: '2nd Year', semester: 'Semester 4', section: 'A', classId: 'CE-SEM4-A' },
        // MBA
        { id: 'fca-16', assignmentId: 'ASN-MBA-201', teacherId: 'EMP-MBA-101', teacherName: 'Dr. Brijesh Malhotra', subjectCode: 'MBA-201', subjectName: 'Corporate Governance & Business Analytics', department: 'Management Studies', departmentCode: 'MBA', year: '1st Year', semester: 'Semester 2', section: 'A', classId: 'MBA-SEM2-A' },
        { id: 'fca-17', assignmentId: 'ASN-MBA-401', teacherId: 'EMP-MBA-102', teacherName: 'Dr. Radhika Singhal', subjectCode: 'MBA-401', subjectName: 'Strategic Marketing & FinTech Innovation', department: 'Management Studies', departmentCode: 'MBA', year: '2nd Year', semester: 'Semester 4', section: 'A', classId: 'MBA-SEM4-A' }
      ];

      for (const a of assignments) {
        await connection.query(`
          INSERT INTO faculty_class_assignments (id, assignmentId, teacherId, teacherName, subjectCode, subjectName, department, departmentCode, year, semester, section, classId)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE teacherName = VALUES(teacherName), subjectName = VALUES(subjectName), classId = VALUES(classId)
        `, [a.id, a.assignmentId, a.teacherId, a.teacherName, a.subjectCode, a.subjectName, a.department, a.departmentCode, a.year, a.semester, a.section, a.classId]);

        await connection.query(`
          INSERT INTO staff_subject_assignments (id, teacherId, teacherName, subjectId, subjectCode, subjectName, courseId, courseName, department)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE teacherName = VALUES(teacherName), subjectName = VALUES(subjectName)
        `, [`ssa-${a.id}`, a.teacherId, a.teacherName, a.id, a.subjectCode, a.subjectName, a.id, a.subjectName, a.department]);
      }

    // 5. Seed Timetable Slots for Faculty
    console.log('⏰ Seeding timetable slots for weekly schedule...');
    const timetableData = [
        { id: 'tt-0', subjectId: 'crs-cse-601', subjectCode: 'CS-601', subjectName: 'Artificial Intelligence & Neural Networks', department: 'Computer Science & Engineering', semester: 'Semester 6', section: 'A', teacherId: 'EMP-100', teacherName: 'Dr. Sanjay Kulkarni', dayOfWeek: 'Monday', period: 'P1', startTime: '09:00 AM', endTime: '10:30 AM', room: 'Lab 101', classId: 'CSE-SEM6-A' },
        { id: 'tt-1', subjectId: 'crs-cse-601', subjectCode: 'CS-601', subjectName: 'Artificial Intelligence & Neural Networks', department: 'Computer Science & Engineering', semester: 'Semester 6', section: 'A', teacherId: 'EMP-CSE-101', teacherName: 'Dr. Rajesh Sharma', dayOfWeek: 'Monday', period: 'P1', startTime: '09:00 AM', endTime: '10:30 AM', room: 'Lab 101', classId: 'CSE-SEM6-A' },
        { id: 'tt-2', subjectId: 'crs-cse-601', subjectCode: 'CS-601', subjectName: 'Artificial Intelligence & Neural Networks', department: 'Computer Science & Engineering', semester: 'Semester 6', section: 'A', teacherId: 'EMP-CSE-101', teacherName: 'Dr. Rajesh Sharma', dayOfWeek: 'Wednesday', period: 'P3', startTime: '01:30 PM', endTime: '03:00 PM', room: 'Hall 302', classId: 'CSE-SEM6-A' },
        { id: 'tt-3', subjectId: 'crs-cse-401', subjectCode: 'CS-401', subjectName: 'Distributed Systems & Cloud Computing', department: 'Computer Science & Engineering', semester: 'Semester 4', section: 'A', teacherId: 'EMP-CSE-102', teacherName: 'Dr. Priya Nair', dayOfWeek: 'Tuesday', period: 'P2', startTime: '10:45 AM', endTime: '12:15 PM', room: 'Hall 204', classId: 'CSE-SEM4-A' },
        { id: 'tt-4', subjectId: 'crs-ise-601', subjectCode: 'IS-601', subjectName: 'Cloud Infrastructure & DevOps Systems', department: 'Information Science & Engineering', semester: 'Semester 6', section: 'A', teacherId: 'EMP-ISE-101', teacherName: 'Prof. Sunita Reddy', dayOfWeek: 'Monday', period: 'P2', startTime: '10:45 AM', endTime: '12:15 PM', room: 'Lab 202', classId: 'ISE-SEM6-A' },
        { id: 'tt-5', subjectId: 'crs-ece-601', subjectCode: 'EC-601', subjectName: 'VLSI Microchip Design & CMOS', department: 'Electronics & Communication Engineering', semester: 'Semester 6', section: 'A', teacherId: 'EMP-ECE-101', teacherName: 'Dr. Suresh Kumar', dayOfWeek: 'Thursday', period: 'P1', startTime: '09:00 AM', endTime: '10:30 AM', room: 'VLSI Lab', classId: 'ECE-SEM6-A' },
        { id: 'tt-6', subjectId: 'crs-eee-601', subjectCode: 'EE-601', subjectName: 'Smart Grids & EV Power Electronics', department: 'Electrical & Electronics Engineering', semester: 'Semester 6', section: 'A', teacherId: 'EMP-EEE-101', teacherName: 'Prof. Ramesh Rao', dayOfWeek: 'Friday', period: 'P3', startTime: '01:30 PM', endTime: '03:00 PM', room: 'Power Lab', classId: 'EEE-SEM6-A' },
        { id: 'tt-7', subjectId: 'crs-me-601', subjectCode: 'ME-601', subjectName: 'Industrial Robotics & CAD/CAM Automation', department: 'Mechanical Engineering', semester: 'Semester 6', section: 'A', teacherId: 'EMP-ME-101', teacherName: 'Dr. Vikramaditya Singh', dayOfWeek: 'Tuesday', period: 'P4', startTime: '03:15 PM', endTime: '04:45 PM', room: 'Robotics Center', classId: 'ME-SEM6-A' },
        { id: 'tt-8', subjectId: 'crs-ce-601', subjectCode: 'CE-601', subjectName: 'Sustainable Smart Cities & BIM Analysis', department: 'Civil & Environmental Engineering', semester: 'Semester 6', section: 'A', teacherId: 'EMP-CE-101', teacherName: 'Dr. Meenakshi Sundaram', dayOfWeek: 'Wednesday', period: 'P2', startTime: '10:45 AM', endTime: '12:15 PM', room: 'CAD Studio', classId: 'CE-SEM6-A' },
        { id: 'tt-9', subjectId: 'crs-mba-201', subjectCode: 'MBA-201', subjectName: 'Corporate Governance & Business Analytics', department: 'Management Studies', semester: 'Semester 2', section: 'A', teacherId: 'EMP-MBA-101', teacherName: 'Dr. Brijesh Malhotra', dayOfWeek: 'Thursday', period: 'P3', startTime: '01:30 PM', endTime: '03:00 PM', room: 'Executive Hall', classId: 'MBA-SEM2-A' }
      ];

      for (const t of timetableData) {
        await connection.query(`
          INSERT INTO timetable_slots (id, subjectId, subjectCode, subjectName, department, semester, section, teacherId, teacherName, dayOfWeek, period, startTime, endTime, room, classId, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')
          ON DUPLICATE KEY UPDATE subjectName = VALUES(subjectName), room = VALUES(room)
        `, [t.id, t.subjectId, t.subjectCode, t.subjectName, t.department, t.semester, t.section, t.teacherId, t.teacherName, t.dayOfWeek, t.period, t.startTime, t.endTime, t.room, t.classId]);
      }

    // 6. Seed Demo Students & Cohort Scholars
    const [stdCheck] = await connection.query('SELECT COUNT(*) as count FROM students');
    if (stdCheck[0].count === 0) {
      console.log('🎓 Seeding institutional students and demo student accounts...');
      const studentPassHash = await bcrypt.hash('student123', 10);
      
      const defaultStudents = [
        // Primary Demo Student (CSE 3rd Year / Semester 6)
        {
          id: 'user-student-demo',
          name: 'Aarav Patel',
          email: 'student@kalpanaaa.edu',
          password: studentPassHash,
          studentId: 'STU-CSE-301',
          rollNo: '24CSE3001',
          registerNumber: 'REG-2024-CSE-1001',
          department: 'Computer Science & Engineering',
          departmentCode: 'CSE',
          course: 'B.Tech Computer Science & Engineering',
          year: '3rd Year',
          semester: 'Semester 6',
          section: 'A',
          academicYear: '2026-2027',
          overallAttendance: '92%',
          attendanceNum: 92,
          gpa: '3.85',
          pendingFees: 0,
          phone: '+91 98765 43299',
          bio: 'Honor student in Computer Science & Engineering, specializing in neural networks and distributed systems.',
          bloodGroup: 'O+',
          address: 'Room 304, Kalpanaaa Campus Hostel Block A, Bangalore, Karnataka - 560064',
          guardianName: 'Vikram Patel',
          guardianPhone: '+91 98765 00001',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
          photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
          status: 'Active'
        },
        {
          id: 'stu-cse-602',
          name: 'Ananya Sharma',
          email: 'ananya.sharma@kalpanaaa.edu',
          password: studentPassHash,
          studentId: 'STU-CSE-302',
          rollNo: '24CSE3002',
          registerNumber: 'REG-2024-CSE-1002',
          department: 'Computer Science & Engineering',
          departmentCode: 'CSE',
          course: 'B.Tech Computer Science & Engineering',
          year: '3rd Year',
          semester: 'Semester 6',
          section: 'A',
          academicYear: '2026-2027',
          overallAttendance: '95%',
          attendanceNum: 95,
          gpa: '3.92',
          pendingFees: 0,
          phone: '+91 98765 43298',
          bio: 'Student researcher in machine learning and AI ethics.',
          bloodGroup: 'B+',
          address: 'Bangalore, Karnataka - 560064',
          guardianName: 'Rajesh Sharma',
          guardianPhone: '+91 98765 00002',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          status: 'Active'
        },
        {
          id: 'stu-cse-603',
          name: 'Rohan Verma',
          email: 'rohan.verma@kalpanaaa.edu',
          password: studentPassHash,
          studentId: 'STU-CSE-303',
          rollNo: '24CSE3003',
          registerNumber: 'REG-2024-CSE-1003',
          department: 'Computer Science & Engineering',
          departmentCode: 'CSE',
          course: 'B.Tech Computer Science & Engineering',
          year: '3rd Year',
          semester: 'Semester 6',
          section: 'A',
          academicYear: '2026-2027',
          overallAttendance: '88%',
          attendanceNum: 88,
          gpa: '3.70',
          pendingFees: 15000,
          phone: '+91 98765 43297',
          bio: 'Full stack developer and cloud computing enthusiast.',
          bloodGroup: 'A+',
          address: 'Bangalore, Karnataka - 560064',
          guardianName: 'Sunil Verma',
          guardianPhone: '+91 98765 00003',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
          photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
          status: 'Active'
        },
        {
          id: 'stu-cse-604',
          name: 'Sneha Reddy',
          email: 'sneha.reddy@kalpanaaa.edu',
          password: studentPassHash,
          studentId: 'STU-CSE-304',
          rollNo: '24CSE3004',
          registerNumber: 'REG-2024-CSE-1004',
          department: 'Computer Science & Engineering',
          departmentCode: 'CSE',
          course: 'B.Tech Computer Science & Engineering',
          year: '3rd Year',
          semester: 'Semester 6',
          section: 'A',
          academicYear: '2026-2027',
          overallAttendance: '91%',
          attendanceNum: 91,
          gpa: '3.88',
          pendingFees: 0,
          phone: '+91 98765 43296',
          bio: 'President of IEEE student chapter and robotics club lead.',
          bloodGroup: 'AB+',
          address: 'Bangalore, Karnataka - 560064',
          guardianName: 'Kishore Reddy',
          guardianPhone: '+91 98765 00004',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
          photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
          status: 'Active'
        },
        {
          id: 'stu-cse-605',
          name: 'Aditya Nair',
          email: 'aditya.nair@kalpanaaa.edu',
          password: studentPassHash,
          studentId: 'STU-CSE-305',
          rollNo: '24CSE3005',
          registerNumber: 'REG-2024-CSE-1005',
          department: 'Computer Science & Engineering',
          departmentCode: 'CSE',
          course: 'B.Tech Computer Science & Engineering',
          year: '3rd Year',
          semester: 'Semester 6',
          section: 'A',
          academicYear: '2026-2027',
          overallAttendance: '89%',
          attendanceNum: 89,
          gpa: '3.65',
          pendingFees: 0,
          phone: '+91 98765 43295',
          bio: 'Competitive programmer and algorithmic problem solver.',
          bloodGroup: 'O-',
          address: 'Bangalore, Karnataka - 560064',
          guardianName: 'Mohan Nair',
          guardianPhone: '+91 98765 00005',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
          photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
          status: 'Active'
        },
        {
          id: 'stu-cse-401',
          name: 'Karthik Menon',
          email: 'karthik.menon@kalpanaaa.edu',
          password: studentPassHash,
          studentId: 'STU-CSE-201',
          rollNo: '24CSE2001',
          registerNumber: 'REG-2024-CSE-2001',
          department: 'Computer Science & Engineering',
          departmentCode: 'CSE',
          course: 'B.Tech Computer Science & Engineering',
          year: '2nd Year',
          semester: 'Semester 4',
          section: 'A',
          academicYear: '2026-2027',
          overallAttendance: '94%',
          attendanceNum: 94,
          gpa: '3.78',
          pendingFees: 0,
          phone: '+91 98765 43294',
          bio: 'Undergraduate scholar in systems programming and operating systems.',
          bloodGroup: 'B+',
          address: 'Bangalore, Karnataka - 560064',
          guardianName: 'Gopal Menon',
          guardianPhone: '+91 98765 00006',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
          photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
          status: 'Active'
        },
        {
          id: 'stu-ise-601',
          name: 'Divya Iyer',
          email: 'divya.iyer@kalpanaaa.edu',
          password: studentPassHash,
          studentId: 'STU-ISE-301',
          rollNo: '24ISE3001',
          registerNumber: 'REG-2024-ISE-1001',
          department: 'Information Science & Engineering',
          departmentCode: 'ISE',
          course: 'B.Tech Information Science & Engineering',
          year: '3rd Year',
          semester: 'Semester 6',
          section: 'A',
          academicYear: '2026-2027',
          overallAttendance: '96%',
          attendanceNum: 96,
          gpa: '3.95',
          pendingFees: 0,
          phone: '+91 98765 43293',
          bio: 'Cloud architecture and cybersecurity enthusiast.',
          bloodGroup: 'A+',
          address: 'Bangalore, Karnataka - 560064',
          guardianName: 'Venkatesh Iyer',
          guardianPhone: '+91 98765 00007',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
          photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
          status: 'Active'
        },
        {
          id: 'stu-mba-201',
          name: 'Varun Singhania',
          email: 'varun.singhania@kalpanaaa.edu',
          password: studentPassHash,
          studentId: 'STU-MBA-101',
          rollNo: '24MBA1001',
          registerNumber: 'REG-2024-MBA-1001',
          department: 'Management Studies',
          departmentCode: 'MBA',
          course: 'Master of Business Administration (MBA)',
          year: '1st Year',
          semester: 'Semester 2',
          section: 'A',
          academicYear: '2026-2027',
          overallAttendance: '90%',
          attendanceNum: 90,
          gpa: '3.82',
          pendingFees: 0,
          phone: '+91 98765 43292',
          bio: 'MBA scholar specializing in Corporate Finance and FinTech analytics.',
          bloodGroup: 'O+',
          address: 'Bangalore, Karnataka - 560064',
          guardianName: 'Harish Singhania',
          guardianPhone: '+91 98765 00008',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
          photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
          status: 'Active'
        }
      ];

      for (const s of defaultStudents) {
        await connection.query(`
          INSERT INTO students (
            id, name, email, password, studentId, rollNo, registerNumber,
            department, departmentCode, course, year, semester, section,
            academicYear, overallAttendance, attendanceNum, gpa, pendingFees,
            phone, bio, bloodGroup, address, guardianName, guardianPhone,
            avatar, photoUrl, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), password = VALUES(password), gpa = VALUES(gpa), overallAttendance = VALUES(overallAttendance)
        `, [
          s.id, s.name, s.email, s.password, s.studentId, s.rollNo, s.registerNumber,
          s.department, s.departmentCode, s.course, s.year, s.semester, s.section,
          s.academicYear, s.overallAttendance, s.attendanceNum, s.gpa, s.pendingFees,
          s.phone, s.bio, s.bloodGroup, s.address, s.guardianName, s.guardianPhone,
          s.avatar, s.photoUrl, s.status
        ]);
      }
    }

    const [stdCount] = await connection.query('SELECT COUNT(*) as count FROM students');
    const [subCount] = await connection.query('SELECT COUNT(*) as count FROM courses');
    const [deptFinal] = await connection.query('SELECT COUNT(*) as count FROM departments');
    const [fcaFinal] = await connection.query('SELECT COUNT(*) as count FROM faculty_class_assignments');
    const [tchFinal] = await connection.query('SELECT COUNT(*) as count FROM teachers');

    console.log(`📊 Verified Clean MySQL Database: ${deptFinal[0].count} Departments, ${tchFinal[0].count} Teachers, ${subCount[0].count} Courses, ${fcaFinal[0].count} Class Assignments, ${stdCount[0].count} Students.`);
    await connection.end();
  } catch (err) {
    console.error('Database connection verification:', err.message);
  }
}

