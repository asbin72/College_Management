import React, { useState } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Lightbox } from '../../components/common/Lightbox';
import { Calendar, MapPin, Eye, Filter, X } from 'lucide-react';

export const Gallery = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeLightbox, setActiveLightbox] = useState(null);

  const galleryItems = [
    {
      id: 1,
      title: "Annual Convocation & Graduation Ceremony 2026",
      category: "Events & Convocation",
      date: "March 15, 2026",
      venue: "Grand Auditorium & Main Quadrangle",
      description: "Over 1,200 doctorate, postgraduate, and undergraduate scholars received their official degrees from the Chief Guest and Honorable Vice-Chancellor.",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200",
      featured: true
    },
    {
      id: 2,
      title: "Inauguration of NVIDIA AI & Cloud Computing Hub",
      category: "Labs & Innovation",
      date: "February 02, 2026",
      venue: "Turing Block, 3rd Floor",
      description: "State-of-the-art supercomputing laboratory equipped with NVIDIA H100 GPUs for deep learning research, generative AI modeling, and student projects.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200",
      featured: false
    },
    {
      id: 3,
      title: "Central University Library & Digital Knowledge Resource Center",
      category: "Campus & Architecture",
      date: "January 10, 2026",
      venue: "Aryabhata Academic Complex",
      description: "24/7 digital learning hub featuring over 100,000 physical volumes, quiet study pods, online IEEE/Springer journals, and multimedia stations.",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200",
      featured: true
    },
    {
      id: 4,
      title: "Kalpanaaa Global Youth Cultural Fest 'Tarang 2025'",
      category: "Sports & Cultural Fests",
      date: "November 20, 2025",
      venue: "Open Air Theatre & Sports Ground",
      description: "A 3-day inter-college mega cultural festival featuring battle of the bands, classical dance competitions, fashion shows, and live musical concerts.",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200",
      featured: false
    },
    {
      id: 5,
      title: "Inter-University Championship at Sports & Athletics Arena",
      category: "Sports & Cultural Fests",
      date: "October 24, 2025",
      venue: "Olympic Outdoor Stadium",
      description: "Annual university sports meet hosting track events, football finals, basketball championships, and martial arts showcases.",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1200",
      featured: false
    },
    {
      id: 6,
      title: "National Student Hackathon & Developer Summit 'HackKalpanaaa'",
      category: "Events & Convocation",
      date: "September 12, 2025",
      venue: "Innovation Incubator Center",
      description: "36-hour non-stop coding hackathon with 500+ participants building solutions for AI, fintech, smart mobility, and healthcare.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
      featured: true
    },
    {
      id: 7,
      title: "Advanced Robotics & Automation Prototyping Suite",
      category: "Labs & Innovation",
      date: "August 18, 2025",
      venue: "Bhabha Research Block",
      description: "Hands-on engineering lab equipped with 6-axis robotic arms, 3D printing stations, and autonomous drone testing arenas.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
      featured: false
    },
    {
      id: 8,
      title: "Student Residence & Eco-Friendly Green Quadrangle",
      category: "Campus & Architecture",
      date: "June 05, 2025",
      venue: "Hostel Residential Block",
      description: "Lush green 100-acre sustainable campus campus quadrangle equipped with solar micro-grids, rainwater harvesting, and eco-parks.",
      image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1200",
      featured: false
    }
  ];

  const categories = ['All', 'Campus & Architecture', 'Labs & Innovation', 'Events & Convocation', 'Sports & Cultural Fests'];

  const filteredItems = galleryItems.filter(item => {
    if (selectedFilter === 'All') return true;
    return item.category === selectedFilter;
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Breadcrumbs />

      {/* Hero Header */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/30">
            VISUAL ARCHIVES & EVENTS
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4 tracking-tight">
            Campus Photo & Media Gallery
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Explore moments of academic achievements, AI lab breakthroughs, graduation convocations, and vibrant student cultural festivals.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap justify-center items-center gap-2.5 mt-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === cat
                    ? 'bg-navy text-gold shadow-lg scale-105 border border-gold/40'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveLightbox(item)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container with Zoom effect */}
              <div className="h-60 relative overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-navy/90 text-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-gold/30">
                  {item.category}
                </div>

                {/* Date Stamp Badge */}
                <div className="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center bg-black/50 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-gold" />
                  <span className="font-num">{item.date}</span>
                </div>

                <div className="absolute bottom-3 right-3 w-8 h-8 bg-gold text-navy-dark rounded-full flex items-center justify-center shadow transition-transform transform group-hover:scale-110">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              {/* Card Body & Description */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-navy group-hover:text-gold transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500 font-serif">
                  <span className="flex items-center text-slate-600">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gold" />
                    {item.venue}
                  </span>
                  <span className="font-sans font-bold text-navy group-hover:underline">
                    View Story &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX MODAL WITH EVENT DETAILS & DATE */}
      {activeLightbox && (
        <div
          onClick={() => setActiveLightbox(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-300 relative flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 z-20 text-white bg-black/60 hover:bg-black p-2 rounded-full transition-colors border border-white/20"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Image Half */}
            <div className="md:w-7/12 bg-slate-900 relative flex items-center justify-center">
              <img
                src={activeLightbox.image}
                alt={activeLightbox.title}
                className="w-full h-full object-cover max-h-[500px] md:max-h-none"
              />
            </div>

            {/* Right Story Half */}
            <div className="md:w-5/12 p-6 sm:p-8 space-y-4 flex flex-col justify-between bg-white text-slate-800">
              <div className="space-y-3">
                <span className="text-navy text-[10px] font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded border border-gold/30 inline-block">
                  {activeLightbox.category}
                </span>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-navy leading-snug">
                  {activeLightbox.title}
                </h3>

                {/* Event Date & Location */}
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 font-serif">
                  <div className="flex items-center font-bold text-navy">
                    <Calendar className="w-4 h-4 mr-2 text-gold" />
                    <span>Date of Event: <strong className="font-num text-gold-hover">{activeLightbox.date}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gold" />
                    <span>Campus Venue: <strong>{activeLightbox.venue}</strong></span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Event Highlights & Summary</span>
                  <p className="text-slate-700 text-xs sm:text-sm font-serif leading-relaxed">
                    {activeLightbox.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => setActiveLightbox(null)}
                  className="w-full py-2.5 bg-navy text-white hover:bg-navy-light font-bold text-xs rounded-xl shadow uppercase tracking-wider"
                >
                  Close Story Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
