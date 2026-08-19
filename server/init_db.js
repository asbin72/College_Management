import mysql from 'mysql2/promise';

async function createTablesIfNotExist(connection) {
  const tableSchemas = [
    `CREATE TABLE IF NOT EXISTS students (
      id VARCHAR(50) PRIMARY KEY,
      studentId VARCHAR(50) UNIQUE NOT NULL,
      rollNo VARCHAR(50),
      name VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      password VARCHAR(255) NOT NULL,
      department VARCHAR(100) NOT NULL,
      course VARCHAR(150),
      semester INT DEFAULT 1,
      section VARCHAR(10) DEFAULT 'A',
      classId VARCHAR(100),
      phone VARCHAR(20),
      dob VARCHAR(20),
      gender VARCHAR(10),
      bloodGroup VARCHAR(10),
      address TEXT,
      admissionYear INT DEFAULT 2024,
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
      joiningDate VARCHAR(20),
      specialization VARCHAR(150),
      assignedClasses TEXT,
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
      semester INT DEFAULT 1,
      credits INT DEFAULT 4,
      type VARCHAR(50) DEFAULT 'Core',
      syllabus TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS subjects (
      id VARCHAR(50) PRIMARY KEY,
      code VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(150) NOT NULL,
      department VARCHAR(100) NOT NULL,
      semester INT DEFAULT 1,
      credits INT DEFAULT 4
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
      teacherId VARCHAR(50) NOT NULL,
      teacherName VARCHAR(150) NOT NULL,
      subjectCode VARCHAR(20) NOT NULL,
      subjectName VARCHAR(150) NOT NULL,
      department VARCHAR(100) NOT NULL,
      semester INT NOT NULL,
      section VARCHAR(10) DEFAULT 'A',
      classId VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS examinations (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      type VARCHAR(50) DEFAULT 'Internal Assessment',
      semester INT DEFAULT 1,
      department VARCHAR(100),
      subjectCode VARCHAR(20),
      subjectName VARCHAR(150),
      examDate VARCHAR(20),
      maxMarks INT DEFAULT 100,
      weightage INT DEFAULT 20,
      status VARCHAR(50) DEFAULT 'Scheduled',
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
      idempotency_key VARCHAR(100),
      status VARCHAR(20) DEFAULT 'Completed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
  ];

  for (const sql of tableSchemas) {
    await connection.query(sql);
  }
}

export async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
      user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'root',
      database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'kalpanaa_education_db',
      port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
      ssl: process.env.MYSQLHOST ? { rejectUnauthorized: false } : undefined
    });

    console.log('🔌 Connected to MySQL server:', process.env.MYSQLDATABASE || 'kalpanaa_education_db');
    await createTablesIfNotExist(connection);

    const [stdCount] = await connection.query('SELECT COUNT(*) as count FROM students');
    const [subCount] = await connection.query('SELECT COUNT(*) as count FROM courses');
    
    // 1. Check teacher attendance logs
    const [tAttCount] = await connection.query('SELECT COUNT(*) as count FROM teacher_attendance_logs');
    if (tAttCount[0].count === 0) {
      console.log('🌱 Seeding initial biometric attendance logs for faculty members...');
      const [teachers] = await connection.query('SELECT * FROM teachers');
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const dates = [todayStr, yesterdayStr, '2026-08-15', '2026-08-14', '2026-08-13'];
      
      for (const t of teachers) {
        for (const date of dates) {
          const checkInTimes = ['08:35 AM', '08:42 AM', '08:45 AM', '08:50 AM', '08:52 AM'];
          const checkOutTimes = ['04:45 PM', '04:55 PM', '05:05 PM', '05:15 PM'];
          const randomIn = checkInTimes[Math.floor(Math.random() * checkInTimes.length)];
          const randomOut = checkOutTimes[Math.floor(Math.random() * checkOutTimes.length)];
          const logId = `tatt-${t.id}-${date}`;

          await connection.query(
            `INSERT INTO teacher_attendance_logs 
              (id, teacherId, teacherName, department, designation, date, checkInTime, checkOutTime, status, biometricMode, remarks) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE status=VALUES(status)`,
            [
              logId,
              t.employeeId || t.id,
              t.name,
              t.department,
              t.designation || 'Faculty Member',
              date,
              randomIn,
              randomOut,
              'Present',
              'Biometric Smart Card',
              'Regular Academic Duty'
            ]
          );
        }
      }
    }

    // 2. Check and Seed Assignments
    const [asnCount] = await connection.query('SELECT COUNT(*) as count FROM assignments');
    if (asnCount[0].count === 0) {
      console.log('🌱 Seeding initial academic assignments into MySQL...');
      const initialAssignments = [
        {
          id: 'ASN-CSE-101',
          title: 'Data Structures & Algorithms - AVL & Red-Black Tree Implementation',
          subject: 'Data Structures & Algorithms',
          code: 'CSE-301',
          classId: 'CLS-CSE-3-Semester 5',
          teacherId: 'EMP-101',
          teacherName: 'Dr. Rajesh Sharma',
          description: 'Implement self-balancing Binary Search Trees (AVL and Red-Black Trees) with insertion, deletion, and rotation operations in C++ or Java.',
          instructions: 'Submit compressed zip file containing source code, test cases, and a 2-page PDF performance benchmark analysis.',
          assignedDate: '2026-08-10',
          dueDate: '2026-08-25',
          maxMarks: 50,
          status: 'Active'
        },
        {
          id: 'ASN-CSE-102',
          title: 'Database Management Systems - Normalized Schema & Indexing Benchmark',
          subject: 'Database Management Systems',
          code: 'CSE-302',
          classId: 'CLS-CSE-3-Semester 5',
          teacherId: 'EMP-108',
          teacherName: 'Prof. Amit Verma',
          description: 'Design a 3NF normalized institutional database schema with B-Tree vs Hash index performance comparison on 100,000 synthetic records.',
          instructions: 'Include SQL DDL scripts, query explain plans, and benchmark charts.',
          assignedDate: '2026-08-12',
          dueDate: '2026-08-28',
          maxMarks: 50,
          status: 'Active'
        },
        {
          id: 'ASN-ECE-101',
          title: 'Digital Signal Processing - Fast Fourier Transform (FFT) Filter Design',
          subject: 'Digital Signal Processing',
          code: 'ECE-301',
          classId: 'CLS-ECE-3-Semester 5',
          teacherId: 'EMP-103',
          teacherName: 'Dr. Suresh Kumar',
          description: 'Design a digital Butterworth bandpass filter using MATLAB or Python scipy signal library to filter noise from acoustic sensor data.',
          instructions: 'Submit Jupyter Notebook and spectrogram audio visualizations.',
          assignedDate: '2026-08-14',
          dueDate: '2026-08-30',
          maxMarks: 50,
          status: 'Active'
        }
      ];

      for (const a of initialAssignments) {
        await connection.query(`
          INSERT INTO assignments (id, title, subject, code, classId, teacherId, teacherName, description, instructions, assignedDate, dueDate, maxMarks, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE title = VALUES(title)
        `, [a.id, a.title, a.subject, a.code, a.classId, a.teacherId, a.teacherName, a.description, a.instructions, a.assignedDate, a.dueDate, a.maxMarks, a.status]);
      }

      // Seed initial submission
      await connection.query(`
        INSERT INTO assignment_submissions (id, assignmentId, studentId, studentName, submittedDate, fileName, comments, marks, feedback, gradedBy)
        VALUES ('SUB-101', 'ASN-CSE-101', 'STU-2024-001', 'Ananya Sharma', '2026-08-14', 'AVL_Tree_Benchmark_Ananya.zip', 'Completed with 100k stress tests.', 48, 'Excellent tree rotation balance implementation.', 'EMP-101')
        ON DUPLICATE KEY UPDATE marks = VALUES(marks)
      `);
    }

    // 3. Check and Seed Notifications
    const [notifCount] = await connection.query('SELECT COUNT(*) as count FROM notifications');
    if (notifCount[0].count === 0) {
      console.log('🌱 Seeding initial real-time notifications...');
      const notifs = [
        { id: 'NOTIF-101', userId: 'ALL_USERS', userRole: 'ALL', title: 'Campus Academic Term 2026-2027 Active', message: 'The institutional CMS has synchronized all semester schedules, faculty allocations, and biometric attendance records.', date: '2026-08-15', isRead: 0 },
        { id: 'NOTIF-102', userId: 'ALL_STUDENTS', userRole: 'STUDENT', title: 'Mid-Semester Examination Schedule Published', message: 'Mid-Semester Exam schedules are available in your portal. Check exam dates and hall ticket requirements.', date: '2026-08-14', isRead: 0 },
        { id: 'NOTIF-103', userId: 'ALL_TEACHERS', userRole: 'TEACHER', title: 'Faculty Attendance & Evaluation Portal Active', message: 'Internal assessment marks submission and biometric roster logs are open for verification.', date: '2026-08-13', isRead: 0 },
        { id: 'NOTIF-104', userId: 'STU-2024-001', userRole: 'STUDENT', title: 'Assignment Evaluated: Data Structures', message: 'Your assignment submission for AVL Tree implementation has been graded: 48/50.', date: '2026-08-15', isRead: 0 }
      ];
      for (const n of notifs) {
        await connection.query(`
          INSERT INTO notifications (id, userId, userRole, title, message, date, isRead)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE title = VALUES(title)
        `, [n.id, n.userId, n.userRole, n.title, n.message, n.date, n.isRead]);
      }
    }

    // 4. Check and Seed Leave Requests
    const [levCount] = await connection.query('SELECT COUNT(*) as count FROM leave_requests');
    if (levCount[0].count === 0) {
      console.log('🌱 Seeding initial academic leave requests...');
      const leaves = [
        { id: 'LV-2026-101', applicantId: 'STU-2024-001', applicantName: 'Ananya Sharma', applicantRole: 'STUDENT', department: 'Computer Science and Engineering', leaveType: 'Medical', fromDate: '2026-08-18', toDate: '2026-08-20', days: 3, reason: 'Viral recovery and medical checkup.', status: 'Approved', appliedOn: '2026-08-15' },
        { id: 'LV-2026-102', applicantId: 'STU-CSE-102', applicantName: 'Rohan Deshmukh', applicantRole: 'STUDENT', department: 'Computer Science and Engineering', leaveType: 'Academic Event', fromDate: '2026-08-22', toDate: '2026-08-23', days: 2, reason: 'Participating in National Hackathon at IIT Bombay.', status: 'Pending', appliedOn: '2026-08-16' },
        { id: 'LV-FAC-101', applicantId: 'EMP-101', applicantName: 'Dr. Rajesh Sharma', applicantRole: 'TEACHER', department: 'Computer Science and Engineering', leaveType: 'Duty Leave (Conference)', fromDate: '2026-08-24', toDate: '2026-08-26', days: 3, reason: 'Presenting research paper at IEEE ICAC International Conference.', status: 'Approved', appliedOn: '2026-08-14' }
      ];
      for (const l of leaves) {
        await connection.query(`
          INSERT INTO leave_requests (id, applicantId, applicantName, applicantRole, department, leaveType, fromDate, toDate, days, reason, status, appliedOn)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE status = VALUES(status)
        `, [l.id, l.applicantId, l.applicantName, l.applicantRole, l.department, l.leaveType, l.fromDate, l.toDate, l.days, l.reason, l.status, l.appliedOn]);
      }
    }

    // 5. Check and Seed Audit Logs
    const [adtCount] = await connection.query('SELECT COUNT(*) as count FROM audit_logs');
    if (adtCount[0].count === 0) {
      console.log('🌱 Seeding institutional audit logs...');
      const audits = [
        { id: 'ADT-101', actorId: 'user-admin', actorRole: 'ADMIN', action: 'SEMESTER_INITIALIZATION', entityType: 'SYSTEM', entityId: 'TERM-2026-2027', details: 'Initialized Academic Year 2026-2027 curriculum and class cohorts for 7 departments.' },
        { id: 'ADT-102', actorId: 'user-admin', actorRole: 'ADMIN', action: 'FACULTY_ALLOCATION_COMPLETED', entityType: 'FACULTY', entityId: 'ALL-FACULTY', details: 'Allocated 26 class cohorts across Engineering and Management departments.' },
        { id: 'ADT-103', actorId: 'EMP-101', actorRole: 'TEACHER', action: 'ATTENDANCE_BATCH_SUBMISSION', entityType: 'ATTENDANCE', entityId: 'CLS-CSE-3-Semester 5', details: 'Marked smart card biometric attendance for CSE 5th Semester cohort.' }
      ];
      for (const a of audits) {
        await connection.query(`
          INSERT INTO audit_logs (id, actorId, actorRole, action, entityType, entityId, details, timestamp)
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE action = VALUES(action)
        `, [a.id, a.actorId, a.actorRole, a.action, a.entityType, a.entityId, a.details]);
      }
    }

    // 6. Check and Seed Fee Payments
    const [feeCount] = await connection.query('SELECT COUNT(*) as count FROM fee_payments');
    if (feeCount[0].count === 0) {
      console.log('🌱 Seeding initial student fee transactions...');
      const [allStus] = await connection.query('SELECT studentId FROM students LIMIT 2');
      const s1 = allStus[0]?.studentId || 'STU-CSE-101';
      const s2 = allStus[1]?.studentId || s1;

      const feeTxns = [
        { id: 'TXN-FEE-1001', student_id: s1, fee_type: 'Tuition Fee - Semester 5', amount: 62500, payment_method: 'Net Banking (HDFC Bank)', transaction_id: 'HDFC-PAY-981245', status: 'Completed' },
        { id: 'TXN-FEE-1002', student_id: s2, fee_type: 'Laboratory & Examination Fee', amount: 15000, payment_method: 'UPI Instant (GPay)', transaction_id: 'UPI-TXN-481920', status: 'Completed' }
      ];
      for (const f of feeTxns) {
        await connection.query(`
          INSERT INTO fee_payments (id, student_id, fee_type, amount, payment_method, transaction_id, idempotency_key, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE status = VALUES(status)
        `, [f.id, f.student_id, f.fee_type, f.amount, f.payment_method, f.transaction_id, `IDEM-${f.id}`, f.status]);
      }
    }

    // 7. Create marks table if missing and seed initial exam marks
    await connection.query(`
      CREATE TABLE IF NOT EXISTS marks (
        id VARCHAR(50) PRIMARY KEY,
        examId VARCHAR(50) NOT NULL,
        studentId VARCHAR(50) NOT NULL,
        studentName VARCHAR(150) NOT NULL,
        subjectCode VARCHAR(20) NOT NULL,
        subjectName VARCHAR(150) NOT NULL,
        marksObtained INT NOT NULL,
        maxMarks INT NOT NULL DEFAULT 100,
        grade VARCHAR(5) NOT NULL,
        remarks VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_exam (examId),
        INDEX idx_student (studentId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [marksCount] = await connection.query('SELECT COUNT(*) as count FROM marks');
    if (marksCount[0].count === 0) {
      console.log('🌱 Seeding examination marks records into MySQL...');
      const sampleMarks = [
        { id: 'MRK-101', examId: 'EXAM-101', studentId: 'STU-CSE-101', studentName: 'Ananya Sharma', subjectCode: 'CSE-301', subjectName: 'Data Structures & Algorithms', marksObtained: 88, maxMarks: 100, grade: 'A+', remarks: 'Excellent algorithm optimization.' },
        { id: 'MRK-102', examId: 'EXAM-101', studentId: 'STU-CSE-102', studentName: 'Rohan Deshmukh', subjectCode: 'CSE-301', subjectName: 'Data Structures & Algorithms', marksObtained: 76, maxMarks: 100, grade: 'A', remarks: 'Good grasp of graph data structures.' },
        { id: 'MRK-103', examId: 'EXAM-102', studentId: 'STU-ISE-101', studentName: 'Priya Nair', subjectCode: 'ISE-301', subjectName: 'Full Stack Web Architecture', marksObtained: 92, maxMarks: 100, grade: 'O', remarks: 'Outstanding full-stack project implementation.' }
      ];
      for (const m of sampleMarks) {
        await connection.query(`
          INSERT INTO marks (id, examId, studentId, studentName, subjectCode, subjectName, marksObtained, maxMarks, grade, remarks)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE marksObtained = VALUES(marksObtained)
        `, [m.id, m.examId, m.studentId, m.studentName, m.subjectCode, m.subjectName, m.marksObtained, m.maxMarks, m.grade, m.remarks]);
      }
    }

    // 8. Check and Seed Admission Applications
    const [appCount] = await connection.query('SELECT COUNT(*) as count FROM admission_applications');
    if (appCount[0].count === 0) {
      console.log('🌱 Seeding initial admission applications into MySQL...');
      const sampleApps = [
        { id: 'app-101', app_ref: 'APP-2026-1001', full_name: 'Aditya Kulkarni', email: 'aditya.kulkarni@gmail.com', phone: '9845012345', dob: '2007-05-12', gender: 'Male', course: 'B.Tech Computer Science & Engineering', department: 'Computer Science', prev_qualification: '12th Standard (CBSE)', prev_percentage: '94.5%', guardian_name: 'Sanjay Kulkarni', guardian_phone: '9845099999', doc_10th: 'aditya_10th.pdf', doc_12th: 'aditya_12th.pdf', doc_tc: 'aditya_tc.pdf', status: 'Under Verification' },
        { id: 'app-102', app_ref: 'APP-2026-1002', full_name: 'Kavya Sunder', email: 'kavya.sunder@gmail.com', phone: '9845023456', dob: '2007-08-20', gender: 'Female', course: 'B.Tech Information Science & Engineering', department: 'Information Science', prev_qualification: '12th Standard (State Board)', prev_percentage: '91.2%', guardian_name: 'Ramesh Sunder', guardian_phone: '9845088888', doc_10th: 'kavya_10th.pdf', doc_12th: 'kavya_12th.pdf', doc_tc: 'kavya_tc.pdf', status: 'Under Verification' },
        { id: 'app-103', app_ref: 'APP-2026-1003', full_name: 'Nikhil R', email: 'nikhil.r@gmail.com', phone: '9845034567', dob: '2006-11-15', gender: 'Male', course: 'B.Tech Electronics & Communication', department: 'Electronics & Communication', prev_qualification: 'Diploma in Electronics', prev_percentage: '88.0%', guardian_name: 'Rajendran R', guardian_phone: '9845077777', doc_10th: 'nikhil_10th.pdf', doc_12th: 'nikhil_diploma.pdf', doc_tc: 'nikhil_tc.pdf', status: 'Approved' }
      ];
      for (const a of sampleApps) {
        await connection.query(`
          INSERT INTO admission_applications 
            (id, app_ref, full_name, email, phone, dob, gender, course, department, prev_qualification, prev_percentage, guardian_name, guardian_phone, doc_10th, doc_12th, doc_tc, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE status = VALUES(status)
        `, [a.id, a.app_ref, a.full_name, a.email, a.phone, a.dob, a.gender, a.course, a.department, a.prev_qualification, a.prev_percentage, a.guardian_name, a.guardian_phone, a.doc_10th, a.doc_12th, a.doc_tc, a.status]);
      }
    }

    const [tCount] = await connection.query('SELECT COUNT(*) as count FROM teacher_attendance_logs');
    const [asnFinal] = await connection.query('SELECT COUNT(*) as count FROM assignments');
    const [notifFinal] = await connection.query('SELECT COUNT(*) as count FROM notifications');
    const [levFinal] = await connection.query('SELECT COUNT(*) as count FROM leave_requests');
    const [adtFinal] = await connection.query('SELECT COUNT(*) as count FROM audit_logs');
    const [feeFinal] = await connection.query('SELECT COUNT(*) as count FROM fee_payments');
    const [mrkFinal] = await connection.query('SELECT COUNT(*) as count FROM marks');
    const [appFinal] = await connection.query('SELECT COUNT(*) as count FROM admission_applications');

    console.log(`📊 Verified MySQL Database Records: ${stdCount[0].count} Students, ${subCount[0].count} Courses, ${tCount[0].count} Teacher Logs, ${asnFinal[0].count} Assignments, ${notifFinal[0].count} Notifications, ${levFinal[0].count} Leaves, ${feeFinal[0].count} Fee Txns, ${mrkFinal[0].count} Marks, ${appFinal[0].count} Applications.`);
    await connection.end();
  } catch (err) {
    console.error('Database connection verification:', err.message);
  }
}

