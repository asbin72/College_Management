const mysql = require('mysql2/promise');

async function trimSubjects() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaa_education_db'
  });

  // Delete 6th subject from each semester (ids ending in -6, e.g. sub-ce-1-6, sub-mba-8-6)
  const [result] = await conn.execute("DELETE FROM subjects WHERE id LIKE '%-6'");
  console.log(`Successfully deleted ${result.affectedRows} 6th subjects from database!`);

  const [countRes] = await conn.execute("SELECT COUNT(*) as total FROM subjects");
  console.log(`Total subjects remaining in database: ${countRes[0].total}`);

  await conn.end();
}

trimSubjects().catch(console.error);
