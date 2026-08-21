/**
 * College Academic Structure and Class Allocation Engine for Kalpanaaa Education
 * Provides deterministic static departments, year groups, semesters, and assignments.
 */

import { INITIAL_USERS, INITIAL_SUBJECTS, INITIAL_DEPARTMENTS } from './initialMockData';

// Real Academic Departments Structure
export const DEPARTMENTS = INITIAL_DEPARTMENTS.map(d => ({
  code: d.code,
  name: d.name,
  course: d.name.includes('Management') ? 'Master of Business Administration (MBA)' : `B.Tech ${d.name}`,
  hod: d.hod,
  icon: d.code === 'CSE' ? 'Cpu' : d.code === 'ISE' ? 'Code' : d.code === 'ECE' ? 'Radio' : d.code === 'EEE' ? 'Zap' : d.code === 'ME' ? 'Cog' : d.code === 'CE' ? 'Building' : 'Briefcase'
}));

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export const SEMESTERS = [
  { sem: 'Semester 1', year: '1st Year' },
  { sem: 'Semester 2', year: '1st Year' },
  { sem: 'Semester 3', year: '2nd Year' },
  { sem: 'Semester 4', year: '2nd Year' },
  { sem: 'Semester 5', year: '3rd Year' },
  { sem: 'Semester 6', year: '3rd Year' },
  { sem: 'Semester 7', year: '4th Year' },
  { sem: 'Semester 8', year: '4th Year' }
];

// Returns real student records from standard database seed
export const generateStudents = () => {
  return INITIAL_USERS.filter(u => u.role === 'STUDENT');
};

// Generates comprehensive subject offerings based on real academic curriculum
export const generateSubjectOfferings = () => {
  return INITIAL_SUBJECTS.map((s, idx) => ({
    id: s.id || `sub-offering-${idx + 1}`,
    code: s.code,
    name: s.name,
    department: s.department,
    departmentCode: s.code.split('-')[0],
    semester: s.semester,
    year: s.semester.includes('1st') || s.semester.includes('2nd') ? '1st Year'
        : s.semester.includes('3rd') || s.semester.includes('4th') ? '2nd Year'
        : s.semester.includes('5th') || s.semester.includes('6th') ? '3rd Year'
        : '4th Year',
    credits: s.credits || 4,
    subjectType: s.subjectType || 'Core Theory',
    academicYear: '2026-2027',
    assignedTeacherId: s.assignedTeacherId,
    assignedTeacherName: s.assignedTeacherName || 'Faculty In-Charge'
  }));
};

// Generates real Faculty Class Assignments linking teachers to their departmental subjects
export const generateFacultyAndAssignments = (offerings = []) => {
  const currentOfferings = offerings.length > 0 ? offerings : generateSubjectOfferings();
  const facultyList = INITIAL_USERS.filter(u => u.role === 'TEACHER' || u.role === 'STAFF');

  const assignments = [];
  let asnIdx = 1;

  currentOfferings.forEach((offering) => {
    // Find matching teacher with safe fallback
    const matchingTeacher = facultyList.find(f => 
      f && (
        (offering.assignedTeacherId && (f.employeeId === offering.assignedTeacherId || f.id === offering.assignedTeacherId)) ||
        (offering.assignedTeacherName && f.name === offering.assignedTeacherName) ||
        (f.department && offering.department && f.department.toLowerCase().includes(offering.department.toLowerCase()))
      )
    ) || facultyList[0] || {
      id: 'EMP-101',
      employeeId: 'EMP-101',
      name: 'Faculty Staff',
      department: offering.department || 'Computer Science and Engineering',
      designation: 'Faculty Member'
    };

    const classId = `CLS-${offering.departmentCode || 'ENG'}-${offering.year ? offering.year.charAt(0) : '1'}-${(offering.semester || 'Sem 1').replace(/\s+/g, '').toUpperCase()}-${(offering.code || 'SUB').replace(/[^a-zA-Z0-9]/g, '')}`;

    const offeringDeptCode = offering.departmentCode || 'CSE';
    const studentsInCohort = INITIAL_USERS.filter(u =>
      u && u.role === 'STUDENT' && (
        !offeringDeptCode || !u.departmentCode || u.departmentCode.toUpperCase() === offeringDeptCode.toUpperCase()
      )
    ).length;

    assignments.push({
      assignmentId: `FAC-ASN-${String(asnIdx++).padStart(3, '0')}`,
      classId,
      facultyId: matchingTeacher.employeeId || matchingTeacher.id || 'EMP-101',
      facultyName: matchingTeacher.name || 'Faculty Staff',
      departmentCode: offeringDeptCode,
      departmentName: offering.department || 'Computer Science and Engineering',
      year: offering.year,
      semester: offering.semester,
      section: 'Sec A',
      subjectCode: offering.code,
      subjectName: offering.name,
      studentCount: studentsInCohort,
      academicYear: '2026-2027',
      assignedDate: '2026-08-01',
      startDate: '2026-08-01',
      endDate: '2026-12-20',
      status: 'ACTIVE'
    });
  });

  return { facultyList, assignments };
};

export const generateFacultyClassAssignments = () => {
  const { assignments } = generateFacultyAndAssignments();
  return assignments;
};

export const generatedStudents = generateStudents();
export const generatedSubjectOfferings = generateSubjectOfferings();
export const generatedAssignments = generateFacultyClassAssignments();
