export type Role = 'ROLE_ADMIN' | 'ROLE_TEACHER' | 'ROLE_STUDENT';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  identifier?: string;
  department?: string;
  avatar?: string;
  phone?: string;
  active?: boolean;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  name: string;
  email: string;
  role: Role;
  identifier?: string;
  department?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Student {
  id?: number;
  rollNo: string;
  email: string;
  name: string;
  department: string;
  course: string;
  semester: number;
  section?: string;
  phone?: string;
  gpa?: number;
  attendancePercentage?: number;
  status?: string;
}

export interface Teacher {
  id?: number;
  employeeId: string;
  email: string;
  name: string;
  department: string;
  designation?: string;
  qualification?: string;
  experienceYears?: string;
  phone?: string;
  cabinRoom?: string;
  subjectsHandled?: string;
  status?: string;
}

export interface Department {
  id?: number;
  code: string;
  name: string;
  hod?: string;
  email?: string;
  phone?: string;
  totalFaculty?: number;
  totalStudents?: number;
}

export interface Course {
  id?: number;
  code: string;
  name: string;
  department: string;
  durationYears: number;
  totalSemesters: number;
  annualFee: number;
}

export interface AttendanceRecord {
  id?: number;
  studentRollNo: string;
  studentName?: string;
  department: string;
  subjectCode?: string;
  date?: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave';
  markedBy?: string;
}

export interface Mark {
  id?: number;
  studentRollNo: string;
  studentName?: string;
  examName: string;
  subjectCode: string;
  subjectName?: string;
  marksObtained: number;
  maxMarks: number;
  grade?: string;
}

export interface Assignment {
  id?: number;
  title: string;
  description: string;
  department: string;
  subjectCode: string;
  dueDate: string;
  maxMarks: number;
  teacherName?: string;
}

export interface FeePayment {
  id?: number;
  transactionId?: string;
  studentRollNo: string;
  studentName?: string;
  feeType: string;
  amount: number;
  paymentMethod: string;
  status: string;
  paymentDate?: string;
}
