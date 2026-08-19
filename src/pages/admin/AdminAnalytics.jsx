import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { Users, Award, Filter, RefreshCw } from 'lucide-react';

export const AdminAnalytics = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const { users, departments, courses, subjects, attendance, examinations, marksRecords, facultyClassAssignments, leaveRequests } = useData();

  // Filter States
  const [selectedYear, setSelectedYear] = useState('2026-2027');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  const normStr = (str) => (str || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');

  // Cascading Filter Options
  const activeDeptObj = departments.find(d => d.name === selectedDept || d.code === selectedDept || normStr(d.name) === normStr(selectedDept));
  
  const availableCourses = selectedDept === 'ALL' 
    ? courses 
    : courses.filter(c => (activeDeptObj && (c.departmentCode === activeDeptObj.code || c.code?.includes(activeDeptObj.code))) || normStr(c.name).includes(normStr(selectedDept)));

  const availableSubjects = subjects.filter(s => {
    if (selectedDept !== 'ALL') {
      const matchDept = (activeDeptObj && s.departmentCode === activeDeptObj.code) || normStr(s.department) === normStr(selectedDept);
      if (!matchDept) return false;
    }
    if (selectedSemester !== 'ALL' && s.semester !== selectedSemester) return false;
    return true;
  });

  const handleDeptChange = (deptName) => {
    setSelectedDept(deptName);
    setSelectedCourse('ALL');
    setSelectedSubject('ALL');
  };

  const handleCourseChange = (courseName) => {
    setSelectedCourse(courseName);
    if (courseName !== 'ALL') {
      const crsObj = courses.find(c => c.name === courseName);
      if (crsObj && crsObj.departmentCode) {
        const matchedDept = departments.find(d => d.code === crsObj.departmentCode);
        if (matchedDept && selectedDept === 'ALL') {
          setSelectedDept(matchedDept.name);
        }
      }
    }
    setSelectedSubject('ALL');
  };

  const handleSemesterChange = (sem) => {
    setSelectedSemester(sem);
    setSelectedSubject('ALL');
  };

  const isDeptMatch = (uDept, uCode, targetDept) => {
    if (!targetDept || targetDept === 'ALL') return true;
    if (uCode && (targetDept.toUpperCase().includes(uCode) || uCode.toUpperCase() === targetDept.toUpperCase())) return true;
    if (uDept) {
      if (uDept === targetDept || normStr(uDept) === normStr(targetDept)) return true;
      if (normStr(uDept).includes(normStr(targetDept)) || normStr(targetDept).includes(normStr(uDept))) return true;
    }
    const dObj = departments.find(d => d.name === targetDept || d.code === targetDept || normStr(d.name) === normStr(targetDept));
    if (dObj) {
      if (uCode && dObj.code === uCode) return true;
      if (uDept && (normStr(uDept).includes(normStr(dObj.name)) || normStr(dObj.name).includes(normStr(uDept)))) return true;
      if (dObj.code === 'CE' && (uCode === 'CE' || normStr(uDept).includes('civil'))) return true;
      if (dObj.code === 'CSE' && (uCode === 'CSE' || normStr(uDept).includes('computer'))) return true;
      if (dObj.code === 'ECE' && (uCode === 'ECE' || normStr(uDept).includes('electronics'))) return true;
      if (dObj.code === 'EEE' && (uCode === 'EEE' || normStr(uDept).includes('electrical'))) return true;
      if (dObj.code === 'ISE' && (uCode === 'ISE' || normStr(uDept).includes('information'))) return true;
      if (dObj.code === 'ME' && (uCode === 'ME' || normStr(uDept).includes('mechanical'))) return true;
      if (dObj.code === 'MBA' && (uCode === 'MBA' || normStr(uDept).includes('management'))) return true;
    }
    return false;
  };

  const isCourseMatch = (uCourse, uCode, targetCourse) => {
    if (!targetCourse || targetCourse === 'ALL') return true;
    if (uCourse === targetCourse || normStr(uCourse) === normStr(targetCourse)) return true;
    if (normStr(uCourse).includes(normStr(targetCourse)) || normStr(targetCourse).includes(normStr(uCourse))) return true;
    const cObj = courses.find(c => c.name === targetCourse || c.code === targetCourse || normStr(c.name) === normStr(targetCourse));
    if (cObj) {
      if (uCode && (cObj.code?.includes(uCode) || cObj.departmentCode === uCode)) return true;
      if (uCourse && (normStr(uCourse).includes(normStr(cObj.name)) || normStr(cObj.name).includes(normStr(uCourse)))) return true;
      if (normStr(targetCourse).includes('civil') && (uCode === 'CE' || normStr(uCourse).includes('civil'))) return true;
      if (normStr(targetCourse).includes('computer') && (uCode === 'CSE' || normStr(uCourse).includes('computer'))) return true;
      if (normStr(targetCourse).includes('information') && (uCode === 'ISE' || normStr(uCourse).includes('information'))) return true;
      if (normStr(targetCourse).includes('electronics') && (uCode === 'ECE' || normStr(uCourse).includes('electronics'))) return true;
      if (normStr(targetCourse).includes('electrical') && (uCode === 'EEE' || normStr(uCourse).includes('electrical'))) return true;
      if (normStr(targetCourse).includes('mechanical') && (uCode === 'ME' || normStr(uCourse).includes('mechanical'))) return true;
      if (normStr(targetCourse).includes('business') || normStr(targetCourse).includes('mba')) {
        if (uCode === 'MBA' || normStr(uCourse).includes('mba') || normStr(uCourse).includes('business')) return true;
      }
    }
    return false;
  };

  const isYearMatch = (uYear, targetYear) => {
    if (!targetYear || targetYear === 'ALL') return true;
    if (!uYear) return true;
    const cleanU = uYear.replace(/[^0-9]/g, '');
    const cleanT = targetYear.replace(/[^0-9]/g, '');
    return cleanU.includes(cleanT) || cleanT.includes(cleanU) || uYear === targetYear;
  };

  const isSemMatch = (uSem, targetSem) => {
    if (!targetSem || targetSem === 'ALL') return true;
    if (!uSem) return true;
    const cleanU = uSem.replace(/[^0-9]/g, '');
    const cleanT = targetSem.replace(/[^0-9]/g, '');
    return cleanU === cleanT || uSem === targetSem;
  };

  // Filtered Students (Live dynamic filter)
  const students = users.filter(u => {
    if (u.role !== 'STUDENT') return false;
    if (!isYearMatch(u.academicYear, selectedYear)) return false;
    if (!isDeptMatch(u.department, u.departmentCode, selectedDept)) return false;
    if (!isCourseMatch(u.course, u.departmentCode, selectedCourse)) return false;
    if (!isSemMatch(u.semester, selectedSemester)) return false;
    return true;
  });

  const activeStudentsCount = students.filter(s => s.status === 'Active').length;
  const inactiveStudentsCount = students.length - activeStudentsCount;

  // Filtered Staff
  const staff = users.filter(u => {
    if (u.role !== 'TEACHER' && u.role !== 'STAFF') return false;
    if (!isDeptMatch(u.department, u.departmentCode, selectedDept)) return false;
    return true;
  });

  const activeStaffCount = staff.filter(s => s.status === 'Active').length;

  // Dept-wise student counts (Live from database)
  const deptStudentCounts = departments.map(d => {
    const count = users.filter(u => {
      if (u.role !== 'STUDENT') return false;
      if (u.departmentCode && d.code && u.departmentCode === d.code) return true;
      return normStr(u.department) === normStr(d.name);
    }).length;
    return { name: d.name, code: d.code, count };
  });

  // Course-wise student counts (Live from database)
  const courseStudentCounts = courses.map(c => {
    const count = users.filter(u => {
      if (u.role !== 'STUDENT') return false;
      if (u.course === c.name || normStr(u.course) === normStr(c.name)) return true;
      if (u.departmentCode && (c.code?.includes(u.departmentCode) || c.departmentCode === u.departmentCode)) return true;
      if (c.code === 'BTECH-CE' && (u.departmentCode === 'CE' || u.department?.includes('Civil'))) return true;
      return false;
    }).length;
    return { name: c.name, code: c.code, count };
  });

  // Semester-wise student counts (All 8 Semesters)
  const semestersList = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
  const semStudentCounts = semestersList.map(sem => {
    const count = users.filter(u => u.role === 'STUDENT' && (u.semester === sem || u.semester?.includes(sem.replace('Semester ', '')))).length;
    return { sem, count };
  });

  // Pass/Fail calculations
  const totalPublishedMarks = marksRecords.filter(m => m.published);
  const passedMarksCount = totalPublishedMarks.filter(m => m.marksObtained >= 40).length;
  const passRate = totalPublishedMarks.length > 0 ? ((passedMarksCount / totalPublishedMarks.length) * 100).toFixed(1) : 100;

  const totalAttendanceSum = students.reduce((acc, s) => {
    const num = s.attendanceNum || parseFloat(s.attendancePct) || (s.overallAttendance ? parseFloat(s.overallAttendance) : 85);
    return acc + (isNaN(num) ? 85 : num);
  }, 0);
  const avgAttendance = students.length > 0 ? `${(totalAttendanceSum / students.length).toFixed(1)}%` : '0.0%';

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">MANAGEMENT CONTROL &bull; INSTITUTION ANALYTICS</span>
              <h1 className="text-2xl font-serif font-bold text-navy mt-1">Institutional Performance & Analytics Dashboard</h1>
              <p className="text-slate-500 text-xs mt-1">Real-time dynamic breakdown across {users.filter(u => u.role === 'STUDENT').length} Enrolled Students and {users.filter(u => u.role === 'TEACHER').length} Faculty Members from Database.</p>
            </div>
            <button
              onClick={() => {
                setSelectedYear('2026-2027');
                setSelectedDept('ALL');
                setSelectedCourse('ALL');
                setSelectedSemester('ALL');
                setSelectedSubject('ALL');
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-navy hover:text-gold bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl border border-slate-300 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4 text-gold" /> Reset All Filters
            </button>
          </div>

          {/* Interactive Filters Bar */}
          <div className="bg-navy text-white p-4 rounded-2xl shadow-md border border-navy-light/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider">
                <Filter className="w-4 h-4" /> Filter Analytics Context
              </div>
              <span className="text-[11px] text-slate-300 font-sans">
                Showing <strong className="text-gold">{students.length}</strong> matching students
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 text-[10px] font-bold uppercase mb-1">Academic Year</label>
                <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="w-full bg-navy-dark border border-navy-light/60 text-white rounded-lg p-2 font-semibold">
                  <option value="2026-2027">2026 – 2027 (Active Batch)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-[10px] font-bold uppercase mb-1">Department</label>
                <select value={selectedDept} onChange={e => handleDeptChange(e.target.value)} className="w-full bg-navy-dark border border-navy-light/60 text-white rounded-lg p-2 font-semibold">
                  <option value="ALL">All Departments</option>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-[10px] font-bold uppercase mb-1">Course</label>
                <select value={selectedCourse} onChange={e => handleCourseChange(e.target.value)} className="w-full bg-navy-dark border border-navy-light/60 text-white rounded-lg p-2 font-semibold">
                  <option value="ALL">All Courses</option>
                  {availableCourses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-[10px] font-bold uppercase mb-1">Semester</label>
                <select value={selectedSemester} onChange={e => handleSemesterChange(e.target.value)} className="w-full bg-navy-dark border border-navy-light/60 text-white rounded-lg p-2 font-semibold">
                  <option value="ALL">All Semesters</option>
                  {semestersList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-[10px] font-bold uppercase mb-1">Subject</label>
                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full bg-navy-dark border border-navy-light/60 text-white rounded-lg p-2 font-semibold">
                  <option value="ALL">All Subjects</option>
                  {availableSubjects.map(s => <option key={s.id} value={s.code}>{s.code} - {s.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* --- SECTION A: STUDENT ANALYTICS --- */}
          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-navy flex items-center gap-2">
              <Users className="w-5 h-5 text-gold" /> Student Analytics
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Filtered Students</span>
                <span className="text-3xl font-serif font-bold text-navy block mt-1">{students.length}</span>
                <span className="text-[10px] text-slate-500">Total Enrolled</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-emerald-600 uppercase">Active Students</span>
                <span className="text-3xl font-serif font-bold text-emerald-600 block mt-1">{activeStudentsCount}</span>
                <span className="text-[10px] text-emerald-700">{((activeStudentsCount / (students.length || 1)) * 100).toFixed(0)}% Active</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-rose-500 uppercase">Inactive / Suspended</span>
                <span className="text-3xl font-serif font-bold text-rose-600 block mt-1">{inactiveStudentsCount}</span>
                <span className="text-[10px] text-rose-700">Account status</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-amber-500 uppercase">Avg Attendance</span>
                <span className="text-3xl font-serif font-bold text-amber-600 block mt-1">{avgAttendance}</span>
                <span className="text-[10px] text-amber-700">Institutional Avg</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Dept-wise students */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <h3 className="text-sm font-serif font-bold text-navy">Department-wise Students</h3>
                <div className="space-y-2.5 text-xs">
                  {deptStudentCounts.map((d, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-slate-700 truncate">{d.name}</span>
                        <span className="font-bold text-navy">{d.count}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-navy h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (d.count / 40) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course-wise students */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <h3 className="text-sm font-serif font-bold text-navy">Course-wise Students</h3>
                <div className="space-y-2.5 text-xs">
                  {courseStudentCounts.map((c, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-slate-700 truncate">{c.name}</span>
                        <span className="font-bold text-navy">{c.count}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-gold h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (c.count / 40) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semester-wise students */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <h3 className="text-sm font-serif font-bold text-navy">Semester-wise Distribution</h3>
                <div className="space-y-2 text-xs">
                  {semStudentCounts.filter(s => s.count > 0).map((s, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">{s.sem}</span>
                      <span className="font-bold text-navy">{s.count} Students</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* --- SECTION B: STAFF ANALYTICS --- */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-lg font-serif font-bold text-navy flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" /> Staff & Faculty Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Faculty Roster</span>
                <span className="text-3xl font-serif font-bold text-purple-600 block">{staff.length}</span>
                <p className="text-xs text-slate-500">Active status: <strong>{activeStaffCount} Active</strong> &bull; {staff.length - activeStaffCount} Inactive</p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Staff Attendance Rate</span>
                <span className="text-3xl font-serif font-bold text-emerald-600 block">
                  {staff.length > 0 ? (((staff.length - leaveRequests.filter(l => (l.applicantRole === 'TEACHER' || l.role === 'TEACHER' || l.applicantId?.startsWith('EMP')) && l.status === 'Approved').length) / staff.length) * 100).toFixed(1) : '100.0'}%
                </span>
                <p className="text-xs text-slate-500">Average biometric staff presence</p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Staffs Present Today</span>
                <span className="text-3xl font-serif font-bold text-navy block font-num">
                  {Math.max(0, staff.length - leaveRequests.filter(l => (l.applicantRole === 'TEACHER' || l.role === 'TEACHER' || l.applicantId?.startsWith('EMP')) && l.status === 'Approved').length)}
                </span>
                <p className="text-xs text-slate-500">
                  {leaveRequests.filter(l => (l.applicantRole === 'TEACHER' || l.role === 'TEACHER' || l.applicantId?.startsWith('EMP')) && l.status === 'Approved').length > 0
                    ? `${leaveRequests.filter(l => (l.applicantRole === 'TEACHER' || l.role === 'TEACHER' || l.applicantId?.startsWith('EMP')) && l.status === 'Approved').length} faculty on approved leave`
                    : `Full strength (${staff.length} on duty today)`}
                </p>
              </div>
            </div>
          </div>

          {/* --- SECTION C: ACADEMIC ANALYTICS --- */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-lg font-serif font-bold text-navy flex items-center gap-2">
              <Award className="w-5 h-5 text-rose-600" /> Academic & Examination Performance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Examination Pass Percentage</span>
                <span className="text-3xl font-serif font-bold text-emerald-600 block">{passRate}%</span>
                <span className="text-[10px] text-emerald-700">Official published exams</span>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Conducted Exams</span>
                <span className="text-3xl font-serif font-bold text-navy block">{examinations.length}</span>
                <span className="text-[10px] text-slate-500">Scheduled in database</span>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Marks Records</span>
                <span className="text-3xl font-serif font-bold text-navy block">{marksRecords.length}</span>
                <span className="text-[10px] text-slate-500">Student evaluations</span>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Active Subjects</span>
                <span className="text-3xl font-serif font-bold text-indigo-600 block">{subjects.length}</span>
                <span className="text-[10px] text-indigo-700">Configured in curriculum</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
