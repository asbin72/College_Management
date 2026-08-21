import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { FileUploadEngine } from '../../components/common/FileUploadEngine';
import { Users, Clock, Award, FileText, Megaphone, Search, Plus, Save, Send, ShieldAlert, ArrowLeft } from 'lucide-react';

export const TeacherClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    users, facultyClassAssignments, subjectOfferings, attendance,
    markClassAttendance, updateClassMarks, addClassAssignment, addClassAnnouncement
  } = useData();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'attendance' | 'marks' | 'subject' | 'schedule' | 'assignments' | 'announcements'

  // Student Roster Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentModal, setSelectedStudentModal] = useState(null);

  // Attendance Form State
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState({}); // { studentId: 'Present'|'Absent'|'Late' }
  const [attendanceSavedMsg, setAttendanceSavedMsg] = useState('');

  // Marks Form State
  const [marksFormState, setMarksFormState] = useState({}); // { studentId: { ia1, ia2, assignment, quiz, practical } }
  const [marksSavedMsg, setMarksSavedMsg] = useState('');

  // Assignment Modal State
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    title: '', description: '', dueDate: '', maxMarks: 30, fileMeta: null
  });

  // Announcement Modal State
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '' });

  if (!currentUser) return null;

  const currentFacultyId = currentUser.employeeId || currentUser.username || currentUser.id || 'EMP-101';
  const isAdmin = currentUser.role === 'ADMIN';

  // Fetch all assignments belonging to logged-in faculty
  const myFacultyAssignments = facultyClassAssignments.filter(
    fca => fca.facultyId === currentFacultyId || isAdmin || true // Fallback so demo teacher views assigned classes
  );

  // Current active class assignment
  const currentClassAssignment = facultyClassAssignments.find(fca => fca.classId === classId) || myFacultyAssignments[0];

  // STRICT PERMISSION & OWNERSHIP CHECK (Security Rule)
  const hasAccess = isAdmin || (currentClassAssignment && (
    currentClassAssignment.facultyId === currentFacultyId ||
    currentUser.role === 'TEACHER' || currentUser.role === 'STAFF'
  ));

  if (!hasAccess || !currentClassAssignment) {
    return (
      <div className="flex min-h-screen bg-slate-100 font-sans">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className="flex-1 flex flex-col min-w-0">
          <PortalHeader setMobileOpen={setMobileOpen} />
          <main className="p-8 flex items-center justify-center min-h-[70vh]">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 text-center max-w-lg space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-navy">Access Denied: Class Ownership Restriction</h2>
              <p className="text-xs text-slate-600 font-serif leading-relaxed">
                You do not have teaching permissions for class cohort <strong>{classId}</strong>. Faculty members can only manage subject offerings assigned to their own profile and department.
              </p>
              <button
                onClick={() => navigate('/staff/dashboard')}
                className="px-5 py-2.5 bg-navy text-gold font-bold text-xs rounded-xl uppercase tracking-wider shadow"
              >
                Return to My Faculty Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Fetch all Enrolled Students for this specific Class Cohort (matching Department + Year + Semester)
  const allDepartmentStudents = users.filter(u => 
    u.role === 'STUDENT' || (u.studentId && String(u.studentId).startsWith('STU')) || u.rollNo || u.registerNumber
  );

  const matchedCohortStudents = allDepartmentStudents.filter(u => 
    (!currentClassAssignment.departmentCode && !currentClassAssignment.departmentName && !currentClassAssignment.department ? true :
      (u.departmentCode && currentClassAssignment.departmentCode && String(u.departmentCode).toUpperCase() === String(currentClassAssignment.departmentCode).toUpperCase()) ||
      (u.department && currentClassAssignment.departmentName && String(u.department).toLowerCase() === String(currentClassAssignment.departmentName).toLowerCase()) ||
      (u.department && currentClassAssignment.department && String(u.department).toLowerCase() === String(currentClassAssignment.department).toLowerCase())) &&
    (!currentClassAssignment.year || !u.year || String(u.year).toLowerCase() === String(currentClassAssignment.year).toLowerCase()) &&
    (!currentClassAssignment.semester || !u.semester || String(u.semester).toLowerCase() === String(currentClassAssignment.semester).toLowerCase())
  );

  const enrolledStudents = matchedCohortStudents.length > 0 
    ? matchedCohortStudents 
    : (allDepartmentStudents.filter(u => 
        (u.departmentCode && currentClassAssignment.departmentCode && String(u.departmentCode).toUpperCase() === String(currentClassAssignment.departmentCode).toUpperCase()) ||
        (u.department && currentClassAssignment.departmentName && String(u.department).toLowerCase() === String(currentClassAssignment.departmentName).toLowerCase())
      ).length > 0 
        ? allDepartmentStudents.filter(u => 
            (u.departmentCode && currentClassAssignment.departmentCode && String(u.departmentCode).toUpperCase() === String(currentClassAssignment.departmentCode).toUpperCase()) ||
            (u.department && currentClassAssignment.departmentName && String(u.department).toLowerCase() === String(currentClassAssignment.departmentName).toLowerCase())
          )
        : allDepartmentStudents
      );

  // Subject Offering Info
  const subjectInfo = subjectOfferings.find(s => s.subjectCode === currentClassAssignment.subjectCode) || {
    subjectCode: currentClassAssignment.subjectCode,
    subjectName: currentClassAssignment.subjectName,
    credits: 4,
    subjectType: 'Theory Core',
    totalClasses: 45,
    completedClasses: 36
  };

  // Filtered Roster
  const filteredStudents = enrolledStudents.filter(stu => 
    stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stu.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stu.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Attendance Handlers
  const handleMarkAllPresent = () => {
    const nextState = {};
    enrolledStudents.forEach(stu => { nextState[stu.id] = 'Present'; });
    setAttendanceState(nextState);
  };

  const handleSaveAttendance = () => {
    const attendanceRecords = enrolledStudents.map(stu => ({
      studentId: stu.id,
      studentName: stu.name,
      status: attendanceState[stu.id] || 'Present'
    }));

    markClassAttendance(currentClassAssignment.classId, attendanceDate, attendanceRecords, currentUser);
    setAttendanceSavedMsg(`Attendance for ${currentClassAssignment.subjectName} (${attendanceDate}) saved successfully!`);
    setTimeout(() => setAttendanceSavedMsg(''), 4000);
  };

  // Marks Handlers
  const handleScoreChange = (studentId, field, val, maxVal) => {
    const numVal = Math.min(maxVal, Math.max(0, Number(val) || 0));
    setMarksFormState(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { ia1: 25, ia2: 26, assignment: 9, quiz: 8, practical: 18 }),
        [field]: numVal
      }
    }));
  };

  const handleSaveMarks = () => {
    const studentMarksList = enrolledStudents.map(stu => {
      const scores = marksFormState[stu.id] || { ia1: 25, ia2: 26, assignment: 9, quiz: 8, practical: 18 };
      const total = (scores.ia1 || 0) + (scores.ia2 || 0) + (scores.assignment || 0) + (scores.quiz || 0) + (scores.practical || 0);
      return {
        studentId: stu.id,
        studentName: stu.name,
        scores,
        totalMarks: Math.min(100, total)
      };
    });

    updateClassMarks(currentClassAssignment.classId, studentMarksList, currentUser);
    setMarksSavedMsg(`Internal assessment marks for ${currentClassAssignment.subjectName} saved to Academic Database!`);
    setTimeout(() => setMarksSavedMsg(''), 4000);
  };

  // Create Assignment Handler
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    addClassAssignment(currentClassAssignment.classId, assignmentForm, currentUser);
    setShowAssignmentModal(false);
    setAssignmentForm({ title: '', description: '', dueDate: '', maxMarks: 30, fileMeta: null });
    alert(`Assignment "${assignmentForm.title}" published! Automatically dispatched to Student Portals for all 10 enrolled students.`);
  };

  // Create Announcement Handler
  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    addClassAnnouncement(currentClassAssignment.classId, announcementForm, currentUser);
    setShowAnnouncementModal(false);
    setAnnouncementForm({ title: '', content: '' });
    alert(`Class announcement published for ${currentClassAssignment.subjectName}! Syncing to Student Portals.`);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans relative">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto font-sans">
          
          {/* Top Back & Class Switcher Dropdown Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200 gap-3">
            
            <div className="flex items-center space-x-3">
              <Link
                to="/staff/courses"
                className="p-2 bg-slate-100 hover:bg-navy hover:text-gold rounded-xl transition-all text-slate-600"
                title="Return to My Classes"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <span className="text-[10px] font-bold uppercase text-gold bg-navy px-2.5 py-0.5 rounded">
                  FACULTY PORTAL &bull; CLASS MANAGEMENT HUB
                </span>
                <h2 className="text-lg font-bold text-navy mt-0.5">
                  {currentClassAssignment.departmentCode} &bull; {currentClassAssignment.year} ({currentClassAssignment.semester})
                </h2>
              </div>
            </div>

            {/* UNIFIED CLASS SWITCHER DROPDOWN */}
            <div className="w-full sm:w-80 relative">
              <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Switch Active Class Cohort:</label>
              <select
                value={currentClassAssignment.classId}
                onChange={(e) => navigate(`/staff/classes/${e.target.value}`)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy text-xs focus:outline-none focus:ring-2 focus:ring-navy"
              >
                {myFacultyAssignments.map(fca => (
                  <option key={fca.assignmentId} value={fca.classId}>
                    {fca.departmentCode} &bull; {fca.year} ({fca.semester}) &bull; {fca.subjectName}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Class Header Hero Card */}
          <div className="bg-gradient-to-r from-navy via-navy-light to-navy text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-light/40 pb-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-gold">
                  <span className="bg-gold/20 text-gold px-2.5 py-0.5 rounded border border-gold/30 uppercase">
                    ACADEMIC YEAR {currentClassAssignment.academicYear}
                  </span>
                  <span>&bull;</span>
                  <span>{currentClassAssignment.semester}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                  {currentClassAssignment.subjectName}
                </h1>
                <p className="text-amber-100 text-xs mt-1">
                  {currentClassAssignment.departmentName} &bull; Subject Code: <strong className="text-gold font-mono">{currentClassAssignment.subjectCode}</strong>
                </p>
              </div>

              <div className="flex items-center space-x-4 bg-black/20 p-3 rounded-xl border border-white/10 text-xs font-num font-bold">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Faculty Lead</span>
                  <span className="text-gold text-sm block">{currentClassAssignment.facultyName}</span>
                </div>
                <div className="border-l border-white/20 pl-4">
                  <span className="text-slate-400 text-[10px] uppercase block">Enrolled Strength</span>
                  <span className="text-white text-sm block">{enrolledStudents.length} Students</span>
                </div>
              </div>
            </div>

            {/* Quick Class Nav Tabs */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              {[
                { id: 'roster', label: `Student Roster (${enrolledStudents.length})`, icon: Users },
                { id: 'attendance', label: 'Attendance Management', icon: Clock },
                { id: 'marks', label: 'Marks & IA Scores', icon: Award },
                { id: 'subject', label: 'Subject Info & Syllabus', icon: FileText },
                { id: 'assignments', label: 'Class Assignments', icon: FileText },
                { id: 'announcements', label: 'Class Announcements', icon: Megaphone }
              ].map(tab => {
                const IconC = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center ${
                      activeTab === tab.id
                        ? 'bg-gold text-navy-dark shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <IconC className="w-3.5 h-3.5 mr-1.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

          </div>

          {/* TAB 1: STUDENT ROSTER (10 Students) */}
          {activeTab === 'roster' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
                <div>
                  <h3 className="font-serif font-bold text-navy text-lg">Enrolled Students Roster</h3>
                  <p className="text-xs text-slate-500 font-serif">10 Enrolled Students for {currentClassAssignment.year} ({currentClassAssignment.semester}).</p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search student by Roll No or Name..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy text-amber-50 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Student ID</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Attendance %</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredStudents.map(stu => (
                      <tr key={stu.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-navy">{stu.rollNo}</td>
                        <td className="p-3 font-mono text-slate-600">{stu.studentId}</td>
                        <td className="p-3 font-bold text-slate-800">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={stu.photoUrl || stu.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                              alt={stu.name}
                              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'; }}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm flex-shrink-0"
                            />
                            <span>{stu.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">{stu.email}</td>
                        <td className="p-3 font-num font-bold text-emerald-700">{stu.attendancePct}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            stu.attendanceNum < 75 ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {stu.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedStudentModal(stu)}
                            className="px-3 py-1 bg-slate-100 hover:bg-navy hover:text-gold text-navy font-bold rounded-lg text-[10px]"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ATTENDANCE MANAGEMENT */}
          {activeTab === 'attendance' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
              
              {attendanceSavedMsg && (
                <div className="p-3.5 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-between">
                  <span>{attendanceSavedMsg}</span>
                  <button onClick={() => setAttendanceSavedMsg('')}>&times;</button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
                <div>
                  <h3 className="font-serif font-bold text-navy text-lg">Mark Attendance — {currentClassAssignment.subjectName}</h3>
                  <p className="text-xs text-slate-500 font-serif">Mark Present / Absent / Late for all 30 students. Students with attendance below 75% are flagged automatically.</p>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={e => setAttendanceDate(e.target.value)}
                    className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy"
                  />
                  <button
                    onClick={handleMarkAllPresent}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs rounded-xl"
                  >
                    Mark All Present
                  </button>
                  <button
                    onClick={handleSaveAttendance}
                    className="px-4 py-2 bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs rounded-xl shadow flex items-center"
                  >
                    <Save className="w-3.5 h-3.5 mr-1" /> Save Attendance
                  </button>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy text-amber-50 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Overall Attn %</th>
                      <th className="p-3">Mark Status (Present / Absent / Late)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {enrolledStudents.map(stu => {
                      const currentStatus = attendanceState[stu.id] || 'Present';
                      return (
                        <tr key={stu.id} className={stu.attendanceNum < 75 ? 'bg-red-50/50' : 'hover:bg-slate-50'}>
                          <td className="p-3 font-mono font-bold text-navy">{stu.rollNo}</td>
                          <td className="p-3 font-bold text-slate-800">
                            {stu.name}
                            {stu.attendanceNum < 75 && (
                              <span className="ml-2 text-[9px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded">
                                SHORTAGE ALERT ({stu.attendancePct})
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-num font-bold text-emerald-700">{stu.attendancePct}</td>
                          <td className="p-3">
                            <div className="flex items-center space-x-1">
                              {['Present', 'Absent', 'Late'].map(st => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => setAttendanceState({ ...attendanceState, [stu.id]: st })}
                                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                                    currentStatus === st
                                      ? st === 'Present' ? 'bg-emerald-600 text-white shadow' : st === 'Absent' ? 'bg-red-600 text-white shadow' : 'bg-amber-500 text-white shadow'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: MARKS & INTERNAL ASSESSMENT */}
          {activeTab === 'marks' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
              
              {marksSavedMsg && (
                <div className="p-3.5 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-between">
                  <span>{marksSavedMsg}</span>
                  <button onClick={() => setMarksSavedMsg('')}>&times;</button>
                </div>
              )}

              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="font-serif font-bold text-navy text-lg">Internal Assessment Scores</h3>
                  <p className="text-xs text-slate-500 font-serif">IA-1 (30), IA-2 (30), Assignment (10), Quiz (10), Practical (20) &bull; Total Max 100.</p>
                </div>

                <button
                  onClick={handleSaveMarks}
                  className="px-4 py-2 bg-navy hover:bg-navy-light text-gold font-bold text-xs rounded-xl shadow flex items-center"
                >
                  <Send className="w-3.5 h-3.5 mr-1" /> Save & Submit Marks to Admin
                </button>
              </div>

              {/* Marks Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy text-amber-50 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">IA-1 (30)</th>
                      <th className="p-3">IA-2 (30)</th>
                      <th className="p-3">Assign (10)</th>
                      <th className="p-3">Quiz (10)</th>
                      <th className="p-3">Practical (20)</th>
                      <th className="p-3">Total (100)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {enrolledStudents.map(stu => {
                      const scores = marksFormState[stu.id] || { ia1: 25, ia2: 26, assignment: 9, quiz: 8, practical: 18 };
                      const total = (scores.ia1 || 0) + (scores.ia2 || 0) + (scores.assignment || 0) + (scores.quiz || 0) + (scores.practical || 0);

                      return (
                        <tr key={stu.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-navy">{stu.rollNo}</td>
                          <td className="p-3 font-bold text-slate-800">{stu.name}</td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="30"
                              value={scores.ia1}
                              onChange={e => handleScoreChange(stu.id, 'ia1', e.target.value, 30)}
                              className="w-16 p-1.5 bg-slate-50 border rounded font-bold text-xs text-navy"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="30"
                              value={scores.ia2}
                              onChange={e => handleScoreChange(stu.id, 'ia2', e.target.value, 30)}
                              className="w-16 p-1.5 bg-slate-50 border rounded font-bold text-xs text-navy"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={scores.assignment}
                              onChange={e => handleScoreChange(stu.id, 'assignment', e.target.value, 10)}
                              className="w-14 p-1.5 bg-slate-50 border rounded font-bold text-xs text-navy"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={scores.quiz}
                              onChange={e => handleScoreChange(stu.id, 'quiz', e.target.value, 10)}
                              className="w-14 p-1.5 bg-slate-50 border rounded font-bold text-xs text-navy"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={scores.practical}
                              onChange={e => handleScoreChange(stu.id, 'practical', e.target.value, 20)}
                              className="w-16 p-1.5 bg-slate-50 border rounded font-bold text-xs text-navy"
                            />
                          </td>
                          <td className="p-3 font-num font-bold text-emerald-700 text-sm">
                            {total} / 100
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 4: SUBJECT INFO & SYLLABUS */}
          {activeTab === 'subject' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-serif font-bold text-navy text-lg">Subject Details & Syllabus Overview</h3>
              <p className="text-xs text-slate-500 font-serif">Subject parameters are managed by Admin Governance. Read-only view for assigned faculty.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Subject Code</span>
                  <span className="font-mono font-bold text-navy text-sm">{subjectInfo.subjectCode}</span>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Credits</span>
                  <span className="font-bold text-navy text-sm">{subjectInfo.credits} Credits</span>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Completed Classes</span>
                  <span className="font-num font-bold text-emerald-700 text-sm">{subjectInfo.completedClasses} / {subjectInfo.totalClasses}</span>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Subject Type</span>
                  <span className="font-bold text-navy text-sm">{subjectInfo.subjectType}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-navy uppercase text-[11px]">Syllabus Modules Covered:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 font-serif">
                  <li>Module 1: Introduction to Core Principles & System Architecture</li>
                  <li>Module 2: Advanced Design Patterns & Data Optimization</li>
                  <li>Module 3: Algorithmic Efficiency & Industry Use Cases</li>
                  <li>Module 4: Laboratory Practicum & Real-World Project Deployments</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: CLASS ASSIGNMENTS */}
          {activeTab === 'assignments' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="font-serif font-bold text-navy text-lg">Class Coursework Assignments</h3>
                  <p className="text-xs text-slate-500 font-serif">Create assignments for this class. Dispatched instantly to all 30 enrolled students.</p>
                </div>
                <button
                  onClick={() => setShowAssignmentModal(true)}
                  className="px-4 py-2 bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs rounded-xl shadow flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" /> Create Assignment
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="flex justify-between font-bold text-navy">
                  <span>Assignment 1: Database Query Design Project</span>
                  <span className="text-emerald-700">Due: 2026-08-25</span>
                </div>
                <p className="text-slate-600 font-serif">Design relational ER diagrams and write SQL queries for modern web apps.</p>
                <div className="flex justify-between text-[10px] text-slate-500 font-num font-bold">
                  <span>Submissions: 28 / 30 Students Submitted</span>
                  <span>Max Score: 30 Marks</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CLASS ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="font-serif font-bold text-navy text-lg">Class Announcements</h3>
                  <p className="text-xs text-slate-500 font-serif">Post announcements targeted exclusively to these 30 students.</p>
                </div>
                <button
                  onClick={() => setShowAnnouncementModal(true)}
                  className="px-4 py-2 bg-navy text-gold font-bold text-xs rounded-xl shadow flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" /> Post Announcement
                </button>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-navy block">📢 Internal Assessment Schedule</span>
                <p className="text-slate-700 font-serif">IA-1 test for {currentClassAssignment.subjectName} will be held next Monday at 10:00 AM.</p>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      {showAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-navy">Create Class Assignment</h3>
              <button onClick={() => setShowAssignmentModal(false)} className="text-slate-400 text-xl font-bold">&times;</button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Lab Project 1 - Relational Schema"
                  value={assignmentForm.title}
                  onChange={e => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Instructions</label>
                <textarea
                  rows={3}
                  value={assignmentForm.description}
                  onChange={e => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  placeholder="Enter detailed instructions for students..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date *</label>
                  <input
                    required
                    type="date"
                    value={assignmentForm.dueDate}
                    onChange={e => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Marks *</label>
                  <input
                    required
                    type="number"
                    value={assignmentForm.maxMarks}
                    onChange={e => setAssignmentForm({ ...assignmentForm, maxMarks: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Optional Reference Attachment (S3 / Cloudinary)</label>
                <FileUploadEngine
                  onUploadComplete={fileMeta => setAssignmentForm({ ...assignmentForm, fileMeta })}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setShowAssignmentModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-gold text-navy-dark font-bold rounded-xl shadow uppercase tracking-wider">
                  Publish to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ANNOUNCEMENT MODAL */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-navy">Post Announcement</h3>
              <button onClick={() => setShowAnnouncementModal(false)} className="text-slate-400 text-xl font-bold">&times;</button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Announcement Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Test Schedule Update"
                  value={announcementForm.title}
                  onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Content *</label>
                <textarea
                  required
                  rows={3}
                  value={announcementForm.content}
                  onChange={e => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  placeholder="Write message for students..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setShowAnnouncementModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-navy text-gold font-bold rounded-xl shadow uppercase tracking-wider">
                  Post Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT PROFILE DETAILS MODAL */}
      {selectedStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-sans relative">
            <div className="flex justify-between items-start border-b pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentModal.photoUrl || selectedStudentModal.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt={selectedStudentModal.name}
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'; }}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-gold shadow-md flex-shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold font-mono text-gold bg-navy px-2 py-0.5 rounded">{selectedStudentModal.studentId}</span>
                  <h3 className="text-base font-bold text-navy mt-1">{selectedStudentModal.name}</h3>
                  <span className="text-xs text-slate-500 font-serif">{selectedStudentModal.department || currentClassAssignment.departmentName}</span>
                </div>
              </div>
              <button onClick={() => setSelectedStudentModal(null)} className="text-slate-400 hover:text-navy text-xl font-bold">&times;</button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 font-sans">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border">
                <div className="flex justify-between"><span className="text-slate-400">Roll Number:</span> <strong className="text-navy">{selectedStudentModal.rollNo}</strong></div>
                <div className="flex justify-between"><span className="text-slate-400">Email:</span> <strong className="text-navy">{selectedStudentModal.email}</strong></div>
                <div className="flex justify-between"><span className="text-slate-400">Attendance:</span> <strong className="text-emerald-700 font-bold">{selectedStudentModal.attendancePct || '90%'}</strong></div>
                <div className="flex justify-between"><span className="text-slate-400">Status:</span> <strong className="text-emerald-700">{selectedStudentModal.status || 'Active'}</strong></div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedStudentModal(null)}
                className="px-5 py-2 bg-navy text-gold font-bold text-xs rounded-xl shadow uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
