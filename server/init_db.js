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
      rollNo VARCHAR(50),
      registerNumber VARCHAR(100),
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
    "ALTER TABLE subjects ADD COLUMN assignedTeacherName VARCHAR(150)"
  ];

  for (const mig of columnMigrations) {
    try {
      await connection.query(mig);
    } catch (e) {
      // Column already exists, ignore error
    }
  }
}

export async function initializeDatabase() {
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
      const database = process.env.MYSQLDATABASE || process.env.DB_NAME;

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

    console.log('🔌 Connected to MySQL server:', process.env.MYSQLDATABASE || 'kalpanaa_education_db');
    await createTablesIfNotExist(connection);

    // Seed/Ensure Default Admin, Teacher, Student demo accounts
    const adminPassHash = await bcrypt.hash('admin123', 10);
    await connection.query(`
      INSERT INTO admins (id, employeeId, name, email, password, designation)
      VALUES ('user-admin', 'ADM-001', 'Administrator', 'admin@kalpanaaa.edu', ?, 'Super Administrator & Dean')
      ON DUPLICATE KEY UPDATE email = 'admin@kalpanaaa.edu', password = ?
    `, [adminPassHash, adminPassHash]);

    const teacherPassHash = await bcrypt.hash('teacher123', 10);
    await connection.query(`
      INSERT INTO teachers (id, employeeId, name, email, password, department, designation)
      VALUES ('user-teacher-demo', 'EMP-100', 'Demo Teacher', 'teacher@kalpanaaa.edu', ?, 'Computer Science & Engineering', 'Senior Professor')
      ON DUPLICATE KEY UPDATE email = 'teacher@kalpanaaa.edu', password = ?
    `, [teacherPassHash, teacherPassHash]);

    const studentPassHash = await bcrypt.hash('student123', 10);
    await connection.query(`
      INSERT INTO students (id, studentId, name, email, password, department, semester, section, status)
      VALUES ('stu-demo-001', 'STU-001', 'Demo Student', 'student@kalpanaaa.edu', ?, 'Computer Science & Engineering', 'Semester 4', 'A', 'Active')
      ON DUPLICATE KEY UPDATE email = 'student@kalpanaaa.edu', password = ?
    `, [studentPassHash, studentPassHash]);

    // Seed Departments if empty
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
          ON DUPLICATE KEY UPDATE name = VALUES(name), hod = VALUES(hod)
        `, [d.id, d.name, d.code, d.hod, d.description, d.status]);
      }
    }

    // Safe backfill: for existing subjects, link courseId to matching course by department & semester where unambiguous
    try {
      await connection.query(`
        UPDATE subjects s
        JOIN courses c ON (LOWER(s.department) = LOWER(c.department) AND LOWER(s.semester) = LOWER(c.semester))
        SET s.courseId = c.id
        WHERE s.courseId IS NULL OR s.courseId = ''
      `);
    } catch (e) {
      // Ignore if backfill query cannot be run
    }

    const [stdCount] = await connection.query('SELECT COUNT(*) as count FROM students');
    const [subCount] = await connection.query('SELECT COUNT(*) as count FROM courses');
    const [deptFinal] = await connection.query('SELECT COUNT(*) as count FROM departments');

    console.log(`📊 Verified Clean MySQL Database: ${deptFinal[0].count} Departments, ${stdCount[0].count} Students, ${subCount[0].count} Courses.`);
    await connection.end();
  } catch (err) {
    console.error('Database connection verification:', err.message);
  }
}

