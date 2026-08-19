import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { FileText, ShieldAlert, CheckCircle2, UserCheck, AlertTriangle, BookOpen, Scale, Mail } from 'lucide-react';

export const TermsConditions = () => {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Breadcrumbs />

      {/* Header Banner */}
      <div className="bg-navy text-amber-50 py-14 border-b-4 border-gold">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/20">
            TERMS OF USE & CODE OF CONDUCT
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white">
            Terms & Conditions of Service
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Legal terms governing portal access, academic conduct, tuition billing, and CMS platform usage for students, faculty, and administrators.
          </p>
          <div className="text-[11px] text-slate-400 pt-2 font-num">
            Effective Date: August 18, 2026 &bull; Version 5.1 (Higher Education Standard)
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Navigation Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24 space-y-4">
              <h3 className="font-serif font-bold text-navy text-sm uppercase tracking-wider border-b pb-2">
                Terms Index
              </h3>
              <nav className="space-y-2 text-xs font-medium text-slate-600">
                <a href="#term-1" className="block hover:text-gold transition-colors py-1">1. Acceptance of Terms</a>
                <a href="#term-2" className="block hover:text-gold transition-colors py-1">2. User Account & Credential Responsibility</a>
                <a href="#term-3" className="block hover:text-gold transition-colors py-1">3. Acceptable Use Policy & System Conduct</a>
                <a href="#term-4" className="block hover:text-gold transition-colors py-1">4. Academic Integrity & Grading Standards</a>
                <a href="#term-5" className="block hover:text-gold transition-colors py-1">5. Tuition Fees, Billing & Payment Policy</a>
                <a href="#term-6" className="block hover:text-gold transition-colors py-1">6. Intellectual Property Rights</a>
                <a href="#term-7" className="block hover:text-gold transition-colors py-1">7. System Availability & Service Level</a>
                <a href="#term-8" className="block hover:text-gold transition-colors py-1">8. Governing Law & Institutional Jurisdiction</a>
              </nav>

              <div className="pt-4 border-t border-slate-100 bg-amber-500/10 p-4 rounded-xl space-y-2">
                <div className="flex items-center text-xs font-bold text-navy">
                  <ShieldAlert className="w-4 h-4 text-gold mr-1.5" />
                  Mandatory Compliance
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  By logging into the Kalpanaaa CMS or registering an account, users explicitly agree to abide by these institutional terms.
                </p>
              </div>
            </div>
          </div>

          {/* Right Main Legal Document */}
          <div className="lg:col-span-8 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-10 text-xs sm:text-sm leading-relaxed text-slate-700">
            
            {/* Intro */}
            <div className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-navy border-b pb-2">
                Institutional User Agreement
              </h2>
              <p>
                Welcome to Kalpanaaa Education's Enterprise School Management System ("CMS", "Platform"). These Terms and Conditions govern all interactions across our Public Website, Student Portal, Faculty Portal, and Administrative Governance Console. Accessing or using any part of the system constitutes full acceptance of this agreement.
              </p>
            </div>

            {/* Term 1 */}
            <div id="term-1" className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-serif font-bold text-navy flex items-center">
                <CheckCircle2 className="w-4 h-4 text-gold mr-2" />
                1. Acceptance of Terms
              </h3>
              <p>
                This Agreement is legally binding between Kalpanaaa Education and all authenticated users (Students, Guardians, Faculty Members, Teaching Assistants, and Administrative Officers). Users who do not agree with any section of these terms must immediately cease using the platform.
              </p>
            </div>

            {/* Term 2 */}
            <div id="term-2" className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-serif font-bold text-navy flex items-center">
                <UserCheck className="w-4 h-4 text-gold mr-2" />
                2. User Account & Credential Responsibility
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Unique Staff & Student IDs:</strong> Every user is assigned a unique institutional identifier (e.g. `STU-CSE-101`, `EMP-101`). Credential sharing is strictly prohibited.</li>
                <li><strong>Account Confidentiality:</strong> Users are solely responsible for maintaining the secrecy of their passwords. Any action performed under a user’s credentials will be attributed to that account holder.</li>
                <li><strong>Unauthorized Access Notification:</strong> Users must report any suspected breach or unauthorized login attempt to <a href="mailto:security@kalpanaaa.edu" className="text-navy font-bold hover:underline">security@kalpanaaa.edu</a> immediately.</li>
              </ul>
            </div>

            {/* Term 3 */}
            <div id="term-3" className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-serif font-bold text-navy flex items-center">
                <AlertTriangle className="w-4 h-4 text-gold mr-2" />
                3. Acceptable Use Policy & System Conduct
              </h3>
              <p>Users must not engage in any activity that compromises platform stability or integrity. Specifically, users shall NOT:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Attempt to bypass Role-Based Access Control (RBAC) to view unauthorized student marks or financial data.</li>
                <li>Execute automated scrapers, denial-of-service scripts, or SQL injection queries against the Express REST API endpoints.</li>
                <li>Upload malware, malicious attachments, or inappropriate media into student assignment submissions or helpdesk support tickets.</li>
                <li>Falsify attendance logs or manipulate RFID/biometric recording data.</li>
              </ul>
            </div>

            {/* Term 4 */}
            <div id="term-4" className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-serif font-bold text-navy flex items-center">
                <BookOpen className="w-4 h-4 text-gold mr-2" />
                4. Academic Integrity & Grading Standards
              </h3>
              <p>
                All assignment submissions, internal evaluation marks, and examination answers submitted through the portal are subjected to automated plagiarism checks and academic integrity standards. Any fraudulent submissions will result in disciplinary action per University Regulations.
              </p>
            </div>

            {/* Term 5 */}
            <div id="term-5" className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-serif font-bold text-navy">
                5. Tuition Fees, Billing & Payment Policy
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Payment Clearance:</strong> Tuition fees must be settled prior to the published due dates. Stamped receipts (`TXN-FEE-xxx`) are generated upon successful clearance.</li>
                <li><strong>Hall Ticket Eligibility:</strong> Examination Hall Tickets will only be issued to students with no outstanding tuition fee dues.</li>
                <li><strong>Refund Policy:</strong> Tuition fee refunds for program withdrawals are processed strictly according to UGC refund timelines.</li>
              </ul>
            </div>

            {/* Term 6 */}
            <div id="term-6" className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-serif font-bold text-navy">
                6. Intellectual Property Rights
              </h3>
              <p>
                All curriculum materials, course syllabus documents, lecture recordings, logos, crests, software code, and design elements published on the Kalpanaaa CMS remain the exclusive intellectual property of Kalpanaaa Education.
              </p>
            </div>

            {/* Term 7 */}
            <div id="term-7" className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-serif font-bold text-navy">
                7. System Availability & Service Level
              </h3>
              <p>
                While we strive for 99.9% uptime across our production servers, planned maintenance windows or emergency server restarts may occasionally occur. Scheduled maintenance will be announced in advance via system notifications.
              </p>
            </div>

            {/* Term 8 */}
            <div id="term-8" className="space-y-3 pt-4 border-t border-slate-100 bg-navy/5 p-6 rounded-2xl border border-navy/10">
              <h3 className="text-base font-serif font-bold text-navy flex items-center">
                <Scale className="w-4 h-4 text-gold mr-2" />
                8. Governing Law & Institutional Jurisdiction
              </h3>
              <p className="text-xs text-slate-600">
                These terms are governed by the laws of India and higher education regulations. Any legal disputes shall fall under the exclusive jurisdiction of the courts in New Delhi.
              </p>
              <div className="text-xs font-semibold text-navy pt-2">
                Office of Legal & Regulatory Affairs &bull; Kalpanaaa Education
                <br />
                Contact: <a href="mailto:legal@kalpanaaa.edu" className="text-gold-hover hover:underline">legal@kalpanaaa.edu</a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
