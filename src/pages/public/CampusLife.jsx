import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Cpu, Heart, Camera, Calendar, MapPin, Music, Code, Globe, Coffee, Rocket } from 'lucide-react';

const ImageWithFallback = ({ src, alt, className, category }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-navy via-slate-800 to-navy-dark flex flex-col items-center justify-center p-4 text-center ${className}`}>
        <Camera className="w-7 h-7 text-gold mb-1.5 opacity-90" />
        {category && (
          <span className="text-[9px] text-gold font-bold uppercase tracking-widest bg-gold/20 px-2 py-0.5 rounded border border-gold/30 mb-1">
            {category}
          </span>
        )}
        <span className="text-xs font-serif text-white font-bold line-clamp-1 max-w-[90%]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

export const CampusLife = () => {
  const location = useLocation();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (location.pathname.includes('/library')) {
      setTimeout(() => scrollToSection('university-library'), 100);
    } else if (location.pathname.includes('/events')) {
      setTimeout(() => scrollToSection('upcoming-events'), 100);
    } else if (location.pathname.includes('/sports')) {
      setTimeout(() => scrollToSection('sports-athletics'), 100);
    } else if (location.pathname.includes('/clubs')) {
      setTimeout(() => scrollToSection('student-clubs'), 100);
    } else if (location.pathname.includes('/hostel')) {
      setTimeout(() => scrollToSection('hostel-life'), 100);
    }
  }, [location]);

  // 6 Items for Campus Overview
  const campusOverviewPhotos = [
    {
      title: "100-Acre Smart Eco-Campus",
      category: "INFRASTRUCTURE",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
      description: "Lush green academic quadrangle featuring solar micro-grids, rainwater harvesting systems, eco-parks, and high-speed Wi-Fi across all plazas."
    },
    {
      title: "Aryabhata Academic & Innovation Complex",
      category: "ACADEMIC BUILDING",
      image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800",
      description: "State-of-the-art smart lecture theatres, research institutes, digital seminar halls, and faculty chambers."
    },
    {
      title: "Turing Advanced Computing & AI Hub",
      category: "INNOVATION PARK",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
      description: "Glass-facade high-performance computing institute hosting NVIDIA GPU clusters, IoT testbeds, and robotics labs."
    },
    {
      title: "Open-Air Amphitheatre & Cultural Quad",
      category: "STUDENT QUADRANGLE",
      image: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&q=80&w=800",
      description: "Tiered seating outdoor amphitheatre hosting student theatrical plays, acoustic music nights, and debates."
    },
    {
      title: "Ramanujam Mathematical Sciences Tower",
      category: "RESEARCH TOWER",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800",
      description: "Dedicated research tower equipped with advanced data analytics suites and pure mathematics seminar halls."
    },
    {
      title: "Central Student Plaza & Coffee Promenade",
      category: "SOCIAL CAFETERIA",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
      description: "Vibrant social food court featuring multinational cuisine outlets, outdoor cafes, and collaborative student lounges."
    }
  ];

  // 6 Items for Library
  const libraryPhotos = [
    {
      title: "Central University Knowledge Commons",
      category: "24/7 DIGITAL HUB",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800",
      description: "Over 100,000 physical volumes, 24/7 digital access to IEEE, ACM, Springer & Elsevier databases, and quiet study pods."
    },
    {
      title: "Bloomberg Financial Trading & Analytics Lab",
      category: "FINANCE & DATA LAB",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
      description: "Equipped with live Bloomberg terminals for MBA candidates and high-performance computing stations for AI research."
    },
    {
      title: "Digital E-Journal Suite & Silent Pods",
      category: "RESEARCH PODS",
      image: "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800",
      description: "Acoustically insulated private study pods with ultra-wide monitors and high-speed research network access."
    },
    {
      title: "Rare Manuscripts & Archives Gallery",
      category: "SPECIAL COLLECTIONS",
      image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800",
      description: "Temperature-controlled repository preserving historical regional manuscripts, rare scientific treaties, and early institutional records."
    },
    {
      title: "Audio-Visual Media Screening Room",
      category: "MEDIA COMMONS",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800",
      description: "Multi-seat HD screening facility for academic documentary viewings, language listening labs, and digital conference recordings."
    },
    {
      title: "Automated RFID Issue & Return Kiosks",
      category: "SMART TECH",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
      description: "Self-checkout RFID stations and automated book drop-boxes enabling seamless round-the-clock borrowing without queues."
    }
  ];

  // 6 Items for Sports & Athletics
  const sportsPhotos = [
    {
      title: "Olympic Indoor Swimming Pool & Aquatic Center",
      category: "AQUATICS",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800",
      description: "Temperature-controlled 50m indoor swimming pool with professional coaches and inter-university swimming tournaments."
    },
    {
      title: "Multi-Court Indoor Basketball & Volleyball Arena",
      category: "INDOOR ARENA",
      image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800",
      description: "Maple-wood flooring courts with spectator seating for 1,500 students, hosting regional college championships."
    },
    {
      title: "Outdoor Athletics Stadium & Football Turf",
      category: "OUTDOOR SPORTS",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
      description: "Synthetic 400m athletics running track, floodlit football field, and professional cricket pitch."
    },
    {
      title: "High-Performance Strength & Fitness Gym",
      category: "FITNESS CENTER",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
      description: "State-of-the-art weight training, cardio equipment, personal fitness trainers, and nutrition consultation."
    },
    {
      title: "Floodlit Synthetic Tennis & Badminton Courts",
      category: "RACQUET SPORTS",
      image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800",
      description: "4 floodlit synthetic hard tennis courts and 6 indoor badminton courts for evening matches."
    },
    {
      title: "Martial Arts & Yoga Wellness Studio",
      category: "WELLNESS & DOJO",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800",
      description: "Dedicated taekwondo, karate practice mats, and daily guided yoga and mindfulness sessions."
    }
  ];

  // 6 Items for Student Clubs
  const studentClubs = [
    {
      name: "Google Developer Student Club & Hackers Wing",
      category: "TECHNOLOGY & CODING",
      icon: Code,
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
      description: "Organizes 36-hour hackathons, open-source sprints, AI workshops, and competitive programming bootcamps."
    },
    {
      name: "Robotics & Autonomous Systems Society",
      category: "HARDWARE & AI",
      icon: Cpu,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
      description: "Building autonomous drones, 6-axis robotic arms, and participating in national Robocon competitions."
    },
    {
      name: "Literary, Parliamentary Debate & Model UN",
      category: "ORATORY & DEBATE",
      icon: Globe,
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800",
      description: "Hosting annual inter-college parliamentary debates, Model United Nations conferences, and creative writing slams."
    },
    {
      name: "Cultural Ensemble 'Tarang' - Music & Drama",
      category: "PERFORMING ARTS",
      icon: Music,
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
      description: "Classical and western music bands, theatrical productions, street plays (Nukkad Natak), and dance fests."
    },
    {
      name: "NSS & Environmental Conservation Wing",
      category: "COMMUNITY SERVICE",
      icon: Heart,
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800",
      description: "Social outreach programs, blood donation camps, digital literacy drives for rural schools, and tree plantation drives."
    },
    {
      name: "E-Cell & Startup Incubation Society",
      category: "ENTREPRENEURSHIP",
      icon: Rocket,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
      description: "Empowering student founders with pitch competitions, angel investor networking, and prototype grants."
    }
  ];

  // 6 Items for Upcoming Events
  const upcomingEvents = [
    {
      title: "National Student Hackathon 'HackKalpanaaa 2026'",
      date: "September 12 - 14, 2026",
      venue: "Turing Innovation Hub",
      category: "TECH SUMMIT",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
      summary: "36-hour continuous coding hackathon with 500+ participants competing for ₹5 Lakhs in prize money and VC funding mentorship."
    },
    {
      title: "Kalpanaaa Global Youth Cultural Fest 'Tarang 2026'",
      date: "November 18 - 21, 2026",
      venue: "Open Air Theatre & Quadrangle",
      category: "CULTURAL FEST",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
      summary: "4-day mega inter-college cultural fest featuring battle of the bands, pro-nights, celebrity performances, and fashion shows."
    },
    {
      title: "Global AI, Quantum & Deep Tech Summit 2026",
      date: "December 05 - 07, 2026",
      venue: "Grand Auditorium Complex",
      category: "ACADEMIC CONFERENCE",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
      summary: "International research conference hosting keynote speakers from MIT, Stanford, IISc, Google DeepMind, and NVIDIA."
    },
    {
      title: "Annual University Sports Meet 'Spardha 2027'",
      date: "January 15 - 18, 2027",
      venue: "Olympic Athletics Stadium",
      category: "SPORTS FESTIVAL",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
      summary: "Inter-departmental athletics tournament, football league finals, cricket trophies, and martial arts showcases."
    },
    {
      title: "Annual Robotics Expo & Drone Racing Championship",
      date: "February 10 - 12, 2027",
      venue: "Indoor Exhibition Arena",
      category: "ROBOTICS EXPO",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
      summary: "National autonomous drone obstacles racing, combat robotics, and AI hardware demonstrations."
    },
    {
      title: "Annual Convocation & Graduation Ceremony 2027",
      date: "March 25, 2027",
      venue: "Central Auditorium",
      category: "CONVOCATION",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800",
      summary: "Honoring 2,500 graduating scholars with degree conferrals, gold medals, and distinguished alumni addresses."
    }
  ];

  // 3 Items for Hostel Facilities
  const hostelPhotos = [
    {
      title: "Air-Conditioned Deluxe Dormitory Rooms",
      category: "ACCOMMODATION",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
      description: "Ergonomic study desks, personal wardrobes, high-speed Wi-Fi, and daily housekeeping."
    },
    {
      title: "Hygienic Multi-Cuisine Student Dining Hall",
      category: "DINING HALL",
      image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&q=80&w=800",
      description: "Serving 4 fresh nutritious meals daily under strict FSSAI quality standards."
    },
    {
      title: "Indoor Recreation Center & Student Lounge",
      category: "RECREATION",
      image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=800",
      description: "Table tennis, pool tables, board games, and widescreen TV lounges for relaxation."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Breadcrumbs />

      {/* Hero Header */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/30">
            VIBRANT STUDENT LIFE & CULTURE
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4 tracking-tight">
            Experience Life at Kalpanaaa Education
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-3xl mx-auto mt-3 leading-relaxed">
            Life at Kalpanaaa goes beyond textbooks. Explore world-class athletics, 24/7 digital libraries, 30+ student clubs, high-tech hackathons, and annual cultural celebrations.
          </p>

          {/* Interactive Section Anchor Navigation Pills */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
            <button
              onClick={() => scrollToSection('campus-overview')}
              className="px-4 py-2 bg-slate-100 hover:bg-navy hover:text-gold text-slate-700 font-bold text-xs rounded-xl border border-slate-300/80 shadow-sm transition-all flex items-center space-x-1.5 group"
            >
              <span>Campus Overview</span>
              <span className="text-gold group-hover:translate-y-0.5 transition-transform">&darr;</span>
            </button>
            <button
              onClick={() => scrollToSection('university-library')}
              className="px-4 py-2 bg-slate-100 hover:bg-navy hover:text-gold text-slate-700 font-bold text-xs rounded-xl border border-slate-300/80 shadow-sm transition-all flex items-center space-x-1.5 group"
            >
              <span>University Library</span>
              <span className="text-gold group-hover:translate-y-0.5 transition-transform">&darr;</span>
            </button>
            <button
              onClick={() => scrollToSection('sports-athletics')}
              className="px-4 py-2 bg-slate-100 hover:bg-navy hover:text-gold text-slate-700 font-bold text-xs rounded-xl border border-slate-300/80 shadow-sm transition-all flex items-center space-x-1.5 group"
            >
              <span>Sports & Athletics</span>
              <span className="text-gold group-hover:translate-y-0.5 transition-transform">&darr;</span>
            </button>
            <button
              onClick={() => scrollToSection('student-clubs')}
              className="px-4 py-2 bg-slate-100 hover:bg-navy hover:text-gold text-slate-700 font-bold text-xs rounded-xl border border-slate-300/80 shadow-sm transition-all flex items-center space-x-1.5 group"
            >
              <span>Student Clubs</span>
              <span className="text-gold group-hover:translate-y-0.5 transition-transform">&darr;</span>
            </button>
            <button
              onClick={() => scrollToSection('upcoming-events')}
              className="px-4 py-2 bg-slate-100 hover:bg-navy hover:text-gold text-slate-700 font-bold text-xs rounded-xl border border-slate-300/80 shadow-sm transition-all flex items-center space-x-1.5 group"
            >
              <span>Upcoming Events</span>
              <span className="text-gold group-hover:translate-y-0.5 transition-transform">&darr;</span>
            </button>
            <button
              onClick={() => scrollToSection('hostel-life')}
              className="px-4 py-2 bg-slate-100 hover:bg-navy hover:text-gold text-slate-700 font-bold text-xs rounded-xl border border-slate-300/80 shadow-sm transition-all flex items-center space-x-1.5 group"
            >
              <span>Hostel Life</span>
              <span className="text-gold group-hover:translate-y-0.5 transition-transform">&darr;</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* SECTION 1: CAMPUS OVERVIEW (6 ITEMS - 3 COLUMNS) */}
        <section id="campus-overview" className="space-y-8 scroll-mt-24">
          <div className="flex justify-between items-end border-b border-slate-200 pb-4">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest">100-ACRE SMART CAMPUS</span>
              <h2 className="text-3xl font-serif font-bold text-navy mt-1">Campus Overview & Architecture</h2>
            </div>
            <Link to="/gallery" className="text-xs font-bold text-navy hover:text-gold flex items-center">
              View Full Photo Gallery &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campusOverviewPhotos.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <ImageWithFallback 
                      src={item.image} 
                      alt={item.title} 
                      category={item.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 bg-navy text-gold text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider z-10">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-serif font-bold text-navy group-hover:text-gold transition-colors leading-snug">{item.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: UNIVERSITY LIBRARY (3 ITEMS - 3 COLUMNS) */}
        <section id="university-library" className="space-y-8 scroll-mt-24">
          <div className="flex justify-between items-end border-b border-slate-200 pb-4">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest">ACADEMIC EXCELLENCE</span>
              <h2 className="text-3xl font-serif font-bold text-navy mt-1">Central University Library & Digital Knowledge Hub</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {libraryPhotos.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <ImageWithFallback 
                      src={item.image} 
                      alt={item.title} 
                      category={item.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 bg-navy text-gold text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider z-10">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-serif font-bold text-navy group-hover:text-gold transition-colors leading-snug">{item.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: SPORTS & ATHLETICS (6 ITEMS - 3 COLUMNS) */}
        <section id="sports-athletics" className="space-y-8 scroll-mt-24">
          <div className="flex justify-between items-end border-b border-slate-200 pb-4">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest">FITNESS & RECREATION</span>
              <h2 className="text-3xl font-serif font-bold text-navy mt-1">Sports & Athletics Complex</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sportsPhotos.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <ImageWithFallback 
                      src={item.image} 
                      alt={item.title} 
                      category={item.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 bg-navy text-gold text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider z-10">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-serif font-bold text-navy group-hover:text-gold transition-colors leading-snug">{item.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: STUDENT CLUBS & SOCIETIES (6 ITEMS - 3 COLUMNS) */}
        <section id="student-clubs" className="space-y-8 scroll-mt-24">
          <div className="flex justify-between items-end border-b border-slate-200 pb-4">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest">30+ STUDENT ORGANIZATIONS</span>
              <h2 className="text-3xl font-serif font-bold text-navy mt-1">Student Clubs & Societies</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentClubs.map((club, idx) => {
              const IconComp = club.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all group flex flex-col justify-between">
                  <div>
                    <div className="h-48 overflow-hidden relative">
                      <ImageWithFallback 
                        src={club.image} 
                        alt={club.name} 
                        category={club.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 left-3 bg-navy text-gold text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider z-10">
                        {club.category}
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-gold/10 text-gold rounded-lg">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-serif font-bold text-navy group-hover:text-gold transition-colors leading-tight">{club.name}</h3>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed pt-1">{club.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: UPCOMING EVENTS & CULTURAL FESTS (6 ITEMS - 3 COLUMNS) */}
        <section id="upcoming-events" className="space-y-8 scroll-mt-24">
          <div className="flex justify-between items-end border-b border-slate-200 pb-4">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest">ANNUAL CALENDAR</span>
              <h2 className="text-3xl font-serif font-bold text-navy mt-1">Upcoming Events & Cultural Fests</h2>
            </div>
            <Link to="/gallery" className="text-xs font-bold text-navy hover:text-gold flex items-center">
              Explore Past Event Photos &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((evt, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <ImageWithFallback 
                      src={evt.image} 
                      alt={evt.title} 
                      category={evt.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 bg-navy text-gold text-[9px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider z-10">
                      {evt.category}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center text-xs font-bold text-gold mb-1 font-num">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        <span>{evt.date}</span>
                      </div>
                      <h3 className="text-base font-serif font-bold text-navy leading-snug group-hover:text-gold transition-colors">{evt.title}</h3>
                      <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">{evt.summary}</p>
                    </div>
                    <div className="flex items-center text-[11px] text-slate-500 font-serif pt-2 border-t border-slate-100">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-gold" />
                      <span>{evt.venue}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: HOSTEL & RESIDENTIAL LIFE (3 ITEMS - 3 COLUMNS) */}
        <section id="hostel-life" className="space-y-8 scroll-mt-24">
          <div className="flex justify-between items-end border-b border-slate-200 pb-4">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest">RESIDENTIAL FACILITIES</span>
              <h2 className="text-3xl font-serif font-bold text-navy mt-1">Student Hostels & Residential Life</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hostelPhotos.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <ImageWithFallback 
                      src={item.image} 
                      alt={item.title} 
                      category={item.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 bg-navy text-gold text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider z-10">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-serif font-bold text-navy group-hover:text-gold transition-colors leading-snug">{item.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
