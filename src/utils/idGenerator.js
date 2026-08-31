/**
 * Dynamic ID and Academic Year Generator Utility
 * Replaces hardcoded year strings with dynamic Date calculations.
 */

export const getCurrentYear = () => new Date().getFullYear();

export const getAcademicYear = (offset = 0) => {
  const year = new Date().getFullYear() + offset;
  return `${year}-${year + 1}`;
};

export const generateRegisterNumber = (deptCode = 'CSE', num) => {
  const currentYear = getCurrentYear();
  const uniqueId = num || Math.floor(1000 + Math.random() * 9000);
  return `REG-${currentYear}-${deptCode}-${uniqueId}`;
};

export const generateTransactionId = () => {
  return `TXN-${getCurrentYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
};

export const generateHallTicketId = () => {
  return `HT-${getCurrentYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

export const generateAppRef = () => {
  return `APP-${getCurrentYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

/**
 * Dynamically computes the real count of enrolled students for a given class assignment.
 * Matches students by department/departmentCode, year, and semester from the live users array.
 */
export function getEnrolledStudentCount(fca, users = []) {
  if (!fca || !Array.isArray(users)) return fca?.studentCount || 0;

  const getSemNum = (s) => (s || '').toString().replace(/\D/g, '');

  const students = users.filter(u => 
    u.role === 'STUDENT' || (u.studentId && String(u.studentId).startsWith('STU')) || u.rollNo || u.registerNumber
  );

  const matched = students.filter(s => {
    const deptMatch = !fca.departmentCode && !fca.departmentName && !fca.department ? true :
      (s.departmentCode && fca.departmentCode && String(s.departmentCode).toUpperCase() === String(fca.departmentCode).toUpperCase()) ||
      (s.department && fca.departmentName && String(s.department).toLowerCase() === String(fca.departmentName).toLowerCase()) ||
      (s.department && fca.department && String(s.department).toLowerCase() === String(fca.department).toLowerCase());

    const yearMatch = !fca.year || !s.year || String(s.year).toLowerCase() === String(fca.year).toLowerCase();

    const fcaSemNum = getSemNum(fca.semester);
    const stuSemNum = getSemNum(s.semester);

    const semMatch = !fcaSemNum || !stuSemNum ? true : fcaSemNum === stuSemNum;

    return deptMatch && yearMatch && semMatch;
  });

  return matched.length;
}

/**
 * Computes real student workload for a given teacher from live facultyClassAssignments and users arrays.
 */
export function getTeacherWorkloadStudentCount(teacherId, teacherName, facultyClassAssignments = [], users = []) {
  const teacherAssignments = (facultyClassAssignments || []).filter(fca => 
    fca.facultyId === teacherId || fca.facultyName === teacherName
  );

  return teacherAssignments.reduce((sum, fca) => sum + getEnrolledStudentCount(fca, users), 0);
}
