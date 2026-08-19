import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { Plus, Edit, Eye, Power, Trash2, X } from 'lucide-react';

export const AdminDepartments = () => {
  const { currentUser } = useAuth();
  const {
    departments, users, courses, subjects, attendance, examinations,
    addDepartment, updateDepartment, deleteDepartment
  } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [viewingDept, setViewingDept] = useState(null);
  const [formData, setFormData] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDeleteDept = (dept) => {
    if (window.confirm(`Are you sure you want to permanently delete department "${dept.name}" (${dept.code}) from the database?`)) {
      deleteDepartment(dept.id, currentUser);
    }
  };

  const teachers = users.filter(u => u.role === 'TEACHER');

  const openAddModal = () => {
    setFormData({
      name: '',
      code: '',
      hod: teachers[0]?.name || 'Unassigned',
      description: '',
      status: 'Active'
    });
    setShowAddModal(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    addDepartment(formData, currentUser);
    setShowAddModal(false);
    alert(`Department ${formData.name} created!`);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({ ...dept });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateDepartment(editingDept.id, formData, currentUser);
    setEditingDept(null);
    alert(`Updated department ${formData.name}!`);
  };

  const toggleDeptStatus = (dept) => {
    const newStatus = dept.status === 'Active' ? 'Inactive' : 'Active';
    updateDepartment(dept.id, { status: newStatus }, currentUser);
  };

  const normStr = (str) => (str || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');

  const isDeptMatch = (targetDept, targetCode, dept) => {
    if (!dept) return false;
    const dCode = (dept.code || '').toUpperCase().trim();
    const tCode = (targetCode || '').toUpperCase().trim();
    const dName = normStr(dept.name);
    const tName = normStr(targetDept);

    // 1. Strict Code match
    if (tCode && dCode && tCode === dCode) return true;

    // 2. Strict Exact Name match
    if (tName && dName && tName === dName) return true;

    // 3. Strict Department Keyword Guard (Prevents cross-matching "Engineering")
    if (dCode === 'CE' || dName.includes('civil')) {
      return tCode === 'CE' || tName.includes('civil');
    }
    if (dCode === 'CSE' || (dName.includes('computer') && dName.includes('science'))) {
      return tCode === 'CSE' || tCode === 'CS' || (tName.includes('computer') && tName.includes('science'));
    }
    if (dCode === 'ISE' || (dName.includes('information') && dName.includes('science'))) {
      return tCode === 'ISE' || tCode === 'IS' || (tName.includes('information') && tName.includes('science'));
    }
    if (dCode === 'ECE' || (dName.includes('electronics') && dName.includes('communication'))) {
      return tCode === 'ECE' || tCode === 'EC' || (tName.includes('electronics') && tName.includes('communication'));
    }
    if (dCode === 'EEE' || (dName.includes('electrical') && dName.includes('electronics'))) {
      return tCode === 'EEE' || tCode === 'EE' || (tName.includes('electrical') && tName.includes('electronics'));
    }
    if (dCode === 'ME' || dName.includes('mechanical')) {
      return tCode === 'ME' || tName.includes('mechanical');
    }
    if (dCode === 'MBA' || dName.includes('management') || dName.includes('business')) {
      return tCode === 'MBA' || tName.includes('management') || tName.includes('business');
    }

    return false;
  };

  const isSubjectDeptMatch = (sub, dept) => {
    if (!sub || !dept) return false;
    const dCode = (dept.code || '').toUpperCase().trim();
    const sCodePrefix = (sub.code || '').split('-')[0].toUpperCase().trim();
    const sDept = normStr(sub.department);

    if (dCode === 'CSE' && (sCodePrefix === 'CS' || sCodePrefix === 'CSE' || sDept.includes('computer'))) return true;
    if (dCode === 'ISE' && (sCodePrefix === 'IS' || sCodePrefix === 'ISE' || sDept.includes('information'))) return true;
    if (dCode === 'ECE' && (sCodePrefix === 'EC' || sCodePrefix === 'ECE' || (sDept.includes('electronics') && sDept.includes('communication')))) return true;
    if (dCode === 'EEE' && (sCodePrefix === 'EE' || sCodePrefix === 'EEE' || (sDept.includes('electrical') && sDept.includes('electronics')))) return true;
    if (dCode === 'ME' && (sCodePrefix === 'ME' || sDept.includes('mechanical'))) return true;
    if (dCode === 'CE' && (sCodePrefix === 'CE' || sDept.includes('civil'))) return true;
    if (dCode === 'MBA' && (sCodePrefix === 'MBA' || sDept.includes('management') || sDept.includes('business'))) return true;

    return isDeptMatch(sub.department, sub.departmentCode, dept);
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
              <span className="text-xs font-bold text-gold uppercase tracking-wider">MANAGEMENT CONTROL &bull; DEPARTMENTS</span>
              <h1 className="text-2xl font-serif font-bold text-navy mt-1">Department Management</h1>
              <p className="text-slate-500 text-xs mt-1">Configure academic departments, assign HODs, faculty, courses & subjects.</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-navy hover:bg-navy-light text-gold font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Department
            </button>
          </div>

          {/* Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {departments.map((dept) => {
              const deptTeachers = users.filter(u => (u.role === 'TEACHER' || u.role === 'STAFF') && isDeptMatch(u.department, u.departmentCode, dept));
              const deptStudents = users.filter(u => u.role === 'STUDENT' && isDeptMatch(u.department, u.departmentCode, dept));
              const deptCourses = (courses || []).filter(c => isDeptMatch(c.department, c.departmentCode, dept));

              return (
                <div key={dept.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between h-full relative">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3 min-h-[92px]">
                      <div className="pr-2">
                        <span className="text-[10px] font-bold text-gold bg-navy px-2 py-0.5 rounded inline-block">{dept.code}</span>
                        <h3 className="text-base font-serif font-bold text-navy mt-1 leading-snug line-clamp-2 min-h-[44px]">{dept.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">HOD: <strong className="text-slate-700">{dept.hod || 'Unassigned'}</strong></p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] flex-shrink-0 ${dept.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {dept.status || 'Active'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 min-h-[36px] leading-relaxed">{dept.description || `Department of ${dept.name}`}</p>
                  </div>

                  <div className="pt-4 space-y-3 mt-auto">
                    <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-xl text-center">
                      <div><span className="text-slate-400 block text-[11px]">Faculty</span> <strong className="text-navy">{deptTeachers.length}</strong></div>
                      <div><span className="text-slate-400 block text-[11px]">Students</span> <strong className="text-navy">{deptStudents.length}</strong></div>
                      <div><span className="text-slate-400 block text-[11px]">Courses</span> <strong className="text-navy">{deptCourses.length}</strong></div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button onClick={() => setViewingDept(dept)} className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1" title="View Details">
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                      <button onClick={() => openEditModal(dept)} className="p-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-bold flex items-center gap-1" title="Edit Department">
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => toggleDeptStatus(dept)} className={`p-2 rounded-lg text-xs font-bold ${dept.status === 'Active' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`} title={dept.status === 'Active' ? 'Deactivate' : 'Activate'}>
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteDept(dept)} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold flex items-center gap-1" title="Delete Department from Database">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* CREATE / EDIT MODALS */}
      {(showAddModal || editingDept) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">{editingDept ? `Edit Department: ${editingDept.name}` : 'Create Department'}</h3>
              <button onClick={() => { setShowAddModal(false); setEditingDept(null); }} className="text-slate-400 hover:text-navy"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={editingDept ? handleSaveEdit : handleSaveAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department Name</label>
                <input required type="text" value={formData.name || ''} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department Code</label>
                  <input required type="text" value={formData.code || ''} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, code: e.target.value })} />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Head of Dept (HOD) *</label>
                  <select 
                    value={formData.hod || ''} 
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-navy focus:border-gold focus:outline-none" 
                    onChange={e => setFormData({ ...formData, hod: e.target.value })}
                  >
                    <option value="Unassigned">Unassigned</option>
                    {teachers.map(t => (
                      <option key={t.id || t.employeeId} value={t.name}>
                        {t.name} &bull; {t.employeeId || 'EMP'} ({t.department || 'General'}) - {t.designation || 'Faculty'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea value={formData.description || ''} className="w-full p-2.5 border rounded-lg" onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => { setShowAddModal(false); setEditingDept(null); }} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-navy text-gold font-bold rounded-lg hover:bg-navy-light">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEPARTMENT DETAILS DRAWER */}
      {viewingDept && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 space-y-4 overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-xs font-bold text-gold uppercase">{viewingDept.code}</span>
                <h3 className="text-xl font-serif font-bold text-navy">{viewingDept.name}</h3>
              </div>
              <button onClick={() => setViewingDept(null)} className="text-slate-400 hover:text-navy"><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                <span className="font-bold text-navy block">Head of Department (HOD): {viewingDept.hod}</span>
                <p className="text-slate-600">{viewingDept.description}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-navy text-sm border-b pb-1">
                  Faculty Staff ({users.filter(u => (u.role === 'TEACHER' || u.role === 'STAFF') && isDeptMatch(u.department, u.departmentCode, viewingDept)).length})
                </h4>
                {users.filter(u => (u.role === 'TEACHER' || u.role === 'STAFF') && isDeptMatch(u.department, u.departmentCode, viewingDept)).map(t => (
                  <div key={t.id} className="p-2 bg-white rounded border flex justify-between">
                    <span className="font-bold text-navy">{t.name}</span>
                    <span className="text-slate-500">{t.designation}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-navy text-sm border-b pb-1">
                  Courses ({courses.filter(c => isDeptMatch(c.department, c.departmentCode, viewingDept)).length})
                </h4>
                <div className="space-y-1">
                  {courses.filter(c => isDeptMatch(c.department, c.departmentCode, viewingDept)).map(c => (
                    <div key={c.id} className="p-2 bg-white rounded border flex justify-between">
                      <span className="font-bold text-navy">{c.name}</span>
                      <span className="text-slate-500">{c.code}</span>
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
