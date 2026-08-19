const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/pages/admin/AdminAnalytics.jsx',
  'src/pages/admin/AdminControl.jsx',
  'src/pages/admin/AdminCourses.jsx',
  'src/pages/admin/AdminExams.jsx',
  'src/pages/admin/AdminLeave.jsx',
  'src/pages/admin/AdminStudents.jsx',
  'src/pages/admin/AdminSubjects.jsx',
  'src/pages/admin/AdminTeachers.jsx',
  'src/pages/student/StudentLeave.jsx',
  'src/pages/student/StudentResults.jsx',
  'src/pages/teacher/TeacherClassDetail.jsx',
  'src/pages/teacher/TeacherHelpdesk.jsx',
  'src/pages/teacher/TeacherLeave.jsx',
  'src/pages/teacher/TeacherMarks.jsx'
];

console.log('Fixing mobile drawer state across portal pages...');

targetFiles.forEach(relPath => {
  const filePath = path.resolve(relPath);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${relPath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Ensure useState is imported
  if (!content.includes('useState')) {
    content = content.replace(/import React/, 'import React, { useState }');
    changed = true;
  }

  // 2. Add mobileOpen state inside component function if missing
  if (!content.includes('mobileOpen')) {
    // Find the start of the component function
    content = content.replace(
      /(export const \w+\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?)(const\s+|if\s*\(!currentUser\))/,
      '$1const [mobileOpen, setMobileOpen] = useState(false);\n  $2'
    );
    changed = true;
  }

  // 3. Replace <Sidebar /> with <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
  if (content.includes('<Sidebar />')) {
    content = content.replace(/<Sidebar \/>/g, '<Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />');
    changed = true;
  }

  // 4. Replace <PortalHeader /> with <PortalHeader setMobileOpen={setMobileOpen} />
  if (content.includes('<PortalHeader />')) {
    content = content.replace(/<PortalHeader \/>/g, '<PortalHeader setMobileOpen={setMobileOpen} />');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Patched mobile drawer support in: ${relPath}`);
  }
});

console.log('All targeted pages updated.');
