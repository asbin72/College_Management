// Official Institutional Data for Kalpanaaa Education
// 100% Real-Time Synchronized with MySQL Database

export const INITIAL_USERS = [
  {
    id: "user-admin",
    name: "Administrator",
    email: "admin@kalpanaaa.edu",
    username: "admin",
    password: "admin123",
    role: "ADMIN",
    employeeId: "ADM-001",
    designation: "Super Administrator & Dean",
    status: "Active",
    createdAt: "2026-01-01"
  },
  {
    id: "user-admin-2",
    name: "Registrar Office",
    email: "registrar@kalpanaaa.edu",
    username: "ADM-002",
    password: "admin123",
    role: "ADMIN",
    employeeId: "ADM-002",
    designation: "University Registrar",
    status: "Active",
    createdAt: "2026-01-05"
  }
];

export const INITIAL_DEPARTMENTS = [
  { id: 'dept-1', name: 'Computer Science & Engineering', code: 'CSE', hod: 'Unassigned', totalFaculty: 0, totalStudents: 0, status: 'Active' },
  { id: 'dept-2', name: 'Information Science & Engineering', code: 'ISE', hod: 'Unassigned', totalFaculty: 0, totalStudents: 0, status: 'Active' },
  { id: 'dept-3', name: 'Electronics & Communication Engineering', code: 'ECE', hod: 'Unassigned', totalFaculty: 0, totalStudents: 0, status: 'Active' },
  { id: 'dept-4', name: 'Electrical & Electronics Engineering', code: 'EEE', hod: 'Unassigned', totalFaculty: 0, totalStudents: 0, status: 'Active' },
  { id: 'dept-5', name: 'Mechanical Engineering', code: 'ME', hod: 'Unassigned', totalFaculty: 0, totalStudents: 0, status: 'Active' },
  { id: 'dept-6', name: 'Civil & Environmental Engineering', code: 'CE', hod: 'Unassigned', totalFaculty: 0, totalStudents: 0, status: 'Active' },
  { id: 'dept-7', name: 'Management Studies', code: 'MBA', hod: 'Unassigned', totalFaculty: 0, totalStudents: 0, status: 'Active' }
];

export const INITIAL_STUDENTS = [];
export const INITIAL_TEACHERS = [];
export const INITIAL_COURSES = [];
export const INITIAL_SUBJECTS = [];
export const INITIAL_ANNOUNCEMENTS = [];
export const INITIAL_HELPDESK = [];
export const INITIAL_LEAVE_REQUESTS = [];
export const INITIAL_EXAMINATIONS = [];
export const INITIAL_FEES = [];
export const INITIAL_AUDIT_LOGS = [];
export const INITIAL_STUDENT_REQUESTS = [];
export const INITIAL_CLASSES = [];
export const INITIAL_ACADEMIC_TERMS = ['2026-2027', '2025-2026'];
export const INITIAL_NEWS = [];
export const INITIAL_EVENTS = [];
export const INITIAL_ATTENDANCE = [];
export const INITIAL_ASSIGNMENTS = [];
export const INITIAL_RESULTS = [];
export const INITIAL_MARKS = [];
