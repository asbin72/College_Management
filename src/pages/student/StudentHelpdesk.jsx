import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { HelpCircle, CheckCircle2, Send, Plus, Search, Clock } from 'lucide-react';

export const StudentHelpdesk = () => {
  const { currentUser } = useAuth();
  const { helpdesk, submitHelpdeskTicket } = useData();

  const [activeTab, setActiveTab] = useState('MY_TICKETS'); // 'MY_TICKETS' | 'NEW_TICKET'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMsg, setToastMsg] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  // New Student Ticket Form State
  const [newTicket, setNewTicket] = useState({
    category: 'Academic Query',
    targetRole: 'STAFF', // 'STAFF' | 'ADMIN'
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
  const stuId = currentUser.studentId || currentUser.username || currentUser.id;
  
  // Student's own tickets
  const myTickets = allTickets.filter(t => 
    t.applicantId === stuId || 
    t.studentId === stuId ||
    t.applicantEmail === currentUser.email || 
    t.applicantName === currentUser.name ||
    t.studentName === currentUser.name
  );

  const filteredTickets = myTickets.filter(t => {
    const matchSearch = 
      t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = 
      statusFilter === 'ALL' ? true :
      statusFilter === 'OPEN' ? t.status === 'Open' :
      t.status === 'Responded' || t.status === 'Resolved';

    return matchSearch && matchStatus;
  });

  const handleCreateTicketSubmit = (e) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.description.trim()) return;

    setConfirmConfig({
      isOpen: true,
      title: "Submit Support Ticket",
      message: `Submit this ticket to the ${newTicket.targetRole === 'STAFF' ? 'Faculty / Teaching Staff' : 'Administrative Office'}?`,
      confirmText: "Yes, Submit Ticket",
      type: "primary",
      onConfirm: () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        submitHelpdeskTicket(newTicket, currentUser);

        setNewTicket({
          category: 'Academic Query',
          targetRole: 'STAFF',
          subject: '',
          description: '',
          priority: 'Normal'
        });
        setActiveTab('MY_TICKETS');
        setToastMsg("Support ticket created and routed successfully!");
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
                STUDENT SUPPORT & HELPDESK
              </span>
              <h1 className="text-2xl font-bold text-navy mt-2 tracking-tight">Helpdesk & Query Center</h1>
              <p className="text-slate-500 text-xs mt-1 font-serif">
                Submit academic questions to professors, or request administrative services (fee installments, bonafide certificates, records).
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('NEW_TICKET')}
                className="px-4 py-2.5 bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                <span>Raise New Query</span>
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase">Total Tickets</span>
                <div className="text-2xl font-bold text-navy font-num">{myTickets.length}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase">In Review / Open</span>
                <div className="text-2xl font-bold text-amber-600 font-num">
                  {myTickets.filter(t => t.status === 'Open').length}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase">Responded</span>
                <div className="text-2xl font-bold text-emerald-600 font-num">
                  {myTickets.filter(t => t.status === 'Responded' || t.status === 'Resolved').length}
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT CARD */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              
              <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setActiveTab('MY_TICKETS')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center space-x-2 ${
                    activeTab === 'MY_TICKETS' ? 'bg-navy text-gold shadow' : 'text-slate-600 hover:text-navy'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>My Support Tickets ({myTickets.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('NEW_TICKET')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center space-x-2 ${
                    activeTab === 'NEW_TICKET' ? 'bg-navy text-gold shadow' : 'text-slate-600 hover:text-navy'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Ticket</span>
                </button>
              </div>

              {activeTab === 'MY_TICKETS' && (
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search tickets..."
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:border-gold focus:outline-none w-48 sm:w-64"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="OPEN">Under Review (Open)</option>
                    <option value="RESOLVED">Responded</option>
                  </select>
                </div>
              )}
            </div>

            {/* TAB 1: MY TICKETS LIST */}
            {activeTab === 'MY_TICKETS' && (
              <div className="space-y-4">
                {filteredTickets.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500">
                    <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-navy">No tickets found.</p>
                    <button
                      onClick={() => setActiveTab('NEW_TICKET')}
                      className="mt-3 px-4 py-2 bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs rounded-xl shadow"
                    >
                      Submit a Question
                    </button>
                  </div>
                ) : (
                  filteredTickets.map((tkt) => (
                    <div key={tkt.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-num font-bold text-gold bg-navy px-2 py-0.5 rounded uppercase">{tkt.id}</span>
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{tkt.category}</span>
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                              Routed to: {tkt.targetRole === 'STAFF' ? 'Teaching Faculty' : 'Admin Desk'}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-navy mt-1.5">{tkt.subject}</h4>
                          <span className="text-xs text-slate-500 font-serif">Submitted on {tkt.createdAt}</span>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          tkt.status === 'Responded' || tkt.status === 'Resolved' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {tkt.status === 'Open' ? '● Under Review' : '✓ Answered'}
                        </span>
                      </div>

                      <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">My Query</span>
                        <p className="font-serif text-slate-700 text-xs leading-relaxed">{tkt.description}</p>
                      </div>

                      {/* Official Responses */}
                      {tkt.responses && tkt.responses.length > 0 ? (
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase block">Official Response</span>
                          {tkt.responses.map((resp, idx) => (
                            <div key={idx} className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                              <div className="font-bold text-emerald-900 flex items-center space-x-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>{resp.author} ({resp.role}) &bull; {resp.date}</span>
                              </div>
                              <p className="font-serif text-emerald-800 pl-5">{resp.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-amber-800 flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <span>Our staff/admin team is reviewing your query. You will receive a notification once responded.</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: CREATE NEW STUDENT TICKET */}
            {activeTab === 'NEW_TICKET' && (
              <form onSubmit={handleCreateTicketSubmit} className="max-w-2xl mx-auto space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-serif font-bold text-navy border-b border-slate-200 pb-2">
                  Create Support Ticket / Academic Query
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Route Query To *</label>
                    <select
                      value={newTicket.targetRole}
                      onChange={(e) => {
                        const newTarget = e.target.value;
                        setNewTicket({
                          ...newTicket,
                          targetRole: newTarget,
                          category: newTarget === 'ADMIN' ? 'Profile & Record Correction' : 'Academic Query'
                        });
                      }}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none"
                    >
                      <option value="ADMIN">🏢 Administrative Office (Profile, Records, Fees, ID)</option>
                      <option value="STAFF">👨‍🏫 Faculty / Teaching Staff (Academic & Subjects)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => {
                        const cat = e.target.value;
                        const adminCats = ['Profile & Record Correction', 'Fee & Billing', 'Certificate & Official Records', 'Hostel & Accommodation', 'Technical & Portal Support', 'General Administration'];
                        setNewTicket({
                          ...newTicket,
                          category: cat,
                          targetRole: adminCats.includes(cat) ? 'ADMIN' : newTicket.targetRole
                        });
                      }}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none"
                    >
                      {newTicket.targetRole === 'STAFF' ? (
                        <>
                          <option value="Academic Query">Academic / Subject Doubt</option>
                          <option value="Assignment Help">Assignment Guidance</option>
                          <option value="Attendance Discrepancy">Attendance Correction</option>
                          <option value="Internal Marks Query">Internal Marks Review</option>
                          <option value="Lab Practicum Query">Lab Practicum Doubt</option>
                        </>
                      ) : (
                        <>
                          <option value="Profile & Record Correction">Profile / Personal Details Correction</option>
                          <option value="Fee & Billing">Tuition & Exam Fee Installment</option>
                          <option value="Certificate & Official Records">Bonafide / Degree Certificate</option>
                          <option value="Hostel & Accommodation">Hostel / Transport Allocation</option>
                          <option value="Technical & Portal Support">Portal Login & Wi-Fi Access</option>
                          <option value="General Administration">General Administration</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject / Question Summary *</label>
                  <input
                    type="text"
                    required
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    placeholder="e.g. Query regarding CS-601 Machine Learning Assignment 2 submission deadline"
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
                    placeholder="Describe your doubt, subject code, semester, or administrative request in full detail..."
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-serif focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('MY_TICKETS')}
                    className="px-4 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-navy hover:bg-navy-light text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow"
                  >
                    <Send className="w-3.5 h-3.5 text-gold" />
                    <span>Submit Query Ticket</span>
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
