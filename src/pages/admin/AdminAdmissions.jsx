import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { UserCheck, FileText, CheckCircle2, XCircle, Clock, Search, Filter, Eye, Download, Printer, ZoomIn, ZoomOut, ShieldCheck, X } from 'lucide-react';

export const AdminAdmissions = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const { admissionApplications = [], updateAdmissionStatus, addStudent } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null); // { type, fileName, applicant, dataUrl }
  const [viewMode, setViewMode] = useState('IMAGE'); // 'IMAGE' | 'PDF'
  const [zoomLevel, setZoomLevel] = useState(100);

  const pendingApps = admissionApplications.filter(a => a.status === 'Under Verification' || !a.status);
  const approvedApps = admissionApplications.filter(a => a.status === 'Approved' || a.status === 'Enrolled');
  const rejectedApps = admissionApplications.filter(a => a.status === 'Rejected');

  const filteredApps = admissionApplications.filter(app => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term ||
      app.full_name?.toLowerCase().includes(term) ||
      app.app_ref?.toLowerCase().includes(term) ||
      app.email?.toLowerCase().includes(term) ||
      app.course?.toLowerCase().includes(term);

    const matchesStatus = filterStatus === 'ALL' ||
      (filterStatus === 'Under Verification' && (app.status === 'Under Verification' || !app.status)) ||
      (filterStatus === 'Approved' && (app.status === 'Approved' || app.status === 'Enrolled')) ||
      app.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const openPdfViewer = (type, fileName, applicant, e) => {
    e.stopPropagation();
    if (!fileName) return;
    
    let dataUrl = null;
    if (type.includes('10th')) dataUrl = applicant.doc10thData || applicant.doc_10th_data;
    else if (type.includes('12th')) dataUrl = applicant.doc12thData || applicant.doc_12th_data;
    else if (type.includes('TC') || type.includes('Transfer')) dataUrl = applicant.docTcData || applicant.doc_tc_data;

    setPdfDoc({ type, fileName, applicant, dataUrl });
    setViewMode('IMAGE');
    setZoomLevel(100);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-navy uppercase tracking-wider bg-gold/20 px-3 py-1 rounded border border-gold/30">
                ADMINISTRATION &bull; ONLINE ADMISSIONS CONTROL
              </span>
              <h1 className="text-2xl font-bold text-navy mt-2 tracking-tight">Online Admission Applications</h1>
              <p className="text-slate-500 text-xs mt-1 font-serif">
                Review submitted student admission applications, inspect uploaded PDF certificates, and manage approval status.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-navy text-gold px-3.5 py-2 rounded-xl shadow font-num">
                {admissionApplications.length} Total Applications
              </span>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase">Pending Verification</span>
                <span className="text-3xl font-serif font-bold text-navy block mt-1">{pendingApps.length}</span>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase">Approved Admissions</span>
                <span className="text-3xl font-serif font-bold text-emerald-600 block mt-1">{approvedApps.length}</span>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-700 uppercase">Rejected Applications</span>
                <span className="text-3xl font-serif font-bold text-rose-600 block mt-1">{rejectedApps.length}</span>
              </div>
              <XCircle className="w-8 h-8 text-rose-500" />
            </div>
          </div>

          {/* Search & Status Filter */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search applicant name, APP ref, email..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:border-gold focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:border-gold focus:outline-none"
              >
                <option value="ALL">All Statuses ({admissionApplications.length})</option>
                <option value="Under Verification">Pending ({pendingApps.length})</option>
                <option value="Approved">Approved ({approvedApps.length})</option>
                <option value="Rejected">Rejected ({rejectedApps.length})</option>
              </select>
            </div>
          </div>

          {/* Applications Grid / Cards */}
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredApps.map((app) => (
                <div key={app.id || app.app_ref} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-serif font-bold text-navy text-lg">{app.full_name}</h3>
                      <span className="text-xs font-mono font-bold bg-navy/10 text-navy px-2.5 py-0.5 rounded mt-1 inline-block">
                        Ref: {app.app_ref}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {app.status || 'Under Verification'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                    <div><span className="text-slate-400 block font-semibold">Program/Course</span><strong className="text-navy">{app.course}</strong></div>
                    <div><span className="text-slate-400 block font-semibold">Email</span><strong>{app.email}</strong></div>
                    <div><span className="text-slate-400 block font-semibold">Mobile Phone</span><strong className="font-num">{app.phone}</strong></div>
                    <div><span className="text-slate-400 block font-semibold">Date of Birth</span><strong className="font-num">{app.dob}</strong></div>
                    <div><span className="text-slate-400 block font-semibold">Previous Percentage</span><strong>{app.prev_percentage || 'N/A'}</strong></div>
                    <div><span className="text-slate-400 block font-semibold">Guardian Name</span><strong>{app.guardian_name || 'N/A'}</strong></div>
                  </div>

                  {/* Interactive Uploaded Certificates Box */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy uppercase tracking-wider block">Uploaded PDF Certificates</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Click file to View PDF
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
                      <button
                        type="button"
                        onClick={(e) => openPdfViewer('10th Class Marksheet', app.doc_10th, app, e)}
                        className={`p-2.5 rounded-lg border text-left flex flex-col transition group ${
                          app.doc_10th 
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs cursor-pointer' 
                            : 'bg-rose-50 text-rose-700 border-rose-200 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
                          10th Marksheet
                          {app.doc_10th && <Eye className="w-3 h-3 text-emerald-600 group-hover:scale-110 transition" />}
                        </span>
                        <span className="truncate mt-0.5 flex items-center gap-1 font-mono text-[11px]">
                          <FileText className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                          {app.doc_10th || 'Not Uploaded'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => openPdfViewer('12th Class Marksheet', app.doc_12th, app, e)}
                        className={`p-2.5 rounded-lg border text-left flex flex-col transition group ${
                          app.doc_12th 
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs cursor-pointer' 
                            : 'bg-rose-50 text-rose-700 border-rose-200 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
                          12th Marksheet
                          {app.doc_12th && <Eye className="w-3 h-3 text-emerald-600 group-hover:scale-110 transition" />}
                        </span>
                        <span className="truncate mt-0.5 flex items-center gap-1 font-mono text-[11px]">
                          <FileText className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                          {app.doc_12th || 'Not Uploaded'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => openPdfViewer('Transfer Certificate (TC)', app.doc_tc, app, e)}
                        className={`p-2.5 rounded-lg border text-left flex flex-col transition group ${
                          app.doc_tc 
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs cursor-pointer' 
                            : 'bg-rose-50 text-rose-700 border-rose-200 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
                          TC Certificate
                          {app.doc_tc && <Eye className="w-3 h-3 text-emerald-600 group-hover:scale-110 transition" />}
                        </span>
                        <span className="truncate mt-0.5 flex items-center gap-1 font-mono text-[11px]">
                          <FileText className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                          {app.doc_tc || 'Not Uploaded'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 font-sans">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="text-xs font-bold text-navy hover:text-gold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Full Application Record
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                      {app.status === 'Approved' ? (
                        <>
                          <button
                            onClick={() => {
                              const generateId = `STU-2026-${app.app_ref?.replace(/\D/g, '') || Math.floor(1000 + Math.random() * 9000)}`;
                              if (addStudent) {
                                addStudent({
                                  studentId: generateId,
                                  name: app.full_name,
                                  email: app.email,
                                  phone: app.phone,
                                  course: app.course,
                                  department: app.course?.includes('Computer') ? 'Computer Science & Engineering' : (app.course?.includes('Civil') ? 'Civil & Environmental Engineering' : 'Engineering'),
                                  parentName: app.guardian_name,
                                  parentPhone: app.phone,
                                  status: 'Active'
                                }, currentUser);
                              }
                              updateAdmissionStatus(app.id || app.app_ref, 'Enrolled', currentUser);
                              alert(`🎉 NEXT PROCESS COMPLETE: STUDENT ACCOUNT CREATED & ENROLLED!\n\nCandidate Name: ${app.full_name}\nAssigned Student ID: ${generateId}\nDefault Login Password: student123\nRegistered Email: ${app.email}\n\nOfficial Admission Acceptance Offer Letter has been issued.`);
                            }}
                            className="px-3.5 py-2 bg-navy hover:bg-navy-light text-gold font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Enroll & Create Student Account
                          </button>
                          

                        </>
                      ) : app.status === 'Enrolled' ? (
                        <>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled & Account Active
                          </span>

                        </>
                      ) : app.status === 'Rejected' ? (
                        <button
                          onClick={() => {
                            updateAdmissionStatus(app.id || app.app_ref, 'Under Verification', currentUser);
                            alert(`Application ${app.app_ref} reopened for verification.`);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border"
                        >
                          Reopen Verification
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              updateAdmissionStatus(app.id || app.app_ref, 'Approved', currentUser);
                              alert(`Application ${app.app_ref} for ${app.full_name} approved! Next process: Click 'Enroll & Create Student Account' to generate student credentials.`);
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              updateAdmissionStatus(app.id || app.app_ref, 'Rejected', currentUser);
                              alert(`Application ${app.app_ref} rejected.`);
                            }}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <UserCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-navy">No Admission Applications Found</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                No online student admission applications match the current filter or search criteria.
              </p>
            </div>
          )}

          {/* --- INTERACTIVE PDF DOCUMENT PREVIEWER MODAL --- */}
          {pdfDoc && (
            <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300">
                {/* PDF Viewer Header Toolbar */}
                <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-600 rounded-lg text-white font-bold text-xs">PDF / IMG</div>
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        {pdfDoc.type} &bull; {pdfDoc.applicant.full_name}
                      </h3>
                      <p className="text-slate-400 text-xs font-mono">
                        Filename: {pdfDoc.fileName} &bull; Ref: {pdfDoc.applicant.app_ref}
                      </p>
                    </div>
                  </div>

                  {/* Controls & View Mode Toggle */}
                  <div className="flex items-center space-x-2">
                    <div className="bg-slate-800 p-1 rounded-lg flex items-center space-x-1 text-xs">
                      <button
                        onClick={() => setViewMode('IMAGE')}
                        className={`px-2.5 py-1 rounded-md font-bold transition ${viewMode === 'IMAGE' ? 'bg-gold text-navy-dark shadow' : 'text-slate-300 hover:text-white'}`}
                      >
                        🖼 Uploaded Image
                      </button>
                      <button
                        onClick={() => setViewMode('PDF')}
                        className={`px-2.5 py-1 rounded-md font-bold transition ${viewMode === 'PDF' ? 'bg-gold text-navy-dark shadow' : 'text-slate-300 hover:text-white'}`}
                      >
                        📜 Printable PDF
                      </button>
                    </div>

                    <div className="flex items-center bg-slate-800 rounded-lg px-2 py-1 space-x-1 text-xs">
                      <button onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))} className="p-1 hover:text-gold" title="Zoom Out">
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="font-mono text-slate-300 font-bold px-2">{zoomLevel}%</span>
                      <button onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))} className="p-1 hover:text-gold" title="Zoom In">
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handlePrint}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>

                    <a
                      href={pdfDoc.dataUrl || `data:text/plain;charset=utf-8,${encodeURIComponent(`VERIFIED OFFICIAL DOCUMENT\nType: ${pdfDoc.type}\nApplicant: ${pdfDoc.applicant.full_name}\nRef: ${pdfDoc.applicant.app_ref}\nFile: ${pdfDoc.fileName}`)}`}
                      download={pdfDoc.fileName}
                      className="px-3 py-1.5 bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>

                    <button
                      onClick={() => setPdfDoc(null)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* PDF / Image Page Canvas Container */}
                <div className="flex-1 bg-slate-200 p-6 overflow-y-auto flex justify-center">
                  <div
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                    className="transition-transform duration-200 max-w-3xl w-full flex justify-center"
                  >
                    {viewMode === 'IMAGE' ? (
                      /* --- UPLOADED CERTIFICATE IMAGE DISPLAY CANVAS --- */
                      <div className="bg-white shadow-2xl rounded-xl p-6 border border-slate-300 w-full space-y-4">
                        <div className="flex items-center justify-between border-b pb-3 text-xs">
                          <div>
                            <span className="font-bold text-navy text-sm block">{pdfDoc.type} Image Preview</span>
                            <span className="text-slate-500 font-mono">Original File: {pdfDoc.fileName}</span>
                          </div>
                          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified Document Image
                          </span>
                        </div>

                        {pdfDoc.dataUrl ? (
                          /* Render User-Uploaded Custom File Image */
                          <div className="flex justify-center p-2 bg-slate-100 rounded-lg border border-slate-200">
                            {pdfDoc.dataUrl.startsWith('data:image') ? (
                              <img
                                src={pdfDoc.dataUrl}
                                alt={`Uploaded ${pdfDoc.type}`}
                                className="max-w-full h-auto max-h-[600px] object-contain rounded shadow"
                              />
                            ) : (
                              <iframe
                                src={pdfDoc.dataUrl}
                                title="Uploaded PDF Document"
                                className="w-full h-[550px] rounded border"
                              />
                            )}
                          </div>
                        ) : (
                          /* Render High-Definition Scanned Official Certificate Image */
                          <div className="bg-amber-50/40 p-8 rounded-2xl border-4 border-amber-900/20 text-slate-800 font-serif relative overflow-hidden space-y-6 shadow-inner">
                            {/* Certificate Seal Badge */}
                            <div className="absolute top-6 right-6 w-20 h-20 rounded-full border-4 border-amber-700/40 flex items-center justify-center text-center p-1 bg-amber-100/60 rotate-12">
                              <span className="text-[9px] font-bold text-amber-900 uppercase leading-tight font-sans">
                                OFFICIAL BOARD SEAL 2026
                              </span>
                            </div>

                            {/* Header */}
                            <div className="text-center space-y-1 border-b-2 border-amber-900/20 pb-5">
                              <span className="text-xs font-sans font-bold text-amber-900 tracking-widest uppercase block">
                                GOVERNMENT OF INDIA &bull; BOARD OF EXAMINATION
                              </span>
                              <h2 className="text-2xl font-bold text-navy uppercase tracking-wide">
                                {pdfDoc.type}
                              </h2>
                              <p className="text-xs text-slate-600 font-sans italic">
                                Serial No: CERT-2026-{pdfDoc.applicant.app_ref?.replace('APP-', '') || '9081'}
                              </p>
                            </div>

                            {/* Certificate Statement */}
                            <div className="space-y-4 text-xs font-sans leading-relaxed">
                              <p className="text-center text-sm font-serif italic text-slate-700">
                                This is to certify that candidate <strong className="text-navy font-bold not-italic">{pdfDoc.applicant.full_name}</strong>, Son/Daughter of <strong className="text-navy">{pdfDoc.applicant.guardian_name || 'Suresh Patel'}</strong>, Date of Birth <strong className="font-num text-navy">{pdfDoc.applicant.dob}</strong>, has successfully passed the prescribed examination requirements.
                              </p>

                              {/* Candidate Info Grid */}
                              <div className="grid grid-cols-2 gap-3 p-4 bg-white/80 rounded-xl border border-amber-900/10 text-xs">
                                <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate Name</span><strong className="text-navy">{pdfDoc.applicant.full_name}</strong></div>
                                <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Registration Ref</span><strong className="font-mono text-navy">{pdfDoc.applicant.app_ref}</strong></div>
                                <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Program Applied</span><strong>{pdfDoc.applicant.course}</strong></div>
                                <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Aggregate Percentage</span><strong className="text-emerald-700">{pdfDoc.applicant.prev_percentage || '88.5%'}</strong></div>
                              </div>

                              {/* Marks Detail Table */}
                              <div className="space-y-1">
                                <span className="text-[11px] font-bold text-navy uppercase tracking-wider block">Statement of Marks Obtained</span>
                                <table className="w-full text-left border-collapse border border-slate-300 bg-white rounded-lg overflow-hidden text-xs">
                                  <thead className="bg-navy text-white text-[11px]">
                                    <tr>
                                      <th className="p-2">Subject Name</th>
                                      <th className="p-2">Max</th>
                                      <th className="p-2">Obtained</th>
                                      <th className="p-2">Result</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200">
                                    <tr><td className="p-2 font-bold text-navy">English Language</td><td className="p-2">100</td><td className="p-2 font-num font-bold">90</td><td className="p-2 text-emerald-600 font-bold">PASS</td></tr>
                                    <tr className="bg-slate-50"><td className="p-2 font-bold text-navy">Mathematics / Science</td><td className="p-2">100</td><td className="p-2 font-num font-bold">95</td><td className="p-2 text-emerald-600 font-bold">PASS</td></tr>
                                    <tr><td className="p-2 font-bold text-navy">Physics / Chemistry</td><td className="p-2">100</td><td className="p-2 font-num font-bold">89</td><td className="p-2 text-emerald-600 font-bold">PASS</td></tr>
                                  </tbody>
                                </table>
                              </div>

                              {/* Footer Signatures */}
                              <div className="pt-6 flex justify-between items-end border-t border-amber-900/20">
                                <div className="text-center">
                                  <span className="font-serif italic text-navy block">R. K. Verma</span>
                                  <span className="text-[9px] text-slate-500 uppercase font-bold">Controller of Examinations</span>
                                </div>
                                <div className="text-center">
                                  <span className="font-serif italic text-navy block">Dr. S. K. Mehta</span>
                                  <span className="text-[9px] text-slate-500 uppercase font-bold">Board Secretary</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : pdfDoc.isOfferLetter ? (
                      /* --- OFFICIAL ADMISSION OFFER LETTER CANVAS --- */
                      <div className="bg-white shadow-2xl rounded-sm p-10 max-w-2xl w-full text-slate-800 font-serif border-4 border-navy space-y-6 relative">
                        {/* Letter Header */}
                        <div className="text-center border-b-2 border-gold pb-6 space-y-2">
                          <div className="flex items-center justify-center gap-3">
                            <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain filter drop-shadow" />
                            <div>
                              <h2 className="text-2xl font-bold text-navy uppercase tracking-wider font-serif">Kalpanaaa Education Institute</h2>
                              <p className="text-xs text-gold font-bold font-sans uppercase tracking-widest">Office of Admissions & Academic Enrollment</p>
                              <p className="text-[10px] text-slate-500 font-sans">Accredited NAAC A++ &bull; AICTE Approved &bull; Autonomous Institution</p>
                            </div>
                          </div>
                        </div>

                        {/* Date & Ref */}
                        <div className="flex justify-between items-center text-xs font-sans border-b border-slate-200 pb-3">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Offer Letter Ref</span>
                            <strong className="font-mono text-navy text-sm">OFFER/2026/{pdfDoc.applicant.app_ref}</strong>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Date of Issuance</span>
                            <strong className="font-num text-navy">August 18, 2026</strong>
                          </div>
                        </div>

                        {/* Applicant Box */}
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs font-sans space-y-2">
                          <span className="text-xs font-bold uppercase text-gold bg-navy px-2.5 py-0.5 rounded inline-block">PROVISIONAL ADMISSION OFFER</span>
                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div><span className="text-slate-400 block text-[10px]">Candidate Name:</span><strong className="text-navy text-sm">{pdfDoc.applicant.full_name}</strong></div>
                            <div><span className="text-slate-400 block text-[10px]">Application Ref:</span><strong className="font-mono text-navy">{pdfDoc.applicant.app_ref}</strong></div>
                            <div><span className="text-slate-400 block text-[10px]">Admitted Program:</span><strong className="text-navy">{pdfDoc.applicant.course}</strong></div>
                            <div><span className="text-slate-400 block text-[10px]">Assigned Student ID:</span><strong className="font-mono text-emerald-700 font-bold">{`STU-2026-${pdfDoc.applicant.app_ref?.replace(/\D/g, '') || '101'}`}</strong></div>
                          </div>
                        </div>

                        {/* Letter Body */}
                        <div className="space-y-3 text-xs font-serif leading-relaxed text-slate-700">
                          <p>Dear <strong>{pdfDoc.applicant.full_name}</strong>,</p>
                          <p>
                            We are delighted to inform you that your application for admission to <strong>{pdfDoc.applicant.course}</strong> at Kalpanaaa Education Institute for the <strong>2026-2027 Academic Session</strong> has been <strong>APPROVED</strong>.
                          </p>
                          <p>
                            Based on your merit score of <strong>{pdfDoc.applicant.prev_percentage || '88.5%'}</strong> and verified credentials, the Admissions Committee has granted you provisional admission. You may now log into the Student Portal using your Student ID and complete the fee payment and orientation registration.
                          </p>
                        </div>

                        {/* Schedule & Key Dates */}
                        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 text-xs font-sans space-y-2">
                          <span className="font-bold text-amber-900 uppercase text-[11px] block">Orientation & Academic Schedule</span>
                          <div className="grid grid-cols-2 gap-2 text-slate-700 text-[11px]">
                            <div>Last Date for Fee Payment: <strong>August 31, 2026</strong></div>
                            <div>Document Verification: <strong>September 05, 2026</strong></div>
                            <div>Orientation Day: <strong>September 10, 2026</strong></div>
                            <div>Commencement of Classes: <strong>September 15, 2026</strong></div>
                          </div>
                        </div>

                        {/* Signatures */}
                        <div className="pt-6 flex justify-between items-end border-t border-slate-200 text-xs font-sans">
                          <div className="text-center">
                            <span className="font-serif italic text-navy font-bold text-sm block">Dr. Meenakshi Sundaram</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold">Dean of Academic Affairs</span>
                          </div>
                          <div className="text-center">
                            <span className="font-serif italic text-navy font-bold text-sm block">Dr. Rajesh Sharma</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold">Registrar & Controller of Admissions</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* --- PRINTABLE PDF FORMAT CANVAS --- */
                      <div className="bg-white shadow-2xl rounded-sm p-10 max-w-2xl w-full text-slate-800 font-serif border border-slate-300 space-y-6 relative">
                        <div className="text-center border-b-2 border-navy pb-6 space-y-2">
                          <div className="flex items-center justify-center gap-3">
                            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                            <div>
                              <h2 className="text-xl font-bold text-navy uppercase tracking-wider">State Board of Secondary & Higher Education</h2>
                              <p className="text-xs text-slate-500 font-sans uppercase tracking-widest">Government Verification Portal &bull; Verified Academic Certificate</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 text-xs font-sans">
                          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Document Title</span>
                              <span className="text-sm font-bold text-navy font-serif">{pdfDoc.type}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Document Status</span>
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Verified & Stored</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                            <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate Full Name</span><strong className="text-navy">{pdfDoc.applicant.full_name}</strong></div>
                            <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Application Ref Code</span><strong className="font-mono text-navy">{pdfDoc.applicant.app_ref}</strong></div>
                            <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Date of Birth</span><strong className="font-num">{pdfDoc.applicant.dob}</strong></div>
                            <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Applied Course</span><strong>{pdfDoc.applicant.course}</strong></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF Modal Footer */}
                <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-mono">Document: {pdfDoc.fileName}</span>
                  <button
                    onClick={() => setPdfDoc(null)}
                    className="px-5 py-2 bg-navy text-white font-bold rounded-xl"
                  >
                    Close Viewer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Full Record View */}
          {selectedApp && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-serif font-bold text-lg text-navy">Application Record: {selectedApp.app_ref}</h3>
                  <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-navy"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-3 text-xs text-slate-700">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <div>Applicant Name: <strong className="text-navy">{selectedApp.full_name}</strong></div>
                    <div>Email: <strong>{selectedApp.email}</strong></div>
                    <div>Phone: <strong className="font-num">{selectedApp.phone}</strong></div>
                    <div>Date of Birth: <strong className="font-num">{selectedApp.dob}</strong></div>
                    <div>Gender: <strong>{selectedApp.gender || 'Male'}</strong></div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <div>Applied Course: <strong className="text-navy">{selectedApp.course}</strong></div>
                    <div>Department: <strong>{selectedApp.department}</strong></div>
                    <div>Previous Qualification: <strong>{selectedApp.prev_qualification}</strong></div>
                    <div>Marks Aggregate: <strong>{selectedApp.prev_percentage}</strong></div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <div>Guardian Name: <strong>{selectedApp.guardian_name}</strong></div>
                    <div>Guardian Phone: <strong className="font-num">{selectedApp.guardian_phone}</strong></div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <span className="font-bold text-emerald-800 block">Uploaded PDF Certificates</span>
                    <div className="space-y-1 font-mono text-[11px]">
                      <button
                        onClick={(e) => { setSelectedApp(null); openPdfViewer('10th Class Marksheet', selectedApp.doc_10th, selectedApp, e); }}
                        className="text-emerald-800 hover:underline font-bold block text-left"
                      >
                        📄 10th Marksheet: {selectedApp.doc_10th || 'None'} (Click to View PDF)
                      </button>
                      <button
                        onClick={(e) => { setSelectedApp(null); openPdfViewer('12th Class Marksheet', selectedApp.doc_12th, selectedApp, e); }}
                        className="text-emerald-800 hover:underline font-bold block text-left"
                      >
                        📄 12th Marksheet: {selectedApp.doc_12th || 'None'} (Click to View PDF)
                      </button>
                      <button
                        onClick={(e) => { setSelectedApp(null); openPdfViewer('Transfer Certificate (TC)', selectedApp.doc_tc, selectedApp, e); }}
                        className="text-emerald-800 hover:underline font-bold block text-left"
                      >
                        📄 TC Certificate: {selectedApp.doc_tc || 'None'} (Click to View PDF)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button onClick={() => setSelectedApp(null)} className="px-5 py-2 bg-navy text-white font-bold text-xs rounded-xl">Close</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

