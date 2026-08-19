import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { Plus, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const StudentLeave = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const { leaveRequests, submitLeaveRequest } = useData();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'Medical Leave',
    fromDate: '',
    toDate: '',
    days: 1,
    reason: '',
    supportingDocName: ''
  });

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Filter leaves for this student
  const studentId = currentUser.studentId || currentUser.id;
  const myLeaves = leaveRequests.filter(l => l.applicantId === studentId || l.applicantEmail === currentUser.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLeaveRequest(formData, currentUser);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowApplyModal(false);
      setFormData({ leaveType: 'Medical Leave', fromDate: '', toDate: '', days: 1, reason: '', supportingDocName: '' });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">STUDENT PORTAL &bull; LEAVE MANAGEMENT</span>
              <h1 className="text-2xl font-serif font-bold text-navy mt-1">Apply & Track Leave Requests</h1>
              <p className="text-slate-500 text-xs mt-1">Submit official leave applications directly to College Management.</p>
            </div>

            <button
              onClick={() => setShowApplyModal(true)}
              className="inline-flex items-center bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs px-5 py-3 rounded-xl shadow transition-colors uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 mr-2" />
              APPLY FOR LEAVE
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">TOTAL SUBMITTED</span>
              <span className="text-3xl font-serif font-bold text-navy block mt-1">{myLeaves.length}</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-xs font-bold text-amber-500 uppercase">PENDING APPROVAL</span>
              <span className="text-3xl font-serif font-bold text-amber-600 block mt-1">
                {myLeaves.filter(l => l.status === 'Pending').length}
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-xs font-bold text-emerald-600 uppercase">APPROVED</span>
              <span className="text-3xl font-serif font-bold text-emerald-600 block mt-1">
                {myLeaves.filter(l => l.status === 'Approved').length}
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-xs font-bold text-red-500 uppercase">REJECTED</span>
              <span className="text-3xl font-serif font-bold text-red-600 block mt-1">
                {myLeaves.filter(l => l.status === 'Rejected').length}
              </span>
            </div>
          </div>

          {/* Leave History Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-navy">My Leave Applications History</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-6">Leave ID</th>
                    <th className="py-3.5 px-6">Type</th>
                    <th className="py-3.5 px-6">Duration</th>
                    <th className="py-3.5 px-6">Days</th>
                    <th className="py-3.5 px-6">Reason</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Feedback / Rejection Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {myLeaves.length > 0 ? (
                    myLeaves.map((leave) => (
                      <tr key={leave.id} className="hover:bg-slate-50/80">
                        <td className="py-4 px-6 font-bold text-navy">{leave.id}</td>
                        <td className="py-4 px-6 font-semibold text-slate-800">{leave.leaveType}</td>
                        <td className="py-4 px-6">{leave.fromDate} &rarr; {leave.toDate}</td>
                        <td className="py-4 px-6 font-bold text-navy">{leave.days} Days</td>
                        <td className="py-4 px-6 max-w-xs truncate">{leave.reason}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {leave.status === 'Approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {leave.status === 'Rejected' && <XCircle className="w-3 h-3 mr-1" />}
                            {leave.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                            {leave.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-500">
                          {leave.rejectionReason ? (
                            <span className="text-red-600 font-semibold">{leave.rejectionReason}</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">No leave applications submitted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-serif font-bold text-navy">Submit Leave Request</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-navy text-lg">&times;</button>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center text-emerald-600 space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <p className="font-bold text-lg">Leave Request Submitted!</p>
                <p className="text-xs text-slate-500">Management will review and dispatch status notification.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Leave Type *</label>
                  <select
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Medical Leave">Medical Leave</option>
                    <option value="Personal Leave">Personal Leave</option>
                    <option value="Duty / Academic Event">Duty / Academic Event</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">From Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.fromDate}
                      onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">To Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.toDate}
                      onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Number of Days *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Detailed Reason *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Provide official reason for leave request..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-between">
                  <span className="text-[11px]">Supporting Document (Optional PDF)</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, supportingDocName: 'Medical_Certificate_Doc.pdf' })}
                    className="bg-navy text-gold text-[10px] font-bold px-3 py-1 rounded"
                  >
                    {formData.supportingDocName ? '✓ Attached' : 'Attach PDF'}
                  </button>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gold hover:bg-gold-hover text-navy-dark rounded-lg font-bold uppercase tracking-wider"
                  >
                    SUBMIT TO MANAGEMENT
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
