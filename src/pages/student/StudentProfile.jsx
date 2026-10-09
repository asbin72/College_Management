import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { FloatingHelpdesk } from '../../components/portal/FloatingHelpdesk';
import { User, Phone, ShieldCheck, Edit3, Save, FileText, CheckCircle2, Lock, Camera, Upload, Send, X, Sparkles } from 'lucide-react';

export const StudentProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { submitHelpdeskTicket, updateUser } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [toastMsg, setToastMsg] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const STUDENT_AVATAR_PRESETS = [
    { label: "Tech Scholar", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" },
    { label: "Engineering Lead", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400" },
    { label: "Campus Scholar", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400" },
    { label: "Research Student", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
    { label: "Design Innovator", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
    { label: "Code Architect", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" }
  ];

  const isNewStudent = currentUser?.isNewUser || (currentUser?.studentId?.startsWith('STU-') && !['STU-2024-001', 'STU-CSE-101'].includes(currentUser?.studentId));

  // Student Editable Fields State
  const [formData, setFormData] = useState({
    personalEmail: currentUser?.personalEmail || currentUser?.email || '',
    phone: currentUser?.phone || (isNewStudent ? '' : '+91 98765 43210'),
    altPhone: currentUser?.altPhone || '',
    address: currentUser?.address || (isNewStudent ? '' : 'Knowledge Corridor Campus Hostel, Block B'),
    city: currentUser?.city || (isNewStudent ? '' : 'Bengaluru'),
    state: currentUser?.state || (isNewStudent ? '' : 'Karnataka'),
    pinCode: currentUser?.pinCode || (isNewStudent ? '' : '560001'),
    emergencyContact: currentUser?.emergencyContact || (isNewStudent ? '' : '+91 98765 00000 (Guardian)')
  });

  // Request Change Form State for Official Fields
  const [changeRequest, setChangeRequest] = useState({
    fieldName: 'Full Name',
    newValue: '',
    reason: '',
    documentName: ''
  });

  // Pending Change Requests List
  const [changeRequestsList, setChangeRequestsList] = useState([]);

  if (!currentUser) return null;

  const studentName = currentUser.name || 'Student';
  const studentId = currentUser.studentId || currentUser.username || currentUser.id || 'STU-2026-001';
  const regNumber = currentUser.registerNumber || currentUser.rollNo || `REG-2026-${studentId.replace('STU-', '')}`;
  const course = currentUser.course || 'B.Tech Engineering Program';
  const department = currentUser.department || 'Engineering & Technology';
  const semester = currentUser.semester || 'Semester 6';
  const section = currentUser.section || 'Sec A';
  const academicYear = currentUser.academicYear || '2026-2027';
  const status = currentUser.status || 'Active';

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedFields = {
      personalEmail: formData.personalEmail,
      phone: formData.phone,
      altPhone: formData.altPhone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pinCode: formData.pinCode,
      emergencyContact: formData.emergencyContact
    };

    updateProfile(updatedFields);
    if (updateUser) {
      updateUser(currentUser.id || currentUser.studentId, updatedFields, currentUser);
    }

    setToastMsg('Profile details updated and saved successfully!');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgError(false);
        const dataUrl = reader.result;
        updateProfile({ photoUrl: dataUrl, avatar: dataUrl });
        if (updateUser) {
          updateUser(currentUser.id || currentUser.studentId, { photoUrl: dataUrl, avatar: dataUrl }, currentUser);
        }
        setShowPhotoModal(false);
        setToastMsg('Profile photo updated and saved to database successfully!');
        setTimeout(() => setToastMsg(''), 4000);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleSelectPreset = (presetUrl) => {
    setImgError(false);
    updateProfile({ photoUrl: presetUrl, avatar: presetUrl });
    if (updateUser) {
      updateUser(currentUser.id || currentUser.studentId, { photoUrl: presetUrl, avatar: presetUrl }, currentUser);
    }
    setShowPhotoModal(false);
    setToastMsg('Profile avatar updated and saved to database successfully!');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    const newReq = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      fieldName: changeRequest.fieldName,
      requestedValue: changeRequest.newValue,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      reason: changeRequest.reason
    };

    setChangeRequestsList([newReq, ...changeRequestsList]);

    // Dispatch official query ticket to Administrative Office
    if (submitHelpdeskTicket) {
      submitHelpdeskTicket({
        category: 'Profile & Record Correction',
        targetRole: 'ADMIN',
        subject: `Profile Correction Request: ${changeRequest.fieldName}`,
        description: `Student ${studentName} (ID: ${studentId}, Course: ${course}) requested official change for [${changeRequest.fieldName}].\nRequested Value: "${changeRequest.newValue}"\nReason: ${changeRequest.reason}`,
        priority: 'Normal'
      }, currentUser);
    }

    setShowRequestModal(false);
    setRequestSubmitted(true);
    setTimeout(() => setRequestSubmitted(false), 5000);
    setChangeRequest({ fieldName: 'Full Name', newValue: '', reason: '', documentName: '' });
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans relative">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
          
          {/* Notification Toast */}
          {toastMsg && (
            <div className="p-4 bg-emerald-500 text-white rounded-xl shadow-lg flex items-center justify-between font-sans text-xs font-bold animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>{toastMsg}</span>
              </div>
              <button onClick={() => setToastMsg('')} className="text-white hover:text-slate-200">&times;</button>
            </div>
          )}

          {requestSubmitted && (
            <div className="p-4 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-between font-sans text-xs font-bold animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Official Information Change Request submitted to Administration! Track status below.</span>
              </div>
            </div>
          )}

          {/* PROFILE HEADER CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              
              {/* Photo Avatar with File Picker & Presets */}
              <div className="relative group flex-shrink-0">
                <div 
                  onClick={() => setShowPhotoModal(true)}
                  className="w-28 h-28 sm:w-32 sm:h-32 bg-navy text-gold font-serif font-bold text-4xl rounded-2xl flex items-center justify-center border-4 border-gold/40 shadow-xl overflow-hidden cursor-pointer relative"
                  title="Click to change profile picture"
                >
                  {(currentUser.photoUrl || currentUser.avatar) && !imgError ? (
                    <img 
                      src={currentUser.photoUrl || currentUser.avatar} 
                      alt={studentName} 
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="font-serif font-bold text-3xl sm:text-4xl text-gold">
                      {studentName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'ST'}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-6 h-6 text-gold" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  className="absolute bottom-1 right-1 bg-gold hover:bg-gold-hover text-navy-dark p-2 rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110"
                  title="Upload New Profile Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Main Info */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="bg-navy text-gold text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-gold/30">
                    {course}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-sans font-bold uppercase px-3 py-1 rounded-full flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    {status} Student
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-sans font-bold text-navy tracking-tight">{studentName}</h1>
                
                <p className="font-serif text-slate-500 text-xs sm:text-sm">
                  Student ID: <strong className="font-num font-bold text-navy">{studentId}</strong> &bull; Register No: <strong className="font-num font-bold text-slate-700">{regNumber}</strong>
                </p>

                <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4 text-xs text-slate-600 font-sans">
                  <div>Department: <strong className="text-slate-800">{department}</strong></div>
                  <div>Semester: <strong className="text-navy font-num">{semester}</strong></div>
                  <div>Section: <strong className="text-slate-800 font-num">{section}</strong></div>
                  <div>Academic Year: <strong className="text-slate-800 font-num">{academicYear}</strong></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <button
                  onClick={handleSaveProfile}
                  className="inline-flex items-center justify-center bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs px-5 py-3 rounded-xl shadow transition-colors uppercase tracking-wider"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile Changes
                </button>

                <button
                  onClick={() => setShowRequestModal(true)}
                  className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 transition-colors uppercase tracking-wider"
                >
                  <FileText className="w-4 h-4 mr-2 text-gold-hover" />
                  Request Official Change
                </button>
              </div>

            </div>
          </div>

          {/* MAIN PROFILE SECTIONS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Columns: Personal & Guardian Info */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Personal Information Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="text-lg font-sans font-bold text-navy tracking-tight flex items-center">
                    <User className="w-5 h-5 text-gold mr-2" />
                    Personal Details & Contact Info
                  </h3>
                  <span className="text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Directly Editable Fields Below
                  </span>
                </div>

                <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  
                  {/* Read-Only Official Fields */}
                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Full Name (Official Record)</label>
                    <input type="text" readOnly value={studentName} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Date of Birth</label>
                    <input type="text" readOnly value="2004-05-14" className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-num font-semibold cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Gender</label>
                    <input type="text" readOnly value="Male" className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Blood Group</label>
                    <input type="text" readOnly value="O+" className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Institutional Email</label>
                    <input type="email" readOnly value={currentUser.email || 'student@kalpanaaa.edu'} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed" />
                  </div>

                  {/* Student Editable Fields */}
                  <div>
                    <label className="block text-navy font-bold uppercase mb-1 flex items-center">
                      Personal Email *
                      <Edit3 className="w-3 h-3 ml-1 text-gold" />
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.personalEmail}
                      onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 font-semibold focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-navy font-bold uppercase mb-1 flex items-center">
                      Mobile Phone *
                      <Edit3 className="w-3 h-3 ml-1 text-gold" />
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 font-num font-semibold focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-navy font-bold uppercase mb-1 flex items-center">
                      Alternate Phone
                      <Edit3 className="w-3 h-3 ml-1 text-gold" />
                    </label>
                    <input
                      type="text"
                      value={formData.altPhone}
                      onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 font-num focus:outline-none shadow-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-navy font-bold uppercase mb-1 flex items-center">
                      Current Residential Address *
                      <Edit3 className="w-3 h-3 ml-1 text-gold" />
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-navy font-bold uppercase mb-1 flex items-center">
                      City
                      <Edit3 className="w-3 h-3 ml-1 text-gold" />
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-navy font-bold uppercase mb-1 flex items-center">
                      State / PIN Code
                      <Edit3 className="w-3 h-3 ml-1 text-gold" />
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-2/3 px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 focus:outline-none shadow-sm"
                      />
                      <input
                        type="text"
                        value={formData.pinCode}
                        onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                        className="w-1/3 px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 font-num focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-navy font-bold uppercase mb-1 flex items-center">
                      Emergency Contact Person & Phone *
                      <Edit3 className="w-3 h-3 ml-1 text-gold" />
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save & Update Profile Details
                    </button>
                  </div>

                </form>
              </div>

              {/* Parent / Guardian Information Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="text-lg font-sans font-bold text-navy tracking-tight flex items-center">
                    <ShieldCheck className="w-5 h-5 text-gold mr-2" />
                    Parent / Guardian Details
                  </h3>
                  <span className="text-[10px] font-sans font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">Requires Admin Approval to Change</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Parent / Guardian Name</label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold">{parentName}</div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Relationship</label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold">{parentRelation}</div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Parent Mobile Number</label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-num font-semibold">{parentPhone}</div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Parent Email</label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold">{parentEmail}</div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 font-bold uppercase mb-1">Occupation & Organization</label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold">{parentOccupation}</div>
                  </div>
                </div>
              </div>
            </div>
          
          {/* Notification Toast */}
          {toastMsg && (
            <div className="p-4 bg-emerald-500 text-white rounded-xl shadow-lg flex items-center justify-between font-sans text-xs font-bold animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>{toastMsg}</span>
              </div>
              <button onClick={() => setToastMsg('')} className="text-white hover:text-slate-200">&times;</button>
            </div>
          )}

          {requestSubmitted && (
            <div className="p-4 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-between font-sans text-xs font-bold animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Official Information Change Request submitted to Administration! Track status below.</span>
              </div>
            </div>
          )}

          {/* PROFILE HEADER CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              
              {/* Photo Avatar with File Picker & Presets */}
              <div className="relative group flex-shrink-0">
                <div 
                  onClick={() => setShowPhotoModal(true)}
                  className="w-28 h-28 sm:w-32 sm:h-32 bg-navy text-gold font-serif font-bold text-4xl rounded-2xl flex items-center justify-center border-4 border-gold/40 shadow-xl overflow-hidden cursor-pointer relative"
                  title="Click to change profile picture"
                >
                  {(currentUser.photoUrl || currentUser.avatar) && !imgError ? (
                    <img 
                      src={currentUser.photoUrl || currentUser.avatar} 
                      alt={studentName} 
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="font-serif font-bold text-3xl sm:text-4xl text-gold">
                      {studentName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'ST'}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-6 h-6 text-gold" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  className="absolute bottom-1 right-1 bg-gold hover:bg-gold-hover text-navy-dark p-2 rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110"
                  title="Upload New Profile Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Main Info */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="bg-navy text-gold text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-gold/30">
                    {course}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-sans font-bold uppercase px-3 py-1 rounded-full flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    {status} Student
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-sans font-bold text-navy tracking-tight">{studentName}</h1>
                
                <p className="font-serif text-slate-500 text-xs sm:text-sm">
                  Student ID: <strong className="font-num font-bold text-navy">{studentId}</strong> &bull; Register No: <strong className="font-num font-bold text-slate-700">{regNumber}</strong>
                </p>

                <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4 text-xs text-slate-600 font-sans">
                  <div>Department: <strong className="text-slate-800">{department}</strong></div>
                  <div>Semester: <strong className="text-navy font-num">{semester}</strong></div>
                  <div>Section: <strong className="text-slate-800 font-num">{section}</strong></div>
                  <div>Academic Year: <strong className="text-slate-800 font-num">{academicYear}</strong></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <button
                  onClick={handleSaveProfile}
                  className="inline-flex items-center justify-center bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs px-5 py-3 rounded-xl shadow transition-colors uppercase tracking-wider"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile Changes
                </button>

                <button
                  onClick={() => setShowRequestModal(true)}
                  className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 transition-colors uppercase tracking-wider"
                >
                  <FileText className="w-4 h-4 mr-2 text-gold-hover" />
                  Request Official Change
                </button>
              </div>

            </div>
          </div>

          {/* MAIN PROFILE SECTIONS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Columns: Personal & Guardian Info */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Personal Information Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="text-lg font-sans font-bold text-navy tracking-tight flex items-center">
                    <User className="w-5 h-5 text-gold mr-2" />
                    Personal Details & Contact Info
                  </h3>
                  <span className="text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Directly Editable Fields Below
                  </span>
                </div>

                <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  
                  {/* Read-Only Official Fields */}
                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Full Name (Official Record)</label>
                    <input type="text" readOnly value={studentName} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Date of Birth</label>
                    <input type="text" readOnly value={dob} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-num font-semibold cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Gender</label>
                    <input type="text" readOnly value={gender} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Blood Group</label>
                    <input type="text" readOnly value={bloodGroup} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Institutional Email</label>
                    <input type="email" readOnly value={currentUser.email || 'student@kalpanaaa.edu'} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed" />
                  </div>

                  {/* Student Editable Fields */}
                  <div>
                    <label className="block text-navy font-bold uppercase mb-1 flex items-center">
                      Personal Email *
                      <Edit3 className="w-3 h-3 ml-1 text-gold" />
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.personalEmail}
                      onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 font-semibold focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-navy font-bold uppercase mb-1 flex items-center">
                      Mobile Phone *
                      <Edit3 className="w-3 h-3 ml-1 text-gold" />
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 font-num font-semibold focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-navy font-bold uppercase mb-1 flex items-center">
                      Alternate Phone
                      <Edit3 className="w-3 h-3 ml-1 text-gold" />
                    </label>
                    <input
                      type="text"
                      value={formData.altPhone}
                      onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 font-num focus:outline-none shadow-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-navy font-bold uppercase mb-1 flex items-center">
                      Current Residential Address *
                      <Edit3 className="w-3 h-3 ml-1 text-gold" />
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-navy font-bold uppercase mb-1 flex items-center">
                      City
                      <Edit3 className="w-3 h-3 ml-1 text-gold" />
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-navy font-bold uppercase mb-1 flex items-center">
                      State / PIN Code
                      <Edit3 className="w-3 h-3 ml-1 text-gold" />
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-2/3 px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 focus:outline-none shadow-sm"
                      />
                      <input
                        type="text"
                        value={formData.pinCode}
                        onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                        className="w-1/3 px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 font-num focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-navy font-bold uppercase mb-1 flex items-center">
                      Emergency Contact Person & Phone *
                      <Edit3 className="w-3 h-3 ml-1 text-gold" />
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save & Update Profile Details
                    </button>
                  </div>

                </form>
              </div>

              {/* Parent / Guardian Information Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="text-lg font-sans font-bold text-navy tracking-tight flex items-center">
                    <ShieldCheck className="w-5 h-5 text-gold mr-2" />
                    Parent / Guardian Details
                  </h3>
                  <span className="text-[10px] font-sans font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">Requires Admin Approval to Change</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Parent / Guardian Name</label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold">{parentName}</div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Relationship</label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold">{parentRelation}</div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Parent Mobile Number</label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-num font-semibold">{parentPhone}</div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Parent Email</label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold">{parentEmail}</div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 font-bold uppercase mb-1">Occupation & Organization</label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold">{parentOccupation}</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Academic Info (Read-Only) & Change Requests */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Academic Details (Strict Read-Only) */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="text-lg font-sans font-bold text-navy tracking-tight flex items-center">
                    <Lock className="w-5 h-5 text-gold mr-2" />
                    Academic Records (Read-Only)
                  </h3>
                  <span className="text-[10px] font-sans font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Locked by Registrar</span>
                </div>

                <div className="space-y-3 text-xs font-sans">
                  <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold">Student ID:</span>
                    <strong className="font-num text-navy">{studentId}</strong>
                  </div>

                  <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold">Register Number:</span>
                    <strong className="font-num text-slate-800">{regNumber}</strong>
                  </div>

                  <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold">Enrolled Program:</span>
                    <strong className="text-slate-800 text-right">{course}</strong>
                  </div>

                  <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold">Department:</span>
                    <strong className="text-slate-800">{department}</strong>
                  </div>

                  <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold">Admission Year:</span>
                    <strong className="font-num text-slate-800">{startYear}</strong>
                  </div>

                  <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold">Current Semester:</span>
                    <strong className="font-num text-navy">{semester}</strong>
                  </div>

                  <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold">Section / Batch:</span>
                    <strong className="font-num text-slate-800">{section} ({batchRange})</strong>
                  </div>
                </div>
              </div>

              {/* Submitted Change Requests Tracker */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="text-lg font-sans font-bold text-navy tracking-tight">Official Change Requests</h3>
                  <span className="text-xs font-num font-bold text-gold">{changeRequestsList.length} Requests</span>
                </div>

                <div className="space-y-3">
                  {changeRequestsList.map((req) => (
                    <div key={req.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-sans space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-navy">{req.fieldName} Change</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-slate-600">Requested: <strong className="text-slate-800">{req.requestedValue}</strong></p>
                      <span className="text-[10px] text-slate-400 font-num block">{req.date} &bull; Ref: {req.id}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>
      </div>

      {/* REQUEST OFFICIAL CHANGE MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-sans font-bold text-navy">Request Official Detail Change</h3>
              <button onClick={() => setShowRequestModal(false)} className="text-slate-400 text-lg">&times;</button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Select Field to Modify *</label>
                <select
                  value={changeRequest.fieldName}
                  onChange={(e) => setChangeRequest({ ...changeRequest, fieldName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Full Name">Full Name</option>
                  <option value="Date of Birth">Date of Birth</option>
                  <option value="Gender">Gender</option>
                  <option value="Blood Group">Blood Group</option>
                  <option value="Parent / Guardian Name">Parent / Guardian Name</option>
                  <option value="Parent Contact Phone">Parent Contact Phone</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Correct / New Requested Value *</label>
                <input
                  type="text"
                  required
                  value={changeRequest.newValue}
                  onChange={(e) => setChangeRequest({ ...changeRequest, newValue: e.target.value })}
                  placeholder="Enter exact correct value"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Reason for Request *</label>
                <textarea
                  rows={2}
                  required
                  value={changeRequest.reason}
                  onChange={(e) => setChangeRequest({ ...changeRequest, reason: e.target.value })}
                  placeholder="Explain why official record change is needed..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Upload Supporting Document (Optional)</label>
                <div className="p-3 border-2 border-dashed border-slate-300 rounded-xl text-center bg-slate-50 text-slate-500 flex flex-col items-center cursor-pointer">
                  <Upload className="w-5 h-5 text-gold mb-1" />
                  <span className="text-[11px]">Upload Aadhar Card, Birth Certificate, or Medical Doc</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gold hover:bg-gold-hover text-navy-dark rounded-xl font-bold uppercase tracking-wider shadow flex items-center"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT PHOTO CUSTOMIZATION MODAL */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative border border-slate-200 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-gold uppercase tracking-wider">PROFILE CUSTOMIZATION</span>
                <h3 className="text-xl font-bold text-navy mt-0.5">Update Student Profile Picture</h3>
              </div>
              <button onClick={() => setShowPhotoModal(false)} className="text-slate-400 hover:text-navy p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Avatar Preview */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-28 h-28 bg-navy text-gold font-serif font-bold text-4xl rounded-2xl flex items-center justify-center border-4 border-gold shadow-lg overflow-hidden">
                {(currentUser.photoUrl || currentUser.avatar) && !imgError ? (
                  <img src={currentUser.photoUrl || currentUser.avatar} alt="Current Profile" onError={() => setImgError(true)} className="w-full h-full object-cover" />
                ) : (
                  <span>{studentName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'ST'}</span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-serif">Upload your picture or select an official campus avatar below.</p>
            </div>

            {/* Upload from Local Device */}
            <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2">
              <Upload className="w-6 h-6 text-gold mx-auto" />
              <div className="text-xs font-bold text-navy">Upload from your Computer / Device</div>
              <p className="text-[11px] text-slate-500">Supports JPG, PNG, WEBP files up to 5MB.</p>
              <label className="inline-block mt-2 px-4 py-2 bg-navy text-gold font-bold text-xs rounded-xl shadow cursor-pointer hover:bg-navy-light uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5 inline mr-1.5" />
                Browse Device Images
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            {/* Curated Preset Avatars */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-navy flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" /> Or Choose a Verified Avatar Preset
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                {STUDENT_AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className="group flex flex-col items-center p-1.5 rounded-xl border border-slate-200 hover:border-gold hover:shadow-md transition-all bg-white"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group-hover:scale-105 transition-transform">
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-600 group-hover:text-navy truncate w-full text-center mt-1">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <FloatingHelpdesk />
    </div>
  );
};
