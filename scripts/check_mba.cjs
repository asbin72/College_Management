const mysql = require('mysql2/promise');

async function checkMba() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaa_education_db'
  });

  const [subjects] = await conn.execute("SELECT semester, count(*) as cnt FROM subjects WHERE department = 'Management Studies' GROUP BY semester ORDER BY semester");
  console.log('MBA Subjects by Semester:', subjects);

  const [btechCS] = await conn.execute("SELECT semester, count(*) as cnt FROM subjects WHERE department = 'Computer Science and Engineering' GROUP BY semester ORDER BY semester");
  console.log('CS Subjects by Semester:', btechCS);

  await conn.end();
}

checkMba();
