import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { Plus, Edit, Power, Trash2, Search, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { INITIAL_COURSES } from '../../data/initialMockData';

export const AdminCourses = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const {
    courses, subjectOfferings, departments, users,
    addCourse, updateCourse, deleteCourse
  } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({});

  const handleDeleteCourse = (crs) => {
    if (window.confirm(`Are you sure you want to permanently delete course "${crs.name}" (${crs.code}) from the database?`)) {
      deleteCourse(crs.id || crs.code, currentUser);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedSem, setSelectedSem] = useState('ALL');

  // Pagination State (Limit 15)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const teachers = users.filter(u => u.role === 'TEACHER' || u.role === 'STAFF');

  // Master Degree Courses List
  const rawCourseList = Array.from(
    new Map(
      [...INITIAL_COURSES, ...(courses || [])].map(c => [c.id || c.code || c.name, c])
    ).values()
  );

  const normStr = (str) => (str || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');

  const isCourseDeptMatch = (crs, selDept) => {
    if (!selDept || selDept === 'ALL') return true;
    
    const crsDeptCode = (crs.departmentCode || '').toUpperCase().trim();
    const selDeptUpper = selDept.toUpperCase().trim();
    const deptObj = departments.find(d => 
      d.name === selDept || 
      d.code === selDept || 
      normStr(d.name) === normStr(selDept) ||
      d.code?.toUpperCase() === selDeptUpper
    );
    const dCode = (deptObj?.code || selDeptUpper).toUpperCase();

    if (crsDeptCode && dCode && crsDeptCode === dCode) return true;
    if (crs.department && (crs.department === selDept || normStr(crs.department) === normStr(selDept))) return true;

    const cDeptNorm = normStr(crs.department);
    const selNorm = normStr(selDept);

    if (dCode === 'CE' || selNorm.includes('civil')) return crsDeptCode === 'CE' || cDeptNorm.includes('civil');
    if (dCode === 'CSE' || (selNorm.includes('computer') && selNorm.includes('science'))) return crsDeptCode === 'CSE' || crsDeptCode === 'CS' || (cDeptNorm.includes('computer') && cDeptNorm.includes('science'));
    if (dCode === 'ISE' || (selNorm.includes('information') && selNorm.includes('science'))) return crsDeptCode === 'ISE' || crsDeptCode === 'IS' || (cDeptNorm.includes('information') && cDeptNorm.includes('science'));
    if (dCode === 'ECE' || (selNorm.includes('electronics') && selNorm.includes('communication'))) return crsDeptCode === 'ECE' || crsDeptCode === 'EC' || (cDeptNorm.includes('electronics') && cDeptNorm.includes('communication'));
    if (dCode === 'EEE' || (selNorm.includes('electrical') && selNorm.includes('electronics'))) return crsDeptCode === 'EEE' || crsDeptCode === 'EE' || (cDeptNorm.includes('electrical') && !cDeptNorm.includes('communication'));
    if (dCode === 'ME' || selNorm.includes('mechanical')) return crsDeptCode === 'ME' || cDeptNorm.includes('mechanical');
    if (dCode === 'MBA' || selNorm.includes('management') || selNorm.includes('business')) return crsDeptCode === 'MBA' || cDeptNorm.includes('management') || cDeptNorm.includes('business');

    return false;
  };

  const filteredCourses = rawCourseList.filter(crs => {
    const term = searchTerm.trim().toLowerCase();
    const matchSearch = !term || 
      crs.name?.toLowerCase().includes(term) ||
      crs.code?.toLowerCase().includes(term) ||
      crs.assignedTeacherName?.toLowerCase().includes(term);

    const matchDept = isCourseDeptMatch(crs, selectedDept);

    // Handle Semester matching (e.g., "1st Semester" vs "Semester 1")
    const semNum = (selectedSem || '').replace(/\D/g, '');
    const crsSemNum = (crs.semester || '').replace(/\D/g, '');

    const matchSem = selectedSem === 'ALL' || 
      crs.semester === selectedSem ||
      (semNum && crsSemNum && semNum === crsSemNum);

    return matchSearch && matchDept && matchSem;
  });

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDept, selectedSem, itemsPerPage]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredCourses.length);
  const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

  const openAddModal = () => {
    setFormData({
      name: '',
      code: '',
      department: departments[0]?.name || 'Computer Science & Engineering',
      departmentCode: departments[0]?.code || 'CSE',
      semester: 'Semester 1',
      year: '1st Year',
      credits: 4,
      courseType: 'Core Theory',
      assignedTeacherName: teachers[0]?.name || 'Faculty In-Charge',
      status: 'Active'
    });
    setShowAddModal(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    addCourse(formData, currentUser);
    setShowAddModal(false);
    alert(`Course ${formData.name} (${formData.code}) created successfully!`);
  };

  const openEditModal = (crs) => {
    setEditingCourse(crs);
    setFormData({ ...crs });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateCourse(editingCourse.id, formData, currentUser);
    setEditingCourse(null);
    alert(`Updated course ${formData.name}!`);
  };

  const toggleCourseStatus = (crs) => {
    const newStatus = crs.status === 'Active' ? 'Inactive' : 'Active';
    updateCourse(crs.id, { status: newStatus }, currentUser);
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
                MANAGEMENT CONTROL &bull; INSTITUTIONAL COURSES
              </span>
              <h1 className="text-2xl font-bold text-navy mt-2 tracking-tight">Institutional Course Master</h1>
              <p className="text-slate-500 text-xs mt-1 font-serif">
                Manage all academic courses across semesters, credits, course types, and assigned faculty.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-slate-100 text-navy px-3 py-1.5 rounded-xl border border-slate-200">
                {filteredCourses.length} of {rawCourseList.length} Courses
              </span>
              <button
                onClick={openAddModal}
                className="bg-navy hover:bg-navy-light text-gold font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Course
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
                placeholder="Search course code, title, faculty..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:border-gold focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none"
              >
                <option value="ALL">All Departments (7)</option>
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
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>
            </div>
          </div>

          {/* Courses Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy text-gold uppercase font-bold tracking-wider text-[10px] sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-3.5">Code</th>
                    <th className="p-3.5">Subject / Course Title</th>
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
                  {paginatedCourses.length > 0 ? (
                    paginatedCourses.map((crs) => (
                      <tr key={crs.id || crs.code} className="hover:bg-slate-50 transition">
                        <td className="p-3.5 font-bold text-navy whitespace-nowrap font-num">{crs.code}</td>
                        <td className="p-3.5 font-bold text-slate-800 whitespace-nowrap">{crs.name}</td>
                        <td className="p-3.5 text-slate-700 whitespace-nowrap">{crs.department}</td>
                        <td className="p-3.5 font-semibold text-navy whitespace-nowrap">{crs.semester}</td>
                        <td className="p-3.5 text-slate-600 font-bold whitespace-nowrap">{crs.credits || 4} Credits</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            (crs.courseType || crs.subjectType)?.includes('Lab') ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {crs.courseType || crs.subjectType || 'Core Theory'}
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-800 whitespace-nowrap">{crs.assignedTeacherName && crs.assignedTeacherName !== 'Faculty In-Charge' ? crs.assignedTeacherName : (teachers.find(t => t.department === crs.department)?.name || 'Unassigned Faculty')}</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            crs.status === 'Active' || !crs.status ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {crs.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditModal(crs)}
                              className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition"
                              title="Edit Course"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleCourseStatus(crs)}
                              className={`p-1.5 rounded-lg transition ${
                                crs.status === 'Active' || !crs.status
                                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                              title={crs.status === 'Active' || !crs.status ? 'Deactivate' : 'Activate'}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(crs)}
                              className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition"
                              title="Delete Course from Database"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-slate-400 font-serif">
                        No courses found matching your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredCourses.length > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-slate-500">
                  Showing <strong className="text-navy">{startIndex + 1}</strong> to <strong className="text-navy">{endIndex}</strong> of <strong className="text-navy">{filteredCourses.length}</strong> courses
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 mr-1">Per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="p-1 bg-white border border-slate-300 rounded text-xs font-bold"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>

                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
                    >
                      <ChevronsLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 font-bold text-navy">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
                    >
                      <ChevronsRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ADD / EDIT MODAL */}
      {(showAddModal || editingCourse) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">
                {editingCourse ? `Edit Course: ${editingCourse.name}` : 'Add New Course'}
              </h3>
              <button onClick={() => { setShowAddModal(false); setEditingCourse(null); }} className="text-slate-400 hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={editingCourse ? handleSaveEdit : handleSaveAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Title</label>
                <input
                  required
                  type="text"
                  value={formData.name || ''}
                  placeholder="e.g. Data Structures & Algorithms"
                  className="w-full p-2.5 border rounded-lg"
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course Code</label>
                  <input
                    required
                    type="text"
                    value={formData.code || ''}
                    placeholder="e.g. CSE-301"
                    className="w-full p-2.5 border rounded-lg font-num"
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department || ''}
                    className="w-full p-2.5 border rounded-lg"
                    onChange={e => {
                      const dObj = departments.find(d => d.name === e.target.value);
                      setFormData({ ...formData, department: e.target.value, departmentCode: dObj?.code || 'CSE' });
                    }}
                  >
                    {departments.map(d => <option key={d.id} value={d.name}>{d.name} ({d.code})</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={formData.semester || 'Semester 1'}
                    className="w-full p-2.5 border rounded-lg"
                    onChange={e => setFormData({ ...formData, semester: e.target.value })}
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Academic Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.credits || 4}
                    className="w-full p-2.5 border rounded-lg font-num"
                    onChange={e => setFormData({ ...formData, credits: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course Type</label>
                  <select
                    value={formData.courseType || formData.subjectType || 'Core Theory'}
                    className="w-full p-2.5 border rounded-lg"
                    onChange={e => setFormData({ ...formData, courseType: e.target.value, subjectType: e.target.value })}
                  >
                    <option value="Core Theory">Core Theory</option>
                    <option value="Practical Lab">Practical Lab</option>
                    <option value="Elective">Elective</option>
                    <option value="Project Work">Project Work</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Faculty In-Charge</label>
                  <select
                    value={formData.assignedTeacherName || ''}
                    className="w-full p-2.5 border rounded-lg"
                    onChange={e => setFormData({ ...formData, assignedTeacherName: e.target.value })}
                  >
                    {teachers.map(t => <option key={t.id} value={t.name}>{t.name} ({t.departmentCode || t.department})</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingCourse(null); }}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-navy text-gold font-bold rounded-lg hover:bg-navy-light uppercase tracking-wider"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
