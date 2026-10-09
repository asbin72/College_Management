import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

export const PublicGenericPage = ({ title, category = "INSTITUTIONAL OVERVIEW", description }) => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Header - White Background */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full">
            {category}
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            {title}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            {description || "Explore institutional details, academic benchmarks, and student resources at Kalpanaaa Education."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200 max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-serif font-bold text-navy">{title} at Kalpanaaa Education</h2>
          <div className="w-12 h-1 bg-gold rounded-full" />
          <p className="text-slate-600 text-sm leading-relaxed">
            Kalpanaaa Education maintains state-of-the-art standards across all academic and infrastructure facilities. Our commitment is to offer every student a world-class environment for learning, research, character building, and career growth.
          </p>
        </div>
      </div>
    </div>
  );
};
