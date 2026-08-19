import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { HelpCircle, CheckCircle2, MessageSquare, Send, Plus, Search, ShieldAlert, User, Clock, BookOpen } from 'lucide-react';

export const TeacherHelpdesk = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const { helpdesk, submitHelpdeskTicket, replyHelpdeskTicket } = useData();

  const [activeTab, setActiveTab] = useState('STUDENT_QUERIES'); // 'STUDENT_QUERIES' | 'MY_REQUESTS' | 'NEW_REQUEST'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [replyTicketId, setReplyTicketId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // New Staff Ticket Form State
  const [newTicket, setNewTicket] = useState({
    category: 'Lab & Classroom Equipment',
    subject: '',
    description: '',
    priority: 'Normal'
  });

  // Confirmation Modal
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Yes, Confirm',
    type: 'primary',
    onConfirm: null
  });

  if (!currentUser) return null;

  const allTickets = helpdesk || [];
  
  // Student queries routed to Staff/Teachers
  const studentQueries = allTickets.filter(t => t.targetRole === 'STAFF');
  
  // Requests raised by this teacher to Administration
  const teacherId = currentUser.employeeId || currentUser.id;
  const myStaffRequests = allTickets.filter(t => 
    t.applicantId === teacherId || 
    t.applicantEmail === currentUser.email || 
    (t.applicantRole === 'STAFF' && t.applicantName === currentUser.name)
  );

  const filterList = (list) => {
    return list.filter(t => {
      const matchSearch = 
        t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = 
        statusFilter === 'ALL' ? true :
        statusFilter === 'OPEN' ? t.status === 'Open' :
        t.status === 'Responded' || t.status === 'Resolved';

      return matchSearch && matchStatus;
    });
  };

  const displayedStudentQueries = filterList(studentQueries);
  const displayedMyRequests = filterList(myStaffRequests);

  const handleCreateTicketSubmit = (e) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.description.trim()) return;

    setConfirmConfig({
      isOpen: true,
      title: "Submit Staff Support Request",
      message: `Are you sure you want to submit this request to University Administration?`,
      confirmText: "Yes, Submit to Admin",
      type: "primary",
      onConfirm: () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        submitHelpdeskTicket({
          ...newTicket,
          targetRole: 'ADMIN'
        }, currentUser);

        setNewTicket({
          category: 'Lab & Classroom Equipment',
          subject: '',
          description: '',
          priority: 'Normal'
        });
        setActiveTab('MY_REQUESTS');
        setToastMsg("Support request submitted successfully to University Administration!");
        setTimeout(() => setToastMsg(''), 4000);
      }
    });
  };

  const handleReplySubmit = (e, tktId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setConfirmConfig({
      isOpen: true,
      title: "Confirm Response",
      message: `Send this academic resolution to the student?`,
      confirmText: "Yes, Send Reply",
      type: "success",
      onConfirm: () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        replyHelpdeskTicket(tktId, replyText, currentUser);
        setReplyTicketId(null);
        setReplyText('');
        setToastMsg("Response sent successfully to student portal!");
        setTimeout(() => setToastMsg(''), 4000);
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans relative">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto font-sans">
          
          {toastMsg && (
            <div className="p-4 bg-emerald-500 text-white rounded-xl shadow-lg flex items-center justify-between font-sans text-xs font-bold animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>{toastMsg}</span>
              </div>
              <button onClick={() => setToastMsg('')} className="text-white hover:text-slate-200">&times;</button>
            </div>
          )}

          {/* Page Banner */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-navy text-xs font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded border border-gold/30">
                FACULTY HELP & QUERY DESK
              </span>
              <h1 className="text-2xl font-bold text-navy mt-2 tracking-tight">Student Queries & Staff Helpdesk</h1>
              <p className="text-slate-500 text-xs mt-1 font-serif">
                Review and resolve academic inquiries from students, or submit official infrastructure/administrative requests to Management.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('NEW_REQUEST')}
                className="px-4 py-2.5 bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                <span>Raise Staff Request</span>
              </button>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase">Student Queries</span>
                <div className="text-2xl font-bold text-navy font-num">{studentQueries.length}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase">Pending Action</span>
                <div className="text-2xl font-bold text-amber-600 font-num">
                  {studentQueries.filter(t => t.status === 'Open').length}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase">My Admin Requests</span>
                <div className="text-2xl font-bold text-navy font-num">{myStaffRequests.length}</div>
              </div>
            </div>
          </div>

          {/* TABS & SEARCH */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              
              <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setActiveTab('STUDENT_QUERIES')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center space-x-2 ${
                    activeTab === 'STUDENT_QUERIES' ? 'bg-navy text-gold shadow' : 'text-slate-600 hover:text-navy'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student Inquiries ({studentQueries.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('MY_REQUESTS')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center space-x-2 ${
                    activeTab === 'MY_REQUESTS' ? 'bg-navy text-gold shadow' : 'text-slate-600 hover:text-navy'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>My Admin Requests ({myStaffRequests.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('NEW_REQUEST')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center space-x-2 ${
                    activeTab === 'NEW_REQUEST' ? 'bg-navy text-gold shadow' : 'text-slate-600 hover:text-navy'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Request</span>
                </button>
              </div>

              {activeTab !== 'NEW_REQUEST' && (
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search subject or ID..."
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:border-gold focus:outline-none w-48 sm:w-64"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="OPEN">Pending (Open)</option>
                    <option value="RESOLVED">Resolved / Responded</option>
                  </select>
                </div>
              )}
            </div>

            {/* TAB 1: STUDENT QUERIES TO STAFF */}
            {activeTab === 'STUDENT_QUERIES' && (
              <div className="space-y-4">
                {displayedStudentQueries.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-navy">No pending student queries in your queue!</p>
                    <p className="text-xs text-slate-400 mt-1">All academic and subject doubts are up to date.</p>
                  </div>
                ) : (
                  displayedStudentQueries.map((tkt) => (
                    <div key={tkt.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-slate-300 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-num font-bold text-gold bg-navy px-2 py-0.5 rounded uppercase">
                              {tkt.id}
                            </span>
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                              {tkt.category}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-navy mt-1.5">{tkt.subject}</h4>
                          <span className="text-xs text-slate-500 font-serif">
                            From Scholar: <strong className="text-navy">{tkt.applicantName}</strong> ({tkt.applicantId}) &bull; Date: {tkt.createdAt}
                          </span>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                          tkt.status === 'Responded' || tkt.status === 'Resolved' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {tkt.status === 'Open' ? '● Needs Response' : '✓ Resolved'}
                        </span>
                      </div>

                      <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Student Doubt / Query</span>
                        <p className="font-serif text-slate-700 text-xs leading-relaxed">{tkt.description}</p>
                      </div>

                      {/* Responses Thread */}
                      {tkt.responses && tkt.responses.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase block">Faculty Answers</span>
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
                          className="px-4 py-2 bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs rounded-xl shadow flex items-center space-x-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Respond to Student</span>
                        </button>
                      </div>

                      {/* Reply Form */}
                      {replyTicketId === tkt.id && (
                        <form onSubmit={(e) => handleReplySubmit(e, tkt.id)} className="p-4 bg-white border-2 border-gold/60 rounded-xl space-y-3 mt-3">
                          <h5 className="font-bold text-navy uppercase text-xs">Faculty Academic Guidance</h5>
                          <textarea
                            rows={3}
                            required
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your explanation or guidance for the student..."
                            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-serif focus:border-gold focus:outline-none"
                          />
                          <div className="flex justify-end space-x-2">
                            <button type="button" onClick={() => setReplyTicketId(null)} className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg text-xs">Cancel</button>
                            <button type="submit" className="px-4 py-1.5 bg-navy text-white hover:bg-navy-light font-bold rounded-lg shadow text-xs flex items-center space-x-1">
                              <Send className="w-3.5 h-3.5 text-gold" />
                              <span>Dispatch Reply</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: MY REQUESTS TO ADMIN */}
            {activeTab === 'MY_REQUESTS' && (
              <div className="space-y-4">
                {displayedMyRequests.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500">
                    <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-navy">You have not raised any administrative requests.</p>
                    <button
                      onClick={() => setActiveTab('NEW_REQUEST')}
                      className="mt-3 px-4 py-2 bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs rounded-xl shadow"
                    >
                      Submit a New Request
                    </button>
                  </div>
                ) : (
                  displayedMyRequests.map((tkt) => (
                    <div key={tkt.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-num font-bold text-gold bg-navy px-2 py-0.5 rounded uppercase">{tkt.id}</span>
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">{tkt.category}</span>
                          </div>
                          <h4 className="text-base font-bold text-navy mt-1.5">{tkt.subject}</h4>
                          <span className="text-xs text-slate-500 font-serif">Routed to: <strong>Admin Desk</strong> &bull; Submitted on {tkt.createdAt}</span>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          tkt.status === 'Responded' || tkt.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {tkt.status}
                        </span>
                      </div>

                      <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">My Inquiry Details</span>
                        <p className="font-serif text-slate-700 text-xs leading-relaxed">{tkt.description}</p>
                      </div>

                      {tkt.responses && tkt.responses.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase block">Administrative Resolution</span>
                          {tkt.responses.map((resp, idx) => (
                            <div key={idx} className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                              <div className="font-bold text-emerald-900">{resp.author} ({resp.role}) &bull; {resp.date}</div>
                              <p className="font-serif text-emerald-800">{resp.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: CREATE NEW STAFF REQUEST */}
            {activeTab === 'NEW_REQUEST' && (
              <form onSubmit={handleCreateTicketSubmit} className="max-w-2xl mx-auto space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-serif font-bold text-navy border-b border-slate-200 pb-2">
                  Submit Institutional Support Request to Admin
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Request Category *</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none"
                    >
                      <option value="Lab & Classroom Equipment">Lab & Classroom Equipment</option>
                      <option value="IT & Network Support">IT & Network Infrastructure</option>
                      <option value="Teaching Assistant Request">Teaching Assistant Request</option>
                      <option value="Syllabus & Curriculum Revision">Syllabus Revision</option>
                      <option value="Examination Roster Inquiry">Examination Roster Inquiry</option>
                      <option value="Research Grant / Travel Allowance">Research Grant / Travel Allowance</option>
                      <option value="General Administration">General Administration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Priority Level</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none"
                    >
                      <option value="Normal">Normal Priority</option>
                      <option value="High">High Priority</option>
                      <option value="Urgent">Urgent / Immediate Action</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject / Summary *</label>
                  <input
                    type="text"
                    required
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    placeholder="e.g. Projector replacement needed in Turing Lab Room 302"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detailed Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    placeholder="Explain the issue, room number, or administrative support required in detail..."
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-serif focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('STUDENT_QUERIES')}
                    className="px-4 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-navy hover:bg-navy-light text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow"
                  >
                    <Send className="w-3.5 h-3.5 text-gold" />
                    <span>Submit to Administration</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </main>
      </div>

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
