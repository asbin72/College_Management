import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';

export const MainHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  // Handle scroll detection for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'Academics', path: '/academics' },
    { title: 'Admissions', path: '/admissions' },
    { title: 'Campus Life', path: '/campus-life' },
    { title: 'Faculty', path: '/faculty' },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' },
  ];

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`${
      isScrolled
        ? 'fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-md shadow-2xl py-2.5 transition-all duration-300 border-b border-gold/30'
        : isHome 
          ? 'absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white pt-4 transition-all duration-300' 
          : 'sticky top-0 z-40 bg-navy text-white shadow-xl border-b border-navy-light/40 py-3 transition-all duration-300'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CASE 1: HOME UN-SCROLLED HEADER (Original Centered Logo + Centered Navigation Below) */}
        {isHome && !isScrolled ? (
          <div className="pt-2 pb-3 flex flex-col items-center">
            {/* Centered Crest Emblem Logo & Title */}
            <Link to="/" className="flex flex-col items-center group mb-4" onClick={handleMobileNavClick} title="Kalpanaaa Education Home">
              <img
                src="/logo.png"
                alt="Kalpanaaa Education Crest Logo"
                className="h-16 sm:h-20 w-auto object-contain transition-transform group-hover:scale-105 filter drop-shadow-xl mb-1.5"
              />
              <span className="text-2xl sm:text-3xl font-serif font-bold tracking-[0.18em] text-white leading-none group-hover:text-gold transition-colors">
                KALPANAAA
              </span>
              <span className="text-[10px] font-bold tracking-[0.3em] text-gold uppercase mt-1">
                SINCE 2001 &bull; EDUCATION
              </span>
            </Link>

            {/* Desktop Centered Navigation Bar (Academics, Admissions, Campus Life, Faculty, About, Contact) */}
            <nav className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8">
              {navLinks.map((link, idx) => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));

                return (
                  <Link
                    key={idx}
                    to={link.path}
                    className={`text-xs sm:text-sm font-semibold tracking-wide transition-all ${
                      isActive ? 'text-gold border-b-2 border-gold pb-0.5 font-bold' : 'text-slate-100 hover:text-gold'
                    }`}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Hamburger Bar */}
            <div className="w-full flex items-center justify-between lg:hidden pt-2">
              <Link to="/" className="flex items-center space-x-2" onClick={handleMobileNavClick}>
                <img src="/logo.png" alt="Crest" className="h-7 w-auto object-contain" />
                <span className="text-xs font-serif font-bold text-amber-50 tracking-wider">KALPANAAA</span>
              </Link>

              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="bg-gold text-navy-dark font-bold text-xs px-3 py-1 rounded flex items-center"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1" />
                  LOGIN
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 text-slate-200 hover:text-gold focus:outline-none"
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* CASE 2: SCROLLED OR INTERIOR PAGES HEADER (Logo Left, Nav Center, Login/Signup Right) */
          <div className="flex items-center justify-between">
            
            {/* LEFT SIDE: Crest Logo & KALPANAAA EDUCATION */}
            <Link to="/" className="flex items-center space-x-3 group flex-shrink-0" onClick={handleMobileNavClick} title="Kalpanaaa Education Home">
              <img
                src="/logo.png"
                alt="Kalpanaaa Crest Logo"
                className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105 filter drop-shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-serif font-bold tracking-[0.12em] text-white leading-none group-hover:text-gold transition-colors">
                  KALPANAAA
                </span>
                <span className="text-[8px] font-bold tracking-[0.25em] text-gold uppercase mt-0.5">
                  EDUCATION
                </span>
              </div>
            </Link>

            {/* CENTER: Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link, idx) => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));

                return (
                  <Link
                    key={idx}
                    to={link.path}
                    className={`text-xs sm:text-sm font-semibold tracking-wide transition-all ${
                      isActive ? 'text-gold border-b-2 border-gold pb-0.5 font-bold' : 'text-slate-100 hover:text-gold'
                    }`}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT SIDE: LOGIN & SIGNUP Buttons */}
            <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
              <Link
                to="/login"
                className="inline-flex items-center bg-transparent hover:bg-white/10 text-white font-bold text-xs px-3.5 py-1.5 rounded border border-white/30 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 mr-1.5 text-gold" />
                <span>LOGIN</span>
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs px-4 py-1.5 rounded shadow-lg transition-transform hover:scale-105 uppercase tracking-wider"
              >
                <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                <span>SIGNUP</span>
              </Link>
            </div>

            {/* Mobile Hamburger Bar */}
            <div className="flex items-center space-x-2 lg:hidden">
              <Link
                to="/login"
                className="bg-gold text-navy-dark font-bold text-xs px-3 py-1 rounded flex items-center"
              >
                <LogIn className="w-3.5 h-3.5 mr-1" />
                LOGIN
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-slate-200 hover:text-gold focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-dark border-t border-navy-light px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              onClick={handleMobileNavClick}
              className="block py-2 text-sm font-bold text-slate-200 hover:text-gold uppercase tracking-wider border-b border-navy-light/40 last:border-0"
            >
              {link.title}
            </Link>
          ))}

          <div className="pt-2 flex flex-col space-y-2">
            <Link
              to="/login"
              onClick={handleMobileNavClick}
              className="w-full text-center bg-white/10 text-white font-bold text-xs py-2.5 rounded border border-white/20"
            >
              LOGIN
            </Link>
            <Link
              to="/signup"
              onClick={handleMobileNavClick}
              className="w-full text-center bg-gold text-navy-dark font-bold text-xs py-2.5 rounded uppercase tracking-wider shadow"
            >
              SIGNUP
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
