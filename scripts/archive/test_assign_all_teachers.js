import { generateStudents, generateSubjectOfferings, DEPARTMENTS } from '../src/data/collegeDataGenerator.js';
import { INITIAL_USERS } from '../src/data/initialMockData.js';

const offerings = generateSubjectOfferings();
const teachers = INITIAL_USERS.filter(u => u.role === 'TEACHER');

const deptCodeMap = {
  'Computer Science and Engineering': 'CSE',
  'Information Science and Engineering': 'ISE',
  'Electronics and Communication Engineering': 'ECE',
  'Electrical and Electronics Engineering': 'EEE',
  'Mechanical Engineering': 'ME',
  'Civil Engineering': 'CE',
  'Management Studies': 'MBA'
};

const assignments = [];
let asnIdx = 1;

// Group teachers by department
const teachersByDept = {};
teachers.forEach(t => {
  const code = deptCodeMap[t.department] || 'CSE';
  if (!teachersByDept[code]) teachersByDept[code] = [];
  teachersByDept[code].push(t);
});

// For each department offering, assign to a faculty in that department in round-robin fashion
offerings.forEach(offering => {
  const deptTeachers = teachersByDept[offering.departmentCode] || teachersByDept['CSE'];
  if (deptTeachers && deptTeachers.length > 0) {
    const semNum = parseInt(offering.semester.replace(/\D/g, '') || '1');
    const teacherIndex = (semNum + offering.code.charCodeAt(offering.code.length - 1)) % deptTeachers.length;
    const assignedTeacher = deptTeachers[teacherIndex];

    const classId = `CLS-${offering.departmentCode}-${offering.year.charAt(0)}-${offering.semester.replace(/\s+/g, '').toUpperCase()}-${offering.code.replace(/[^a-zA-Z0-9]/g, '')}`;

    assignments.push({
      assignmentId: `FAC-ASN-${String(asnIdx++).padStart(3, '0')}`,
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
      academicYear: '2026-2027',
      studentCount: 30,
      assignedDate: '2026-08-01',
      startDate: '2026-08-01',
      endDate: '2026-12-20',
      status: 'ACTIVE'
    });
  }
});

console.log(`Generated ${assignments.length} assignments across all ${teachers.length} teachers.`);

// Check per teacher assignment counts
teachers.forEach(t => {
  const myAsns = assignments.filter(a => a.facultyId === t.employeeId);
  console.log(`- Teacher [${t.employeeId}] ${t.name} (${t.department}): ${myAsns.length} classes assigned (${myAsns.length * 30} students)`);
  if (myAsns.length > 0) {
    console.log(`    Sample Class: ${myAsns[0].subjectCode} - ${myAsns[0].subjectName} (${myAsns[0].year}, ${myAsns[0].semester})`);
  }
});
