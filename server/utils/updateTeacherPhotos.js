import mysql from 'mysql2/promise';

const teacherPhotoMap = {
  'EMP-101': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', // Dr. Rajesh Sharma
  'EMP-102': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', // Prof. Sunita Reddy
  'EMP-103': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', // Dr. Suresh Kumar
  'EMP-104': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400', // Prof. Ramesh Rao
  'EMP-105': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400', // Dr. Vikramaditya Singh
  'EMP-106': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400', // Dr. Meenakshi Sundaram
  'EMP-107': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400', // Dr. Brijesh Malhotra
  'EMP-108': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400', // Prof. Amit Verma
  'EMP-109': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400', // Prof. Preeti Kulkarni
  'EMP-110': 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=400', // Dr. Sanjay Bhattacharya
  'EMP-111': 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400', // Prof. Nidhi Agarwal
  'EMP-112': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400', // Dr. Alok Banerjee
  'EMP-113': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400', // Prof. Rashmi Deshpande
  'EMP-114': 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400', // Dr. Harish Nambiar
  'EMP-115': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', // Prof. Vandana Joshi
  'EMP-116': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400', // Dr. Chetan Gokhale
  'EMP-117': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400', // Prof. Smita Hegde
  'EMP-118': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400'  // Dr. Arvind Mukhopadhyay
};

async function updateStaffPhotos() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kalpanaaa_education_db'
  });

  console.log('Connected to MySQL. Updating distinct faculty profile pictures...');

  const [teachers] = await conn.query('SELECT id, employeeId, name FROM teachers');
  console.log(`Found ${teachers.length} faculty members.`);

  for (const t of teachers) {
    const photo = teacherPhotoMap[t.employeeId] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400';
    await conn.query('UPDATE teachers SET photoUrl = ?, avatar = ? WHERE id = ? OR employeeId = ?', [photo, photo, t.id, t.employeeId]);
    await conn.query('UPDATE users SET employeeId = ? WHERE id = ?', [t.employeeId, t.id]).catch(() => {});
    console.log(`✓ Updated ${t.name} (${t.employeeId})`);
  }

  console.log('✓ Successfully assigned distinct professional photos to all staff members!');
  await conn.end();
}

updateStaffPhotos().catch(console.error);
