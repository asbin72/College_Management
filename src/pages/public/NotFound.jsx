import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, AlertTriangle } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-6 text-center text-white relative">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-10 shadow-2xl space-y-6">
        <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto border border-gold/30">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <span className="text-4xl font-serif font-bold text-gold block">404</span>

        <h1 className="text-3xl font-serif font-bold text-amber-50">
          PAGE NOT FOUND
        </h1>

        <p className="text-slate-300 text-sm leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs px-5 py-3 rounded-xl uppercase tracking-wider transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            BACK TO HOME
          </Link>
          
          <Link
            to="/academics"
            className="flex-1 inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-5 py-3 rounded-xl border border-white/20 uppercase tracking-wider transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-2 text-gold" />
            EXPLORE ACADEMICS
          </Link>
        </div>
      </div>
    </div>
  );
};
