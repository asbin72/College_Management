import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getCurrentYear } from '../../utils/idGenerator';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { AdminAuditLogsTable } from '../../components/portal/AdminAuditLogsTable';
import { Users, Building, BookOpen, FileText, Clock, Award, CalendarCheck, Plus, CheckCircle2, AlertCircle, Bell, ShieldCheck, X, UserCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SEMESTERS } from '../../data/collegeDataGenerator';

export const AdminControl = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const {
    users, departments, courses, subjects, subjectOfferings, facultyClassAssignments = [], attendance, examinations, leaveRequests, notifications, auditLogs,
    admissionApplications = [], updateAdmissionStatus,
    addStudent, addTeacher, addDepartment, addCourse, addSubject, addExamination
  } = useData();
  const navigate = useNavigate();

  // Quick Action Modal states
  const [activeModal, setActiveModal] = useState(null); // 'student'|'teacher'|'dept'|'course'|'subject'|'exam'

  // Form states for modals
  const [formData, setFormData] = useState({});

  // Filtered User metrics
  const students = users.filter(u => u.role === 'STUDENT' || (u.studentId && String(u.studentId).startsWith('STU')));
  const activeStudents = students.filter(u => u.status !== 'Inactive' && u.status !== 'Suspended');
  const teachers = users.filter(u => u.role === 'TEACHER' || u.role === 'STAFF' || u.role === 'FACULTY' || (u.employeeId && String(u.employeeId).startsWith('EMP')));
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending');
  const upcomingExams = examinations.filter(e => !e.isPublished && e.status !== 'Results Published');
  const pendingExamTasks = examinations.filter(e => e.status === 'Marks Pending' || e.status === 'Marks Submitted');
  const publishedExamsCount = examinations.filter(e => e.isPublished || e.status === 'Results Published' || e.published).length;
  const totalSubjectsCount = (subjectOfferings && subjectOfferings.length > 0) ? subjectOfferings.length : subjects.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendanceLogs = attendance.filter(a => a.date === todayStr);
  const latestDateInLogs = attendance.length > 0
    ? Array.from(new Set(attendance.map(a => a.date))).sort().reverse()[0]
    : todayStr;

  const sessionAttendance = todayAttendanceLogs.length > 0
    ? todayAttendanceLogs
    : (latestDateInLogs ? attendance.filter(a => a.date === latestDateInLogs) : attendance);

  const presentTodayCount = sessionAttendance.filter(a => a.status === 'Present').length;
  const absentTodayCount = sessionAttendance.filter(a => a.status === 'Absent').length;
  const cohortCount = (facultyClassAssignments && facultyClassAssignments.length > 0)
    ? facultyClassAssignments.length
    : (subjectOfferings && subjectOfferings.length > 0)
    ? subjectOfferings.length
    : (new Set(attendance.map(a => a.subjectCode || a.classId)).size || 0);

  const generateNextEmployeeId = () => {
    let maxNum = 100;
    teachers.forEach(t => {
      const emp = String(t.employeeId || t.username || '');
      const m = emp.match(/EMP-(\d+)/i);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > maxNum) maxNum = n;
      }
    });
    return `EMP-${maxNum + 1}`;
  };

  const generateNextStudentId = () => {
    const studentUsers = users.filter(u => u.role === 'STUDENT');
    let maxNum = 262;
    studentUsers.forEach(u => {
      const match = String(u.studentId || u.username || '').match(/STU-(?:\d{4}-)?(\d+)/i) || String(u.studentId || u.username || '').match(/(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    return `STU-${getCurrentYear()}-${maxNum + 1}`;
  };

  const openModal = (type) => {
    if (type === 'teacher') {
      const nextId = generateNextEmployeeId();
      setFormData({
        employeeId: nextId,
        username: nextId,
        role: 'TEACHER',
        status: 'Active',
        name: '',
        email: '',
        password: '',
        department: departments[0]?.name || 'Computer Science and Engineering',
        designation: 'Assistant Professor'
      });
    } else if (type === 'student') {
      const nextStuId = generateNextStudentId();
      setFormData({
        studentId: nextStuId,
        username: nextStuId,
        role: 'STUDENT',
        status: 'Active',
        name: '',
        email: '',
        password: '',
        department: departments[0]?.name || 'Computer Science and Engineering',
        course: courses[0]?.name || 'B.Tech Computer Science & Engineering',
        semester: 'Semester 1'
      });
    } else {
      setFormData({});
    }
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setFormData({});
  };

  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.name.trim()) return;

    // Check duplicate name warning
    const dupName = users.find(u => u.role === 'STUDENT' && u.name.toLowerCase().trim() === formData.name.toLowerCase().trim());
    if (dupName) {
      if (!window.confirm(`Notice: A student named "${formData.name}" (${dupName.studentId}) is already enrolled. Do you want to proceed creating a separate unique account with ID ${formData.studentId}?`)) {
        return;
      }
    }

    // Check duplicate email
    const dupEmail = users.find(u => u.email?.toLowerCase() === formData.email?.toLowerCase());
    if (dupEmail) {
      alert(`Validation Error: The email address "${formData.email}" is already assigned to student ${dupEmail.name} (${dupEmail.studentId}). Please use a unique email address.`);
      return;
    }

    addStudent(formData, currentUser);
    closeModal();
    alert(`Student account created successfully for ${formData.name}! Unique Email: ${formData.email}, Student ID: ${formData.studentId}`);
  };

  const handleCreateTeacher = (e) => {
    e.preventDefault();
    addTeacher(formData, currentUser);
    closeModal();
    alert(`Teacher account registered for ${formData.name}!`);
  };

  const handleCreateDept = (e) => {
    e.preventDefault();
    addDepartment(formData, currentUser);
    closeModal();
    alert(`Department ${formData.name} created!`);
  };

  const handleCreateCourse = (e) => {
    e.preventDefault();
    addCourse(formData, currentUser);
    closeModal();
    alert(`Course ${formData.name} created!`);
  };

  const handleCreateSubject = (e) => {
    e.preventDefault();
    addSubject(formData, currentUser);
    closeModal();
    alert(`Subject ${formData.name} created!`);
  };

  const handleCreateExam = (e) => {
    e.preventDefault();
    addExamination(formData, currentUser);
    closeModal();
    alert(`Examination ${formData.name} scheduled!`);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Header Banner */}
          <div className="bg-white text-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 border-l-8 border-gold relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-navy text-xs font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded border border-gold/30">
                INSTITUTION CONTROL CENTRE
              </span>
              <h1 className="text-3xl font-serif font-bold text-navy mt-2">
                Central Management Dashboard
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Central Governance Console &bull; Logged in as: <strong className="text-navy font-bold">{currentUser?.name}</strong> (Administrator)
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openModal('student')}
                className="bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs px-4 py-2.5 rounded-lg shadow uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Student
              </button>
              <button
                onClick={() => openModal('teacher')}
                className="bg-navy-light hover:bg-navy-light/80 text-amber-200 border border-gold/30 font-bold text-xs px-4 py-2.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Teacher
              </button>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Administrative Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {(() => {
                const pendingCount = admissionApplications.filter(a => a.status === 'Under Verification' || !a.status).length;
                return (
                  <button onClick={() => navigate('/admin/admissions')} className="p-3.5 bg-amber-50 hover:bg-navy hover:text-white text-navy rounded-xl border border-amber-200 transition flex flex-col items-center text-center group relative shadow-xs">
                    <UserCheck className="w-5 h-5 text-amber-600 group-hover:text-gold mb-1.5" />
                    <span className="text-xs font-bold">Review Admissions</span>
                    {pendingCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-600 text-white font-num font-bold text-[10px] px-1.5 py-0.5 rounded-full shadow">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                );
              })()}
              <button onClick={() => openModal('student')} className="p-3.5 bg-blue-50 hover:bg-navy hover:text-white text-navy rounded-xl border border-blue-100 transition flex flex-col items-center text-center group shadow-xs">
                <Users className="w-5 h-5 text-blue-600 group-hover:text-gold mb-1.5" />
                <span className="text-xs font-bold">Add Student</span>
              </button>
              <button onClick={() => openModal('teacher')} className="p-3.5 bg-purple-50 hover:bg-navy hover:text-white text-navy rounded-xl border border-purple-100 transition flex flex-col items-center text-center group shadow-xs">
                <Users className="w-5 h-5 text-purple-600 group-hover:text-gold mb-1.5" />
                <span className="text-xs font-bold">Add Teacher</span>
              </button>
              <button onClick={() => openModal('dept')} className="p-3.5 bg-emerald-50 hover:bg-navy hover:text-white text-navy rounded-xl border border-emerald-100 transition flex flex-col items-center text-center group shadow-xs">
                <Building className="w-5 h-5 text-emerald-600 group-hover:text-gold mb-1.5" />
                <span className="text-xs font-bold">Add Department</span>
              </button>
              <button onClick={() => openModal('course')} className="p-3.5 bg-amber-50 hover:bg-navy hover:text-white text-navy rounded-xl border border-amber-100 transition flex flex-col items-center text-center group shadow-xs">
                <BookOpen className="w-5 h-5 text-amber-600 group-hover:text-gold mb-1.5" />
                <span className="text-xs font-bold">Add Course</span>
              </button>
              <button onClick={() => navigate('/admin/exams')} className="p-3.5 bg-rose-50 hover:bg-navy hover:text-white text-navy rounded-xl border border-rose-100 transition flex flex-col items-center text-center group shadow-xs">
                <Award className="w-5 h-5 text-rose-600 group-hover:text-gold mb-1.5" />
                <span className="text-xs font-bold">Schedule Exam</span>
              </button>
            </div>
          </div>

          {/* 5 Core Central Dashboard Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Students</span>
                <span className="text-2xl font-serif font-bold text-navy block mt-0.5">{students.length}</span>
              </div>
              <Users className="w-6 h-6 text-blue-500" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Active Students</span>
                <span className="text-2xl font-serif font-bold text-emerald-600 block mt-0.5">{activeStudents.length}</span>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Teachers / Staff</span>
                <span className="text-2xl font-serif font-bold text-purple-600 block mt-0.5">{teachers.length}</span>
              </div>
              <Users className="w-6 h-6 text-purple-500" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Departments</span>
                <span className="text-2xl font-serif font-bold text-navy block mt-0.5">{departments.length}</span>
              </div>
              <Building className="w-6 h-6 text-indigo-500" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Courses</span>
                <span className="text-2xl font-serif font-bold text-navy block mt-0.5">{totalSubjectsCount || courses.length}</span>
              </div>
              <BookOpen className="w-6 h-6 text-amber-500" />
            </div>
          </div>

          {/* Detailed Dashboard Sections - Clean 2-Column Symmetrical Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left Column */}
            <div className="space-y-6">
              {/* Attendance Overview Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif font-bold text-navy text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-600" /> Attendance Overview
                  </h4>
                  <Link to="/admin/attendance" className="text-xs font-bold text-gold hover:underline">View Attendance &rarr;</Link>
                </div>
                <p className="text-xs text-slate-500 mb-4">Live session logs across {cohortCount} class cohorts ({todayStr}).</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Target</span>
                    <span className="text-xl font-bold text-navy font-num">{students.length}</span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">Present Today</span>
                    <span className="text-xl font-bold text-emerald-600 font-num">{presentTodayCount}</span>
                  </div>
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                    <span className="text-[10px] font-bold text-rose-700 uppercase block">Absent Today</span>
                    <span className="text-xl font-bold text-rose-600 font-num">{absentTodayCount}</span>
                  </div>
                </div>
              </div>

              {/* Online Admissions Overview Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif font-bold text-navy text-base flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-600" /> Online Admissions Overview
                  </h4>
                  <Link to="/admin/admissions" className="text-xs font-bold text-gold hover:underline">Review Applications &rarr;</Link>
                </div>
                <p className="text-xs text-slate-500 mb-4">Online candidate registrations & certificate verification queue.</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">Pending Review</span>
                    <span className="text-xl font-bold text-amber-700 font-num">
                      {admissionApplications.filter(a => a.status === 'Under Verification' || !a.status).length}
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Approved</span>
                    <span className="text-xl font-bold text-emerald-600 font-num">
                      {admissionApplications.filter(a => a.status === 'Approved').length}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Applications</span>
                    <span className="text-xl font-bold text-navy font-num">{admissionApplications.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Examination Overview Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif font-bold text-navy text-base flex items-center gap-2">
                    <Award className="w-4 h-4 text-rose-600" /> Examination Overview
                  </h4>
                  <Link to="/admin/exams" className="text-xs font-bold text-gold hover:underline">Manage Exams &rarr;</Link>
                </div>
                <p className="text-xs text-slate-500 mb-4">Exam schedules, mark entries, and published results.</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="text-[10px] font-bold text-blue-700 uppercase block">Scheduled</span>
                    <span className="text-xl font-bold text-navy font-num">{examinations.length}</span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-[10px] font-bold text-amber-700 uppercase block">Marks Pending</span>
                    <span className="text-xl font-bold text-amber-600 font-num">
                      {examinations.filter(e => e.status === 'Marks Pending').length}
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">Published</span>
                    <span className="text-xl font-bold text-emerald-600 font-num">{publishedExamsCount}</span>
                  </div>
                </div>
              </div>

              {/* Pending Leave Requests Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-serif font-bold text-navy text-base flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-orange-600" /> Pending Leave Requests
                  </h4>
                  <Link to="/admin/leave" className="text-xs font-bold text-gold hover:underline">Review All ({pendingLeaves.length}) &rarr;</Link>
                </div>
                {pendingLeaves.length > 0 ? (
                  <div className="space-y-2">
                    {pendingLeaves.slice(0, 3).map((req) => (
                      <div key={req.id} className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-navy">{req.applicantName}</span>
                          <p className="text-slate-600 text-[11px] mt-0.5">{req.leaveType} &bull; {req.days} Day(s)</p>
                        </div>
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold uppercase">
                          {req.applicantRole || req.role}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No pending leave applications.</p>
                )}
              </div>
            </div>

          </div>

          {/* INSTITUTIONAL SYSTEM AUDIT LOGS TABLE */}
          <AdminAuditLogsTable />

        </main>
      </div>

      {/* --- QUICK ACTION MODALS --- */}
      {activeModal === 'student' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">Add New Student Account</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-navy"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs" autoComplete="off">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input 
                  required 
                  type="text" 
                  autoComplete="off"
                  placeholder="e.g. Vikram Sharma" 
                  value={formData.name || ''} 
                  className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-gold" 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Student ID / Roll No</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">AUTO-FILLED</span>
                  </label>
                  <input 
                    readOnly 
                    type="text" 
                    value={formData.studentId || ''} 
                    className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg font-mono font-bold text-navy cursor-not-allowed select-none" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input 
                    required 
                    type="email" 
                    autoComplete="off"
                    placeholder="student@kalpanaaa.edu" 
                    value={formData.email || ''} 
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-gold font-mono font-bold text-navy" 
                    onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select required className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, department: e.target.value })}>
                    <option value="">Select Dept</option>
                    {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester</label>
                  <select required value={formData.semester || 'Semester 1'} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-navy focus:border-gold focus:outline-none" onChange={e => setFormData({ ...formData, semester: e.target.value })}>
                    {(String(formData.department || '').toLowerCase().includes('management') || String(formData.department || '').toLowerCase().includes('mba') ? SEMESTERS.slice(0, 4) : SEMESTERS).map(s => (
                      <option key={s.sem} value={s.sem}>{s.sem} ({s.year})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Login Password</label>
                  <input required type="password" autoComplete="new-password" value={formData.password || ''} placeholder="Enter password" className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, password: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-navy text-gold font-bold rounded-lg hover:bg-navy-light">Create Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'teacher' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">Register New Faculty Staff</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-navy"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateTeacher} className="space-y-3 text-xs" autoComplete="off">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Faculty Full Name *</label>
                <input 
                  required 
                  type="text" 
                  autoComplete="off"
                  placeholder="e.g. Dr. Sunita Patel" 
                  value={formData.name || ''} 
                  className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-gold" 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Employee ID</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">AUTO-FILLED</span>
                  </label>
                  <input 
                    type="text" 
                    readOnly 
                    value={formData.employeeId || 'EMP-119'} 
                    className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg font-num font-bold text-navy cursor-not-allowed" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institutional Email *</label>
                  <input 
                    required 
                    type="email" 
                    autoComplete="off"
                    placeholder="sunita.patel@kalpanaaa.edu" 
                    value={formData.email || ''} 
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-gold" 
                    onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select required className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, department: e.target.value })}>
                    <option value="">Select Dept</option>
                    {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation</label>
                  <input required type="text" placeholder="Associate Professor" className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <input required type="password" autoComplete="new-password" value={formData.password || ''} placeholder="Enter password" className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-navy text-gold font-bold rounded-lg hover:bg-navy-light">Register Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'dept' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">Add New Department</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-navy"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateDept} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department Name</label>
                <input required type="text" placeholder="Mechanical Engineering" className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department Code</label>
                <input required type="text" placeholder="ME" className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, code: e.target.value })} />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Head of Department (HOD) *</label>
                <select
                  required
                  value={formData.hod || ''}
                  onChange={e => setFormData({ ...formData, hod: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-navy focus:border-gold focus:outline-none"
                >
                  <option value="">Select Faculty Staff / HOD</option>
                  {teachers.map(t => (
                    <option key={t.id || t.employeeId} value={t.name}>
                      {t.name} &bull; {t.employeeId || 'EMP'} ({t.department || 'General'}) - {t.designation || 'Faculty'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea placeholder="Department overview..." className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-navy text-gold font-bold rounded-lg hover:bg-navy-light">Create Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'course' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">Create Degree Course</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-navy"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Name</label>
                <input required type="text" placeholder="B.Tech Data Science" className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Code</label>
                <input required type="text" placeholder="DS-101" className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, code: e.target.value })} />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <select required className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, department: e.target.value })}>
                  <option value="">Select Dept</option>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Duration</label>
                <input type="text" placeholder="4 Years (8 Semesters)" className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, duration: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-navy text-gold font-bold rounded-lg hover:bg-navy-light">Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'subject' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">Add Academic Subject</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-navy"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateSubject} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject Name</label>
                <input required type="text" placeholder="Data Structures & Algorithms" className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Code</label>
                  <input required type="text" placeholder="CS-301" className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, code: e.target.value })} />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester</label>
                  <input required type="text" placeholder="3rd Semester" className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, semester: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select required className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, department: e.target.value })}>
                    <option value="">Select Dept</option>
                    {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Teacher</label>
                  <select className="w-full p-2.5 border rounded-lg" onChange={e => {
                    const tch = teachers.find(t => t.employeeId === e.target.value || t.id === e.target.value);
                    setFormData({ ...formData, assignedTeacherId: e.target.value, assignedTeacherName: tch ? tch.name : '' });
                  }}>
                    <option value="">Unassigned</option>
                    {teachers.map(t => <option key={t.id} value={t.employeeId || t.id}>{t.name} ({t.department})</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-navy text-gold font-bold rounded-lg hover:bg-navy-light">Create Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'exam' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">Schedule Examination</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-navy"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateExam} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Exam Title</label>
                <input required type="text" placeholder="Spring 2026 Mid-Semester Exam" className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Type</label>
                  <select required className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option value="Mid-Term">Mid-Term</option>
                    <option value="End-Semester">End-Semester</option>
                    <option value="Internal Quiz">Internal Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course / Subject</label>
                  <select required className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-navy focus:border-gold focus:outline-none" onChange={e => {
                    const coursePool = (courses && courses.length > 0) ? courses : (subjects || []);
                    const sub = coursePool.find(s => s.code === e.target.value);
                    setFormData({
                      ...formData,
                      subjectCode: e.target.value,
                      subjectName: sub ? sub.name : '',
                      course: sub ? (sub.course || sub.name) : '',
                      department: sub ? sub.department : '',
                      semester: sub ? sub.semester : '',
                      assignedTeacherId: sub ? sub.assignedTeacherId : ''
                    });
                  }}>
                    {((courses && courses.length > 0) ? courses : (subjects || [])).map(s => <option key={s.id || s.code} value={s.code}>{s.code} - {s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input required type="date" className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room / Venue</label>
                  <input type="text" placeholder="Hall 3B" className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, room: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-navy text-gold font-bold rounded-lg hover:bg-navy-light">Schedule Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
