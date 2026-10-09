import React, { useState } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useData } from '../../context/DataContext';
import { generateAppRef } from '../../utils/idGenerator';
import { CheckCircle2, ArrowRight, Upload, FileText, AlertCircle } from 'lucide-react';

export const ApplicationForm = () => {
  const { submitAdmissionApplication, courses = [] } = useData();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [applicationRef, setApplicationRef] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    course: 'B.Tech Computer Science & Engineering',
    department: 'Computer Science',
    prevQualification: '12th Standard / Senior Secondary',
    prevPercentage: '',
    guardianName: '',
    guardianPhone: '',
    address: '',
    doc10th: null,
    doc12th: null,
    docTc: null
  });

  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email Address is required.';
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(formData.email.trim())) {
      errs.email = 'Email address must end with @gmail.com (e.g. name@gmail.com).';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errs.phone = 'Please enter a valid 10-digit numeric mobile number.';
    }
    if (!formData.dob) {
      errs.dob = 'Date of Birth is required.';
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 17) {
        errs.dob = 'You must be at least 17 years old to apply.';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    const marks = Number(formData.prevPercentage);
    if (formData.prevPercentage === '' || isNaN(marks)) {
      errs.prevPercentage = 'Previous Aggregate Marks percentage is required.';
    } else if (marks < 0) {
      errs.prevPercentage = 'Marks percentage cannot be negative. Please enter a valid percentage (0–100%).';
    } else if (marks > 100) {
      errs.prevPercentage = 'Marks percentage cannot exceed 100%.';
    } else if (marks < 35) {
      errs.prevPercentage = 'Minimum 35% aggregate marks required for admission consideration.';
    }

    if (!formData.guardianName.trim()) {
      errs.guardianName = 'Guardian Name is required.';
    }

    if (formData.guardianPhone && !/^\d{10}$/.test(formData.guardianPhone)) {
      errs.guardianPhone = 'Guardian phone must be a valid 10-digit numeric number.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!formData.doc10th) errs.doc10th = '10th Class Marksheet / Certificate is required.';
    if (!formData.doc12th) errs.doc12th = '12th Class Marksheet / Certificate is required.';
    if (!formData.docTc) errs.docTc = 'Transfer / Migration Certificate is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    if (submitAdmissionApplication) {
      const ref = submitAdmissionApplication({
        ...formData,
        docUploaded: true,
        documentsList: [
          `10th Marksheet (${formData.doc10th})`,
          `12th Marksheet (${formData.doc12th})`,
          `TC Certificate (${formData.docTc})`
        ]
      });
      setApplicationRef(ref);
    }
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Header - White Background */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full">
            ADMISSIONS 2026-2027
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Online Admission Application
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Complete the official application form to enroll at Kalpanaaa Education.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {submitted ? (
          <div className="bg-white p-10 rounded-2xl shadow-xl border-t-8 border-emerald-500 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-navy">Application Submitted Successfully!</h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              Your application reference code is <strong className="text-navy bg-slate-100 px-3 py-1 rounded font-num">{applicationRef || generateAppRef()}</strong>. A confirmation email has been dispatched to <strong>{formData.email}</strong>.
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-lg mx-auto text-left text-xs text-slate-700 space-y-1.5">
              <div>Applicant Name: <strong>{formData.fullName}</strong></div>
              <div>Selected Course: <strong>{formData.course}</strong></div>
              <div>Status: <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">Under Verification</span></div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Step Indicators with 4-Step Progress Bar */}
            <div className="bg-navy text-white px-6 sm:px-8 py-5 border-b border-navy-light text-xs font-semibold">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-gold' : 'text-slate-400'}`}>
                  <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center font-bold font-num">1</span>
                  <span className="hidden sm:inline">Personal Info</span>
                </div>
                <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-gold' : 'text-slate-400'}`}>
                  <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center font-bold font-num">2</span>
                  <span className="hidden sm:inline">Academics</span>
                </div>
                <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-gold' : 'text-slate-400'}`}>
                  <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center font-bold font-num">3</span>
                  <span className="hidden sm:inline">Course Choice</span>
                </div>
                <div className={`flex items-center space-x-2 ${step >= 4 ? 'text-gold' : 'text-slate-400'}`}>
                  <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center font-bold font-num">4</span>
                  <span className="hidden sm:inline">Review & Submit</span>
                </div>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-navy-light h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gold h-full transition-all duration-500 ease-in-out"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              {/* STEP 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-serif font-bold text-navy border-b border-slate-100 pb-2">Step 1: Personal Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Applicant Name *</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:border-gold focus:outline-none"
                        placeholder="e.g. Aarav Patel"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email Address (@gmail.com) *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:border-gold focus:outline-none"
                        placeholder="e.g. yourname@gmail.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Phone Number (10 Digits) *</label>
                      <input
                        type="tel"
                        maxLength={10}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={formData.phone}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, phone: numericValue });
                        }}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:border-gold focus:outline-none font-num"
                        placeholder="e.g. 9876543210"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:border-gold focus:outline-none font-num"
                      />
                      {errors.dob && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.dob}</p>}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-navy hover:bg-navy-light text-white font-bold text-xs px-6 py-3 rounded-lg uppercase tracking-wider flex items-center"
                    >
                      <span>SAVE & CONTINUE</span> <ArrowRight className="w-4 h-4 ml-2 text-gold" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Academic Info */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-serif font-bold text-navy border-b border-slate-100 pb-2">Step 2: Course & Academic Record</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Select Program / Degree Course *</label>
                      <select
                        value={formData.course}
                        onChange={(e) => {
                          const selectedCourseName = e.target.value;
                          const cObj = (courses || []).find(c => c.name === selectedCourseName);
                          setFormData({ 
                            ...formData, 
                            course: selectedCourseName,
                            department: cObj ? cObj.department : formData.department 
                          });
                        }}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none"
                      >
                        {(courses && courses.length > 0 ? courses : [
                          { name: 'B.Tech Computer Science & Engineering', department: 'Computer Science & Engineering' },
                          { name: 'B.Tech Information Science & Engineering', department: 'Information Science & Engineering' },
                          { name: 'B.Tech Electronics & Communication Engineering', department: 'Electronics & Communication Engineering' },
                          { name: 'B.Tech Electrical & Electronics Engineering', department: 'Electrical & Electronics Engineering' },
                          { name: 'B.Tech Mechanical Engineering', department: 'Mechanical Engineering' },
                          { name: 'B.Tech Civil Engineering', department: 'Civil & Environmental Engineering' },
                          { name: 'Master of Business Administration (MBA)', department: 'Management Studies' }
                        ]).map((c, idx) => (
                          <option key={c.id || idx} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Previous Aggregate Marks (%) *</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.prevPercentage}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === '' || Number(v) >= 0) {
                            setFormData({ ...formData, prevPercentage: v });
                          }
                        }}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:border-gold focus:outline-none font-num"
                        placeholder="e.g. 88.5"
                      />
                      {errors.prevPercentage && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.prevPercentage}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Parent / Guardian Full Name *</label>
                      <input
                        type="text"
                        value={formData.guardianName}
                        onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:border-gold focus:outline-none"
                        placeholder="e.g. Suresh Patel"
                      />
                      {errors.guardianName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.guardianName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Guardian Contact Phone (10 Digits)</label>
                      <input
                        type="tel"
                        maxLength={10}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={formData.guardianPhone}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, guardianPhone: numericValue });
                        }}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:border-gold focus:outline-none font-num"
                        placeholder="e.g. 9812345678"
                      />
                      {errors.guardianPhone && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.guardianPhone}</p>}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-6 py-3 rounded-lg uppercase tracking-wider"
                    >
                      BACK
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-navy hover:bg-navy-light text-white font-bold text-xs px-6 py-3 rounded-lg uppercase tracking-wider flex items-center"
                    >
                      <span>CONTINUE TO DOCUMENTS</span> <ArrowRight className="w-4 h-4 ml-2 text-gold" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Upload & Submit */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-xl font-serif font-bold text-navy">Step 3: Document Upload & Final Verification</h3>
                    <p className="text-slate-500 text-xs mt-1">Please select and upload individual copies of all 3 required certificates before submitting your application.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 1. 10th Marksheet */}
                    <div className={`p-5 rounded-2xl border-2 transition-all ${formData.doc10th ? 'border-emerald-400 bg-emerald-50/50' : 'border-dashed border-slate-300 bg-slate-50'}`}>
                      <div className="flex items-center space-x-2 text-xs font-bold text-navy uppercase">
                        <FileText className={`w-4 h-4 ${formData.doc10th ? 'text-emerald-600' : 'text-gold'}`} />
                        <span>10th Marksheet *</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">SSLC / Secondary School Passing Certificate (PDF, JPG, PNG)</p>
                      
                      <div className="mt-4">
                        {formData.doc10th ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{formData.doc10th}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, doc10th: null })}
                              className="text-[11px] font-bold text-rose-600 hover:underline block"
                            >
                              Remove / Re-upload
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer bg-navy hover:bg-navy-light text-white font-bold text-xs px-3.5 py-2 rounded-xl inline-flex items-center space-x-1.5 transition">
                            <Upload className="w-3.5 h-3.5 text-gold" />
                            <span>Choose 10th File</span>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    setFormData(prev => ({
                                      ...prev,
                                      doc10th: file.name,
                                      doc10thData: ev.target.result
                                    }));
                                    setErrors(prev => ({ ...prev, doc10th: null }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                      {errors.doc10th && <p className="text-rose-500 text-xs font-semibold mt-2">{errors.doc10th}</p>}
                    </div>

                    {/* 2. 12th Marksheet */}
                    <div className={`p-5 rounded-2xl border-2 transition-all ${formData.doc12th ? 'border-emerald-400 bg-emerald-50/50' : 'border-dashed border-slate-300 bg-slate-50'}`}>
                      <div className="flex items-center space-x-2 text-xs font-bold text-navy uppercase">
                        <FileText className={`w-4 h-4 ${formData.doc12th ? 'text-emerald-600' : 'text-gold'}`} />
                        <span>12th Marksheet *</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">HSC / Higher Secondary / Diploma Certificate (PDF, JPG, PNG)</p>
                      
                      <div className="mt-4">
                        {formData.doc12th ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{formData.doc12th}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, doc12th: null, doc12thData: null })}
                              className="text-[11px] font-bold text-rose-600 hover:underline block"
                            >
                              Remove / Re-upload
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer bg-navy hover:bg-navy-light text-white font-bold text-xs px-3.5 py-2 rounded-xl inline-flex items-center space-x-1.5 transition">
                            <Upload className="w-3.5 h-3.5 text-gold" />
                            <span>Choose 12th File</span>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    setFormData(prev => ({
                                      ...prev,
                                      doc12th: file.name,
                                      doc12thData: ev.target.result
                                    }));
                                    setErrors(prev => ({ ...prev, doc12th: null }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                      {errors.doc12th && <p className="text-rose-500 text-xs font-semibold mt-2">{errors.doc12th}</p>}
                    </div>

                    {/* 3. Transfer Certificate */}
                    <div className={`p-5 rounded-2xl border-2 transition-all ${formData.docTc ? 'border-emerald-400 bg-emerald-50/50' : 'border-dashed border-slate-300 bg-slate-50'}`}>
                      <div className="flex items-center space-x-2 text-xs font-bold text-navy uppercase">
                        <FileText className={`w-4 h-4 ${formData.docTc ? 'text-emerald-600' : 'text-gold'}`} />
                        <span>TC / Migration *</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">School Leaving / Transfer Certificate (PDF, JPG, PNG)</p>
                      
                      <div className="mt-4">
                        {formData.docTc ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{formData.docTc}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, docTc: null, docTcData: null })}
                              className="text-[11px] font-bold text-rose-600 hover:underline block"
                            >
                              Remove / Re-upload
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer bg-navy hover:bg-navy-light text-white font-bold text-xs px-3.5 py-2 rounded-xl inline-flex items-center space-x-1.5 transition">
                            <Upload className="w-3.5 h-3.5 text-gold" />
                            <span>Choose TC File</span>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    setFormData(prev => ({
                                      ...prev,
                                      docTc: file.name,
                                      docTcData: ev.target.result
                                    }));
                                    setErrors(prev => ({ ...prev, docTc: null }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                      {errors.docTc && <p className="text-rose-500 text-xs font-semibold mt-2">{errors.docTc}</p>}
                    </div>
                  </div>

                  {/* Warning message if certificates missing */}
                  {(!formData.doc10th || !formData.doc12th || !formData.docTc) && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center space-x-3 text-xs font-bold text-amber-900">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <span>All 3 required certificates (10th Marksheet, 12th Marksheet, and TC Certificate) must be uploaded before submitting your application.</span>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-6 py-3 rounded-lg uppercase tracking-wider"
                    >
                      BACK
                    </button>
                    <button
                      type="submit"
                      disabled={!formData.doc10th || !formData.doc12th || !formData.docTc}
                      className={`font-bold text-xs px-8 py-3.5 rounded-lg uppercase tracking-wider shadow-lg transition-all ${
                        formData.doc10th && formData.doc12th && formData.docTc
                          ? 'bg-gold hover:bg-gold-hover text-navy-dark cursor-pointer'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                      }`}
                    >
                      SUBMIT APPLICATION NOW
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
