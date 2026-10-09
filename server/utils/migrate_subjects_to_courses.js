import mysql from 'mysql2/promise';

async function migrate() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'kalpanaa_education_db'
    });

    console.log('🔄 Connected to MySQL kalpanaa_education_db...');
    const [subTables] = await conn.query("SHOW TABLES LIKE 'subjects'");
    const [crsTables] = await conn.query("SHOW TABLES LIKE 'courses'");

    if (subTables.length > 0) {
      if (crsTables.length > 0) {
        await conn.query("DROP TABLE courses");
      }
      await conn.query("ALTER TABLE subjects RENAME TO courses");
      console.log('✅ Successfully renamed database table `subjects` -> `courses`!');
    } else if (crsTables.length === 0) {
      // Create courses table if neither exists
      await conn.query(`
        CREATE TABLE courses (
          id VARCHAR(100) PRIMARY KEY,
          code VARCHAR(50) NOT NULL,
          name VARCHAR(255) NOT NULL,
          department VARCHAR(100) NOT NULL,
          departmentCode VARCHAR(20),
          semester VARCHAR(50),
          year VARCHAR(50),
          credits INT DEFAULT 4,
          courseType VARCHAR(50) DEFAULT 'Core Theory',
          assignedTeacherName VARCHAR(100),
          academicYear VARCHAR(50) DEFAULT '2026-2027',
          status VARCHAR(50) DEFAULT 'Active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Created table `courses` in database.');
    } else {
      console.log('ℹ️ Table `courses` already exists in database.');
    }

    const [rows] = await conn.query("SELECT COUNT(*) as count FROM courses");
    console.log(`📊 Courses count in database: ${rows[0].count}`);

    await conn.end();
  } catch (err) {
    console.error('❌ Migration Error:', err.message);
  }
}

migrate();
