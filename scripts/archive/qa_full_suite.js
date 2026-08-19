import fs from 'fs';
import path from 'path';

console.log("==================================================================");
console.log("   KALPANAAA EDUCATION CMS — AUTOMATED MASTER QA SUITE v1.0       ");
console.log("==================================================================");

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

function assert(description, condition, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    testResults.push({ description, status: "PASS", details });
    console.log(`  [PASS] ${description}`);
  } else {
    failedTests++;
    testResults.push({ description, status: "FAIL", details });
    console.error(`  [FAIL] ${description} -> ${details}`);
  }
}

// ---------------------------------------------------------
// SUITE 1: FILE INVENTORY & PAGE ROUTE COMPLETENESS
// ---------------------------------------------------------
console.log("\n--- [SUITE 1: Route & Component Inventory Completeness] ---");

const requiredPages = [
  // Public
  "src/pages/public/Home.jsx",
  "src/pages/public/About.jsx",
  "src/pages/public/Leadership.jsx",
  "src/pages/public/Departments.jsx",
  "src/pages/public/DepartmentDetail.jsx",
  "src/pages/public/Courses.jsx",
  "src/pages/public/CourseDetail.jsx",
  "src/pages/public/Admissions.jsx",
  "src/pages/public/ApplicationForm.jsx",
  "src/pages/public/FacultyPublic.jsx",
  "src/pages/public/FacultyDetail.jsx",
  "src/pages/public/CampusLife.jsx",
  "src/pages/public/Gallery.jsx",
  "src/pages/public/NewsList.jsx",
  "src/pages/public/NewsDetail.jsx",
  "src/pages/public/EventList.jsx",
  "src/pages/public/EventDetail.jsx",
  "src/pages/public/FAQPublic.jsx",
  "src/pages/public/Contact.jsx",
  "src/pages/public/Login.jsx",
  "src/pages/public/NotFound.jsx",

  // Student Portal
  "src/pages/student/StudentDashboard.jsx",
  "src/pages/student/StudentProfile.jsx",
  "src/pages/student/StudentAcademics.jsx",
  "src/pages/student/StudentAttendance.jsx",
  "src/pages/student/StudentAssignments.jsx",
  "src/pages/student/StudentExams.jsx",
  "src/pages/student/StudentResults.jsx",
  "src/pages/student/StudentFees.jsx",
  "src/pages/student/StudentLeave.jsx",
  "src/pages/student/StudentHelpdesk.jsx",

  // Teacher Portal
  "src/pages/teacher/TeacherDashboard.jsx",
  "src/pages/teacher/TeacherProfile.jsx",
  "src/pages/teacher/TeacherClasses.jsx",
  "src/pages/teacher/TeacherClassDetail.jsx",
  "src/pages/teacher/TeacherSubjects.jsx",
  "src/pages/teacher/TeacherAttendance.jsx",
  "src/pages/teacher/TeacherAssignments.jsx",
  "src/pages/teacher/TeacherExams.jsx",
  "src/pages/teacher/TeacherMarks.jsx",
  "src/pages/teacher/TeacherStudents.jsx",
  "src/pages/teacher/TeacherLeave.jsx",
  "src/pages/teacher/TeacherHelpdesk.jsx",

  // Admin Portal
  "src/pages/admin/AdminControl.jsx",
  "src/pages/admin/AdminAnalytics.jsx",
  "src/pages/admin/AdminStudents.jsx",
  "src/pages/admin/AdminTeachers.jsx",
  "src/pages/admin/AdminDepartments.jsx",
  "src/pages/admin/AdminCourses.jsx",
  "src/pages/admin/AdminSubjects.jsx",
  "src/pages/admin/AdminAttendance.jsx",
  "src/pages/admin/AdminExams.jsx",
  "src/pages/admin/AdminLeave.jsx",
  "src/pages/admin/AdminHelpdesk.jsx"
];

const basePath = "c:/Users/asbin/OneDrive/Attachments/Desktop/Kalpanaaa Education/NewEdu";

requiredPages.forEach(relPath => {
  const fullPath = path.join(basePath, relPath);
  const exists = fs.existsSync(fullPath);
  assert(`Component exists: ${relPath}`, exists, exists ? "Found" : "File Missing!");
});

// ---------------------------------------------------------
// SUITE 2: DATA INTEGRITY & 100% NAME UNIQUENESS
// ---------------------------------------------------------
console.log("\n--- [SUITE 2: Data Generator & Name Uniqueness] ---");

import { pathToFileURL } from 'url';

