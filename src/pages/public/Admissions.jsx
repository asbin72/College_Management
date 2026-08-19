import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Award, FileText } from 'lucide-react';

const FeeEstimatorWidget = () => {
  const [courseFee, setCourseFee] = useState(120000);
  const [hostelFee, setHostelFee] = useState(0);
  const [busFee, setBusFee] = useState(0);

  const handleHostelChange = (value) => {
    const fee = Number(value);
    setHostelFee(fee);
    if (fee > 0) {
      setBusFee(0); // Mutually exclusive: Hostel residents live on campus and do not require bus transport
    }
  };

  const handleBusChange = (value) => {
    const fee = Number(value);
    setBusFee(fee);
    if (fee > 0) {
      setHostelFee(0); // Mutually exclusive: Bus commuters are day scholars
    }
  };

  const totalAnnual = courseFee + hostelFee + busFee;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 font-sans text-xs">
      <div className="md:col-span-7 space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">1. Select Academic Program *</label>
          <select
            value={courseFee}
            onChange={(e) => setCourseFee(Number(e.target.value))}
            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none shadow-sm"
          >
            <option value={120000}>B.Tech Computer Science & Engineering (₹1,20,000 / Year)</option>
            <option value={115000}>B.Tech Information Science & Engineering (₹1,15,000 / Year)</option>
            <option value={115000}>B.Tech Electronics & Communication (₹1,15,000 / Year)</option>
            <option value={110000}>B.Tech Mechanical Engineering (₹1,10,000 / Year)</option>
            <option value={105000}>B.Tech Civil Engineering (₹1,05,000 / Year)</option>
            <option value={150000}>Master of Business Administration (MBA) (₹1,50,000 / Year)</option>
          </select>
        </div>


        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">2. Hostel Accommodation</label>
              {busFee > 0 && (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">
                  Locked
                </span>
              )}
            </div>
            <select
              value={hostelFee}
              disabled={busFee > 0}
              onChange={(e) => handleHostelChange(e.target.value)}
              className={`w-full p-3 border rounded-xl text-xs font-bold focus:border-gold focus:outline-none shadow-sm transition-colors ${
                busFee > 0
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : hostelFee > 0
                    ? 'bg-white border-gold text-navy ring-1 ring-gold'
                    : 'bg-white border-slate-300 text-navy'
              }`}
            >
              <option value={0}>{busFee > 0 ? 'Disabled (Bus Commuter Selected)' : 'Day Scholar (No Hostel)'}</option>
              <option value={60000}>Hostel AC Room (₹60,000 / Year)</option>
              <option value={40000}>Hostel Non-AC Room (₹40,000 / Year)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">3. Campus Transport</label>
              {hostelFee > 0 && (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">
                  Locked
                </span>
              )}
            </div>
            <select
              value={busFee}
              disabled={hostelFee > 0}
              onChange={(e) => handleBusChange(e.target.value)}
              className={`w-full p-3 border rounded-xl text-xs font-bold focus:border-gold focus:outline-none shadow-sm transition-colors ${
                hostelFee > 0
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : busFee > 0
                    ? 'bg-white border-gold text-navy ring-1 ring-gold'
                    : 'bg-white border-slate-300 text-navy'
              }`}
            >
              <option value={0}>{hostelFee > 0 ? 'Disabled (Hostel Resident Selected)' : 'Own Transport (No Bus)'}</option>
              <option value={15000}>AC Campus Bus Service (₹15,000 / Year)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="md:col-span-5 bg-navy text-white p-6 rounded-2xl border border-navy-light text-center space-y-3 shadow-xl">
        <span className="text-gold text-[10px] font-bold uppercase tracking-widest bg-gold/10 px-2.5 py-0.5 rounded">
          ESTIMATED ANNUAL INVESTMENT
        </span>
        <div className="text-3xl sm:text-4xl font-num font-bold text-amber-50">
          ₹{totalAnnual.toLocaleString()}
        </div>
        <p className="text-[11px] text-slate-300 font-serif">Includes tuition, laboratory access, examination fees & chosen amenities.</p>
        
        <Link
          to="/admissions/application"
          className="inline-block w-full bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs py-3 rounded-xl uppercase tracking-wider shadow"
        >
          Proceed to Online Application
        </Link>
      </div>
    </div>
  );
};

