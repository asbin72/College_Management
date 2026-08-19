import fs from 'fs';
import path from 'path';

// Let's test the generator logic
import { DEPARTMENTS, YEARS, SEMESTERS, generateSubjectOfferings } from '../src/data/collegeDataGenerator.js';

const allOfferings = generateSubjectOfferings();

const facultyList = [
  // CSE
  { id: "user-teacher-1", name: "Dr. Rajesh Sharma", employeeId: "EMP-101", role: "TEACHER", department: "Computer Science and Engineering", departmentCode: "CSE", designation: "Professor & HOD", status: "Active" },
  { id: "user-teacher-8", name: "Prof. Amit Verma", employeeId: "EMP-108", role: "TEACHER", department: "Computer Science and Engineering", departmentCode: "CSE", designation: "Assistant Professor", status: "Active" },
  { id: "user-teacher-11", name: "Prof. Nidhi Agarwal", employeeId: "EMP-111", role: "TEACHER", department: "Computer Science and Engineering", departmentCode: "CSE", designation: "Assistant Professor", status: "Active" },
  { id: "user-teacher-18", name: "Dr. Arvind Mukhopadhyay", employeeId: "EMP-118", role: "TEACHER", department: "Computer Science and Engineering", departmentCode: "CSE", designation: "Professor & Dean Research", status: "Active" },

  // ISE
  { id: "user-teacher-2", name: "Prof. Sunita Reddy", employeeId: "EMP-102", role: "TEACHER", department: "Information Science and Engineering", departmentCode: "ISE", designation: "Associate Professor & HOD", status: "Active" },
  { id: "user-teacher-9", name: "Prof. Preeti Kulkarni", employeeId: "EMP-109", role: "TEACHER", department: "Information Science and Engineering", departmentCode: "ISE", designation: "Assistant Professor", status: "Active" },
  { id: "user-teacher-12", name: "Dr. Alok Banerjee", employeeId: "EMP-112", role: "TEACHER", department: "Information Science and Engineering", departmentCode: "ISE", designation: "Associate Professor", status: "Active" },

  // ECE
  { id: "user-teacher-3", name: "Dr. Suresh Kumar", employeeId: "EMP-103", role: "TEACHER", department: "Electronics and Communication Engineering", departmentCode: "ECE", designation: "Professor & HOD", status: "Active" },
  { id: "user-teacher-14", name: "Dr. Harish Nambiar", employeeId: "EMP-114", role: "TEACHER", department: "Electronics and Communication Engineering", departmentCode: "ECE", designation: "Associate Professor", status: "Active" },

  // EEE
  { id: "user-teacher-4", name: "Prof. Ramesh Rao", employeeId: "EMP-104", role: "TEACHER", department: "Electrical and Electronics Engineering", departmentCode: "EEE", designation: "Associate Professor & HOD", status: "Active" },
  { id: "user-teacher-15", name: "Prof. Vandana Joshi", employeeId: "EMP-115", role: "TEACHER", department: "Electrical and Electronics Engineering", departmentCode: "EEE", designation: "Assistant Professor", status: "Active" },

  // ME
  { id: "user-teacher-5", name: "Dr. Vikramaditya Singh", employeeId: "EMP-105", role: "TEACHER", department: "Mechanical Engineering", departmentCode: "ME", designation: "Professor & HOD", status: "Active" },
  { id: "user-teacher-16", name: "Dr. Chetan Gokhale", employeeId: "EMP-116", role: "TEACHER", department: "Mechanical Engineering", departmentCode: "ME", designation: "Associate Professor", status: "Active" },

  // CE
  { id: "user-teacher-6", name: "Dr. Meenakshi Sundaram", employeeId: "EMP-106", role: "TEACHER", department: "Civil Engineering", departmentCode: "CE", designation: "Professor & HOD", status: "Active" },
  { id: "user-teacher-17", name: "Prof. Smita Hegde", employeeId: "EMP-117", role: "TEACHER", department: "Civil Engineering", departmentCode: "CE", designation: "Assistant Professor", status: "Active" },

  // Management Studies
  { id: "user-teacher-7", name: "Dr. Brijesh Malhotra", employeeId: "EMP-107", role: "TEACHER", department: "Management Studies", departmentCode: "MBA", designation: "Professor & HOD Management", status: "Active" },
  { id: "user-teacher-10", name: "Dr. Sanjay Bhattacharya", employeeId: "EMP-110", role: "TEACHER", department: "Management Studies", departmentCode: "MBA", designation: "Professor", status: "Active" },
  { id: "user-teacher-13", name: "Prof. Rashmi Deshpande", employeeId: "EMP-113", role: "TEACHER", department: "Management Studies", departmentCode: "MBA", designation: "Assistant Professor", status: "Active" }
];

