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
  { id: 'dept-1', name: 'Computer Science & Engineering', code: 'CSE', hod: 'Dr. Rajesh Sharma', email: 'hod.cse@kalpanaaa.edu', phone: '+91 98765 43210', totalFaculty: 24, totalStudents: 480, status: 'Active', description: 'Pioneering research in Artificial Intelligence, Neural Networks, Cyber Security, and Cloud Architecture.' },
  { id: 'dept-2', name: 'Information Science & Engineering', code: 'ISE', hod: 'Prof. Sunita Reddy', email: 'hod.ise@kalpanaaa.edu', phone: '+91 98765 43211', totalFaculty: 18, totalStudents: 360, status: 'Active', description: 'Specialized in Cloud Infrastructure, DevOps Engineering, Big Data Analytics, and Web Systems.' },
  { id: 'dept-3', name: 'Electronics & Communication Engineering', code: 'ECE', hod: 'Dr. Suresh Kumar', email: 'hod.ece@kalpanaaa.edu', phone: '+91 98765 43212', totalFaculty: 20, totalStudents: 360, status: 'Active', description: 'Advanced research in VLSI microchip design, 5G RF wireless communications, and Embedded IoT systems.' },
  { id: 'dept-4', name: 'Electrical & Electronics Engineering', code: 'EEE', hod: 'Prof. Ramesh Rao', email: 'hod.eee@kalpanaaa.edu', phone: '+91 98765 43213', totalFaculty: 16, totalStudents: 240, status: 'Active', description: 'Smart grid technologies, renewable solar/wind energy integration, power electronics, and EV motor drives.' },
  { id: 'dept-5', name: 'Mechanical Engineering', code: 'ME', hod: 'Dr. Vikramaditya Singh', email: 'hod.me@kalpanaaa.edu', phone: '+91 98765 43214', totalFaculty: 18, totalStudents: 240, status: 'Active', description: 'Robotics and industrial automation, additive manufacturing, CAD/CAM prototyping, and thermal systems.' },
  { id: 'dept-6', name: 'Civil & Environmental Engineering', code: 'CE', hod: 'Dr. Meenakshi Sundaram', email: 'hod.ce@kalpanaaa.edu', phone: '+91 98765 43215', totalFaculty: 16, totalStudents: 240, status: 'Active', description: 'Sustainable smart city infrastructure, structural BIM analysis, seismic engineering, and environmental stewardship.' },
  { id: 'dept-7', name: 'Management Studies', code: 'MBA', hod: 'Dr. Brijesh Malhotra', email: 'hod.mba@kalpanaaa.edu', phone: '+91 98765 43216', totalFaculty: 14, totalStudents: 180, status: 'Active', description: 'Excellence in Strategic Management, Corporate Finance, Business Analytics, and Global Leadership.' }
];

