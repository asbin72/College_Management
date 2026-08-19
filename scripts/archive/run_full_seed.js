import mysql from 'mysql2/promise';
import { generateStudents, generateSubjectOfferings, generateFacultyAndAssignments, DEPARTMENTS } from '../src/data/collegeDataGenerator.js';
import { INITIAL_USERS, INITIAL_DEPARTMENTS, INITIAL_COURSES, INITIAL_HELPDESK, INITIAL_ANNOUNCEMENTS } from '../src/data/initialMockData.js';

async function seedAll() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    multipleStatements: true
  });

  console.log('🔌 Connected to MySQL server...');
  await connection.query(`CREATE DATABASE IF NOT EXISTS kalpanaa_education_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await connection.query(`USE kalpanaa_education_db;`);
  await connection.query(`SET FOREIGN_KEY_CHECKS = 0;`);

  console.log('🗑️ Dropping existing tables for clean schema build...');
  await connection.query(`
    DROP TABLE IF EXISTS students;
    DROP TABLE IF EXISTS teachers;
    DROP TABLE IF EXISTS admins;
    DROP TABLE IF EXISTS departments;
    DROP TABLE IF EXISTS courses;
    DROP TABLE IF EXISTS subjects;
    DROP TABLE IF EXISTS helpdesk_tickets;
    DROP TABLE IF EXISTS leave_requests;
    DROP TABLE IF EXISTS announcements;
    DROP TABLE IF EXISTS notifications;
    DROP TABLE IF EXISTS audit_logs;
    DROP TABLE IF EXISTS examinations;
    DROP TABLE IF EXISTS internal_marks;
    DROP TABLE IF EXISTS attendance_logs;
    DROP TABLE IF EXISTS assignments;
    DROP TABLE IF EXISTS assignment_submissions;
  `);

  console.log('🏗️ Creating all institutional tables...');
  await connection.query(`
    CREATE TABLE students (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL DEFAULT 'student123',
      studentId VARCHAR(50) UNIQUE NOT NULL,
      rollNo VARCHAR(50),
      registerNumber VARCHAR(50) DEFAULT 'REG-2024-8891',
      department VARCHAR(100) DEFAULT 'Computer Science and Engineering',
      departmentCode VARCHAR(20) DEFAULT 'CSE',
      course VARCHAR(100) DEFAULT 'B.Tech Computer Science & Engineering',
      year VARCHAR(50) DEFAULT '1st Year',
      semester VARCHAR(50) DEFAULT 'Semester 1',
      section VARCHAR(20) DEFAULT 'Sec A',
      academicYear VARCHAR(50) DEFAULT '2026-2027',
      overallAttendance VARCHAR(10) DEFAULT '88%',
      attendanceNum INT DEFAULT 88,
      gpa VARCHAR(10) DEFAULT '3.84',
      pendingFees INT DEFAULT 15000,
      phone VARCHAR(50) DEFAULT '+91 98765 43210',
      bio TEXT,
      bloodGroup VARCHAR(10) DEFAULT 'O+',
      address TEXT,
      guardianName VARCHAR(100),
      guardianPhone VARCHAR(50),
      avatar LONGTEXT,
      photoUrl LONGTEXT,
      status VARCHAR(50) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE teachers (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL DEFAULT 'teacher123',
      employeeId VARCHAR(50) UNIQUE NOT NULL,
      designation VARCHAR(100) DEFAULT 'Associate Professor',
      department VARCHAR(100) DEFAULT 'Computer Science and Engineering',
      qualification VARCHAR(100) DEFAULT 'Ph.D. Computer Science',
      specialization VARCHAR(100) DEFAULT 'Computer Science & Engineering',
      experience VARCHAR(50) DEFAULT '12 Years',
      phone VARCHAR(50) DEFAULT '+91 98765 43210',
      bio TEXT,
      avatar LONGTEXT,
      photoUrl LONGTEXT,
      status VARCHAR(50) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE admins (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL DEFAULT 'admin123',
      employeeId VARCHAR(50) UNIQUE NOT NULL,
      designation VARCHAR(100) DEFAULT 'Super Administrator',
      phone VARCHAR(50) DEFAULT '+91 98765 43200',
      avatar LONGTEXT,
      photoUrl LONGTEXT,
      status VARCHAR(50) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE departments (
      id VARCHAR(50) PRIMARY KEY,
      code VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      hod VARCHAR(100),
      description TEXT,
      totalFaculty INT DEFAULT 12,
      totalStudents INT DEFAULT 120,
      status VARCHAR(20) DEFAULT 'Active'
    );

    CREATE TABLE courses (
      id VARCHAR(50) PRIMARY KEY,
      code VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      department VARCHAR(100),
      duration VARCHAR(50) DEFAULT '4 Years (8 Semesters)',
      fees VARCHAR(50) DEFAULT '₹1,25,000 / Year',
      type VARCHAR(50) DEFAULT 'Undergraduate',
      status VARCHAR(20) DEFAULT 'Active'
    );

    CREATE TABLE subjects (
      id VARCHAR(50) PRIMARY KEY,
      code VARCHAR(30) UNIQUE NOT NULL,
      name VARCHAR(150) NOT NULL,
      department VARCHAR(100) NOT NULL,
      departmentCode VARCHAR(20),
      semester VARCHAR(50) NOT NULL,
      year VARCHAR(50),
      credits INT DEFAULT 4,
      subjectType VARCHAR(50) DEFAULT 'Core Theory',
      assignedTeacherName VARCHAR(100) DEFAULT 'Faculty In-Charge',
      academicYear VARCHAR(50) DEFAULT '2026-2027'
    );

    CREATE TABLE attendance_logs (
      id VARCHAR(50) PRIMARY KEY,
      studentId VARCHAR(50) NOT NULL,
      studentName VARCHAR(100),
      subjectCode VARCHAR(50) NOT NULL,
      subjectName VARCHAR(150),
      classId VARCHAR(50),
      date VARCHAR(50) NOT NULL,
      period VARCHAR(50) DEFAULT '09:30 AM',
      status VARCHAR(20) DEFAULT 'Present',
      markedBy VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE assignments (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      subject VARCHAR(150) NOT NULL,
      code VARCHAR(50),
      classId VARCHAR(50),
      teacherId VARCHAR(50),
      teacherName VARCHAR(100),
      description TEXT,
      instructions TEXT,
      assignedDate VARCHAR(50),
      dueDate VARCHAR(50),
      maxMarks INT DEFAULT 30,
      status VARCHAR(50) DEFAULT 'PUBLISHED'
    );

    CREATE TABLE assignment_submissions (
      id VARCHAR(50) PRIMARY KEY,
      assignmentId VARCHAR(50) NOT NULL,
      studentId VARCHAR(50) NOT NULL,
      studentName VARCHAR(100),
      submittedDate VARCHAR(50),
      fileName VARCHAR(200),
      comments TEXT,
      marks INT DEFAULT NULL,
      feedback TEXT,
      gradedBy VARCHAR(50)
    );

    CREATE TABLE examinations (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      type VARCHAR(50) DEFAULT 'Mid-Term',
      department VARCHAR(100),
      course VARCHAR(100),
      semester VARCHAR(50),
      subjectCode VARCHAR(50),
      subjectName VARCHAR(150),
      assignedTeacherId VARCHAR(50),
      date VARCHAR(50),
      time VARCHAR(50) DEFAULT '10:00 AM - 01:00 PM',
      room VARCHAR(50) DEFAULT 'Main Exam Hall',
      maxMarks INT DEFAULT 100,
      eligibilityAttendance INT DEFAULT 75,
      status VARCHAR(50) DEFAULT 'Marks Pending',
      isPublished BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE internal_marks (
      id VARCHAR(50) PRIMARY KEY,
      examId VARCHAR(50),
      studentId VARCHAR(50) NOT NULL,
      studentName VARCHAR(100),
      subjectCode VARCHAR(50) NOT NULL,
      subjectName VARCHAR(150),
      marksObtained INT DEFAULT 0,
      maxMarks INT DEFAULT 100,
      grade VARCHAR(10) DEFAULT 'A',
      status VARCHAR(50) DEFAULT 'SUBMITTED',
      published BOOLEAN DEFAULT FALSE,
      remarks TEXT
    );

    CREATE TABLE helpdesk_tickets (
      id VARCHAR(50) PRIMARY KEY,
      ticketNumber VARCHAR(50) UNIQUE,
      subject VARCHAR(200) NOT NULL,
      category VARCHAR(100),
      priority VARCHAR(50) DEFAULT 'Medium',
      status VARCHAR(50) DEFAULT 'Open',
      source VARCHAR(50) DEFAULT 'STUDENT',
      targetDesk VARCHAR(100) DEFAULT 'Academic Office',
      studentId VARCHAR(50),
      studentName VARCHAR(100),
      staffId VARCHAR(50),
      staffName VARCHAR(100),
      department VARCHAR(100),
      description TEXT,
      replies JSON,
      date VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE leave_requests (
      id VARCHAR(50) PRIMARY KEY,
      applicantId VARCHAR(50),
      applicantName VARCHAR(100) NOT NULL,
      applicantRole VARCHAR(50) NOT NULL,
      department VARCHAR(100),
      leaveType VARCHAR(50),
      fromDate VARCHAR(50) NOT NULL,
      toDate VARCHAR(50) NOT NULL,
      days INT DEFAULT 1,
      reason TEXT,
      status VARCHAR(50) DEFAULT 'Pending',
      appliedOn VARCHAR(50),
      rejectionReason TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE announcements (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(50) DEFAULT 'General Notice',
      target VARCHAR(50) DEFAULT 'All',
      author VARCHAR(100) DEFAULT 'Administration',
      date VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE notifications (
      id VARCHAR(50) PRIMARY KEY,
      userId VARCHAR(50) NOT NULL,
      userRole VARCHAR(50) DEFAULT 'STUDENT',
      title VARCHAR(200) NOT NULL,
      message TEXT NOT NULL,
      date VARCHAR(50),
      isRead BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE audit_logs (
      id VARCHAR(50) PRIMARY KEY,
      actorId VARCHAR(50) NOT NULL,
      actorRole VARCHAR(50) NOT NULL,
      action VARCHAR(100) NOT NULL,
      entityType VARCHAR(50),
      entityId VARCHAR(50),
      details TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('🌱 Seeding Admins...');
  const adminUsers = INITIAL_USERS.filter(u => u.role === 'ADMIN');
  for (const a of adminUsers) {
    await connection.query(
      `INSERT INTO admins (id, name, email, password, employeeId, designation, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [a.id, a.name, a.email, a.password || 'admin123', a.employeeId, a.designation || 'Super Administrator', 'Active']
    );
  }

  console.log('🌱 Seeding 18 Faculty Members...');
  const staffUsers = INITIAL_USERS.filter(u => u.role === 'TEACHER' || u.role === 'STAFF');
  for (const t of staffUsers) {
    await connection.query(
      `INSERT INTO teachers (id, name, email, password, employeeId, designation, department, qualification, specialization, experience, phone, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        t.id, t.name, t.email, t.password || 'teacher123', t.employeeId,
        t.designation || 'Associate Professor', t.department || 'Computer Science and Engineering',
        t.qualification || 'Ph.D.', t.specialization || 'Engineering', t.experience || '10 Years',
        t.phone || '+91 98765 43210', 'Active'
      ]
    );
  }

  console.log('🌱 Seeding Departments & Degree Programs...');
  for (const d of INITIAL_DEPARTMENTS) {
    await connection.query(
      `INSERT INTO departments (id, code, name, hod, description, totalFaculty, totalStudents, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [d.id, d.code, d.name, d.hod, d.description || '', d.totalFaculty || 12, d.totalStudents || 120, 'Active']
    );
  }

  for (const c of INITIAL_COURSES) {
    await connection.query(
      `INSERT INTO courses (id, code, name, department, duration, fees, type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.id, c.code, c.name, c.department, c.duration || '4 Years', c.fees || '₹1,25,000 / Year', c.type || 'Undergraduate', 'Active']
    );
  }

  console.log('🌱 Seeding 288 Subject Offerings...');
  const generatedOfferings = generateSubjectOfferings();
  for (const sub of generatedOfferings) {
    await connection.query(
      `INSERT INTO subjects (id, code, name, department, departmentCode, semester, year, credits, subjectType, assignedTeacherName, academicYear)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sub.id, sub.code, sub.name, sub.department, sub.departmentCode,
        sub.semester, sub.year, sub.credits, sub.subjectType, sub.assignedTeacherName, '2026-2027'
      ]
    );
  }

  console.log('🌱 Seeding 735 Unique Students...');
  const generatedStus = generateStudents();
  const initialStus = INITIAL_USERS.filter(u => u.role === 'STUDENT');
  const allStudentsToSeed = [...initialStus, ...generatedStus];

  for (const s of allStudentsToSeed) {
    await connection.query(
      `INSERT INTO students (id, name, email, password, studentId, rollNo, registerNumber, department, departmentCode, course, year, semester, section, academicYear, overallAttendance, attendanceNum, gpa, pendingFees, phone, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        s.id, s.name, s.email, s.password || 'student123', s.studentId, s.rollNo || s.studentId,
        s.registerNumber || `REG-${s.studentId}`, s.department || 'Computer Science and Engineering',
        s.departmentCode || 'CSE', s.course || 'B.Tech Computer Science & Engineering',
        s.year || '1st Year', s.semester || 'Semester 1', s.section || 'Sec A',
        s.academicYear || '2026-2027', s.attendancePct || s.overallAttendance || '85%',
        s.attendanceNum || 85, s.gpa || '3.50', s.pendingFees || 0, s.phone || '+91 98765 43210', 'Active'
      ]
    );
  }

  console.log('🌱 Seeding Helpdesk & Announcements...');
  for (const h of INITIAL_HELPDESK) {
    await connection.query(
      `INSERT INTO helpdesk_tickets (id, ticketNumber, subject, category, priority, status, source, targetDesk, studentId, studentName, department, description, replies, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        h.id, h.ticketNumber || h.id, h.subject, h.category || 'General', h.priority || 'Medium',
        h.status || 'Open', h.source || 'STUDENT', h.targetDesk || 'Academic Office',
        h.studentId || null, h.studentName || 'Student', h.department || 'General',
        h.description, JSON.stringify(h.replies || []), h.date || '2026-08-10'
      ]
    );
  }

  for (const an of INITIAL_ANNOUNCEMENTS) {
    await connection.query(
      `INSERT INTO announcements (id, title, content, category, target, author, date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [an.id, an.title, an.content || an.message || '', an.category || 'Notice', an.target || 'All', an.author || 'Admin', an.date || '2026-08-10']
    );
  }

  await connection.query(`SET FOREIGN_KEY_CHECKS = 1;`);

  // Count verification
  const [stdCount] = await connection.query('SELECT COUNT(*) as count FROM students');
  const [subCount] = await connection.query('SELECT COUNT(*) as count FROM subjects');
  const [tchCount] = await connection.query('SELECT COUNT(*) as count FROM teachers');
  const [dptCount] = await connection.query('SELECT COUNT(*) as count FROM departments');

  console.log('===========================================================');
  console.log('🎉 MYSQL DATABASE SEEDING VERIFICATION SUMMARY:');
  console.log(`   Total Students in MySQL:    ${stdCount[0].count}`);
  console.log(`   Total Subjects in MySQL:    ${subCount[0].count}`);
  console.log(`   Total Teachers in MySQL:    ${tchCount[0].count}`);
  console.log(`   Total Departments in MySQL: ${dptCount[0].count}`);
  console.log('===========================================================');

  await connection.end();
}

seedAll().catch(console.error);
