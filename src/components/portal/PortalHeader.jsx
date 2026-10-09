import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Bell, LogOut, Menu, Send, CheckCircle2, Camera, Upload, X, User, Check, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getNotificationPermission,
  requestPushPermission,
  sendTestPushNotification
} from '../../services/pushNotificationService';

export const PortalHeader = ({ setMobileOpen }) => {
  const { currentUser, logout, updateProfile } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time ticking clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const { 
    notifications, 
    updateUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    deleteNotification,
    facultyClassAssignments = [],
    staffSubjectAssignments = [],
    activeStaffClassId = 'ALL',
    selectActiveStaffClass
  } = useData();

  // Resolve assigned classes for logged-in staff
  const assignedClassesForStaff = useMemo(() => {
    if (!currentUser || (currentUser.role !== 'TEACHER' && currentUser.role !== 'STAFF')) return [];

    const tId = currentUser.employeeId || currentUser.username || currentUser.id || 'EMP-101';
    const tName = currentUser.name || '';

    const fca = (facultyClassAssignments || []).filter(
      a => a.facultyId === tId || a.teacherId === tId || a.facultyName === tName || a.teacherName === tName
    );

    const ssa = (staffSubjectAssignments || []).filter(
      a => a.teacherId === tId || a.teacherName === tName
    );

    const classMap = new Map();

    fca.forEach(item => {
      const key = item.classId || `${item.subjectCode || item.courseId || 'CLS'}-${item.year || item.semester}`;
      if (!classMap.has(key)) {
        classMap.set(key, {
          id: key,
          label: `${item.subjectName || item.subjectCode} (${item.departmentCode || 'Dept'} - ${item.year || item.semester})`,
          subjectCode: item.subjectCode,
          deptCode: item.departmentCode
        });
      }
    });

    ssa.forEach(item => {
      const key = item.subjectId || item.subjectCode;
      if (!classMap.has(key)) {
        classMap.set(key, {
          id: key,
          label: `${item.subjectName || item.subjectCode} (${item.department || item.courseName || 'Course'})`,
          subjectCode: item.subjectCode,
          deptCode: item.department
        });
      }
    });

    return Array.from(classMap.values());
  }, [currentUser, facultyClassAssignments, staffSubjectAssignments]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [pushPerm, setPushPerm] = useState(() => getNotificationPermission());
  const notifDropdownRef = useRef(null);
  const navigate = useNavigate();
  const [headerImgError, setHeaderImgError] = useState(false);

  // Admin Profile & Photo Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(currentUser?.photoUrl || currentUser?.avatar || currentUser?.image || '');
  const [adminName, setAdminName] = useState(currentUser?.name || 'Administrator');
  const [adminDesignation, setAdminDesignation] = useState(currentUser?.designation || 'Super Administrator & Dean');
  const [customUrl, setCustomUrl] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const fileInputRef = useRef(null);

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    };
    if (showNotifs) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifs]);

  // Curated Executive Avatars for Quick Selection
  const AVATAR_PRESETS = [
    { label: "Executive Suit", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" },
    { label: "Academic Dean", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
    { label: "Leadership Pro", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
    { label: "Senior Registrar", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
    { label: "Principal Officer", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" },
    { label: "Chancellor", url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" },
    { label: "Admin Specialist", url: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400" },
    { label: "Research Director", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" }
  ];

  useEffect(() => {
    setPushPerm(getNotificationPermission());
  }, [showNotifs]);

  useEffect(() => {
    if (currentUser) {
      setProfilePhoto(currentUser.photoUrl || currentUser.avatar || currentUser.image || '');
      setAdminName(currentUser.name || 'Administrator');
      setAdminDesignation(currentUser.designation || 'Super Administrator & Dean');
    }
  }, [currentUser]);

  const handleEnablePush = async () => {
    const perm = await requestPushPermission();
    setPushPerm(perm);
    if (perm === 'granted') {
      sendTestPushNotification();
    }
  };

  // Accurately filter notifications matching user ID or current user role
  const userNotifs = useMemo(() => {
    if (!currentUser) return [];
    return (notifications || []).filter(n => {
      if (!n) return false;
      
      // Match direct ID / studentId / employeeId / email / username
      if (
        n.userId === currentUser.id ||
        (currentUser.studentId && n.userId === currentUser.studentId) ||
        (currentUser.employeeId && n.userId === currentUser.employeeId) ||
        (currentUser.email && n.userId === currentUser.email) ||
        (currentUser.username && n.userId === currentUser.username)
      ) {
        return true;
      }

      // Role broadcast matches
      if (currentUser.role === 'ADMIN') {
        if (n.userId === 'ADMIN' || n.userId === 'ALL_ADMINS' || n.targetRole === 'ADMIN' || n.userId === 'ALL' || n.userId === 'ALL_USERS') {
          return true;
        }
      }

      if (currentUser.role === 'TEACHER' || currentUser.role === 'STAFF') {
        if (n.userId === 'TEACHER' || n.userId === 'STAFF' || n.userId === 'ALL_TEACHERS' || n.userId === 'ALL_STAFF' || n.targetRole === 'TEACHER' || n.targetRole === 'STAFF' || n.userId === 'ALL' || n.userId === 'ALL_USERS') {
          return true;
        }
      }

      if (currentUser.role === 'STUDENT') {
        if (n.userId === 'STUDENT' || n.userId === 'ALL_STUDENTS' || n.targetRole === 'STUDENT' || n.userId === 'ALL' || n.userId === 'ALL_USERS') {
          return true;
        }
      }

      return false;
    });
  }, [notifications, currentUser]);

  const unreadCount = userNotifs.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleProfileButtonClick = () => {
    if (currentUser.role === 'ADMIN') {
      setShowAdminModal(true);
    } else if (currentUser.role === 'STUDENT') {
      navigate('/student/profile');
    } else if (currentUser.role === 'TEACHER' || currentUser.role === 'STAFF') {
      navigate('/staff/profile');
    }
  };

  // Handle local file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WEBP).');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB limit. Please choose a smaller image.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        setHeaderImgError(false);
        setProfilePhoto(dataUrl);
        const updatedFields = {
          name: adminName.trim() || currentUser.name,
          designation: adminDesignation.trim() || currentUser.designation,
          photoUrl: dataUrl,
          avatar: dataUrl,
          image: dataUrl
        };
        updateProfile(updatedFields);
        if (updateUser && currentUser.id) {
          updateUser(currentUser.id, updatedFields, currentUser);
        }
        setToastMsg("Image uploaded from device and saved to database successfully!");
        setTimeout(() => setToastMsg(''), 4000);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetToInitials = () => {
    setHeaderImgError(false);
    setProfilePhoto('');
    const updatedFields = {
      name: adminName.trim() || currentUser.name,
      designation: adminDesignation.trim() || currentUser.designation,
      photoUrl: '',
      avatar: '',
      image: ''
    };
    updateProfile(updatedFields);
    if (updateUser && currentUser.id) {
      updateUser(currentUser.id, updatedFields, currentUser);
    }
    setToastMsg("Profile picture reset to initials!");
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Save profile changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setHeaderImgError(false);
    const updatedFields = {
      name: adminName.trim() || currentUser.name,
      designation: adminDesignation.trim() || currentUser.designation,
      photoUrl: profilePhoto,
      avatar: profilePhoto,
      image: profilePhoto
    };

    updateProfile(updatedFields);
    if (updateUser && currentUser.id) {
      updateUser(currentUser.id, updatedFields, currentUser);
    }

    setShowAdminModal(false);
    setToastMsg("Admin profile & photo saved to database successfully!");
    setTimeout(() => setToastMsg(''), 4000);
  };

  const currentDisplayPhoto = profilePhoto !== undefined ? profilePhoto : (currentUser?.photoUrl || currentUser?.avatar || currentUser?.image || '');

  if (!currentUser) return null;

  return (
    <>
      {toastMsg && (
        <div className="fixed top-16 right-6 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-gold" />
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg('')} className="ml-2 text-white/80 hover:text-white">&times;</button>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm font-sans">
        
        {/* Left Title & Mobile Menu Toggle */}
        <div className="flex items-center space-x-3">
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 text-slate-700 hover:text-navy hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6 text-navy" />
            </button>
          )}

          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-navy bg-slate-100 px-2.5 sm:px-3 py-1 rounded-full border border-slate-200 truncate">
            KALPANAAA CMS &bull; {currentUser.role}
          </span>

          {/* STAFF MULTI-CLASS SWITCHER DROPDOWN (Shown if 2+ classes assigned) */}
          {(currentUser.role === 'TEACHER' || currentUser.role === 'STAFF') && assignedClassesForStaff.length >= 2 && (
            <div className="flex items-center space-x-1.5 bg-navy/10 border border-navy/20 px-2.5 py-1 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-navy hidden md:inline">Switch Class:</span>
              <select
                value={activeStaffClassId}
                onChange={(e) => selectActiveStaffClass && selectActiveStaffClass(e.target.value)}
                className="bg-white text-navy font-bold text-xs py-1 px-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy cursor-pointer"
              >
                <option value="ALL">All Assigned Classes ({assignedClassesForStaff.length})</option>
                {assignedClassesForStaff.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* SINGLE CLASS BADGE (Shown if exactly 1 class assigned) */}
          {(currentUser.role === 'TEACHER' || currentUser.role === 'STAFF') && assignedClassesForStaff.length === 1 && (
            <div className="hidden sm:flex items-center space-x-1 bg-navy/10 border border-navy/20 text-navy font-bold text-xs px-2.5 py-1 rounded-xl" title="Assigned Teaching Class">
              <span className="text-[10px] uppercase font-bold text-navy/70">Class:</span>
              <span className="truncate max-w-[150px]">{assignedClassesForStaff[0].label}</span>
            </div>
          )}
        </div>

        {/* Right User Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* Live Real-Time Date & Time Clock */}
          <div className="hidden lg:flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
            <Clock className="w-3.5 h-3.5 text-gold flex-shrink-0 animate-pulse" />
            <span className="font-medium text-slate-600">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-num font-bold text-navy">
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </span>
          </div>
        
          {/* Notifications Bell Dropdown */}
          <div className="relative" ref={notifDropdownRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 text-slate-600 hover:text-navy hover:bg-slate-100 rounded-full relative focus:outline-none transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white font-num shadow animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fadeIn">
                <div className="px-4 py-2.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70 rounded-t-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase text-navy tracking-wider">Notifications</span>
                    <span className="text-[10px] bg-navy text-gold font-bold px-2 py-0.5 rounded-full font-num">
                      {unreadCount > 0 ? `${unreadCount} Unread` : `${userNotifs.length} Total`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() => markAllNotificationsAsRead(currentUser)}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold hover:underline transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                    {userNotifs.length > 0 && (
                      <button
                        type="button"
                        onClick={() => clearNotifications(currentUser)}
                        className="text-[10px] text-slate-400 hover:text-rose-600 font-bold hover:underline transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Web Push Notification Status Box */}
                <div className="p-3 bg-slate-50 border-b border-slate-100 text-xs font-sans space-y-1.5 mx-2 my-1.5 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-navy text-[11px] flex items-center">
                      <Bell className="w-3.5 h-3.5 mr-1 text-gold" /> Web Push Alerts
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      pushPerm === 'granted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {pushPerm === 'granted' ? 'Active' : pushPerm === 'denied' ? 'Blocked' : 'Action Required'}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 font-serif leading-tight">
                    Receive browser push alerts for assignment deadlines, tickets, and attendance.
                  </p>

                  {pushPerm !== 'granted' ? (
                    <button
                      onClick={handleEnablePush}
                      className="w-full mt-1 px-3 py-1.5 bg-navy hover:bg-navy-light text-gold text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider flex items-center justify-center"
                    >
                      Enable Web Push Notifications
                    </button>
                  ) : (
                    <button
                      onClick={() => sendTestPushNotification()}
                      className="w-full mt-1 px-3 py-1 bg-slate-200 hover:bg-slate-300 text-navy text-[10px] font-bold rounded-lg transition-all flex items-center justify-center"
                    >
                      <Send className="w-3 h-3 mr-1 text-gold" /> Send Test Push Alert
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {userNotifs.length > 0 ? (
                    userNotifs.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => !n.read && markNotificationAsRead(n.id)}
                        className={`p-3 text-xs transition-colors cursor-pointer group flex items-start justify-between gap-2 ${
                          !n.read 
                            ? 'bg-blue-50/70 hover:bg-blue-50 border-l-4 border-blue-500 font-sans' 
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5">
                            {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 animate-pulse" />}
                            <p className={`text-xs truncate ${!n.read ? 'font-bold text-navy' : 'font-semibold text-slate-700'}`}>
                              {n.title}
                            </p>
                          </div>
                          <p className="text-slate-600 text-[11px] font-serif leading-relaxed line-clamp-2">{n.message}</p>
                          <span className="text-[9px] text-slate-400 font-num block pt-0.5">
                            {n.time ? `${n.date} • ${n.time}` : n.date || 'Today'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
                          title="Dismiss notification"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                      <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-600">You're all caught up!</p>
                      <p className="text-[11px] text-slate-400">No new notifications in your mailbox.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Badge & Profile Button */}
          <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-slate-200">
            <button
              onClick={handleProfileButtonClick}
              className="flex items-center space-x-2 sm:space-x-2.5 p-1 hover:bg-slate-100 rounded-xl transition-all text-left group"
              title={currentUser.role === 'ADMIN' ? "Click to change Admin Profile Photo" : "Click to view profile"}
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-navy text-gold font-serif font-bold rounded-full flex items-center justify-center border-2 border-gold shadow-sm text-xs sm:text-sm overflow-hidden group-hover:scale-105 transition-transform flex-shrink-0">
                {currentDisplayPhoto && !headerImgError ? (
                  <img 
                    src={currentDisplayPhoto} 
                    alt={currentUser.name} 
                    onError={() => setHeaderImgError(true)} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span>{currentUser.name ? currentUser.name.charAt(0) : 'U'}</span>
                )}
                {currentUser.role === 'ADMIN' && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
              
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-navy group-hover:text-gold-hover transition-colors">{currentUser.name}</span>
                <span className="text-[10px] text-gold font-semibold uppercase">
                  {currentUser.role === 'ADMIN' ? 'Admin Profile • Photo' : `${currentUser.role} • Profile`}
                </span>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
              title="Logout of Portal"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* ADMIN PROFILE & PHOTO CUSTOMIZATION MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-navy bg-gold/20 px-2.5 py-0.5 rounded border border-gold/30">
                  ADMINISTRATIVE CREDENTIALS
                </span>
                <h3 className="font-serif font-bold text-xl text-navy mt-1">Change Admin Profile Photo</h3>
                <p className="text-xs text-slate-500 font-serif">Upload your custom picture or select an official executive avatar.</p>
              </div>
              <button 
                onClick={() => setShowAdminModal(false)}
                className="p-1.5 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-sans">
              
              {/* Active Photo Preview & Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="relative w-20 h-20 bg-navy rounded-full border-4 border-gold shadow-md overflow-hidden flex-shrink-0 flex items-center justify-center text-gold text-2xl font-serif font-bold">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Admin Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span>{adminName.charAt(0)}</span>
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <span className="font-bold text-navy text-sm block">{adminName}</span>
                  <span className="text-slate-500 text-xs block">{adminDesignation} &bull; ADM-001</span>
                  
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-navy hover:bg-navy-light text-gold text-xs font-bold rounded-xl shadow flex items-center space-x-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                    </button>

                    {profilePhoto && (
                      <button
                        type="button"
                        onClick={handleResetToInitials}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-red-100 text-slate-700 hover:text-red-700 text-xs font-bold rounded-xl"
                      >
                        Reset to Initials
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Direct Image URL Input */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1 text-[11px]">Or Paste Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/my-photo.jpg"
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:border-gold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customUrl.trim()) {
                        setHeaderImgError(false);
                        setProfilePhoto(customUrl.trim());
                        setCustomUrl('');
                      }
                    }}
                    className="px-3 py-2.5 bg-slate-200 hover:bg-navy hover:text-gold text-navy font-bold rounded-xl text-xs"
                  >
                    Apply URL
                  </button>
                </div>
              </div>

              {/* Executive Avatar Presets */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-2 text-[11px] flex items-center justify-between">
                  <span>Executive Preset Avatars</span>
                  <span className="text-slate-400 font-normal normal-case">Click to preview</span>
                </label>

                <div className="grid grid-cols-4 gap-2.5">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setHeaderImgError(false);
                        setProfilePhoto(preset.url);
                      }}
                      className={`group p-1.5 rounded-2xl border transition-all text-center flex flex-col items-center ${
                        profilePhoto === preset.url 
                          ? 'border-gold bg-gold/10 ring-2 ring-gold/40' 
                          : 'border-slate-200 hover:border-navy bg-slate-50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden mb-1 shadow-sm">
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 truncate w-full">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Name & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1 text-[11px]">Administrator Name</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1 text-[11px]">Official Designation</label>
                  <input
                    type="text"
                    required
                    value={adminDesignation}
                    onChange={(e) => setAdminDesignation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-navy hover:bg-navy-light text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow"
                >
                  <Check className="w-4 h-4 text-gold" />
                  <span>Save Profile Picture</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
};
