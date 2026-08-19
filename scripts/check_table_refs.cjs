const fs = require('fs');

const serverContent = fs.readFileSync('server/index.js', 'utf8');

const candidateTables = [
  'exam_schedules',
  'hall_tickets',
  'request_history',
  'requests',
  'exams',
  'attendance'
];

console.log('--- Checking table references in server/index.js ---');
candidateTables.forEach(tbl => {
  const matches = (serverContent.match(new RegExp('\\b' + tbl + '\\b', 'g')) || []).length;
  console.log(`Table '${tbl}': referenced ${matches} times in server/index.js`);
});
