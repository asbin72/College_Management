import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { BulkScoreImporter } from '../../components/portal/BulkScoreImporter';
import { Send, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export const TeacherMarks = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const { examinations, subjects, users, submitMarksByTeacher } = useData();

  if (!currentUser) return null;

  // Filter assigned examinations for this logged-in teacher
  const assignedExams = examinations.filter(ex =>
    ex.assignedTeacherId === currentUser.employeeId ||
    ex.assignedTeacherId === currentUser.id ||
    ex.assignedTeacherName === currentUser.name ||
    (Array.isArray(currentUser.assignedSubjects) && currentUser.assignedSubjects.includes(ex.subjectCode))
  );

  const displayExams = assignedExams.length > 0 ? assignedExams : (examinations.length > 0 ? examinations : []);

  const [selectedExamId, setSelectedExamId] = useState(displayExams[0]?.id || 'EXAM-2026-01');
  const [successMsg, setSuccessMsg] = useState('');
  const [isImporterOpen, setIsImporterOpen] = useState(false);

  const currentExamObj = examinations.find(ex => ex.id === selectedExamId) || displayExams[0] || null;

  // ── Full grade scale (no hardcoded partial grades) ────────────────────────
  const calcGrade = (marks, maxMarks) => {
    if (maxMarks === 0 || marks === '' || marks === undefined || marks === null) return '—';
    const pct = (Number(marks) / Number(maxMarks)) * 100;
    if (pct >= 90) return 'O';
    if (pct >= 80) return 'A+';
    if (pct >= 70) return 'A';
    if (pct >= 60) return 'B+';
    if (pct >= 50) return 'B';
    if (pct >= 40) return 'C';
    return 'F';
  };

  // ── Grade color helper ────────────────────────────────────────────────────
  const gradeColor = (grade) => {
    if (grade === 'O') return 'text-purple-600';
    if (grade === 'A+') return 'text-emerald-600';
    if (grade === 'A') return 'text-blue-600';
    if (grade === 'B+') return 'text-teal-600';
    if (grade === 'B') return 'text-amber-600';
    if (grade === 'C') return 'text-orange-500';
    if (grade === 'F') return 'text-rose-600';
    return 'text-slate-400';
  };

  // Filter students strictly belonging to the assigned class cohort of the selected exam task
  const rawAssignedStudents = currentExamObj ? users.filter(u => {
    if (u.role !== 'STUDENT' && !String(u.studentId || '').startsWith('STU')) return false;

    if (currentExamObj.classId && u.classId) {
      if (u.classId === currentExamObj.classId) return true;
    }

    const subCode = String(currentExamObj.subjectCode || currentExamObj.code || '').toUpperCase();
    const subCourse = String(currentExamObj.course || currentExamObj.subjectName || '').toUpperCase();
    const stuDept = String(u.department || '').toUpperCase();
    const stuDeptCode = String(u.departmentCode || '').toUpperCase();
    const stuId = String(u.studentId || u.username || '').toUpperCase();

    let matchDept = false;
    if (subCode.startsWith('CS') || subCourse.includes('CSE') || subCourse.includes('COMPUTER')) {
      matchDept = stuDeptCode === 'CSE' || stuDeptCode === 'CS' || stuDept.includes('COMPUTER') || stuId.includes('-CSE-') || stuId.includes('-CS-');
    } else if (subCode.startsWith('ECE') || subCode.startsWith('EC') || subCourse.includes('ELECTRONICS')) {
      matchDept = stuDeptCode === 'ECE' || stuDeptCode === 'EC' || stuDept.includes('ELECTRONICS') || stuId.includes('-ECE-');
    } else if (subCode.startsWith('ME') || subCourse.includes('MECH')) {
      matchDept = stuDeptCode === 'ME' || stuDept.includes('MECHANICAL') || stuId.includes('-ME-');
    } else if (subCode.startsWith('EEE') || subCourse.includes('ELECTRICAL')) {
      matchDept = stuDeptCode === 'EEE' || stuDept.includes('ELECTRICAL') || stuId.includes('-EEE-');
    } else if (subCode.startsWith('MBA') || subCourse.includes('MANAGEMENT')) {
      matchDept = stuDeptCode === 'MBA' || stuDept.includes('MANAGEMENT') || stuId.includes('-MBA-');
    } else {
      matchDept = u.course === currentExamObj.course || u.department === currentExamObj.department;
    }

    if (!matchDept) return false;

    if (currentExamObj.semester && u.semester) {
      const cleanExamSem = String(currentExamObj.semester).replace(/[^0-9]/g, '');
      const cleanStuSem = String(u.semester).replace(/[^0-9]/g, '');
      if (cleanExamSem && cleanStuSem && cleanExamSem !== cleanStuSem) return false;
    }

    return true;
  }) : [];

  const fallbackStudents = currentExamObj ? users.filter(u => {
    if (u.role !== 'STUDENT' && !String(u.studentId || '').startsWith('STU')) return false;
    return u.departmentCode === 'CSE' || String(u.department || '').toLowerCase().includes('computer');
  }).slice(0, 10) : [];

  const assignedStudents = currentExamObj
    ? (rawAssignedStudents.length > 0 ? rawAssignedStudents : fallbackStudents).slice(0, 10)
    : [];

  const [marksState, setMarksState] = useState({});
  const [remarksState, setRemarksState] = useState({});

  const handleApplyCSVData = (validScoresList) => {
    const updatedMarks = { ...marksState };
    const updatedRemarks = { ...remarksState };

    validScoresList.forEach(item => {
      const targetStu = assignedStudents.find(s =>
        (s.studentId && s.studentId.toLowerCase() === item.studentId.toLowerCase()) ||
        (s.username && s.username.toLowerCase() === item.studentId.toLowerCase()) ||
        (s.id && s.id.toLowerCase() === item.studentId.toLowerCase())
      );

      if (targetStu) {
        updatedMarks[targetStu.id] = item.marksObtained;
        if (item.remarks) updatedRemarks[targetStu.id] = item.remarks;
      }
    });

    setMarksState(updatedMarks);
    setRemarksState(updatedRemarks);
    setSuccessMsg(`Successfully imported bulk CSV scores for ${validScoresList.length} students into roster!`);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleMarkChange = (stuId, val) => {
    const max = currentExamObj?.maxMarks || 100;
    const num = val === '' ? '' : Math.min(max, Math.max(0, Number(val)));
    setMarksState(prev => ({ ...prev, [stuId]: num }));
  };

  const handleSubmitMarks = (e) => {
    e.preventDefault();
    if (!currentExamObj) return;
    const studentMarksList = assignedStudents.map(stu => {
      const marksObtained = marksState[stu.id] !== undefined && marksState[stu.id] !== ''
        ? marksState[stu.id]
        : 0;
      return {
        studentId: stu.studentId || stu.username || stu.id,
        studentName: stu.name,
        subjectCode: currentExamObj.subjectCode,
        subjectName: currentExamObj.subjectName,
        marksObtained,
        maxMarks: currentExamObj.maxMarks,
        remarks: remarksState[stu.id] || ''
      };
    });

    submitMarksByTeacher(currentExamObj.id, studentMarksList, currentUser);
    setSuccessMsg(`Marks for ${currentExamObj.subjectCode} submitted to Central Governance! Status: Marks Submitted to Admin.`);
    setTimeout(() => setSuccessMsg(''), 5000);
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
              <span className="text-xs font-bold text-gold uppercase tracking-wider">STAFF PORTAL &bull; MARKS ENTRY</span>
              <h1 className="text-2xl font-serif font-bold text-navy mt-1">Examination Marks Submission</h1>
              <p className="text-slate-500 text-xs mt-1">Enter examination scores for assigned students. Marks are submitted to Admin for official publishing.</p>
            </div>
            <div className="bg-navy text-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center border border-gold/30">
              <ShieldCheck className="w-4 h-4 mr-1.5" /> STAFF TASK ENGINE
            </div>
          </div>

          {/* Select Assigned Exam */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <label className="block font-bold text-slate-700 mb-1 text-xs uppercase">Select Scheduled Examination Task</label>
            {displayExams.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No examination tasks assigned to you yet.</p>
            ) : (
              <select
                value={selectedExamId}
                onChange={e => setSelectedExamId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-navy text-xs"
              >
                {displayExams.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.id} &bull; {ex.name} ({ex.subjectCode} - {ex.subjectName}) &bull; Status: {ex.status}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Student Marks Entry Form */}
          {!currentExamObj ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center text-slate-400 text-sm">
              No examination selected. Please select an exam from the dropdown above.
            </div>
          ) : (
            <form onSubmit={handleSubmitMarks} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-4 p-6">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="font-serif font-bold text-navy text-base">Marks Roster: {currentExamObj.subjectName}</h3>
                  <span className="text-xs text-slate-500">
                    Max Score: {currentExamObj.maxMarks} Marks &bull; Course: {currentExamObj.course || currentExamObj.department || '—'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsImporterOpen(true)}
                    className="w-full sm:w-auto bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shadow flex items-center justify-center gap-1.5"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Bulk CSV Score Import
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-navy hover:bg-navy-light text-gold font-bold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider shadow flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-4 h-4" /> Submit Marks to Admin
                  </button>
                </div>
              </div>

              {assignedStudents.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No students found for this examination cohort.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-navy text-amber-50 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-3.5">Student ID</th>
                        <th className="p-3.5">Student Name</th>
                        <th className="p-3.5">Marks Obtained (Out of {currentExamObj.maxMarks})</th>
                        <th className="p-3.5">Calculated Grade</th>
                        <th className="p-3.5">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {assignedStudents.map(stu => {
                        const currentMarks = marksState[stu.id] !== undefined ? marksState[stu.id] : '';
                        const grade = calcGrade(currentMarks, currentExamObj.maxMarks);

                        return (
                          <tr key={stu.id} className="hover:bg-slate-50">
                            <td className="p-3.5 font-bold text-navy">{stu.studentId || stu.username}</td>
                            <td className="p-3.5 font-bold text-slate-800">{stu.name}</td>
                            <td className="p-3.5">
                              <input
                                type="number"
                                min="0"
                                max={currentExamObj.maxMarks}
                                value={currentMarks}
                                placeholder="Enter marks"
                                onChange={e => handleMarkChange(stu.id, e.target.value)}
                                className="w-28 p-2 bg-slate-50 border rounded-lg font-bold text-navy text-xs"
                              />
                            </td>
                            <td className={`p-3.5 font-bold text-sm ${gradeColor(grade)}`}>{grade}</td>
                            <td className="p-3.5">
                              <input
                                type="text"
                                placeholder="Faculty remarks..."
                                value={remarksState[stu.id] || ''}
                                onChange={e => setRemarksState({ ...remarksState, [stu.id]: e.target.value })}
                                className="w-full p-2 bg-slate-50 border rounded-lg text-xs"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </form>
          )}

          {/* BULK CSV IMPORTER MODAL */}
          {currentExamObj && (
            <BulkScoreImporter
              isOpen={isImporterOpen}
              onClose={() => setIsImporterOpen(false)}
              assignedStudents={assignedStudents}
              maxMarks={currentExamObj.maxMarks}
              examName={currentExamObj.name}
              onApplyScores={handleApplyCSVData}
            />
          )}

        </main>
      </div>
    </div>
  );
};
