import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Cpu, Code, Layers, ArrowRight, Download, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CurriculumPage = () => {
  const curriculumHighlights = [
    {
      title: "Outcome-Based Education (OBE)",
      desc: "Every course is mapped to specific program educational objectives (PEOs) and quantifiable course outcomes (COs) aligned with global Washington Accord standards.",
      icon: Award
    },
    {
      title: "Industry 4.0 Integrated Modules",
      desc: "Curricula co-designed with technology partners incorporating Artificial Intelligence, Cloud Infrastructure, Cyber Security, and Big Data Analytics from Year 2 onwards.",
      icon: Cpu
    },
    {
      title: "Choice Based Credit System (CBCS)",
      desc: "Flexibility to choose cross-departmental open electives, specialized minor degrees in AI/FinTech, and accelerated honors tracks.",
      icon: Layers
    },
    {
      title: "Mandatory Capstone & Practicum",
      desc: "Year-long industrial capstone projects, startup incubation tracks, and 6-month full-time corporate internships integrated into graduation credits.",
      icon: Code
    }
  ];

  const syllabusDownloads = [
    { name: "B.Tech Computer Science & Engineering (2026-2030 Scheme)", code: "CSE-2026", credits: "160 Credits" },
    { name: "B.Tech Information Science & Engineering (2026-2030 Scheme)", code: "ISE-2026", credits: "160 Credits" },
    { name: "B.Tech Electronics & Communication Engineering", code: "ECE-2026", credits: "160 Credits" },
    { name: "Master of Business Administration (MBA Dual Specialization)", code: "MBA-2026", credits: "102 Credits" }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Header */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.25em] bg-gold/10 px-3.5 py-1.5 rounded-full">
            ACADEMIC FRAMEWORK
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Curriculum & Innovative Learning Pedagogy
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-sans leading-relaxed">
            Modern, industry-aligned curricula designed for deep foundational rigor, hands-on software development, and transformative research.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Editorial Story Section with Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200 font-sans">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-gold text-xs font-bold uppercase tracking-widest">NEXT-GEN PEDAGOGY</span>
            <h2 className="text-3xl font-serif font-bold text-navy">Bridging Academic Foundations & Industry Execution</h2>
            <div className="w-12 h-1 bg-gold rounded-full" />
            <p className="text-slate-600 text-sm leading-relaxed">
              At Kalpanaaa Education, learning extends far beyond conventional classroom lectures. Our academic framework is continuously refreshed in collaboration with leading multinational technology firms, ensuring that students master both timeless mathematical principles and modern developer stacks.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              With 40% of semester credits dedicated to hands-on laboratory practicums, algorithmic challenges, and real-world system design, graduates are fully prepared to build high-scale production systems from day one.
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
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000"
              alt="Curriculum & Learning at Kalpanaaa Education"
              className="rounded-2xl shadow-lg border-4 border-slate-100 object-cover w-full h-[380px]"
            />
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
          {curriculumHighlights.map((item, idx) => {
            const IconC = item.icon;
            return (
              <div key={idx} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-gold hover:shadow-lg transition-all space-y-3">
                <div className="w-12 h-12 bg-navy text-gold rounded-xl flex items-center justify-center shadow">
                  <IconC className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-navy text-base">{item.title}</h4>
                <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Download Official Syllabus Schemes */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200 space-y-6 font-sans">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest">OFFICIAL SCHEMES & CURRICULUM</span>
              <h3 className="text-2xl font-serif font-bold text-navy mt-1">Download Program Course Handbooks</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {syllabusDownloads.map((syl, i) => (
              <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:border-gold transition-colors">
                <div>
                  <h5 className="font-bold text-navy">{syl.name}</h5>
                  <span className="text-slate-500 font-mono text-[11px]">{syl.code} &bull; {syl.credits}</span>
                </div>
                <button
                  onClick={() => alert(`Downloading official syllabus handbook for ${syl.name}...`)}
                  className="p-2.5 bg-navy hover:bg-navy-light text-gold rounded-lg shadow flex items-center"
                  title="Download Syllabus PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
