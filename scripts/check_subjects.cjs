const mysql = require('mysql2/promise');

async function checkSubjects() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaa_education_db'
  });

  const [courses] = await conn.execute('SELECT * FROM courses');
  const [subjects] = await conn.execute('SELECT id, code, name, department, semester FROM subjects');

  console.log('Total subjects in DB:', subjects.length);
  console.log('\n--- Subjects per Course ---');

  courses.forEach(c => {
    const cPrefix = (c.code || '').split('-')[0].toUpperCase().trim();
    const matched = subjects.filter(s => {
      const sPrefix = (s.code || '').split('-')[0].toUpperCase().trim();
      if (sPrefix === 'CS' && (cPrefix === 'CS' || cPrefix === 'CSE')) return true;
      if (sPrefix === 'IS' && (cPrefix === 'IS' || cPrefix === 'ISE')) return true;
      if (sPrefix === 'EC' && (cPrefix === 'EC' || cPrefix === 'ECE')) return true;
      if (sPrefix === 'EE' && (cPrefix === 'EE' || cPrefix === 'EEE')) return true;
      if (sPrefix === 'ME' && cPrefix === 'ME') return true;
      if (sPrefix === 'CE' && cPrefix === 'CE') return true;
      if (sPrefix === 'MBA' && cPrefix === 'MBA') return true;
      return false;
    });
    console.log(`${c.name} (${c.code}): ${matched.length} subjects`);
  });

  await conn.end();
}

checkSubjects();
