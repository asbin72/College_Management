import { DEPARTMENTS, YEARS, SEMESTERS } from '../src/data/collegeDataGenerator.js';
import { INITIAL_USERS } from '../src/data/initialMockData.js';

const teachers = INITIAL_USERS.filter(u => u.role === 'TEACHER');
console.log('Total teachers in INITIAL_USERS:', teachers.length);
teachers.forEach(t => {
  console.log(`- [${t.employeeId}] ${t.name} (${t.department})`);
});
