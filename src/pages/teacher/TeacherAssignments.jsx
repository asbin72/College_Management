import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Plus, CheckCircle2, Download, Eye, Send } from 'lucide-react';

export const TeacherAssignments = () => {
  const { currentUser } = useAuth();
  const { assignments = [], subjects = [], addAssignment, gradeSubmission } = useData();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const assignedSubs = subjects.filter(s =>
    s.assignedTeacherId === currentUser?.employeeId ||
    s.assignedTeacherId === currentUser?.id ||
    s.assignedTeacherName === currentUser?.name ||
    (currentUser?.department && s.department === currentUser?.department) ||
    (currentUser?.departmentCode && s.departmentCode === currentUser?.departmentCode)
  );

  const subjectOptions = assignedSubs.length > 0 ? assignedSubs : subjects.slice(0, 10);

  // Confirmation Modal State
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Yes, Confirm',
    type: 'primary',
    onConfirm: null
  });

  // Create Assignment Form State
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: subjectOptions[0] ? `${subjectOptions[0].code} ${subjectOptions[0].name}` : 'Curriculum Subject',
    class: currentUser?.department || 'Engineering Program',
    section: 'Sec A',
    description: '',
    instructions: '',
    dueDate: '',
    maxMarks: 30,
    status: 'PUBLISHED'
  });

  // Grading Modal State
  const [gradingStudent, setGradingStudent] = useState(null);
  const [gradeMarks, setGradeMarks] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  if (!currentUser) return null;

  const triggerCreateAssignmentConfirm = (e) => {
    e.preventDefault();
    setConfirmConfig({
      isOpen: true,
      title: "Confirm Assignment Publication",
      message: `Are you sure you want to PUBLISH assignment "${newAssignment.title}" to student portals?`,
      confirmText: "Yes, Publish Assignment",
      type: "success",
      onConfirm: () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        addAssignment(newAssignment, currentUser);
        setShowCreateModal(false);
        setToastMsg(`Assignment "${newAssignment.title}" published! Dispatched to Student Portals.`);
        setTimeout(() => setToastMsg(''), 4000);
        setNewAssignment({ title: '', subject: 'CS-601 Artificial Intelligence & Neural Networks', class: 'B.Tech CSE', section: 'Sec A', description: '', instructions: '', dueDate: '', maxMarks: 30, status: 'PUBLISHED' });
      }
    });
  };

  const triggerSaveGradeConfirm = (e) => {
    e.preventDefault();
    if (!selectedSubmissions || !gradingStudent) return;

    setConfirmConfig({
      isOpen: true,
      title: "Confirm Student Grading",
      message: `Are you sure you want to save grade ${gradeMarks}/${selectedSubmissions.maxMarks} and feedback for ${gradingStudent.studentName}?`,
      confirmText: "Yes, Save & Send Grade",
      type: "success",
      onConfirm: () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        const targetStudentId = gradingStudent.studentId || gradingStudent.id;
        gradeSubmission(selectedSubmissions.id, targetStudentId, gradeMarks, gradeFeedback, currentUser);
        setGradingStudent(null);
        setToastMsg(`Grade & feedback saved for ${gradingStudent.studentName || 'Student'}! Sent to Student Portal.`);
        setTimeout(() => setToastMsg(''), 4000);
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans relative">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto font-sans">
          
          {toastMsg && (
            <div className="p-4 bg-emerald-500 text-white rounded-xl shadow-lg flex items-center justify-between font-sans text-xs font-bold animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>{toastMsg}</span>
              </div>
              <button onClick={() => setToastMsg('')} className="text-white hover:text-slate-200">&times;</button>
            </div>
          )}

          {/* Header */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-navy text-xs font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded border border-gold/30">
                  ASSIGNMENTS & STUDENT EVALUATION
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-navy mt-2 tracking-tight">
                  Assignment Creation & Grading Desk
                </h1>
                <p className="font-serif text-slate-500 text-xs sm:text-sm mt-1">
                  Create coursework assignments, review student file uploads, and submit grade feedback.
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center justify-center bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs px-5 py-3 rounded-xl shadow uppercase tracking-wider flex-shrink-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Assignment
              </button>
            </div>
          </div>

          {/* ASSIGNMENT METRICS CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-sans">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">TOTAL ASSIGNMENTS</span>
              <span className="text-2xl font-num font-bold text-navy block mt-1">{assignments.length}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">PUBLISHED</span>
              <span className="text-2xl font-num font-bold text-emerald-600 block mt-1">{assignments.filter(a => a.status === 'PUBLISHED').length}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">SUBMISSIONS</span>
              <span className="text-2xl font-num font-bold text-purple-600 block mt-1">
                {assignments.reduce((sum, a) => sum + (a.submissions ? a.submissions.length : 0), 0)}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">EVALUATED</span>
              <span className="text-2xl font-num font-bold text-blue-600 block mt-1">
                {assignments.reduce((sum, a) => sum + (a.submissions ? a.submissions.filter(s => s.status === 'Graded').length : 0), 0)}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">PENDING EVALUATION</span>
              <span className="text-2xl font-num font-bold text-amber-600 block mt-1">
                {assignments.reduce((sum, a) => sum + (a.submissions ? a.submissions.filter(s => s.status !== 'Graded').length : 0), 0)}
              </span>
            </div>
          </div>

          {/* ASSIGNMENTS LIST */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-navy">Published Assignments Roster</h3>

            <div className="space-y-4">
              {assignments.map((asn) => (
                <div key={asn.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-num font-bold text-gold bg-navy px-2.5 py-0.5 rounded">{asn.id} &bull; {asn.status}</span>
                      <h4 className="text-base font-bold text-navy mt-1">{asn.title}</h4>
                      <span className="text-xs text-slate-500 font-sans">
                        {asn.subject} {asn.classId || asn.class ? `• ${asn.classId || asn.class}` : ''} {asn.dueDate ? `• Due: ${asn.dueDate}` : ''} • Max Marks: <strong className="font-num text-navy font-bold">{asn.maxMarks}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedSubmissions(asn)}
                      className="px-4 py-2 bg-navy text-white hover:bg-navy-light rounded-xl font-bold text-xs shadow flex items-center flex-shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1 text-gold" />
                      Review Submissions ({(asn.submissions || []).length})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-navy">Create & Publish Assignment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 text-lg">&times;</button>
            </div>

            <form onSubmit={triggerCreateAssignmentConfirm} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="e.g. Neural Networks Backpropagation Lab"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Subject *</label>
                  <select
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    {subjectOptions.map(s => (
                      <option key={s.id || s.code} value={`${s.code} ${s.name}`}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Maximum Marks *</label>
                  <input
                    type="number"
                    required
                    value={newAssignment.maxMarks}
                    onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-num font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-num font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Problem Description & Instructions *</label>
                <textarea
                  rows={3}
                  required
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Detail the project requirements, file format, and guidelines..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-gold hover:bg-gold-hover text-navy-dark rounded-xl font-bold uppercase tracking-wider shadow">
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW & GRADE SUBMISSIONS MODAL */}
      {selectedSubmissions && (() => {
        const activeAssignment = assignments.find(a => a.id === selectedSubmissions.id) || selectedSubmissions;
        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 font-sans max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-navy">Student Submissions — {activeAssignment.title}</h3>
                  <p className="font-serif text-xs text-slate-500">Subject: {activeAssignment.subject} &bull; Max Marks: {activeAssignment.maxMarks}</p>
                </div>
                <button onClick={() => setSelectedSubmissions(null)} className="text-slate-400 text-lg font-bold">&times;</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Submitted File</th>
                      <th className="p-3">Marks</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {(activeAssignment.submissions || []).map((sub) => (
                      <tr key={sub.studentId || sub.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">{sub.studentName} ({sub.studentId})</td>
                        <td className="p-3 font-bold text-navy flex items-center">
                          <Download className="w-3.5 h-3.5 mr-1 text-gold" />
                          {sub.file || sub.fileName || 'Assignment_Submission.pdf'}
                        </td>
                        <td className="p-3 font-num font-bold text-emerald-700">
                          {sub.marks !== null && sub.marks !== undefined && sub.marks !== '' ? `${sub.marks} / ${activeAssignment.maxMarks}` : 'Not Graded'}
                        </td>
                        <td className="p-3">
                          {(() => {
                            const isGraded = sub.status === 'Graded' || (sub.marks !== null && sub.marks !== undefined && sub.marks !== '');
                            return (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isGraded ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {isGraded ? 'Graded' : (sub.status || 'Submitted')}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => { setGradingStudent(sub); setGradeMarks(sub.marks !== null && sub.marks !== undefined ? sub.marks : ''); setGradeFeedback(sub.feedback || ''); }}
                            className="px-3 py-1.5 bg-navy text-white hover:bg-navy-light text-[11px] font-bold rounded-lg shadow-sm"
                          >
                            Grade / Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            {/* GRADING SUB-FORM */}
            {gradingStudent && (
              <form onSubmit={triggerSaveGradeConfirm} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 mt-4 text-xs font-sans">
                <h4 className="font-bold text-navy uppercase">Grading: {gradingStudent.studentName} ({gradingStudent.studentId})</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Enter Marks (Max {selectedSubmissions.maxMarks}) *</label>
                    <input
                      type="number"
                      required
                      max={selectedSubmissions.maxMarks}
                      value={gradeMarks}
                      onChange={(e) => setGradeMarks(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-num font-bold text-navy"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Faculty Feedback Comments</label>
                    <input
                      type="text"
                      value={gradeFeedback}
                      onChange={(e) => setGradeFeedback(e.target.value)}
                      placeholder="e.g. Excellent work on pipeline!"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-serif text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setGradingStudent(null)} className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-gold hover:bg-gold-hover text-navy-dark font-bold rounded-lg shadow">Save Grade</button>
                </div>
              </form>
            )}

            </div>
          </div>
        );
      })()}

      {/* CONFIRMATION ACTION MODAL */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText="No, Cancel"
        type={confirmConfig.type}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
