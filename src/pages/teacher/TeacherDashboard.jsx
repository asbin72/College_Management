import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { Clock, AlertCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getEnrolledStudentCount } from '../../utils/idGenerator';

export const TeacherDashboard = () => {
  const { currentUser } = useAuth();
  const { facultyClassAssignments, users = [], leaveRequests, helpdesk, announcements, attendance, examinations } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  if (!currentUser) return null;

  const currentFacultyId = currentUser.employeeId || currentUser.username || currentUser.id || 'EMP-101';
  const teacherName = currentUser.name || 'Faculty Member';
  const teacherId = currentFacultyId;
  const teacherDept = currentUser.department || 'Computer Science and Engineering';

  const [liveSummary, setLiveSummary] = useState(null);

  React.useEffect(() => {
    async function fetchSummary() {
      try {
        const getApiBase = () => {
          if (import.meta.env.VITE_API_BASE) return import.meta.env.VITE_API_BASE;
          if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return 'https://collegemanagement-production.up.railway.app/api';
          }
          return 'http://localhost:5000/api';
        };
        const res = await fetch(`${getApiBase()}/teachers/${teacherId}/dashboard-summary`);
        if (res.ok) {
          const data = await res.json();
          setLiveSummary(data);
        }
      } catch (e) {}
    }
    if (teacherId) fetchSummary();
  }, [teacherId]);

  // Get all assignments for this faculty (or fallback for demo teacher)
  const myAssignments = facultyClassAssignments.filter(
    fca => fca.facultyId === teacherId || fca.facultyName === teacherName
  );

  // Fallback to demo CSE classes if teacherId hasn't been set
  const activeAssignments = myAssignments.length > 0 ? myAssignments : facultyClassAssignments.slice(0, 3);

  // ── Dynamic: total students across all assigned classes ───────────────────
  const totalStudentsCount = activeAssignments.reduce((acc, curr) => acc + getEnrolledStudentCount(curr, users), 0);

  // ── Dynamic: average students per class ───────────────────────────────────
  const avgStudentsPerClass = activeAssignments.length > 0
    ? Math.round(totalStudentsCount / activeAssignments.length)
    : 0;

  // ── Dynamic: per-class attendance from attendance records ─────────────────
  const getClassAttendance = (classId) => {
    const classRecords = attendance.filter(a => a.classId === classId || a.subjectCode === classId);
    if (!classRecords.length) return null;
    const presentCount = classRecords.filter(a =>
      (a.status || '').toLowerCase() === 'present'
    ).length;
    return Math.round((presentCount / classRecords.length) * 100);
  };

  // ── Dynamic: overall average attendance rate across all assigned classes ──
  const classAttendanceRates = activeAssignments.map(fca => {
    const classRecords = attendance.filter(
      a => a.classId === fca.classId || a.subjectCode === fca.subjectCode
    );
    if (!classRecords.length) return null;
    const presentCount = classRecords.filter(a =>
      (a.status || '').toLowerCase() === 'present'
    ).length;
    return (presentCount / classRecords.length) * 100;
  }).filter(r => r !== null);

  const avgAttendanceRate = classAttendanceRates.length > 0
    ? (classAttendanceRates.reduce((sum, r) => sum + r, 0) / classAttendanceRates.length).toFixed(1)
    : null;

  const COLLEGE_THRESHOLD = 75;
  const attendanceAboveThreshold = avgAttendanceRate !== null && parseFloat(avgAttendanceRate) >= COLLEGE_THRESHOLD;

  // ── Dynamic: academic year from current date ──────────────────────────────
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  // Academic year starts in June: Jun-Dec → currentYear/currentYear+1, Jan-May → prev/current
  const academicStartYear = currentMonth >= 6 ? currentYear : currentYear - 1;
  const academicYear = `${academicStartYear}-${academicStartYear + 1}`;

  // ── Dynamic: timetable slots from examinations or derived from class index ─
  const DEFAULT_SLOTS = [
    { time: '09:00 AM - 10:30 AM', hall: 'Hall A1' },
    { time: '10:45 AM - 12:15 PM', hall: 'Hall B2' },
    { time: '01:30 PM - 03:00 PM', hall: 'Hall C3' },
    { time: '03:15 PM - 04:45 PM', hall: 'Hall D4' },
    { time: '08:00 AM - 09:30 AM', hall: 'Hall E5' },
    { time: '11:00 AM - 12:30 PM', hall: 'Hall F6' },
  ];

  const getTimetableSlot = (fca, idx) => {
    const today = new Date().toISOString().split('T')[0];
    const examMatch = examinations.find(
      ex =>
        (ex.subjectCode === fca.subjectCode || ex.subject === fca.subjectName) &&
        (ex.classId === fca.classId || ex.department === fca.departmentCode) &&
        ex.date >= today
    );
    if (examMatch?.time) {
      return { time: examMatch.time, hall: examMatch.venue || examMatch.hall || `Hall ${fca.departmentCode || 'A'}` };
    }
    const slotIndex = idx % DEFAULT_SLOTS.length;
    const slot = DEFAULT_SLOTS[slotIndex];
    const hallLetter = fca.classId
      ? String.fromCharCode(65 + (fca.classId.charCodeAt(fca.classId.length - 1) % 6))
      : String.fromCharCode(65 + slotIndex);
    return { time: slot.time, hall: `Hall ${hallLetter}${idx + 1}` };
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans relative">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto font-sans">
          
          {/* Welcome Banner */}
          <div className="bg-white text-slate-800 p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.photoUrl || currentUser.avatar || currentUser.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'}
                  alt={teacherName}
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'; }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-gold shadow-md flex-shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-navy text-[10px] font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded font-sans border border-gold/30">
                      FACULTY PORTAL &bull; {teacherDept}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-sans font-bold text-navy mt-1.5 tracking-tight">
                    Welcome back, {teacherName}!
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-serif mt-1">
                    Faculty ID: <strong className="font-mono text-navy">{teacherId}</strong> &bull; Department: <strong>{teacherDept}</strong>
                  </p>
                </div>
              </div>

              {/* Class Switcher Quick Bar */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Class Cohort Switcher:</span>
                <select
                  onChange={(e) => e.target.value && navigate(`/staff/classes/${e.target.value}`)}
                  className="p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-navy focus:outline-none"
                >
                  <option value="">-- Jump to Assigned Class --</option>
                  {activeAssignments.map(fca => (
                    <option key={fca.assignmentId} value={fca.classId}>
                      {fca.departmentCode} &bull; {fca.year} ({fca.semester}) &bull; {fca.subjectName}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Classes</span>
              <span className="text-2xl font-bold text-navy block mt-1 font-num">{activeAssignments.length} Classes</span>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 block">Active Teaching Cohorts</span>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Managed Students</span>
              <span className="text-2xl font-bold text-navy block mt-1 font-num">{totalStudentsCount} Students</span>
              <span className="text-[10px] text-slate-500 font-bold mt-1 block">
                {avgStudentsPerClass > 0 ? `~${avgStudentsPerClass} Students / Class` : `${activeAssignments.length} Class${activeAssignments.length !== 1 ? 'es' : ''}`}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Attendance Rate</span>
              {avgAttendanceRate !== null ? (
                <>
                  <span className={`text-2xl font-bold block mt-1 font-num ${attendanceAboveThreshold ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {avgAttendanceRate}%
                  </span>
                  <span className={`text-[10px] font-bold mt-1 block ${attendanceAboveThreshold ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {attendanceAboveThreshold ? 'Above College Threshold' : 'Below 75% Threshold'}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-bold text-slate-400 block mt-1 font-num">—</span>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">No records yet</span>
                </>
              )}
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academic Year</span>
              <span className="text-xl font-bold text-navy block mt-1 font-num">{academicYear}</span>
              <span className="text-[10px] text-slate-500 font-bold mt-1 block">
                {currentMonth >= 6 ? 'Odd Semester (Aug–Dec)' : 'Even Semester (Jan–May)'}
              </span>
            </div>
          </div>

          {/* PROMINENT "MY CLASSES" SECTION */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-serif font-bold text-navy">My Assigned Teaching Classes</h2>
                <p className="text-xs text-slate-500 font-serif">Manage all assigned subject cohorts from a single unified portal.</p>
              </div>

              <Link
                to="/staff/courses"
                className="text-xs font-bold text-navy hover:text-gold flex items-center"
              >
                View Full Classes Roster <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeAssignments.map((fca, idx) => {
                const classAttPct = getClassAttendance(fca.classId || fca.subjectCode);
                const enrolledCount = getEnrolledStudentCount(fca, users);
                return (
                  <div key={fca.assignmentId} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-gold hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="bg-navy text-gold text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                          {fca.departmentCode} &bull; {fca.year}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold font-mono">
                          {fca.semester}
                        </span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-navy leading-snug">
                        {fca.subjectName}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">Subject Code: {fca.subjectCode}</p>
                    </div>

                    <div className="p-3 bg-slate-50 border rounded-xl grid grid-cols-2 gap-2 text-xs font-sans">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Enrolled Strength</span>
                        <span className="font-bold text-navy">
                          {enrolledCount > 0 ? `${enrolledCount} Students` : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Avg Attendance</span>
                        {classAttPct !== null ? (
                          <span className={`font-bold ${classAttPct >= COLLEGE_THRESHOLD ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {classAttPct}%
                          </span>
                        ) : (
                          <span className="font-bold text-slate-400">—</span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => navigate(`/staff/classes/${fca.classId}`)}
                        className="flex-1 py-2.5 bg-navy hover:bg-navy-light text-gold font-bold text-xs rounded-xl shadow uppercase tracking-wider text-center"
                      >
                        Manage Class
                      </button>
                      <button
                        onClick={() => navigate(`/staff/classes/${fca.classId}`)}
                        className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs rounded-xl"
                        title="Attendance"
                      >
                        Attendance
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Today's Schedule & Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-serif font-bold text-navy text-base flex items-center">
                <Clock className="w-4 h-4 text-gold mr-2" /> Today's Lecture Timetable
              </h3>
              <div className="space-y-3">
                {liveSummary && Array.isArray(liveSummary.todayClasses) && liveSummary.todayClasses.length > 0 ? (
                  liveSummary.todayClasses.map((slot, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-navy block">{slot.subjectCode} - {slot.subjectName}</span>
                        <span className="text-slate-500 font-serif text-[11px]">{slot.department} &bull; {slot.semester} (Sec {slot.section})</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-gold bg-navy px-2 py-0.5 rounded text-[11px]">
                          {slot.period} &bull; {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{slot.room || 'Room 101'}</span>
                      </div>
                    </div>
                  ))
                ) : activeAssignments.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No classes assigned yet.</p>
                ) : (
                  activeAssignments.map((fca, idx) => {
                    const slot = getTimetableSlot(fca, idx);
                    return (
                      <div key={idx} className="p-3.5 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-navy block">{fca.subjectName}</span>
                          <span className="text-slate-500 font-serif text-[11px]">{fca.departmentCode} &bull; {fca.year} ({fca.semester})</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-gold bg-navy px-2 py-0.5 rounded text-[11px]">
                            {slot.time}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{slot.hall}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-serif font-bold text-navy text-base flex items-center">
                <AlertCircle className="w-4 h-4 text-gold mr-2" /> Recent Faculty Announcements
              </h3>
              <div className="space-y-3 text-xs">
                {announcements.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No announcements available.</p>
                ) : (
                  announcements.slice(0, 3).map((ann, i) => (
                    <div key={i} className="p-3.5 bg-slate-50 border rounded-xl space-y-1">
                      <span className="font-bold text-navy block">{ann.title}</span>
                      <p className="text-slate-600 font-serif">{ann.content}</p>
                      <span className="text-[10px] text-slate-400 block">{ann.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};