export const Admissions = () => {
  const location = useLocation();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (location.pathname.includes('/process')) {
      setTimeout(() => scrollToSection('admission-process'), 100);
    } else if (location.pathname.includes('/eligibility')) {
      setTimeout(() => scrollToSection('eligibility-criteria'), 100);
    } else if (location.pathname.includes('/scholarships')) {
      setTimeout(() => scrollToSection('scholarships-aid'), 100);
    } else if (location.pathname.includes('/fees') || location.pathname.includes('/fee-structure')) {
      setTimeout(() => scrollToSection('fee-estimator'), 100);
    }
  }, [location]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Header */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full">
            ADMISSIONS 2026-2027
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Admissions, Eligibility & Scholarships
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Begin your academic journey at Kalpanaaa Education. Explore eligibility, fee structures, merit aid, and apply online.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* SECTION 1: Application CTA Banner */}
        <div className="bg-gradient-to-r from-navy-dark via-navy to-navy-dark text-white p-8 sm:p-12 rounded-2xl shadow-xl border-t-4 border-gold flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded">ADMISSIONS OPEN</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-50 mt-2">Ready to Apply for Session 2026-2027?</h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">Online applications are open for B.Tech CSE, IT, and MBA programs.</p>
          </div>
          <Link
            to="/admissions/application"
            className="inline-flex items-center bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs px-8 py-4 rounded-lg uppercase tracking-wider shadow-xl flex-shrink-0"
          >
            <span>START ONLINE APPLICATION</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {/* SECTION 2: 4-Step Admission Process */}
        <div id="admission-process" className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-gold text-xs font-bold uppercase tracking-widest">STEP-BY-STEP ROADMAP</span>
            <h2 className="text-3xl font-serif font-bold text-navy mt-1">The Admission Process</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="p-5 bg-slate-50 rounded-xl text-center border border-slate-200">
              <div className="w-10 h-10 bg-navy text-gold rounded-full flex items-center justify-center font-bold mx-auto mb-3 font-num">1</div>
              <h4 className="font-serif font-bold text-navy text-base mb-1">Select Program</h4>
              <p className="text-xs text-slate-600">Review degree offerings, course eligibility, and specialization options.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl text-center border border-slate-200">
              <div className="w-10 h-10 bg-navy text-gold rounded-full flex items-center justify-center font-bold mx-auto mb-3 font-num">2</div>
              <h4 className="font-serif font-bold text-navy text-base mb-1">Fill Application</h4>
              <p className="text-xs text-slate-600">Complete the online form with academic marksheets and personal details.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl text-center border border-slate-200">
              <div className="w-10 h-10 bg-navy text-gold rounded-full flex items-center justify-center font-bold mx-auto mb-3 font-num">3</div>
              <h4 className="font-serif font-bold text-navy text-base mb-1">Document Verification</h4>
              <p className="text-xs text-slate-600">Verification of 10th/12th marksheets, identity proof, and entrance rank.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl text-center border border-slate-200">
              <div className="w-10 h-10 bg-navy text-gold rounded-full flex items-center justify-center font-bold mx-auto mb-3 font-num">4</div>
              <h4 className="font-serif font-bold text-navy text-base mb-1">Seat Confirmation</h4>
              <p className="text-xs text-slate-600">Receive formal admission offer letter and pay tuition fee installment.</p>
            </div>
          </div>
        </div>

        {/* Interactive Tuition Fee Estimator Card */}
        <div id="fee-estimator" className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border-2 border-gold/40 space-y-6 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded">
              TUITION CALCULATOR
            </span>
            <h2 className="text-3xl font-serif font-bold text-navy mt-2">Interactive Fee Estimator</h2>
            <p className="text-slate-500 text-xs mt-1">Select degree program, hostel accommodation, and transport options for an instant estimated annual fee breakdown.</p>
          </div>

          <FeeEstimatorWidget />
        </div>

        {/* SECTION 3: Eligibility & Fee Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Eligibility Requirements */}
          <div id="eligibility-criteria" className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4 scroll-mt-24">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="w-7 h-7 text-gold" />
              <h3 className="text-2xl font-serif font-bold text-navy">Eligibility Criteria</h3>
            </div>
            
            <ul className="space-y-3 text-slate-600 text-xs sm:text-sm">
              <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-gold mr-2 mt-0.5 flex-shrink-0" /><strong>B.Tech Programs:</strong> 10+2 with Physics, Mathematics, Chemistry with min 60% aggregate.</li>
              <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-gold mr-2 mt-0.5 flex-shrink-0" /><strong>MBA Program:</strong> Bachelor Degree in any discipline with min 50% aggregate score.</li>
              <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-gold mr-2 mt-0.5 flex-shrink-0" /><strong>Entrance Exemption:</strong> Direct merit seats available for top 5% board toppers.</li>
            </ul>
          </div>

          {/* Fee Structure & Scholarships */}
          <div id="scholarships-aid" className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4 scroll-mt-24">
            <div className="flex items-center space-x-3 mb-2">
              <Award className="w-7 h-7 text-gold" />
              <h3 className="text-2xl font-serif font-bold text-navy">Fee & Merit Scholarships</h3>
            </div>
            
            <ul className="space-y-3 text-slate-600 text-xs sm:text-sm">
              <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-gold mr-2 mt-0.5 flex-shrink-0" /><strong>B.Tech Tuition:</strong> <span className="font-num">₹1,20,000</span> / year (Installment payment plans available).</li>
              <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-gold mr-2 mt-0.5 flex-shrink-0" /><strong>MBA Tuition:</strong> <span className="font-num">₹1,50,000</span> / year.</li>
              <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-gold mr-2 mt-0.5 flex-shrink-0" /><strong>Scholarships:</strong> Up to 100% tuition waiver for national merit rankers.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
