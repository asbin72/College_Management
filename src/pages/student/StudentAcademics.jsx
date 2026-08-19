import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { FloatingHelpdesk } from '../../components/portal/FloatingHelpdesk';
import { BookOpen, Download, BookMarked, ArrowRight, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentAcademics = () => {
  const { currentUser } = useAuth();
  const { subjects = [], attendance = [], marksRecords = [], results = [] } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  if (!currentUser) return null;

  const studentName = currentUser.name || 'Student';
  const studentId = currentUser.studentId || currentUser.username || currentUser.id || 'STU-CSE-101';
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
  const course = currentUser.course || `${studentDept} (${studentYear})`;

  const isNewStudent = currentUser?.isNewUser || (currentUser?.studentId?.startsWith('STU-') && !['STU-2024-001', 'STU-CSE-101'].includes(currentUser?.studentId));

  // Filter exact subjects for this student's department and semester
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
  }).slice(0, 6);

  const matchedSubjectsList = deptSubjects.length > 0 ? deptSubjects : fallbackSubjects;

  const currentSubjects = matchedSubjectsList.map((sub, idx) => {
    const subLogs = attendance.filter(a =>
      (a.studentId === studentId || a.studentId === currentUser.id) &&
      (a.subjectCode === sub.code || a.subjectName === sub.name)
    );
    const attended = subLogs.filter(a => a.status === 'Present').length;
    const conducted = subLogs.length;
    const attPct = conducted > 0 
      ? Math.round((attended / conducted) * 100) 
      : (isNewStudent ? 0 : (currentUser.overallAttendance ? parseInt(currentUser.overallAttendance) : 0));

    const markRecord = (marksRecords || []).find(m =>
      (m.studentId === studentId || m.studentId === currentUser.id) &&
      (m.subjectCode === sub.code || m.subjectName === sub.name)
    );
    const internalMarks = markRecord ? `${markRecord.marksObtained || markRecord.internal || 0}/30` : (isNewStudent ? 'Pending' : `${26 + (idx % 4)}/30`);

    return {
      code: sub.code,
      name: sub.name,
      faculty: sub.assignedTeacherName || 'Department Faculty',
      credits: sub.credits || (sub.subjectType?.includes('Lab') ? 2 : 4),
      type: sub.subjectType || ((sub.name || '').toLowerCase().includes('lab') ? 'Lab Practical' : 'Core Theory'),
      attendance: attPct,
      internal: internalMarks,
      status: 'Ongoing',
      description: sub.description || `Comprehensive curriculum course in ${sub.name}, covering foundational principles, analytical methods, practical assignments, and lab applications for ${studentDept}.`,
      syllabus: [
        `Unit I: Fundamental Principles & Core Concepts of ${sub.name.split('&')[0]}`,
        `Unit II: Analytical Formulations, Methodologies & Design Rules`,
        `Unit III: System Architecture, Testing & Performance Optimization`,
        `Unit IV: Case Studies, Design Projects & Simulation Labs`,
        `Unit V: Advanced Industrial Applications & Emerging Research Trends`
      ],
      schedule: `Mon & Wed (09:30 AM - 10:45 AM) • Hall ${studentDeptCode}-10${idx + 1}`,
      materials: [`${sub.code}_Lecture_Module_1.pdf`, `${sub.code}_Syllabus_Guide.pdf`, `${sub.code}_Reference_Notes.pdf`]
    };
  });

  // Calculate Degree Program Credit Dynamics
  const isMba = studentDeptCode === 'MBA' || (currentUser.course || '').toLowerCase().includes('mba');
  const totalRequiredCredits = isMba ? 80 : 160;
  const totalSemesters = isMba ? 4 : 8;
  const creditsPerSem = Math.round(totalRequiredCredits / totalSemesters);

  const completedSemesters = Math.max(0, semNumber - 1);
  const completedCredits = isNewStudent && semNumber === 1 ? 0 : Math.min(totalRequiredCredits, completedSemesters * creditsPerSem);
  const completedPct = ((completedCredits / totalRequiredCredits) * 100).toFixed(1);
  const remainingCredits = Math.max(0, totalRequiredCredits - completedCredits);

  const semRemainingLabel = semNumber >= totalSemesters 
    ? 'Final Semester' 
    : semNumber === totalSemesters - 1 
      ? `Sem ${totalSemesters} Credits` 
      : `Sem ${semNumber + 1} to ${totalSemesters} Credits`;

  // Compute live GPA for Academic Standing Card
  const myResultSummary = (results || []).find(r => r.student_id === studentId || r.studentId === studentId || r.student_id === currentUser.id);
  const myPublishedMarks = (marksRecords || []).filter(m => (m.studentId === studentId || m.studentId === currentUser.id) && (m.published === true || m.published === 1));
  const studentGpa = myResultSummary ? (myResultSummary.cgpa || myResultSummary.sgpa) : (
    myPublishedMarks.length > 0 
      ? (myPublishedMarks.reduce((acc, curr) => acc + (Number(curr.marksObtained || 0) / 25), 0) / myPublishedMarks.length).toFixed(2)
      : (isNewStudent ? '0.00' : (currentUser.gpa || '0.00'))
  );
  const gpaNum = parseFloat(studentGpa) || 0;

  let standingTitle = 'ACTIVE ENROLLED';
  let standingSubtitle = 'In Good Standing';
  if (gpaNum >= 3.7) {
    standingTitle = 'FIRST CLASS';
    standingSubtitle = 'With Distinction';
  } else if (gpaNum >= 3.3) {
    standingTitle = 'FIRST CLASS';
    standingSubtitle = 'Honors Standing';
  } else if (gpaNum >= 2.8) {
    standingTitle = 'SECOND CLASS';
    standingSubtitle = 'Good Standing';
  } else if (gpaNum > 0) {
    standingTitle = 'PASS CLASS';
    standingSubtitle = 'Academic Standing';
  } else if (isNewStudent) {
    standingTitle = 'NEW ENROLLMENT';
    standingSubtitle = `${studentYear} Scholar`;
  }

  const academicTerm = semNumber % 2 === 1 ? 'Fall 2026' : 'Spring 2027';

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans relative">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
          
          {/* Header Banner */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-navy text-xs font-sans font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded border border-gold/30">
                  CURRENT SEMESTER LEARNING HUB &bull; SYLLABUS & RESOURCES
                </span>
                <h1 className="text-2xl sm:text-3xl font-sans font-bold text-navy mt-2 tracking-tight">
                  Academic Coursework & Study Materials
                </h1>
                <p className="font-serif text-slate-500 text-xs sm:text-sm mt-1">
                  Enrolled Course: <strong>{course}</strong> &bull; Student ID: <span className="font-num font-bold text-navy">{studentId}</span>
                </p>
              </div>

              <Link
                to="/student/results"
                className="inline-flex items-center justify-center bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs px-5 py-3 rounded-xl shadow transition-colors uppercase tracking-wider flex-shrink-0"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                View Final Results & Grades
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>

          {/* DEGREE CREDIT PROGRESS CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">CURRENT SEMESTER</span>
              <span className="text-2xl sm:text-3xl font-num font-bold text-navy block mt-1">{semOrdinal}</span>
              <span className="text-[10px] font-serif text-slate-500">{academicTerm}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">ACTIVE COURSES</span>
              <span className="text-2xl sm:text-3xl font-num font-bold text-navy block mt-1">{currentSubjects.length}</span>
              <span className="text-[10px] font-serif text-slate-500">Enrolled Papers</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">REQUIRED CREDITS</span>
              <span className="text-2xl sm:text-3xl font-num font-bold text-navy block mt-1">{totalRequiredCredits}</span>
              <span className="text-[10px] font-serif text-slate-500">{isMba ? 'MBA Total' : 'B.Tech Total'}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">COMPLETED CREDITS</span>
              <span className="text-2xl sm:text-3xl font-num font-bold text-emerald-600 block mt-1">{completedCredits}</span>
              <span className="text-[10px] font-serif text-emerald-700 font-bold">{completedPct}% Completed</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">REMAINING CREDITS</span>
              <span className="text-2xl sm:text-3xl font-num font-bold text-amber-600 block mt-1">{remainingCredits}</span>
              <span className="text-[10px] font-serif text-slate-500">{semRemainingLabel}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">ACADEMIC STANDING</span>
              <span className="text-xs font-sans font-bold text-navy block mt-2 bg-gold/20 py-1 px-1 rounded text-gold-hover">
                {standingTitle}
              </span>
              <span className="text-[9px] font-serif text-slate-500 mt-1 block">{standingSubtitle}</span>
            </div>

          </div>

          {/* CURRENT SEMESTER SUBJECTS TABLE & CARDS */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-sans font-bold text-navy tracking-tight">
                  Active Coursework & Faculty Allocations ({studentSemester})
                </h3>
                <p className="font-serif text-xs text-slate-500">Click "View Course Hub" to download notes, syllabus units, and lecture slides.</p>
              </div>
              <span className="text-xs font-num font-bold text-gold bg-navy px-3 py-1 rounded-full">{currentSubjects.length} Active Courses</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans min-w-[700px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                    <th className="p-3.5">Subject Code & Name</th>
                    <th className="p-3.5">Faculty In-Charge</th>
                    <th className="p-3.5">Credits</th>
                    <th className="p-3.5">Course Type</th>
                    <th className="p-3.5">Attendance</th>
                    <th className="p-3.5">Internal Assessment</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {currentSubjects.map((sub, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <span className="font-num font-bold text-gold bg-navy px-2 py-0.5 rounded text-[10px] mr-2">{sub.code}</span>
                        <strong className="text-navy text-sm font-sans">{sub.name}</strong>
                      </td>
                      <td className="p-3.5 font-serif text-slate-600">{sub.faculty}</td>
                      <td className="p-3.5 font-num font-bold text-navy">{sub.credits}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sub.type.includes('Lab') ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {sub.type}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`font-num font-bold ${sub.attendance >= 75 ? 'text-emerald-700' : sub.attendance > 0 ? 'text-red-700' : 'text-slate-400'}`}>
                          {sub.attendance}%
                        </span>
                      </td>
                      <td className="p-3.5 font-num font-bold text-slate-800">{sub.internal}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedSubject(sub)}
                          className="inline-flex items-center bg-navy text-white hover:bg-navy-light text-[11px] font-sans font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                        >
                          <BookOpen className="w-3.5 h-3.5 mr-1 text-gold" />
                          View Course Hub
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* SUBJECT DETAILS MODAL / DRAWER */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto font-sans">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-num font-bold text-gold bg-navy px-2.5 py-0.5 rounded">{selectedSubject.code} &bull; {selectedSubject.type}</span>
                <h3 className="text-xl font-sans font-bold text-navy mt-1">{selectedSubject.name}</h3>
                <span className="font-serif text-xs text-slate-500">Course Faculty: <strong>{selectedSubject.faculty}</strong></span>
              </div>
              <button onClick={() => setSelectedSubject(null)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-navy uppercase tracking-wider">Course Description</h4>
              <p className="text-slate-600 leading-relaxed font-serif">{selectedSubject.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-sans">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Lecture Schedule</span>
                <span className="font-num font-bold text-navy mt-0.5 block">{selectedSubject.schedule}</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Course Credits</span>
                <span className="font-num font-bold text-navy mt-0.5 block">{selectedSubject.credits} Academic Credits</span>
              </div>
            </div>

            {/* Syllabus */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-navy uppercase tracking-wider flex items-center">
                <BookMarked className="w-4 h-4 text-gold mr-1.5" />
                Curriculum Syllabus Units
              </h4>
              <div className="space-y-1.5">
                {selectedSubject.syllabus.map((unit, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                    {unit}
                  </div>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-navy uppercase tracking-wider flex items-center">
                <Download className="w-4 h-4 text-gold mr-1.5" />
                Downloadable Study Materials & Lecture Notes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedSubject.materials.map((mat, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                    <span className="truncate font-semibold text-slate-700">{mat}</span>
                    <button onClick={() => alert(`Downloading ${mat}...`)} className="text-gold hover:text-navy font-bold text-[11px] ml-2">Download</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSubject(null)}
                className="px-6 py-2 bg-navy text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

      <FloatingHelpdesk />
    </div>
  );
};
