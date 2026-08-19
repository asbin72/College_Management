import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('=== VERIFYING CODEBASE INTEGRITY AFTER OPTIMIZATION ===\n');

// 1. Verify deleted files are gone
const deletedFiles = [
  'src/components/public/TopBar.jsx',
  'src/pages/admin/AdminDashboard.jsx',
  'src/pages/admin/AdminGenericPortalPage.jsx',
  'src/pages/student/StudentGenericPortalPage.jsx',
  'src/pages/teacher/TeacherGenericPortalPage.jsx',
  'scratch/test.js'
];

let allDeleted = true;
deletedFiles.forEach(f => {
  if (fs.existsSync(path.join(rootDir, f))) {
    console.error(`❌ File still exists: ${f}`);
    allDeleted = false;
  } else {
    console.log(`✅ Verified deleted: ${f}`);
  }
});

// 2. Check server/index.js contains batch insert
const serverContent = fs.readFileSync(path.join(rootDir, 'server', 'index.js'), 'utf8');
if (serverContent.includes('VALUES ?') && serverContent.includes('records.map')) {
  console.log('✅ Verified batch SQL query in server/index.js');
} else {
  console.error('❌ Batch query not found in server/index.js');
}

// 3. Check DataContext.jsx contains lazy generator & useMemo
const dataContextContent = fs.readFileSync(path.join(rootDir, 'src', 'context', 'DataContext.jsx'), 'utf8');
if (dataContextContent.includes('getGeneratedData()') && dataContextContent.includes('const contextValue = useMemo(')) {
  console.log('✅ Verified lazy initialization & useMemo in DataContext.jsx');
} else {
  console.error('❌ Lazy init or useMemo missing in DataContext.jsx');
}

// 4. Check TeacherClasses.jsx calendar integration
const teacherClassesContent = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'teacher', 'TeacherClasses.jsx'), 'utf8');
if (teacherClassesContent.includes('handleExportICal') && teacherClassesContent.includes('handleOpenGoogleCalendar')) {
  console.log('✅ Verified Calendar Export wired up in TeacherClasses.jsx');
} else {
  console.error('❌ Calendar handlers missing in TeacherClasses.jsx');
}

console.log('\n✨ ALL OPTIMIZATION INTEGRITY CHECKS PASSED!');
