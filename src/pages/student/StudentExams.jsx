import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { FloatingHelpdesk } from '../../components/portal/FloatingHelpdesk';
import { Download, Printer, ShieldCheck, Eye } from 'lucide-react';

export const StudentExams = () => {
  const { currentUser } = useAuth();
  const { examinations = [], subjects = [], attendance = [] } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showHallTicketModal, setShowHallTicketModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

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
  const semester = currentUser.semester || `Semester ${semNumber}`;
  const studentYear = currentUser.year || (semNumber <= 2 ? '1st Year' : semNumber <= 4 ? '2nd Year' : semNumber <= 6 ? '3rd Year' : '4th Year');
  const regNumber = currentUser.registerNumber || currentUser.rollNo || `REG-2026-${studentDeptCode}-001`;
  const course = currentUser.course || `${studentDept} (${studentYear})`;
  const section = currentUser.section || 'Sec A';

  // Calculate live attendance percentage for exam eligibility
  const myAttendanceLogs = attendance.filter(a =>
    a.studentId === studentId || a.studentId === currentUser.id
  );
  const attAttended = myAttendanceLogs.filter(a => a.status === 'Present').length;
  const attTotal = myAttendanceLogs.length;
  const isNewStudent = currentUser.isNewUser || (!attTotal && currentUser.overallAttendance === '0%');
  const attRate = attTotal > 0 
    ? Math.round((attAttended / attTotal) * 100) 
    : (isNewStudent ? 0 : (parseFloat(currentUser.overallAttendance) || 0));
  const isEligible = attRate >= 75 || isNewStudent;

  // Filter exams from database or generate from student's curriculum subjects
  const dbMatchingExams = examinations.filter(ex => {
    const isDept = ex.department === studentDept || (ex.subjectCode && ex.subjectCode.startsWith(studentDeptCode));
    const exSemNum = getSemNum(ex.semester, ex.year);
    return isDept && (exSemNum === semNumber || !ex.semester);
  });

  const myDeptSubjects = subjects.filter(s => {
    const sDeptCode = (s.departmentCode || (s.code ? s.code.split('-')[0] : '')).toUpperCase();
    const codeMatch = sDeptCode === studentDeptCode.toUpperCase() || 
                      (s.department && (s.department.toLowerCase() === studentDept.toLowerCase() || s.department.toLowerCase().includes(studentDeptCode.toLowerCase())));
    if (!codeMatch) return false;
    const sSemNum = getSemNum(s.semester, s.year);
    return sSemNum === semNumber;
  }).slice(0, 6);

  const upcomingExams = dbMatchingExams.length > 0 ? dbMatchingExams.map((ex, idx) => {
    const examDate = new Date(ex.date || '2026-08-25');
    const dayName = examDate.toLocaleDateString('en-US', { weekday: 'long' });
    return {
      id: ex.id,
      code: ex.subjectCode,
      subject: ex.subjectName,
      date: ex.date,
      day: dayName,
      time: ex.time || '10:00 AM - 01:00 PM',
      duration: '3 Hours',
      venue: ex.room || `Examination Complex - Hall ${101 + idx}`,
      seatNo: `SEAT-${studentDeptCode}-${String(idx + 1).padStart(2, '0')}`,
      type: ex.type || 'End-Semester Theory',
      reportingTime: '09:30 AM',
      maxMarks: ex.maxMarks || 100,
      eligibilityAttendance: ex.eligibilityAttendance || 75
    };
  }) : myDeptSubjects.map((sub, idx) => {
    const baseDate = new Date('2026-08-25');
    baseDate.setDate(baseDate.getDate() + (idx * 2));
    const dateStr = baseDate.toISOString().split('T')[0];
    const dayName = baseDate.toLocaleDateString('en-US', { weekday: 'long' });
    return {
      id: `EXAM-${sub.code}`,
      code: sub.code,
      subject: sub.name,
      date: dateStr,
      day: dayName,
      time: '10:00 AM - 01:00 PM',
      duration: '3 Hours',
      venue: `Examination Complex - Hall ${101 + idx}`,
      seatNo: `SEAT-${studentDeptCode}-${String(idx + 1).padStart(2, '0')}`,
      type: (sub.name || '').toLowerCase().includes('lab') ? 'Practical Examination' : 'End-Semester Theory',
      reportingTime: '09:30 AM',
      maxMarks: 100,
      eligibilityAttendance: 75
    };
  });

  const handlePrintHallTicket = () => {
    window.print();
  };

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
                  CONTROLLER OF EXAMINATIONS &bull; SPRING 2026
                </span>
                <h1 className="text-2xl sm:text-3xl font-sans font-bold text-navy mt-2 tracking-tight">
                  Examination Schedules & Admit Card
                </h1>
                <p className="font-serif text-slate-500 text-xs sm:text-sm mt-1">
                  Official end-semester timetables, hall seating allocation, and printable hall ticket.
                </p>
              </div>

              <button
                onClick={() => setShowHallTicketModal(true)}
                className="inline-flex items-center justify-center bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs px-5 py-3 rounded-xl shadow transition-colors uppercase tracking-wider flex-shrink-0"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Hall Ticket
              </button>
            </div>
          </div>

          {/* EXAM OVERVIEW SUMMARY CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">NEXT EXAMINATION</span>
              <span className="text-sm font-sans font-bold text-navy mt-1 block truncate">
                {upcomingExams[0]?.code ? `${upcomingExams[0].code} ${upcomingExams[0].subject}` : 'No Upcoming Papers'}
              </span>
              <span className="text-[10px] font-num font-bold text-gold bg-navy px-2 py-0.5 rounded inline-block mt-1">
                {upcomingExams[0]?.date || 'Schedule Pending'}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">UPCOMING EXAMS</span>
              <span className="text-2xl sm:text-3xl font-num font-bold text-navy block mt-1">{upcomingExams.length}</span>
              <span className="text-[10px] font-serif text-slate-500">Scheduled Courses</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">COMPLETED EXAMS</span>
              <span className="text-2xl sm:text-3xl font-num font-bold text-slate-600 block mt-1">
                {studentYear === '1st Year' ? 0 : studentYear === '2nd Year' ? 6 : studentYear === '3rd Year' ? 12 : 18}
              </span>
              <span className="text-[10px] font-serif text-slate-500">Prior Semesters</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">EXAM ELIGIBILITY</span>
              <span className={`text-xs font-sans font-bold px-2 py-1 rounded inline-block mt-2 ${
                isEligible ? 'text-emerald-800 bg-emerald-100' : 'text-red-800 bg-red-100'
              }`}>
                {isEligible ? 'ELIGIBLE' : 'SHORTAGE'}
              </span>
              <span className="text-[9px] font-serif text-slate-500 mt-1 block">Attendance: {attRate}%</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">PENDING PAPERS</span>
              <span className="text-2xl sm:text-3xl font-num font-bold text-amber-600 block mt-1">{upcomingExams.length}</span>
              <span className="text-[10px] font-serif text-slate-500">To be Attempted</span>
            </div>

          </div>

          {/* EXAM SCHEDULE TABLE */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-sans font-bold text-navy tracking-tight">{studentDept} Examination Schedule ({semester})</h3>
                <p className="font-serif text-xs text-slate-500">All examination records are verified and read-only from central database.</p>
              </div>
              <span className="text-xs font-num font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {upcomingExams.length} Papers Scheduled
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans min-w-[750px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                    <th className="p-3.5">Date & Day</th>
                    <th className="p-3.5">Subject Code & Title</th>
                    <th className="p-3.5">Exam Time & Duration</th>
                    <th className="p-3.5">Venue Hall</th>
                    <th className="p-3.5">Seat No</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {upcomingExams.map((ex, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <strong className="font-num text-navy text-sm block">{ex.date}</strong>
                        <span className="text-slate-500 text-[11px] font-serif">{ex.day}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-num font-bold text-gold bg-navy px-2 py-0.5 rounded text-[10px] mr-2">{ex.code}</span>
                        <strong className="text-slate-800 font-sans text-sm">{ex.subject}</strong>
                      </td>
                      <td className="p-3.5">
                        <span className="font-num font-bold text-slate-700 block">{ex.time}</span>
                        <span className="text-slate-500 text-[10px] font-serif">{ex.duration}</span>
                      </td>
                      <td className="p-3.5 font-bold text-navy">{ex.venue}</td>
                      <td className="p-3.5">
                        <span className="font-num font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded border border-amber-300">
                          {ex.seatNo}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedExam(ex)}
                          className="inline-flex items-center bg-navy text-white hover:bg-navy-light text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 text-gold" />
                          View Instructions
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* EXAMINATION INSTRUCTIONS CARD */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-lg font-sans font-bold text-navy tracking-tight flex items-center">
              <ShieldCheck className="w-5 h-5 text-gold mr-2" />
              General Examination Instructions & Code of Conduct
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-navy uppercase block">Reporting Time</span>
                <p className="text-slate-600 font-serif">Report to hall at least <strong>30 minutes</strong> before the scheduled start time (09:30 AM for morning session).</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-navy uppercase block">Required Documents</span>
                <p className="text-slate-600 font-serif">Printed <strong>Hall Ticket</strong> and physical <strong>University Student ID Card</strong> are mandatory.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-navy uppercase block">Allowed Materials</span>
                <p className="text-slate-600 font-serif">Pens, pencils, erasers, non-programmable scientific calculator (if permitted by paper code).</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-red-700 uppercase block">Prohibited Items</span>
                <p className="text-slate-600 font-serif">Mobile phones, smartwatches, Bluetooth devices, notes, and electronic storage media strictly banned.</p>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* EXAM DETAILS MODAL */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-num font-bold text-gold bg-navy px-2 py-0.5 rounded">{selectedExam.code}</span>
                <h3 className="text-lg font-bold text-navy mt-1">{selectedExam.subject}</h3>
              </div>
              <button onClick={() => setSelectedExam(null)} className="text-slate-400 text-xl font-bold">&times;</button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold">Exam Date:</span>
                <strong className="font-num text-navy">{selectedExam.date} ({selectedExam.day})</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold">Exam Time:</span>
                <strong className="font-num text-slate-800">{selectedExam.time} ({selectedExam.duration})</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold">Hall Location:</span>
                <strong className="text-navy">{selectedExam.venue}</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold">Allocated Seat:</span>
                <strong className="font-num text-amber-800 bg-amber-100 px-2 py-0.5 rounded">{selectedExam.seatNo}</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold">Reporting Time:</span>
                <strong className="font-num text-red-700">{selectedExam.reportingTime} Sharp</strong>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={() => setSelectedExam(null)} className="px-5 py-2 bg-navy text-white rounded-xl font-bold text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE OFFICIAL HALL TICKET MODAL */}
      {showHallTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-sans text-slate-800 relative">
            
            {/* Top Modal Controls */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 print:hidden">
              <span className="text-xs font-bold text-navy uppercase tracking-widest bg-gold/20 px-3 py-1 rounded">
                OFFICIAL ADMIT CARD / HALL TICKET
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrintHallTicket}
                  className="inline-flex items-center bg-navy hover:bg-navy-light text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow"
                >
                  <Printer className="w-4 h-4 mr-1.5 text-gold" />
                  Print / Save PDF
                </button>
                <button onClick={() => setShowHallTicketModal(false)} className="text-slate-400 text-xl font-bold px-2">&times;</button>
              </div>
            </div>

            {/* PRINTABLE HALL TICKET CONTAINER */}
            <div className="border-4 border-navy p-6 rounded-2xl space-y-6 bg-white relative">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-navy pb-4">
                <div className="flex items-center space-x-3">
                  <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                  <div>
                    <h2 className="text-xl font-serif font-bold text-navy leading-tight">KALPANAAA EDUCATION</h2>
                    <p className="text-[10px] font-bold tracking-widest text-gold uppercase">OFFICE OF THE CONTROLLER OF EXAMINATIONS</p>
                    <p className="text-[11px] text-slate-500 font-serif">Spring 2026 End-Semester Examination Hall Ticket</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">ADMIT CARD NO</span>
                  <span className="font-num font-bold text-navy text-sm">HT-2026-8891</span>
                </div>
              </div>

              {/* Student Details & Photo */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1">
                  <div>Student Name: <strong className="text-navy">{studentName}</strong></div>
                  <div>Student ID: <strong className="font-num text-navy">{studentId}</strong></div>
                  <div>Register Number: <strong className="font-num text-slate-800">{regNumber}</strong></div>
                  <div>Course: <strong>{course}</strong></div>
                  <div>Semester: <strong className="font-num">{semester}</strong></div>
                  <div>Section / Batch: <strong className="font-num">{section} (2023-2027)</strong></div>
                  <div className="col-span-2">Examination Center: <strong>Knowledge Corridor Campus, Sector 12, New Delhi</strong></div>
                </div>

                <div className="w-24 h-28 bg-slate-200 border-2 border-navy rounded-lg flex items-center justify-center font-serif text-slate-400 text-xs text-center p-1 flex-shrink-0">
                  Student Photo Signature Verified
                </div>
              </div>

              {/* Exam Schedule Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-navy uppercase text-xs">Approved Examination Schedule</h4>
                <table className="w-full text-left text-xs border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-navy text-white font-bold uppercase">
                      <th className="p-2 border border-slate-300">Code</th>
                      <th className="p-2 border border-slate-300">Subject Title</th>
                      <th className="p-2 border border-slate-300">Date & Day</th>
                      <th className="p-2 border border-slate-300">Session Time</th>
                      <th className="p-2 border border-slate-300">Hall & Seat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-serif">
                    {upcomingExams.map((e, idx) => (
                      <tr key={idx}>
                        <td className="p-2 border border-slate-300 font-num font-bold text-navy">{e.code}</td>
                        <td className="p-2 border border-slate-300 font-sans font-bold">{e.subject}</td>
                        <td className="p-2 border border-slate-300 font-num">{e.date} ({e.day})</td>
                        <td className="p-2 border border-slate-300 font-num">{e.time}</td>
                        <td className="p-2 border border-slate-300 font-num font-bold text-amber-900">{e.venue} ({e.seatNo})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Instructions */}
              <div className="text-[10px] font-serif text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                <p className="font-bold text-navy font-sans uppercase">Rules for Candidates:</p>
                <p>1. Candidates must present this Hall Ticket along with College ID card upon entering hall.</p>
                <p>2. Electronic gadgets, mobile phones, smartwatches are strictly prohibited inside examination room.</p>
                <p>3. Candidates will not be permitted to enter the hall after 15 minutes of exam commencement.</p>
              </div>

              {/* Signatures */}
              <div className="pt-6 flex justify-between items-end text-xs font-serif">
                <div className="text-center">
                  <div className="w-32 border-b border-slate-400 mb-1"></div>
                  <span>Student Signature</span>
                </div>

                <div className="text-center">
                  <div className="w-36 h-10 flex items-center justify-center font-bold text-navy text-sm tracking-widest font-serif border border-gold/40 rounded bg-gold/10 mb-1">
                    SEAL STAMPED
                  </div>
                  <span className="font-bold text-navy font-sans">Controller of Examinations</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      <FloatingHelpdesk />
    </div>
  );
};
