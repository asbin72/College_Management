import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { Plus, Edit, Power, Search, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export const AdminSubjects = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const {
    subjects, subjectOfferings, departments, courses, users,
    addSubject, updateSubject
  } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedSem, setSelectedSem] = useState('ALL');

  // Pagination State (Limit 15)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const teachers = users.filter(u => u.role === 'TEACHER' || u.role === 'STAFF');

  // Master Subject List: combine subjects and offerings cleanly
  const rawSubjectList = (subjects && subjects.length > 0) 
    ? subjects 
    : (subjectOfferings && subjectOfferings.length > 0 ? subjectOfferings : []);

  const normStr = (str) => (str || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');

  const isSubjectDeptMatch = (sub, selDept) => {
    if (!selDept || selDept === 'ALL') return true;
    
    const subDeptCode = (sub.departmentCode || '').toUpperCase().trim();
    const selDeptUpper = selDept.toUpperCase().trim();
    const deptObj = departments.find(d => 
      d.name === selDept || 
      d.code === selDept || 
      normStr(d.name) === normStr(selDept) ||
      d.code?.toUpperCase() === selDeptUpper
    );
    const dCode = (deptObj?.code || selDeptUpper).toUpperCase();

    if (subDeptCode && dCode && subDeptCode === dCode) return true;
    if (sub.department && (sub.department === selDept || normStr(sub.department) === normStr(selDept))) return true;

    const sDeptNorm = normStr(sub.department);
    const selNorm = normStr(selDept);

    if (dCode === 'CE' || selNorm.includes('civil')) return subDeptCode === 'CE' || sDeptNorm.includes('civil');
    if (dCode === 'CSE' || (selNorm.includes('computer') && selNorm.includes('science'))) return subDeptCode === 'CSE' || subDeptCode === 'CS' || (sDeptNorm.includes('computer') && sDeptNorm.includes('science'));
    if (dCode === 'ISE' || (selNorm.includes('information') && selNorm.includes('science'))) return subDeptCode === 'ISE' || subDeptCode === 'IS' || (sDeptNorm.includes('information') && sDeptNorm.includes('science'));
    if (dCode === 'ECE' || (selNorm.includes('electronics') && selNorm.includes('communication'))) return subDeptCode === 'ECE' || subDeptCode === 'EC' || (sDeptNorm.includes('electronics') && sDeptNorm.includes('communication'));
    if (dCode === 'EEE' || (selNorm.includes('electrical') && selNorm.includes('electronics'))) return subDeptCode === 'EEE' || subDeptCode === 'EE' || (sDeptNorm.includes('electrical') && !sDeptNorm.includes('communication'));
    if (dCode === 'ME' || selNorm.includes('mechanical')) return subDeptCode === 'ME' || sDeptNorm.includes('mechanical');
    if (dCode === 'MBA' || selNorm.includes('management') || selNorm.includes('business')) return subDeptCode === 'MBA' || sDeptNorm.includes('management') || sDeptNorm.includes('business');

    return false;
  };

  const filteredSubjects = rawSubjectList.filter(sub => {
    const term = searchTerm.trim().toLowerCase();
    const matchSearch = !term || 
      sub.name?.toLowerCase().includes(term) ||
      sub.code?.toLowerCase().includes(term) ||
      sub.assignedTeacherName?.toLowerCase().includes(term);

    const matchDept = isSubjectDeptMatch(sub, selectedDept);

    // Handle Semester matching (e.g., "1st Semester" vs "Semester 1")
    const semNum = (selectedSem || '').replace(/\D/g, '');
    const subSemNum = (sub.semester || '').replace(/\D/g, '');

    const matchSem = selectedSem === 'ALL' || 
      sub.semester === selectedSem ||
      (semNum && subSemNum && semNum === subSemNum);

    return matchSearch && matchDept && matchSem;
  });

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDept, selectedSem, itemsPerPage]);

  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredSubjects.length);
  const paginatedSubjects = filteredSubjects.slice(startIndex, endIndex);

  const openAddModal = () => {
    setFormData({
      name: '',
      code: '',
      department: departments[0]?.name || 'Computer Science & Engineering',
      course: courses[0]?.name || 'B.Tech Computer Science & Engineering',
      semester: '1st Semester',
      credits: 4,
      subjectType: 'Core Theory',
      assignedTeacherId: teachers[0]?.employeeId || '',
      assignedTeacherName: teachers[0]?.name || 'Unassigned',
      status: 'Active'
    });
    setShowAddModal(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    addSubject(formData, currentUser);
    setShowAddModal(false);
    alert(`Subject ${formData.name} (${formData.code}) created successfully!`);
  };

  const openEditModal = (sub) => {
    setEditingSubject(sub);
    setFormData({ ...sub });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateSubject(editingSubject.id, formData, currentUser);
    setEditingSubject(null);
    alert(`Updated subject ${formData.name}!`);
  };

  const toggleSubjectStatus = (sub) => {
    const newStatus = sub.status === 'Active' ? 'Inactive' : 'Active';
    updateSubject(sub.id, { status: newStatus }, currentUser);
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
              <span className="text-xs font-bold text-navy uppercase tracking-wider bg-gold/20 px-3 py-1 rounded border border-gold/30">
                MANAGEMENT CONTROL &bull; CURRICULUM SUBJECTS
              </span>
              <h1 className="text-2xl font-bold text-navy mt-2 tracking-tight">Institutional Subject Master</h1>
              <p className="text-slate-500 text-xs mt-1 font-serif">
                Manage 288 academic subjects across 8 semesters, theory/lab credits, syllabus modules, and assigned faculty.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-slate-100 text-navy px-3 py-1.5 rounded-xl border border-slate-200">
                {filteredSubjects.length} of {rawSubjectList.length} Subjects
              </span>
              <button
                onClick={openAddModal}
                className="bg-navy hover:bg-navy-light text-gold font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Subject
              </button>
            </div>
          </div>

          {/* Search & Department / Semester Filters */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search subject code, title, professor..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:border-gold focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none"
              >
                <option value="ALL">All Departments (6)</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
                ))}
              </select>

              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none"
              >
                <option value="ALL">All Semesters (1-8)</option>
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="4th Semester">4th Semester</option>
                <option value="5th Semester">5th Semester</option>
                <option value="6th Semester">6th Semester</option>
                <option value="7th Semester">7th Semester</option>
                <option value="8th Semester">8th Semester</option>
              </select>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy text-gold uppercase font-bold tracking-wider text-[10px] sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-3.5">Code</th>
                    <th className="p-3.5">Subject Title</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Semester</th>
                    <th className="p-3.5">Credits</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Faculty In-Charge</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {paginatedSubjects.length > 0 ? (
                    paginatedSubjects.map((sub) => (
                      <tr key={sub.id || sub.code} className="hover:bg-slate-50 transition">
                        <td className="p-3.5 font-bold text-navy whitespace-nowrap font-num">{sub.code}</td>
                        <td className="p-3.5 font-bold text-slate-800 whitespace-nowrap">{sub.name}</td>
                        <td className="p-3.5 text-slate-700 whitespace-nowrap">{sub.department}</td>
                        <td className="p-3.5 font-semibold text-navy whitespace-nowrap">{sub.semester}</td>
                        <td className="p-3.5 text-slate-600 font-bold whitespace-nowrap">{sub.credits} Credits</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            sub.subjectType?.includes('Lab') ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {sub.subjectType || 'Core Theory'}
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-800 whitespace-nowrap">{sub.assignedTeacherName || 'Faculty In-Charge'}</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            sub.status === 'Active' || !sub.status ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {sub.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => openEditModal(sub)} title="Edit Subject" className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => toggleSubjectStatus(sub)} title={sub.status === 'Active' ? 'Deactivate' : 'Activate'} className={`p-1.5 rounded-lg ${sub.status === 'Active' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              <Power className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-500 font-medium">
                        No matching subjects found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION TOOLBAR (Limit: 15 per page) */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
              <div className="flex items-center space-x-3 text-slate-600 font-medium">
                <span>
                  Showing <strong className="font-num text-navy font-bold">{filteredSubjects.length > 0 ? startIndex + 1 : 0}</strong> - <strong className="font-num text-navy font-bold">{endIndex}</strong> of <strong className="font-num text-navy font-bold">{filteredSubjects.length}</strong> subjects
                </span>
                <span className="text-slate-300">|</span>
                <div className="flex items-center space-x-1">
                  <span className="text-slate-500">Per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-navy focus:outline-none"
                  >
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-navy"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-navy flex items-center font-bold px-2.5"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                </button>

                <span className="px-3 py-1 font-bold text-navy">
                  Page <span className="font-num text-navy font-extrabold">{currentPage}</span> of <span className="font-num">{totalPages}</span>
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-navy flex items-center font-bold px-2.5"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-navy"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* CREATE / EDIT MODAL */}
      {(showAddModal || editingSubject) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">{editingSubject ? `Edit Subject: ${editingSubject.code}` : 'Add New Subject'}</h3>
              <button onClick={() => { setShowAddModal(false); setEditingSubject(null); }} className="text-slate-400 hover:text-navy"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={editingSubject ? handleSaveEdit : handleSaveAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject Name</label>
                <input required type="text" value={formData.name || ''} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Code</label>
                  <input required type="text" value={formData.code || ''} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, code: e.target.value })} />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester</label>
                  <select required value={formData.semester || '1st Semester'} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, semester: e.target.value })}>
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select required value={formData.department || ''} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, department: e.target.value })}>
                    {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course</label>
                  <select required value={formData.course || ''} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, course: e.target.value })}>
                    {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Credits</label>
                  <input required type="number" value={formData.credits || 4} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, credits: e.target.value })} />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Teacher</label>
                  <select value={formData.assignedTeacherId || ''} className="w-full p-2.5 border rounded-lg" onChange={e => {
                    const tch = teachers.find(t => t.employeeId === e.target.value || t.id === e.target.value);
                    setFormData({ ...formData, assignedTeacherId: e.target.value, assignedTeacherName: tch ? tch.name : 'Unassigned' });
                  }}>
                    <option value="">Unassigned</option>
                    {teachers.map(t => <option key={t.id} value={t.employeeId || t.id}>{t.name} ({t.department})</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => { setShowAddModal(false); setEditingSubject(null); }} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-navy text-gold font-bold rounded-lg hover:bg-navy-light">Save Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
