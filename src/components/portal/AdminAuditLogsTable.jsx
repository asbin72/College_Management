import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { ShieldCheck, Search, Filter, Clock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export const AdminAuditLogsTable = () => {
  const { auditLogs } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Format date/timestamp to display exact time e.g., "17:15"
  const formatTimeStr = (isoString) => {
    if (!isoString) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      const dateObj = new Date(isoString);
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) {
      return '17:15';
    }
  };

  const categories = ['All', 'User Status', 'User Mgmt', 'Exam Publishing', 'Course / Subject', 'Security'];

  const filteredLogs = useMemo(() => {
    return (auditLogs || []).filter(log => {
      const matchesSearch = 
        (log.user || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.action || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.details || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedCategory === 'All') return matchesSearch;
      if (selectedCategory === 'User Status') return matchesSearch && (log.action.includes('STATUS') || log.details.includes('status'));
      if (selectedCategory === 'User Mgmt') return matchesSearch && (log.action.includes('USER') || log.action.includes('TEACHER') || log.action.includes('STUDENT'));
      if (selectedCategory === 'Exam Publishing') return matchesSearch && (log.action.includes('EXAM') || log.action.includes('MARKS'));
      if (selectedCategory === 'Course / Subject') return matchesSearch && (log.action.includes('COURSE') || log.action.includes('SUBJECT') || log.action.includes('DEPARTMENT'));
      return matchesSearch;
    });
  }, [auditLogs, searchQuery, selectedCategory]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, pageSize]);

  const totalEntries = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalEntries);
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-4 p-5 sm:p-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <span className="text-xs font-bold text-navy uppercase tracking-widest bg-gold/20 px-2.5 py-0.5 rounded border border-gold/30">
              INSTITUTIONAL GOVERNANCE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy mt-1 tracking-tight">
            System Activity Audit Logs
          </h2>
          <p className="text-xs text-slate-500 font-serif mt-0.5">
            Immutable institutional audit trial tracking administrator actions, faculty status updates, and security events.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-num font-bold text-navy text-xs">
          <Clock className="w-4 h-4 text-gold" />
          <span>Total Log Entries: <strong>{auditLogs?.length || 0}</strong></span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Category Pills */}
        <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-navy text-gold shadow'
                  : 'text-slate-600 hover:text-navy hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input & Page Size Selector */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-300 px-2.5 py-1.5 rounded-xl text-xs text-slate-600 font-bold">
            <span className="text-[11px] text-slate-400">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-transparent font-bold text-navy focus:outline-none cursor-pointer text-xs"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-navy text-amber-50 uppercase font-bold text-[10px]">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">Actor / User</th>
              <th className="p-3">Action Type</th>
              <th className="p-3">Institutional Activity Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Time */}
                  <td className="p-3 font-num font-bold text-slate-600 flex items-center whitespace-nowrap">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-gold" />
                    {formatTimeStr(log.timestamp)}
                  </td>

                  {/* Actor */}
                  <td className="p-3">
                    <span className="font-bold text-navy">{log.user}</span>
                  </td>

                  {/* Action Pill */}
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      log.action.includes('TOGGLED') || log.action.includes('STATUS') ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      log.action.includes('CREATED') ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      log.action.includes('PUBLISHED') ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {log.action}
                    </span>
                  </td>

                  {/* Detailed Description */}
                  <td className="p-3 font-serif text-slate-800 leading-normal">
                    {log.details}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-400 font-serif text-xs">
                  No matching audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Controls */}
      {totalEntries > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
          <div className="font-sans">
            Showing <span className="font-bold text-navy font-num">{startIndex + 1}</span> to{' '}
            <span className="font-bold text-navy font-num">{endIndex}</span> of{' '}
            <span className="font-bold text-navy font-num">{totalEntries}</span> log entries
            {filteredLogs.length !== auditLogs?.length && (
              <span className="text-slate-400 text-[11px] ml-1.5">(filtered from {auditLogs?.length})</span>
            )}
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center space-x-1.5">
            {/* First Page */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              title="First Page"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors text-slate-700"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous Page */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              title="Previous Page"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center space-x-1 font-bold text-slate-700 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            {/* Numeric Page Buttons */}
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold font-num transition-all ${
                    currentPage === pageNum
                      ? 'bg-navy text-gold shadow-sm font-extrabold border border-navy'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Next Page */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              title="Next Page"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center space-x-1 font-bold text-slate-700 text-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              title="Last Page"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors text-slate-700"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
