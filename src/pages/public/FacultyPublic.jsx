import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useData } from '../../context/DataContext';
import { Search, BookOpen, Award } from 'lucide-react';

export const FacultyPublic = () => {
  const { users = [], departments = [] } = useData();
  const teachers = users.filter(u => u.role === 'TEACHER');

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(search.toLowerCase()) || 
      (t.specialization && t.specialization.toLowerCase().includes(search.toLowerCase())) ||
      (t.employeeId && t.employeeId.toLowerCase().includes(search.toLowerCase()));
    
    const matchesDept = deptFilter === 'ALL' || (t.department && t.department.toLowerCase().includes(deptFilter.toLowerCase()));
    return matchesSearch && matchesDept;
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Breadcrumbs />

      {/* Hero Header */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/30">
            DISTINGUISHED SCHOLARS
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Meet Our Faculty
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-serif">
            Our professors and researchers are recognized leaders in technology, management, and scientific innovation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7 relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search faculty by name, employee ID, or research specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-gold"
              />
            </div>
            <div className="md:col-span-5">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:outline-none focus:border-gold"
              >
                <option value="ALL">All Academic Departments ({departments.length})</option>
                {departments.map(d => (
                  <option key={d.id || d.code} value={d.name}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredTeachers.map((t) => {
            const isFemale = t.gender === 'Female' || (t.name && (t.name.includes('Sunita') || t.name.includes('Meenakshi') || t.name.includes('Priya') || t.name.includes('Nidhi') || t.name.includes('Rashmi')));
            const defaultAvatar = isFemale 
              ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
              : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300";

            return (
              <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-gold shadow mb-4">
                    <img
                      src={t.photoUrl || t.avatar || t.image || defaultAvatar}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-gold text-[11px] font-bold uppercase tracking-wider block">{t.department}</span>
                    <h3 className="text-xl font-serif font-bold text-navy mt-1 group-hover:text-gold transition-colors">{t.name}</h3>
                    <p className="text-slate-500 text-xs font-semibold mt-0.5">{t.designation}</p>
                  </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                    <span>{t.qualification || 'Ph.D. Scholar'}</span>
                  </div>
                  <div className="flex items-start">
                    <BookOpen className="w-4 h-4 text-gold mr-2 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">Spec: {t.specialization || 'Engineering'}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/faculty/${t.id}`}
                className="mt-6 block text-center bg-navy hover:bg-navy-light text-white font-bold text-xs py-2.5 rounded-lg uppercase tracking-wider transition-colors"
              >
                VIEW FULL PROFILE
              </Link>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
