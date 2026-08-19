import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useData } from '../../context/DataContext';
import { ProgramCard } from '../../components/public/ProgramCard';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Calendar, ArrowRight } from 'lucide-react';

export const Academics = () => {
  const { departments, courses } = useData();

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Banner */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full">
            ACADEMIC EXCELLENCE
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Academics & Degree Programs
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Explore our multidisciplinary academic departments, industry-aligned degree programs, and academic schedules.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* SECTION 1: Academic Departments */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest">FACULTIES & SCHOOLS</span>
              <h2 className="text-3xl font-serif font-bold text-navy mt-1">Academic Departments</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-navy text-gold text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                      {dept.code}
                    </span>
                    <span className="text-slate-400 text-xs font-medium">HOD: {dept.hod}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-navy mb-3">{dept.name}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">{dept.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 py-3 bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 text-xs text-slate-700">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gold mr-2" />
                      <span><strong className="font-num">{dept.totalFaculty}</strong> Faculty Members</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 text-gold mr-2" />
                      <span><strong className="font-num">{dept.totalStudents}</strong> Enrolled Students</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Offered Degree Programs */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest">ACADEMIC DEGREES</span>
              <h2 className="text-3xl font-serif font-bold text-navy mt-1">Featured Degree Courses</h2>
            </div>
            <Link
              to="/academics/courses"
              className="mt-4 md:mt-0 text-xs font-bold text-gold hover:text-navy uppercase tracking-widest flex items-center"
            >
              <span>EXPLORE ALL PROGRAMS & CERTIFICATIONS</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.slice(0, 3).map((course) => (
              <ProgramCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        {/* SECTION 3: Academic Calendar Schedule */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="w-8 h-8 text-gold flex-shrink-0" />
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest">ACADEMIC SCHEDULE</span>
              <h3 className="text-2xl font-serif font-bold text-navy">Academic Calendar Highlights (2026 - 2027)</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-gold uppercase block mb-1">FALL SEMESTER 2026</span>
              <h4 className="text-base font-serif font-bold text-navy mb-2">Orientation & Class Commencement</h4>
              <p className="text-xs text-slate-600">Classes begin August 20, 2026. Registration deadline August 18, 2026.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-gold uppercase block mb-1">MID-TERM EVALUATION</span>
              <h4 className="text-base font-serif font-bold text-navy mb-2">Mid-Semester Examinations</h4>
              <p className="text-xs text-slate-600">Scheduled from October 12 to October 24, 2026 across all departments.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-gold uppercase block mb-1">SPRING SEMESTER 2027</span>
              <h4 className="text-base font-serif font-bold text-navy mb-2">Final Semester Examination</h4>
              <p className="text-xs text-slate-600">December 01 to December 18, 2026. Winter vacation starts December 20.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
