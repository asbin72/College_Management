import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { Search, ShieldCheck } from 'lucide-react';

export const AdminLeave = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const { leaveRequests, updateLeaveStatus } = useData();

  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const [rejectingLeave, setRejectingLeave] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const handleApprove = (leaveId) => {
    updateLeaveStatus(leaveId, 'Approved', '', currentUser);
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (rejectingLeave && rejectionReasonInput.trim()) {
      updateLeaveStatus(rejectingLeave.id, 'Rejected', rejectionReasonInput.trim(), currentUser);
      setRejectingLeave(null);
      setRejectionReasonInput('');
    }
  };

  const getShortDept = (deptName, deptCode) => {
    if (deptCode && deptCode.length <= 5) return deptCode.toUpperCase();
    if (!deptName) return 'CE';
    const d = String(deptName).toLowerCase();
    if (d.includes('computer')) return 'CSE';
    if (d.includes('information')) return 'ISE';
    if (d.includes('electronics') && d.includes('communication')) return 'ECE';
    if (d.includes('electrical')) return 'EEE';
    if (d.includes('mechanical')) return 'ME';
    if (d.includes('civil')) return 'CE';
    if (d.includes('management') || d.includes('business') || d.includes('mba')) return 'MBA';
    return deptName;
  };

  const normalizedRequests = leaveRequests.map(req => ({
    ...req,
    applicantRole: req.applicantRole || req.role || (req.applicantId?.startsWith('EMP') ? 'TEACHER' : 'STUDENT')
  }));

  const filteredRequests = normalizedRequests.filter(req => {
    const applicantName = req.applicantName || req.name || '';
    const id = req.id || '';
    const role = req.applicantRole;
    const matchesSearch = applicantName.toLowerCase().includes(search.toLowerCase()) || id.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalReqs = normalizedRequests.length;
  const pendingReqs = normalizedRequests.filter(l => l.status === 'Pending').length;
  const approvedReqs = normalizedRequests.filter(l => l.status === 'Approved').length;
  const rejectedReqs = normalizedRequests.filter(l => l.status === 'Rejected').length;
  const studentReqs = normalizedRequests.filter(l => l.applicantRole === 'STUDENT').length;
  const teacherReqs = normalizedRequests.filter(l => l.applicantRole === 'TEACHER').length;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          {/* Header Bar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">MANAGEMENT CONTROL &bull; LEAVE MANAGEMENT MODULE</span>
              <h1 className="text-2xl font-serif font-bold text-navy mt-1">Central Leave Approvals & Governance</h1>
              <p className="text-slate-500 text-xs mt-1">Management is the sole authority empowered to approve or reject student & teacher leave applications.</p>
            </div>
            <div className="bg-navy text-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center border border-gold/30">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              ADMINISTRATIVE DECISION ENGINE
            </div>
          </div>

          {/* 6 Core Dashboard Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">TOTAL REQUESTS</span>
              <span className="text-2xl font-serif font-bold text-navy block mt-1">{totalReqs}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm text-center">
              <span className="text-[10px] font-bold text-amber-600 uppercase">PENDING APPROVAL</span>
              <span className="text-2xl font-serif font-bold text-amber-600 block mt-1">{pendingReqs}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-sm text-center">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">APPROVED</span>
              <span className="text-2xl font-serif font-bold text-emerald-600 block mt-1">{approvedReqs}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/50 shadow-sm text-center">
              <span className="text-[10px] font-bold text-red-500 uppercase">REJECTED</span>
              <span className="text-2xl font-serif font-bold text-red-600 block mt-1">{rejectedReqs}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">STUDENTS</span>
              <span className="text-2xl font-serif font-bold text-navy block mt-1">{studentReqs}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">TEACHERS</span>
              <span className="text-2xl font-serif font-bold text-navy block mt-1">{teacherReqs}</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search applicant name or Leave ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-gold"
                >
                  <option value="ALL">All Applicant Roles</option>
                  <option value="STUDENT">Students Only</option>
                  <option value="TEACHER">Teachers Only</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-gold"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Master Leave Applications Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-navy">Leave Governance Requests</h3>
              <span className="text-xs text-slate-500 font-semibold">Showing {filteredRequests.length} applications</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Req ID</th>
                    <th className="py-3.5 px-4">Applicant</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Leave Type</th>
                    <th className="py-3.5 px-4">Dates</th>
                    <th className="py-3.5 px-4">Days</th>
                    <th className="py-3.5 px-4">Reason</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Management Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/80">
                        <td className="py-4 px-4 font-bold text-navy">{req.id}</td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-800">{req.applicantName}</div>
                          <div className="text-[10px] text-slate-400">{req.applicantEmail}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            req.applicantRole === 'STUDENT' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {req.applicantRole}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="bg-slate-100 text-navy px-2.5 py-1 rounded-lg border border-slate-200 font-mono font-bold text-xs">
                            {getShortDept(req.department, req.departmentCode)}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-700">{req.leaveType}</td>
                        <td className="py-4 px-4 whitespace-nowrap">{req.fromDate} &rarr; {req.toDate}</td>
                        <td className="py-4 px-4 font-bold text-navy">{req.days}d</td>
                        <td className="py-4 px-4 max-w-xs truncate" title={req.reason}>{req.reason}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            req.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {req.status === 'Pending' ? (
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleApprove(req.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1.5 rounded transition-colors uppercase tracking-wider"
                              >
                                APPROVE
                              </button>
                              <button
                                onClick={() => setRejectingLeave(req)}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-3 py-1.5 rounded transition-colors uppercase tracking-wider"
                              >
                                REJECT
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Action Completed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400">No leave requests matching filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* Reject Modal with Mandatory Feedback Reason */}
      {rejectingLeave && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-red-600">Reject Leave Application</h3>
              <button onClick={() => setRejectingLeave(null)} className="text-slate-400 text-lg">&times;</button>
            </div>

            <p className="text-xs text-slate-600">
              Rejecting request <strong>{rejectingLeave.id}</strong> submitted by <strong>{rejectingLeave.applicantName}</strong> ({rejectingLeave.role}).
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Mandatory Rejection Reason *</label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="e.g. Clashes with mandatory lab examinations or insufficient attendance."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRejectingLeave(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold uppercase tracking-wider"
                >
                  CONFIRM REJECTION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
