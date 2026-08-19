import React, { useState } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

export const FAQPublic = () => {
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      category: "Admissions",
      question: "How do I submit an online application for Kalpanaaa Education?",
      answer: "You can apply directly online by navigating to Admissions -> Online Application Form. Fill in your personal details, academic marksheets, and parent details. Upon submission, an application reference code will be generated."
    },
    {
      category: "Admissions",
      question: "What are the eligibility criteria for B.Tech Computer Science?",
      answer: "Candidates must have completed 10+2 (Senior Secondary) with Physics, Mathematics, and Chemistry with a minimum 60% aggregate score from a recognized board."
    },
    {
      category: "Fees & Scholarships",
      question: "Are merit-based scholarships available for outstanding students?",
      answer: "Yes, Kalpanaaa Education offers Merit Scholarships covering up to 100% of tuition fees for top rankers in national entrance examinations and high-achieving board candidates."
    },
    {
      category: "Academics & Portal",
      question: "How do students access timetables, grades, and submit leave applications?",
      answer: "All enrolled students log in through the single unified LOGIN page (/login) using their Student ID or Email. The portal automatically provides real-time access to attendance, results, fees, assignments, and leave management."
    },
    {
      category: "Campus Life",
      question: "What hostel and library facilities are available on campus?",
      answer: "Our 45-acre campus features air-conditioned student hostels, 24/7 security, high-speed WiFi, modern dining halls, and a Central Library housing over 100,000 volumes and digital journals."
    },
    {
      category: "Examinations & Marks",
      question: "When are mid-semester and end-semester results published?",
      answer: "Mid-semester internal marks are uploaded by course faculty and reviewed by the HOD. Official end-semester examination results are published directly to the Student Portal by the Controller of Examinations."
    },
    {
      category: "Placements & Internships",
      question: "Does the institution offer campus placement assistance?",
      answer: "Yes, our Corporate Relations & Training Cell conducts mock technical interviews, soft skills workshops, and hosts annual campus drives with 50+ tier-1 hiring partners including Google, Amazon, Microsoft, and Infosys."
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(search.toLowerCase()) || 
    f.answer.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Header - White Background */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full">
            HELP & SUPPORT CENTER
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Find immediate answers regarding admissions, degree programs, portal access, and campus life.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions by keyword (e.g., application, fee, portal)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-gold shadow-sm"
          />
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-gold flex-shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold block">{faq.category}</span>
                      <h4 className="text-base font-serif font-bold text-navy">{faq.question}</h4>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transform transition-transform ${isOpen ? 'rotate-180 text-gold' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
