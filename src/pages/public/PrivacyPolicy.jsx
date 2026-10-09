import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { ShieldCheck, Lock, Eye, Database, FileText, CheckCircle2, Mail, Phone } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Breadcrumbs />

      {/* Header Banner */}
      <div className="bg-navy text-amber-50 py-14 border-b-4 border-gold">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/20">
            INSTITUTIONAL GOVERNANCE & COMPLIANCE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white">
            Privacy Policy & Data Governance Notice
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            How Kalpanaaa Education collects, protects, stores, and governs student, faculty, and institutional administrative data.
          </p>
          <div className="text-[11px] text-slate-400 pt-2 font-num">
            Effective Date: August 18, 2026 &bull; Version 4.2 (Accreditation Aligned)
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Table of Contents */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24 space-y-4">
              <h3 className="font-serif font-bold text-navy text-sm uppercase tracking-wider border-b pb-2">
                Policy Sections
              </h3>
              <nav className="space-y-2 text-xs font-medium text-slate-600">
                <a href="#section-1" className="block hover:text-gold transition-colors py-1">1. Information We Collect</a>
                <a href="#section-2" className="block hover:text-gold transition-colors py-1">2. How Data is Used</a>
                <a href="#section-3" className="block hover:text-gold transition-colors py-1">3. Data Security & Storage Architecture</a>
                <a href="#section-4" className="block hover:text-gold transition-colors py-1">4. Role-Based Access Control (RBAC)</a>
                <a href="#section-5" className="block hover:text-gold transition-colors py-1">5. Retention & Permanent Transcript Records</a>
                <a href="#section-6" className="block hover:text-gold transition-colors py-1">6. Student Rights & Data Access</a>
                <a href="#section-7" className="block hover:text-gold transition-colors py-1">7. Data Protection Officer (DPO) Contact</a>
              </nav>

              <div className="pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl space-y-2">
                <div className="flex items-center text-xs font-bold text-navy">
                  <ShieldCheck className="w-4 h-4 text-gold mr-1.5" />
                  ISO 27001 Certified CMS
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Our Enterprise School Management System strictly adheres to higher education data privacy laws and university accreditation regulations.
                </p>
              </div>
            </div>
          </div>

          {/* Right Main Detailed Document */}
          <div className="lg:col-span-8 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-10 text-xs sm:text-sm leading-relaxed text-slate-700">
            
            {/* Intro */}
            <div className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-navy border-b pb-2">
                Institutional Commitment to Privacy
              </h2>
              <p>
                Kalpanaaa Education ("Institution", "We", "Our") operates a comprehensive digital School Management System (CMS) governing admissions, daily attendance, examination grading, fee transactions, and faculty workload allocations. We are deeply committed to maintaining the confidentiality, integrity, and security of all personal, academic, and financial data belonging to students, parents, faculty members, and administrative staff.
              </p>
            </div>

            {/* Section 1 */}
            <div id="section-1" className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-serif font-bold text-navy flex items-center">
                <Database className="w-4 h-4 text-gold mr-2" />
                1. Information We Collect
              </h3>
              <p>To provide seamless academic instruction and management governance, we collect the following categories of information:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Student Identity Data:</strong> Full Legal Name, Roll Number, Register Number, Date of Birth, Gender, Blood Group, and Photo Identity credentials.</li>
                <li><strong>Parent & Guardian Data:</strong> Guardian Name, Contact Phone Numbers, Personal Email Addresses, and Residential Postal Addresses.</li>
                <li><strong>Academic Records:</strong> Course Enrollments, Department Mappings, Internal Marks, Exam Results, SGPA/CGPA Calculations, and Official Transcripts.</li>
                <li><strong>Attendance Records:</strong> Daily class attendance timestamps, RFID/biometric logs, and leave approval applications.</li>
                <li><strong>Faculty & Staff Portfolio:</strong> Employee IDs, Institutional Email Addresses, Academic Qualifications, Teaching Workloads, and Class Allocations.</li>
                <li><strong>Financial & Fee Records:</strong> Tuition Fee Ledger Balances, Payment Receipts (`TXN-FEE-xxx`), and Payment Gateway Reference Numbers.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div id="section-2" className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-serif font-bold text-navy flex items-center">
                <Eye className="w-4 h-4 text-gold mr-2" />
                2. How We Use Information
              </h3>
              <p>Data collected within the Kalpanaaa CMS is used strictly for legitimate educational and administrative purposes:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Managing academic admissions, course registrations, and section allocations.</li>
                <li>Recording daily attendance and generating mandatory percentage eligibility thresholds for semester examinations.</li>
                <li>Processing mid-term and end-term examination results, internal mark submissions, and official hall tickets.</li>
                <li>Issuing digital tuition fee receipts, pending balance reminders, and online payment processing.</li>
                <li>Sending real-time system notifications regarding emergency notices, class updates, and leave approvals via SSE and Push Services.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="section-3" className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-serif font-bold text-navy flex items-center">
                <Lock className="w-4 h-4 text-gold mr-2" />
                3. Data Security & Storage Architecture
              </h3>
              <p>
                Our School Management System implements enterprise-grade security protocols to prevent unauthorized access, data leakage, or loss:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 border rounded-xl space-y-1">
                  <span className="font-bold text-navy text-xs block">Database Encryption</span>
                  <p className="text-[11px] text-slate-500">All MySQL database transactions and user passwords are hashed using salt-fortified algorithms (Bcrypt / PBKDF2).</p>
                </div>
                <div className="p-4 bg-slate-50 border rounded-xl space-y-1">
                  <span className="font-bold text-navy text-xs block">Secure Transport</span>
                  <p className="text-[11px] text-slate-500">All browser-to-server traffic is encrypted using TLS 1.3 protocol over HTTPS connections.</p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div id="section-4" className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-serif font-bold text-navy flex items-center">
                <ShieldCheck className="w-4 h-4 text-gold mr-2" />
                4. Role-Based Access Control (RBAC)
              </h3>
              <p>
                Strict authorization boundaries isolate data between Student, Faculty, and Admin portals:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Students</strong> can only view their individual academic marks, fee ledger, and attendance records.</li>
                <li><strong>Faculty Members</strong> can only record attendance and enter marks for classes specifically assigned to them.</li>
                <li><strong>Administrative Officers</strong> hold governance oversight for creating departments, courses, and managing user roles.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div id="section-5" className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-serif font-bold text-navy">
                5. Retention & Permanent Academic Records
              </h3>
              <p>
                Academic transcripts, degrees awarded, and examination records are retained permanently in our archive database per University Grants Commission and Accreditation Body regulations. Temporary logs (such as session tokens or transient support queries) are pruned periodically.
              </p>
            </div>

            {/* Section 6 */}
            <div id="section-6" className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-serif font-bold text-navy">
                6. Student Rights & Data Access
              </h3>
              <p>
                Enrolled students and guardians have the right to inspect their academic profiles, request corrections to contact details via official administrative ticket requests, and download stamped digital transcripts.
              </p>
            </div>

            {/* Section 7 */}
            <div id="section-7" className="space-y-3 pt-4 border-t border-slate-100 bg-navy/5 p-6 rounded-2xl border border-navy/10">
              <h3 className="text-base font-serif font-bold text-navy flex items-center">
                <Mail className="w-4 h-4 text-gold mr-2" />
                7. Data Protection Officer (DPO) Contact
              </h3>
              <p className="text-xs text-slate-600">
                For questions regarding data privacy, accreditation audits, or personal data update requests, contact our Compliance Office:
              </p>
              <div className="text-xs font-semibold text-navy space-y-1 font-num pt-1">
                <div>Office of Data Governance & Protection</div>
                <div>Kalpanaaa Education Campus, New Delhi - 110075</div>
                <div>Email: <a href="mailto:dpo@kalpanaaa.edu" className="text-gold-hover hover:underline">dpo@kalpanaaa.edu</a> &bull; Phone: +91 (11) 2890-1000</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
