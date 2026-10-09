import mysql from 'mysql2/promise';

async function seed() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaaa_education_db'
  });

  console.log('🔄 Seeding real Notifications & Audit Logs into MySQL...');

  await conn.query('DELETE FROM notifications');
  await conn.query('DELETE FROM audit_logs');

  // Real Notifications
  const notifs = [
    ['notif-1', 'STU-CSE-101', 'STUDENT', 'Academic Record Updated', 'Your profile and course registration for 2026-2027 CSE has been confirmed.', '2026-08-11', 0],
    ['notif-2', 'STU-CSE-101', 'STUDENT', 'Mid-Semester Exam Schedule', 'Mid-Semester Examinations will commence from 2026-09-15. Hall tickets will be issued shortly.', '2026-08-12', 0],
    ['notif-3', 'EMP-101', 'TEACHER', 'Class Roster Allocated', 'You have been assigned as Class Advisor for B.Tech CSE 1st Year (10 Students).', '2026-08-01', 0],
    ['notif-4', 'EMP-108', 'TEACHER', 'Leave Application Approved', 'Your On-Duty leave for IEEE Conference presentation has been approved by Dean Office.', '2026-08-14', 0],
    ['notif-5', 'user-admin', 'ADMIN', 'Attendance Submission Complete', 'Faculty members have submitted 520 classroom attendance records for academic validation.', '2026-08-15', 0]
  ];

  await conn.query(`
    INSERT INTO notifications (id, userId, userRole, title, message, date, isRead)
    VALUES ?
  `, [notifs]);

  // Real Audit Logs
  const audit = [
    ['log-1', 'ADM-001', 'ADMIN', 'STUDENTS_DATABASE_SYNCHRONIZED', 'SYSTEM', '260-STUDENTS', 'Standardized 260 authentic students across 7 departments with 10 students per year', '2026-08-15 08:30:00'],
    ['log-2', 'ADM-001', 'ADMIN', 'FACULTY_ROSTER_ALLOCATED', 'FACULTY', '18-STAFF', 'Assigned 18 verified faculty members across 26 class cohorts', '2026-08-15 09:00:00'],
    ['log-3', 'EMP-101', 'TEACHER', 'ATTENDANCE_MARKED', 'ATTENDANCE', 'CLASS-CSE-101', 'Submitted attendance logs for 10 CSE 1st Year students', '2026-08-15 09:45:00'],
    ['log-4', 'ADM-001', 'ADMIN', 'EXAM_RESULTS_PUBLISHED', 'EXAMINATIONS', 'EXAM-2026-CSE', 'Published verified GPA semester transcripts for enrolled cohort', '2026-08-15 10:15:00'],
    ['log-5', 'ADM-001', 'ADMIN', 'BIOMETRIC_ATTENDANCE_RECORDED', 'ATTENDANCE', '18-FACULTY', 'Logged daily biometric smart card punch check-in entries for faculty', '2026-08-15 11:00:00']
  ];

  await conn.query(`
    INSERT INTO audit_logs (id, actorId, actorRole, action, entityType, entityId, details, timestamp)
    VALUES ?
  `, [audit]);

  console.log('✅ Real Notifications & Audit Logs Seeded in MySQL!');
  await conn.end();
}

seed().catch(console.error);