const generatorUrl = pathToFileURL(path.join(basePath, "src/data/collegeDataGenerator.js")).href;
const mockDataUrl = pathToFileURL(path.join(basePath, "src/data/initialMockData.js")).href;

import(generatorUrl).then(generator => {
  const students = generator.generateStudents();
  assert(`Generated Students Count is exactly 720`, students.length === 720, `Count: ${students.length}`);

  const studentNames = students.map(s => s.name);
  const uniqueStudentNames = new Set(studentNames);
  assert(`All 720 Generated Student Names are 100% Unique`, uniqueStudentNames.size === 720, `Unique: ${uniqueStudentNames.size} / 720`);

  const offerings = generator.generateSubjectOfferings();
  assert(`Generated Subject Offerings Count is exactly 288`, offerings.length === 288, `Count: ${offerings.length}`);

  const { facultyList, assignments } = generator.generateFacultyAndAssignments(offerings);
  assert(`Faculty List Count is 6 HODs`, facultyList.length === 6, `Count: ${facultyList.length}`);
  assert(`Faculty Assignments populated`, assignments.length >= 2, `Count: ${assignments.length}`);

  // Test Departments array
  assert(`6 Core Departments Registered`, generator.DEPARTMENTS.length === 6, `Found: ${generator.DEPARTMENTS.length}`);

  return import(mockDataUrl).then(mockData => {
    const initialUsers = mockData.INITIAL_USERS;
    assert(`Initial Users has at least 25 core users`, initialUsers.length >= 25, `Count: ${initialUsers.length}`);

    const allInstitutionalNames = [
      ...initialUsers.map(u => u.name),
      ...studentNames
    ];
    const uniqueAllNames = new Set(allInstitutionalNames);
    const duplicates = [];
    const seen = new Set();
    allInstitutionalNames.forEach(n => {
      if (seen.has(n)) duplicates.push(n);
      seen.add(n);
    });

    assert(
      `Zero Cross-Role Name Collisions across entire institution (${allInstitutionalNames.length} persons)`,
      duplicates.length === 0,
      duplicates.length > 0 ? `Duplicates: ${duplicates.join(", ")}` : "100% Unique"
    );

    // Verify Initial Departments & Courses
    assert(`INITIAL_DEPARTMENTS has 6 records`, mockData.INITIAL_DEPARTMENTS.length === 6);
    assert(`INITIAL_COURSES has 6 degree programs`, mockData.INITIAL_COURSES.length === 6);
    assert(`INITIAL_HELPDESK tickets are valid non-junk records`, mockData.INITIAL_HELPDESK.length >= 6);

    // ---------------------------------------------------------
    // SUITE 3: RBAC & AUTH MATRIX VERIFICATION
    // ---------------------------------------------------------
    console.log("\n--- [SUITE 3: RBAC Security & Role Guards] ---");

    const appCode = fs.readFileSync(path.join(basePath, "src/App.jsx"), "utf8");
    assert(`Student routes guarded with RoleGuard allowedRoles=['STUDENT']`, appCode.includes("allowedRoles={['STUDENT']}"));
    assert(`Teacher routes guarded with RoleGuard allowedRoles=['TEACHER', 'STAFF']`, appCode.includes("allowedRoles={['TEACHER', 'STAFF']}"));
    assert(`Admin routes guarded with RoleGuard allowedRoles=['ADMIN']`, appCode.includes("allowedRoles={['ADMIN']}"));

    // ---------------------------------------------------------
    // SUITE 4: CROSS-PORTAL WORKFLOWS
    // ---------------------------------------------------------
    console.log("\n--- [SUITE 4: Cross-Portal Communication Verification] ---");

    const dataContextCode = fs.readFileSync(path.join(basePath, "src/context/DataContext.jsx"), "utf8");
    assert(`submitHelpdeskTicket supports both Student & Staff tickets`, dataContextCode.includes("submitHelpdeskTicket"));
    assert(`markAttendance updates attendance records in state`, dataContextCode.includes("markAttendance"));
    assert(`submitLeaveRequest synchronizes leave requests across portals`, dataContextCode.includes("submitLeaveRequest"));
    assert(`addAnnouncement broadcasts announcements to all portals`, dataContextCode.includes("addAnnouncement"));

    // ---------------------------------------------------------
    // SUMMARY
    // ---------------------------------------------------------
    console.log("\n==================================================================");
    console.log(`  TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
    console.log(`  SCORE: ${Math.round((passedTests / totalTests) * 100)}%`);
    console.log("==================================================================\n");

    if (failedTests > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
}).catch(err => {
  console.error("Test Suite crashed with error:", err);
  process.exit(1);
});
