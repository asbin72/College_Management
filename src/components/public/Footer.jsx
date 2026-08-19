import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-dark text-slate-300 border-t-4 border-gold">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Institutional Identity */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src="/logo.png" alt="Crest Logo" className="w-10 h-10 object-contain filter drop-shadow" />
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold text-amber-50 leading-tight">KALPANAAA</span>
                <span className="text-[9px] font-semibold tracking-widest text-gold uppercase">EDUCATION</span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-sans pt-2">
              A premier institution dedicated to academic excellence, innovative technology, holistic student growth, and ethical global leadership.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://www.facebook.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-navy-light/60 flex items-center justify-center hover:bg-gold hover:text-navy-dark transition-colors"
                aria-label="Facebook Login"
                title="Facebook Login"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/i/flow/login"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-navy-light/60 flex items-center justify-center hover:bg-gold hover:text-navy-dark transition-colors"
                aria-label="X Login"
                title="X (Twitter) Login"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-navy-light/60 flex items-center justify-center hover:bg-gold hover:text-navy-dark transition-colors"
                aria-label="LinkedIn Login"
                title="LinkedIn Login"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/accounts/login/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-navy-light/60 flex items-center justify-center hover:bg-gold hover:text-navy-dark transition-colors"
                aria-label="Instagram Login"
                title="Instagram Login"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: ACADEMICS */}
          <div>
            <h4 className="text-sm font-serif font-bold text-amber-100 uppercase tracking-wider mb-4 gold-accent-line">
              ACADEMICS
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><Link to="/academics/departments" className="hover:text-gold transition-colors flex items-center"><ArrowUpRight className="w-3 h-3 mr-1 text-gold" />Departments</Link></li>
              <li><Link to="/academics/programs" className="hover:text-gold transition-colors flex items-center"><ArrowUpRight className="w-3 h-3 mr-1 text-gold" />Programs Offered</Link></li>
              <li><Link to="/academics/courses" className="hover:text-gold transition-colors flex items-center"><ArrowUpRight className="w-3 h-3 mr-1 text-gold" />Degree Courses</Link></li>
              <li><Link to="/academics/faculty" className="hover:text-gold transition-colors flex items-center"><ArrowUpRight className="w-3 h-3 mr-1 text-gold" />Faculty Directory</Link></li>
              <li><Link to="/academics/academic-calendar" className="hover:text-gold transition-colors flex items-center"><ArrowUpRight className="w-3 h-3 mr-1 text-gold" />Academic Calendar</Link></li>
            </ul>
          </div>

          {/* Column 3: ADMISSIONS */}
          <div>
            <h4 className="text-sm font-serif font-bold text-amber-100 uppercase tracking-wider mb-4 gold-accent-line">
              ADMISSIONS
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><Link to="/admissions/application" className="hover:text-gold transition-colors flex items-center"><ArrowUpRight className="w-3 h-3 mr-1 text-gold" />Apply Online</Link></li>
              <li><Link to="/admissions/process" className="hover:text-gold transition-colors flex items-center"><ArrowUpRight className="w-3 h-3 mr-1 text-gold" />Admission Process</Link></li>
              <li><Link to="/admissions/eligibility" className="hover:text-gold transition-colors flex items-center"><ArrowUpRight className="w-3 h-3 mr-1 text-gold" />Eligibility Criteria</Link></li>
              <li><Link to="/admissions/scholarships" className="hover:text-gold transition-colors flex items-center"><ArrowUpRight className="w-3 h-3 mr-1 text-gold" />Scholarships & Aid</Link></li>
              <li><Link to="/admissions/fees" className="hover:text-gold transition-colors flex items-center"><ArrowUpRight className="w-3 h-3 mr-1 text-gold" />Fee Structure</Link></li>
            </ul>
          </div>

          {/* Column 4: CAMPUS LIFE */}
          <div>
            <h4 className="text-sm font-serif font-bold text-amber-100 uppercase tracking-wider mb-4 gold-accent-line">
              CAMPUS LIFE
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><Link to="/campus-life" className="hover:text-gold transition-colors flex items-center"><ArrowUpRight className="w-3 h-3 mr-1 text-gold" />Campus Overview</Link></li>
              <li><Link to="/campus-life/library" className="hover:text-gold transition-colors flex items-center"><ArrowUpRight className="w-3 h-3 mr-1 text-gold" />University Library</Link></li>
              <li><Link to="/campus-life/sports" className="hover:text-gold transition-colors flex items-center"><ArrowUpRight className="w-3 h-3 mr-1 text-gold" />Sports & Athletics</Link></li>
              <li><Link to="/campus-life/clubs" className="hover:text-gold transition-colors flex items-center"><ArrowUpRight className="w-3 h-3 mr-1 text-gold" />Student Clubs</Link></li>
              <li><Link to="/campus-life/events" className="hover:text-gold transition-colors flex items-center"><ArrowUpRight className="w-3 h-3 mr-1 text-gold" />Upcoming Events</Link></li>
            </ul>
          </div>

          {/* Column 5: CONTACT */}
          <div>
            <h4 className="text-sm font-serif font-bold text-amber-100 uppercase tracking-wider mb-4 gold-accent-line">
              CONTACT US
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              {/* 1. Address */}
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Knowledge Corridor, Institutional Area, Sector 12, New Delhi - 110075</span>
              </div>
              {/* 2. Office timing */}
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Office Hours: Mon - Sat, 09:00 AM - 05:00 PM</span>
              </div>
              {/* 3. Mobile / Phone */}
              <div className="flex items-center space-x-2 font-num">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span style={{ fontFamily: "'Wix Madefor Display', sans-serif" }}>+91 (11) 2890-1000</span>
              </div>
              {/* 4. Email */}
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:info@kalpanaaa.edu" className="hover:text-gold transition-colors">info@kalpanaaa.edu</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Sub-Footer */}
      <div className="bg-black/40 border-t border-navy-light/40 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="font-num" style={{ fontFamily: "'Wix Madefor Display', sans-serif" }}>
            © 2026 Kalpanaaa Education. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms & Conditions</Link>
            <Link to="/faq" className="hover:text-gold transition-colors">FAQ & Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
