import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight, X } from 'lucide-react';

export const HeroSlider = () => {
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=2000",
      headline: "WELCOME TO KALPANAAA",
      subtitle: "A place with diverse nationalities, cultures and ideas",
      ctaText: "Start your application",
      ctaLink: "/admissions/application"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=2000",
      headline: "DISCOVER YOUR POTENTIAL",
      subtitle: "Empowering minds through innovation, research and academic excellence",
      ctaText: "Explore Degree Programs",
      ctaLink: "/academics/courses"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000",
      headline: "LEARN. GROW. LEAD.",
      subtitle: "World-class facilities, expert doctorate faculty and career placement leadership",
      ctaText: "Visit Campus Life",
      ctaLink: "/campus-life"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Continuous auto slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowVideoModal(false);
    }
  };

  return (
    <div className="relative w-full h-[580px] sm:h-[680px] lg:h-[780px] xl:h-[840px] overflow-hidden bg-navy-dark">
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image */}
            <div 
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-7000 ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-black/55 backdrop-brightness-90" />

            {/* Centered Hero Content */}
            <div className="relative h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center text-white pt-24 sm:pt-28" style={{ fontFamily: 'var(--font-third)' }}>
              
              {/* Centered Circular Play Video Button - Gold Accent */}
              <div 
                onClick={() => setShowVideoModal(true)}
                className="group relative cursor-pointer mb-6 sm:mb-8"
              >
                <div className="absolute -inset-3 rounded-full bg-gold/30 animate-ping opacity-75" />
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white text-navy-dark rounded-full flex items-center justify-center shadow-2xl transition-transform transform group-hover:scale-110 border-4 border-white/40 z-10 relative">
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 text-gold fill-gold ml-1" />
                </div>
              </div>

              {/* Centered Large Uppercase Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight uppercase leading-tight text-white drop-shadow-lg mb-4 sm:mb-6" style={{ fontFamily: 'var(--font-third)', fontWeight: 700 }}>
                {slide.headline}
              </h1>

              {/* Centered Subtitle */}
              <p className="text-base sm:text-xl lg:text-2xl text-amber-50 font-normal max-w-3xl leading-relaxed drop-shadow mb-8 sm:mb-10" style={{ fontFamily: 'var(--font-third)', fontWeight: 400 }}>
                {slide.subtitle}
              </p>

              {/* Centered Gold Call to Action Button */}
              <div>
                <Link
                  to={slide.ctaLink}
                  style={{ fontFamily: 'var(--font-third)' }}
                  className="inline-block bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs sm:text-sm tracking-wider px-8 sm:px-10 py-4 sm:py-4.5 rounded shadow-2xl transition-all transform hover:-translate-y-0.5 uppercase"
                >
                  {slide.ctaText}
                </Link>
              </div>

            </div>
          </div>
        );
      })}

      {/* Prev / Next Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white bg-black/40 hover:bg-black/80 p-3 rounded-full transition-colors border border-white/20"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white bg-black/40 hover:bg-black/80 p-3 rounded-full transition-colors border border-white/20"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all ${
              idx === currentIndex ? 'w-8 bg-gold' : 'w-2.5 bg-white/40 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Campus Video Modal - Click outside closes, Close button inside box */}
      {showVideoModal && (
        <div 
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
        >
          {/* Rectangular Modal Container */}
          <div className="relative max-w-4xl w-full bg-navy-dark rounded-2xl overflow-hidden shadow-2xl border border-navy-light/60 p-6 sm:p-8">
            
            {/* Close Button INSIDE the Rectangular Box (Top-Right) */}
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 text-slate-300 hover:text-gold bg-navy-light/60 hover:bg-navy p-2 rounded-full transition-colors z-20 shadow-md border border-white/10"
              aria-label="Close Video Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Heading */}
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-50 text-center mb-6 pr-8">
              Kalpanaaa Education Official Campus Tour
            </h3>
            
            {/* Embedded YouTube Campus Tour Video */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-inner border border-slate-800">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/L_LUpnjgPso?autoplay=1&rel=0"
                title="Kalpanaaa Education Campus Tour Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Credits & Attribution */}
            <div className="mt-4 pt-3 border-t border-navy-light/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
              <span className="italic">
                Video Credit & Source: YouTube / University Campus Tour & Architecture
              </span>
              <span className="mt-1 sm:mt-0 font-semibold text-gold">
                Kalpanaaa Education Visual Archives &copy; 2026
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
