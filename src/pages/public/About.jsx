import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { CheckCircle2, Award, Target, BookOpen, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Header - White Background */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.25em] bg-gold/10 px-3.5 py-1.5 rounded-full">
            ABOUT KALPANAAA EDUCATION
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Legacy of Educational Distinction & Innovation
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-sans leading-relaxed">
            Empowering students to think critically, innovate fearlessly, and lead ethically on a global stage.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-gold text-xs font-bold uppercase tracking-widest">OUR FOUNDING STORY</span>
            <h2 className="text-3xl font-serif font-bold text-navy">Building a Premier University Ecosystem</h2>
            <div className="w-12 h-1 bg-gold rounded-full" />
            <p className="text-slate-600 text-sm leading-relaxed">
              Established in 2001, Kalpanaaa Education began with a vision to revolutionize higher education by integrating rigorous scientific inquiry with compassionate societal service. Over two decades, we have grown from a specialized institute to a multi-disciplinary university system educating over 2,500 students annually across 25+ undergraduate, postgraduate, and doctoral degree programs.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our campus spans 45 acres of green, tech-enabled infrastructure equipped with advanced computing hubs, Bloomberg financial terminals, high-speed research labs, and expansive sports fields.
            </p>
          </div>
          <div className="lg:col-span-6">
            <img
              src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1000"
              alt="Kalpanaaa Education Campus Building"
              className="rounded-xl shadow-lg border-4 border-slate-100 object-cover w-full h-[380px]"
            />
          </div>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-navy text-white p-8 rounded-2xl shadow-xl border-t-4 border-gold">
            <Target className="w-10 h-10 text-gold mb-4" />
            <h3 className="text-2xl font-serif font-bold text-amber-50 mb-3">OUR VISION</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              To be a global beacon of higher learning recognized for research excellence, innovative pedagogy, multi-disciplinary collaboration, and producing ethical leaders who transform society and industry.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 border-t-4 border-navy">
            <BookOpen className="w-10 h-10 text-navy mb-4" />
            <h3 className="text-2xl font-serif font-bold text-navy mb-3">OUR MISSION</h3>
            <ul className="space-y-2 text-slate-600 text-xs sm:text-sm">
              <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-gold mr-2 mt-0.5 flex-shrink-0" />Deliver rigorous, outcome-based academic programs across engineering, business, and sciences.</li>
              <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-gold mr-2 mt-0.5 flex-shrink-0" />Foster cutting-edge research, patent creation, and startup incubation.</li>
              <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-gold mr-2 mt-0.5 flex-shrink-0" />Cultivate inclusive campus culture and lifelong alumni engagement.</li>
            </ul>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-serif font-bold text-navy">CORE INSTITUTIONAL VALUES</h2>
            <div className="w-12 h-1 bg-gold mx-auto mt-2 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-xl text-center">
              <Award className="w-8 h-8 text-gold mx-auto mb-3" />
              <h4 className="font-serif font-bold text-navy text-lg mb-1">Academic Integrity</h4>
              <p className="text-xs text-slate-600">Uncompromising commitment to truth, intellectual honesty, and scholarship.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl text-center">
              <ShieldCheck className="w-8 h-8 text-gold mx-auto mb-3" />
              <h4 className="font-serif font-bold text-navy text-lg mb-1">Innovation & Rigor</h4>
              <p className="text-xs text-slate-600">Pushing technological boundaries through hands-on practical experimentation.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl text-center">
              <HeartHandshake className="w-8 h-8 text-gold mx-auto mb-3" />
              <h4 className="font-serif font-bold text-navy text-lg mb-1">Ethical Leadership</h4>
              <p className="text-xs text-slate-600">Instilling responsibility, empathy, and social service in all our scholars.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-navy text-white p-8 sm:p-12 rounded-2xl text-center shadow-2xl border-4 border-gold">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-50 mb-3">Explore Leadership & Governance</h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            Meet our esteemed board of trustees, deans, department heads, and academic directors shaping our vision.
          </p>
          <Link to="/about/leadership" className="inline-block bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs px-8 py-3.5 rounded uppercase tracking-wider shadow">
            MEET OUR LEADERSHIP
          </Link>
        </div>

      </div>
    </div>
  );
};
