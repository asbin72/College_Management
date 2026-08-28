import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Providers & Guards
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { RoleGuard } from './components/common/RoleGuard';
import { ScrollToTop } from './components/common/ScrollToTop';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Leadership } from './pages/public/Leadership';
import { Departments as DepartmentsPublic } from './pages/public/Departments';
import { DepartmentDetail } from './pages/public/DepartmentDetail';
import { Admissions } from './pages/public/Admissions';
import { Courses } from './pages/public/Courses';
import { CourseDetail } from './pages/public/CourseDetail';
import { ApplicationForm } from './pages/public/ApplicationForm';
import { FacultyPublic } from './pages/public/FacultyPublic';
import { FacultyDetail } from './pages/public/FacultyDetail';
import { FAQPublic } from './pages/public/FAQPublic';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/public/Login';
import { Gallery } from './pages/public/Gallery';
import { CampusLife } from './pages/public/CampusLife';
import { NewsList } from './pages/public/NewsList';
import { NewsDetail } from './pages/public/NewsDetail';
import { EventList } from './pages/public/EventList';
import { EventDetail } from './pages/public/EventDetail';
import { CurriculumPage } from './pages/public/CurriculumPage';
import { AcademicExcellencePage } from './pages/public/AcademicExcellencePage';
import { PracticalEducationPage } from './pages/public/PracticalEducationPage';
import { PlacementsPage } from './pages/public/PlacementsPage';
import { AcademicCalendarPage } from './pages/public/AcademicCalendarPage';
import { PrivacyPolicy } from './pages/public/PrivacyPolicy';
import { TermsConditions } from './pages/public/TermsConditions';
import { PublicGenericPage } from './pages/public/PublicGenericPage';
import { NotFound } from './pages/public/NotFound';

// Dedicated Student Portal Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentAcademics } from './pages/student/StudentAcademics';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentExams } from './pages/student/StudentExams';
import { StudentResults } from './pages/student/StudentResults';
import { StudentFees } from './pages/student/StudentFees';
import { StudentLeave } from './pages/student/StudentLeave';
import { StudentHelpdesk } from './pages/student/StudentHelpdesk';

// Dedicated Staff (Teacher) Portal Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherProfile } from './pages/teacher/TeacherProfile';
import { TeacherClasses } from './pages/teacher/TeacherClasses';
import { TeacherClassDetail } from './pages/teacher/TeacherClassDetail';
import { TeacherSubjects } from './pages/teacher/TeacherSubjects';
import { TeacherAttendance } from './pages/teacher/TeacherAttendance';
import { TeacherAssignments } from './pages/teacher/TeacherAssignments';
import { TeacherExams } from './pages/teacher/TeacherExams';
import { TeacherMarks } from './pages/teacher/TeacherMarks';
import { TeacherLeave } from './pages/teacher/TeacherLeave';
import { TeacherHelpdesk } from './pages/teacher/TeacherHelpdesk';
import { TeacherStudents } from './pages/teacher/TeacherStudents';

// Dedicated Admin Portal Pages
import { AdminControl } from './pages/admin/AdminControl';
import { AdminAdmissions } from './pages/admin/AdminAdmissions';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminTeachers } from './pages/admin/AdminTeachers';
import { AdminDepartments } from './pages/admin/AdminDepartments';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminCourseSubjects } from './pages/admin/AdminCourseSubjects';
import { AdminSubjects } from './pages/admin/AdminSubjects';
import { AdminAttendance } from './pages/admin/AdminAttendance';
import { AdminExams } from './pages/admin/AdminExams';
import { AdminLeave } from './pages/admin/AdminLeave';
import { AdminHelpdesk } from './pages/admin/AdminHelpdesk';

import { PublicLayout } from './components/public/PublicLayout';

