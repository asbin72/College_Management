import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { FloatingHelpdesk } from '../../components/portal/FloatingHelpdesk';
import { Award, Download, Printer, CheckCircle2, Lock } from 'lucide-react';

export const StudentResults = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const { marksRecords = [], examinations = [], results = [] } = useData();
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

  if (!currentUser) return null;

  const studentId = currentUser.studentId || currentUser.username || currentUser.id || 'STU-CSE-101';

  // Filter ONLY published marks for this student
  const publishedMarks = (marksRecords || []).filter(m =>
    (m.studentId === studentId || m.studentId === currentUser.id || m.student_id === studentId) &&
    (m.published === true || m.published === 1 || m.status === 'Published' || m.status === 'Submitted')
  );

  const isNewStudent = currentUser?.isNewUser || (currentUser?.studentId?.startsWith('STU-') && !['STU-2024-001', 'STU-CSE-101'].includes(currentUser?.studentId));

  const myResultSummary = (results || []).find(r => r.student_id === studentId || r.studentId === studentId || r.student_id === currentUser.id);

  const studentSgpa = myResultSummary ? (myResultSummary.sgpa || myResultSummary.cgpa) : (
    publishedMarks.length > 0 
      ? (publishedMarks.reduce((acc, curr) => acc + (Number(curr.marksObtained || 0) / 25), 0) / publishedMarks.length).toFixed(2)
      : (isNewStudent ? '0.00' : (currentUser.gpa || '0.00'))
  );
  const studentCgpa = myResultSummary ? (myResultSummary.cgpa || myResultSummary.sgpa) : (
    publishedMarks.length > 0
      ? (publishedMarks.reduce((acc, curr) => acc + (Number(curr.marksObtained || 0) / 25), 0) / publishedMarks.length).toFixed(2)
      : (isNewStudent ? '0.00' : (currentUser.gpa || '0.00'))
  );

  const pendingExams = examinations.filter(ex =>
    !ex.isPublished && (ex.course === currentUser.course || ex.department === currentUser.department)
  );

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="bg-navy text-white p-6 sm:p-8 rounded-2xl shadow-xl border-l-8 border-gold flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded">
                STUDENT ACADEMIC RECORD
              </span>
              <h1 className="text-3xl font-serif font-bold text-amber-50 mt-2">
                Official Examination Results & Transcripts
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Student: <strong>{currentUser.name}</strong> ({studentId}) &bull; Course: {currentUser.course} ({currentUser.semester})
              </p>
            </div>
            <button
              onClick={() => setShowTranscriptModal(true)}
              className="bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs px-5 py-3 rounded-xl uppercase tracking-wider shadow transition-transform hover:scale-105 flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Generate Official Transcript PDF
            </button>
          </div>

          {/* Published Results Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-serif font-bold text-navy text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" /> Published Academic Results ({publishedMarks.length})
            </h3>

            {publishedMarks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy text-amber-50 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3.5">Subject Code</th>
                      <th className="p-3.5">Subject Name</th>
                      <th className="p-3.5">Marks Obtained</th>
                      <th className="p-3.5">Max Score</th>
                      <th className="p-3.5">Grade</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Faculty Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {publishedMarks.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-navy">{m.subjectCode}</td>
                        <td className="p-3.5 font-bold text-slate-800">{m.subjectName}</td>
                        <td className="p-3.5 font-bold text-navy">{m.marksObtained}</td>
                        <td className="p-3.5 text-slate-500 font-bold">{m.maxMarks}</td>
                        <td className="p-3.5 font-bold text-emerald-600 text-sm">{m.grade}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">
                            Published by Admin
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 text-[11px]">{m.remarks || 'Pass'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Lock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="font-bold text-navy text-sm">No Published Results Available Yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Examination results are currently under evaluation or awaiting official publication by University Management.
                </p>
              </div>
            )}
          </div>

          {/* Pending Examinations Alert */}
          {pendingExams.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-2">
              <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-600" /> Pending Result Publications ({pendingExams.length})
              </h4>
              <p className="text-xs text-amber-800">
                The following scheduled examinations are undergoing mark entry or administrative review and will become visible once published by Management:
              </p>
              <div className="space-y-1 pt-1">
                {pendingExams.map(ex => (
                  <div key={ex.id} className="p-2 bg-white rounded border border-amber-200 text-xs flex justify-between">
                    <span className="font-bold text-navy">{ex.name} ({ex.subjectCode} - {ex.subjectName})</span>
                    <span className="text-amber-700 font-bold text-[10px] uppercase">Status: {ex.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* OFFICIAL TRANSCRIPT PRINT MODAL */}
      {showTranscriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Actions Header */}
            <div className="bg-navy text-white p-4 flex justify-between items-center print:hidden">
              <span className="font-bold text-gold text-xs uppercase tracking-wider">Official Academic Transcript Preview</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-gold text-navy-dark font-bold text-xs rounded-lg shadow flex items-center gap-1 hover:bg-gold-hover"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setShowTranscriptModal(false)}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Print Document Content */}
            <div className="p-8 overflow-y-auto space-y-6 text-slate-800 font-sans print:p-0">
              
              {/* Crest Header */}
              <div className="flex items-center justify-between border-b-2 border-navy pb-4">
                <div className="flex items-center space-x-3">
                  <img src="/logo.png" alt="University Logo" className="w-14 h-14 object-contain" />
                  <div>
                    <h2 className="text-xl font-serif font-bold text-navy uppercase tracking-wide">KALPANAAA UNIVERSITY</h2>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Office of the Controller of Examinations</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gold bg-navy px-3 py-1 rounded uppercase">Official Marksheet</span>
                  <span className="text-[10px] text-slate-500 block mt-1 font-num">Date: {new Date().toISOString().split('T')[0]}</span>
                </div>
              </div>

              {/* Student Metadata Table */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Student Name</span>
                  <span className="font-bold text-navy text-sm">{currentUser.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Enrollment ID</span>
                  <span className="font-bold text-navy font-num">{studentId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Degree Program</span>
                  <span className="font-bold text-slate-700">{currentUser.course}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Semester</span>
                  <span className="font-bold text-slate-700 font-num">{currentUser.semester}</span>
                </div>
              </div>

              {/* Grade Roster */}
              <div>
                <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-2">Subject Performance Roster</h4>
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-bold text-navy text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-2 border-r border-slate-200">Subject Code</th>
                      <th className="p-2 border-r border-slate-200">Subject Title</th>
                      <th className="p-2 border-r border-slate-200 text-center">Score</th>
                      <th className="p-2 border-r border-slate-200 text-center">Max</th>
                      <th className="p-2 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-serif text-[11px]">
                    {publishedMarks.map(m => (
                      <tr key={m.id}>
                        <td className="p-2 border-r border-slate-200 font-sans font-bold text-navy">{m.subjectCode}</td>
                        <td className="p-2 border-r border-slate-200">{m.subjectName}</td>
                        <td className="p-2 border-r border-slate-200 text-center font-sans font-bold">{m.marksObtained}</td>
                        <td className="p-2 border-r border-slate-200 text-center font-sans text-slate-500">{m.maxMarks}</td>
                        <td className="p-2 text-center font-sans font-bold text-emerald-700">{m.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* GPA Summary & Official Seal */}
              <div className="flex justify-between items-end border-t border-slate-200 pt-4 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-navy">Semester GPA: <span className="text-gold-hover font-num text-sm">{studentSgpa}</span></div>
                  <div className="font-bold text-navy">Cumulative GPA: <span className="text-gold-hover font-num text-sm">{studentCgpa}</span></div>
                  <div className="text-[10px] text-slate-500 font-serif">
                    Academic Classification: <strong>{Number(studentCgpa) >= 3.5 ? 'First Class with Distinction' : Number(studentCgpa) >= 3.0 ? 'First Class' : Number(studentCgpa) > 0 ? 'Second Class' : 'Pending Evaluations'}</strong>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-20 h-20 border-2 border-navy/30 rounded-full flex items-center justify-center mx-auto bg-gold/10">
                    <CheckCircle2 className="w-10 h-10 text-navy" />
                  </div>
                  <span className="text-[10px] font-bold text-navy block uppercase">Controller of Examinations</span>
                  <span className="text-[9px] text-slate-400 font-serif block">Kalpanaaa University Registrar Seal</span>
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
