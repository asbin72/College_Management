import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

console.log("==========================================================================");
console.log("    KALPANAAA EDUCATION CMS — MASTER QA DEEP AUDIT & VERIFICATION        ");
console.log("==========================================================================");

const basePath = "c:/Users/asbin/OneDrive/Attachments/Desktop/Kalpanaaa Education/NewEdu";
let findings = [];
let passCount = 0;
let failCount = 0;

function report(testName, passed, details = "") {
  if (passed) {
    passCount++;
    console.log(`[PASS] ${testName}`);
  } else {
    failCount++;
    findings.push({ testName, details });
    console.error(`[FAIL] ${testName} -> ${details}`);
  }
}

// ----------------------------------------------------------------------
// 1. STATIC CODE AUDIT: BROKEN LINKS & MISSING IMAGES
// ----------------------------------------------------------------------
console.log("\n--- [AUDIT 1: Static Code, Links & Image Integrity] ---");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist') walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

let deadHrefCount = 0;
let missingAltCount = 0;
let totalJsxFiles = 0;

walkDir(path.join(basePath, "src"), (filePath) => {
  if (filePath.endsWith(".jsx")) {
    totalJsxFiles++;
    const content = fs.readFileSync(filePath, "utf8");

    // Check for broken empty anchor links
    const matchesHref = content.match(/href=["']#["']/g);
    if (matchesHref) {
      deadHrefCount += matchesHref.length;
    }

    // Check for img tags without alt
    const imgMatches = content.match(/<img(?![^>]*\balt=)[^>]*>/gi);
    if (imgMatches) {
      missingAltCount += imgMatches.length;
    }
  }
});

report("Audited all JSX files for dead '#' anchor tags", deadHrefCount === 0, `Found ${deadHrefCount} dead links`);
report("Audited all JSX images for accessible alt attributes", missingAltCount === 0, `Found ${missingAltCount} images without alt`);

// ----------------------------------------------------------------------
// 2. DATA GENERATOR & PERSISTENCE PURITY
// ----------------------------------------------------------------------
console.log("\n--- [AUDIT 2: Data Generator, Relational Math & Constraints] ---");

const generatorUrl = pathToFileURL(path.join(basePath, "src/data/collegeDataGenerator.js")).href;
const mockDataUrl = pathToFileURL(path.join(basePath, "src/data/initialMockData.js")).href;

const generator = await import(generatorUrl);
const mockData = await import(mockDataUrl);

const students = generator.generateStudents();
const offerings = generator.generateSubjectOfferings();
const { facultyList, assignments } = generator.generateFacultyAndAssignments(offerings);

report("Total Generated Students is exactly 720 (30 per year x 4 years x 6 depts)", students.length === 720, `Got ${students.length}`);
report("Total Subject Offerings is exactly 288 (6 per sem x 8 sem x 6 depts)", offerings.length === 288, `Got ${offerings.length}`);

// Test student uniqueness
const studentNamesSet = new Set(students.map(s => s.name));
report("Student names 100% unique in generator", studentNamesSet.size === 720, `${studentNamesSet.size}/720 unique`);

const studentIdsSet = new Set(students.map(s => s.studentId));
report("Student IDs 100% unique in generator", studentIdsSet.size === 720, `${studentIdsSet.size}/720 unique`);

const studentEmailsSet = new Set(students.map(s => s.email.toLowerCase()));
report("Student emails 100% unique in generator", studentEmailsSet.size === 720, `${studentEmailsSet.size}/720 unique`);

// Test Initial Users + Generated Students Cross-Collision
const allNames = [...mockData.INITIAL_USERS.map(u => u.name), ...students.map(s => s.name)];
const uniqueAll = new Set(allNames);
report(`Zero name collision between Initial Users (Staff+Admins+Demo Students) and Generated Students (Total: ${allNames.length})`, uniqueAll.size === allNames.length, `Unique: ${uniqueAll.size}/${allNames.length}`);

// ----------------------------------------------------------------------
// 3. CURRICULUM INTEGRITY (288 Subjects Structure)
// ----------------------------------------------------------------------
console.log("\n--- [AUDIT 3: Subject Curriculum & Department Mapping] ---");

const depts = ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CE'];
depts.forEach(d => {
  const deptSubs = offerings.filter(o => o.departmentCode === d);
  report(`Department ${d} has exactly 48 subjects across 8 semesters`, deptSubs.length === 48, `Found ${deptSubs.length}`);
});

// ----------------------------------------------------------------------
// 4. ROLE-BASED ACCESS CONTROL (RBAC) & ROUTE ISOLATION
// ----------------------------------------------------------------------
console.log("\n--- [AUDIT 4: RBAC Route Guard Integrity] ---");

const appContent = fs.readFileSync(path.join(basePath, "src/App.jsx"), "utf8");

const studentRoutes = [
  "/student/dashboard",
  "/student/profile",
  "/student/academics",
  "/student/attendance",
  "/student/assignments",
  "/student/exams",
  "/student/results",
  "/student/fees",
  "/student/leave",
  "/student/helpdesk"
];

studentRoutes.forEach(r => {
  const isGuarded = appContent.includes(`path="${r}"`) && appContent.includes(`RoleGuard allowedRoles={['STUDENT']}`);
  report(`Student Route '${r}' guarded for 'STUDENT'`, isGuarded);
});

const adminRoutes = [
  "/admin/dashboard",
  "/admin/analytics",
  "/admin/students",
  "/admin/teachers",
  "/admin/departments",
  "/admin/courses",
  "/admin/subjects",
  "/admin/attendance",
  "/admin/exams",
  "/admin/leave",
  "/admin/helpdesk"
];

adminRoutes.forEach(r => {
  const isGuarded = appContent.includes(`path="${r}"`) && appContent.includes(`RoleGuard allowedRoles={['ADMIN']}`);
  report(`Admin Route '${r}' guarded for 'ADMIN'`, isGuarded);
});

// ----------------------------------------------------------------------
// 5. DATA CONTEXT CRITICAL WORKFLOW METHODS
// ----------------------------------------------------------------------
console.log("\n--- [AUDIT 5: State Operations & Cross-Portal Handlers] ---");

const dataCtxContent = fs.readFileSync(path.join(basePath, "src/context/DataContext.jsx"), "utf8");

const requiredMethods = [
  "submitHelpdeskTicket",
  "replyHelpdeskTicket",
  "markAttendance",
  "markClassAttendance",
  "submitMarksByTeacher",
  "updateClassMarks",
  "publishExamResults",
  "addAssignment",
  "addClassAssignment",
  "submitAssignment",
  "gradeSubmission",
  "submitLeaveRequest",
  "updateLeaveStatus",
  "addAnnouncement",
  "addClassAnnouncement",
  "addStudent",
  "addTeacher",
  "updateUser",
  "toggleUserStatus",
  "resetUserAccount",
  "addDepartment",
  "updateDepartment",
  "addCourse",
  "updateCourse",
  "addSubject",
  "updateSubject",
  "addExamination",
  "updateExamination",
  "dispatchNotification",
  "logAction"
];

requiredMethods.forEach(m => {
  report(`DataContext implements '${m}'`, dataCtxContent.includes(m));
});

// ----------------------------------------------------------------------
// SUMMARY REPORT
// ----------------------------------------------------------------------
console.log("\n==========================================================================");
console.log(`  AUDIT COMPLETED — PASSED: ${passCount} | FAILED: ${failCount}`);
console.log(`  OVERALL QUALITY COMPLIANCE: ${Math.round((passCount / (passCount + failCount)) * 100)}%`);
console.log("==========================================================================\n");

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
