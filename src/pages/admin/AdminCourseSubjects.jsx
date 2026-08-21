import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { 
  ArrowLeft, Plus, Edit, Trash2, Calendar, Clock, MapPin, UserCheck, BookOpen, X, CheckCircle 
} from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PERIODS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'];

export const AdminCourseSubjects = () => {
  const { courseId } = useParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const { courses = [], departments = [], users = [] } = useData();

  const [course, setCourse] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [timetableSlots, setTimetableSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectForm, setSubjectForm] = useState({});

  const [showSlotModal, setShowSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [slotForm, setSlotForm] = useState({});

  const teachers = users.filter(u => u.role === 'TEACHER' || u.role === 'STAFF');

  const getApiBase = () => {
    if (import.meta.env.VITE_API_BASE) return import.meta.env.VITE_API_BASE;
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return 'https://collegemanagement-production.up.railway.app/api';
    }
    return 'http://localhost:5000/api';
  };
  const API_BASE = getApiBase();

  const loadData = async () => {
    setLoading(true);
    try {
      // Find course details
      const foundCourse = courses.find(c => c.id === courseId || c.code === courseId) || {
        id: courseId,
        code: courseId,
        name: 'Academic Course',
        department: 'Engineering',
        semester: 'Semester 1',
        credits: 4
      };
      setCourse(foundCourse);

      // Fetch subjects for this course
      const subRes = await fetch(`${API_BASE}/courses/${foundCourse.id || courseId}/subjects`);
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubjects(subData);
      }

      // Fetch timetable for this course
      const ttRes = await fetch(`${API_BASE}/timetable?courseId=${foundCourse.id || courseId}`);
      if (ttRes.ok) {
        const ttData = await ttRes.json();
        setTimetableSlots(ttData);
      }
    } catch (e) {
      console.warn('Failed to fetch course subjects/timetable from backend:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId, courses]);

  // Subject Handlers
  const openAddSubjectModal = () => {
    setSubjectForm({
      name: '',
      code: `${course?.code || 'SUB'}-${subjects.length + 101}`,
      courseId: course?.id || courseId,
      department: course?.department || 'Computer Science & Engineering',
      semester: course?.semester || 'Semester 1',
      credits: 4,
      assignedTeacherId: teachers[0]?.employeeId || teachers[0]?.id || '',
      assignedTeacherName: teachers[0]?.name || 'Unassigned Faculty'
    });
    setShowAddSubjectModal(true);
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(editingSubject);
      const url = isEdit ? `${API_BASE}/subjects/${editingSubject.id}` : `${API_BASE}/subjects`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...subjectForm,
          courseId: course?.id || courseId
        })
      });

      if (res.ok) {
        alert(`Subject ${subjectForm.name} saved successfully!`);
        setShowAddSubjectModal(false);
        setEditingSubject(null);
        loadData();
      } else {
        const err = await res.json();
        alert(`Failed to save subject: ${err.message || err.error}`);
      }
    } catch (err) {
      alert(`Error saving subject: ${err.message}`);
    }
  };

  const handleDeleteSubject = async (sub) => {
    if (!window.confirm(`Delete subject "${sub.name}" (${sub.code})?`)) return;
    try {
      const res = await fetch(`${API_BASE}/subjects/${sub.id || sub.code}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Subject deleted.');
        loadData();
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Timetable Handlers
  const openAddSlotModal = (subObj = null) => {
    const sub = subObj || subjects[0] || {};
    setSlotForm({
      subjectId: sub.id || 'sub-1',
      subjectCode: sub.code || course?.code || 'CS-101',
      subjectName: sub.name || 'Core Subject',
      courseId: course?.id || courseId,
      department: course?.department || 'Computer Science & Engineering',
      semester: course?.semester || 'Semester 1',
      section: 'A',
      teacherId: sub.assignedTeacherId || teachers[0]?.employeeId || '',
      teacherName: sub.assignedTeacherName || teachers[0]?.name || 'Faculty Member',
      dayOfWeek: 'Mon',
      period: 'P1',
      startTime: '09:00 AM',
      endTime: '10:00 AM',
      room: 'Room 101'
    });
    setShowSlotModal(true);
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(editingSlot);
      const url = isEdit ? `${API_BASE}/timetable/${editingSlot.id}` : `${API_BASE}/timetable`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...slotForm,
          courseId: course?.id || courseId
        })
      });

      if (res.ok) {
        alert('Timetable slot saved successfully!');
        setShowSlotModal(false);
        setEditingSlot(null);
        loadData();
      } else {
        const err = await res.json();
        alert(`Failed to save slot: ${err.message || err.error}`);
      }
    } catch (err) {
      alert(`Error saving slot: ${err.message}`);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Remove this timetable slot?')) return;
    try {
      const res = await fetch(`${API_BASE}/timetable/${slotId}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      alert(`Error deleting slot: ${err.message}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-serif">
            <Link to="/admin/courses" className="hover:text-navy font-bold flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Institutional Courses Master
            </Link>
            <span>/</span>
            <span className="text-navy font-bold">{course?.name} ({course?.code})</span>
          </div>

          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-navy uppercase tracking-wider bg-gold/20 px-3 py-1 rounded border border-gold/30">
                COURSE SUBJECTS & TIMETABLE LINKAGE
              </span>
              <h1 className="text-2xl font-bold text-navy mt-2 tracking-tight">
                {course?.name} <span className="text-slate-400 font-num">({course?.code})</span>
              </h1>
              <p className="text-slate-500 text-xs mt-1 font-serif">
                Department: <strong>{course?.department}</strong> &bull; Semester: <strong>{course?.semester}</strong> &bull; Credits: <strong>{course?.credits || 4}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={openAddSubjectModal}
                className="bg-navy hover:bg-navy-light text-gold font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Subject to Course
              </button>
              <button
                onClick={() => openAddSlotModal()}
                className="bg-gold hover:bg-gold-hover text-navy font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shadow flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" /> Schedule Timetable Slot
              </button>
            </div>
          </div>

          {/* Section 1: Subjects List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <h2 className="text-lg font-bold text-navy tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gold" />
                Course Subjects Roster ({subjects.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400 font-serif">Loading course subjects...</div>
            ) : subjects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy text-gold uppercase font-bold tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Code</th>
                      <th className="p-3">Subject Name</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Semester</th>
                      <th className="p-3">Credits</th>
                      <th className="p-3">Assigned Faculty</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {subjects.map((sub) => (
                      <tr key={sub.id || sub.code} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-navy font-num">{sub.code}</td>
                        <td className="p-3 font-bold text-slate-800">{sub.name}</td>
                        <td className="p-3 text-slate-600">{sub.department}</td>
                        <td className="p-3 font-semibold text-navy">{sub.semester}</td>
                        <td className="p-3 font-bold text-slate-700">{sub.credits} Credits</td>
                        <td className="p-3 font-semibold text-slate-800">
                          {sub.assignedTeacherName || 'Unassigned Faculty'}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => { setEditingSubject(sub); setSubjectForm({ ...sub }); setShowAddSubjectModal(true); }}
                              className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg"
                              title="Edit Subject"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openAddSlotModal(sub)}
                              className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg"
                              title="Schedule Slot"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSubject(sub)}
                              className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg"
                              title="Delete Subject"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 font-serif bg-slate-50 rounded-xl border border-dashed border-slate-300">
                No subjects added yet for this course. Click "Add Subject to Course" above to create one.
              </div>
            )}
          </div>

          {/* Section 2: Timetable Master Grid */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <h2 className="text-lg font-bold text-navy tracking-tight flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gold" />
                  Weekly Timetable Slots ({timetableSlots.length})
                </h2>
                <p className="text-slate-500 text-xs font-serif mt-0.5">
                  Single source of truth for student & teacher dashboards
                </p>
              </div>
            </div>

            {timetableSlots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DAYS.map(day => {
                  const daySlots = timetableSlots.filter(s => s.dayOfWeek === day);
                  if (daySlots.length === 0) return null;
                  return (
                    <div key={day} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="font-bold text-navy text-xs uppercase tracking-wider">{day} Schedule</span>
                        <span className="text-[10px] font-bold bg-navy text-gold px-2 py-0.5 rounded">{daySlots.length} Classes</span>
                      </div>

                      <div className="space-y-2">
                        {daySlots.map(slot => (
                          <div key={slot.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between space-y-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[10px] font-bold text-gold bg-navy px-1.5 py-0.5 rounded font-num">{slot.period} &bull; {slot.startTime} - {slot.endTime}</span>
                                <h4 className="font-bold text-navy text-xs mt-1">{slot.subjectCode} - {slot.subjectName}</h4>
                              </div>
                              <button
                                onClick={() => handleDeleteSlot(slot.id)}
                                className="text-slate-400 hover:text-rose-600 p-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 font-serif pt-1 border-t">
                              <span>Room: <strong>{slot.room || 'TBD'}</strong> (Sec {slot.section})</span>
                              <span>{slot.teacherName || 'Faculty'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 font-serif bg-slate-50 rounded-xl border border-dashed border-slate-300">
                No weekly timetable slots scheduled yet for this course. Click "Schedule Timetable Slot" to add a period.
              </div>
            )}
          </div>

        </main>
      </div>

      {/* ADD / EDIT SUBJECT MODAL */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">
                {editingSubject ? `Edit Subject: ${editingSubject.code}` : `Add Subject to ${course?.code}`}
              </h3>
              <button onClick={() => { setShowAddSubjectModal(false); setEditingSubject(null); }} className="text-slate-400 hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject Name</label>
                <input
                  required
                  type="text"
                  value={subjectForm.name || ''}
                  placeholder="e.g. Operating Systems"
                  className="w-full p-2.5 border rounded-lg"
                  onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Code</label>
                  <input
                    required
                    type="text"
                    value={subjectForm.code || ''}
                    placeholder="e.g. CSE-401"
                    className="w-full p-2.5 border rounded-lg font-num"
                    onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={subjectForm.semester || course?.semester || 'Semester 1'}
                    className="w-full p-2.5 border rounded-lg"
                    onChange={e => setSubjectForm({ ...subjectForm, semester: e.target.value })}
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={subjectForm.credits || 4}
                    className="w-full p-2.5 border rounded-lg font-num"
                    onChange={e => setSubjectForm({ ...subjectForm, credits: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Teacher</label>
                  <select
                    value={subjectForm.assignedTeacherId || ''}
                    className="w-full p-2.5 border rounded-lg"
                    onChange={e => {
                      const tch = teachers.find(t => t.employeeId === e.target.value || t.id === e.target.value);
                      setSubjectForm({
                        ...subjectForm,
                        assignedTeacherId: e.target.value,
                        assignedTeacherName: tch ? tch.name : 'Unassigned Faculty'
                      });
                    }}
                  >
                    <option value="">Unassigned Faculty</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.employeeId || t.id}>{t.name} ({t.departmentCode || t.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setShowAddSubjectModal(false); setEditingSubject(null); }}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-navy text-gold font-bold rounded-lg hover:bg-navy-light uppercase tracking-wider"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT TIMETABLE SLOT MODAL */}
      {showSlotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-navy">Schedule Timetable Slot</h3>
              <button onClick={() => { setShowSlotModal(false); setEditingSlot(null); }} className="text-slate-400 hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={slotForm.subjectCode || ''}
                  className="w-full p-2.5 border rounded-lg font-bold"
                  onChange={e => {
                    const sub = subjects.find(s => s.code === e.target.value);
                    setSlotForm({
                      ...slotForm,
                      subjectId: sub?.id || slotForm.subjectId,
                      subjectCode: e.target.value,
                      subjectName: sub?.name || slotForm.subjectName,
                      teacherId: sub?.assignedTeacherId || slotForm.teacherId,
                      teacherName: sub?.assignedTeacherName || slotForm.teacherName
                    });
                  }}
                >
                  {subjects.map(s => (
                    <option key={s.id || s.code} value={s.code}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Day of Week</label>
                  <select
                    value={slotForm.dayOfWeek || 'Mon'}
                    className="w-full p-2.5 border rounded-lg"
                    onChange={e => setSlotForm({ ...slotForm, dayOfWeek: e.target.value })}
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Period</label>
                  <select
                    value={slotForm.period || 'P1'}
                    className="w-full p-2.5 border rounded-lg"
                    onChange={e => setSlotForm({ ...slotForm, period: e.target.value })}
                  >
                    {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <select
                    value={slotForm.section || 'A'}
                    className="w-full p-2.5 border rounded-lg"
                    onChange={e => setSlotForm({ ...slotForm, section: e.target.value })}
                  >
                    <option value="A">Sec A</option>
                    <option value="B">Sec B</option>
                    <option value="C">Sec C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={slotForm.startTime || '09:00 AM'}
                    className="w-full p-2.5 border rounded-lg font-num"
                    onChange={e => setSlotForm({ ...slotForm, startTime: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={slotForm.endTime || '10:00 AM'}
                    className="w-full p-2.5 border rounded-lg font-num"
                    onChange={e => setSlotForm({ ...slotForm, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room / Venue</label>
                  <input
                    type="text"
                    value={slotForm.room || 'Room 101'}
                    className="w-full p-2.5 border rounded-lg font-num"
                    onChange={e => setSlotForm({ ...slotForm, room: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Teacher</label>
                  <select
                    value={slotForm.teacherId || ''}
                    className="w-full p-2.5 border rounded-lg"
                    onChange={e => {
                      const tch = teachers.find(t => t.employeeId === e.target.value || t.id === e.target.value);
                      setSlotForm({
                        ...slotForm,
                        teacherId: e.target.value,
                        teacherName: tch ? tch.name : 'Faculty Member'
                      });
                    }}
                  >
                    <option value="">Unassigned</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.employeeId || t.id}>{t.name} ({t.departmentCode || t.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setShowSlotModal(false); setEditingSlot(null); }}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-navy text-gold font-bold rounded-lg hover:bg-navy-light uppercase tracking-wider"
                >
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
