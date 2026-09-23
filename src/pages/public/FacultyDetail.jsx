import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useData } from '../../context/DataContext';
import { Mail, Phone, BookOpen, Award, GraduationCap, ArrowLeft, Calendar, Building, Layers } from 'lucide-react';

export const FacultyDetail = () => {
  const { facultyId } = useParams();
  const { users = [], courses = [], subjects = [], facultyClassAssignments = [] } = useData();

  const searchParam = (facultyId || '').toLowerCase().trim();

  // Find matching faculty by id, employeeId, or name
  const faculty = users.find(u => 
    (u.role === 'TEACHER' || u.designation) && (
      (u.id && u.id.toLowerCase() === searchParam) ||
      (u.employeeId && u.employeeId.toLowerCase() === searchParam) ||
      (u.name && u.name.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(searchParam))
    )
  ) || users.find(u => u.role === 'TEACHER');

  if (!faculty) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <GraduationCap className="w-16 h-16 text-slate-400 mx-auto" />
          <h2 className="text-2xl font-serif font-bold text-navy">Faculty Profile Not Found</h2>
          <p className="text-slate-600 text-sm">The faculty member you are looking for may have been updated or moved.</p>
          <Link
            to="/faculty"
            className="inline-flex items-center px-4 py-2 bg-navy text-white text-xs font-bold uppercase rounded-lg hover:bg-navy-light transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Faculty Directory
          </Link>
        </div>
      </div>
    );
  }

  // Find assigned classes and courses for this faculty member
  const assignedClasses = (facultyClassAssignments || []).filter(fca => {
    if (!fca) return false;
    const fEmp = (faculty.employeeId || '').toLowerCase();
    const fId = (faculty.id || '').toLowerCase();
    const fName = (faculty.name || '').toLowerCase();

    return (
      (fca.teacherId && fca.teacherId.toLowerCase() === fEmp) ||
      (fca.teacherId && fca.teacherId.toLowerCase() === fId) ||
      (fca.facultyId && fca.facultyId.toLowerCase() === fEmp) ||
      (fca.facultyId && fca.facultyId.toLowerCase() === fId) ||
      (fca.teacherName && fName && fca.teacherName.toLowerCase() === fName) ||
      (fca.facultyName && fName && fca.facultyName.toLowerCase() === fName) ||
      (fca.teacherName && fName && (fca.teacherName.toLowerCase().includes(fName) || fName.includes(fca.teacherName.toLowerCase())))
    );
  });

  const assignedCoursesList = (courses || subjects || []).filter(c => {
    if (!c) return false;
    const fEmp = (faculty.employeeId || '').toLowerCase();
    const fId = (faculty.id || '').toLowerCase();
    const fName = (faculty.name || '').toLowerCase();

    return (
      (c.assignedTeacherId && (c.assignedTeacherId.toLowerCase() === fEmp || c.assignedTeacherId.toLowerCase() === fId)) ||
      (c.assignedTeacherName && fName && (c.assignedTeacherName.toLowerCase() === fName || c.assignedTeacherName.toLowerCase().includes(fName) || fName.includes(c.assignedTeacherName.toLowerCase())))
    );
  });

  // Derive unique combined list of subjects/classes
  const classMap = new Map();
  
  assignedClasses.forEach(item => {
    const key = `${item.subjectCode}-${item.classId || item.semester}`;
    if (!classMap.has(key)) {
      classMap.set(key, {
        id: item.id || item.assignmentId,
        subjectCode: item.subjectCode,
        subjectName: item.subjectName,
        department: item.department,
        departmentCode: item.departmentCode,
        year: item.year || 'Academic Year',
        semester: item.semester || 'Current Semester',
        section: item.section || 'A',
        classId: item.classId || `${item.departmentCode || 'DEPT'}-${item.semester}-A`
      });
    }
  });

  assignedCoursesList.forEach(c => {
    const key = `${c.code}-${c.semester || 'SEM'}`;
    if (!classMap.has(key)) {
      classMap.set(key, {
        id: c.id,
        subjectCode: c.code,
        subjectName: c.name,
        department: c.department,
        departmentCode: c.departmentCode,
        year: c.year || 'Academic Year',
        semester: c.semester || 'Current Semester',
        section: 'A',
        classId: `${c.departmentCode || 'DEPT'}-${(c.semester || 'SEM').toUpperCase().replace(/\s/g, '')}-A`
      });
    }
  });

  const combinedClasses = Array.from(classMap.values());

  const isFemale = faculty.gender === 'Female' || (faculty.name && (faculty.name.includes('Sunita') || faculty.name.includes('Meenakshi') || faculty.name.includes('Priya') || faculty.name.includes('Nidhi') || faculty.name.includes('Radhika') || faculty.name.includes('Ananya') || faculty.name.includes('Kavita') || faculty.name.includes('Neha')));
  const defaultAvatar = isFemale 
    ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
    : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400";

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Breadcrumbs customItems={[
        { label: 'Academics', to: '/academics' },
        { label: 'Faculty Directory', to: '/faculty' },
        { label: faculty.name, to: '' }
      ]} />

      {/* Hero Header */}
      <div className="bg-navy text-white py-16 border-b-4 border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8">
          <img
            src={faculty.avatar || faculty.photoUrl || faculty.image || defaultAvatar}
            alt={faculty.name}
            className="w-32 h-32 rounded-full border-4 border-gold object-cover shadow-2xl"
            onError={(e) => { e.target.src = defaultAvatar; }}
          />
          <div className="text-center md:text-left">
            <span className="bg-gold text-navy-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              {faculty.department}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-50 mt-2">
              {faculty.name}
            </h1>
            <p className="text-gold text-sm font-semibold mt-1">{faculty.designation}</p>
            <p className="text-slate-300 text-xs mt-1">Employee Code: <span className="font-num text-white font-bold">{faculty.employeeId || faculty.id}</span></p>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-2xl font-serif font-bold text-navy mb-4">Academic Biography</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-serif">
                {faculty.bio || `${faculty.name} is a distinguished faculty member at Kalpanaaa Education specializing in ${faculty.specialization || 'advanced engineering and scientific innovation'}. With extensive teaching experience and research publications, ${faculty.name} mentors undergraduate and postgraduate scholars and oversees departmental academic initiatives.`}
              </p>

              <h4 className="text-lg font-serif font-bold text-navy mb-3">Qualifications & Research Focus</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Academic Qualification</span>
                  <strong className="text-navy text-sm font-semibold">{faculty.qualification || 'Ph.D. Scholar'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Primary Research Focus</span>
                  <strong className="text-navy text-sm font-semibold">{faculty.specialization || 'Engineering & Technology'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Teaching Experience</span>
                  <strong className="text-navy text-sm font-semibold">{faculty.experience || `${faculty.experienceYears || 5} Years`}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Department Affiliation</span>
                  <strong className="text-navy text-sm font-semibold">{faculty.department}</strong>
                </div>
              </div>
            </div>

            {/* Assigned Courses & Classes */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-serif font-bold text-navy">Assigned Courses & Classes</h3>
                <span className="text-xs bg-gold/10 text-gold-dark font-bold px-2.5 py-1 rounded-full border border-gold/30">
                  {combinedClasses.length} Active Courses
                </span>
              </div>

              {combinedClasses.length === 0 ? (
                <p className="text-slate-500 text-xs">No active courses assigned for the current academic session.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {combinedClasses.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-gold/40 rounded-xl transition flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 bg-navy text-gold text-[10px] font-bold rounded">
                            {item.subjectCode}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {item.year}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-navy group-hover:text-gold-dark transition-colors mb-1">
                          {item.subjectName}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Cohort: <strong className="text-slate-700">{item.classId || `${item.departmentCode || 'DEPT'}-${item.semester}`}</strong> ({item.semester}, Sec {item.section || 'A'})
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center text-[11px] text-slate-600">
                        <BookOpen className="w-3.5 h-3.5 text-gold mr-1.5 flex-shrink-0" />
                        <span>Core Theory & Lab Practicum</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Contact */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-navy text-white p-6 rounded-2xl shadow-lg border-t-4 border-gold space-y-4">
              <h4 className="text-xl font-serif font-bold text-amber-100 mb-2">Faculty Contact</h4>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                  <span className="truncate">{faculty.email || `${(faculty.employeeId || 'fac').toLowerCase()}@kalpanaaa.edu`}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                  <span>{faculty.phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex items-center">
                  <Building className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                  <span>{faculty.department} Block</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link
                  to="/faculty"
                  className="block text-center w-full py-2 bg-white/10 hover:bg-white/20 text-gold font-bold text-xs rounded-lg transition"
                >
                  ← Back to Faculty Directory
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
