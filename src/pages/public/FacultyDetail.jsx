import React from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useData } from '../../context/DataContext';
import { Mail, Phone, BookOpen } from 'lucide-react';

export const FacultyDetail = () => {
  const { facultyId } = useParams();
  const { users } = useData();

  const faculty = users.find(u => u.id === facultyId || u.employeeId === facultyId) || users.find(u => u.role === 'TEACHER');

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs customItems={[
        { label: 'Academics', to: '/academics' },
        { label: 'Faculty Directory', to: '/academics/faculty' },
        { label: faculty ? faculty.name : 'Faculty Profile', to: '' }
      ]} />

      <div className="bg-navy text-white py-16 border-b-4 border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8">
          {(() => {
            const isFemale = faculty && (faculty.gender === 'Female' || (faculty.name && (faculty.name.includes('Sunita') || faculty.name.includes('Meenakshi') || faculty.name.includes('Priya') || faculty.name.includes('Nidhi') || faculty.name.includes('Rashmi'))));
            const defaultAvatar = isFemale 
              ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
              : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400";
            
            return (
              <img
                src={faculty ? (faculty.avatar || faculty.image || defaultAvatar) : defaultAvatar}
                alt={faculty ? faculty.name : 'Faculty'}
                className="w-32 h-32 rounded-full border-4 border-gold object-cover shadow-2xl"
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
            );
          })()}
          <div>
            <span className="bg-gold text-navy-dark text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
              {faculty.department}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-50 mt-2">
              {faculty.name}
            </h1>
            <p className="text-gold text-sm font-semibold mt-1">{faculty.designation}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-2xl font-serif font-bold text-navy mb-4">Academic Biography</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {faculty.name} is a distinguished faculty member at Kalpanaaa Education specializing in {faculty.specialization || 'computer science and technical research'}. With numerous publications in high-impact international journals, {faculty.name} mentors postgraduate research scholars and leads state-of-the-art laboratory experiments.
              </p>

              <h4 className="text-lg font-serif font-bold text-navy mb-3">Qualifications & Research Focus</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
                <div>Academic Qualification: <strong>{faculty.qualification}</strong></div>
                <div>Primary Research Focus: <strong>{faculty.specialization}</strong></div>
                <div>Employee Code: <strong>{faculty.employeeId}</strong></div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-2xl font-serif font-bold text-navy mb-4">Assigned Courses & Classes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {faculty.assignedSubjects && faculty.assignedSubjects.map((subj, idx) => (
                  <div key={idx} className="p-3.5 bg-amber-50 border border-gold/30 rounded-xl flex items-center">
                    <BookOpen className="w-4 h-4 text-gold mr-2.5 flex-shrink-0" />
                    <span className="text-xs font-semibold text-navy">{subj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-navy text-white p-6 rounded-2xl shadow-lg border-t-4 border-gold space-y-4">
              <h4 className="text-xl font-serif font-bold text-amber-100 mb-2">Faculty Contact</h4>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gold mr-2" />
                  <span>{faculty.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gold mr-2" />
                  <span>{faculty.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
