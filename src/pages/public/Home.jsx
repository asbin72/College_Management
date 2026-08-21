import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroSlider } from '../../components/public/HeroSlider';
import { TestimonialSlider } from '../../components/public/TestimonialSlider';
import { ProgramCard } from '../../components/public/ProgramCard';
import { Lightbox } from '../../components/common/Lightbox';
import { AnimatedCounter } from '../../components/common/AnimatedCounter';
import { useData } from '../../context/DataContext';
import { BookOpen, Users, Building, Code, ShieldCheck, Briefcase, ArrowRight, Calendar, MapPin, Mail, CheckCircle2, ChevronRight, Eye, Terminal, Laptop } from 'lucide-react';

export const Home = () => {
  const { courses, news, events } = useData();
  const [selectedImage, setSelectedImage] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Updated verified high-resolution gallery images
  const galleryItems = [
    { id: 1, src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800", title: "Central University Library", category: "Campus" },
    { id: 2, src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800", title: "Advanced Computing Complex", category: "Classrooms" },
    { id: 3, src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800", title: "Developer & Computing Lab", category: "Laboratories" },
    { id: 4, src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800", title: "Annual Graduation Convocation", category: "Graduation" },
    { id: 5, src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800", title: "Inter-College Sports Complex", category: "Sports" },
    { id: 6, src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800", title: "Cultural & Musical Evening", category: "Cultural Activities" }
  ];

  // Updated news with verified loading URLs
  const verifiedNews = [
    {
      id: "news-1",
      title: "Kalpanaaa Education Ranked Top 10 Engineering Institutions Nationally",
      category: "Achievement",
      date: "August 05, 2026",
      image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1000",
      summary: "Kalpanaaa Education has been bestowed with prestigious accreditation and ranked among top institutions for academic quality, research output, and 98% placement record.",
    },
    {
      id: "news-2",
      title: "School of Management Launches Global Financial Analytics Center",
      category: "Infrastructure",
      date: "July 28, 2026",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
      summary: "A state-of-the-art Bloomberg Financial Trading Laboratory was inaugurated today, offering real-time market data analysis for MBA candidates.",
    },
    {
      id: "news-3",
      title: "Computer Science Department Secures Research Grant for Cloud Systems",
      category: "Research",
      date: "July 18, 2026",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000",
      summary: "The research grant will empower faculty and postgraduate scholars to develop distributed cloud architectures and developer tools.",
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="space-y-0 font-third" style={{ fontFamily: 'var(--font-third)' }}>
      {/* 1. HERO SLIDER */}
      <HeroSlider />

      {/* 2. WELCOME TO KALPANAAA EDUCATION */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Image Cluster */}
            <div className="lg:col-span-6 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000"
                  alt="Kalpanaaa Education Campus"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-6 z-20 hidden sm:block w-56 p-4 bg-navy text-white rounded-xl shadow-2xl border-2 border-gold">
                <span className="text-3xl font-serif font-bold text-gold font-num" style={{ fontFamily: "'Wix Madefor Display', sans-serif" }}>25+</span>
                <p className="text-xs text-slate-300 font-medium mt-1">Years of Academic Leadership & Excellence</p>
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gold/10 rounded-full blur-2xl -z-0" />
            </div>

            {/* Right Welcome Editorial Text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] bg-gold/10 px-3.5 py-1.5 rounded-full inline-block">
                INSTITUTION OVERVIEW
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
                WELCOME TO KALPANAAA EDUCATION
              </h2>
              <div className="w-16 h-1 bg-gold rounded-full" />
              
              <p className="text-slate-600 text-base leading-relaxed">
                Kalpanaaa Education is a globally recognized institution committed to empowering minds, fostering technological innovation, and preparing future leaders for a dynamic world. Founded on values of integrity, academic rigor, and holistic student development, we bridge the gap between theoretical knowledge and practical execution.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 text-sm text-slate-700 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                  <span>Academic Excellence & Rigor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                  <span>Student-Centered Learning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                  <span>Practical & Lab Exposure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                  <span>Career Preparation & Placements</span>
                </div>
              </div>

              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center bg-navy hover:bg-navy-light text-white font-bold text-xs tracking-wider px-7 py-3.5 rounded shadow-lg transition-colors uppercase"
                >
                  <span>LEARN MORE ABOUT US</span>
                  <ArrowRight className="w-4 h-4 ml-2 text-gold" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. ACADEMIC FEATURES (Image-led Editorial Sections) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full">
              PILLARS OF ACADEMIC QUALITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy mt-3">
              Distinguished Learning Pillars
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Explore how Kalpanaaa Education builds world-class competencies across all disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 group hover:shadow-xl transition-all">
              <div className="h-44 img-zoom-container relative">
                <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600" alt="Curriculum & Learning" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-serif font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                  CURRICULUM & LEARNING
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Modern curriculum designed for strong academic foundations, regularly updated with industry inputs.
                </p>
                <Link to="/academics/curriculum" className="text-xs font-bold text-gold hover:text-navy flex items-center">
                  <span>READ MORE</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 group hover:shadow-xl transition-all">
              <div className="h-44 img-zoom-container relative">
                <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600" alt="Academic Excellence" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-serif font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                  ACADEMIC EXCELLENCE
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Experienced doctorate faculty, rigorous assessment methods, and high-quality educational standards.
                </p>
                <Link to="/academics/excellence" className="text-xs font-bold text-gold hover:text-navy flex items-center">
                  <span>READ MORE</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 group hover:shadow-xl transition-all">
              <div className="h-44 img-zoom-container relative">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600" alt="Practical Education" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-serif font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                  PRACTICAL EDUCATION
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Hands-on laboratory training,<br />
                  industry internships, and<br />
                  real-world project work.
                </p>
                <Link to="/academics/practical-education" className="text-xs font-bold text-gold hover:text-navy flex items-center">
                  <span>READ MORE</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 group hover:shadow-xl transition-all">
              <div className="h-44 img-zoom-container relative">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600" alt="Career Development" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-serif font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                  CAREER DEVELOPMENT
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Preparing students for professional success through campus drives, resume building, and soft skills training.
                </p>
                <Link to="/about/placements" className="text-xs font-bold text-gold hover:text-navy flex items-center">
                  <span>READ MORE</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TOP RECRUITERS & CONTINUOUS ROTATING PLACEMENT MARQUEE */}
      <section className="py-14 bg-slate-900 text-white border-y border-slate-800 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 text-center mb-8">
          <span className="text-gold text-[10px] font-bold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded">
            GLOBAL HIRING PARTNERS & CAMPUS PLACEMENTS
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-2 font-serif">Leading Multinational Corporate Recruiters</h3>
          <p className="text-xs text-slate-400 font-serif mt-1">Tier-1 technology and consulting firms actively hiring Kalpanaaa graduates</p>
        </div>

        {/* Gradient Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />

        {/* Marquee Track Container */}
        <div className="overflow-hidden w-full select-none py-4">
          <div className="animate-marquee flex items-center space-x-14 sm:space-x-20">
            {[
              { name: 'Google', src: '/logos/google.svg', className: 'h-8 sm:h-9 max-w-[130px]' },
              { name: 'NVIDIA', src: '/logos/nvidia.svg', className: 'h-7 sm:h-8 max-w-[130px]' },
              { name: 'Microsoft', src: '/logos/microsoft.svg', className: 'h-7 sm:h-8 max-w-[140px]' },
              { name: 'Adobe', src: '/logos/adobe.svg', className: 'h-7 sm:h-8 max-w-[120px]' },
              { name: 'IBM', src: '/logos/ibm.svg', className: 'h-7 sm:h-8 max-w-[100px]' },
              { name: 'Infosys', src: '/logos/infosys.svg', className: 'h-7 sm:h-8 max-w-[120px]' },
              { name: 'Tata Consultancy Services', src: '/logos/tcs.svg', className: 'h-7 sm:h-8 max-w-[130px]' },
              { name: 'Wipro', src: '/logos/wipro.svg', className: 'h-7 sm:h-8 max-w-[120px]' },
              { name: 'Accenture', src: '/logos/accenture.svg', className: 'h-7 sm:h-8 max-w-[130px]' },
              { name: 'Deloitte', src: '/logos/deloitte.svg', className: 'h-7 sm:h-8 max-w-[130px]' },
              { name: 'Oracle', src: '/logos/oracle.svg', className: 'h-6 sm:h-7 max-w-[130px]' },
              { name: 'Cisco', src: '/logos/cisco.svg', className: 'h-7 sm:h-8 max-w-[110px]' },
              { name: 'Intel', src: '/logos/intel.svg', className: 'h-7 sm:h-8 max-w-[100px]' },
              // Duplicate set for seamless infinite loop
              { name: 'Google', src: '/logos/google.svg', className: 'h-8 sm:h-9 max-w-[130px]' },
              { name: 'NVIDIA', src: '/logos/nvidia.svg', className: 'h-7 sm:h-8 max-w-[130px]' },
              { name: 'Microsoft', src: '/logos/microsoft.svg', className: 'h-7 sm:h-8 max-w-[140px]' },
              { name: 'Adobe', src: '/logos/adobe.svg', className: 'h-7 sm:h-8 max-w-[120px]' },
              { name: 'IBM', src: '/logos/ibm.svg', className: 'h-7 sm:h-8 max-w-[100px]' },
              { name: 'Infosys', src: '/logos/infosys.svg', className: 'h-7 sm:h-8 max-w-[120px]' },
              { name: 'Tata Consultancy Services', src: '/logos/tcs.svg', className: 'h-7 sm:h-8 max-w-[130px]' },
              { name: 'Wipro', src: '/logos/wipro.svg', className: 'h-7 sm:h-8 max-w-[120px]' },
              { name: 'Accenture', src: '/logos/accenture.svg', className: 'h-7 sm:h-8 max-w-[130px]' },
              { name: 'Deloitte', src: '/logos/deloitte.svg', className: 'h-7 sm:h-8 max-w-[130px]' },
              { name: 'Oracle', src: '/logos/oracle.svg', className: 'h-6 sm:h-7 max-w-[130px]' },
              { name: 'Cisco', src: '/logos/cisco.svg', className: 'h-7 sm:h-8 max-w-[110px]' },
              { name: 'Intel', src: '/logos/intel.svg', className: 'h-7 sm:h-8 max-w-[100px]' },
            ].map((company, idx) => (
              <div
                key={idx}
                title={company.name}
                className="flex items-center justify-center grayscale contrast-125 opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer flex-shrink-0"
              >
                <img
                  src={company.src}
                  alt={company.name}
                  className={`${company.className} w-auto object-contain pointer-events-none drop-shadow-md transition-all duration-300`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY KALPANAAA EDUCATION - Developer icons replacing AI icons */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full">
              THE KALPANAAA ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy mt-3">
              WHY KALPANAAA EDUCATION
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: "Experienced Faculty", desc: "Renowned professors with PhDs from premier research institutes." },
              { icon: Building, title: "Modern Infrastructure", desc: "Smart classrooms, Bloomberg lab, high-speed WiFi and campus amenities." },
              { icon: BookOpen, title: "Industry Curriculum", desc: "Co-designed with corporate partners to ensure immediate job readiness." },
              { icon: Code, title: "Developer Workspaces", desc: "Dedicated coding environments, terminal access, and software design labs." },
              { icon: Terminal, title: "Digital Learning", desc: "Comprehensive portal access for timetables, results, fees, and leave tracking." },
              { icon: Briefcase, title: "Career Development", desc: "Dedicated placement cell connecting graduates with Fortune 500 firms." },
              { icon: Laptop, title: "Research & Innovation", desc: "Extensive funding for student projects, patent filings, and software papers." },
              { icon: ShieldCheck, title: "Student Support", desc: "Round-the-clock academic helpdesk, psychological counseling & aid." },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-gold/50 hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 bg-navy text-gold rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold group-hover:text-navy-dark transition-colors shadow">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-serif font-bold text-navy mb-2">{item.title}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. STATISTICS SECTION - Background of 4 Student Friends walking (Waistline crop, no watermark) */}
      <section className="py-24 relative overflow-hidden border-y-4 border-gold bg-cover bg-[center_top_25%]" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2000')` }}>
        {/* Dark Navy Overlay for maximum contrast */}
        <div className="absolute inset-0 bg-navy-dark/85 backdrop-blur-[2px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            
            <div className="p-6 bg-navy-dark/50 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl">
              <span className="text-4xl sm:text-5xl font-serif font-bold text-gold block mb-2">
                <AnimatedCounter end={2500} suffix="+" />
              </span>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-200">Enrolled Students</span>
            </div>

            <div className="p-6 bg-navy-dark/50 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl">
              <span className="text-4xl sm:text-5xl font-serif font-bold text-gold block mb-2">
                <AnimatedCounter end={150} suffix="+" />
              </span>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-200">Expert Faculty</span>
            </div>

            <div className="p-6 bg-navy-dark/50 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl">
              <span className="text-4xl sm:text-5xl font-serif font-bold text-gold block mb-2">
                <AnimatedCounter end={25} suffix="+" />
              </span>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-200">Degree Programs</span>
            </div>

            <div className="p-6 bg-navy-dark/50 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl">
              <span className="text-4xl sm:text-5xl font-serif font-bold text-gold block mb-2">
                <AnimatedCounter end={10} suffix="+" />
              </span>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-200">Academic Departments</span>
            </div>

          </div>
        </div>
      </section>

      {/* 6. ACADEMIC PROGRAMS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full">
                FUTURE-READY DEGREES
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy mt-3">
                EXPLORE OUR PROGRAMS
              </h2>
            </div>
            <Link to="/academics/courses" className="mt-4 md:mt-0 text-xs font-bold text-gold hover:text-navy uppercase tracking-widest flex items-center">
              <span>VIEW ALL COURSES</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(() => {
              const validDegrees = Array.from(
                new Map(
                  [...INITIAL_COURSES, ...(courses || [])]
                    .filter(Boolean)
                    .map(c => [c?.id || c?.code || c?.name || Math.random().toString(), c])
                ).values()
              ).filter(c => {
                if (!c) return false;
                const name = (c.name || '').trim();
                const code = (c.code || '').trim();
                const id = (c.id || '').trim();
                const level = (c.level || c.type || '').trim();

                if (name.toLowerCase().includes('c programming') && !name.toLowerCase().includes('b.tech')) return false;

                return id.startsWith('deg-') || 
                       level.includes('Undergraduate') || 
                       level.includes('Postgraduate') || 
                       level.includes('Degree') || 
                       /\b(b\.?tech|mba|m\.?tech|bachelor|master|degree)\b/i.test(name) ||
                       /\b(b\.?tech|mba|m\.?tech)\b/i.test(code);
              });

              return validDegrees.slice(0, 3).map((course) => (
                <ProgramCard key={course.id} course={course} />
              ));
            })()}
          </div>
        </div>
      </section>

      {/* 7. CAMPUS LIFE PREVIEW - Entire Background Changed to White */}
      <section className="py-20 bg-white text-slate-800 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full">
              VIBRANT CAMPUS CULTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy mt-3">
              EXPERIENCE CAMPUS LIFE
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Life at Kalpanaaa Education goes beyond lectures. Immerse yourself in research, athletics, clubs, and cultural festivals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Central Library", link: "/campus-life/library", img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600", desc: "Over 100,000 volumes, e-journals, and quiet study hubs." },
              { title: "Research Laboratories", link: "/campus-life/laboratories", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600", desc: "State-of-the-art computing and software engineering prototyping facilities." },
              { title: "Sports Complex", link: "/campus-life/sports", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600", desc: "Olympic indoor pool, basketball courts, and athletics stadium." },
              { title: "Clubs & Societies", link: "/campus-life/clubs", img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=600", desc: "30+ active student clubs ranging from Software to Debate." },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200 group hover:border-gold hover:shadow-xl transition-all">
                <div className="h-44 img-zoom-container relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-serif font-bold text-navy group-hover:text-gold transition-colors">{item.title}</h3>
                  <p className="text-slate-600 text-xs mt-2 mb-4">{item.desc}</p>
                  <Link to={item.link} className="text-xs font-bold text-gold-hover hover:text-navy flex items-center">
                    <span>EXPLORE</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. ADMISSIONS CTA */}
      <section className="py-20 bg-gradient-to-r from-navy-dark via-navy to-navy-dark text-white relative overflow-hidden border-y-4 border-gold">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.25em] bg-gold/10 px-4 py-1.5 rounded-full inline-block mb-4">
            ADMISSIONS OPEN FOR 2026-2027
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-amber-50 mb-4">
            BEGIN YOUR JOURNEY WITH KALPANAAA EDUCATION
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto mb-8 font-sans leading-relaxed">
            Take the next step toward your academic and professional future. Join thousands of high-achieving scholars shaping the future.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/admissions/application"
              className="bg-gold hover:bg-gold-hover text-navy-dark font-bold text-sm uppercase tracking-wider px-8 py-4 rounded shadow-2xl transition-all transform hover:-translate-y-0.5"
            >
              APPLY ONLINE NOW
            </Link>
            <Link
              to="/admissions/process"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm uppercase tracking-wider px-7 py-4 rounded border border-white/30 transition-all"
            >
              ADMISSION PROCESS
            </Link>
          </div>
        </div>
      </section>

      {/* 9. LATEST NEWS & UPCOMING EVENTS - Fixed 1st News Picture loading */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: LATEST NEWS (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-gold text-xs font-bold uppercase tracking-widest">CAMPUS UPDATES</span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-navy">LATEST NEWS</h3>
                </div>
                <Link to="/news" className="text-xs font-bold text-gold hover:text-navy flex items-center uppercase">
                  <span>ALL NEWS</span> <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              <div className="space-y-6">
                {verifiedNews.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-5 hover:shadow-md transition-shadow">
                    <img src={item.image} alt={item.title} className="w-full sm:w-44 h-32 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-3 text-xs text-slate-400 mb-1">
                          <span className="text-gold font-semibold uppercase">{item.category}</span>
                          <span>•</span>
                          <span className="font-num" style={{ fontFamily: "'Wix Madefor Display', sans-serif" }}>{item.date}</span>
                        </div>
                        <h4 className="text-base font-serif font-bold text-navy hover:text-gold transition-colors line-clamp-2">
                          <Link to={`/news/${item.id}`}>{item.title}</Link>
                        </h4>
                        <p className="text-slate-600 text-xs line-clamp-2 mt-1">{item.summary}</p>
                      </div>
                      <Link to={`/news/${item.id}`} className="text-xs font-bold text-navy hover:text-gold mt-3 inline-flex items-center">
                        <span>READ FULL STORY</span> <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: UPCOMING EVENTS (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-gold text-xs font-bold uppercase tracking-widest">CALENDAR</span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-navy">UPCOMING EVENTS</h3>
                </div>
                <Link to="/events" className="text-xs font-bold text-gold hover:text-navy flex items-center uppercase">
                  <span>ALL EVENTS</span> <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {events.map((evt) => (
                  <div key={evt.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:border-gold transition-all flex items-start space-x-4">
                    <div className="bg-navy text-gold rounded-lg p-3 text-center flex-shrink-0 w-20 shadow">
                      <Calendar className="w-5 h-5 mx-auto mb-1 text-gold" />
                      <span className="text-xs font-bold leading-tight block font-num" style={{ fontFamily: "'Wix Madefor Display', sans-serif" }}>{evt.date.split(' ')[0]}</span>
                      <span className="text-[10px] font-semibold text-slate-300 block">{evt.date.split(' ')[1]}</span>
                    </div>

                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{evt.category}</span>
                      <h4 className="text-sm font-serif font-bold text-navy hover:text-gold transition-colors line-clamp-1">
                        <Link to={`/events/${evt.id}`}>{evt.title}</Link>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-gold" /> {evt.venue}
                      </p>
                      <Link to={`/events/${evt.id}`} className="text-xs font-semibold text-navy hover:text-gold mt-2 block">
                        View Event Details &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. TESTIMONIAL SLIDER - White Background */}
      <TestimonialSlider />

      {/* 11. CAMPUS GALLERY PREVIEW - Verified Loading Images */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full">
              VISUAL HIGHLIGHTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy mt-3">
              CAMPUS GALLERY
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="relative h-64 rounded-xl overflow-hidden shadow-md cursor-pointer group border border-slate-200"
              >
                <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-gold text-navy-dark px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h4 className="text-lg font-serif font-bold text-amber-100 mt-1">{item.title}</h4>
                </div>
                <div className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-full">
                  <Eye className="w-5 h-5 text-gold" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/gallery" className="inline-flex items-center bg-navy hover:bg-navy-light text-white font-bold text-xs px-7 py-3 rounded shadow uppercase tracking-wider">
              <span>EXPLORE FULL GALLERY</span> <ArrowRight className="w-4 h-4 ml-2 text-gold" />
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox for Gallery */}
      <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />

      {/* 12. NEWSLETTER */}
      <section className="py-16 bg-navy text-white border-t border-navy-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mail className="w-10 h-10 text-gold mx-auto mb-3" />
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-50">
            STAY CONNECTED WITH KALPANAAA EDUCATION
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 mb-6">
            Subscribe to receive academic notices, research breakthroughs, event invitations, and official announcements.
          </p>

          {subscribed ? (
            <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 p-4 rounded-xl max-w-md mx-auto font-medium text-sm">
              Thank you for subscribing! You will receive regular institutional updates.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-navy-dark border border-navy-light px-4 py-3 rounded text-sm text-white placeholder-slate-400 focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs uppercase tracking-wider px-7 py-3 rounded shadow transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
