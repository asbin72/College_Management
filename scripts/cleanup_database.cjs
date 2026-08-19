const mysql = require('mysql2/promise');

async function cleanupDatabase() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaa_education_db'
  });

  console.log('====================================================');
  console.log('         DATABASE CLEANUP & PURGE UTILITY           ');
  console.log('====================================================\n');

  // 1. Drop unused, unreferenced obsolete tables
  const obsoleteTables = ['exam_schedules', 'hall_tickets', 'request_history', 'exams'];
  for (const tbl of obsoleteTables) {
    try {
      await conn.query(`DROP TABLE IF EXISTS \`${tbl}\``);
      console.log(`🗑️  Dropped unreferenced obsolete table: ${tbl}`);
    } catch (e) {}
  }

  // 2. Clean transient QA test submissions
  try {
    const [subDel] = await conn.query('DELETE FROM assignment_submissions WHERE id LIKE "SUB-178%" OR id LIKE "SUB-TEST%"');
    console.log(`🧹 Purged test assignment submissions: ${subDel.affectedRows} removed`);
  } catch (e) { console.error('subDel error:', e.message); }

  // 3. Clean transient QA test assignments
  try {
    const [asnDel] = await conn.query('DELETE FROM assignments WHERE id LIKE "ASN-178%" OR id LIKE "ASN-TEST%"');
    console.log(`🧹 Purged test assignments: ${asnDel.affectedRows} removed`);
  } catch (e) { console.error('asnDel error:', e.message); }

  // 4. Clean transient QA test notifications
  try {
    const [notifDel] = await conn.query('DELETE FROM notifications WHERE id LIKE "NOTIF-178%" OR id LIKE "NOTIF-TEST%"');
    console.log(`🧹 Purged test notifications: ${notifDel.affectedRows} removed`);
  } catch (e) { console.error('notifDel error:', e.message); }

  // 5. Clean transient QA test leave requests
  try {
    const [leaveDel] = await conn.query('DELETE FROM leave_requests WHERE id LIKE "L-%" AND id NOT IN ("leave-1", "leave-2", "leave-3")');
    console.log(`🧹 Purged test leave requests: ${leaveDel.affectedRows} removed`);
  } catch (e) { console.error('leaveDel error:', e.message); }

  // 6. Clean transient QA test helpdesk tickets
  try {
    const [tktDel] = await conn.query('DELETE FROM helpdesk_tickets WHERE id LIKE "TKT-%" AND id NOT IN ("tkt-1", "tkt-2", "tkt-3")');
    console.log(`🧹 Purged test helpdesk tickets: ${tktDel.affectedRows} removed`);
  } catch (e) { console.error('tktDel error:', e.message); }

  // 7. Clean transient QA test fee payments
  try {
    const [feeDel] = await conn.query('DELETE FROM fee_payments WHERE id LIKE "TXN-FEE-178%" OR id LIKE "TXN-AUTO%"');
    console.log(`🧹 Purged test fee transactions: ${feeDel.affectedRows} removed`);
  } catch (e) { console.error('feeDel error:', e.message); }

  console.log('\n--- Active Tables and Record Counts ---');
  const [tables] = await conn.query('SHOW TABLES');
  for (const t of tables) {
    const tableName = Object.values(t)[0];
    const [countRows] = await conn.query('SELECT COUNT(*) as count FROM `' + tableName + '`');
    console.log(`✅ ${tableName.padEnd(30)}: ${countRows[0].count} records`);
  }

  await conn.end();
  console.log('\n✨ Database cleanup completed successfully!');
}

cleanupDatabase().catch(console.error);
