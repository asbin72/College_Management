import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { Search, Filter, Plus, Edit, Eye, Power, Lock, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const AdminStudents = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const {
    users, departments, courses, subjects, attendance, examinations, marksRecords, leaveRequests,
    addStudent, updateUser, toggleUserStatus, resetUserAccount, deleteUser
  } = useData();

  const handleDeleteStudent = (stu) => {
    const sid = stu.studentId || stu.username || stu.id;
    if (window.confirm(`Are you sure you want to permanently delete student "${stu.name}" (${sid}) from the database?`)) {
      deleteUser(stu.id || sid, currentUser);
    }
  };

  // Search, Filter, Sort, Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterCourse, setFilterCourse] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal / Drawer States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [resetModalStudent, setResetModalStudent] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  // Form State for Add / Edit
  const [formData, setFormData] = useState({});

  // Filter & Sort Students
  const allStudents = users.filter(u => u.role === 'STUDENT');

  const filteredStudents = allStudents.filter(s => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      (s.name && s.name.toLowerCase().includes(term)) ||
      (s.email && s.email.toLowerCase().includes(term)) ||
      (s.studentId && s.studentId.toLowerCase().includes(term)) ||
      (s.phone && s.phone.includes(term))
    );
    const matchesDept = filterDept === 'ALL' || s.department === filterDept;
    const matchesCourse = filterCourse === 'ALL' || s.course === filterCourse;
    const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus;
    return matchesSearch && matchesDept && matchesCourse && matchesStatus;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage) || 1;
  const paginatedStudents = sortedStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const generateNextStudentId = () => {
    const studentUsers = users.filter(u => u.role === 'STUDENT');
    let maxNum = 262;
    studentUsers.forEach(u => {
      const match = String(u.studentId || u.username || '').match(/STU-(?:2026-)?(\d+)/i) || String(u.studentId || u.username || '').match(/(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    return `STU-2026-${maxNum + 1}`;
  };

  const openAddModal = () => {
    const nextStuId = generateNextStudentId();
    setFormData({
      name: '',
      email: '',
      studentId: nextStuId,
      username: nextStuId,
      phone: '+91 98765 43210',
      department: departments[0]?.name || 'Computer Science and Engineering',
      course: courses[0]?.name || 'B.Tech Computer Science & Engineering',
      semester: 'Semester 1',
      status: 'Active',
      password: 'student123',
      parentName: '',
      parentPhone: '',
      admissionDate: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.name.trim()) return;

    // Check duplicate name warning
    const dupName = users.find(u => u.role === 'STUDENT' && u.name.toLowerCase().trim() === formData.name.toLowerCase().trim());
    if (dupName) {
      if (!window.confirm(`Notice: A student named "${formData.name}" (${dupName.studentId}) is already enrolled. Do you want to proceed creating a separate unique account with ID ${formData.studentId}?`)) {
        return;
      }
    }

    // Check duplicate email
    const dupEmail = users.find(u => u.email?.toLowerCase() === formData.email?.toLowerCase());
    if (dupEmail) {
      alert(`Validation Error: The email address "${formData.email}" is already assigned to student ${dupEmail.name} (${dupEmail.studentId}). Please use a unique email address.`);
      return;
    }

    addStudent(formData, currentUser);
    setShowAddModal(false);
    alert(`Enrolled student account for ${formData.name}! Unique Email: ${formData.email}, Student ID: ${formData.studentId}.`);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({ ...student });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateUser(editingStudent.id, formData, currentUser);
    setEditingStudent(null);
    alert(`Updated student account for ${formData.name}! Changes automatically reflected in Student Portal.`);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    resetUserAccount(resetModalStudent.id, newPassword, currentUser);
    setResetModalStudent(null);
    setNewPassword('');
    alert(`Password reset successfully for ${resetModalStudent.name}!`);
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

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">MANAGEMENT CONTROL &bull; STUDENT MODULE</span>
              <h1 className="text-2xl font-serif font-bold text-navy mt-1">Student Management Roster</h1>
              <p className="text-slate-500 text-xs mt-1">Manage enrollments, assign departments/courses/semesters, toggle active status & reset accounts.</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-navy hover:bg-navy-light text-gold font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Student Account
            </button>
          </div>

          {/* Search, Filter & Controls Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by ID, Name, Email, Phone..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl bg-slate-50 text-navy font-semibold focus:outline-none focus:border-navy"
                />
              </div>

              <div className="md:col-span-3">
                <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 font-semibold text-navy">
                  <option value="ALL">All Departments</option>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>

              <div className="md:col-span-3">
                <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 font-semibold text-navy">
                  <option value="ALL">All Courses</option>
                  {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 font-semibold text-navy">
                  <option value="ALL">All Status</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Student Data Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy text-amber-50 uppercase font-bold tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Student ID</th>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Semester</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Admission Date</th>
                    <th className="p-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((stu) => (
                      <tr key={stu.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5 font-bold text-navy whitespace-nowrap">{stu.studentId || stu.username}</td>
                        <td className="p-3.5 font-bold text-slate-800 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={stu.photoUrl || stu.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                              alt={stu.name}
                              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'; }}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm flex-shrink-0"
                            />
                            <span>{stu.name}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-600 whitespace-nowrap">{stu.email}</td>
                        <td className="p-3.5 text-slate-600 whitespace-nowrap">{stu.phone || 'N/A'}</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="bg-slate-100 text-navy px-2.5 py-1 rounded-lg border border-slate-200 font-mono font-bold text-xs">
                            {getShortDept(stu.department, stu.departmentCode)}
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-navy whitespace-nowrap">{stu.semester}</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1.5 border ${
                            stu.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${stu.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                            {stu.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500 whitespace-nowrap">{stu.createdAt || stu.admissionDate || '2024-01-01'}</td>
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setViewingStudent(stu)}
                              title="View Student Profile"
                              className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(stu)}
                              title="Edit Student / Assign Course/Dept"
                              className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleUserStatus(stu.id, currentUser)}
                              title={stu.status === 'Active' ? 'Deactivate Student' : 'Activate Student'}
                              className={`p-1.5 rounded-lg ${
                                stu.status === 'Active' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              }`}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { setResetModalStudent(stu); setNewPassword(''); }}
                              title="Reset Password"
                              className="p-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(stu)}
                              title="Delete Student from Database"
                              className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-slate-400">No student records match your filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 bg-slate-50 border-t flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">
                Showing {Math.min(sortedStudents.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(sortedStudents.length, currentPage * itemsPerPage)} of {sortedStudents.length} Students
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border rounded-lg bg-white disabled:opacity-50 font-bold"
                >
                  <ChevronLeft className="w-4 h-4 inline" /> Prev
                </button>
                <span className="font-bold text-navy">Page {currentPage} of {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border rounded-lg bg-white disabled:opacity-50 font-bold"
                >
                  Next <ChevronRight className="w-4 h-4 inline" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- ADD STUDENT MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">Add Student Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-navy"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Vikram Sharma" 
                  value={formData.name || ''} 
                  className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-gold" 
                  onChange={e => {
                    const name = e.target.value;
                    const cleanName = name.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
                    const parts = cleanName.split(/\s+/).filter(Boolean);
                    let baseEmail = parts.length >= 2 ? `${parts[0]}.${parts[parts.length - 1]}` : (parts[0] || 'student');
                    let uniqueEmail = `${baseEmail}@kalpanaaa.edu`;
                    let counter = 1;
                    while (users.some(u => u.email?.toLowerCase() === uniqueEmail.toLowerCase())) {
                      uniqueEmail = `${baseEmail}${counter}@kalpanaaa.edu`;
                      counter++;
                    }
                    setFormData({ 
                      ...formData, 
                      name, 
                      email: formData.userEditedEmail ? formData.email : uniqueEmail 
                    });
                  }} 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Student ID / Roll No</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">AUTO-FILLED</span>
                  </label>
                  <input 
                    readOnly 
                    type="text" 
                    value={formData.studentId || ''} 
                    className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg font-mono font-bold text-navy cursor-not-allowed select-none" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Email Address *</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">AUTO-GENERATED</span>
                  </label>
                  <input 
                    required 
                    type="email" 
                    placeholder="student@kalpanaaa.edu" 
                    value={formData.email || ''} 
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-gold font-mono font-bold text-navy" 
                    onChange={e => setFormData({ ...formData, email: e.target.value, userEditedEmail: true })} 
                  />
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
                  <label className="block font-bold text-slate-700 mb-1">Semester</label>
                  <input required type="text" value={formData.semester || ''} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, semester: e.target.value })} />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password</label>
                  <input required type="password" value={formData.password || ''} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, password: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-navy text-gold font-bold rounded-lg hover:bg-navy-light">Create Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT STUDENT MODAL --- */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">Edit Student Profile & Assignments</h3>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-navy"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input required type="text" value={formData.name || ''} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, name: e.target.value })} />
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
                  <label className="block font-bold text-slate-700 mb-1">Semester</label>
                  <input required type="text" value={formData.semester || ''} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, semester: e.target.value })} />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select value={formData.status || 'Active'} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setEditingStudent(null)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-navy text-gold font-bold rounded-lg hover:bg-navy-light">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- RESET PASSWORD MODAL --- */}
      {resetModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">Reset Password for {resetModalStudent.name}</h3>
              <button onClick={() => setResetModalStudent(null)} className="text-slate-400 hover:text-navy"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password</label>
                <input required type="password" placeholder="Enter new password" value={newPassword} className="w-full p-2.5 border rounded-lg" onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setResetModalStudent(null)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800">Reset Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DETAILED STUDENT PROFILE DRAWER --- */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-6 flex flex-col">
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={viewingStudent.photoUrl || viewingStudent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt={viewingStudent.name}
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'; }}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-gold shadow-md flex-shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-gold uppercase tracking-wider">{viewingStudent.studentId || viewingStudent.username}</span>
                  <h2 className="text-xl font-serif font-bold text-navy">{viewingStudent.name}</h2>
                </div>
              </div>
              <button onClick={() => setViewingStudent(null)} className="p-2 text-slate-400 hover:text-navy"><X className="w-6 h-6" /></button>
            </div>

            {/* Profile Tabs Content */}
            <div className="space-y-6 text-xs flex-1">

              {/* Personal & Contact Info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-navy text-sm border-b pb-1">Personal & Contact Information</h4>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div><span className="text-slate-400">Email:</span> <p className="font-semibold text-navy">{viewingStudent.email}</p></div>
                  <div><span className="text-slate-400">Phone:</span> <p className="font-semibold text-navy">{viewingStudent.phone || 'N/A'}</p></div>
                  <div><span className="text-slate-400">Department:</span> <p className="font-semibold text-navy">{viewingStudent.department}</p></div>
                  <div><span className="text-slate-400">Course:</span> <p className="font-semibold text-navy">{viewingStudent.course}</p></div>
                  <div><span className="text-slate-400">Semester:</span> <p className="font-semibold text-navy">{viewingStudent.semester}</p></div>
                  <div><span className="text-slate-400">Status:</span> <p className="font-semibold text-emerald-600">{viewingStudent.status || 'Active'}</p></div>
                </div>
              </div>

              {/* Enrolled Subjects */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-navy text-sm border-b pb-1">Assigned Academic Subjects</h4>
                <div className="space-y-1.5 pt-1">
                  {subjects.filter(s => s.course === viewingStudent.course || (s.code && viewingStudent.studentId && s.code.startsWith(viewingStudent.studentId.split('-')[1]))).slice(0, 6).map(sub => (
                    <div key={sub.id || sub.code} className="p-2 bg-white rounded border flex justify-between">
                      <span className="font-bold text-navy">{sub.code}: {sub.name}</span>
                      <span className="text-slate-500 font-semibold">{sub.assignedTeacherName || 'Department Faculty'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance & Leave History */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-navy text-sm border-b pb-1">Attendance & Leave History</h4>
                <p className="text-slate-600">Overall Recorded Attendance: <strong className="text-emerald-600">{viewingStudent.overallAttendance || '88%'}</strong></p>
                <div className="pt-2">
                  <span className="font-bold text-slate-700 block mb-1">Leave Requests:</span>
                  {leaveRequests.filter(l => l.applicantId === viewingStudent.studentId || l.applicantId === viewingStudent.username || l.applicantId === viewingStudent.id).map(l => (
                    <div key={l.id} className="p-2 bg-white rounded border text-[11px] mb-1 flex justify-between">
                      <span>{l.leaveType} ({l.days} days)</span>
                      <span className="font-bold text-amber-600">{l.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Examination Results */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-navy text-sm border-b pb-1">Published Examination Results</h4>
                <div className="space-y-1 pt-1">
                  {marksRecords.filter(m => (m.studentId === viewingStudent.studentId || m.studentId === viewingStudent.username || m.studentId === viewingStudent.id) && (m.published || m.status === 'Submitted' || m.status === 'Published')).map(m => (
                    <div key={m.id} className="p-2 bg-white rounded border flex justify-between">
                      <span className="font-bold text-navy">{m.subjectCode}: {m.subjectName}</span>
                      <span className="font-bold text-emerald-600">Grade: {m.grade} ({m.marksObtained}/{m.maxMarks})</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
