import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useData } from '../../context/DataContext';
import { MapPin, Clock, ArrowRight, Search } from 'lucide-react';

export const EventList = () => {
  const { events } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'HACKATHON', 'CONFERENCE', 'CULTURAL', 'ACADEMIC'];

  const fullEventsList = [
    {
      id: "evt-1",
      title: "National Tech Summit & Developer Hackathon 2026",
      date: "15 AUG",
      fullDate: "August 15, 2026",
      time: "09:00 AM - 06:00 PM",
      category: "HACKATHON",
      venue: "Main Auditorium & Computing Labs",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000",
      description: "A 48-hour continuous software prototyping hackathon focusing on AI algorithms, Cloud infrastructure, and DevOps tools."
    },
    {
      id: "evt-2",
      title: "Global Industry Leaders & Placement Conclave",
      date: "22 AUG",
      fullDate: "August 22, 2026",
      time: "10:00 AM - 04:00 PM",
      category: "CONFERENCE",
      venue: "Convention Center & Bloomberg Hall",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000",
      description: "Corporate executives from Google, Amazon, Deloitte, and Microsoft share career trends, tech skills, and campus hiring keys."
    },
    {
      id: "evt-3",
      title: "Annual Cultural & Youth Festival 'KALPANAAA SMRITI'",
      date: "05 SEP",
      fullDate: "September 05, 2026",
      time: "05:00 PM - 10:00 PM",
      category: "CULTURAL",
      venue: "University Open Amphitheatre",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000",
      description: "An evening of musical performances, inter-college dance face-offs, drama acts, and culinary stalls."
    },
    {
      id: "evt-4",
      title: "International Symposium on Distributed Cloud Architecture",
      date: "18 SEP",
      fullDate: "September 18, 2026",
      time: "09:30 AM - 05:00 PM",
      category: "ACADEMIC",
      venue: "Turing Block Seminar Hall 3",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1000",
      description: "IEEE co-sponsored academic conference bringing together cloud security researchers and PhD scholars worldwide."
    },
    {
      id: "evt-5",
      title: "Inter-College Athletics & Aquatics Meet 2026",
      date: "10 OCT",
      fullDate: "October 10, 2026",
      time: "08:00 AM - 06:00 PM",
      category: "CULTURAL",
      venue: "University Olympic Sports Complex",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1000",
      description: "Annual sports extravaganza featuring track & field races, swimming championships, and basketball finals."
    }
  ];

  const filteredEvents = fullEventsList.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category.toUpperCase() === selectedCategory.toUpperCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Header */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.25em] bg-gold/10 px-3.5 py-1.5 rounded-full">
            CAMPUS CALENDAR 2026-2027
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Upcoming Events, Summits & Conferences
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-sans">
            Explore national developer hackathons, corporate placement conclaves, IEEE academic summits, and youth cultural fests.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
        
        {/* Filters & Search */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-2 uppercase">Event Category:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-navy text-gold shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by event title or venue..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:outline-none focus:border-navy"
            />
          </div>
        </div>

        {/* Events Cards Roster */}
        <div className="space-y-6">
          {filteredEvents.map(evt => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:border-gold hover:shadow-xl transition-all flex flex-col md:flex-row gap-6 p-6 group"
            >
              {/* Event Image & Date Badge */}
              <div className="w-full md:w-72 h-48 rounded-xl overflow-hidden relative flex-shrink-0 bg-slate-200">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-navy text-gold p-2.5 rounded-xl text-center shadow-lg border border-gold/30 font-num">
                  <span className="text-lg font-bold block leading-none">{evt.date.split(' ')[0]}</span>
                  <span className="text-[10px] font-bold uppercase block tracking-wider mt-0.5">{evt.date.split(' ')[1]}</span>
                </div>
              </div>

              {/* Event Info */}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center space-x-3 text-xs mb-1.5">
                    <span className="bg-gold/20 text-navy font-bold text-[10px] px-2.5 py-0.5 rounded uppercase border border-gold/30">
                      {evt.category}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="flex items-center text-slate-500 font-serif">
                      <Clock className="w-3.5 h-3.5 mr-1 text-gold" /> {evt.time}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-navy group-hover:text-gold transition-colors leading-tight">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 font-serif flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-gold flex-shrink-0" />
                    <span>{evt.venue}</span>
                  </p>

                  <p className="text-slate-600 text-xs mt-3 leading-relaxed font-sans line-clamp-2">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/events/${evt.id}`}
                    className="inline-flex items-center bg-navy hover:bg-navy-light text-gold font-bold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider shadow transition-colors"
                  >
                    <span>View Event Details & Register</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Link>

                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Open for Registration
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