// Group teachers by department code
const teachersByDept = {};
facultyList.forEach(t => {
  if (!teachersByDept[t.departmentCode]) teachersByDept[t.departmentCode] = [];
  teachersByDept[t.departmentCode].push(t);
});

const assignments = [];
let asnCounter = 1;

allOfferings.forEach((offering, idx) => {
  const deptTeachers = teachersByDept[offering.departmentCode] || teachersByDept['CSE'];
  const semNum = parseInt(offering.semester.replace(/\D/g, '') || '1');
  const teacherIndex = (semNum + idx) % deptTeachers.length;
  const assignedTeacher = deptTeachers[teacherIndex];

  const classId = `CLS-${offering.departmentCode}-${offering.year.charAt(0)}-${offering.semester.replace(/\s+/g, '').toUpperCase()}-${offering.code.replace(/[^a-zA-Z0-9]/g, '')}`;

  assignments.push({
    assignmentId: `FAC-ASN-${String(asnCounter++).padStart(3, '0')}`,
    classId,
    facultyId: assignedTeacher.employeeId,
    facultyName: assignedTeacher.name,
    departmentCode: offering.departmentCode,
    departmentName: offering.department,
    year: offering.year,
    semester: offering.semester,
    section: 'Sec A',
    subjectCode: offering.code,
    subjectName: offering.name,
    studentCount: 30,
    academicYear: '2026-2027',
    assignedDate: '2026-08-01',
    startDate: '2026-08-01',
    endDate: '2026-12-20',
    status: 'ACTIVE'
  });
});

// Also add Management Studies assignments
const mbaOfferings = [
  { code: 'MBA-101', name: 'Principles of Management & Organizational Behavior', semester: 'Semester 1', year: '1st Year' },
  { code: 'MBA-102', name: 'Managerial Economics', semester: 'Semester 1', year: '1st Year' },
  { code: 'MBA-201', name: 'Corporate Financial Management', semester: 'Semester 2', year: '1st Year' },
  { code: 'MBA-202', name: 'Human Resource Management', semester: 'Semester 2', year: '1st Year' },
  { code: 'MBA-301', name: 'Strategic Enterprise Management', semester: 'Semester 3', year: '2nd Year' },
  { code: 'MBA-401', name: 'International Business Strategy', semester: 'Semester 4', year: '2nd Year' }
];

const mbaTeachers = teachersByDept['MBA'];
mbaOfferings.forEach((offering, idx) => {
  const assignedTeacher = mbaTeachers[idx % mbaTeachers.length];
  const classId = `CLS-MBA-${offering.year.charAt(0)}-${offering.semester.replace(/\s+/g, '').toUpperCase()}-${offering.code}`;
  assignments.push({
    assignmentId: `FAC-ASN-${String(asnCounter++).padStart(3, '0')}`,
    classId,
    facultyId: assignedTeacher.employeeId,
    facultyName: assignedTeacher.name,
    departmentCode: 'MBA',
    departmentName: 'Management Studies',
    year: offering.year,
    semester: offering.semester,
    section: 'Sec A',
    subjectCode: offering.code,
    subjectName: offering.name,
    studentCount: 30,
    academicYear: '2026-2027',
    assignedDate: '2026-08-01',
    startDate: '2026-08-01',
    endDate: '2026-12-20',
    status: 'ACTIVE'
  });
});

console.log(`Total assignments created: ${assignments.length}`);
facultyList.forEach(f => {
  const asns = assignments.filter(a => a.facultyId === f.employeeId);
  console.log(`- ${f.name} [${f.employeeId}] (${f.departmentCode}): ${asns.length} classes assigned (${asns.length * 30} students)`);
});
