const mysql = require('mysql2/promise');

async function seedMba() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaa_education_db'
  });

  const [existing] = await conn.execute("SELECT id FROM subjects WHERE departmentCode = 'MBA'");
  if (existing.length === 0) {
    const mbaSubjects = [
      'Financial Accounting', 'Managerial Economics', 'Organizational Behavior', 'Marketing Management', 'Business Communication', 'Quantitative Techniques',
      'Financial Management', 'Human Resource Management', 'Operations Management', 'Business Research Methods', 'Corporate Law & Governance', 'IT for Managers',
      'Strategic Management', 'Corporate Finance', 'Digital Marketing', 'Supply Chain Management', 'Business Analytics', 'Consumer Behavior',
      'International Business', 'Project Management', 'Enterprise Risk Management', 'Leadership & Ethics', 'Investment Analysis', 'Services Marketing',
      'Strategic HR Management', 'Logistics & Distribution', 'Data Science for Business', 'Brand Management', 'Mergers & Acquisitions', 'Sales & Distribution',
      'Talent Management', 'Global Supply Chain', 'Predictive Business Modeling', 'Retail Management', 'Derivatives & Risk', 'B2B Marketing',
      'Strategic Change Management', 'Operations Strategy', 'Financial FinTech Analytics', 'Product Management', 'Corporate Entrepreneurship', 'Cross Cultural Management',
      'International Finance', 'Strategic Innovation', 'AI in Business Strategy', 'Sustainable Business Models', 'Capstone Management Project I', 'Industry Internship & Thesis'
    ];

    for (let sem = 1; sem <= 8; sem++) {
      for (let s = 1; s <= 6; s++) {
        const subIndex = (sem - 1) * 6 + (s - 1);
        const name = mbaSubjects[subIndex] || `MBA Elective ${subIndex}`;
        const id = `sub-mba-${sem}-${s}`;
        const code = `MBA-${sem}0${s}`;
        const credits = s === 6 ? 4 : 3;
        const type = s === 6 ? 'Project' : 'Core Theory';
        const year = sem <= 2 ? '1st Year' : (sem <= 4 ? '2nd Year' : (sem <= 6 ? '3rd Year' : '4th Year'));

        await conn.execute(
          `INSERT INTO subjects (id, code, name, department, departmentCode, semester, year, credits, subjectType, assignedTeacherName, academicYear) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, code, name, 'Management Studies', 'MBA', `Semester ${sem}`, year, credits, type, 'Dr. Brijesh Malhotra', '2026-2027']
        );
      }
    }
    console.log('Successfully inserted 48 MBA subjects into database!');
  } else {
    console.log(`MBA subjects already exist: ${existing.length}`);
  }

  await conn.end();
}

seedMba().catch(console.error);
