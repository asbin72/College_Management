import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useData } from '../../context/DataContext';
import { CheckCircle2, Phone, Mail, Building, Award, Users, BookOpen } from 'lucide-react';

export const DepartmentDetail = () => {
  const { deptId, department: legacyDept } = useParams();
  const { departments = [], users = [] } = useData();

  const searchParam = (deptId || legacyDept || '').toLowerCase();
  const dept = departments.find(d => 
    (d.id && d.id.toLowerCase() === searchParam) || 
    (d.code && d.code.toLowerCase() === searchParam) ||
    (d.name && d.name.toLowerCase().includes(searchParam))
  ) || departments[0] || {
    id: 'd1',
    code: 'CSE',
    name: 'Computer Science & Engineering',
    hod: 'Dr. Rajesh Sharma',
    description: 'Pioneering research in Artificial Intelligence, Neural Networks, Cyber Security, and Cloud Architecture.',
    email: 'hod.cse@kalpanaaa.edu',
    phone: '+91 98765 43210'
  };

  const facultyCount = users.filter(u => u && (u.role === 'TEACHER' || u.role === 'STAFF') && (u.departmentCode === dept.code || u.department === dept.name)).length;
  const studentCount = users.filter(u => u && (u.role === 'STUDENT' || u.studentId) && (u.departmentCode === dept.code || u.department === dept.name)).length;

  const programs = dept.programsOffered || [
    dept.name.includes('Management') ? 'Master of Business Administration (MBA)' : `B.Tech in ${dept.name}`,
    dept.name.includes('Management') ? 'Executive PGDM in Business Analytics' : `M.Tech in Advanced ${dept.name}`,
    `Ph.D. & Doctoral Research in ${dept.name}`
  ];

  const facilities = dept.facilities || [
    'Advanced High-Performance Research Laboratory',
    'Center for Industry-Academia Collaborative Innovation',
    'Specialized Digital Prototyping & Benchmark Testing Suites',
    'Institutional Smart Lecture Theatres & Video Conferencing'
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Breadcrumbs customItems={[
        { label: 'Academics', to: '/academics' },
        { label: 'Departments', to: '/academics/departments' },
        { label: dept.name, to: '' }
      ]} />

      <div className="bg-navy text-white py-16 border-b-4 border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-gold/30">
            DEPARTMENT OF {dept.code}
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-50">
            {dept.name}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-3 leading-relaxed font-serif">
            {dept.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-2xl font-serif font-bold text-navy mb-4">Departmental Overview</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-serif">
                The Department of {dept.name} provides rigorous education, advanced laboratory exposure, and research opportunities. Our curriculum is aligned with national accreditation bodies (AICTE, NBA, NAAC A++) and corporate engineering requirements.
              </p>

              <div className="grid grid-cols-2 gap-4 py-3 bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 text-xs text-slate-700 font-sans">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gold mr-2" />
                  <span><strong className="font-num text-navy text-sm font-bold">{facultyCount}</strong> Faculty Members</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-gold mr-2" />
                  <span><strong className="font-num text-navy text-sm font-bold">{studentCount}</strong> Enrolled Students</span>
                </div>
              </div>

              <h4 className="text-lg font-serif font-bold text-navy mb-3">Academic Programs Offered</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {programs.map((prog, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center">
                    <Award className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-navy">{prog}</span>
                  </div>
                ))}
              </div>

              <h4 className="text-lg font-serif font-bold text-navy mb-3">Specialized Research & Lab Facilities</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 font-sans">
                {facilities.map((fac, idx) => (
                  <li key={idx} className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
                    <span>{fac}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Department Contact Sidebar */}
          <div className="lg:col-span-4 space-y-6 font-sans">
            <div className="bg-navy text-white p-6 rounded-2xl shadow-lg border-t-4 border-gold">
              <h4 className="text-xl font-serif font-bold text-amber-100 mb-4">Department Office</h4>
              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-center">
                  <Building className="w-4 h-4 text-gold mr-2.5 flex-shrink-0" />
                  <span>Head of Dept: <strong className="text-white">{dept.hod}</strong></span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gold mr-2.5 flex-shrink-0" />
                  <span>{dept.email || `hod.${dept.code.toLowerCase()}@kalpanaaa.edu`}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gold mr-2.5 flex-shrink-0" />
                  <span>{dept.phone || '+91 98765 43210'}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <Link to="/admissions/application" className="block text-center bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs py-3 rounded-xl uppercase tracking-wider shadow">
                  APPLY FOR THIS DEPT
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

