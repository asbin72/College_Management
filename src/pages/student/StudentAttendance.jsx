import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { FloatingHelpdesk } from '../../components/portal/FloatingHelpdesk';
import { CheckCircle2, AlertTriangle, AlertCircle, Send, Upload } from 'lucide-react';

export const StudentAttendance = () => {
  const { currentUser } = useAuth();
  const { attendance = [], subjects = [] } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'calendar' | 'issues'

  // Report Attendance Issue Modal State
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueSubmitted, setIssueSubmitted] = useState(false);
  const [issueForm, setIssueForm] = useState({
    subject: '',
    date: '',
    issueType: 'Marked Absent when Present',
    description: '',
    documentName: ''
  });

  // Reported Issues List - only pre-seeded for demo legacy students
  const [reportedIssues, setReportedIssues] = useState(() => {
    if (currentUser?.isNewUser || (currentUser?.studentId?.startsWith('STU-') && !['STU-2024-001', 'STU-CSE-101'].includes(currentUser?.studentId))) {
      return [];
    }
    return [
      {
        id: 'ATT-ISSUE-101',
        subject: 'CS-601 Artificial Intelligence',
        date: '2026-08-08',
        issueType: 'Marked Absent when Present',
        status: 'Under Review',
        submittedOn: '2026-08-09'
      }
    ];
  });

  if (!currentUser) return null;

  const studentName = currentUser.name || 'Student';
  const studentCode = currentUser.studentId || currentUser.username || currentUser.id || 'STU-CSE-101';

  // Resolve Department Code accurately
  let studentDeptCode = currentUser.departmentCode;
  if (!studentDeptCode) {
    if (currentUser.studentId && currentUser.studentId.includes('-')) {
      const parts = currentUser.studentId.split('-');
      if (parts.length >= 2) studentDeptCode = parts[1];
    }
  }
  if (!studentDeptCode) {
    const dLower = (currentUser.department || '').toLowerCase();
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

  // 1. Live per-day attendance logs for this student from MySQL (Strictly matched by institutional studentId)
  const myLogs = (attendance || []).filter(a =>
    a.studentId === studentCode ||
    (currentUser.studentId && a.studentId === currentUser.studentId) ||
    (currentUser.id && a.studentId === currentUser.id)
  ).sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  // 2. Summary stats
  const totalConducted = myLogs.length;
  const totalAttended = myLogs.filter(a => a.status === 'Present').length;
  const totalAbsent = myLogs.filter(a => a.status === 'Absent').length;
  const calculatedPercent = totalConducted > 0 
    ? Math.round((totalAttended / totalConducted) * 100) 
    : 0;
  const overallAtt = `${calculatedPercent}%`;

  // 3. Subject-wise summary from enrolled semester subjects & logs
  const myDeptSubjects = subjects.filter(s => {
    const sDeptCode = (s.departmentCode || (s.code ? s.code.split('-')[0] : '')).toUpperCase();
    const codeMatch = sDeptCode === studentDeptCode.toUpperCase() || 
                      (s.department && (s.department.toLowerCase() === (currentUser.department || '').toLowerCase() || s.department.toLowerCase().includes(studentDeptCode.toLowerCase())));
    if (!codeMatch) return false;
    const sSemNum = getSemNum(s.semester, s.year);
    return sSemNum === semNumber;
  });

  const fallbackSubjects = subjects.filter(s => {
    const sDeptCode = (s.departmentCode || (s.code ? s.code.split('-')[0] : '')).toUpperCase();
    return sDeptCode === studentDeptCode.toUpperCase();
  }).slice(0, 6);

  const matchedSubjects = myDeptSubjects.length > 0 ? myDeptSubjects : fallbackSubjects;

  const subjectGroups = {};
  matchedSubjects.forEach(sub => {
    subjectGroups[sub.code] = {
      code: sub.code,
      subject: `${sub.code} - ${sub.name}`,
      conducted: 0,
      attended: 0
    };
  });

  myLogs.forEach(log => {
    const key = log.subjectCode || 'GEN-101';
    if (!subjectGroups[key]) {
      subjectGroups[key] = {
        code: key,
        subject: `${log.subjectCode} - ${log.subjectName}`,
        conducted: 0,
        attended: 0
      };
    }
    subjectGroups[key].conducted += 1;
    if (log.status === 'Present') subjectGroups[key].attended += 1;
  });

  const activeSubjectBreakdown = Object.values(subjectGroups).map(s => ({
    ...s,
    percentage: s.conducted > 0 ? Math.round((s.attended / s.conducted) * 100) : 0
  }));

  // Find subjects with shortage (< 75%)
  const shortageSubjects = activeSubjectBreakdown.filter(a => a.percentage < 75 && a.conducted > 0);

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    const newIssue = {
      id: `ATT-ISSUE-${Math.floor(100 + Math.random() * 900)}`,
      subject: issueForm.subject,
      date: issueForm.date,
      issueType: issueForm.issueType,
      status: 'Pending',
      submittedOn: new Date().toISOString().split('T')[0]
    };

    setReportedIssues([newIssue, ...reportedIssues]);
    setShowIssueModal(false);
    setIssueSubmitted(true);
    setTimeout(() => setIssueSubmitted(false), 5000);
    setIssueForm({ subject: '', date: '', issueType: 'Marked Absent when Present', description: '', documentName: '' });
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
                  ATTENDANCE GOVERNANCE &bull; 75% MANDATE RULE
                </span>
                <h1 className="text-2xl sm:text-3xl font-sans font-bold text-navy mt-2 tracking-tight">
                  Student Attendance Dashboard
                </h1>
                <p className="font-serif text-slate-500 text-xs sm:text-sm mt-1">
                  Official class attendance tracking for <strong>{studentName}</strong> (<span className="font-num font-bold text-navy">{studentCode}</span>).
                </p>
              </div>

              <button
                onClick={() => setShowIssueModal(true)}
                className="inline-flex items-center justify-center bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs px-5 py-3 rounded-xl shadow transition-colors uppercase tracking-wider flex-shrink-0"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Report Attendance Issue
              </button>
            </div>
          </div>

          {/* ATTENDANCE WARNING ALERT BANNER */}
          {shortageSubjects.length > 0 && (
            <div className="p-4 sm:p-5 bg-amber-50 border-2 border-amber-400 rounded-2xl shadow-sm flex items-start space-x-3 text-xs font-sans">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 text-sm">Attendance Shortage Warning Alert!</h4>
                <p className="text-amber-800 mt-0.5">
                  {shortageSubjects.map(s => (
                    <span key={s.subject} className="block mt-1">
                      &bull; Your <strong className="text-amber-950 font-bold">{s.subject}</strong> attendance is <strong className="font-num font-bold text-red-700">{s.percentage}%</strong>, which is below the mandatory <strong className="font-num font-bold">75%</strong> requirement. Attend upcoming lectures to maintain examination eligibility.
                    </span>
                  ))}
                </p>
              </div>
            </div>
          )}

          {issueSubmitted && (
            <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center space-x-2 font-sans text-xs font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <span>Attendance Correction Request submitted to Registrar Office! Status updated below.</span>
            </div>
          )}

          {/* OVERALL ATTENDANCE SUMMARY CARD */}
          <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="flex items-center space-x-4 border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6">
              <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                {/* SVG Progress Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-200" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className={calculatedPercent >= 75 ? "text-emerald-500" : calculatedPercent > 0 ? "text-gold" : "text-slate-300"} strokeDasharray={`${calculatedPercent}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute font-num font-bold text-navy text-xl">{overallAtt}</span>
              </div>

              <div>
                <span className="text-xs font-sans font-bold text-slate-400 uppercase tracking-wider block">OVERALL ATTENDANCE</span>
                <span className="text-2xl font-num font-bold text-navy block mt-0.5">{calculatedPercent}%</span>
                {totalConducted === 0 ? (
                  <span className="font-serif text-xs text-slate-500 font-semibold flex items-center mt-1">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    No Lectures Conducted Yet
                  </span>
                ) : calculatedPercent >= 75 ? (
                  <span className="font-serif text-xs text-emerald-600 font-semibold flex items-center mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Eligible for Exams (&gt;<span className="font-num font-bold">75%</span>)
                  </span>
                ) : (
                  <span className="font-serif text-xs text-red-600 font-semibold flex items-center mt-1">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                    Shortage Warning (&lt;<span className="font-num font-bold">75%</span>)
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6 font-sans">
              <span className="text-xs font-sans font-bold text-slate-400 uppercase tracking-wider block">LECTURE COUNT SUMMARY</span>
              <div className="text-xs text-slate-600 space-y-1 font-serif">
                <div className="flex justify-between">
                  <span>Total Conducted Lectures:</span>
                  <strong className="font-num text-slate-800">{totalConducted}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Lectures Attended (Present):</span>
                  <strong className="font-num text-emerald-700">{totalAttended}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Lectures Missed (Absent):</span>
                  <strong className="font-num text-red-700">{totalAbsent}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Mandatory Requirement:</span>
                  <strong className="font-num text-navy">75% Minimum</strong>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-sans font-bold text-slate-400 uppercase tracking-wider block mb-2">75% RULE PROGRESS</span>
              <div className="space-y-1.5 font-sans">
                <div className="flex justify-between text-xs font-bold text-navy">
                  <span>Progress Indicator</span>
                  <span className="font-num">{calculatedPercent}% / 100%</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
                  <div className={`h-full rounded-full transition-all duration-500 ${calculatedPercent >= 75 ? 'bg-emerald-500' : calculatedPercent > 0 ? 'bg-gold' : 'bg-slate-300'}`} style={{ width: `${calculatedPercent}%` }} />
                </div>
                <span className="font-serif text-[11px] text-slate-500 block">Attendance records are strictly read-only and locked by Faculty.</span>
              </div>
            </div>

          </div>

          {/* VIEW TABS */}
          <div className="flex bg-slate-200 p-1 rounded-xl w-full sm:w-auto self-start border border-slate-300 font-sans">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'summary' ? 'bg-gold text-navy-dark shadow' : 'text-slate-600 hover:text-navy'
              }`}
            >
              SUBJECT-WISE BREAKDOWN
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'calendar' ? 'bg-gold text-navy-dark shadow' : 'text-slate-600 hover:text-navy'
              }`}
            >
              LECTURE LOG HISTORY
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'issues' ? 'bg-gold text-navy-dark shadow' : 'text-slate-600 hover:text-navy'
              }`}
            >
              REPORTED ISSUES ({reportedIssues.length})
            </button>
          </div>

          {/* TAB 1: SUBJECT-WISE ATTENDANCE TABLE */}
          {activeTab === 'summary' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-lg font-sans font-bold text-navy tracking-tight">Course Subject Attendance Status</h3>
                <span className="text-xs font-serif text-slate-400">Green &gt;80% • Yellow 75-80% • Red &lt;75%</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans min-w-[650px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                      <th className="p-3.5">Subject Name</th>
                      <th className="p-3.5">Total Classes</th>
                      <th className="p-3.5">Present</th>
                      <th className="p-3.5">Absent</th>
                      <th className="p-3.5">Percentage</th>
                      <th className="p-3.5 text-right">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {activeSubjectBreakdown.length > 0 ? (
                      activeSubjectBreakdown.map((att, idx) => {
                        const pct = att.percentage;
                        const isPending = att.conducted === 0;
                        const statusBadge = isPending ? 'Pending' : pct >= 80 ? 'Good' : pct >= 75 ? 'Warning' : 'Shortage';

                        return (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3.5">
                              <strong className="text-navy text-sm font-sans block">{att.subject}</strong>
                            </td>
                            <td className="p-3.5 font-num font-bold text-slate-700">{att.conducted}</td>
                            <td className="p-3.5 font-num font-bold text-emerald-700">{att.attended}</td>
                            <td className="p-3.5 font-num font-bold text-red-700">{att.conducted - att.attended}</td>
                            <td className="p-3.5 font-num font-bold text-navy text-sm">{pct}%</td>
                            <td className="p-3.5 text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                statusBadge === 'Good' ? 'bg-emerald-100 text-emerald-800' :
                                statusBadge === 'Warning' ? 'bg-amber-100 text-amber-800' :
                                statusBadge === 'Shortage' ? 'bg-red-100 text-red-800 animate-pulse' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {statusBadge === 'Good' && '🟢 Good Standing'}
                                {statusBadge === 'Warning' && '🟡 Warning'}
                                {statusBadge === 'Shortage' && '🔴 Attendance Shortage'}
                                {statusBadge === 'Pending' && '⚪ Enrolled (Classes Pending)'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-400 font-serif">
                          No subject-wise attendance recorded yet. Attendance data will populate as professors conduct lectures and record daily class attendance.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: LECTURE LOG HISTORY CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-lg font-sans font-bold text-navy tracking-tight">Recent Class Lecture Logs</h3>
              <p className="font-serif text-xs text-slate-500 mb-4">Date-wise attendance entries recorded by faculty from MySQL</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans min-w-[550px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                      <th className="p-3">Date</th>
                      <th className="p-3">Period / Time</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Faculty / Mode</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myLogs.length > 0 ? (
                      myLogs.map((log, i) => (
                        <tr key={log.id || i} className="hover:bg-slate-50">
                          <td className="p-3 font-num font-bold text-navy">{log.date}</td>
                          <td className="p-3 font-num text-slate-600">{log.period || '09:30 AM'}</td>
                          <td className="p-3 font-bold text-slate-800">{log.subjectCode} &bull; {log.subjectName}</td>
                          <td className="p-3 font-serif text-slate-600">{log.markedBy || 'Class Faculty'}</td>
                          <td className="p-3 text-right">
                            <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                              log.status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                              log.status === 'Absent' ? 'bg-red-100 text-red-800' :
                              log.status === 'Late' ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-6 text-center text-slate-400">No attendance lecture logs recorded yet for your account.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: REPORTED ISSUES TRACKER */}
          {activeTab === 'issues' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-lg font-sans font-bold text-navy tracking-tight">Reported Attendance Issues</h3>
              
              <div className="space-y-3">
                {reportedIssues.map((iss) => (
                  <div key={iss.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
                    <div>
                      <span className="font-bold text-navy text-sm block">{iss.subject}</span>
                      <span className="font-serif text-slate-500">Lecture Date: <strong className="font-num text-slate-700">{iss.date}</strong> &bull; Issue: {iss.issueType}</span>
                      <span className="text-[10px] font-num text-slate-400 block mt-0.5">Submitted: {iss.submittedOn} &bull; Ref: {iss.id}</span>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                      iss.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      iss.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {iss.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* REPORT ATTENDANCE ISSUE MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-sans font-bold text-navy">Report Attendance Correction Issue</h3>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 text-lg">&times;</button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Select Subject *</label>
                <select
                  value={issueForm.subject}
                  onChange={(e) => setIssueForm({ ...issueForm, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  {matchedSubjects.map(sub => (
                    <option key={sub.code} value={`${sub.code} ${sub.name}`}>{sub.code} - {sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Lecture Date *</label>
                <input
                  type="date"
                  required
                  value={issueForm.date}
                  onChange={(e) => setIssueForm({ ...issueForm, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-num"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Issue Type *</label>
                <select
                  value={issueForm.issueType}
                  onChange={(e) => setIssueForm({ ...issueForm, issueType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Marked Absent when Present">Marked Absent when Present</option>
                  <option value="Duty / Event Leave Uncredited">Duty / Event Leave Uncredited</option>
                  <option value="Medical Certificate Granted">Medical Certificate Granted</option>
                  <option value="Technical Marking Error">Technical Marking Error</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description & Details *</label>
                <textarea
                  rows={3}
                  required
                  value={issueForm.description}
                  onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                  placeholder="Detail the issue..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Upload Supporting Proof (Optional)</label>
                <div className="p-3 border-2 border-dashed border-slate-300 rounded-xl text-center bg-slate-50 text-slate-500 flex flex-col items-center cursor-pointer">
                  <Upload className="w-4 h-4 text-gold mb-1" />
                  <span className="text-[11px]">Upload Medical Certificate or Duty Pass</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gold hover:bg-gold-hover text-navy-dark rounded-xl font-bold uppercase tracking-wider shadow flex items-center"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Submit Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FloatingHelpdesk />
    </div>
  );
};