// Inner component: reads users from DataContext and provides AuthContext
function AppRoutes() {
  const { users } = useData();
  const P = (Comp) => <PublicLayout>{Comp}</PublicLayout>;

  return (
    <AuthProvider users={users}>
      <ScrollToTop />
      <Routes>
        {/* PUBLIC WEBSITE ROUTES */}
        <Route path="/" element={P(<Home />)} />
        <Route path="/about" element={P(<About />)} />
        <Route path="/about/leadership" element={P(<Leadership />)} />
        <Route path="/about/accreditation" element={P(<PublicGenericPage title="Accreditation & Approvals" category="ABOUT" description="NAAC A++ grade, AICTE approved, and UGC recognized university." />)} />
        <Route path="/about/research" element={P(<PublicGenericPage title="Research & Innovation Centers" category="RESEARCH" description="State of the art research labs, patent filings, and industry-sponsored projects." />)} />
        <Route path="/about/infrastructure" element={P(<PublicGenericPage title="Campus Infrastructure" category="FACILITIES" description="100-acre smart campus with high-speed Wi-Fi, modern labs, and digital libraries." />)} />
        <Route path="/about/placements" element={P(<PlacementsPage />)} />

        <Route path="/academics" element={P(<Courses />)} />
        <Route path="/academics/curriculum" element={P(<CurriculumPage />)} />
        <Route path="/academics/excellence" element={P(<AcademicExcellencePage />)} />
        <Route path="/academics/practical-education" element={P(<PracticalEducationPage />)} />
        <Route path="/academics/career-development" element={P(<PlacementsPage />)} />
        <Route path="/academics/departments" element={P(<DepartmentsPublic />)} />
        <Route path="/academics/departments/:deptId" element={P(<DepartmentDetail />)} />
        <Route path="/departments" element={P(<DepartmentsPublic />)} />
        <Route path="/departments/:deptId" element={P(<DepartmentDetail />)} />
        <Route path="/academics/programs" element={P(<Courses />)} />
        <Route path="/academics/courses" element={P(<Courses />)} />
        <Route path="/academics/courses/:courseId" element={P(<CourseDetail />)} />
        <Route path="/academics/faculty" element={P(<FacultyPublic />)} />
        <Route path="/academics/academic-calendar" element={P(<AcademicCalendarPage />)} />

        <Route path="/admissions" element={P(<Admissions />)} />
        <Route path="/admissions/process" element={P(<Admissions />)} />
        <Route path="/admissions/eligibility" element={P(<Admissions />)} />
        <Route path="/admissions/scholarships" element={P(<Admissions />)} />
        <Route path="/admissions/fees" element={P(<Admissions />)} />
        <Route path="/admissions/undergraduate" element={P(<Admissions />)} />
        <Route path="/admissions/postgraduate" element={P(<Admissions />)} />
        <Route path="/admissions/phd" element={P(<Admissions />)} />
        <Route path="/admissions/international" element={P(<Admissions />)} />
        <Route path="/admissions/fee-structure" element={P(<Admissions />)} />
        <Route path="/admissions/apply" element={P(<ApplicationForm />)} />
        <Route path="/admissions/application" element={P(<ApplicationForm />)} />

        <Route path="/campus-life" element={P(<CampusLife />)} />
        <Route path="/campus-life/overview" element={P(<CampusLife />)} />
        <Route path="/campus-life/laboratories" element={P(<PracticalEducationPage />)} />
        <Route path="/campus-life/library" element={P(<CampusLife />)} />
        <Route path="/library" element={P(<CampusLife />)} />
        <Route path="/academics/library" element={P(<CampusLife />)} />
        <Route path="/campus-life/events" element={P(<CampusLife />)} />
        <Route path="/campus-life/hostel" element={P(<CampusLife />)} />
        <Route path="/campus-life/sports" element={P(<CampusLife />)} />
        <Route path="/campus-life/clubs" element={P(<CampusLife />)} />
        <Route path="/campus-life/student-life" element={P(<CampusLife />)} />

        <Route path="/faculty" element={P(<FacultyPublic />)} />
        <Route path="/faculty/:facultyId" element={P(<FacultyDetail />)} />

        <Route path="/news" element={P(<NewsList />)} />
        <Route path="/news/:newsId" element={P(<NewsDetail />)} />
        <Route path="/events" element={P(<EventList />)} />
        <Route path="/events/:eventId" element={P(<EventDetail />)} />

        <Route path="/gallery" element={P(<Gallery />)} />
        <Route path="/campus-life/gallery" element={P(<Gallery />)} />
        <Route path="/faq" element={P(<FAQPublic />)} />
        <Route path="/contact" element={P(<Contact />)} />

        {/* Unified Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/forgot-password" element={<Login />} />
        <Route path="/reset-password" element={<Login />} />

        <Route path="/privacy-policy" element={P(<PrivacyPolicy />)} />
        <Route path="/terms" element={P(<TermsConditions />)} />
        <Route path="/terms-and-conditions" element={P(<TermsConditions />)} />

        {/* STUDENT PORTAL BASE REDIRECTS & ROUTES */}
        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/student/" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/student/dashboard" element={<RoleGuard allowedRoles={['STUDENT']}><StudentDashboard /></RoleGuard>} />
        <Route path="/student/profile" element={<RoleGuard allowedRoles={['STUDENT']}><StudentProfile /></RoleGuard>} />
        <Route path="/student/courses" element={<RoleGuard allowedRoles={['STUDENT']}><StudentAcademics /></RoleGuard>} />
        <Route path="/student/academics" element={<RoleGuard allowedRoles={['STUDENT']}><StudentAcademics /></RoleGuard>} />
        <Route path="/student/subjects" element={<RoleGuard allowedRoles={['STUDENT']}><StudentAcademics /></RoleGuard>} />
        <Route path="/student/attendance" element={<RoleGuard allowedRoles={['STUDENT']}><StudentAttendance /></RoleGuard>} />
        <Route path="/student/assignments" element={<RoleGuard allowedRoles={['STUDENT']}><StudentAssignments /></RoleGuard>} />
        <Route path="/student/exams" element={<RoleGuard allowedRoles={['STUDENT']}><StudentExams /></RoleGuard>} />
        <Route path="/student/results" element={<RoleGuard allowedRoles={['STUDENT']}><StudentResults /></RoleGuard>} />
        <Route path="/student/fees" element={<RoleGuard allowedRoles={['STUDENT']}><StudentFees /></RoleGuard>} />
        <Route path="/student/leave" element={<RoleGuard allowedRoles={['STUDENT']}><StudentLeave /></RoleGuard>} />
        <Route path="/student/helpdesk" element={<RoleGuard allowedRoles={['STUDENT']}><StudentHelpdesk /></RoleGuard>} />
        <Route path="/student/help" element={<RoleGuard allowedRoles={['STUDENT']}><StudentHelpdesk /></RoleGuard>} />

        {/* CANONICAL STAFF / TEACHER PORTAL BASE REDIRECTS & ROUTES */}
        <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="/staff/" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="/staff/dashboard" element={<RoleGuard allowedRoles={['TEACHER', 'STAFF']}><TeacherDashboard /></RoleGuard>} />
        <Route path="/staff/profile" element={<RoleGuard allowedRoles={['TEACHER', 'STAFF']}><TeacherProfile /></RoleGuard>} />
        <Route path="/staff/courses" element={<RoleGuard allowedRoles={['TEACHER', 'STAFF']}><TeacherClasses /></RoleGuard>} />
        <Route path="/staff/classes" element={<Navigate to="/staff/courses" replace />} />
        <Route path="/staff/classes/:classId" element={<RoleGuard allowedRoles={['TEACHER', 'STAFF', 'ADMIN']}><TeacherClassDetail /></RoleGuard>} />
        <Route path="/staff/subjects" element={<RoleGuard allowedRoles={['TEACHER', 'STAFF']}><TeacherSubjects /></RoleGuard>} />
        <Route path="/staff/students" element={<RoleGuard allowedRoles={['TEACHER', 'STAFF']}><TeacherStudents /></RoleGuard>} />
        <Route path="/staff/attendance" element={<RoleGuard allowedRoles={['TEACHER', 'STAFF']}><TeacherAttendance /></RoleGuard>} />
        <Route path="/staff/assignments" element={<RoleGuard allowedRoles={['TEACHER', 'STAFF']}><TeacherAssignments /></RoleGuard>} />
        <Route path="/staff/exams" element={<RoleGuard allowedRoles={['TEACHER', 'STAFF']}><TeacherExams /></RoleGuard>} />
        <Route path="/staff/marks" element={<RoleGuard allowedRoles={['TEACHER', 'STAFF']}><TeacherMarks /></RoleGuard>} />
        <Route path="/staff/leave" element={<RoleGuard allowedRoles={['TEACHER', 'STAFF']}><TeacherLeave /></RoleGuard>} />
        <Route path="/staff/helpdesk" element={<RoleGuard allowedRoles={['TEACHER', 'STAFF']}><TeacherHelpdesk /></RoleGuard>} />
        <Route path="/staff/help" element={<RoleGuard allowedRoles={['TEACHER', 'STAFF']}><TeacherHelpdesk /></RoleGuard>} />

        {/* LEGACY /TEACHER/* ROUTE REDIRECTS TO /STAFF/* */}
        <Route path="/teacher" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="/teacher/" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="/teacher/dashboard" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="/teacher/profile" element={<Navigate to="/staff/profile" replace />} />
        <Route path="/teacher/classes" element={<Navigate to="/staff/courses" replace />} />
        <Route path="/teacher/subjects" element={<Navigate to="/staff/subjects" replace />} />
        <Route path="/teacher/students" element={<Navigate to="/staff/students" replace />} />
        <Route path="/teacher/attendance" element={<Navigate to="/staff/attendance" replace />} />
        <Route path="/teacher/assignments" element={<Navigate to="/staff/assignments" replace />} />
        <Route path="/teacher/exams" element={<Navigate to="/staff/exams" replace />} />
        <Route path="/teacher/marks" element={<Navigate to="/staff/marks" replace />} />
        <Route path="/teacher/leave" element={<Navigate to="/staff/leave" replace />} />
        <Route path="/teacher/helpdesk" element={<Navigate to="/staff/helpdesk" replace />} />
        <Route path="/teacher/help" element={<Navigate to="/staff/helpdesk" replace />} />

        {/* ADMIN PORTAL BASE REDIRECTS & ROUTES */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/control" element={<RoleGuard allowedRoles={['ADMIN']}><AdminControl /></RoleGuard>} />
        <Route path="/admin/dashboard" element={<RoleGuard allowedRoles={['ADMIN']}><AdminControl /></RoleGuard>} />
        <Route path="/admin/admissions" element={<RoleGuard allowedRoles={['ADMIN']}><AdminAdmissions /></RoleGuard>} />
        <Route path="/admin/analytics" element={<RoleGuard allowedRoles={['ADMIN']}><AdminAnalytics /></RoleGuard>} />
        <Route path="/admin/students" element={<RoleGuard allowedRoles={['ADMIN']}><AdminStudents /></RoleGuard>} />
        <Route path="/admin/teachers" element={<RoleGuard allowedRoles={['ADMIN']}><AdminTeachers /></RoleGuard>} />
        <Route path="/admin/departments" element={<RoleGuard allowedRoles={['ADMIN']}><AdminDepartments /></RoleGuard>} />
        <Route path="/admin/courses" element={<RoleGuard allowedRoles={['ADMIN']}><AdminCourses /></RoleGuard>} />
        <Route path="/admin/courses/:courseId/subjects" element={<RoleGuard allowedRoles={['ADMIN']}><AdminCourseSubjects /></RoleGuard>} />
        <Route path="/admin/subjects" element={<Navigate to="/admin/courses" replace />} />
        <Route path="/admin/attendance" element={<RoleGuard allowedRoles={['ADMIN']}><AdminAttendance /></RoleGuard>} />
        <Route path="/admin/exams" element={<RoleGuard allowedRoles={['ADMIN']}><AdminExams /></RoleGuard>} />
        <Route path="/admin/leave" element={<RoleGuard allowedRoles={['ADMIN']}><AdminLeave /></RoleGuard>} />
        <Route path="/admin/helpdesk" element={<RoleGuard allowedRoles={['ADMIN']}><AdminHelpdesk /></RoleGuard>} />

        {/* CATCH ALL 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

import ErrorBoundary from './components/common/ErrorBoundary';

// Outer App: ErrorBoundary first, DataProvider second, then AppRoutes mounts AuthProvider inside
export default function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <AppRoutes />
      </DataProvider>
    </ErrorBoundary>
  );
}
