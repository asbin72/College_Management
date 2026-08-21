import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useData } from '../../context/DataContext';
import { CheckCircle2, BookOpen, ArrowRight, Star, Briefcase, GraduationCap, ShieldCheck, Download } from 'lucide-react';
import { INITIAL_COURSES } from '../../data/initialMockData';

export const CourseDetail = () => {
  const { courseId, course: courseParam } = useParams();
  const { courses, subjects } = useData();
  const [selectedSem, setSelectedSem] = useState('Semester 1');

  const allCourses = Array.from(
    new Map(
      [...INITIAL_COURSES, ...(courses || [])].filter(Boolean).map(c => [c?.id || c?.code || c?.name || Math.random().toString(), c])
    ).values()
  );

  const idToMatch = courseId || courseParam;
  const course = allCourses.find(c =>
    c && (c.id === idToMatch || c.code?.toLowerCase() === idToMatch?.toLowerCase())
  ) || allCourses[0] || {
    id: "c1",
    name: "B.Tech Computer Science & Engineering",
    code: "CS-101",
    department: "Computer Science and Engineering",
    duration: "4 Years (8 Semesters)",
    level: "Undergraduate",
    seats: 120,
    feePerYear: 120000,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
    overview: "Pioneering 4-year degree covering Artificial Intelligence, Machine Learning, Cloud Architecture, and Distributed Systems.",
    description: "The B.Tech in Computer Science & Engineering provides comprehensive mastery of algorithmic design, full-stack software development, cloud DevOps, and artificial intelligence.",
    eligibility: "10+2 with Physics, Chemistry, and Mathematics (min 60% aggregate). Valid JEE Main or State CET merit rank.",
    merits: [
      "98% Campus Placement with ₹44.5 LPA Highest International Package.",
      "Access to NVIDIA AI & High-Density GPU Supercomputing Labs.",
      "Integrated Industry Certifications from AWS, Google Cloud, and Microsoft.",
      "Mandatory 6-Month Paid Corporate Internship in Final Year."
    ],
    careerRoles: ["AI/ML Engineer", "Cloud Solutions Architect", "Full Stack Developer", "Cybersecurity Analyst"],
    curriculum: ["Data Structures & Algorithms", "Artificial Intelligence & Neural Networks", "Cloud Computing & DevOps", "Distributed Database Systems", "Operating Systems & Compiler Design", "Computer Networks & Security"]
  };

  // Find subjects from database matching course department and selected semester
  const matchedDbSubjects = (subjects || []).filter(s => {
    if (!s) return false;
    const deptName = (course.department || '').toLowerCase();
    const deptCode = (course.departmentCode || course.code || '').toLowerCase();
    const sDept = (s.department || '').toLowerCase();
    const sDeptCode = (s.departmentCode || '').toLowerCase();
    const sSem = (s.semester || '').toLowerCase();
    const targetSem = selectedSem.toLowerCase();

    const deptMatch = sDept.includes(deptName) || deptName.includes(sDept) || (sDeptCode && deptCode.includes(sDeptCode));
    const semMatch = sSem === targetSem || sSem.endsWith(targetSem.replace('semester ', ''));
    return deptMatch && semMatch;
  });

  // Fallback curriculum module generator if database search returns empty for a semester
  const fallbackCurriculumMap = {
    'Semester 1': [
      { code: `${course.code?.substring(0, 2) || 'CS'}-101`, name: 'Engineering Mathematics I (Calculus & Linear Algebra)', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-102`, name: 'Fundamentals of Computing & Algorithmic Problem Solving', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-103`, name: 'Engineering Physics & Quantum Mechanics', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-104`, name: 'Computing Practicum & C Programming Lab', credits: 2, type: 'Practical Lab' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-105`, name: 'Professional English & Technical Communication', credits: 2, type: 'Humanities' }
    ],
    'Semester 2': [
      { code: `${course.code?.substring(0, 2) || 'CS'}-201`, name: 'Engineering Mathematics II (Differential Equations & Vector Calculus)', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-202`, name: 'Object Oriented Programming using C++ & Java', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-203`, name: 'Digital Logic & Circuit Theory', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-204`, name: 'OOP & Java Application Laboratory', credits: 2, type: 'Practical Lab' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-205`, name: 'Environmental Studies & Sustainable Engineering', credits: 2, type: 'Humanities' }
    ],
    'Semester 3': [
      { code: `${course.code?.substring(0, 2) || 'CS'}-301`, name: 'Data Structures & Advanced Algorithmic Complexity', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-302`, name: 'Computer Organization & RISC-V Microarchitecture', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-303`, name: 'Discrete Mathematical Structures & Graph Theory', credits: 3, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-304`, name: 'Data Structures & Algorithmic Practicum Lab', credits: 2, type: 'Practical Lab' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-305`, name: 'Signals, Systems & Analog Circuits', credits: 3, type: 'Core Theory' }
    ],
    'Semester 4': [
      { code: `${course.code?.substring(0, 2) || 'CS'}-401`, name: 'Operating Systems & Distributed Kernel Architecture', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-402`, name: 'Database Management Systems (Relational SQL & NoSQL)', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-403`, name: 'Design & Analysis of Algorithms', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-404`, name: 'DBMS & Linux Kernel Systems Laboratory', credits: 2, type: 'Practical Lab' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-405`, name: 'Formal Languages & Automata Theory', credits: 3, type: 'Core Theory' }
    ],
    'Semester 5': [
      { code: `${course.code?.substring(0, 2) || 'CS'}-501`, name: 'Computer Networks & Internet Security Protocols', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-502`, name: 'Software Engineering & Agile System Design', credits: 3, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-503`, name: 'Artificial Intelligence & Intelligent Agents', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-504`, name: 'Full-Stack Web & Cloud Microservices Laboratory', credits: 2, type: 'Practical Lab' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-505`, name: 'Professional Elective I - Cloud Infrastructure', credits: 3, type: 'Elective' }
    ],
    'Semester 6': [
      { code: `${course.code?.substring(0, 2) || 'CS'}-601`, name: 'Machine Learning & Neural Network Architectures', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-602`, name: 'Compiler Design & LLVM Optimizations', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-603`, name: 'Cloud Computing Architecture & Containerization (Docker/Kubernetes)', credits: 3, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-604`, name: 'AI & Machine Learning Laboratory', credits: 2, type: 'Practical Lab' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-605`, name: 'Institutional Mini Project & Technical Seminar', credits: 2, type: 'Project' }
    ],
    'Semester 7': [
      { code: `${course.code?.substring(0, 2) || 'CS'}-701`, name: 'Distributed Systems & Big Data Processing (Spark/Hadoop)', credits: 4, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-702`, name: 'Deep Learning & Natural Language Processing', credits: 3, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-703`, name: 'Professional Elective II - Cyber Security & Cryptography', credits: 3, type: 'Elective' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-704`, name: 'Cloud Native DevOps & Microservices Practicum', credits: 3, type: 'Practical Lab' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-705`, name: 'Major Capstone Research Project Phase I', credits: 4, type: 'Project' }
    ],
    'Semester 8': [
      { code: `${course.code?.substring(0, 2) || 'CS'}-801`, name: 'Cyber Laws, Intellectual Property & Ethics', credits: 2, type: 'Humanities' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-802`, name: 'Open Elective II - Quantum Computing & Information Theory', credits: 3, type: 'Elective' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-803`, name: 'Advanced Enterprise System Security', credits: 3, type: 'Core Theory' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-804`, name: 'Major Capstone Research Defense & Publication', credits: 6, type: 'Project' },
      { code: `${course.code?.substring(0, 2) || 'CS'}-805`, name: '6-Month Paid Corporate Internship Practicum', credits: 4, type: 'Project' }
    ]
  };

  const activeSemSubjects = matchedDbSubjects.length > 0
    ? matchedDbSubjects
    : (fallbackCurriculumMap[selectedSem] || fallbackCurriculumMap['Semester 1']);

  const defaultMerits = [
    "98% Placement Success with Top Tier MNCs (Google, Amazon, Microsoft, Deloitte).",
    "Choice Based Credit System (CBCS) with interdisciplinary minor degrees.",
    "Outcome-Based Education (OBE) mapped to Washington Accord benchmarks.",
    "State-of-the-art supercomputing and research laboratories."
  ];

  const courseMerits = (course.merits && course.merits.length > 0) ? course.merits : defaultMerits;

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs customItems={[
        { label: 'Academics', to: '/academics' },
        { label: 'Courses', to: '/academics/courses' },
        { label: course.name, to: '' }
      ]} />

      {/* Hero Banner with Image */}
      <div className="bg-navy text-white py-14 border-b-4 border-gold relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-gold text-navy-dark text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              {course.level || 'UNDERGRADUATE'}
            </span>
            <span className="bg-white/10 text-slate-200 text-xs font-semibold px-3 py-1 rounded-md">
              {course.department}
            </span>
            <span className="text-emerald-400 text-xs font-bold flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> NAAC A++ & NBA Accredited
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-50 leading-tight">
            {course.name}
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-4 leading-relaxed font-sans">
            {course.description || course.overview}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Course Content */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Featured Image */}
            {course.image && (
              <div className="rounded-2xl overflow-hidden shadow-md border-4 border-white bg-slate-200 h-[360px]">
                <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
              </div>
            )}

            {/* SECTION 1: DEGREE MERITS & KEY ADVANTAGES */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-gold flex-shrink-0" />
                <h3 className="text-2xl font-serif font-bold text-navy">Degree Merits & Career Distinctions</h3>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Earning your degree in {course.name} from Kalpanaaa Education equips you with unique competitive advantages in the global employment market:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {courseMerits.map((merit, idx) => (
                  <div key={idx} className="p-4 bg-amber-50/60 border border-gold/40 rounded-xl flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-navy-dark leading-relaxed">{merit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: ADMISSION & MERIT CRITERIA */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-6 h-6 text-gold flex-shrink-0" />
                <h3 className="text-2xl font-serif font-bold text-navy">Admission Eligibility & Merit Guidelines</h3>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-gold uppercase tracking-wider block">ACADEMIC REQUIREMENT</span>
                <p className="text-sm font-bold text-navy">{course.eligibility}</p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  Candidates are admitted based on state/national merit ranking, followed by centralized online counseling and document verification.
                </p>
              </div>

              {/* Merit Scholarship Tiers */}
              <div className="pt-2">
                <h4 className="text-sm font-bold text-navy mb-3">Institutional Merit Scholarship Tiers</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                    <span className="font-bold block text-sm">100% Tuition Waiver</span>
                    <span className="text-[11px]">95%+ aggregate or Top 500 State Rank</span>
                  </div>
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                    <span className="font-bold block text-sm">50% Tuition Waiver</span>
                    <span className="text-[11px]">90%-94.9% aggregate in qualifying exam</span>
                  </div>
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                    <span className="font-bold block text-sm">25% Merit Scholarship</span>
                    <span className="text-[11px]">85%-89.9% aggregate in qualifying exam</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: CAREER PATHWAYS & RECRUITING ROLES */}
            {course.careerRoles && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-6 h-6 text-gold flex-shrink-0" />
                  <h3 className="text-2xl font-serif font-bold text-navy">Career Pathways & Industry Placement</h3>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Graduates of this program transition into leading technical and management positions worldwide:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {course.careerRoles.map((role, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-xs font-bold text-navy block">{role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4: CORE CURRICULUM & SYLLABUS STRUCTURE */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-navy text-gold rounded-xl shadow-md">
                    <BookOpen className="w-6 h-6 flex-shrink-0" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-navy">Core Curriculum & Syllabus Structure</h3>
                    <p className="text-xs text-slate-500 font-sans mt-0.5">
                      CBCS Scheme 2026-2030 &bull; NAAC & NBA Approved Semester Credit Framework
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloading official syllabus handbook for ${course.name}...`)}
                  className="px-4 py-2 bg-slate-100 hover:bg-navy hover:text-gold text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 border border-slate-300 transition-colors shadow-sm self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Syllabus Handbook PDF</span>
                </button>
              </div>

              {/* Semester Selector Tabs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy uppercase tracking-wider">Select Semester Scheme:</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Total Program Credits: 160
                  </span>
                </div>

                {/* 8-Semester Horizontal Scroll Bar */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
                  {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map((sem, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSem(sem)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        selectedSem === sem
                          ? 'bg-navy text-gold shadow-md scale-105'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {sem}
                    </button>
                  ))}
                </div>

                {/* Active Semester Subjects Table */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden space-y-3 p-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-2 border-b border-slate-200">
                    <span className="text-navy font-serif text-sm font-bold flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-gold inline-block"></span>
                      {selectedSem} Course Breakdown
                    </span>
                    <span className="text-slate-500 font-mono">
                      {activeSemSubjects.length} Core Subjects &bull; {activeSemSubjects.reduce((acc, curr) => acc + (curr.credits || 4), 0)} Semester Credits
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-navy text-white text-[11px] font-sans">
                        <tr>
                          <th className="p-3 rounded-tl-lg">Course Code</th>
                          <th className="p-3">Subject / Module Title</th>
                          <th className="p-3">Category Type</th>
                          <th className="p-3 text-center rounded-tr-lg">Credits</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-sans">
                        {activeSemSubjects.map((sub, i) => (
                          <tr key={i} className="bg-white hover:bg-amber-50/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-navy">
                              <span className="bg-navy/10 text-navy px-2.5 py-1 rounded border border-navy/20">
                                {sub.code || `SUB-${i + 101}`}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-slate-800">
                              {sub.name || sub}
                            </td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                sub.type === 'Practical Lab' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                sub.type === 'Elective' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                sub.type === 'Project' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                                'bg-blue-100 text-blue-800 border border-blue-300'
                              }`}>
                                {sub.type || 'Core Theory'}
                              </span>
                            </td>
                            <td className="p-3 text-center font-bold font-num text-navy">
                              {sub.credits || 4} Credits
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Bar */}
                  <div className="pt-2 flex justify-between items-center text-[11px] text-slate-500 font-sans border-t border-slate-200">
                    <span>* All course modules are evaluated via Continuous Internal Evaluation (CIE) & Semester End Exams (SEE).</span>
                    <span className="font-bold text-navy">Semester Credit Weightage: 100% Verified</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Info Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-navy text-white p-6 sm:p-8 rounded-2xl shadow-xl border-t-4 border-gold sticky top-24">
              <h4 className="text-xl font-serif font-bold text-amber-100 mb-6">Program Fast Facts</h4>
              
              <div className="space-y-4 text-xs font-sans">
                <div className="flex justify-between py-2.5 border-b border-navy-light/60">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-semibold text-amber-50">{course.duration}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-navy-light/60">
                  <span className="text-slate-400">Annual Tuition Fee:</span>
                  <span className="font-bold text-gold font-num text-sm">
                    {(() => {
                      const rawFee = course.feePerYear || course.fee || (typeof course.fees === 'number' ? course.fees : null);
                      if (typeof rawFee === 'number' && !isNaN(rawFee)) {
                        return `₹${rawFee.toLocaleString('en-IN')}`;
                      }
                      return course.fees || '₹1,20,000 / Year';
                    })()}
                  </span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-navy-light/60">
                  <span className="text-slate-400">Sanctioned Intake:</span>
                  <span className="font-semibold text-amber-50 font-num">{course.seats || 60} Seats / Year</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-navy-light/60">
                  <span className="text-slate-400">Academic Department:</span>
                  <span className="font-semibold text-amber-50 text-right">{course.department}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-400">Accreditation:</span>
                  <span className="font-semibold text-emerald-400">NAAC A++ Grade</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  to="/admissions/application"
                  className="inline-flex items-center justify-center w-full bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs py-4 rounded-xl shadow-lg uppercase tracking-wider transition-all"
                >
                  <span>APPLY FOR ADMISSION NOW</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <Link
                  to="/admissions/process"
                  className="inline-flex items-center justify-center w-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-3 rounded-xl border border-white/20 uppercase tracking-wider transition-colors"
                >
                  <span>View Admission Roadmap</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
