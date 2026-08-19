import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Award, Star, Users } from 'lucide-react';

export const ProgramCard = ({ course }) => {
  const deptImages = {
    'Computer Science': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    'Computer Science and Engineering': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    'Information Science and Engineering': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    'Information Technology': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    'Management Studies': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    'Electronics and Communication Engineering': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    'Mechanical Engineering': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    'Civil Engineering': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800'
  };

  const initialImg = (course.image && !course.image.includes('photo-1581092335397-9583fe92d232'))
    ? course.image
    : (deptImages[course.department] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800');

  const [imgSrc, setImgSrc] = React.useState(initialImg);

  const meritSummary = (course.merits && course.merits.length > 0)
    ? course.merits[0]
    : '98% Placement Success & Corporate Mentorship';

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200 hover:border-gold hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      {/* Card Image & Badges */}
      <div>
        <div className="relative h-52 img-zoom-container overflow-hidden bg-slate-100">
          <img
            src={imgSrc}
            alt={course.name}
            onError={() => setImgSrc(deptImages[course.department] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800')}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-navy text-gold text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md uppercase shadow border border-gold/20">
            {course.level || 'DEGREE'}
          </div>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-navy text-[10px] font-bold px-2.5 py-1 rounded-md uppercase shadow flex items-center">
            <Users className="w-3 h-3 text-gold mr-1" />
            <span>{course.seats || 60} Seats</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-3 font-sans">
          <span className="text-[11px] font-bold text-gold uppercase tracking-wider block">
            {course.department}
          </span>
          
          <h3 className="text-xl font-serif font-bold text-navy group-hover:text-gold transition-colors leading-snug">
            {course.name}
          </h3>

          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
            {course.overview}
          </p>

          {/* Key Merit Highlight Pill */}
          <div className="p-2.5 bg-amber-50/70 border border-gold/30 rounded-xl flex items-start text-[11px] text-navy-dark font-medium leading-tight">
            <Star className="w-3.5 h-3.5 text-gold mr-1.5 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1">{meritSummary}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 pt-0 font-sans space-y-4">
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-gold" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center font-bold text-navy font-num">
            <Award className="w-3.5 h-3.5 mr-1 text-gold" />
            <span>
              {(() => {
                const rawFee = course.feePerYear || course.fee || (typeof course.fees === 'number' ? course.fees : null);
                if (typeof rawFee === 'number' && !isNaN(rawFee)) {
                  return `₹${(rawFee / 1000).toFixed(0)}k / year`;
                }
                if (course.fees && typeof course.fees === 'string') {
                  return course.fees;
                }
                return '₹1,20,000 / Year';
              })()}
            </span>
          </div>
        </div>

        {/* Learn More Link */}
        <Link
          to={`/academics/courses/${course.id}`}
          className="inline-flex items-center justify-center w-full bg-slate-50 group-hover:bg-navy group-hover:text-gold text-navy font-bold text-xs py-3 px-4 rounded-xl border border-slate-200 transition-all uppercase tracking-wider shadow-sm"
        >
          <span>LEARN MORE & MERITS</span>
          <ArrowRight className="w-3.5 h-3.5 ml-2 text-gold group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
