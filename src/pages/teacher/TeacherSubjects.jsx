import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { Upload, Plus, CheckCircle2, Award, Clock, BookOpen, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeacherSubjects = () => {
  const { currentUser } = useAuth();
  const { subjects = [], facultyClassAssignments = [], users = [], addStudyMaterial } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
  const [materialTitle, setMaterialTitle] = useState('');
  const [fileName, setFileName] = useState('');

  if (!currentUser) return null;

  const currentFacultyId = currentUser.employeeId || currentUser.username || currentUser.id || 'EMP-101';
  const teacherName = currentUser.name || 'Faculty Member';
  const teacherDept = currentUser.department || 'Computer Science and Engineering';

  // 1. Get assignments from faculty_class_assignments
  const myAssignments = facultyClassAssignments.filter(
    fca => fca.facultyId === currentFacultyId || fca.facultyName === teacherName
  );

  // 2. Also match from subjects master list
  const assignedSubsFromMaster = subjects.filter(s =>
    s.assignedTeacherId === currentFacultyId ||
    s.assignedTeacherId === currentUser.id ||
    s.assignedTeacherName === teacherName ||
    (Array.isArray(currentUser.assignedSubjects) && currentUser.assignedSubjects.includes(s.code))
  );

  // Combine and deduplicate
  const combinedSubjectsMap = new Map();

  myAssignments.forEach(fca => {
    const subObj = subjects.find(s => s.code === fca.subjectCode) || {};
    const cohortStudents = users.filter(u =>
      u.role === 'STUDENT' &&
      (u.departmentCode === fca.departmentCode || u.department === fca.departmentName || (u.department && u.department.includes(fca.departmentCode))) &&
      (u.year === fca.year || u.semester === fca.semester)
    );
    const count = cohortStudents.length > 0 ? cohortStudents.length : 10;
    const existingMaterials = subObj.materials || ["Lecture_Notes_Unit1.pdf", "Syllabus_Overview.pdf"];

    combinedSubjectsMap.set(fca.subjectCode, {
      code: fca.subjectCode,
      name: fca.subjectName,
      department: fca.departmentName || teacherDept,
      departmentCode: fca.departmentCode,
      semester: fca.semester || '6th Semester',
      year: fca.year || '3rd Year',
      section: fca.section || 'Sec A',
      credits: subObj.credits || 4,
      studentsCount: count,
      materials: existingMaterials
    });
  });

  assignedSubsFromMaster.forEach(s => {
    if (!combinedSubjectsMap.has(s.code)) {
      const cohortStudents = users.filter(u =>
        u.role === 'STUDENT' &&
        (u.department === s.department || u.departmentCode === s.departmentCode || (s.code && u.departmentCode && s.code.startsWith(u.departmentCode))) &&
        (u.semester === s.semester || u.year === s.year)
      );
      const count = cohortStudents.length > 0 ? cohortStudents.length : 10;
      const existingMaterials = s.materials || ["Lecture_Notes_Unit1.pdf"];

      combinedSubjectsMap.set(s.code, {
        code: s.code,
        name: s.name,
        department: s.department || teacherDept,
        departmentCode: s.departmentCode,
        semester: s.semester || '6th Semester',
        year: s.year || '3rd Year',
        section: 'Sec A',
        credits: s.credits || 4,
        studentsCount: count,
        materials: existingMaterials
      });
    }
  });

  // If no assignments found for new user, fall back to teacher's department subjects
  if (combinedSubjectsMap.size === 0) {
    const deptSubs = subjects.filter(s =>
      s.department === teacherDept ||
      (currentUser.departmentCode && s.code.startsWith(currentUser.departmentCode))
    ).slice(0, 3);

    deptSubs.forEach(s => {
      combinedSubjectsMap.set(s.code, {
        code: s.code,
        name: s.name,
        department: s.department || teacherDept,
        departmentCode: s.departmentCode,
        semester: s.semester || '6th Semester',
        year: s.year || '3rd Year',
        section: 'Sec A',
        credits: s.credits || 4,
        studentsCount: 10,
        materials: s.materials || ["Lecture_Notes_Unit1.pdf"]
      });
    });
  }

  const assignedSubjectsList = Array.from(combinedSubjectsMap.values());

  const handleOpenUpload = (subCode) => {
    setSelectedSubjectCode(subCode || (assignedSubjectsList[0]?.code || ''));
    setMaterialTitle('');
    setFileName('');
    setShowUploadModal(true);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedSubjectCode) return;

    const uploadedDocName = addStudyMaterial ? addStudyMaterial(selectedSubjectCode, materialTitle, fileName, currentUser) : (fileName || 'Material.pdf');

    setShowUploadModal(false);
    setToastMsg(`Study Material "${materialTitle || uploadedDocName}" uploaded successfully for ${selectedSubjectCode}! Saved to database & published to Student Academics.`);
    setTimeout(() => setToastMsg(''), 5000);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans relative">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto font-sans">
          
          {toastMsg && (
            <div className="p-4 bg-emerald-500 text-white rounded-xl shadow-lg flex items-center justify-between font-sans text-xs font-bold animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>{toastMsg}</span>
              </div>
              <button onClick={() => setToastMsg('')} className="text-white hover:text-slate-200 text-lg">&times;</button>
            </div>
          )}

          {/* Header */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-navy text-xs font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded border border-gold/30">
                  ASSIGNED ACADEMIC SUBJECTS &bull; {teacherDept}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-navy mt-2 tracking-tight">
                  My Teaching Subjects & Syllabus Hub
                </h1>
                <p className="font-serif text-slate-500 text-xs sm:text-sm mt-1">
                  Upload study notes, create assignments, manage attendance, and enter internal assessment marks.
                </p>
              </div>

              <button
                onClick={() => handleOpenUpload('')}
                className="inline-flex items-center justify-center bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs px-5 py-3 rounded-xl shadow uppercase tracking-wider flex-shrink-0"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Study Material
              </button>
            </div>
          </div>

          {/* SUBJECT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignedSubjectsList.map((sub) => (
              <div key={sub.code} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-num font-bold text-gold bg-navy px-2.5 py-0.5 rounded">{sub.code}</span>
                    <h3 className="text-lg font-bold text-navy mt-1">{sub.name}</h3>
                    <span className="font-serif text-xs text-slate-500">{sub.semester} &bull; {sub.section}</span>
                  </div>
                  <span className="text-xs font-num font-bold text-navy bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    {sub.credits} Credits
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold block text-[10px] uppercase">Department</span>
                    <span className="font-bold text-slate-800 mt-0.5 block truncate">{sub.department}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold block text-[10px] uppercase">Enrolled Students</span>
                    <span className="font-num font-bold text-navy mt-0.5 block">{sub.studentsCount} Students</span>
                  </div>
                </div>

                {/* Published Study Resources */}
                {sub.materials && sub.materials.length > 0 && (
                  <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-gold-hover" /> Published Course Material:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sub.materials.map((mat, idx) => (
                        <span key={idx} className="text-[11px] bg-white border border-slate-300 text-navy px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                          <FileText className="w-3 h-3 text-slate-400" /> {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap gap-2">
                  <Link
                    to="/staff/attendance"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center border border-slate-200"
                  >
                    <Clock className="w-3.5 h-3.5 mr-1 text-navy" />
                    Attendance
                  </Link>

                  <Link
                    to="/staff/assignments"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center border border-slate-200"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1 text-gold-hover" />
                    Create Assignment
                  </Link>

                  <Link
                    to="/staff/marks"
                    className="px-3 py-1.5 bg-navy text-white hover:bg-navy-light rounded-lg text-xs font-bold flex items-center shadow-sm"
                  >
                    <Award className="w-3.5 h-3.5 mr-1 text-gold" />
                    Enter Internal Marks
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>

      {/* UPLOAD STUDY MATERIAL MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-navy">Upload Study Material to Students</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 text-lg">&times;</button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Select Subject *</label>
                <select
                  value={selectedSubjectCode}
                  onChange={(e) => setSelectedSubjectCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy"
                >
                  {assignedSubjectsList.map(s => (
                    <option key={s.code} value={s.code}>
                      {s.code} - {s.name} ({s.semester})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Material Title *</label>
                <input
                  type="text"
                  required
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  placeholder="e.g. Unit I Lecture Notes & Slide Deck"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Upload File (PDF / PPTX) *</label>
                <label className="p-4 border-2 border-dashed border-slate-300 hover:border-gold rounded-xl text-center bg-slate-50 text-slate-500 cursor-pointer flex flex-col items-center block transition-colors">
                  <Upload className="w-6 h-6 text-gold mb-1" />
                  <span className="text-xs font-bold text-slate-700">
                    {fileName ? fileName : 'Click to select document'}
                  </span>
                  <span className="text-[10px] text-slate-400">PDF, PPTX, or DOCX (Max 25MB)</span>
                  <input
                    type="file"
                    accept=".pdf,.pptx,.ppt,.docx,.doc"
                    onChange={(e) => e.target.files[0] && setFileName(e.target.files[0].name)}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-gold hover:bg-gold-hover text-navy-dark rounded-xl font-bold uppercase tracking-wider shadow">
                  Publish Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
