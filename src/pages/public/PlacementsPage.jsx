import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PlacementsPage = () => {
  const recruiters = [
    { name: "Google", role: "Software Development Engineer", pkg: "₹44.5 LPA", logo: "⭐ Google" },
    { name: "Amazon AWS", role: "Cloud Solutions Architect", pkg: "₹38.0 LPA", logo: "⭐ Amazon" },
    { name: "Microsoft", role: "Full Stack Engineer", pkg: "₹42.0 LPA", logo: "⭐ Microsoft" },
    { name: "Goldman Sachs", role: "Quantitative Finance Analyst", pkg: "₹32.0 LPA", logo: "⭐ Goldman Sachs" },
    { name: "Deloitte", role: "Strategy & Tech Consultant", pkg: "₹18.5 LPA", logo: "⭐ Deloitte" },
    { name: "IBM Cloud", role: "DevOps & Infrastructure Lead", pkg: "₹22.0 LPA", logo: "⭐ IBM Cloud" }
  ];

  const trainingSteps = [
    { step: "1", title: "Foundational Aptitude & Communication", desc: "Verbal reasoning, quantitative problem solving, and corporate presentation skills." },
    { step: "2", title: "DSA & System Design Bootcamps", desc: "Intensive 200+ hours coding training in Data Structures, Algorithms, and System Architecture." },
    { step: "3", title: "Mock Technical & HR Panels", desc: "Simulated interview rounds with senior engineers and hiring managers from Fortune 500 firms." },
    { step: "4", title: "On-Campus Hiring Drives", desc: "Over 250+ multinational recruiting partners conducting exclusive on-campus selection drives." }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Header */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.25em] bg-gold/10 px-3.5 py-1.5 rounded-full">
            CAREER OUTCOMES & INDUSTRY HIRING
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Career Development & Campus Placements
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-sans leading-relaxed">
            Empowering students with structured corporate training, mock technical panels, and direct access to Fortune 500 recruiters.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 font-sans">
        
        {/* Story Section with Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-gold text-xs font-bold uppercase tracking-widest">INDUSTRY-READY GRADUATES</span>
            <h2 className="text-3xl font-serif font-bold text-navy">98% Placement Success Across Global Multinationals</h2>
            <div className="w-12 h-1 bg-gold rounded-full" />
            <p className="text-slate-600 text-sm leading-relaxed">
              The Corporate Relations and Placement Division at Kalpanaaa Education works tirelessly to ensure every eligible graduate steps into a high-growth professional career.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              From semester 4 onward, students participate in personalized skill assessments, algorithmic coding bootcamps, and resume optimization sessions, achieving market-leading salary packages.
            </p>
            <div className="pt-2">
              <Link
                to="/admissions/application"
                className="inline-flex items-center bg-navy hover:bg-navy-light text-gold font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider shadow"
              >
                <span>Apply for 2026-2027 Admissions</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
              alt="Career Development & Placements"
              className="rounded-2xl shadow-lg border-4 border-slate-100 object-cover w-full h-[380px]"
            />
          </div>
        </div>

        {/* Key Placement Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-gold block mb-1 font-num">98%</span>
            <span className="text-xs font-bold uppercase text-navy block">Overall Placement Record</span>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-emerald-700 block mb-1 font-num">₹44.5 LPA</span>
            <span className="text-xs font-bold uppercase text-navy block">Highest Salary Package</span>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-gold block mb-1 font-num">₹12.8 LPA</span>
            <span className="text-xs font-bold uppercase text-navy block">Average CSE / MBA Package</span>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-navy block mb-1 font-num">250+</span>
            <span className="text-xs font-bold uppercase text-navy block">Recruitment Partners</span>
          </div>
        </div>

        {/* Corporate Recruitment Partners */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div>
            <span className="text-gold text-xs font-bold uppercase tracking-widest">CAMPUS HIRING PARTNERS</span>
            <h3 className="text-2xl font-serif font-bold text-navy mt-1">Marquee Placement Offers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recruiters.map((rec, i) => (
              <div key={i} className="p-5 bg-slate-50 border rounded-xl space-y-2 hover:border-gold transition-colors">
                <span className="text-xs font-bold text-navy bg-white px-3 py-1 rounded shadow-sm inline-block">{rec.logo}</span>
                <h4 className="font-bold text-navy text-sm pt-1">{rec.role}</h4>
                <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-sans">CTC Package</span>
                  <span className="text-emerald-700 font-num font-bold text-sm">{rec.pkg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Stage Training Roadmap */}
        <div className="bg-navy text-white p-8 sm:p-12 rounded-2xl shadow-xl border-t-4 border-gold space-y-6">
          <h3 className="text-2xl font-serif font-bold text-amber-50">4-Stage Corporate Readiness Program</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-xs">
            {trainingSteps.map((st, idx) => (
              <div key={idx} className="p-4 bg-navy-light/40 border border-white/10 rounded-xl space-y-2">
                <div className="w-8 h-8 bg-gold text-navy-dark rounded-full flex items-center justify-center font-bold text-sm font-num mb-2">
                  {st.step}
                </div>
                <h5 className="font-bold text-amber-100 text-sm">{st.title}</h5>
                <p className="text-slate-300 leading-relaxed font-serif">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
