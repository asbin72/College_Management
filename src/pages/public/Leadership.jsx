import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

export const Leadership = () => {
  const leaders = [
    {
      name: "Dr. Radhakrishnan V.",
      title: "Chairman & Managing Trustee",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
      bio: "Former Director of National Science Foundation, visionary educational philosopher with 35+ years in academic administration."
    },
    {
      name: "Dr. Vikramaditya Roy",
      title: "Vice Chancellor & Director",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      bio: "Ph.D. from IIT Delhi, recipient of National Innovation Award, overseeing academic quality, research grants, and international partnerships."
    },
    {
      name: "Dr. Rajesh Sharma",
      title: "Principal & Head of Computer Science",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      bio: "Renowned scholar in Artificial Intelligence, author of 4 core textbooks, driving curriculum modernization across engineering."
    },
    {
      name: "Prof. Sunita Reddy",
      title: "Academic Director & Head of IT",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      bio: "Specialist in Cloud Security and Enterprise Architecture, leading student welfare, innovation incubators, and female STEM initiatives."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Header - White Background */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full">
            GOVERNANCE & DIRECTORS
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Institutional Leadership
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Guided by distinguished academics, industry pioneers, and strategic visionaries.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {leaders.map((leader, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-all">
              <img
                src={leader.image}
                alt={leader.name}
                className="w-full sm:w-36 h-44 object-cover rounded-xl border-2 border-gold flex-shrink-0"
              />
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-gold text-xs font-semibold uppercase tracking-wider">{leader.title}</span>
                <h3 className="text-2xl font-serif font-bold text-navy mt-1 mb-2">{leader.name}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{leader.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
