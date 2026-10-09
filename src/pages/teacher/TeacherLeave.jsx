import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { Plus, X } from 'lucide-react';

export const TeacherLeave = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const { leaveRequests, submitLeaveRequest, updateLeaveStatus } = useData();

  const [activeTab, setActiveTab] = useState('myLeave'); // 'myLeave' | 'studentLeave'
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    fromDate: '',
    toDate: '',
    days: 1,
    reason: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  if (!currentUser) return null;

  const employeeId = currentUser.employeeId || currentUser.username || currentUser.id;

  // Staff's own leaves
  const myLeaves = leaveRequests.filter(l =>
    l.applicantId === employeeId ||
    l.applicantEmail === currentUser.email ||
    (l.applicantName === currentUser.name && (l.applicantRole === 'TEACHER' || l.applicantRole === 'STAFF'))
  );

  // Student leaves for review
  const studentLeaves = leaveRequests.filter(l => l.applicantRole === 'STUDENT');

  const handleApplyStaffLeave = (e) => {
    e.preventDefault();
    submitLeaveRequest(formData, currentUser);
    setShowApplyModal(false);
    setSuccessMsg('Faculty leave request submitted to Management Control for HOD/Admin review.');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleReviewStudentLeave = (leaveId, status) => {
    updateLeaveStatus(leaveId, status, '', currentUser);
    setSuccessMsg(`Student leave request ${leaveId} set to ${status}.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {successMsg && (
            <div className="p-4 bg-emerald-500 text-white rounded-xl shadow font-bold text-xs flex items-center justify-between">
              <span>{successMsg}</span>
              <button onClick={() => setSuccessMsg('')}>&times;</button>
            </div>
          )}

          {/* Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">STAFF PORTAL &bull; LEAVE MANAGEMENT</span>
              <h1 className="text-2xl font-serif font-bold text-navy mt-1">Faculty Leave & Student Applications</h1>
              <p className="text-slate-500 text-xs mt-1">Apply for faculty leave, track approval status, or review student leave applications.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowApplyModal(true)}
                className="bg-navy hover:bg-navy-light text-gold font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Apply Staff Leave
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('myLeave')}
              className={`pb-2 border-b-2 transition ${activeTab === 'myLeave' ? 'border-navy text-navy font-serif text-sm' : 'border-transparent text-slate-400 hover:text-navy'}`}
            >
              My Faculty Leave Requests ({myLeaves.length})
            </button>
            <button
              onClick={() => setActiveTab('studentLeave')}
              className={`pb-2 border-b-2 transition ${activeTab === 'studentLeave' ? 'border-navy text-navy font-serif text-sm' : 'border-transparent text-slate-400 hover:text-navy'}`}
            >
              Student Leave Applications ({studentLeaves.length})
            </button>
          </div>

          {/* TAB A: MY FACULTY LEAVES */}
          {activeTab === 'myLeave' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h3 className="font-serif font-bold text-navy text-base">My Leave History & Status</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy text-amber-50 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3.5">Req ID</th>
                      <th className="p-3.5">Leave Type</th>
                      <th className="p-3.5">Dates</th>
                      <th className="p-3.5">Days</th>
                      <th className="p-3.5">Reason</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {myLeaves.length > 0 ? (
                      myLeaves.map(l => (
                        <tr key={l.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-navy">{l.id}</td>
                          <td className="p-3.5 font-bold text-slate-800">{l.leaveType}</td>
                          <td className="p-3.5 font-mono text-slate-600">{l.fromDate} &rarr; {l.toDate}</td>
                          <td className="p-3.5 font-bold text-navy">{l.days} Days</td>
                          <td className="p-3.5 text-slate-600">{l.reason}</td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              l.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                              l.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-400">No staff leave requests submitted yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB B: STUDENT LEAVE APPLICATIONS */}
          {activeTab === 'studentLeave' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h3 className="font-serif font-bold text-navy text-base">Student Leave Applications for Review</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy text-amber-50 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3.5">Student Name</th>
                      <th className="p-3.5">Leave Type</th>
                      <th className="p-3.5">Dates</th>
                      <th className="p-3.5">Days</th>
                      <th className="p-3.5">Reason</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">Faculty Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {studentLeaves.map(req => (
                      <tr key={req.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-navy">{req.applicantName}</td>
                        <td className="p-3.5 text-slate-800">{req.leaveType}</td>
                        <td className="p-3.5 font-mono text-slate-600">{req.fromDate} &rarr; {req.toDate}</td>
                        <td className="p-3.5 font-bold text-navy">{req.days}d</td>
                        <td className="p-3.5 text-slate-600 max-w-xs truncate">{req.reason}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            req.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          {req.status === 'Pending' ? (
                            <div className="flex justify-center gap-1.5">
                              <button onClick={() => handleReviewStudentLeave(req.id, 'Approved')} className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold text-[10px]">Approve</button>
                              <button onClick={() => handleReviewStudentLeave(req.id, 'Rejected')} className="px-2.5 py-1 bg-rose-600 text-white rounded font-bold text-[10px]">Reject</button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* APPLY STAFF LEAVE MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">Apply for Faculty Leave</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-navy"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleApplyStaffLeave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Leave Type</label>
                <select required value={formData.leaveType} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, leaveType: e.target.value })}>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Medical Leave">Medical Leave</option>
                  <option value="Duty Leave">Duty Leave (Conference / Workshop)</option>
                  <option value="Sabbatical Leave">Sabbatical Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">From Date</label>
                  <input required type="date" value={formData.fromDate} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, fromDate: e.target.value })} />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">To Date</label>
                  <input required type="date" value={formData.toDate} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, toDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Days</label>
                <input required type="number" min="1" value={formData.days} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, days: e.target.value })} />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Leave</label>
                <textarea required value={formData.reason} placeholder="State reason..." className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, reason: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowApplyModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-navy text-gold font-bold rounded-lg hover:bg-navy-light">Submit Leave Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
