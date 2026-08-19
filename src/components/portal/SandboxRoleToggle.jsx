import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, GraduationCap, ArrowLeft, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Top Sticky Sandbox Banner displayed when an Admin is previewing as Student or Faculty
 */
export const SandboxTopBanner = () => {
  const { currentUser, sandboxState, exitSandboxPreview } = useAuth();
  const navigate = useNavigate();

  if (!sandboxState.isPreview) return null;

  const handleReturnToAdmin = () => {
    exitSandboxPreview();
    navigate('/admin/control');
  };

  return (
    <div className="bg-gradient-to-r from-navy via-navy-light to-navy border-b-2 border-gold py-2.5 px-4 sm:px-6 text-white font-sans text-xs flex flex-col sm:flex-row items-center justify-between shadow-md z-50 sticky top-0">
      <div className="flex items-center space-x-2.5 font-bold mb-2 sm:mb-0">
        <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
        <span className="bg-gold text-navy-dark px-2 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-widest">
          SANDBOX PREVIEW MODE
        </span>
        <span className="text-amber-100 text-xs">
          Viewing portal as <strong className="text-gold uppercase font-mono">{sandboxState.previewRole}</strong> ({currentUser?.name})
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleReturnToAdmin}
          className="px-3.5 py-1.5 bg-gold hover:bg-gold-hover text-navy-dark font-extrabold text-[11px] uppercase tracking-wider rounded-lg shadow-sm flex items-center transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Admin Console
        </button>
      </div>
    </div>
  );
};

/**
 * Quick Role Switcher Buttons to embed in Admin Header or Control Panel
 */
export const SandboxRoleToggle = () => {
  const { currentUser, sandboxState, enterSandboxPreview, exitSandboxPreview } = useAuth();
  const navigate = useNavigate();

  // Allow admins or active sandbox previewers to use the toggle
  const isRealAdmin = currentUser?.role === 'ADMIN' || sandboxState.isPreview;
  if (!isRealAdmin) return null;

  const handleSwitchRole = (role) => {
    if (role === 'ADMIN') {
      exitSandboxPreview();
      navigate('/admin/control');
    } else {
      enterSandboxPreview(role);
      if (role === 'STUDENT') navigate('/student/dashboard');
      if (role === 'TEACHER' || role === 'STAFF') navigate('/staff/dashboard');
    }
  };

  const activeRole = sandboxState.isPreview ? sandboxState.previewRole : 'ADMIN';

  return (
    <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 font-sans text-xs">
      <span className="text-[10px] font-bold text-slate-500 uppercase px-2 hidden lg:inline flex items-center">
        <Eye className="w-3 h-3 mr-1 text-gold" /> Preview Sandbox:
      </span>

      <button
        onClick={() => handleSwitchRole('ADMIN')}
        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center ${
          activeRole === 'ADMIN'
            ? 'bg-navy text-gold shadow'
            : 'text-slate-600 hover:text-navy hover:bg-slate-200'
        }`}
      >
        <ShieldCheck className="w-3 h-3 mr-1 text-gold" /> Admin Console
      </button>

      <button
        onClick={() => handleSwitchRole('STUDENT')}
        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center ${
          activeRole === 'STUDENT'
            ? 'bg-gold text-navy-dark shadow'
            : 'text-slate-600 hover:text-navy hover:bg-slate-200'
        }`}
      >
        <GraduationCap className="w-3 h-3 mr-1" /> View as Student
      </button>

      <button
        onClick={() => handleSwitchRole('TEACHER')}
        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center ${
          activeRole === 'TEACHER' || activeRole === 'STAFF'
            ? 'bg-gold text-navy-dark shadow'
            : 'text-slate-600 hover:text-navy hover:bg-slate-200'
        }`}
      >
        <UserCheck className="w-3 h-3 mr-1" /> View as Faculty
      </button>
    </div>
  );
};
