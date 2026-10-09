import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Filter, CheckCircle2, MessageSquare, Send } from 'lucide-react';

export const TeacherStudents = () => {
  const { currentUser } = useAuth();
  const { users, facultyClassAssignments, helpdesk, replyHelpdeskTicket, activeStaffClassId, staffSubjectAssignments = [] } = useData();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Reply State for Helpdesk Ticket
  const [replyTicketId, setReplyTicketId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [toastMsg, setToastMsg] = useState('');

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

  const currentFacultyId = currentUser.employeeId || currentUser.username || currentUser.id || 'EMP-101';
  const teacherName = currentUser.name;

  // Get active assignments for logged-in faculty
  const myFacultyAssignments = (facultyClassAssignments || []).filter(
    fca => fca.facultyId === currentFacultyId || fca.facultyName === teacherName
  );

  const activeAssignments = myFacultyAssignments.length > 0 ? myFacultyAssignments : (facultyClassAssignments || []).slice(0, 3);
  
  // Filter active assignments by activeStaffClassId if selected
  const scopedAssignments = activeAssignments.filter(a => {
    if (!activeStaffClassId || activeStaffClassId === 'ALL') return true;
    const key = a.classId || `${a.subjectCode || a.courseId || 'CLS'}-${a.year || a.semester}`;
    return key === activeStaffClassId || a.subjectCode === activeStaffClassId || a.classId === activeStaffClassId;
  });

  const targetAssignments = scopedAssignments.length > 0 ? scopedAssignments : activeAssignments;
  const myDeptCodes = [...new Set(targetAssignments.map(a => a.departmentCode))];
  const myYears = [...new Set(targetAssignments.map(a => a.year))];

  // Dynamically resolve students enrolled in the teacher's classes
  const assignedStudents = (users || []).filter(u => 
    u.role === 'STUDENT' && 
    (myDeptCodes.length === 0 || myDeptCodes.includes(u.departmentCode) || myDeptCodes.includes(u.department) || (u.department && myDeptCodes.some(code => u.department.includes(code)))) &&
    (myYears.length === 0 || myYears.includes(u.year))
  );

  const displayStudents = assignedStudents.length > 0 
    ? assignedStudents 
    : (users || []).filter(u => u.role === 'STUDENT').slice(0, 10);

  const filteredStudents = displayStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.studentId && s.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (s.rollNo && s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSem = selectedSemester === 'All' || s.semester === selectedSemester || s.year === selectedSemester;
    return matchesSearch && matchesSem;
  });

  // Filter helpdesk tickets routed to STAFF
  const staffTickets = (helpdesk || []).filter(t => t.targetRole === 'STAFF');

  const triggerReplyConfirm = (e) => {
    e.preventDefault();
    if (!replyTicketId || !replyText.trim()) return;

    setConfirmConfig({
      isOpen: true,
      title: "Confirm Faculty Response",
      message: `Are you sure you want to send this response to the student for ticket ${replyTicketId}?`,
      confirmText: "Yes, Send Response",
      type: "success",
      onConfirm: () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        replyHelpdeskTicket(replyTicketId, replyText, currentUser);
        setReplyTicketId(null);
        setReplyText('');
        setToastMsg(`Faculty response sent to Student Portal for ticket ${replyTicketId}!`);
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
                  STAFF FACULTY DESK &bull; ENROLLED COHORTS
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-navy mt-2 tracking-tight">
                  Student Directory & Assigned Rosters
                </h1>
                <p className="font-serif text-slate-500 text-xs sm:text-sm mt-1">
                  View all enrolled students across your assigned teaching cohorts and respond to subject-related queries.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setActiveTab('directory')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'directory' ? 'bg-gold text-navy-dark shadow' : 'text-slate-600 hover:text-navy'
                  }`}
                >
                  Student Directory ({displayStudents.length})
                </button>
                <button
                  onClick={() => setActiveTab('helpdesk')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'helpdesk' ? 'bg-gold text-navy-dark shadow' : 'text-slate-600 hover:text-navy'
                  }`}
                >
                  Subject Queries ({staffTickets.length})
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'directory' ? (
            /* STUDENT DIRECTORY TAB */
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-navy">Assigned Cohort Roster</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search student by name or ID..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy"
                  />
                  <span className="text-xs font-num font-bold text-navy bg-slate-100 px-3 py-1.5 rounded-full border">
                    Total: {filteredStudents.length} Students
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredStudents.map((s) => (
                  <div key={s.id || s.studentId} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:shadow-md transition">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.photoUrl || s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                          alt={s.name}
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'; }}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
                        />
                        <div>
                          <span className="text-[10px] font-num font-bold text-gold bg-navy px-2 py-0.5 rounded">{s.studentId || s.id}</span>
                          <h4 className="text-sm font-bold text-navy mt-0.5">{s.name}</h4>
                          <span className="font-serif text-[11px] text-slate-500 block truncate max-w-[130px]">{s.course || s.department}</span>
                        </div>
                      </div>
                      <span className="font-num font-bold text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">{s.overallAttendance || s.attendance || '90%'}</span>
                    </div>

                    <div className="pt-2 text-xs font-serif text-slate-600 space-y-1 border-t border-slate-200">
                      <div>Email: <strong className="font-sans text-navy">{s.email}</strong></div>
                      <div>Year/Sem: <strong className="font-num text-navy">{s.year || s.semester}</strong></div>
                      <div>CGPA: <strong className="font-num text-navy">{s.gpa || '3.80'}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* SUBJECT HELPDESK QUERIES TAB */
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-navy">Subject-Related Student Queries (Faculty Desk)</h3>
                <p className="font-serif text-xs text-slate-500">Student queries regarding course syllabus, assignments, and subject doubts are automatically routed here.</p>
              </div>

              <div className="space-y-4">
                {staffTickets.map((tkt) => (
                  <div key={tkt.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-xs font-num font-bold text-gold bg-navy px-2.5 py-0.5 rounded">{tkt.id} &bull; {tkt.category}</span>
                        <h4 className="text-base font-bold text-navy mt-1">{tkt.subject}</h4>
                        <span className="font-serif text-xs text-slate-500">Student: <strong>{tkt.applicantName}</strong> ({tkt.applicantId}) &bull; Date: {tkt.createdAt}</span>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        tkt.status === 'Responded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tkt.status}
                      </span>
                    </div>

                    <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Student Question</span>
                      <p className="font-serif text-slate-700 text-xs leading-relaxed">{tkt.description}</p>
                    </div>

                    {/* Faculty Responses list */}
                    {tkt.responses && tkt.responses.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase block">Previous Responses</span>
                        {tkt.responses.map((resp, idx) => (
                          <div key={idx} className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                            <div className="font-bold text-emerald-900">{resp.author} ({resp.role}) &bull; {resp.date}</div>
                            <p className="font-serif text-emerald-800">{resp.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => { setReplyTicketId(tkt.id); setReplyText(''); }}
                        className="px-4 py-2 bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs rounded-xl shadow flex items-center"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                        Reply to Student Query
                      </button>
                    </div>

                    {/* REPLY FORM */}
                    {replyTicketId === tkt.id && (
                      <form onSubmit={triggerReplyConfirm} className="p-4 bg-white border-2 border-gold/60 rounded-xl space-y-3 mt-3">
                        <h5 className="font-bold text-navy uppercase text-xs">Faculty Answer / Reply</h5>
                        <textarea
                          rows={3}
                          required
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your explanation or instructions for the student..."
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-serif focus:border-gold focus:outline-none"
                        />
                        <div className="flex justify-end space-x-2">
                          <button type="button" onClick={() => setReplyTicketId(null)} className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg text-xs">Cancel</button>
                          <button type="submit" className="px-4 py-1.5 bg-navy text-white hover:bg-navy-light font-bold rounded-lg shadow text-xs flex items-center">
                            <Send className="w-3.5 h-3.5 mr-1.5 text-gold" />
                            Send Faculty Reply
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

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