export const INITIAL_STUDENTS = [];
export const INITIAL_TEACHERS = [];
export const INITIAL_SUBJECTS = [
  // Computer Science & Engineering (CSE)
  { id: "sub-cse-101", code: "CSE-101", name: "C Programming & Problem Solving", department: "Computer Science & Engineering", departmentCode: "CSE", semester: "Semester 1", credits: 4, subjectType: "Core Theory" },
  { id: "sub-cse-201", code: "CSE-201", name: "Data Structures & Algorithms", department: "Computer Science & Engineering", departmentCode: "CSE", semester: "Semester 2", credits: 4, subjectType: "Core Lab Included" },
  { id: "sub-cse-301", code: "CSE-301", name: "Database Management Systems (DBMS)", department: "Computer Science & Engineering", departmentCode: "CSE", semester: "Semester 3", credits: 4, subjectType: "Core Theory" },
  { id: "sub-cse-401", code: "CSE-401", name: "Operating Systems & Kernel Design", department: "Computer Science & Engineering", departmentCode: "CSE", semester: "Semester 4", credits: 4, subjectType: "Core Theory" },
  { id: "sub-cse-501", code: "CSE-501", name: "Full-Stack Web Engineering", department: "Computer Science & Engineering", departmentCode: "CSE", semester: "Semester 5", credits: 4, subjectType: "Core Lab Included" },
  { id: "sub-cse-601", code: "CSE-601", name: "Artificial Intelligence & Machine Learning", department: "Computer Science & Engineering", departmentCode: "CSE", semester: "Semester 6", credits: 4, subjectType: "Core Theory" },

  // Information Science & Engineering (ISE)
  { id: "sub-ise-101", code: "ISE-101", name: "Python Programming for Data Science", department: "Information Science & Engineering", departmentCode: "ISE", semester: "Semester 1", credits: 4, subjectType: "Core Theory" },
  { id: "sub-ise-201", code: "ISE-201", name: "Data Analytics & Data Mining", department: "Information Science & Engineering", departmentCode: "ISE", semester: "Semester 2", credits: 4, subjectType: "Core Theory" },
  { id: "sub-ise-301", code: "ISE-301", name: "Cloud Computing Architecture", department: "Information Science & Engineering", departmentCode: "ISE", semester: "Semester 3", credits: 4, subjectType: "Core Theory" },
  { id: "sub-ise-401", code: "ISE-401", name: "Cyber Security & Cryptography", department: "Information Science & Engineering", departmentCode: "ISE", semester: "Semester 4", credits: 4, subjectType: "Core Theory" },

  // Electronics & Communication Engineering (ECE)
  { id: "sub-ece-101", code: "ECE-101", name: "Digital Signal Processing (DSP)", department: "Electronics & Communication Engineering", departmentCode: "ECE", semester: "Semester 1", credits: 4, subjectType: "Core Theory" },
  { id: "sub-ece-201", code: "ECE-201", name: "VLSI Microchip Design & Verilog", department: "Electronics & Communication Engineering", departmentCode: "ECE", semester: "Semester 2", credits: 4, subjectType: "Core Theory" },
  { id: "sub-ece-301", code: "ECE-301", name: "Embedded Systems & IoT Hardware", department: "Electronics & Communication Engineering", departmentCode: "ECE", semester: "Semester 3", credits: 4, subjectType: "Core Lab Included" },

  // Electrical & Electronics Engineering (EEE)
  { id: "sub-eee-101", code: "EEE-101", name: "Power Systems & Smart Grids", department: "Electrical & Electronics Engineering", departmentCode: "EEE", semester: "Semester 1", credits: 4, subjectType: "Core Theory" },
  { id: "sub-eee-201", code: "EEE-201", name: "Electric Vehicle Technology & Batteries", department: "Electrical & Electronics Engineering", departmentCode: "EEE", semester: "Semester 2", credits: 4, subjectType: "Core Theory" },

  // Mechanical Engineering (ME)
  { id: "sub-me-101", code: "ME-101", name: "Thermodynamics & Heat Transfer", department: "Mechanical Engineering", departmentCode: "ME", semester: "Semester 1", credits: 4, subjectType: "Core Theory" },
  { id: "sub-me-201", code: "ME-201", name: "Robotics & Industrial Automation", department: "Mechanical Engineering", departmentCode: "ME", semester: "Semester 2", credits: 4, subjectType: "Core Theory" },

  // Civil & Environmental Engineering (CE)
  { id: "sub-ce-101", code: "CE-101", name: "Structural Analysis & Steel Design", department: "Civil & Environmental Engineering", departmentCode: "CE", semester: "Semester 1", credits: 4, subjectType: "Core Theory" },
  { id: "sub-ce-201", code: "CE-201", name: "Surveying & GIS Mapping", department: "Civil & Environmental Engineering", departmentCode: "CE", semester: "Semester 2", credits: 4, subjectType: "Core Theory" },

  // Management Studies (MBA)
  { id: "sub-mba-101", code: "MBA-101", name: "Corporate Finance & Investment Banking", department: "Management Studies", departmentCode: "MBA", semester: "Semester 1", credits: 4, subjectType: "Core Theory" },
  { id: "sub-mba-201", code: "MBA-201", name: "Financial Modeling & Bloomberg BMC", department: "Management Studies", departmentCode: "MBA", semester: "Semester 2", credits: 4, subjectType: "Core Practical" }
];
export const INITIAL_COURSES = INITIAL_SUBJECTS;
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
