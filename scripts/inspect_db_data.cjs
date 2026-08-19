const mysql = require('mysql2/promise');

async function checkDatabase() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaa_education_db'
  });

  const [tables] = await conn.query('SHOW TABLES');
  console.log('--- Current Tables in kalpanaa_education_db ---');
  
  for (const t of tables) {
    const tableName = Object.values(t)[0];
    const [countRows] = await conn.query('SELECT COUNT(*) as count FROM `' + tableName + '`');
    console.log(`${tableName.padEnd(30)}: ${countRows[0].count} records`);
  }

  // Check for test records generated during QA tests
  console.log('\n--- Checking for test records in operational tables ---');
  const [testAssignments] = await conn.query('SELECT id, title FROM assignments WHERE id LIKE "ASN-%"');
  console.log(`Test Assignments generated: ${testAssignments.length}`);
  
  const [testFees] = await conn.query('SELECT id, txnId FROM fee_payments WHERE txnId LIKE "TXN-FEE-%"');
  console.log(`Test Fee Payments generated: ${testFees.length}`);

  const [testTickets] = await conn.query('SELECT id, subject FROM helpdesk_tickets WHERE id LIKE "TKT-%"');
  console.log(`Test Helpdesk Tickets generated: ${testTickets.length}`);

  const [testLeaves] = await conn.query('SELECT id, reason FROM leave_requests WHERE id LIKE "L-%"');
  console.log(`Test Leave Requests generated: ${testLeaves.length}`);

  const [testNotifs] = await conn.query('SELECT id, title FROM notifications WHERE id LIKE "NOTIF-%"');
  console.log(`Test Notifications generated: ${testNotifs.length}`);

  await conn.end();
}

checkDatabase().catch(console.error);
