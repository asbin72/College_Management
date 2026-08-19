import React, { useState } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { ProgramCard } from '../../components/public/ProgramCard';
import { useData } from '../../context/DataContext';
import { Search, Award, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Courses = () => {
  const { courses } = useData();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');

  const filteredCourses = (courses || []).filter(course => {
    const matchesSearch = (course.name || '').toLowerCase().includes(search.toLowerCase()) || (course.code || '').toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || (course.department || '').toLowerCase().includes(deptFilter.toLowerCase());
    const courseLevel = (course.level || course.type || '').toLowerCase();
    const matchesLevel = levelFilter === 'ALL' || courseLevel.includes(levelFilter.toLowerCase());
    return matchesSearch && matchesDept && matchesLevel;
  });

  // Industry Upskilling Certifications
  const certificationCourses = [
    {
      id: "cert-1",
      title: "AWS Certified Solutions Architect",
      provider: "Amazon Web Services (AWS)",
      category: "Cloud Computing",
      duration: "12 Weeks (60 Hours)",
      level: "Intermediate / Advanced",
      badge: "⭐ Global Cloud Standard",
      desc: "Master high-availability VPCs, serverless AWS Lambda, EC2 auto-scaling, S3 security policies, and enterprise multi-region cloud migrations.",
      skills: ["Cloud Architecture", "VPC & IAM", "Serverless Lambda", "DevOps Pipelines"]
    },
    {
      id: "cert-2",
      title: "Google Cloud Professional Data Engineer",
      provider: "Google Cloud",
      category: "AI & Big Data",
      duration: "10 Weeks (50 Hours)",
      level: "Advanced",
      badge: "⭐ Google Official Partner",
      desc: "Architect big data analytics systems, train ML models with BigQuery ML, deploy streaming Pub/Sub pipelines, and manage distributed data lakes.",
      skills: ["BigQuery & SQL", "TensorFlow ML", "Dataflow & Pub/Sub", "Data Governance"]
    },
    {
      id: "cert-3",
      title: "Bloomberg Market Concepts (BMC)",
      provider: "Bloomberg LP",
      category: "Finance & Analytics",
      duration: "8 Weeks (40 Hours)",
      level: "All MBA Candidates",
      badge: "⭐ Wall Street Verified",
      desc: "Hands-on certification conducted inside our 24 dual-screen Bloomberg trading lab covering Economic Indicators, Currencies, Fixed Income, and Equities.",
      skills: ["Equity Research", "Financial Modeling", "Portfolio Analytics", "Global Markets"]
    },
    {
      id: "cert-4",
      title: "Cisco Certified Network Associate (CCNA)",
      provider: "Cisco Systems",
      category: "Networks & Cyber Security",
      duration: "12 Weeks (60 Hours)",
      level: "Undergraduate / Postgraduate",
      badge: "⭐ Cisco Academy",
      desc: "Hands-on network routing, OSPF/BGP protocols, switching architectures, cybersecurity fundamentals, and enterprise automation with Python.",
      skills: ["IP Routing & Switching", "Network Security", "OSPF / BGP", "Network Automation"]
    },
    {
      id: "cert-5",
      title: "Cadence VLSI Microchip Design & Verilog",
      provider: "Cadence Design Systems",
      category: "Semiconductors & ECE",
      duration: "10 Weeks (50 Hours)",
      level: "ECE & EEE Scholars",
      badge: "⭐ Core Semiconductor",
      desc: "RTL design synthesis, FPGA hardware prototyping, digital ASIC layout, and static timing analysis using industry-standard Cadence EDA tools.",
      skills: ["Verilog / VHDL", "RTL Synthesis", "ASIC Layout", "FPGA Prototyping"]
    },
    {
      id: "cert-6",
      title: "Docker & Kubernetes Cloud Native DevOps",
      provider: "Linux Foundation & CNCF",
      category: "Software Engineering",
      duration: "8 Weeks (40 Hours)",
      level: "Intermediate",
      badge: "⭐ DevOps Essential",
      desc: "Containerize microservices, write Helm charts, manage Kubernetes pods, orchestrate multi-cluster deployments, and automate CI/CD GitHub Actions.",
      skills: ["Docker Containers", "Kubernetes K8s", "CI/CD Actions", "Microservices"]
    }
  ];

  // Placement-Ready Bootcamp Sessions
  const placementReadySessions = [
    {
      id: "prep-1",
      number: "01",
      title: "DSA & LeetCode Algorithm Masterclasses",
      hours: "200+ Intensive Hours",
      mentor: "Senior Ex-FAANG Software Engineers",
      desc: "Comprehensive problem solving across Arrays, Trees, Dynamic Programming, Graph Traversal, and Greedy Algorithms with weekly timed coding contests."
    },
    {
      id: "prep-2",
      number: "02",
      title: "System Design & Production Architecture",
      hours: "40+ Interactive Hours",
      mentor: "Principal Architects (Amazon / Microsoft)",
      desc: "Deep dives into Low-Level Design (LLD / OOPs design patterns) and High-Level Design (HLD: Sharding, Rate Limiters, Caching, Message Queues, CAP Theorem)."
    },
    {
      id: "prep-3",
      number: "03",
      title: "Quantitative Aptitude & Logical Reasoning",
      hours: "80+ Practice Hours",
      mentor: "National Aptitude Trainers",
      desc: "Speed arithmetic, permutations, probability, logical deduction, and verbal analytics tailored for top MNC placement screening examinations."
    },
    {
      id: "prep-4",
      number: "04",
      title: "1-on-1 Mock Technical & HR Panels",
      hours: "Personalized Simulated Rounds",
      mentor: "Corporate Recruitment Executives",
      desc: "Live simulated technical grilling rounds, live whiteboarding sessions, behavioral HR assessments (STAR method), and personalized resume optimization."
    },
    {
      id: "prep-5",
      number: "05",
      title: "Corporate Soft Skills & Executive Presence",
      hours: "30+ Workshop Hours",
      mentor: "Corporate Communication Coaches",
      desc: "Group discussions (GD), corporate business etiquette, client presentation skills, cross-cultural workplace communication, and negotiation mastery."
    },
    {
      id: "prep-6",
      number: "06",
      title: "24-Hour Corporate Hackathons & Case Studies",
      hours: "Continuous Project Build Sprints",
      mentor: "Industry Product Managers",
      desc: "Interdisciplinary hackathons solving real-world enterprise problem statements evaluated directly by recruiting partners with fast-track interview tickets."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Header */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.25em] bg-gold/10 px-3.5 py-1.5 rounded-full">
            DEGREE PROGRAMS & CAREER PATHWAYS
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Degree Courses
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-sans leading-relaxed">
            Explore our accredited undergraduate & postgraduate engineering degrees, integrated professional certification courses, and intensive placement-readiness training.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 font-sans">
        
        {/* SECTION 1: DEGREE COURSES CATALOG */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest">CURRICULUM DEGREES</span>
              <h2 className="text-3xl font-serif font-bold text-navy mt-1">Undergraduate & Postgraduate Degrees</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium mt-2 md:mt-0">
              Showing {filteredCourses.length} accredited degree programs
            </span>
          </div>

          {/* Filters & Search Bar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Search Input */}
              <div className="md:col-span-6 relative">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses by name or code (e.g. B.Tech, CSE, MBA)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:outline-none focus:border-navy"
                />
              </div>

              {/* Department Filter */}
              <div className="md:col-span-3">
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:outline-none focus:border-navy"
                >
                  <option value="ALL">All Departments</option>
                  <option value="Computer Science">Computer Science & Eng</option>
                  <option value="Information">Information Science & Eng</option>
                  <option value="Electronics">Electronics & Communication</option>
                  <option value="Mechanical">Mechanical Engineering</option>
                  <option value="Civil">Civil Engineering</option>
                  <option value="Management">Management Studies (MBA)</option>
                </select>
              </div>

              {/* Level Filter */}
              <div className="md:col-span-3">
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:outline-none focus:border-navy"
                >
                  <option value="ALL">All Degree Levels</option>
                  <option value="Undergraduate">Undergraduate (B.Tech)</option>
                  <option value="Postgraduate">Postgraduate (MBA/M.Tech)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Courses Cards Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <ProgramCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-sm">No courses matching your search criteria were found.</p>
            </div>
          )}
        </div>

        {/* SECTION 2: PROFESSIONAL CERTIFICATION COURSES (Upskilling Micro-Credentials) */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-6">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full inline-block mb-2">
                INDUSTRY UPSKILLING & MICRO-CREDENTIALS
              </span>
              <h2 className="text-3xl font-serif font-bold text-navy">
                Global Certification Courses Offered to Students
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                Integrated into the academic semesters, these industry certifications empower students to earn globally recognized credentials from AWS, Google Cloud, Cisco, and Bloomberg before graduation.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Subsidized for Enrolled Scholars</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificationCourses.map((cert) => (
              <div 
                key={cert.id}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-gold hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gold uppercase bg-navy px-2.5 py-1 rounded-md">
                      {cert.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                      {cert.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-navy group-hover:text-gold transition-colors leading-snug">
                    {cert.title}
                  </h3>

                  <div className="text-xs text-slate-500 font-semibold flex items-center">
                    <Award className="w-3.5 h-3.5 mr-1.5 text-gold flex-shrink-0" />
                    <span>Issued by: <strong>{cert.provider}</strong></span>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 font-serif">
                    {cert.desc}
                  </p>

                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Core Competencies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.skills.map((sk, i) => (
                        <span key={i} className="text-[10px] font-bold bg-white text-navy px-2 py-0.5 rounded border border-slate-200">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-slate-500">{cert.badge}</span>
                  <span className="text-[11px] font-bold text-gold flex items-center">
                    <span>Enrolled in Sem 4-7</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: PLACEMENT-READY BOOTCAMPS & SESSIONS */}
        <div className="bg-navy text-white p-8 sm:p-12 rounded-3xl shadow-xl border-t-4 border-gold space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-navy-light/60 pb-6">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/20 px-3.5 py-1.5 rounded-full inline-block mb-2 border border-gold/30">
                CAMPUS TO CORPORATE TRANSFORMATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-amber-50">
                Placement-Ready Training & Mock Grilling Sessions
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed">
                Structured year-round corporate training programs ensuring that every Kalpanaaa graduate clears top MNC algorithmic rounds, system design panels, and HR interviews.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/about/placements"
                className="inline-flex items-center bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider shadow"
              >
                <span>View Placement Record (98%)</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* 6 Placement Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placementReadySessions.map((session) => (
              <div 
                key={session.id}
                className="p-6 bg-navy-light/40 border border-white/10 rounded-2xl space-y-3 hover:border-gold/60 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-gold text-navy-dark font-bold text-xs font-num flex items-center justify-center shadow">
                    {session.number}
                  </span>
                  <span className="text-[11px] font-bold text-gold font-mono bg-navy-dark/60 px-2.5 py-1 rounded border border-gold/20">
                    {session.hours}
                  </span>
                </div>

                <h3 className="text-lg font-serif font-bold text-amber-100 group-hover:text-gold transition-colors leading-snug">
                  {session.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-serif">
                  {session.desc}
                </p>

                <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400">
                  <span>Mentorship: </span>
                  <strong className="text-slate-200">{session.mentor}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Placement CTA Bar */}
          <div className="p-6 bg-navy-dark/70 rounded-2xl border border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-gold flex-shrink-0" />
              <div>
                <h4 className="font-bold text-white text-sm">Ready to kickstart your corporate journey?</h4>
                <p className="text-xs text-slate-400">Join over 2,500 scholars securing premier offers with Google, Amazon, Deloitte, and Goldman Sachs.</p>
              </div>
            </div>
            <Link
              to="/admissions/application"
              className="px-6 py-3 bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs rounded-xl shadow uppercase tracking-wider flex-shrink-0"
            >
              Apply Online for Admissions
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
