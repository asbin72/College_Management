import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, Lock, LogOut } from 'lucide-react';

export const RoleGuard = ({ allowedRoles, children }) => {
  const { currentUser, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    const portalLink = 
      currentUser.role === 'ADMIN' ? '/admin/dashboard' :
      (currentUser.role === 'TEACHER' || currentUser.role === 'STAFF') ? '/teacher/dashboard' :
      '/student/dashboard';

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
            Security Violation
          </span>

          <h2 className="text-3xl font-serif font-bold mt-4 mb-2 text-white">
            ACCESS DENIED
          </h2>

          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            You do not have permission to access this portal route. Your logged-in role is <strong className="text-gold uppercase">{currentUser.role}</strong>.
          </p>

          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 text-left mb-6 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center">
              <Lock className="w-3.5 h-3.5 mr-2 text-slate-400" />
              <span>User Email: <strong className="text-slate-200">{currentUser.email}</strong></span>
            </div>
            <div className="flex items-center">
              <Lock className="w-3.5 h-3.5 mr-2 text-slate-400" />
              <span>Required Role: <strong className="text-slate-200">{allowedRoles.join(', ')}</strong></span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to={portalLink}
              className="inline-flex items-center justify-center w-full bg-gold hover:bg-gold-hover text-navy-dark font-bold px-6 py-3 rounded-xl transition-colors shadow-lg text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              RETURN TO MY PORTAL ({currentUser.role})
            </Link>

            <button
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="inline-flex items-center justify-center w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold px-6 py-2.5 rounded-xl transition-colors text-xs"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" />
              LOGOUT & SWITCH ACCOUNT
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
