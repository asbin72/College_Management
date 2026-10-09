import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, GraduationCap, UserCheck } from 'lucide-react';

export const DepartmentCard = ({ department }) => {
  const deptCode = (department.code || '').toUpperCase().trim() || 'DEPT';
  const deptName = department.name || '';

  const deptImages = {
    'CSE': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    'Computer Science & Engineering': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    'ISE': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    'Information Science & Engineering': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    'ECE': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    'Electronics & Communication Engineering': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    'EEE': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
    'Electrical & Electronics Engineering': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
    'ME': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    'Mechanical Engineering': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    'CE': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800',
    'Civil & Environmental Engineering': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800',
    'MBA': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    'Management Studies': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  };

  const defaultFallback = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800';

  const isInvalidUrl = (url) => !url || typeof url !== 'string' || url.includes('photo-1581092335397-9583fe92d232');

  const validDeptImg = deptImages[deptCode] || deptImages[deptName] || defaultFallback;
  const initialImg = !isInvalidUrl(department.image) ? department.image : validDeptImg;

  const [imgSrc, setImgSrc] = useState(initialImg);

  const targetCode = (department.code || department.id || '').toLowerCase();
  const linkTarget = `/academics/departments/${targetCode}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200 hover:border-gold hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Card Image & Badges */}
        <div className="relative h-52 img-zoom-container overflow-hidden bg-slate-100">
          <img
            src={imgSrc}
            alt=""
            onError={() => {
              if (imgSrc !== defaultFallback) {
                setImgSrc(defaultFallback);
              }
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-navy text-gold text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md uppercase shadow border border-gold/20 z-10">
            {deptCode} DEPARTMENT
          </div>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-navy text-[10px] font-bold px-2.5 py-1 rounded-md uppercase shadow flex items-center z-10">
            <Users className="w-3 h-3 text-gold mr-1" />
            <span>{department.totalStudents || 360} Students</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-3 font-sans">
          <div className="flex items-center justify-between text-[11px] font-bold text-gold uppercase tracking-wider">
            <span>{department.code}</span>
            <span className="text-slate-500 font-serif normal-case">HOD: {department.hod || 'Dr. Department Head'}</span>
          </div>

          <h3 className="text-xl font-serif font-bold text-navy group-hover:text-gold transition-colors leading-snug">
            {department.name}
          </h3>

          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed font-serif">
            {department.description || 'Pioneering academic education, state-of-the-art research laboratories, AICTE & NBA accredited curriculum, and active industry partnerships.'}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-sans">
            <div className="flex items-center p-2 bg-slate-50 rounded-lg">
              <UserCheck className="w-3.5 h-3.5 text-gold mr-1.5 flex-shrink-0" />
              <span className="font-bold text-navy font-num">{department.totalFaculty || 20}</span>
              <span className="ml-1 text-slate-500 text-[11px]">Faculty</span>
            </div>
            <div className="flex items-center p-2 bg-slate-50 rounded-lg">
              <GraduationCap className="w-3.5 h-3.5 text-gold mr-1.5 flex-shrink-0" />
              <span className="font-bold text-navy font-num">{department.totalStudents || 360}</span>
              <span className="ml-1 text-slate-500 text-[11px]">Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 pt-0 font-sans">
        <Link
          to={linkTarget}
          className="inline-flex items-center justify-center w-full bg-slate-50 group-hover:bg-navy group-hover:text-gold text-navy font-bold text-xs py-3 px-4 rounded-xl border border-slate-200 transition-all uppercase tracking-wider shadow-sm"
        >
          <span>EXPLORE DEPARTMENT</span>
          <ArrowRight className="w-3.5 h-3.5 ml-2 text-gold group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
