import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { FileSpreadsheet, Search, Users, UserCheck, Calendar } from 'lucide-react';

export const AdminAttendance = () => {
  const { currentUser } = useAuth();
  const {
    attendance, teacherAttendance, departments, courses, subjects, users,
    markAttendance, markTeacherAttendance
  } = useData();

  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'teachers'
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dynamic real-time date calculation
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Extract unique dates available in DB and merge with today/yesterday
  const rawDates = Array.from(new Set([
    todayStr,
    yesterdayStr,
    ...attendance.map(a => a.date),
    ...(teacherAttendance || []).map(t => t.date)
  ])).filter(Boolean).sort().reverse();
  const availableDates = rawDates;

  // Filter States - Default to today or latest date
  const [filterDate, setFilterDate] = useState(() => {
    const hasToday = attendance.some(a => a.date === todayStr);
    return hasToday ? todayStr : (availableDates[0] || todayStr);
  });
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterSubject, setFilterSubject] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Total unique verified accounts
  const totalEnrolledStudentsCount = users.filter(u => u.role === 'STUDENT' || (u.studentId && String(u.studentId).startsWith('STU'))).length;
  const totalFacultyCount = users.filter(u => u.role === 'TEACHER' || u.role === 'STAFF' || (u.employeeId && String(u.employeeId).startsWith('EMP'))).length;

  // Extract active subjects present in attendance logs + curriculum fallback
  const activeSubjectOptions = Array.from(new Map([
    ...attendance.map(a => [a.subjectCode, { code: a.subjectCode, name: a.subjectName }]),
    ...subjects.map(s => [s.code, { code: s.code, name: s.name }])
  ]).values()).sort((a, b) => (a.code || '').localeCompare(b.code || ''));

  // 1. Filtered Students Attendance
  const filteredStudentAttendance = attendance.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      (item.studentName && item.studentName.toLowerCase().includes(term)) ||
      (item.studentId && item.studentId.toLowerCase().includes(term)) ||
      (item.subjectCode && item.subjectCode.toLowerCase().includes(term)) ||
      (item.subjectName && item.subjectName.toLowerCase().includes(term))
    );
    const matchesDate = filterDate === 'ALL' || item.date === filterDate;
    const matchesDept = filterDept === 'ALL' || (item.studentId && item.studentId.includes(`-${filterDept}-`)) || (item.subjectCode && item.subjectCode.startsWith(filterDept));
    const matchesSubject = filterSubject === 'ALL' || item.subjectCode === filterSubject || (item.subjectName && item.subjectName.toLowerCase().includes(filterSubject.toLowerCase()));
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchesSearch && matchesDate && matchesDept && matchesSubject && matchesStatus;
  }).sort((a, b) => (a.studentId || '').localeCompare(b.studentId || '', undefined, { numeric: true, sensitivity: 'base' }));

  // 2. Filtered Teachers Attendance
  const filteredTeacherAttendance = (teacherAttendance || []).filter(item => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      (item.teacherName && item.teacherName.toLowerCase().includes(term)) ||
      (item.teacherId && item.teacherId.toLowerCase().includes(term)) ||
      (item.department && item.department.toLowerCase().includes(term)) ||
      (item.designation && item.designation.toLowerCase().includes(term))
    );
    const matchesDate = filterDate === 'ALL' || item.date === filterDate;
    const matchesDept = filterDept === 'ALL' || item.department === filterDept || item.department?.toLowerCase().includes(filterDept.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchesSearch && matchesDate && matchesDept && matchesStatus;
  }).sort((a, b) => (a.teacherId || '').localeCompare(b.teacherId || '', undefined, { numeric: true, sensitivity: 'base' }));

  // Administrative Corrections
  const handleStudentCorrection = (attId, newStatus) => {
    const record = attendance.find(a => a.id === attId);
    if (record) {
      markAttendance([{ ...record, status: newStatus }], currentUser);
    }
  };

  const handleTeacherCorrection = (attId, newStatus) => {
    const remarks = prompt(`Enter optional remarks for status change to ${newStatus}:`, 'Admin biometric correction');
    markTeacherAttendance(attId, newStatus, remarks || '', currentUser);
  };

  // CSV Report Generator
  const handleGenerateReport = () => {
    if (activeTab === 'students') {
      if (filteredStudentAttendance.length === 0) {
        alert('No student attendance records to export.');
        return;
      }
      const headers = ['Date', 'Student ID', 'Student Name', 'Subject Code', 'Subject Name', 'Period', 'Status'];
      const rows = filteredStudentAttendance.map(a => [
        `"${a.date || ''}"`,
        `"${a.studentId || ''}"`,
        `"${a.studentName || ''}"`,
        `"${a.subjectCode || ''}"`,
        `"${a.subjectName || ''}"`,
        `"${a.period || '09:30 AM'}"`,
        `"${a.status || 'Present'}"`
      ]);
      downloadCsv(headers, rows, `Kalpanaaa_Students_Attendance_Report_${filterDate}.csv`);
    } else {
      if (filteredTeacherAttendance.length === 0) {
        alert('No faculty attendance records to export.');
        return;
      }
      const headers = ['Date', 'Employee ID', 'Faculty Name', 'Department', 'Designation', 'Check-In Time', 'Check-Out Time', 'Status', 'Biometric Mode', 'Remarks'];
      const rows = filteredTeacherAttendance.map(t => [
        `"${t.date || ''}"`,
        `"${t.teacherId || ''}"`,
        `"${t.teacherName || ''}"`,
        `"${t.department || ''}"`,
        `"${t.designation || 'Faculty Member'}"`,
        `"${t.checkInTime || '08:45 AM'}"`,
        `"${t.checkOutTime || '04:45 PM'}"`,
        `"${t.status || 'Present'}"`,
        `"${t.biometricMode || 'Biometric Smart Card'}"`,
        `"${t.remarks || ''}"`
      ]);
      downloadCsv(headers, rows, `Kalpanaaa_Faculty_Biometric_Attendance_Report_${filterDate}.csv`);
    }
  };

  const downloadCsv = (headers, rows, filename) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics for active view & date
  const displayedLogs = activeTab === 'students' ? filteredStudentAttendance : filteredTeacherAttendance;
  const totalLogs = displayedLogs.length;
  const presentLogs = activeTab === 'students'
    ? filteredStudentAttendance.filter(a => a.status === 'Present').length
    : filteredTeacherAttendance.filter(t => t.status === 'Present' || t.status === 'On-Duty').length;
  const absentLogs = activeTab === 'students'
    ? filteredStudentAttendance.filter(a => a.status === 'Absent').length
    : filteredTeacherAttendance.filter(t => t.status === 'Absent' || t.status === 'Leave').length;
  const rate = totalLogs > 0 ? ((presentLogs / totalLogs) * 100).toFixed(1) : '100.0';

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">MANAGEMENT CONTROL &bull; ATTENDANCE GOVERNANCE</span>
              <h1 className="text-2xl font-serif font-bold text-navy mt-1">Central Attendance Governance Console</h1>
              <p className="text-slate-500 text-xs mt-1">
                Live attendance audit for <strong className="text-navy">{totalEnrolledStudentsCount} Enrolled Students</strong> (10 per class) & <strong className="text-navy">{totalFacultyCount} Faculty Members</strong>.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateReport}
                className="bg-navy hover:bg-navy-light text-gold font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shadow flex items-center gap-1.5 border border-gold/30"
              >
                <FileSpreadsheet className="w-4 h-4" /> Export {activeTab === 'students' ? 'Students' : 'Faculty'} Report
              </button>
            </div>
          </div>

          {/* Audience Tabs */}
          <div className="flex space-x-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => { setActiveTab('students'); setFilterStatus('ALL'); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'students'
                  ? 'bg-navy text-gold shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Users className="w-4 h-4" /> Enrolled Students ({totalEnrolledStudentsCount} Students)
            </button>

            <button
              onClick={() => { setActiveTab('teachers'); setFilterStatus('ALL'); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'teachers'
                  ? 'bg-navy text-gold shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Faculty & Staff ({totalFacultyCount} Faculty Members)
            </button>
          </div>

          {/* Metrics Summary (Calculated per selected Date context) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                {activeTab === 'students' ? 'Enrolled Students (Target)' : 'Total Verified Staff'}
              </span>
              <span className="text-3xl font-serif font-bold text-navy block mt-1">
                {activeTab === 'students' ? totalEnrolledStudentsCount : totalFacultyCount}
              </span>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-emerald-600 uppercase">
                {activeTab === 'students' ? `Present (${filterDate === 'ALL' ? 'All Dates' : filterDate})` : 'Present / On-Duty'}
              </span>
              <span className="text-3xl font-serif font-bold text-emerald-600 block mt-1">{presentLogs}</span>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-rose-600 uppercase">
                {activeTab === 'students' ? `Absent (${filterDate === 'ALL' ? 'All Dates' : filterDate})` : 'Absent / On Leave'}
              </span>
              <span className="text-3xl font-serif font-bold text-rose-600 block mt-1">{absentLogs}</span>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-amber-500 uppercase">
                {activeTab === 'students' ? 'Daily Attendance Rate' : 'Staff Biometric Rate'}
              </span>
              <span className="text-3xl font-serif font-bold text-amber-600 block mt-1">{rate}%</span>
            </div>
          </div>

          {/* Filters Bar with Date Filter */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
              
              {/* Date Filter */}
              <div className="md:col-span-2">
                <select
                  value={filterDate}
                  onChange={e => setFilterDate(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold text-navy"
                >
                  {availableDates.map(d => (
                    <option key={d} value={d}>
                      {d === todayStr ? `📅 ${d} (Today)` : d === yesterdayStr ? `📅 ${d} (Yesterday)` : `📅 ${d}`}
                    </option>
                  ))}
                  <option value="ALL">📅 All Dates ({attendance.length} Logs)</option>
                </select>
              </div>

              {/* Department Filter */}
              <div className="md:col-span-2">
                <select
                  value={filterDept}
                  onChange={e => setFilterDept(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 font-semibold text-navy"
                >
                  <option value="ALL">All Depts</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.code}>{d.code} - {d.name}</option>
                  ))}
                </select>
              </div>

              {/* Search Box */}
              <div className="md:col-span-3 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder={activeTab === 'students' ? 'Search by Student ID, Name...' : 'Search by Emp ID, Faculty Name...'}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl bg-slate-50 font-semibold text-navy"
                />
              </div>

              {/* Subject Filter (for students) / Role Filter */}
              {activeTab === 'students' ? (
                <div className="md:col-span-3">
                  <select
                    value={filterSubject}
                    onChange={e => setFilterSubject(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 font-semibold text-navy"
                  >
                    <option value="ALL">All Class Subjects</option>
                    {activeSubjectOptions.map(s => (
                      <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="md:col-span-3">
                  <div className="p-2.5 bg-slate-50 border rounded-xl font-semibold text-navy text-xs">
                    Faculty Biometric Records ({totalFacultyCount} Staff)
                  </div>
                </div>
              )}

              {/* Status Filter */}
              <div className="md:col-span-2">
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 font-semibold text-navy">
                  <option value="ALL">All Statuses</option>
                  <option value="Present">Present</option>
                  {activeTab === 'teachers' && <option value="On-Duty">On-Duty</option>}
                  {activeTab === 'teachers' && <option value="Leave">On Leave</option>}
                  <option value="Absent">Absent</option>
                </select>
              </div>
            </div>
          </div>

          {/* TAB 1: STUDENTS ATTENDANCE TABLE */}
          {activeTab === 'students' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-serif font-bold text-navy text-sm">
                  Classroom Attendance Records ({filteredStudentAttendance.length} Students {filterDate !== 'ALL' ? `for ${filterDate}` : 'Across All Dates'})
                </h3>
                <span className="text-xs text-slate-500 font-semibold">Total {totalEnrolledStudentsCount} Enrolled Students</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy text-amber-50 uppercase font-bold tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Student ID</th>
                      <th className="p-3.5">Student Name</th>
                      <th className="p-3.5">Subject Code</th>
                      <th className="p-3.5">Subject Name</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">Administrative Correction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredStudentAttendance.length > 0 ? (
                      filteredStudentAttendance.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="p-3.5 font-mono text-slate-500 whitespace-nowrap">{item.date}</td>
                          <td className="p-3.5 font-bold text-navy whitespace-nowrap">{item.studentId}</td>
                          <td className="p-3.5 font-bold text-slate-800 whitespace-nowrap">{item.studentName}</td>
                          <td className="p-3.5 font-bold text-navy whitespace-nowrap">{item.subjectCode}</td>
                          <td className="p-3.5 text-slate-700 whitespace-nowrap">{item.subjectName}</td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              item.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleStudentCorrection(item.id, item.status === 'Present' ? 'Absent' : 'Present')}
                              className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded font-bold text-[10px]"
                            >
                              Set as {item.status === 'Present' ? 'Absent' : 'Present'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-400">No student attendance logs found matching filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: TEACHERS / FACULTY BIOMETRIC ATTENDANCE TABLE */}
          {activeTab === 'teachers' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-serif font-bold text-navy text-sm">
                  Faculty Biometric Records ({filteredTeacherAttendance.length} Faculty Members {filterDate !== 'ALL' ? `for ${filterDate}` : 'Across All Dates'})
                </h3>
                <span className="text-xs text-slate-500 font-semibold">18 Verified Faculty Staff</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy text-amber-50 uppercase font-bold tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Emp ID</th>
                      <th className="p-3.5">Faculty Name</th>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5">Designation</th>
                      <th className="p-3.5">Punch In &bull; Out</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Remarks / Mode</th>
                      <th className="p-3.5 text-center">Administrative Override</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredTeacherAttendance.length > 0 ? (
                      filteredTeacherAttendance.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="p-3.5 font-mono text-slate-500 whitespace-nowrap">{item.date}</td>
                          <td className="p-3.5 font-bold text-navy whitespace-nowrap">{item.teacherId}</td>
                          <td className="p-3.5 font-bold text-slate-800 whitespace-nowrap">{item.teacherName}</td>
                          <td className="p-3.5 text-slate-600 whitespace-nowrap">{item.department}</td>
                          <td className="p-3.5 text-slate-500 whitespace-nowrap">{item.designation}</td>
                          <td className="p-3.5 font-mono text-slate-700 whitespace-nowrap">
                            {item.checkInTime} &rarr; {item.checkOutTime}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              item.status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                              item.status === 'On-Duty' ? 'bg-blue-100 text-blue-800' :
                              item.status === 'Leave' ? 'bg-purple-100 text-purple-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-500 whitespace-nowrap max-w-xs truncate" title={item.remarks}>
                            {item.remarks || item.biometricMode}
                          </td>
                          <td className="p-3.5 text-center whitespace-nowrap space-x-1.5">
                            {item.status !== 'Present' && (
                              <button
                                onClick={() => handleTeacherCorrection(item.id, 'Present')}
                                className="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 rounded font-bold text-[10px]"
                              >
                                Set Present
                              </button>
                            )}
                            {item.status !== 'On-Duty' && (
                              <button
                                onClick={() => handleTeacherCorrection(item.id, 'On-Duty')}
                                className="px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-300 rounded font-bold text-[10px]"
                              >
                                Set On-Duty
                              </button>
                            )}
                            {item.status !== 'Leave' && (
                              <button
                                onClick={() => handleTeacherCorrection(item.id, 'Leave')}
                                className="px-2 py-0.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-300 rounded font-bold text-[10px]"
                              >
                                Set Leave
                              </button>
                            )}
                            {item.status !== 'Absent' && (
                              <button
                                onClick={() => handleTeacherCorrection(item.id, 'Absent')}
                                className="px-2 py-0.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 rounded font-bold text-[10px]"
                              >
                                Set Absent
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="p-8 text-center text-slate-400">No faculty attendance records found matching filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
