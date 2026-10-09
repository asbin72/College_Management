import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { Plus, CheckCircle2, Eye, Globe, X } from 'lucide-react';

export const AdminExams = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const {
    examinations, subjects, courses, departments, marksRecords,
    addExamination, publishExamResults
  } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingExam, setViewingExam] = useState(null);
  const [formData, setFormData] = useState({});

  const courseList = (courses && courses.length > 0) ? courses : (subjects && subjects.length > 0 ? subjects : []);

  const openAddModal = () => {
    const defaultCourse = courseList[0] || {};
    setFormData({
      name: 'Spring 2026 End-Semester Examinations',
      type: 'End-Semester',
      department: defaultCourse.department || 'Computer Science & Engineering',
      course: defaultCourse.course || defaultCourse.name || 'B.Tech Computer Science & Engineering',
      semester: defaultCourse.semester || 'Semester 1',
      subjectCode: defaultCourse.code || 'CSE-101',
      subjectName: defaultCourse.name || 'Engineering Mathematics & Computing',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM - 01:00 PM',
      room: 'Main Auditorium Hall A',
      maxMarks: 100,
      eligibilityAttendance: 75
    });
    setShowAddModal(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    addExamination(formData, currentUser);
    setShowAddModal(false);
    alert(`Scheduled examination ${formData.name}!`);
  };

  const handlePublish = (examId) => {
    publishExamResults(examId, currentUser);
    alert(`Official Examination Results for exam ${examId} have been PUBLISHED! Students can now view their official grades in the Student Portal.`);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">MANAGEMENT CONTROL &bull; EXAMINATIONS</span>
              <h1 className="text-2xl font-serif font-bold text-navy mt-1">Examination & Results Publishing Console</h1>
              <p className="text-slate-500 text-xs mt-1">Schedule examinations, monitor marks submitted by faculty, review & publish official results.</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-navy hover:bg-navy-light text-gold font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Examination Schedule
            </button>
          </div>

          {/* Examinations List */}
          <div className="space-y-4">
            {examinations.map((exam) => {
              const examMarks = marksRecords.filter(m => m.examId === exam.id);

              return (
                <div key={exam.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-navy bg-amber-100 px-2 py-0.5 rounded">{exam.id}</span>
                        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded uppercase">{exam.type}</span>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          exam.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {exam.isPublished ? 'Results Published' : exam.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-serif font-bold text-navy mt-1">{exam.name}</h3>
                      <p className="text-xs font-semibold text-slate-700">Subject: <strong className="text-navy">{exam.subjectCode} - {exam.subjectName}</strong> &bull; Course: {exam.course} ({exam.semester})</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewingExam(exam)} className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Review Marks ({examMarks.length})
                      </button>

                      {!exam.isPublished ? (
                        <button
                          onClick={() => handlePublish(exam.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow uppercase tracking-wider flex items-center gap-1.5"
                        >
                          <Globe className="w-3.5 h-3.5" /> Publish Results to Students
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Published
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
                    <div><span className="text-slate-400">Date & Time:</span> <p className="font-bold text-navy">{exam.date} ({exam.time})</p></div>
                    <div><span className="text-slate-400">Venue / Room:</span> <p className="font-bold text-navy">{exam.room}</p></div>
                    <div><span className="text-slate-400">Max Marks:</span> <p className="font-bold text-navy">{exam.maxMarks}</p></div>
                    <div><span className="text-slate-400">Eligibility Min Attendance:</span> <p className="font-bold text-navy">{exam.eligibilityAttendance}%</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* CREATE EXAM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">Schedule New Examination</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-navy"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Exam Title</label>
                <input required type="text" value={formData.name || ''} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select required value={formData.type || 'Mid-Term'} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option value="Mid-Term">Mid-Term</option>
                    <option value="End-Semester">End-Semester</option>
                    <option value="Internal Quiz">Internal Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course / Subject</label>
                  <select required value={formData.subjectCode || ''} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-navy focus:border-gold focus:outline-none" onChange={e => {
                    const sub = courseList.find(s => s.code === e.target.value);
                    setFormData({
                      ...formData,
                      subjectCode: e.target.value,
                      subjectName: sub ? sub.name : '',
                      course: sub ? (sub.course || sub.name) : '',
                      department: sub ? sub.department : '',
                      semester: sub ? sub.semester : ''
                    });
                  }}>
                    {courseList.map(s => <option key={s.id || s.code} value={s.code}>{s.code} - {s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input required type="date" value={formData.date || ''} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room / Hall</label>
                  <input required type="text" value={formData.room || ''} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, room: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-navy text-gold font-bold rounded-lg hover:bg-navy-light">Schedule Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW MARKS DRAWER */}
      {viewingExam && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 space-y-4 overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-xs font-bold text-gold uppercase">{viewingExam.id}</span>
                <h3 className="text-xl font-serif font-bold text-navy">{viewingExam.subjectName}</h3>
              </div>
              <button onClick={() => setViewingExam(null)} className="text-slate-400 hover:text-navy"><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                <div>
                  <span className="font-bold text-navy block">Status: {viewingExam.status}</span>
                  <span className="text-slate-500">Published to Students: {viewingExam.isPublished ? 'YES' : 'NO'}</span>
                </div>
                {!viewingExam.isPublished && (
                  <button onClick={() => handlePublish(viewingExam.id)} className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded">
                    Publish Now
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-navy text-sm border-b pb-1">Marks Submitted by Teacher</h4>
                {marksRecords.filter(m => m.examId === viewingExam.id).map(m => (
                  <div key={m.id} className="p-3 bg-slate-50 rounded border flex justify-between items-center">
                    <div>
                      <span className="font-bold text-navy block">{m.studentName} ({m.studentId})</span>
                      <span className="text-slate-500 text-[11px]">{m.remarks || 'No remarks'}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 text-sm block">Grade: {m.grade}</span>
                      <span className="text-slate-500 font-bold">{m.marksObtained} / {m.maxMarks}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
