import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { User, Phone, ShieldCheck, Edit3, Save, Lock, Camera, Send, FileText, CheckCircle2, Upload, X, Sparkles } from 'lucide-react';

export const TeacherProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { updateUser, users = [] } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const TEACHER_AVATAR_PRESETS = [
    { label: "Professor Suit", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
    { label: "Academic Dean", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" },
    { label: "Senior Scientist", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
    { label: "Faculty Mentor", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
    { label: "Department Chair", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" },
    { label: "Research Director", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" }
  ];

  // Directly Editable Staff Fields
  const [formData, setFormData] = useState({
    personalEmail: currentUser?.personalEmail || currentUser?.email || '',
    phone: currentUser?.phone || '+91 98111 22233',
    address: currentUser?.address || 'Faculty Enclave, Kalpanaaa Campus',
    city: currentUser?.city || 'Bengaluru',
    state: currentUser?.state || 'Karnataka',
    pinCode: currentUser?.pinCode || '560001',
    emergencyContact: currentUser?.emergencyContact || '+91 98111 00000 (Next of Kin)'
  });

  // Official Change Request Form for Admin
  const [changeRequest, setChangeRequest] = useState({
    fieldName: 'Official Designation',
    newValue: '',
    reason: '',
    documentName: ''
  });

  if (!currentUser) return null;

  const staffName = currentUser.name || 'Faculty Member';
  let employeeId = currentUser.employeeId;
  if (!employeeId || employeeId.includes('@')) {
    if (currentUser.role === 'ADMIN') {
      employeeId = 'ADM-001';
    } else {
      const match = users.find(u => u.email === currentUser.email || u.id === currentUser.id);
      employeeId = match?.employeeId || (currentUser.username && !currentUser.username.includes('@') ? currentUser.username : 'EMP-101');
    }
  }
  const department = currentUser.department || 'Academic Department';
  const designation = currentUser.designation || 'Professor';
  const qualification = currentUser.qualification || 'Ph.D. / Master of Technology';
  const specialization = currentUser.specialization || 'Academic Research & Curriculum Instruction';
  const joiningDate = currentUser.joiningDate || '2020-08-01';
  const experience = currentUser.experience || '8+ Years Academic Experience';
  const status = currentUser.status || 'Active';

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedFields = {
      personalEmail: formData.personalEmail,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pinCode: formData.pinCode,
      emergencyContact: formData.emergencyContact
    };

    updateProfile(updatedFields);
    if (updateUser) {
      updateUser(currentUser.id || currentUser.employeeId, updatedFields, currentUser);
    }

    setToastMsg('Staff profile details updated and saved to database successfully!');
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
          updateUser(currentUser.id || currentUser.employeeId, { photoUrl: dataUrl, avatar: dataUrl }, currentUser);
        }
        setShowPhotoModal(false);
        setToastMsg('Faculty profile photo updated and saved to database successfully!');
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
      updateUser(currentUser.id || currentUser.employeeId, { photoUrl: presetUrl, avatar: presetUrl }, currentUser);
    }
    setShowPhotoModal(false);
    setToastMsg('Faculty avatar updated and saved to database successfully!');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setShowRequestModal(false);
    setRequestSubmitted(true);
    setTimeout(() => setRequestSubmitted(false), 5000);
    setChangeRequest({ fieldName: 'Official Designation', newValue: '', reason: '', documentName: '' });
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans relative">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
          
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
                <span>Official Record Change Request submitted to Administration! Track status in Admin Review.</span>
              </div>
            </div>
          )}

          {/* STAFF PROFILE HEADER */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 relative overflow-hidden font-sans">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              
              <div className="relative group flex-shrink-0">
                <div 
                  onClick={() => setShowPhotoModal(true)}
                  className="w-28 h-28 sm:w-32 sm:h-32 bg-navy text-gold font-serif font-bold text-4xl rounded-2xl flex items-center justify-center border-4 border-gold/40 shadow-xl overflow-hidden cursor-pointer relative"
                  title="Click to customize faculty picture"
                >
                  {(currentUser.photoUrl || currentUser.avatar || currentUser.image) && !imgError ? (
                    <img 
                      src={currentUser.photoUrl || currentUser.avatar || currentUser.image} 
                      alt={staffName} 
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="font-serif font-bold text-3xl sm:text-4xl text-gold">
                      {staffName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'FA'}
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

              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="bg-navy text-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-gold/30">
                    STAFF / FACULTY
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-3 py-1 rounded-full flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    {status} Faculty
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">{staffName}</h1>
                <p className="font-serif text-slate-600 text-xs sm:text-sm">
                  Employee ID: <strong className="font-num font-bold text-navy">{employeeId}</strong> &bull; {designation}
                </p>

                <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4 text-xs text-slate-600">
                  <div>Department: <strong className="text-slate-800">{department}</strong></div>
                  <div>Qualification: <strong className="text-navy">{qualification}</strong></div>
                  <div>Experience: <strong className="text-slate-800 font-num">{experience}</strong></div>
                </div>
              </div>

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
                  Request Official Change to Admin
                </button>
              </div>

            </div>
          </div>

          {/* MAIN PROFILE SECTIONS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
            
            {/* Left 7 Columns: Personal & Editable Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="text-lg font-sans font-bold text-navy tracking-tight flex items-center">
                    <User className="w-5 h-5 text-gold mr-2" />
                    Personal & Contact Details
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Directly Editable Fields Below
                  </span>
                </div>

                <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Official Name (Locked)</label>
                    <input type="text" readOnly value={staffName} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Employee ID (Locked)</label>
                    <input type="text" readOnly value={employeeId} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-num font-semibold cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase mb-1">Official Institutional Email</label>
                    <input type="email" readOnly value={currentUser.email || 'teacher@kalpanaaa.edu'} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-not-allowed" />
                  </div>

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
                      Mobile Phone Number *
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
                      City / State / PIN *
                      <Edit3 className="w-3 h-3 ml-1 text-gold" />
                    </label>
                    <input
                      type="text"
                      required
                      value={`${formData.city}, ${formData.state} - ${formData.pinCode}`}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-gold/60 focus:border-gold rounded-xl text-slate-800 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-navy font-bold uppercase mb-1 flex items-center">
                      Residential Address *
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
                      className="w-full py-3 bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow flex items-center justify-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Staff Profile Details
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right 5 Columns: Professional Information (Locked by Admin) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="text-lg font-sans font-bold text-navy tracking-tight flex items-center">
                    <Lock className="w-5 h-5 text-gold mr-2" />
                    Professional Information (Admin Controlled)
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Locked</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold">Designation:</span>
                    <strong className="text-navy">{designation}</strong>
                  </div>

                  <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold">Department:</span>
                    <strong className="text-slate-800">{department}</strong>
                  </div>

                  <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold">Highest Qualification:</span>
                    <strong className="text-slate-800">{qualification}</strong>
                  </div>

                  <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold">Specialization:</span>
                    <strong className="text-slate-800 text-right">{specialization}</strong>
                  </div>

                  <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold">Joining Date:</span>
                    <strong className="font-num text-slate-800">{joiningDate}</strong>
                  </div>

                  <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold">Total Experience:</span>
                    <strong className="font-num text-slate-800">{experience}</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* REQUEST OFFICIAL CHANGE MODAL TO ADMIN */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-navy">Submit Official Change Request to Admin</h3>
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
                  <option value="Official Designation">Official Designation</option>
                  <option value="Department Transfer">Department Transfer</option>
                  <option value="Official Name Record">Official Name Record</option>
                  <option value="Academic Qualification Upgrade">Academic Qualification Upgrade</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Correct / Requested Value *</label>
                <input
                  type="text"
                  required
                  value={changeRequest.newValue}
                  onChange={(e) => setChangeRequest({ ...changeRequest, newValue: e.target.value })}
                  placeholder="Enter exact requested detail"
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
                  placeholder="Provide justification for administrative review..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
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
                  Submit to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEACHER PHOTO CUSTOMIZATION MODAL */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative border border-slate-200 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-gold uppercase tracking-wider">FACULTY PROFILE CUSTOMIZATION</span>
                <h3 className="text-xl font-bold text-navy mt-0.5">Update Faculty Profile Picture</h3>
              </div>
              <button onClick={() => setShowPhotoModal(false)} className="text-slate-400 hover:text-navy p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Avatar Preview */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-28 h-28 bg-navy text-gold font-serif font-bold text-4xl rounded-2xl flex items-center justify-center border-4 border-gold shadow-lg overflow-hidden">
                {(currentUser.photoUrl || currentUser.avatar || currentUser.image) && !imgError ? (
                  <img src={currentUser.photoUrl || currentUser.avatar || currentUser.image} alt="Current Profile" onError={() => setImgError(true)} className="w-full h-full object-cover" />
                ) : (
                  <span>{staffName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'FA'}</span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-serif">Upload your picture or select an official faculty avatar below.</p>
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
                <Sparkles className="w-3.5 h-3.5 text-gold" /> Or Choose a Verified Faculty Preset
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                {TEACHER_AVATAR_PRESETS.map((preset, idx) => (
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
    </div>
  );
};
