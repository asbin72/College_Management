import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { Search, Calendar, Download, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateGoogleCalendarLink, downloadICalFile } from '../../services/calendarSyncService';

export const TeacherClasses = () => {
  const { currentUser } = useAuth();
  const { facultyClassAssignments, attendance = [] } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  if (!currentUser) return null;

  const currentFacultyId = currentUser.employeeId || currentUser.username || currentUser.id || 'EMP-101';
  const teacherName = currentUser.name || 'Faculty Member';

  // Get active assignments for logged-in faculty
  const myFacultyAssignments = facultyClassAssignments.filter(
    fca => fca.facultyId === currentFacultyId || fca.facultyName === teacherName
  );

  const activeAssignments = myFacultyAssignments.length > 0 ? myFacultyAssignments : facultyClassAssignments.slice(0, 3);

  const totalStudentsCount = activeAssignments.reduce((sum, fca) => sum + (fca.studentCount || 0), 0);

  const filteredAssignments = activeAssignments.filter(fca => {
    const matchesYear = selectedYear === 'All' || fca.year === selectedYear;
    const matchesSearch = fca.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fca.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fca.departmentCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesSearch;
  });

  const getClassAttendance = (fca) => {
    const classRecords = (attendance || []).filter(
      a => a.classId === fca.classId || a.subjectCode === fca.subjectCode
    );
    if (!classRecords.length) return null;
    const presentCount = classRecords.filter(a =>
      (a.status || '').toLowerCase() === 'present'
    ).length;
    return Math.round((presentCount / classRecords.length) * 100);
  };

  const handleExportICal = (fca) => {
    downloadICalFile({
      title: `${fca.subjectName} (${fca.subjectCode}) - ${fca.departmentCode}`,
      description: `Class cohort ${fca.year} (${fca.semester}) taught by ${teacherName}.`,
      location: `Room 304, ${fca.departmentCode} Block`,
      startDate: new Date(),
      durationMinutes: 60,
      recurrence: 'WEEKLY',
      fileName: `${fca.subjectCode}_Schedule.ics`
    });
  };

  const handleOpenGoogleCalendar = (fca) => {
    const link = generateGoogleCalendarLink({
      title: `${fca.subjectName} (${fca.subjectCode}) - ${fca.departmentCode}`,
      description: `Class cohort ${fca.year} (${fca.semester}) taught by ${teacherName}.`,
      location: `Room 304, ${fca.departmentCode} Block`,
      startDate: new Date(),
      durationMinutes: 60,
      recurrence: 'WEEKLY'
    });
    window.open(link, '_blank');
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans relative">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto font-sans">
          
          {/* Header */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-navy text-[10px] font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded font-sans border border-gold/30">
                  MY CLASSES & SUBJECT OFFERINGS
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-navy mt-2 tracking-tight">
                  Assigned Teaching Classes & Cohorts
                </h1>
                <p className="font-serif text-slate-500 text-xs sm:text-sm mt-1">
                  Single unified workspace to manage attendance, internal assessment scores, coursework assignments, and timetables.
                </p>
              </div>

              <div className="text-right flex-shrink-0 font-num font-bold text-navy text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span>Active Classes: <strong>{activeAssignments.length}</strong></span> &bull; <span>Total Students: <strong>{totalStudentsCount}</strong></span>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-slate-500 flex-shrink-0">Year Filter:</span>
              {['All', '1st Year', '2nd Year', '3rd Year', '4th Year'].map(yr => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex-shrink-0 ${
                    selectedYear === yr ? 'bg-navy text-gold shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search subject or code..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy"
              />
            </div>
          </div>

          {/* CLASSES ROSTER TABLE VIEW */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-serif font-bold text-navy text-lg">Assigned Subject Roster</h3>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy text-amber-50 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Department</th>
                    <th className="p-3">Year Group</th>
                    <th className="p-3">Semester</th>
                    <th className="p-3">Subject Offering</th>
                    <th className="p-3">Students</th>
                    <th className="p-3">Attendance</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredAssignments.map(fca => {
                    const classAtt = getClassAttendance(fca);
                    const studentCount = fca.studentCount || 0;
                    return (
                      <tr key={fca.assignmentId} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-navy">{fca.departmentCode}</td>
                        <td className="p-3 font-bold text-slate-700">{fca.year}</td>
                        <td className="p-3 font-mono text-slate-500">{fca.semester}</td>
                        <td className="p-3 font-bold text-slate-900">
                          {fca.subjectName}
                          <span className="block text-[10px] text-slate-400 font-mono font-normal">Code: {fca.subjectCode}</span>
                        </td>
                        <td className="p-3 font-num font-bold text-slate-700">{studentCount > 0 ? `${studentCount} Students` : 'N/A'}</td>
                        <td className="p-3 font-num font-bold">
                          {classAtt !== null ? (
                            <span className={classAtt >= 75 ? 'text-emerald-700' : 'text-rose-600'}>
                              {classAtt}% Avg
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleExportICal(fca)}
                              title="Download iCal (.ics) timetable file"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center"
                            >
                              <Download className="w-3.5 h-3.5 mr-1" /> iCal
                            </button>
                            <button
                              onClick={() => handleOpenGoogleCalendar(fca)}
                              title="Add lecture to Google Calendar"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center"
                            >
                              <Calendar className="w-3.5 h-3.5 mr-1" /> Sync
                            </button>
                            <button
                              onClick={() => navigate(`/staff/classes/${fca.classId}`)}
                              className="px-3.5 py-1.5 bg-navy hover:bg-navy-light text-gold font-bold rounded-lg text-xs shadow flex items-center"
                            >
                              Manage <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};
