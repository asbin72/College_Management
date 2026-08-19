import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

export const TestimonialSlider = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sundaram",
      course: "B.Tech Computer Science & Engineering",
      year: "Batch of 2024",
      role: "Software Development Engineer @ Google",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      quote: "Kalpanaaa Education provided me with world-class technical exposure, hands-on software engineering labs, and direct mentorship from faculty that prepared me for global tech interviews."
    },
    {
      id: 2,
      name: "Vikramaditya Roy",
      course: "Master of Business Administration (MBA)",
      year: "Batch of 2023",
      role: "Senior Financial Analyst @ Goldman Sachs",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      quote: "The Bloomberg Trading Lab and rigorous business simulation curriculum at Kalpanaaa allowed me to transition directly into high-stakes investment banking with confidence."
    },
    {
      id: 3,
      name: "Rohan Verma",
      course: "B.Tech Information Technology",
      year: "Batch of 2025",
      role: "Cybersecurity Specialist @ Microsoft",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      quote: "From state-of-the-art hacking lab environments to national hackathons hosted on campus, Kalpanaaa Education nurtured my passion for software engineering from day one."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => setCurrentIndex(i => i === 0 ? testimonials.length - 1 : i - 1);
  const next = () => setCurrentIndex(i => (i + 1) % testimonials.length);

  const t = testimonials[currentIndex];

  return (
    <div className="bg-white text-slate-800 py-20 relative overflow-hidden border-t border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-12">
          <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full">
            STUDENT VOICES & ALUMNI SUCCESS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy mt-3">
            What Our Students & Graduates Say
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-4 rounded-full" />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm relative">
          <Quote className="absolute top-6 left-6 text-gold/15 w-20 h-20 -z-0" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Student Image */}
            <div className="flex-shrink-0">
              <img
                src={t.image}
                alt={t.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-gold shadow-lg"
              />
            </div>

            {/* Testimonial Details */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              <p className="text-slate-700 text-base sm:text-lg italic font-sans mb-6 leading-relaxed">
                "{t.quote}"
              </p>

              <div>
                <h4 className="text-xl font-serif font-bold text-navy">{t.name}</h4>
                <p className="text-gold-hover text-sm font-semibold">{t.role}</p>
                <p className="text-slate-500 text-xs mt-0.5">{t.course} ({t.year})</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center md:justify-end space-x-3 mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={prev}
              className="p-2.5 rounded-full bg-white hover:bg-gold hover:text-navy-dark transition-colors text-navy border border-slate-300 shadow-sm"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="p-2.5 rounded-full bg-white hover:bg-gold hover:text-navy-dark transition-colors text-navy border border-slate-300 shadow-sm"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
