import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, User, BookOpen, Clock, FileText, Award, CalendarCheck, Users, ShieldAlert, BarChart3, Building, FileSpreadsheet, ChevronRight, Menu, X, HelpCircle, UserCheck } from 'lucide-react';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!currentUser) return null;

  const role = currentUser.role;
  const dashboardPath = role === 'ADMIN' ? '/admin/dashboard' : role === 'TEACHER' ? '/teacher/dashboard' : '/student/dashboard';

  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Attendance', path: '/student/attendance', icon: Clock },
    { label: 'Assignments', path: '/student/assignments', icon: FileText },
    { label: 'Courses & Academics', path: '/student/courses', icon: BookOpen },
    { label: 'Examinations', path: '/student/exams', icon: Award },
    { label: 'Results', path: '/student/results', icon: FileSpreadsheet },
    { label: 'Leave Management', path: '/student/leave', icon: CalendarCheck },
    { label: 'Helpdesk & Queries', path: '/student/helpdesk', icon: HelpCircle },
    { label: 'Profile', path: '/student/profile', icon: User },
  ];

  const teacherLinks = [
    { label: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
    { label: 'Attendance', path: '/staff/attendance', icon: Clock },
    { label: 'Assignments', path: '/staff/assignments', icon: FileText },
    { label: 'Marks', path: '/staff/marks', icon: FileSpreadsheet },
    { label: 'Assigned Courses', path: '/staff/courses', icon: BookOpen },
    { label: 'Examinations', path: '/staff/exams', icon: Award },
    { label: 'Leave Management', path: '/staff/leave', icon: CalendarCheck },
    { label: 'Student Queries & Help', path: '/staff/helpdesk', icon: HelpCircle },
    { label: 'Profile', path: '/staff/profile', icon: User },
  ];

  const adminLinks = [
    { label: 'Dashboard', path: '/admin/control', icon: LayoutDashboard },
    { label: 'Admissions', path: '/admin/admissions', icon: UserCheck },
    { label: 'Departments', path: '/admin/departments', icon: Building },
    { label: 'Subjects', path: '/admin/courses', icon: BookOpen },
    { label: 'Teachers', path: '/admin/teachers', icon: Users },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Attendance', path: '/admin/attendance', icon: Clock },
    { label: 'Examinations', path: '/admin/exams', icon: Award },
    { label: 'Leave Management', path: '/admin/leave', icon: CalendarCheck },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Institutional Helpdesk', path: '/admin/helpdesk', icon: HelpCircle },
  ];

  const links = role === 'ADMIN' ? adminLinks : (role === 'TEACHER' || role === 'STAFF') ? teacherLinks : studentLinks;

  const renderNavContent = () => (
    <div className="flex flex-col h-full font-sans">
      {/* Top Branding */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <Link 
          to={dashboardPath} 
          className="flex items-center space-x-2 overflow-hidden" 
          onClick={() => setMobileOpen && setMobileOpen(false)}
          title="Go to Portal Dashboard"
        >
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain flex-shrink-0" />
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col truncate">
              <span className="font-sans font-bold text-navy text-sm tracking-wider">KALPANAAA</span>
              <span className="text-[9px] font-sans font-bold text-gold uppercase tracking-widest">{role} CMS</span>
            </div>
          )}
        </Link>

        <div className="flex items-center space-x-1">
          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block text-slate-500 hover:text-navy p-1 focus:outline-none"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Mobile Drawer Close Button */}
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-slate-500 hover:text-navy p-1"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-4 overflow-y-auto space-y-1 px-3">
        {links.map((link, idx) => {
          const IconComp = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={idx}
              to={link.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`flex items-center px-3 py-2.5 rounded-xl text-xs font-sans font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-navy text-gold font-bold shadow-md'
                  : link.highlight
                  ? 'text-gold bg-gold/10 hover:bg-gold/20 font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-navy'
              }`}
              title={link.label}
            >
              <IconComp className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-gold' : link.highlight ? 'text-gold' : 'text-slate-500'}`} />
              {(!collapsed || mobileOpen) && (
                <span className="ml-3 truncate font-sans">{link.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR (md and above) - Sticky Pinned to Top */}
      <aside className={`hidden md:flex bg-white text-slate-800 flex-col border-r border-slate-200 shadow-sm transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} h-screen sticky top-0 flex-shrink-0 self-start z-20`}>
        {renderNavContent()}
      </aside>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" 
            onClick={() => setMobileOpen(false)} 
          />
          <aside className="relative z-10 w-72 bg-white text-slate-800 h-full shadow-2xl flex flex-col border-r border-slate-200">
            {renderNavContent()}
          </aside>
        </div>
      )}
    </>
  );
};
