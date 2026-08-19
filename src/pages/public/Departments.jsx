import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useData } from '../../context/DataContext';
import { ArrowRight, Users, BookOpen } from 'lucide-react';

export const Departments = () => {
  const { departments = [] } = useData();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredDepts = departments.filter(d => {
    if (selectedFilter === 'All') return true;
    const code = (d.code || '').toUpperCase();
    const nameLower = (d.name || '').toLowerCase();

    if (selectedFilter === 'Engineering') {
      return ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CE'].includes(code) || 
             nameLower.includes('engineering');
    }
    if (selectedFilter === 'Management') {
      return code === 'MBA' || nameLower.includes('management') || nameLower.includes('business');
    }
    if (selectedFilter === 'Basic Sciences') {
      return ['BSH', 'PHY', 'CHEM', 'MATH'].includes(code) || 
             (nameLower.includes('basic') && !nameLower.includes('engineering'));
    }
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Breadcrumbs />

      {/* Hero Header */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/30">
            FACULTIES & SCHOOLS
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Academic Departments
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-serif">
            Explore our specialized faculties dedicated to engineering excellence, business innovation, and advanced research.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
            {['All', 'Engineering', 'Management', 'Basic Sciences'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === filter
                    ? 'bg-navy text-gold shadow-lg scale-105 border border-gold/40'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredDepts.map((dept) => (
            <div
              key={dept.id || dept.code}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-navy text-gold text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                    {dept.code}
                  </span>
                  <span className="text-slate-500 text-xs font-bold">HOD: {dept.hod}</span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-navy group-hover:text-gold transition-colors mb-3">
                  {dept.name}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-serif">
                  {dept.description}
                </p>

                <div className="grid grid-cols-2 gap-4 py-3 bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 text-xs text-slate-700">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gold mr-2" />
                    <span><strong className="font-num text-navy font-bold">{dept.totalFaculty || 18}</strong> Faculty Members</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 text-gold mr-2" />
                    <span><strong className="font-num text-navy font-bold">{dept.totalStudents || 360}</strong> Enrolled Students</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/academics/departments/${dept.code ? dept.code.toLowerCase() : dept.id}`}
                className="inline-flex items-center justify-between bg-navy hover:bg-navy-light text-white font-bold text-xs py-3 px-5 rounded-xl transition-colors uppercase tracking-wider shadow-sm"
              >
                <span>EXPLORE DEPARTMENT DETAILS</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>
          ))}

          {filteredDepts.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full inline-block">
                FOUNDATIONAL SCIENCES
              </span>
              <h3 className="text-xl font-serif font-bold text-navy">Interdisciplinary Foundation Curriculum</h3>
              <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto font-serif">
                Basic Sciences (Physics, Chemistry, and Advanced Mathematics) are taught as foundational core subjects across all 1st and 2nd semester Engineering curriculums.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setSelectedFilter('All')}
                  className="px-5 py-2.5 bg-navy text-gold text-xs font-bold rounded-xl shadow uppercase tracking-wider"
                >
                  View All Degree Departments
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

