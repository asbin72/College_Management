import React, { useState } from 'react';
import { HelpCircle, X, Send, MessageSquare, CheckCircle2, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const FloatingHelpdesk = () => {
  const { currentUser } = useAuth();
  const { helpdesk, submitHelpdeskTicket } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const [category, setCategory] = useState('Academic Query');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!currentUser) return null;

  const currentStudentId = currentUser.studentId || currentUser.username || currentUser.id;

  const myTickets = (helpdesk || []).filter(
    t => t.applicantId === currentStudentId
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    submitHelpdeskTicket({ category, subject, description }, currentUser);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSubject('');
      setDescription('');
    }, 3000);
  };

  const isStaffTarget = [
    'Academic Query',
    'Subject Doubts',
    'Attendance Discrepancy',
    'Internal Marks Query',
    'Assignment Help',
    'Academic Syllabus'
  ].includes(category);

  return (
    <>
      {/* Round Floating Action Icon at Bottom Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gold text-navy-dark hover:bg-gold-hover p-3.5 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center border-2 border-navy-dark/20 group"
        title="Student Support & Helpdesk"
        aria-label="Student Support & Helpdesk"
      >
        <HelpCircle className="w-7 h-7 text-navy-dark" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-sans font-bold text-navy-dark ml-0 group-hover:ml-2">
          Helpdesk
        </span>
      </button>

      {/* Helpdesk Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:pr-8 p-4 bg-black/40 backdrop-blur-sm animate-fadeIn font-sans">
          <div className="bg-white w-full sm:w-[440px] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-navy text-white p-4 flex justify-between items-center border-b border-navy-light">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-gold" />
                <span className="font-sans font-bold text-sm text-white">Student Quick Services & Helpdesk</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Speed Dial Shortcuts */}
            <div className="bg-slate-100 p-3 border-b border-slate-200 grid grid-cols-3 gap-2 text-center text-[10px] font-sans font-bold">
              <button
                onClick={() => {}}
                className="p-2 bg-white rounded-xl border border-slate-200 text-navy hover:border-gold shadow-sm flex flex-col items-center justify-center space-y-1"
              >
                <MessageSquare className="w-4 h-4 text-gold" />
                <span>Ask Doubt</span>
              </button>
              <Link
                to="/student/leave"
                onClick={() => setIsOpen(false)}
                className="p-2 bg-white rounded-xl border border-slate-200 text-navy hover:border-gold shadow-sm flex flex-col items-center justify-center space-y-1"
              >
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Apply Leave</span>
              </Link>
              <Link
                to="/student/fees"
                onClick={() => setIsOpen(false)}
                className="p-2 bg-white rounded-xl border border-slate-200 text-navy hover:border-gold shadow-sm flex flex-col items-center justify-center space-y-1"
              >
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Pay Fees</span>
              </Link>
            </div>

            {/* Content Area */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs font-sans">
              
              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-sans font-bold text-navy text-base">Support Ticket Created!</h4>
                  <p className="text-slate-500 text-xs max-w-xs mx-auto">
                    Query routed to <strong>{isStaffTarget ? 'FACULTY STAFF DESK' : 'ADMINISTRATIVE DESK'}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <h4 className="font-sans font-bold text-navy text-sm">
                      Submit New Support Ticket
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isStaffTarget ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isStaffTarget ? 'Routes to: STAFF DESK' : 'Routes to: ADMIN DESK'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Query Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none"
                    >
                      <optgroup label="Faculty & Academic Desk (Reaches Staff)">
                        <option value="Academic Query">Academic Query & Subject Doubts</option>
                        <option value="Subject Doubts">Subject Doubts & Syllabus</option>
                        <option value="Attendance Discrepancy">Attendance Correction Query</option>
                        <option value="Internal Marks Query">Internal Assessment & Marks Query</option>
                        <option value="Assignment Help">Assignment & Lab Guidance</option>
                      </optgroup>
                      <optgroup label="Administrative Desk (Reaches Admin)">
                        <option value="Fee & Billing">Fee Payment & Account Installments</option>
                        <option value="Certificate & Official Records">Bonafide Certificate & Official Records</option>
                        <option value="Technical & Portal Support">Portal Tech Issue & Login Error</option>
                        <option value="Hostel & Transport">Hostel, Mess & Bus Services</option>
                        <option value="General Inquiry">General University Inquiry</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Subject / Issue Title *</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief title of your query..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Detailed Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detail your question or request..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs py-3 rounded-xl uppercase tracking-wider flex items-center justify-center shadow"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    <span>Submit Support Ticket</span>
                  </button>
                </form>
              )}

              {/* My Existing Tickets */}
              {myTickets.length > 0 && (
                <div className="pt-3 border-t border-slate-200">
                  <h4 className="font-sans font-bold text-navy text-xs mb-2 flex items-center">
                    <MessageSquare className="w-3.5 h-3.5 text-gold mr-1" />
                    My Support Tickets ({myTickets.length})
                  </h4>

                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {myTickets.map((t) => (
                      <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-navy">{t.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.targetRole === 'STAFF' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {t.targetRole} DESK
                          </span>
                        </div>
                        <div className="font-bold text-slate-800">{t.subject}</div>
                        <p className="text-slate-500 font-serif text-[11px]">{t.description}</p>
                        
                        {/* Responses list */}
                        {t.responses && t.responses.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-200 space-y-1 bg-white p-2 rounded-lg border">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Response from {t.responses[0].author} ({t.responses[0].role}):</span>
                            <p className="text-slate-700 font-serif text-[11px]">{t.responses[0].message}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};
