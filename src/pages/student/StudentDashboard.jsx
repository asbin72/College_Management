import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { FloatingHelpdesk } from '../../components/portal/FloatingHelpdesk';
import { BookOpen, Clock, Award, DollarSign, Megaphone, Search, ArrowUpDown, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { announcements, leaveRequests, attendance = [], subjects = [], assignments = [], marksRecords = [], results = [] } = useData();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllSchedule, setShowAllSchedule] = useState(false);

  if (!currentUser) return null;

  const studentName = currentUser.name || 'Student';
  const studentCode = currentUser.studentId || currentUser.username || currentUser.id || 'STU-CSE-101';
  const studentDept = currentUser.department || 'Computer Science and Engineering';
  // Resolve Department Code accurately
  let studentDeptCode = currentUser.departmentCode;
  if (!studentDeptCode) {
    if (currentUser.studentId && currentUser.studentId.includes('-')) {
      const parts = currentUser.studentId.split('-');
      if (parts.length >= 2) studentDeptCode = parts[1];
    }
  }
  if (!studentDeptCode) {
    const dLower = (studentDept || '').toLowerCase();
    if (dLower.includes('info') || dLower.includes('ise')) studentDeptCode = 'ISE';
    else if (dLower.includes('electr') && dLower.includes('comm')) studentDeptCode = 'ECE';
    else if (dLower.includes('electr') || dLower.includes('eee')) studentDeptCode = 'EEE';
    else if (dLower.includes('mech')) studentDeptCode = 'ME';
    else if (dLower.includes('civil') || dLower.includes('ce')) studentDeptCode = 'CE';
    else if (dLower.includes('manage') || dLower.includes('mba')) studentDeptCode = 'MBA';
    else studentDeptCode = 'CSE';
  }

  // Parse numerical semester safely
  const getSemNum = (semStr, yearStr) => {
    if (semStr) {
      const match = String(semStr).match(/\d+/);
      if (match) return parseInt(match[0], 10);
    }
    if (yearStr) {
      if (yearStr.includes('1')) return 1;
      if (yearStr.includes('2')) return 3;
      if (yearStr.includes('3')) return 5;
      if (yearStr.includes('4')) return 7;
    }
    return 1;
  };

  const semNumber = getSemNum(currentUser.semester, currentUser.year);
  const semOrdinal = semNumber === 1 ? '1st' : semNumber === 2 ? '2nd' : semNumber === 3 ? '3rd' : `${semNumber}th`;
  const studentSemester = currentUser.semester || `Semester ${semNumber}`;
  const studentYear = currentUser.year || (semNumber <= 2 ? '1st Year' : semNumber <= 4 ? '2nd Year' : semNumber <= 6 ? '3rd Year' : '4th Year');
  const studentCourse = currentUser.course || `${studentDept} (${studentYear})`;

  // Compute live attendance percentage from database logs
  const myAttendanceLogs = (attendance || []).filter(a =>
    a.studentId === studentCode || a.studentId === currentUser.id
  );
  const myAttendedCount = myAttendanceLogs.filter(a => a.status === 'Present').length;
  const myTotalAttCount = myAttendanceLogs.length;
  const isNewStudent = currentUser.isNewUser || (!myTotalAttCount && (!currentUser.overallAttendance || currentUser.overallAttendance === '0%'));
  
  const studentAttendance = myTotalAttCount > 0 
    ? `${Math.round((myAttendedCount / myTotalAttCount) * 100)}%` 
    : (currentUser.overallAttendance && currentUser.overallAttendance !== '100%' ? currentUser.overallAttendance : '0%');
  
  const attNumVal = parseFloat(studentAttendance) || 0;

  // Compute live GPA from published marks & results
  const myResultSummary = (results || []).find(r => r.student_id === studentCode || r.studentId === studentCode || r.student_id === currentUser.id);
  const myPublishedMarks = (marksRecords || []).filter(m => (m.studentId === studentCode || m.studentId === currentUser.id) && (m.published === true || m.published === 1));
  const studentGpa = myResultSummary ? (myResultSummary.cgpa || myResultSummary.sgpa || '0.00') : (
    myPublishedMarks.length > 0
      ? (myPublishedMarks.reduce((acc, curr) => acc + (Number(curr.marksObtained || 0) / 25), 0) / myPublishedMarks.length).toFixed(2)
      : (currentUser.gpa && currentUser.gpa !== '3.75' ? currentUser.gpa : '0.00')
  );
  const gpaNumVal = parseFloat(studentGpa) || 0;

  const studentPendingFees = currentUser.pendingFees !== undefined ? currentUser.pendingFees : 0;

  // Dynamic class schedule matching the student's actual department & year curriculum
  const deptSubjects = subjects.filter(s => {
    const sDeptCode = (s.departmentCode || (s.code ? s.code.split('-')[0] : '')).toUpperCase();
    const codeMatch = sDeptCode === studentDeptCode.toUpperCase() || 
                      (s.department && (s.department.toLowerCase() === studentDept.toLowerCase() || s.department.toLowerCase().includes(studentDeptCode.toLowerCase())));
    if (!codeMatch) return false;
    const sSemNum = getSemNum(s.semester, s.year);
    return sSemNum === semNumber;
  });

  const fallbackSubjects = subjects.filter(s => {
    const sDeptCode = (s.departmentCode || (s.code ? s.code.split('-')[0] : '')).toUpperCase();
    return sDeptCode === studentDeptCode.toUpperCase();
  }).slice(0, 4);

  const myCurriculumSubjects = deptSubjects.length > 0 ? deptSubjects : fallbackSubjects;

  const timeslots = [
    { time: "09:30 AM - 10:45 AM", room: `${studentDeptCode} Lecture Hall 101`, status: "Completed" },
    { time: "11:00 AM - 12:15 PM", room: `${studentDeptCode} Lecture Hall 202`, status: "Ongoing" },
    { time: "02:00 PM - 03:30 PM", room: `${studentDeptCode} Advanced Lab 3`, status: "Upcoming" },
    { time: "03:45 PM - 05:00 PM", room: `${studentDeptCode} Seminar Room`, status: "Upcoming" }
  ];

  const scheduleList = timeslots.slice(0, 3).map((slot, idx) => {
    const sub = myCurriculumSubjects[idx] || myCurriculumSubjects[0] || { code: `${studentDeptCode}-10${idx + 1}`, name: `${studentDept} Core Theory ${idx + 1}` };
    return {
      time: slot.time,
      subject: `${sub.code} - ${sub.name}`,
      room: slot.room,
      teacher: sub.assignedTeacherName || 'Department Faculty',
      status: slot.status
    };
  });

  const nextLecture = scheduleList[0] || {
    time: "09:30 AM - 10:45 AM",
    subject: `${studentDeptCode}-101 ${studentDept} Foundation Lecture`,
    room: `Lecture Hall ${studentDeptCode}-101`,
    teacher: 'Department Faculty'
  };

  const visibleSchedule = showAllSchedule ? scheduleList : scheduleList.slice(0, 1);

  // Compute pending assignments dynamically
  const myPendingAssignments = (assignments || []).filter(asn => {
    const isDept = !asn.department || asn.department === studentDept || (asn.departmentCode && asn.departmentCode === studentDeptCode);
    const isCode = !asn.subjectCode || asn.subjectCode.startsWith(studentDeptCode);
    const isSem = !asn.semester || getSemNum(asn.semester, asn.year) === semNumber;
    if (!isDept && !isCode) return false;
    if (!isSem) return false;
    const hasSubmitted = (asn.submissions || []).some(s => s.studentId === studentCode || s.studentId === currentUser.id);
    return !hasSubmitted;
  });
  const pendingAssignmentsCount = isNewStudent && (!assignments || assignments.length === 0) ? 0 : myPendingAssignments.length;

  const myLeaves = leaveRequests.filter(
    l => l.applicantId === studentCode || l.applicantEmail === currentUser.email
  );

  const filteredAnnouncements = announcements.filter(a => {
    const matchesCategory = selectedCategory === 'All' || 
                            a.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans relative">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
          
          {/* Welcome Banner */}
          <div className="bg-white text-slate-800 p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-navy text-xs font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded font-sans border border-gold/30">
                STUDENT PORTAL &bull; <span className="font-num">{studentSemester}</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-sans font-bold text-navy mt-2 tracking-tight">
                Welcome back, {studentName}!
              </h1>
              <p className="font-serif text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
                Student ID: <strong className="font-num text-navy font-bold">{studentCode}</strong> &bull; Course: <strong>{studentCourse}</strong>
              </p>
            </div>
          </div>

          {/* Next Up Today Schedule Banner */}
          <div className="bg-gradient-to-r from-navy via-navy-light to-navy-dark text-white p-5 sm:p-6 rounded-2xl shadow-md border border-navy-light flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-gold text-navy-dark text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Next Lecture Today
                </span>
                <span className="text-xs text-slate-300 font-num font-bold">{nextLecture.time}</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{nextLecture.subject}</h3>
              <p className="text-xs text-slate-300 font-serif">
                Faculty: <strong>{nextLecture.teacher}</strong> &bull; Venue: <strong className="text-gold">{nextLecture.room}</strong>
              </p>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
              <Link
                to="/student/courses"
                className="px-4 py-2 bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs rounded-xl shadow transition-transform hover:scale-105 flex items-center"
              >
                <BookOpen className="w-4 h-4 mr-1.5" />
                View Subject Syllabus
              </Link>
            </div>
          </div>

          {/* Quick Metrics Grid with Visual Progress Rings & GPA Radial Gauge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* Attendance Circular Ring Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-sans font-bold text-slate-400 uppercase">Overall Attendance</span>
                <span className="text-2xl font-num font-bold text-navy block mt-1">{studentAttendance}</span>
                <span className={`font-serif text-[11px] font-semibold ${attNumVal >= 75 ? 'text-emerald-600' : attNumVal > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                  {attNumVal >= 75 ? '• Good Standing (>75%)' : attNumVal > 0 ? '• Shortage Warning (<75%)' : '• No classes logged yet'}
                </span>
              </div>
              
              {/* Circular SVG Ring */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-emerald-500" strokeDasharray={`${attNumVal}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <Clock className="w-5 h-5 text-gold absolute" />
              </div>
            </div>

            {/* GPA Radial Gauge Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-sans font-bold text-slate-400 uppercase">Cumulative GPA</span>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-2xl font-num font-bold text-navy">{studentGpa}</span>
                  <span className="text-xs font-serif text-slate-400">/ 4.0</span>
                </div>
                <span className={`font-serif text-[11px] font-semibold ${gpaNumVal >= 3.5 ? 'text-amber-600' : gpaNumVal > 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                  {gpaNumVal >= 3.5 ? '• Academic Honors' : gpaNumVal > 0 ? '• Satisfactory Standing' : '• Pending Evaluations'}
                </span>
              </div>

              {/* Radial Gauge SVG */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-amber-500" strokeDasharray={`${((gpaNumVal) / 4.0) * 100}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <Award className="w-5 h-5 text-gold absolute" />
              </div>
            </div>

            {/* Pending Assignments Metric Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-sans font-bold text-slate-400 uppercase">Pending Assignments</span>
                <span className="text-2xl font-num font-bold text-navy block mt-1">{pendingAssignmentsCount}</span>
                <span className={`font-serif text-[11px] font-semibold ${pendingAssignmentsCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {pendingAssignmentsCount > 0 ? '• Active coursework tasks' : '• All tasks completed'}
                </span>
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-100">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-sans font-bold text-slate-400 uppercase">Pending Fees</span>
                <span className="text-2xl font-num font-bold text-navy block mt-1">
                  ₹<span className="font-num">{studentPendingFees ? Number(studentPendingFees).toLocaleString() : '0'}</span>
                </span>
                <span className="font-serif text-[11px] text-slate-400">
                  {studentPendingFees > 0 ? '• Next installment due' : '• No dues pending'}
                </span>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 border border-emerald-100">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 8 Columns */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Class Schedule */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-sans font-bold text-navy tracking-tight">Today's Class Schedule</h3>
                    <button
                      type="button"
                      onClick={() => setShowAllSchedule(!showAllSchedule)}
                      className="text-xs font-bold text-gold hover:text-navy transition-colors flex items-center gap-1"
                    >
                      {showAllSchedule ? 'See Less ↑' : `See More (${scheduleList.length - 1} more) ↓`}
                    </button>
                  </div>
                  <p className="font-serif text-xs text-slate-500 mb-4">Daily timetable and lecture room allocations</p>

                  <div className="space-y-3">
                    {visibleSchedule.map((cls, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-gold uppercase font-num">{cls.time} &bull; {cls.room}</span>
                          <h4 className="text-base font-sans font-bold text-navy mt-0.5">{cls.subject}</h4>
                          <span className="font-serif text-xs text-slate-500">Faculty: {cls.teacher}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold self-start sm:self-auto font-sans ${
                          cls.status === 'Completed' ? 'bg-slate-200 text-slate-700' :
                          cls.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-800 animate-pulse' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {cls.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {!showAllSchedule && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Showing 1 of {scheduleList.length} daily lectures</span>
                    <button
                      type="button"
                      onClick={() => setShowAllSchedule(true)}
                      className="font-bold text-navy hover:text-gold transition-colors"
                    >
                      See More &rarr;
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Right 4 Columns */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Leave Requests */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-sans font-bold text-navy tracking-tight">Leave Requests</h3>
                  <Link to="/student/leave" className="text-xs font-bold text-gold hover:text-navy">View All &rarr;</Link>
                </div>
                <p className="font-serif text-xs text-slate-500 mb-4">Recent applications and status</p>

                {myLeaves.length > 0 ? (
                  <div className="space-y-3">
                    {myLeaves.slice(0, 2).map((l) => (
                      <div key={l.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-sans font-bold text-navy">{l.leaveType}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            l.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {l.status}
                          </span>
                        </div>
                        <p className="font-num text-slate-500 text-[11px]">{l.fromDate} to {l.toDate} (<span className="font-num font-bold">{l.days}</span> days)</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-serif text-xs text-slate-400 text-center py-4">No active leave requests.</p>
                )}
              </div>

            </div>

          </div>

          {/* ANNOUNCEMENTS CENTER */}
          <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-navy text-xs font-sans font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded border border-gold/30">
                  OFFICIAL INSTITUTION NOTICES
                </span>
                <h2 className="text-2xl font-sans font-bold text-navy mt-1 tracking-tight flex items-center">
                  <Megaphone className="w-6 h-6 text-gold mr-2.5" />
                  Institutional Announcements
                </h2>
                <p className="font-serif text-slate-500 text-xs mt-0.5">
                  Access all official circulars, exam dates, events, and university notices.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-auto">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notices..."
                    className="w-full sm:w-56 pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-navy text-white hover:bg-navy-light text-xs font-sans font-bold rounded-lg transition-colors border border-navy-light shadow-sm"
                  title="Toggle Chronological Order"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-gold" />
                  <span>
                    SORT: {sortOrder === 'newest' ? 'NEW → OLD' : 'OLD → NEW'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Academic', 'Event', 'Facility', 'Scholarship', 'General'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-gold text-navy-dark shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-2">
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-gold/50 transition-all flex flex-col space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-navy text-gold px-2.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs font-num font-bold text-slate-500 flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-gold" />
                        {item.date}
                      </span>
                    </div>

                    <h4 className="text-base font-sans font-bold text-navy">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>

                    <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-[11px]">
                      <span className="font-serif text-slate-500">Issued by: <strong>{item.author || 'Dean Office'}</strong></span>
                      <span className="text-slate-400 font-num">Ref: {item.id}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
                  No announcements found matching your filter criteria.
                </div>
              )}
            </div>

          </div>

        </main>
      </div>

      <FloatingHelpdesk />
    </div>
  );
};
