import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { FloatingHelpdesk } from '../../components/portal/FloatingHelpdesk';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { FileUploadEngine } from '../../components/common/FileUploadEngine';
import { CheckCircle2, Upload, Send, Search } from 'lucide-react';

export const StudentAssignments = () => {
  const { currentUser } = useAuth();
  const { assignments, submitAssignment } = useData();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // File Upload State inside Modal
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submissionComments, setSubmissionComments] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Confirmation Modal State
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Yes, Confirm',
    type: 'primary',
    onConfirm: null
  });

  if (!currentUser) return null;

  const currentStudentId = currentUser.studentId || currentUser.username || currentUser.id || 'STU-CSE-101';
  let studentDeptCode = currentUser.departmentCode;
  if (!studentDeptCode) {
    if (currentUser.studentId && currentUser.studentId.includes('-')) {
      const parts = currentUser.studentId.split('-');
      if (parts.length >= 2) studentDeptCode = parts[1];
    }
  }
  if (!studentDeptCode) studentDeptCode = 'CSE';

  // Filter assignments strictly matching student's department and course
  const relevantAssignments = (assignments || []).filter(asn => {
    const isDept = !asn.department || asn.department === currentUser.department || (asn.departmentCode && asn.departmentCode === studentDeptCode);
    const isCode = !asn.subjectCode || asn.subjectCode.startsWith(studentDeptCode);
    return isDept && isCode;
  });

  // Map assignments for student view
  const studentAssignmentsList = relevantAssignments.map(asn => {
    const studentSub = (asn.submissions || []).find(s => s.studentId === currentStudentId || s.studentId === currentUser.id);
    let status = 'Pending';
    if (studentSub) {
      status = studentSub.status === 'Graded' ? 'Graded' : 'Submitted';
    }

    return {
      id: asn.id,
      title: asn.title,
      subject: asn.subject,
      faculty: asn.teacherName || 'Faculty Staff',
      assignedDate: asn.assignedDate || '2026-08-01',
      dueDate: asn.dueDate,
      maxMarks: asn.maxMarks || 30,
      status,
      description: asn.description || 'Complete the assigned project work according to guidelines.',
      instructions: asn.instructions ? [asn.instructions] : ["Submit PDF or ZIP file.", "Include documentation and code."],
      attachedFiles: ["Assignment_Guide.pdf"],
      submission: studentSub ? {
        submittedDate: studentSub.submittedDate,
        fileName: studentSub.file,
        fileSize: studentSub.fileSize || '2.4 MB',
        comments: studentSub.comments || '',
        marksAwarded: studentSub.marks,
        feedback: studentSub.feedback
      } : null
    };
  });

  const filteredAssignments = studentAssignmentsList.filter(item => {
    const matchesFilter = filterStatus === 'All' || item.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  const triggerSubmissionConfirm = (e) => {
    e.preventDefault();
    if (!uploadedFile || !selectedAssignment) return;

    setConfirmConfig({
      isOpen: true,
      title: "Confirm Assignment Submission",
      message: `Are you sure you want to SUBMIT file "${uploadedFile.name}" for "${selectedAssignment.title}" to ${selectedAssignment.faculty}?`,
      confirmText: "Yes, Submit Work",
      type: "success",
      onConfirm: () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        submitAssignment(selectedAssignment.id, {
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size,
          comments: submissionComments
        }, currentUser);

        setSubmissionSuccess(true);
        setTimeout(() => {
          setSubmissionSuccess(false);
          setSelectedAssignment(null);
          setUploadedFile(null);
          setSubmissionComments('');
        }, 2500);
      }
    });
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
                <span className="text-navy text-xs font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded border border-gold/30">
                  STUDENT PORTAL &bull; COURSEWORK ASSIGNMENTS
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-navy mt-2 tracking-tight">
                  My Assignments & Project Submissions
                </h1>
                <p className="font-serif text-slate-500 text-xs sm:text-sm mt-1">
                  Upload file submissions, track deadlines, and view faculty grading feedback in real time.
                </p>
              </div>

              <div className="flex items-center space-x-2 font-num text-xs font-bold text-navy bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span>Total Active Tasks: <strong>{studentAssignmentsList.length}</strong></span>
              </div>
            </div>
          </div>

          {/* FILTER TABS & SEARCH */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
            
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
              {['All', 'Pending', 'Submitted', 'Graded'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    filterStatus === st ? 'bg-gold text-navy-dark shadow' : 'text-slate-600 hover:text-navy'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search assignment title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* ASSIGNMENTS LIST */}
          <div className="space-y-4">
            {filteredAssignments.map((asn) => (
              <div key={asn.id} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-num font-bold text-gold bg-navy px-2.5 py-0.5 rounded">{asn.id}</span>
                    <h3 className="text-xl font-bold text-navy mt-1">{asn.title}</h3>
                    <span className="font-serif text-xs text-slate-500">{asn.subject} &bull; Faculty: <strong>{asn.faculty}</strong></span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${
                    asn.status === 'Graded' ? 'bg-emerald-100 text-emerald-800' :
                    asn.status === 'Submitted' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {asn.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-serif leading-relaxed">{asn.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 font-bold uppercase text-[10px] block">Assigned Date</span>
                    <span className="font-num font-bold text-slate-800 mt-0.5 block">{asn.assignedDate}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 font-bold uppercase text-[10px] block">Due Deadline</span>
                    <span className="font-num font-bold text-red-600 mt-0.5 block">{asn.dueDate}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 font-bold uppercase text-[10px] block">Maximum Marks</span>
                    <span className="font-num font-bold text-navy mt-0.5 block">{asn.maxMarks} Marks</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 font-bold uppercase text-[10px] block">Submission Status</span>
                    <span className="font-bold text-emerald-700 mt-0.5 block">{asn.submission ? "File Uploaded" : "Action Required"}</span>
                  </div>
                </div>

                {/* GRADED FEEDBACK DISPLAY */}
                {asn.status === 'Graded' && asn.submission && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-900 uppercase">Faculty Grade Awarded</span>
                      <strong className="font-num text-emerald-800 text-sm font-bold">{asn.submission.marksAwarded} / {asn.maxMarks} Marks</strong>
                    </div>
                    <p className="font-serif text-emerald-800">Faculty Feedback: "{asn.submission.feedback}"</p>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => { setSelectedAssignment(asn); setUploadedFile(null); setSubmissionSuccess(false); }}
                    className="px-5 py-2.5 bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-1.5" />
                    {asn.submission ? "View / Replace Submission" : "Submit Assignment"}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>

      {/* SUBMIT ASSIGNMENT MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-num font-bold text-gold bg-navy px-2.5 py-0.5 rounded">{selectedAssignment.id}</span>
                <h3 className="text-lg font-bold text-navy mt-1">{selectedAssignment.title}</h3>
                <span className="font-serif text-xs text-slate-500">{selectedAssignment.subject} &bull; Due: <strong className="font-num text-red-600">{selectedAssignment.dueDate}</strong></span>
              </div>
              <button onClick={() => setSelectedAssignment(null)} className="text-slate-400 text-lg font-bold">&times;</button>
            </div>

            {submissionSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-navy">Assignment Submitted Successfully!</h4>
                <p className="text-xs text-slate-600 font-serif">Dispatched to Faculty Desk ({selectedAssignment.faculty}).</p>
              </div>
            ) : (
              <form onSubmit={triggerSubmissionConfirm} className="space-y-4 text-xs font-sans">
                
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-navy uppercase text-[10px]">Instructions</span>
                  {selectedAssignment.instructions.map((ins, i) => (
                    <div key={i} className="text-slate-600 font-serif">&bull; {ins}</div>
                  ))}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-2">Cloud File Upload & Submission Engine *</label>
                  <FileUploadEngine
                    maxSizeMB={25}
                    onUploadComplete={(fileMeta) => {
                      setUploadedFile({
                        name: fileMeta.name,
                        size: fileMeta.size,
                        url: fileMeta.url,
                        provider: fileMeta.provider
                      });
                    }}
                    onFileRemove={() => setUploadedFile(null)}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Submission Comments (Optional)</label>
                  <textarea
                    rows={2}
                    value={submissionComments}
                    onChange={(e) => setSubmissionComments(e.target.value)}
                    placeholder="Add comments for faculty..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button type="button" onClick={() => setSelectedAssignment(null)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-gold hover:bg-gold-hover text-navy-dark rounded-xl font-bold uppercase tracking-wider shadow flex items-center">
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Submit to Faculty
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

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

      <FloatingHelpdesk />
    </div>
  );
};
