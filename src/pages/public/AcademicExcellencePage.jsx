import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AcademicExcellencePage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Header */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.25em] bg-gold/10 px-3.5 py-1.5 rounded-full">
            QUALITY & SCHOLARSHIP
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Academic Excellence & Doctorate Faculty
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-sans leading-relaxed">
            Distinguished faculty mentors, premier NAAC A++ accreditations, and intellectual rigor shaping the innovators of tomorrow.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 font-sans">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-gold text-xs font-bold uppercase tracking-widest">FACULTY DISTINCTION</span>
            <h2 className="text-3xl font-serif font-bold text-navy">Mentored by Nationally Renowned Doctorate Scholars</h2>
            <div className="w-12 h-1 bg-gold rounded-full" />
            <p className="text-slate-600 text-sm leading-relaxed">
              At Kalpanaaa Education, over 85% of our permanent teaching faculty hold doctorate degrees from premier research universities including IIT Bombay, IIT Delhi, IISc Bangalore, and top international institutions.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              With a low 1:15 student-faculty ratio, every undergraduate and postgraduate candidate benefits from personalized academic guidance, research co-authorship opportunities, and industry career mentoring.
            </p>
            <div className="pt-2">
              <Link
                to="/academics/faculty"
                className="inline-flex items-center bg-navy hover:bg-navy-light text-gold font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider shadow"
              >
                <span>Browse Full Faculty Directory</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000"
              alt="Academic Excellence Classroom"
              className="rounded-2xl shadow-lg border-4 border-slate-100 object-cover w-full h-[380px]"
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-gold block mb-1 font-num">85%+</span>
            <span className="text-xs font-bold uppercase text-navy block">Ph.D. Doctorate Faculty</span>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-gold block mb-1 font-num">1 : 15</span>
            <span className="text-xs font-bold uppercase text-navy block">Student-Faculty Ratio</span>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-gold block mb-1 font-num">500+</span>
            <span className="text-xs font-bold uppercase text-navy block">Scopus & IEEE Citations</span>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-gold block mb-1 font-num">NAAC A++</span>
            <span className="text-xs font-bold uppercase text-navy block">Highest Grade Accreditation</span>
          </div>
        </div>

        {/* Academic Accreditations */}
        <div className="bg-navy text-white p-8 sm:p-12 rounded-2xl shadow-xl border-t-4 border-gold space-y-6">
          <h3 className="text-2xl font-serif font-bold text-amber-50">Accreditations, Honors & Approvals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="p-4 bg-navy-light/40 border border-white/10 rounded-xl space-y-2">
              <span className="text-gold font-bold text-sm block">NAAC A++ Grade</span>
              <p>Recognized for institutional excellence, research output, and state-of-the-art infrastructure.</p>
            </div>
            <div className="p-4 bg-navy-light/40 border border-white/10 rounded-xl space-y-2">
              <span className="text-gold font-bold text-sm block">AICTE Approved</span>
              <p>All undergraduate engineering and MBA degree programs are fully approved by AICTE, New Delhi.</p>
            </div>
            <div className="p-4 bg-navy-light/40 border border-white/10 rounded-xl space-y-2">
              <span className="text-gold font-bold text-sm block">UGC Autonomous Status</span>
              <p>Granted academic autonomy with curriculum design flexibility by the University Grants Commission.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
