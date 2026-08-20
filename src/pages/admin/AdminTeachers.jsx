import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { Plus, Search, X, Trash2, CheckCircle2 } from 'lucide-react';
import { DEPARTMENTS, YEARS, SEMESTERS } from '../../data/collegeDataGenerator';

export const AdminTeachers = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const {
    users, departments, courses, subjects, subjectOfferings, facultyClassAssignments,
    addTeacher, updateUser, toggleUserStatus, resetUserAccount, deleteUser,
    allocateFacultyClassAssignment, removeFacultyClassAssignment
  } = useData();

  const handleDeleteTeacher = (tch) => {
    const empId = tch.employeeId || tch.username || tch.id;
    if (window.confirm(`Are you sure you want to permanently delete faculty member "${tch.name}" (${empId}) from the database?`)) {
      deleteUser(tch.id || empId, currentUser);
    }
  };

  const getShortDept = (deptName, deptCode) => {
    if (deptCode && deptCode.length <= 5) return deptCode.toUpperCase();
    if (!deptName) return 'CSE';
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

  const teachers = users.filter(u => 
    u.role === 'TEACHER' || 
    u.role === 'STAFF' || 
    u.role === 'FACULTY' || 
    (u.employeeId && String(u.employeeId).startsWith('EMP')) || 
    (u.role !== 'ADMIN' && u.role !== 'STUDENT' && u.designation)
  );

  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'allocation'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Allocation Form State
  const [allocationForm, setAllocationForm] = useState({
    facultyId: teachers[0]?.employeeId || 'EMP-101',
    departmentCode: 'CSE',
    year: '1st Year',
    semester: 'Semester 1',
    subjectCode: 'CSE-101',
    subjectName: 'Engineering Mathematics I'
  });
  const [allocationError, setAllocationError] = useState('');
  const [allocationSuccess, setAllocationSuccess] = useState('');

  const rawSubjectsList = (subjectOfferings && subjectOfferings.length > 0) ? subjectOfferings : ((subjects && subjects.length > 0) ? subjects : courses);
  const filteredSubjectsList = rawSubjectsList.filter(s => {
    const sDeptCode = (s.departmentCode || (s.code ? String(s.code).split('-')[0] : '')).toUpperCase();
    const formDeptCode = String(allocationForm.departmentCode || 'CSE').toUpperCase();
    if (sDeptCode === formDeptCode) return true;
    if (s.department && String(s.department).toLowerCase().includes(formDeptCode.toLowerCase())) return true;
    return false;
  });
  const displaySubjectsList = filteredSubjectsList.length > 0 ? filteredSubjectsList : rawSubjectsList;

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);
  const [resetModalTeacher, setResetModalTeacher] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [formData, setFormData] = useState({});

  const filteredTeachers = teachers.filter(t => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      (t.name && t.name.toLowerCase().includes(term)) ||
      (t.email && t.email.toLowerCase().includes(term)) ||
      (t.employeeId && t.employeeId.toLowerCase().includes(term)) ||
      (t.phone && t.phone.includes(term))
    );
    const matchesDept = filterDept === 'ALL' || t.department === filterDept;
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const openAddModal = () => {
    let maxNum = 100;
    teachers.forEach(t => {
      const emp = String(t.employeeId || t.username || '');
      const m = emp.match(/EMP-(\d+)/i);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > maxNum) maxNum = n;
      }
    });
    const nextEmpId = `EMP-${maxNum + 1}`;

    setFormData({
      name: '',
      email: '',
      employeeId: nextEmpId,
      username: nextEmpId,
      phone: '+91 98765 43210',
      department: DEPARTMENTS[0].name,
      departmentCode: 'CSE',
      designation: 'Assistant Professor',
      qualification: 'M.Tech / Ph.D.',
      specialization: 'Computer Science',
      experience: '5+ Years',
      role: 'TEACHER',
      status: 'Active',
      password: ''
    });
    setShowAddModal(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    addTeacher(formData, currentUser);
    setShowAddModal(false);
  };

  // Allocation Handler with Department Match Check
  const handleAllocateSubmit = (e) => {
    e.preventDefault();
    setAllocationError('');
    setAllocationSuccess('');

    // Fetch Subject Offering Info
    const selectedSubObj = (subjectOfferings || []).find(s => s.subjectCode === allocationForm.subjectCode) || {
      subjectName: allocationForm.subjectName || 'Database Systems'
    };

    const payload = {
      ...allocationForm,
      subjectName: selectedSubObj.subjectName
    };

    const res = allocateFacultyClassAssignment(payload, currentUser);
    if (!res.success) {
      setAllocationError(res.error);
    } else {
      setAllocationSuccess(`Successfully assigned class ${res.assignment.subjectName} (${res.assignment.year}, ${res.assignment.semester}) to faculty. Current Workload: ${res.workloadCount} Classes / ${res.workloadCount * 10} Students.`);
      setTimeout(() => setAllocationSuccess(''), 5000);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto font-sans">
          
          {/* Header Banner */}
          <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-navy text-[10px] font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded border border-gold/30">
                ADMINISTRATION &bull; FACULTY GOVERNANCE
              </span>
              <h1 className="text-2xl font-bold text-navy mt-1">Faculty & Class Allocation Engine</h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Manage faculty directory and allocate subject teaching assignments with workload validation.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('roster')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'roster' ? 'bg-navy text-gold shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Faculty Directory ({teachers.length})
              </button>
              <button
                onClick={() => setActiveTab('allocation')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'allocation' ? 'bg-gold text-navy-dark shadow font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Faculty Class Allocation Engine
              </button>
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-navy hover:bg-navy-light text-gold text-xs font-bold rounded-xl shadow flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Faculty Member
              </button>
            </div>
          </div>

          {/* TAB 1: FACULTY DIRECTORY */}
          {activeTab === 'roster' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-serif font-bold text-navy text-lg">Registered Faculty Members</h3>
                <div className="relative w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by ID, name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold text-navy"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy text-amber-50 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">Emp ID</th>
                      <th className="p-3">Faculty Name</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Designation</th>
                      <th className="p-3">Workload Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredTeachers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-400 font-medium">
                          No faculty members found matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredTeachers.map(tch => {
                        const empId = tch.employeeId || tch.username || tch.id;
                        const assignmentsCount = (facultyClassAssignments || []).filter(f => f.facultyId === empId).length;

                        return (
                          <tr key={tch.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-navy">{empId}</td>
                            <td className="p-3 font-bold text-slate-800">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={tch.photoUrl || tch.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                                  alt={tch.name}
                                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'; }}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm flex-shrink-0"
                                />
                                <span>{tch.name}</span>
                              </div>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="bg-slate-100 text-navy px-2.5 py-1 rounded-lg border border-slate-200 font-mono font-bold text-xs">
                                {getShortDept(tch.department, tch.departmentCode)}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500">{tch.designation}</td>
                            <td className="p-3">
                              {assignmentsCount === 0 ? (
                                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                  Unassigned (0 Classes)
                                </span>
                              ) : assignmentsCount <= 2 ? (
                                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {assignmentsCount} {assignmentsCount === 1 ? 'Class' : 'Classes'} ({assignmentsCount * 10} Students) &bull; Active Workload
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                                  {assignmentsCount} Classes ({assignmentsCount * 10} Students) &bull; Heavy Load
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setAllocationForm({ ...allocationForm, facultyId: empId, departmentCode: tch.departmentCode || 'CSE' });
                                  setActiveTab('allocation');
                                }}
                                className="px-2.5 py-1 bg-gold text-navy-dark font-bold rounded text-[10px]"
                                title="Allocate Class Cohort"
                              >
                                Allocate Class
                              </button>
                              <button
                                onClick={() => handleDeleteTeacher(tch)}
                                className="p-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-xs font-bold transition inline-flex items-center"
                                title="Delete Faculty Member from Database"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: FACULTY CLASS ALLOCATION ENGINE */}
          {activeTab === 'allocation' && (
            <div className="space-y-6">
              
              {/* Allocation Alert Messages */}
              {allocationError && (
                <div className="p-4 bg-red-600 text-white font-bold text-xs rounded-2xl shadow flex items-center justify-between">
                  <span>{allocationError}</span>
                  <button onClick={() => setAllocationError('')}>&times;</button>
                </div>
              )}

              {allocationSuccess && (
                <div className="p-4 bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow flex items-center justify-between">
                  <span>{allocationSuccess}</span>
                  <button onClick={() => setAllocationSuccess('')}>&times;</button>
                </div>
              )}

              {/* Allocation Form Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="font-serif font-bold text-navy text-lg border-b pb-2">Assign Class Subject to Faculty</h3>

                <form onSubmit={handleAllocateSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Select Faculty Member *</label>
                    <select
                      value={allocationForm.facultyId}
                      onChange={e => {
                        const tch = teachers.find(t => (t.employeeId || t.id) === e.target.value);
                        setAllocationForm({
                          ...allocationForm,
                          facultyId: e.target.value,
                          departmentCode: tch?.departmentCode || 'CSE'
                        });
                      }}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-navy"
                    >
                      {teachers.map(t => (
                        <option key={t.id} value={t.employeeId || t.id}>
                          {t.name} ({t.employeeId || t.id}) &bull; {t.departmentCode || 'CSE'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department *</label>
                    <select
                      value={allocationForm.departmentCode}
                      onChange={e => setAllocationForm({ ...allocationForm, departmentCode: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-navy"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Year Group *</label>
                    <select
                      value={allocationForm.year}
                      onChange={e => setAllocationForm({ ...allocationForm, year: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-navy"
                    >
                      {YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Semester *</label>
                    <select
                      value={allocationForm.semester}
                      onChange={e => setAllocationForm({ ...allocationForm, semester: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-navy"
                    >
                      {SEMESTERS.map(s => (
                        <option key={s.sem} value={s.sem}>{s.sem} ({s.year})</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Select Subject Offering *</label>
                    <select
                      value={allocationForm.subjectCode}
                      onChange={e => {
                        const selectedCode = e.target.value;
                        const sub = displaySubjectsList.find(s => (s.subjectCode || s.code) === selectedCode);
                        setAllocationForm({
                          ...allocationForm,
                          subjectCode: selectedCode,
                          subjectName: sub?.subjectName || sub?.name || selectedCode
                        });
                      }}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-navy"
                    >
                      {displaySubjectsList.map(sub => {
                        const subCode = sub.subjectCode || sub.code || sub.id;
                        const subName = sub.subjectName || sub.name || 'Subject Course';
                        const subSem = sub.semester || '5th Semester';
                        return (
                          <option key={sub.id || subCode} value={subCode}>
                            [{subCode}] {subName} ({subSem})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="md:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-navy hover:bg-navy-light text-gold font-bold text-xs rounded-xl shadow uppercase tracking-wider flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Assign Subject Class to Faculty
                    </button>
                  </div>

                </form>
              </div>

              {/* Workload Summary Table */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="font-serif font-bold text-navy text-lg">Active FacultyClassAssignment Workload Roster</h3>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-navy text-amber-50 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-3">Assignment ID</th>
                        <th className="p-3">Faculty Lead</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Year / Semester</th>
                        <th className="p-3">Subject Offering</th>
                        <th className="p-3">Student Strength</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {(facultyClassAssignments || []).map(fca => (
                        <tr key={fca.assignmentId} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-navy">{fca.assignmentId}</td>
                          <td className="p-3 font-bold text-slate-800">{fca.facultyName}</td>
                          <td className="p-3 font-bold text-slate-600">{fca.departmentCode}</td>
                          <td className="p-3 font-bold text-slate-700">{fca.year} ({fca.semester})</td>
                          <td className="p-3 font-bold text-slate-900">{fca.subjectName} ({fca.subjectCode})</td>
                          <td className="p-3 font-num font-bold text-emerald-700">{fca.studentCount || 10} Students</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => removeFacultyClassAssignment(fca.assignmentId, currentUser)}
                              className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded text-[10px]"
                            >
                              Unassign
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ADD FACULTY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative font-sans">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-navy">Register New Faculty Member</h3>
                <p className="text-[11px] text-slate-500">Employee ID is automatically generated and unique across the institution.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-navy"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-3 text-xs" autoComplete="off">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Faculty Full Name *</label>
                <input 
                  required 
                  type="text" 
                  autoComplete="off"
                  placeholder="e.g. Dr. Sunita Patel" 
                  value={formData.name || ''} 
                  className="w-full p-2.5 border rounded-xl focus:outline-none focus:border-gold font-bold text-navy" 
                  onChange={e => {
                    const name = e.target.value;
                    const cleanName = name.toLowerCase().replace(/^(dr\.|prof\.|mr\.|ms\.|mrs\.)\s+/i, '').trim();
                    const parts = cleanName.split(/\s+/).filter(Boolean);
                    const suggestedEmail = parts.length >= 2 ? `${parts[0]}.${parts[parts.length - 1]}@kalpanaaa.edu` : (parts[0] ? `${parts[0]}@kalpanaaa.edu` : '');
                    setFormData({ 
                      ...formData, 
                      name, 
                      email: formData.userEditedEmail ? formData.email : suggestedEmail 
                    });
                  }} 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Employee ID</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">AUTO-FILLED</span>
                  </label>
                  <input 
                    type="text" 
                    readOnly 
                    value={formData.employeeId || ''} 
                    className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-xl font-num font-bold text-navy cursor-not-allowed" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institutional Email *</label>
                  <input 
                    required 
                    type="email" 
                    autoComplete="off"
                    placeholder="sunita.patel@kalpanaaa.edu" 
                    value={formData.email || ''} 
                    className="w-full p-2.5 border rounded-xl focus:outline-none focus:border-gold" 
                    onChange={e => setFormData({ ...formData, email: e.target.value, userEditedEmail: true })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department *</label>
                  <select 
                    required 
                    value={formData.department}
                    className="w-full p-2.5 border rounded-xl focus:outline-none focus:border-gold font-bold text-navy" 
                    onChange={e => {
                      const deptObj = DEPARTMENTS.find(d => d.name === e.target.value);
                      setFormData({ 
                        ...formData, 
                        department: e.target.value,
                        departmentCode: deptObj?.code || 'CSE'
                      });
                    }}
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d.code} value={d.name}>{d.code} - {d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation *</label>
                  <select
                    value={formData.designation}
                    className="w-full p-2.5 border rounded-xl focus:outline-none focus:border-gold"
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  >
                    <option value="Professor & HOD">Professor & HOD</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Senior Lecturer">Senior Lecturer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone || ''} 
                    className="w-full p-2.5 border rounded-xl font-num" 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Password</label>
                  <input 
                    required 
                    type="password" 
                    autoComplete="new-password"
                    placeholder="Enter password"
                    value={formData.password || ''} 
                    className="w-full p-2.5 border rounded-xl font-num" 
                    onChange={e => setFormData({ ...formData, password: e.target.value })} 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-navy hover:bg-navy-light text-gold font-bold rounded-xl shadow uppercase tracking-wider flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" /> Register Faculty Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
