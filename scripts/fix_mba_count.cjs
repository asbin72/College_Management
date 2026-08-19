const mysql = require('mysql2/promise');

async function fixMbaSubjects() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaa_education_db'
  });

  const [delRes] = await conn.execute(
    "DELETE FROM subjects WHERE department = 'Management Studies' AND (semester LIKE '%5%' OR semester LIKE '%6%' OR semester LIKE '%7%' OR semester LIKE '%8%')"
  );
  console.log(`Pruned ${delRes.affectedRows} excess MBA subjects beyond 4 semesters.`);

  const [mbaRemaining] = await conn.execute(
    "SELECT count(*) as cnt FROM subjects WHERE department = 'Management Studies'"
  );
  console.log('Remaining MBA subjects:', mbaRemaining[0].cnt);

  const [courses] = await conn.execute('SELECT * FROM courses');
  const [subjects] = await conn.execute('SELECT id, code, name, department, semester FROM subjects');

  console.log('\n--- Final Dynamic Subject Counts Per Course ---');
  courses.forEach(c => {
    const normStr = (str) => (str || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');
    const sDeptC = normStr(c.department || c.name);
    const matched = subjects.filter(s => {
      const sDeptS = normStr(s.department);
      return sDeptS === sDeptC || sDeptS.includes(sDeptC) || sDeptC.includes(sDeptS);
    });
    console.log(`${c.name} (${c.code}): ${matched.length} subjects`);
  });

  await conn.end();
}

fixMbaSubjects();
