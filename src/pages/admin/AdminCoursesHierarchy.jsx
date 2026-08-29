import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import {
  Building,
  BookOpen,
  Layers,
  Users,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  UserCheck,
  GraduationCap,
  UserPlus,
  UserMinus,
  Sparkles
} from 'lucide-react';

export const AdminCoursesHierarchy = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const {
    departments = [],
    subjects = [],
    users = [],
    staffSubjectAssignments = [],
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addSubject,
    updateSubject,
    deleteSubject,
    assignStaffToSubject,
    unassignStaffFromSubject,
    getStudentsCountForCourse
  } = useData();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDepts, setExpandedDepts] = useState({});

  // Modal States
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptForm, setDeptForm] = useState({ name: '', code: '', hod: '', description: '' });

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    department: '',
    semester: 'Semester 1',
    credits: 4,
    subjectType: 'Core Theory'
  });

  const [showAssignStaffModal, setShowAssignStaffModal] = useState(false);
  const [selectedSubjectForStaff, setSelectedSubjectForStaff] = useState(null);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');

  // List of available staff/teachers
  const allStaff = useMemo(() => {
    return users.filter(u => u && (u.role === 'TEACHER' || u.role === 'STAFF'));
  }, [users]);

  // Toggle department expansion
  const toggleDept = (deptId) => {
    setExpandedDepts(prev => ({ ...prev, [deptId]: !prev[deptId] }));
  };

  // Expand all / Collapse all
  const expandAll = () => {
    const dMap = {};
    departments.forEach(d => { dMap[d.id || d.code] = true; });
    setExpandedDepts(dMap);
  };

  const collapseAll = () => {
    setExpandedDepts({});
  };

  // Helper string normalization
  const norm = (str) => (str || '').toLowerCase().trim();

  // Get subjects belonging to a department
  const getSubjectsForDept = (dept) => {
    const dCode = norm(dept.code);
    const dName = norm(dept.name);
    return subjects.filter(s => {
      const sDeptCode = norm(s.departmentCode);
      const sDept = norm(s.department);
      return (sDeptCode && sDeptCode === dCode) || (sDept && sDept === dName) || sDept.includes(dName) || dName.includes(sDept);
    });
  };

  // Get assigned staff for a subject
  const getAssignedStaffForSubject = (subject) => {
    const subId = subject.id || subject.code;
    const subCode = subject.code;
    
    const assignedFromJunction = staffSubjectAssignments.filter(
      a => a.subjectId === subId || a.subjectCode === subCode
    );

    const staffList = [...assignedFromJunction];

    if (subject.assignedTeacherName && subject.assignedTeacherName !== 'Unassigned' && subject.assignedTeacherName !== 'Faculty In-Charge') {
      const alreadyIncluded = staffList.some(s => s.teacherName === subject.assignedTeacherName || s.teacherId === subject.assignedTeacherId);
      if (!alreadyIncluded) {
        staffList.push({
          id: `legacy-${subject.id}`,
          teacherId: subject.assignedTeacherId || 'EMP-101',
          teacherName: subject.assignedTeacherName
        });
      }
    }
    return staffList;
  };

  // Filtered Hierarchy Data by Search Term
  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) return departments;
    const term = searchTerm.trim().toLowerCase();
    return departments.filter(d => {
      const matchDept = d.name?.toLowerCase().includes(term) || d.code?.toLowerCase().includes(term) || d.hod?.toLowerCase().includes(term);
      if (matchDept) return true;

      const deptSubjects = getSubjectsForDept(d);
      return deptSubjects.some(s => 
        s.name?.toLowerCase().includes(term) || 
        s.code?.toLowerCase().includes(term) ||
        s.assignedTeacherName?.toLowerCase().includes(term)
      );
    });
  }, [departments, subjects, searchTerm]);

  // --- CRUD HANDLERS ---
  const handleOpenAddDept = () => {
    setEditingDept(null);
    setDeptForm({ name: '', code: '', hod: '', description: '' });
    setShowDeptModal(true);
  };

  const handleOpenEditDept = (dept) => {
    setEditingDept(dept);
    setDeptForm({ name: dept.name, code: dept.code, hod: dept.hod || '', description: dept.description || '' });
    setShowDeptModal(true);
  };

  const handleSaveDept = (e) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code) {
      alert('Department Name and Code are required!');
      return;
    }
    if (editingDept) {
      updateDepartment(editingDept.id, deptForm, currentUser);
      alert(`Updated Department "${deptForm.name}"`);
    } else {
      addDepartment(deptForm, currentUser);
      alert(`Created Department "${deptForm.name}" (${deptForm.code})`);
    }
    setShowDeptModal(false);
  };

  const handleDeleteDeptClick = (dept) => {
    const deptSubjects = getSubjectsForDept(dept);
    if (deptSubjects.length > 0) {
      alert(`⚠️ Action Blocked: Cannot delete Department "${dept.name}" because it still contains ${deptSubjects.length} active subject(s). Please delete or reassign its subjects first.`);
      return;
    }
    if (window.confirm(`Are you sure you want to delete Department "${dept.name}" (${dept.code})?`)) {
      deleteDepartment(dept.id || dept.code, currentUser);
    }
  };

  const handleOpenAddSubject = (dept) => {
    setEditingSubject(null);
    setSubjectForm({
      name: '',
      code: `${dept.code}-`,
      department: dept.name,
      semester: 'Semester 1',
      credits: 4,
      subjectType: 'Core Theory'
    });
    setShowSubjectModal(true);
  };

  const handleOpenEditSubject = (subject) => {
    setEditingSubject(subject);
    setSubjectForm({
      name: subject.name,
      code: subject.code,
      department: subject.department,
      semester: subject.semester || 'Semester 1',
      credits: subject.credits || 4,
      subjectType: subject.subjectType || 'Core Theory'
    });
    setShowSubjectModal(true);
  };

  const handleSaveSubject = (e) => {
    e.preventDefault();
    if (!subjectForm.name || !subjectForm.code) {
      alert('Subject Name and Code are required!');
      return;
    }
    if (editingSubject) {
      updateSubject(editingSubject.id, subjectForm, currentUser);
      alert(`Updated Subject "${subjectForm.name}"`);
    } else {
      addSubject(subjectForm, currentUser);
      alert(`Added Subject "${subjectForm.name}" (${subjectForm.code})`);
    }
    setShowSubjectModal(false);
  };

  const handleDeleteSubjectClick = (sub) => {
    if (window.confirm(`Are you sure you want to delete Subject "${sub.name}" (${sub.code})?`)) {
      deleteSubject(sub.id || sub.code, currentUser);
    }
  };

  const handleOpenAssignStaff = (subject) => {
    setSelectedSubjectForStaff(subject);
    setStaffSearchQuery('');
    setShowAssignStaffModal(true);
  };

  const handleToggleStaffAssignment = (staff) => {
    if (!selectedSubjectForStaff) return;
    const subId = selectedSubjectForStaff.id || selectedSubjectForStaff.code;
    const currentAssigned = getAssignedStaffForSubject(selectedSubjectForStaff);
    const isAssigned = currentAssigned.some(a => a.teacherId === staff.employeeId || a.teacherId === staff.id);

    if (isAssigned) {
      unassignStaffFromSubject(subId, staff.employeeId || staff.id, currentUser);
    } else {
      assignStaffToSubject(subId, staff, selectedSubjectForStaff, currentUser);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto font-sans">
          
          {/* Top Banner Header */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-navy text-[10px] font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded font-sans border border-gold/30 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-gold" /> ACADEMIC SUBJECTS MANAGEMENT
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy mt-2 tracking-tight">
                Department & Subject Hierarchy
              </h1>
              <p className="font-serif text-slate-500 text-xs sm:text-sm mt-1">
                Manage Department &rarr; Subject offerings with real-time student enrollment counts and multi-staff faculty assignments.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleOpenAddDept}
                className="bg-navy hover:bg-navy-dark text-gold font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-sm transition-all border border-gold/30 hover:scale-[1.02] active:scale-95"
              >
                <Plus className="w-4 h-4 text-gold" />
                <span>Add Department</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
              <div className="p-3 bg-navy/10 rounded-xl text-navy">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Departments</p>
                <p className="text-xl font-bold text-navy font-num">{departments.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
              <div className="p-3 bg-gold/20 rounded-xl text-navy">
                <BookOpen className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Subjects</p>
                <p className="text-xl font-bold text-navy font-num">{subjects.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3 col-span-2 sm:col-span-1">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Faculty Members</p>
                <p className="text-xl font-bold text-navy font-num">{allStaff.length}</p>
              </div>
            </div>
          </div>

          {/* Search & Tree Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search department, subject code, or faculty name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-navy focus:bg-white font-sans transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end text-xs font-semibold">
              <button
                onClick={expandAll}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* DEPARTMENT & SUBJECTS TREE VIEW */}
          <div className="space-y-4">
            {filteredDepartments.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                <Building className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-navy">No Departments Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No matching department or subject found for "{searchTerm}". Try adjusting your search query or add a new department.
                </p>
                <button
                  onClick={handleOpenAddDept}
                  className="inline-flex items-center space-x-1.5 bg-navy text-gold px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
                >
                  <Plus className="w-4 h-4 text-gold" />
                  <span>Create Department</span>
                </button>
              </div>
            ) : (
              filteredDepartments.map((dept) => {
                const deptId = dept.id || dept.code;
                const isDeptExpanded = expandedDepts[deptId] !== false; // expanded by default
                const deptSubjects = getSubjectsForDept(dept);

                return (
                  <div key={deptId} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
                    
                    {/* DEPARTMENT HEADER */}
                    <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-navy to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => toggleDept(deptId)}>
                        <button className="p-1 rounded-lg hover:bg-white/10 text-gold transition-all">
                          {isDeptExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                        <div className="p-2 bg-gold/20 rounded-xl border border-gold/30">
                          <Building className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-base tracking-tight text-white">{dept.name}</span>
                            <span className="bg-gold/20 text-gold text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-gold/30">
                              {dept.code}
                            </span>
                          </div>
                          <p className="text-slate-300 text-xs mt-0.5 flex items-center gap-2">
                            <span>HOD: <strong className="text-white font-semibold">{dept.hod || 'Unassigned'}</strong></span>
                            <span>&bull;</span>
                            <span>{dept.description || 'Department of Academic Excellence'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 justify-end">
                        <span className="bg-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-white/10 font-medium">
                          {deptSubjects.length} Subject{deptSubjects.length !== 1 ? 's' : ''}
                        </span>

                        <button
                          onClick={() => handleOpenAddSubject(dept)}
                          className="bg-gold text-navy hover:bg-gold-dark font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-sm transition-all"
                          title="Add new subject under this department"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Subject</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditDept(dept)}
                          className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg transition-all"
                          title="Edit Department Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteDeptClick(dept)}
                          className="p-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 rounded-lg transition-all"
                          title="Delete Department"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* SUBJECTS UNDER DEPARTMENT */}
                    {isDeptExpanded && (
                      <div className="p-4 sm:p-5 bg-slate-50/50 space-y-3 border-t border-slate-100">
                        {deptSubjects.length === 0 ? (
                          <div className="p-6 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                            No subjects added under {dept.name} yet. Click <strong>"+ Add Subject"</strong> above to add one.
                          </div>
                        ) : (
                          deptSubjects.map((sub) => {
                            const assignedStaffList = getAssignedStaffForSubject(sub);
                            const enrolledStudentCount = getStudentsCountForCourse(sub.name) || getStudentsCountForCourse(sub.code) || getStudentsCountForCourse(dept.code);

                            return (
                              <div key={sub.id || sub.code} className="p-4 bg-white hover:bg-slate-50/80 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all">
                                
                                <div className="flex items-start space-x-3">
                                  <div className="p-2 bg-navy/10 text-navy rounded-xl mt-0.5">
                                    <BookOpen className="w-4 h-4 text-navy" />
                                  </div>
                                  <div>
                                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                      <span className="font-bold text-sm text-navy">{sub.name}</span>
                                      <span className="bg-slate-200 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                                        {sub.code}
                                      </span>
                                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                        {sub.semester || 'Semester 1'}
                                      </span>
                                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                        {sub.credits || 4} Credits
                                      </span>

                                      {/* ENROLLED STUDENTS COUNT BADGE */}
                                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                        <Users className="w-3 h-3 text-emerald-600" />
                                        {enrolledStudentCount} Enrolled Student{enrolledStudentCount !== 1 ? 's' : ''}
                                      </span>
                                    </div>

                                    {/* ASSIGNED FACULTY BADGES */}
                                    <div className="mt-2 flex items-center space-x-2 flex-wrap gap-y-1">
                                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Faculty:</span>
                                      {assignedStaffList.length === 0 ? (
                                        <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 italic font-medium">
                                          Unassigned
                                        </span>
                                      ) : (
                                        assignedStaffList.map((st, sIdx) => (
                                          <span key={sIdx} className="bg-navy/10 text-navy font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-navy/20 flex items-center gap-1">
                                            <UserCheck className="w-3 h-3 text-navy" />
                                            {st.teacherName}
                                          </span>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2 justify-end flex-shrink-0">
                                  <button
                                    onClick={() => handleOpenAssignStaff(sub)}
                                    className="bg-white hover:bg-slate-100 text-navy border border-slate-300 font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-2xs transition-all"
                                    title="Assign faculty member to handle this subject"
                                  >
                                    <UserPlus className="w-3.5 h-3.5 text-navy" />
                                    <span>Assign Staff</span>
                                  </button>

                                  <button
                                    onClick={() => handleOpenEditSubject(sub)}
                                    className="p-1.5 text-slate-500 hover:text-navy hover:bg-slate-100 rounded-lg transition-all"
                                    title="Edit Subject"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteSubjectClick(sub)}
                                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                                    title="Delete Subject"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                              </div>
                            );
                          })
                        )}
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

        </main>
      </div>

      {/* DEPARTMENT MODAL */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="bg-navy p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm tracking-wide text-gold">
                {editingDept ? 'Edit Department' : 'Add New Department'}
              </h3>
              <button onClick={() => setShowDeptModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveDept} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science & Engineering"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Department Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE"
                  value={deptForm.code}
                  onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-navy uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Head of Department (HOD)</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Rajesh Kumar"
                  value={deptForm.hod}
                  onChange={(e) => setDeptForm({ ...deptForm, hod: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Description / Overview</label>
                <textarea
                  rows="3"
                  placeholder="Brief description of department scope..."
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-navy"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy text-gold hover:bg-navy-dark font-bold rounded-xl text-xs shadow-sm"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBJECT MODAL */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="bg-navy p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm tracking-wide text-gold">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <button onClick={() => setShowSubjectModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSubject} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures & Algorithms"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Subject Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS-201"
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-navy uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Department</label>
                <select
                  value={subjectForm.department}
                  onChange={(e) => setSubjectForm({ ...subjectForm, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-navy bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.id || d.code} value={d.name}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">Semester</label>
                  <select
                    value={subjectForm.semester}
                    onChange={(e) => setSubjectForm({ ...subjectForm, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-navy bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={`Semester ${s}`}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={subjectForm.credits}
                    onChange={(e) => setSubjectForm({ ...subjectForm, credits: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-navy"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy text-gold hover:bg-navy-dark font-bold rounded-xl text-xs shadow-sm"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEARCHABLE STAFF ASSIGNMENT MODAL */}
      {showAssignStaffModal && selectedSubjectForStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            
            <div className="bg-navy p-4 text-white flex items-center justify-between">
              <div>
                <span className="text-gold text-[10px] font-bold uppercase tracking-wider">FACULTY ASSIGNMENT</span>
                <h3 className="font-bold text-sm text-white">
                  Assign Faculty to {selectedSubjectForStaff.name} ({selectedSubjectForStaff.code})
                </h3>
              </div>
              <button onClick={() => setShowAssignStaffModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              
              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search faculty name, employee ID, or department..."
                  value={staffSearchQuery}
                  onChange={(e) => setStaffSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-navy focus:bg-white"
                />
              </div>

              {/* Staff List */}
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {allStaff
                  .filter(s => {
                    if (!staffSearchQuery.trim()) return true;
                    const q = staffSearchQuery.toLowerCase();
                    return s.name?.toLowerCase().includes(q) || s.employeeId?.toLowerCase().includes(q) || s.department?.toLowerCase().includes(q);
                  })
                  .map((staff) => {
                    const currentAssigned = getAssignedStaffForSubject(selectedSubjectForStaff);
                    const isAssigned = currentAssigned.some(
                      a => a.teacherId === staff.employeeId || a.teacherId === staff.id || a.teacherName === staff.name
                    );

                    return (
                      <div
                        key={staff.id || staff.employeeId}
                        onClick={() => handleToggleStaffAssignment(staff)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isAssigned
                            ? 'bg-navy/5 border-navy/30'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg font-bold text-xs ${isAssigned ? 'bg-navy text-gold' : 'bg-slate-100 text-slate-600'}`}>
                            {staff.name?.charAt(0) || 'F'}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-navy">{staff.name}</p>
                            <p className="text-[11px] text-slate-500 font-sans">
                              {staff.employeeId} &bull; {staff.department || 'Faculty Member'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
                            isAssigned
                              ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                              : 'bg-navy text-gold hover:bg-navy-dark shadow-2xs'
                          }`}
                        >
                          {isAssigned ? (
                            <>
                              <UserMinus className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Assign</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAssignStaffModal(false)}
                  className="px-5 py-2 bg-navy text-gold font-bold text-xs rounded-xl shadow-sm hover:bg-navy-dark"
                >
                  Done
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
