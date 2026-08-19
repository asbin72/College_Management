import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { Send, ShieldCheck, UserCheck } from 'lucide-react';

export const TeacherAttendance = () => {
  const { currentUser } = useAuth();
  const { users, subjects, attendance, markAttendance } = useData();

  if (!currentUser) return null;

  // Filter assigned subjects for this teacher
  const assignedSubs = subjects.filter(s =>
    s.assignedTeacherId === currentUser.employeeId ||
    s.assignedTeacherId === currentUser.id ||
    s.assignedTeacherName === currentUser.name ||
    (Array.isArray(currentUser.assignedSubjects) && currentUser.assignedSubjects.includes(s.code))
  );

  const activeSubject = assignedSubs[0] || subjects[0] || { code: 'CS-601', name: 'Artificial Intelligence', course: 'B.Tech CSE', semester: '6th Semester' };
  const displaySubjects = (assignedSubs && assignedSubs.length > 0)
    ? assignedSubs
    : (subjects && subjects.length > 0 ? subjects : [activeSubject]);

  const [selectedSubjectCode, setSelectedSubjectCode] = useState(activeSubject.code);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [successMsg, setSuccessMsg] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentSubjectObj = subjects.find(s => s.code === selectedSubjectCode) || activeSubject;

  // Filter students strictly belonging to the assigned subject's department/course cohort
  const classStudents = users.filter(u => {
    if (u.role !== 'STUDENT' && !String(u.studentId || '').startsWith('STU')) return false;

    // Direct match if available
    if (currentSubjectObj.department && u.department === currentSubjectObj.department) return true;
    if (currentSubjectObj.departmentCode && u.departmentCode === currentSubjectObj.departmentCode) return true;

    const subCode = String(currentSubjectObj.code || '').toUpperCase();
    const subCourse = String(currentSubjectObj.course || currentSubjectObj.name || '').toUpperCase();
    const stuDept = String(u.department || '').toUpperCase();
    const stuDeptCode = String(u.departmentCode || '').toUpperCase();
    const stuId = String(u.studentId || u.username || '').toUpperCase();
    const stuCourse = String(u.course || '').toUpperCase();

    // CS / CSE (Computer Science & Engineering)
    if (subCode.startsWith('CS') || subCourse.includes('CSE') || subCourse.includes('COMPUTER SCIENCE')) {
      return stuDeptCode === 'CSE' || stuDeptCode === 'CS' || stuDept.includes('COMPUTER') || stuId.includes('-CSE-') || stuId.includes('-CS-') || stuCourse.includes('COMPUTER') || stuCourse.includes('CSE');
    }

    // ECE / Electronics
    if (subCode.startsWith('ECE') || subCode.startsWith('EC') || subCourse.includes('ECE') || subCourse.includes('ELECTRONICS')) {
      return stuDeptCode === 'ECE' || stuDeptCode === 'EC' || stuDept.includes('ELECTRONICS') || stuId.includes('-ECE-') || stuId.includes('-EC-') || stuCourse.includes('ELECTRONICS') || stuCourse.includes('ECE');
    }

    // ME / Mechanical
    if (subCode.startsWith('ME') || subCourse.includes('MECH') || subCourse.includes('MECHANICAL')) {
      return stuDeptCode === 'ME' || stuDeptCode === 'MECH' || stuDept.includes('MECHANICAL') || stuId.includes('-ME-') || stuCourse.includes('MECHANICAL') || stuCourse.includes('ME');
    }

    // EEE / Electrical
    if (subCode.startsWith('EEE') || subCourse.includes('ELECTRICAL')) {
      return stuDeptCode === 'EEE' || stuDeptCode === 'EE' || stuDept.includes('ELECTRICAL') || stuId.includes('-EEE-') || stuCourse.includes('ELECTRICAL') || stuCourse.includes('EEE');
    }

    // MBA / Management
    if (subCode.startsWith('MBA') || subCourse.includes('MBA') || subCourse.includes('MANAGEMENT')) {
      return stuDeptCode === 'MBA' || stuDept.includes('MANAGEMENT') || stuId.includes('-MBA-') || stuCourse.includes('MBA');
    }

    // Fallback prefix match
    const prefix = subCode.split(/[-_0-9]/)[0];
    if (prefix && prefix.length >= 2) {
      if (stuDeptCode.includes(prefix) || stuId.includes(`-${prefix}-`)) return true;
    }

    return false;
  });

  const fallbackStudents = users.filter(u => {
    if (u.role !== 'STUDENT' && !String(u.studentId || '').startsWith('STU')) return false;
    return u.departmentCode === 'CSE' || String(u.department || '').toLowerCase().includes('computer');
  }).slice(0, 10);

  const displayClassStudents = classStudents.length > 0 ? classStudents : fallbackStudents;

  const [rosterStatus, setRosterStatus] = useState({});

  // Pre-populate with existing attendance records for that date if already marked
  React.useEffect(() => {
    const initialStatus = {};
    displayClassStudents.forEach(stu => {
      const stuCode = stu.studentId || stu.id;
      const existing = attendance.find(a =>
        a.date === attendanceDate &&
        a.subjectCode === selectedSubjectCode &&
        (a.studentId === stuCode || a.studentId === stu.id)
      );
      initialStatus[stu.id] = existing ? existing.status : 'Present';
      if (stuCode) initialStatus[stuCode] = existing ? existing.status : 'Present';
    });
    setRosterStatus(initialStatus);
  }, [selectedSubjectCode, attendanceDate, displayClassStudents.length, attendance]);

  const handleStatusChange = (stuId, status) => {
    setRosterStatus(prev => ({ ...prev, [stuId]: status }));
  };

  const handleSubmitAttendance = (e) => {
    e.preventDefault();
    const records = displayClassStudents.map(stu => ({
      studentId: stu.studentId || stu.username || stu.id,
      studentName: stu.name,
      subjectCode: currentSubjectObj.code,
      subjectName: currentSubjectObj.name,
      date: attendanceDate,
      status: rosterStatus[stu.id] || rosterStatus[stu.studentId] || 'Present'
    }));

    markAttendance(records, currentUser);
    setSuccessMsg(`Attendance submitted successfully for ${currentSubjectObj.code} on ${attendanceDate}! Central dataset and Student Portals updated.`);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const markAllPresent = () => {
    const allPresent = {};
    displayClassStudents.forEach(stu => {
      allPresent[stu.id] = 'Present';
      if (stu.studentId) allPresent[stu.studentId] = 'Present';
      if (stu.username) allPresent[stu.username] = 'Present';
    });
    setRosterStatus(allPresent);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {successMsg && (
            <div className="p-4 bg-emerald-500 text-white rounded-xl shadow font-bold text-xs flex items-center justify-between">
              <span>{successMsg}</span>
              <button onClick={() => setSuccessMsg('')}>&times;</button>
            </div>
          )}

          {/* Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">STAFF PORTAL &bull; ATTENDANCE ENTRY</span>
              <h1 className="text-2xl font-serif font-bold text-navy mt-1">Mark Student Class Attendance</h1>
              <p className="text-slate-500 text-xs mt-1">Select assigned subject, date, mark Present/Absent, and submit to central database.</p>
            </div>
            <div className="bg-navy text-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center border border-gold/30">
              <ShieldCheck className="w-4 h-4 mr-1.5" /> STAFF VERIFIED
            </div>
          </div>

          {/* Subject & Date Filter */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6">
                <label className="block font-bold text-slate-700 mb-1 uppercase">Select Assigned Subject *</label>
                <select
                  value={selectedSubjectCode}
                  onChange={e => setSelectedSubjectCode(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy"
                >
                  {displaySubjects.map(s => (
                    <option key={s.code} value={s.code}>{s.code} &bull; {s.name} ({s.course})</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-6">
                <label className="block font-bold text-slate-700 mb-1 uppercase">Attendance Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={e => setAttendanceDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy"
                />
              </div>
            </div>
          </div>

          {/* Student Roster Form */}
          <form onSubmit={handleSubmitAttendance} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <h3 className="font-serif font-bold text-navy text-base">
                Assigned Student Class Roster ({displayClassStudents.length} Students)
              </h3>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={markAllPresent}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl uppercase tracking-wider shadow flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" /> Mark All Present (1-Click)
                </button>

                <button
                  type="submit"
                  className="bg-navy hover:bg-navy-light text-gold font-bold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider shadow flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Submit Attendance
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy text-amber-50 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3.5">Student ID</th>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Course</th>
                    <th className="p-3.5 text-center">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {displayClassStudents.map(stu => {
                    const currentVal = rosterStatus[stu.id] || rosterStatus[stu.studentId] || 'Present';
                    return (
                      <tr key={stu.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-navy">{stu.studentId || stu.username}</td>
                        <td className="p-3.5 font-bold text-slate-800">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={stu.photoUrl || stu.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                              alt={stu.name}
                              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'; }}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-sm flex-shrink-0"
                            />
                            <span>{stu.name}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-600">{stu.department}</td>
                        <td className="p-3.5 text-slate-600">{stu.course}</td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(stu.id, 'Present')}
                              className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                                currentVal === 'Present' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(stu.id, 'Absent')}
                              className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                                currentVal === 'Absent' ? 'bg-rose-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
