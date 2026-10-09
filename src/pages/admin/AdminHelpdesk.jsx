import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { HelpCircle, CheckCircle2, XCircle, MessageSquare, Send, Users, UserCheck, Search, Filter, Clock, CheckCheck, Sparkles, ShieldCheck } from 'lucide-react';

export const AdminHelpdesk = () => {
  const { currentUser } = useAuth();
  const { helpdesk, replyHelpdeskTicket, updateUser } = useData();

  const [senderFilter, setSenderFilter] = useState('ALL'); // 'ALL' | 'STUDENT' | 'STAFF'
  const [deskFilter, setDeskFilter] = useState('ALL'); // 'ALL' | 'ADMIN' | 'STAFF'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'OPEN' | 'RESOLVED'
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const [replyTicketId, setReplyTicketId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleAcceptTicket = (tkt) => {
    const defaultMsg = `Your support request regarding "${tkt.subject}" has been ACCEPTED & APPROVED by Administration.`;
    replyHelpdeskTicket(tkt.id, defaultMsg, currentUser);
    setToastMsg(`Request ${tkt.id} officially ACCEPTED & APPROVED!`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleRejectTicket = (tkt) => {
    const reason = window.prompt(`Enter administrative reason for rejecting request "${tkt.subject}":`, 'Request does not meet institutional compliance policies.');
    if (reason !== null) {
      const rejectMsg = `Your request regarding "${tkt.subject}" has been REJECTED. Reason: ${reason}`;
      replyHelpdeskTicket(tkt.id, rejectMsg, currentUser);
      setToastMsg(`Request ${tkt.id} REJECTED.`);
      setTimeout(() => setToastMsg(''), 4000);
    }
  };
  const [applyRecordUpdate, setApplyRecordUpdate] = useState(true);
  const [updateFieldName, setUpdateFieldName] = useState('name');
  const [updateFieldValue, setUpdateFieldValue] = useState('');
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

  const allTickets = helpdesk || [];
  
  const studentCount = allTickets.filter(t => t.applicantRole === 'STUDENT' || (!t.applicantRole && !t.applicantId?.startsWith('EMP'))).length;
  const staffCount = allTickets.filter(t => t.applicantRole === 'STAFF' || t.applicantId?.startsWith('EMP')).length;
  const openCount = allTickets.filter(t => t.status === 'Open').length;
  const resolvedCount = allTickets.filter(t => t.status === 'Responded' || t.status === 'Resolved').length;

  const filteredTickets = allTickets.filter(t => {
    const isStaffSender = t.applicantRole === 'STAFF' || t.applicantId?.startsWith('EMP');
    const isStudentSender = !isStaffSender;

    const matchSender = 
      senderFilter === 'ALL' ? true :
      senderFilter === 'STUDENT' ? isStudentSender :
      isStaffSender;

    const matchDesk = 
      deskFilter === 'ALL' ? true :
      deskFilter === 'ADMIN' ? t.targetRole === 'ADMIN' :
      t.targetRole === 'STAFF';

    const matchStatus = 
      statusFilter === 'ALL' ? true :
      statusFilter === 'OPEN' ? t.status === 'Open' :
      t.status === 'Responded' || t.status === 'Resolved';

    const matchSearch = 
      t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchSender && matchDesk && matchStatus && matchSearch;
  });

  // Helper to parse profile correction details from ticket description
  const parseProfileRequest = (tkt) => {
    if (!tkt || !tkt.description) return null;
    const isProfileTkt = 
      (tkt.category && tkt.category.toLowerCase().includes('profile')) ||
      (tkt.subject && tkt.subject.toLowerCase().includes('profile')) ||
      tkt.description.includes('requested official change') ||
      tkt.description.includes('Requested Value:');

    if (!isProfileTkt) return null;

    const reqValMatch = tkt.description.match(/Requested Value:\s*"([^"]+)"/i) || tkt.description.match(/to:\s*"([^"]+)"/i);
    const fieldMatch = tkt.description.match(/\[([^\]]+)\]/i);

    const fieldLabel = fieldMatch ? fieldMatch[1] : (tkt.subject ? tkt.subject.replace('Profile Correction Request:', '').trim() : 'Full Name');
    const newVal = reqValMatch ? reqValMatch[1] : '';

    let fieldKey = 'name';
    if (fieldLabel.toLowerCase().includes('name')) fieldKey = 'name';
    else if (fieldLabel.toLowerCase().includes('phone')) fieldKey = 'phone';
    else if (fieldLabel.toLowerCase().includes('email')) fieldKey = 'email';
    else if (fieldLabel.toLowerCase().includes('address')) fieldKey = 'address';
    else if (fieldLabel.toLowerCase().includes('gender')) fieldKey = 'gender';
    else if (fieldLabel.toLowerCase().includes('blood')) fieldKey = 'bloodGroup';
    else if (fieldLabel.toLowerCase().includes('birth') || fieldLabel.toLowerCase().includes('dob')) fieldKey = 'dateOfBirth';

    return {
      fieldLabel,
      fieldKey,
      newVal
    };
  };

  // One-click instant approve and update profile record
  const handleInstantApproveProfile = (tkt, parsed) => {
    const applicantId = tkt.applicantId || tkt.studentId || tkt.applicantEmail;
    const valToUpdate = parsed.newVal || updateFieldValue;
    const fieldToUpdate = parsed.fieldKey || updateFieldName;

    setConfirmConfig({
      isOpen: true,
      title: `Confirm Profile Record Update`,
      message: `Approve and officially update ${parsed.fieldLabel} to "${valToUpdate}" for student ${tkt.applicantName} (${applicantId})?`,
      confirmText: "Yes, Approve & Update Record",
      type: "success",
      onConfirm: () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));

        // 1. Update live student record
        if (updateUser) {
          updateUser(applicantId, { [fieldToUpdate]: valToUpdate }, currentUser);
        }

        // 2. Dispatch official resolution reply
        const resolutionMsg = `Official Update Approved: Your requested change for [${parsed.fieldLabel}] has been officially APPROVED and applied to your institutional student record. Updated value: "${valToUpdate}".`;
        replyHelpdeskTicket(tkt.id, resolutionMsg, currentUser);

        setToastMsg(`Official record updated! ${parsed.fieldLabel} set to "${valToUpdate}" for ${tkt.applicantName}.`);
        setTimeout(() => setToastMsg(''), 5000);
      }
    });
  };

  const triggerReplyConfirm = (e, tkt) => {
    e.preventDefault();
    if (!replyTicketId || !replyText.trim()) return;

    setConfirmConfig({
      isOpen: true,
      title: "Confirm Official Response",
      message: `Dispatch official response to ${tkt.applicantName} (${tkt.applicantRole || 'User'}) for ticket ${tkt.id}?`,
      confirmText: "Yes, Dispatch Response",
      type: "success",
      onConfirm: () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));

        // If admin checked update record
        if (applyRecordUpdate && updateFieldValue.trim()) {
          const applicantId = tkt.applicantId || tkt.studentId || tkt.applicantEmail;
          if (updateUser) {
            updateUser(applicantId, { [updateFieldName]: updateFieldValue.trim() }, currentUser);
          }
        }

        replyHelpdeskTicket(replyTicketId, replyText, currentUser);
        setReplyTicketId(null);
        setReplyText('');
        setUpdateFieldValue('');
        setToastMsg(`Official resolution sent to ${tkt.applicantName} for ticket ${tkt.id}!`);
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

          {/* PAGE BANNER */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-navy text-xs font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded font-sans border border-gold/30">
                CENTRAL INSTITUTIONAL HELPDESK & SUPPORT
              </span>
              <h1 className="text-2xl font-bold text-navy mt-2 tracking-tight">Institutional Support Desk & Queries</h1>
              <p className="font-serif text-slate-500 text-xs mt-1">
                Process student administrative queries, approve official profile record change requests, and provide resolutions.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3.5 py-1.5 bg-navy text-gold text-xs font-bold rounded-xl shadow-sm font-num flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Active Queries: {allTickets.length}</span>
              </span>
            </div>
          </div>

          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold uppercase">Student Tickets</span>
                <div className="text-2xl font-bold text-navy font-num">{studentCount}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold uppercase">Staff Tickets</span>
                <div className="text-2xl font-bold text-navy font-num">{staffCount}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold uppercase">Pending Action</span>
                <div className="text-2xl font-bold text-amber-600 font-num">{openCount}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold uppercase">Resolved / Closed</span>
                <div className="text-2xl font-bold text-emerald-600 font-num">{resolvedCount}</div>
              </div>
            </div>
          </div>

          {/* FILTER BAR & TICKET LIST */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              
              <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
                <button
                  onClick={() => setSenderFilter('ALL')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                    senderFilter === 'ALL' ? 'bg-navy text-gold shadow' : 'text-slate-600 hover:text-navy'
                  }`}
                >
                  All Sources ({allTickets.length})
                </button>
                <button
                  onClick={() => setSenderFilter('STUDENT')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center space-x-1 ${
                    senderFilter === 'STUDENT' ? 'bg-navy text-gold shadow' : 'text-slate-600 hover:text-navy'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Students ({studentCount})</span>
                </button>
                <button
                  onClick={() => setSenderFilter('STAFF')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center space-x-1 ${
                    senderFilter === 'STAFF' ? 'bg-navy text-gold shadow' : 'text-slate-600 hover:text-navy'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Staff / Faculty ({staffCount})</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search applicant, subject, ID..."
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:border-gold focus:outline-none w-48 sm:w-64"
                  />
                </div>

                <select
                  value={deskFilter}
                  onChange={(e) => setDeskFilter(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none"
                >
                  <option value="ALL">All Desks</option>
                  <option value="ADMIN">Target: Admin Desk</option>
                  <option value="STAFF">Target: Staff Desk</option>
                </select>

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
            </div>

            {/* TICKETS QUEUE */}
            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500">
                  <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-navy">No support requests match your filters.</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting the filter criteria or search query.</p>
                </div>
              ) : (
                filteredTickets.map((tkt) => {
                  const isStaff = tkt.applicantRole === 'STAFF' || tkt.source === 'STAFF' || (tkt.staffId && String(tkt.staffId).startsWith('EMP')) || (tkt.applicantId && String(tkt.applicantId).startsWith('EMP'));
                  const applicantName = tkt.applicantName || tkt.studentName || tkt.staffName || (isStaff ? 'Faculty Member' : 'Enrolled Student');
                  const applicantId = tkt.applicantId || tkt.studentId || tkt.staffId || tkt.applicantEmail || 'Student';
                  const createdDate = tkt.createdAt || tkt.date || (tkt.created_at ? new Date(tkt.created_at).toISOString().split('T')[0] : '2026-08-15');
                  
                  let responsesList = [];
                  try {
                    responsesList = Array.isArray(tkt.responses) ? tkt.responses : (typeof tkt.replies === 'string' ? JSON.parse(tkt.replies) : (tkt.replies || []));
                  } catch (e) {}

                  const isResolved = tkt.status === 'Responded' || tkt.status === 'Resolved' || responsesList.length > 0;
                  const profileReq = parseProfileRequest(tkt);

                  return (
                    <div key={tkt.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-slate-300 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-num font-bold text-gold bg-navy px-2 py-0.5 rounded uppercase">
                              {tkt.id}
                            </span>
                            
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 ${
                              isStaff ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}>
                              {isStaff ? <UserCheck className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                              <span>{isStaff ? 'STAFF / FACULTY' : 'STUDENT'}</span>
                            </span>

                            <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                              {tkt.category || 'General Query'}
                            </span>

                            <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                              Target: {tkt.targetRole === 'STAFF' ? 'Staff Desk' : 'Admin Desk'}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-navy mt-1.5">{tkt.subject}</h4>
                          
                          <div className="text-xs text-slate-500 font-serif flex flex-wrap items-center gap-x-2 mt-0.5">
                            <span>From: <strong className="text-navy">{applicantName}</strong> ({applicantId})</span>
                            <span>&bull;</span>
                            <span>Date: {createdDate}</span>
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {isResolved ? '✓ Resolved' : '● Needs Response'}
                        </span>
                      </div>

                      <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          {isStaff ? 'Staff Inquirer Message' : 'Student Description'}
                        </span>
                        <p className="font-serif text-slate-700 text-xs leading-relaxed">{tkt.description}</p>
                      </div>

                      {/* PROFILE CHANGE REQUEST QUICK APPROVAL ACTION BANNER */}
                      {profileReq && !isResolved && (
                        <div className="p-4 bg-amber-50/90 border-2 border-amber-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                              <Sparkles className="w-4 h-4 text-amber-600" />
                              <span>Official Profile Correction Detected: <u>{profileReq.fieldLabel}</u></span>
                            </div>
                            <p className="text-xs text-slate-700 font-serif">
                              Requested New Value: <strong className="text-navy bg-white px-2 py-0.5 rounded border border-amber-300 font-sans font-bold">"{profileReq.newVal || applicantName}"</strong>
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleInstantApproveProfile(tkt, profileReq)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs rounded-xl shadow transition-transform hover:scale-105 flex items-center space-x-1.5 flex-shrink-0 uppercase tracking-wider"
                          >
                            <ShieldCheck className="w-4 h-4 text-gold" />
                            <span>Approve & Update {profileReq.fieldLabel}</span>
                          </button>
                        </div>
                      )}

                      {/* Previous Responses list */}
                      {responsesList && responsesList.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase block">Response History</span>
                          {responsesList.map((resp, idx) => (
                            <div key={idx} className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                              <div className="font-bold text-emerald-900 flex items-center space-x-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>{resp.author || 'Administrative Desk'} ({resp.role || 'ADMIN'}) &bull; {resp.date || createdDate}</span>
                              </div>
                              <p className="font-serif text-emerald-800 pl-5">{resp.message}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 flex flex-wrap justify-end gap-2">
                        {!isResolved && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAcceptTicket(tkt)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition transform hover:scale-105"
                              title="Accept & Approve Request"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                              <span>Accept Request</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRejectTicket(tkt)}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition transform hover:scale-105"
                              title="Reject & Decline Request"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject Request</span>
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => { 
                            setReplyTicketId(tkt.id); 
                            setReplyText(profileReq ? `Your request for [${profileReq.fieldLabel}] update has been officially APPROVED by Administration. Your student record has been updated to: ${profileReq.newVal || applicantName}.` : '');
                            if (profileReq) {
                              setUpdateFieldName(profileReq.fieldKey);
                              setUpdateFieldValue(profileReq.newVal);
                              setApplyRecordUpdate(true);
                            }
                          }}
                          className="px-4 py-2 bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs rounded-xl shadow flex items-center space-x-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Dispatch Official Reply / Update Record</span>
                        </button>
                      </div>

                      {/* REPLY FORM */}
                      {replyTicketId === tkt.id && (
                        <form onSubmit={(e) => triggerReplyConfirm(e, tkt)} className="p-4 bg-white border-2 border-gold/60 rounded-xl space-y-3 mt-3">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h5 className="font-bold text-navy uppercase text-xs">
                              Official Administration Response to {tkt.applicantName} ({isStaff ? 'Faculty' : 'Student'})
                            </h5>
                          </div>

                          {/* OPTIONAL PROFILE UPDATE FIELDS */}
                          {!isStaff && (
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={applyRecordUpdate}
                                  onChange={(e) => setApplyRecordUpdate(e.target.checked)}
                                  className="w-4 h-4 rounded text-navy focus:ring-gold"
                                />
                                <span className="text-xs font-bold text-navy">
                                  Apply Official Profile Update to Student Account
                                </span>
                              </label>

                              {applyRecordUpdate && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Field</label>
                                    <select
                                      value={updateFieldName}
                                      onChange={(e) => setUpdateFieldName(e.target.value)}
                                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-navy"
                                    >
                                      <option value="name">Full Name (Official Record)</option>
                                      <option value="personalEmail">Personal Email</option>
                                      <option value="phone">Contact Phone</option>
                                      <option value="address">Address</option>
                                      <option value="gender">Gender</option>
                                      <option value="bloodGroup">Blood Group</option>
                                      <option value="dateOfBirth">Date of Birth</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">New Official Value *</label>
                                    <input
                                      type="text"
                                      value={updateFieldValue}
                                      onChange={(e) => setUpdateFieldValue(e.target.value)}
                                      placeholder="e.g. Akash S B"
                                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-navy focus:border-gold focus:outline-none"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <textarea
                            rows={3}
                            required
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write official resolution, approval, or instructions for the applicant..."
                            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-serif focus:border-gold focus:outline-none"
                          />
                          <div className="flex justify-end space-x-2">
                            <button type="button" onClick={() => setReplyTicketId(null)} className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg text-xs">Cancel</button>
                            <button type="submit" className="px-4 py-1.5 bg-navy text-white hover:bg-navy-light font-bold rounded-lg shadow text-xs flex items-center space-x-1">
                              <Send className="w-3.5 h-3.5 text-gold" />
                              <span>Send Resolution {applyRecordUpdate && updateFieldValue ? '& Update Record' : ''}</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

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
