import React, { useState } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Clock, Download, Printer, AlertCircle, Sun, Snowflake, Filter } from 'lucide-react';

export const AcademicCalendarPage = () => {
  // Dynamically calculate current Academic Year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed: 0 = Jan, 6 = July
  
  // Academic session typically begins in July/August
  const startYear = currentMonth >= 5 ? currentYear : currentYear - 1;
  const endYear = startYear + 1;
  const defaultSession = `${startYear}–${endYear}`;

  const [selectedSession, setSelectedSession] = useState(defaultSession);
  const [selectedTab, setSelectedTab] = useState('ALL'); // 'ALL' | 'ODD' | 'EVEN' | 'EXAM' | 'HOLIDAY'

  // Sessions list for dropdown selector
  const availableSessions = [
    `${startYear - 1}–${startYear}`,
    `${startYear}–${endYear}`,
    `${startYear + 1}–${startYear + 2}`
  ];

  // Derive target start year from selected session string
  const sessionStart = parseInt(selectedSession.split('–')[0], 10) || startYear;
  const sessionEnd = sessionStart + 1;

  // Dynamic schedule entries mapped to the selected academic year
  const scheduleEvents = [
    // ODD SEMESTER
    {
      id: "ev-1",
      semester: "ODD",
      type: "ACADEMIC",
      title: "Faculty Reporting & Departmental Academic Planning",
      dateRange: `August 01, ${sessionStart} – August 05, ${sessionStart}`,
      status: "COMPLETED",
      description: "Faculty course handbook preparation, lab manual audit, and lesson plan finalization."
    },
    {
      id: "ev-2",
      semester: "ODD",
      type: "REGISTRATION",
      title: "Student Registration & Semester Fee Clearance",
      dateRange: `August 10, ${sessionStart} – August 18, ${sessionStart}`,
      status: "COMPLETED",
      description: "Online subject enrollment, elective selection (CBCS), and student ID verification."
    },
    {
      id: "ev-3",
      semester: "ODD",
      type: "ACADEMIC",
      title: "Commencement of Odd Semester Classes (Sem 1, 3, 5, 7)",
      dateRange: `August 20, ${sessionStart}`,
      status: "IN_PROGRESS",
      description: "First instructional working day for undergraduate engineering and MBA classes."
    },
    {
      id: "ev-4",
      semester: "ODD",
      type: "HOLIDAY",
      title: "Independence Day (National Holiday)",
      dateRange: `August 15, ${sessionStart}`,
      status: "COMPLETED",
      description: "Flag hoisting ceremony at Main University Quadrangle (08:30 AM)."
    },
    {
      id: "ev-5",
      semester: "ODD",
      type: "EXAM",
      title: "Internal Assessment 1 (IA-1 / Mid-Term Test)",
      dateRange: `October 12, ${sessionStart} – October 17, ${sessionStart}`,
      status: "UPCOMING",
      description: "Centralized descriptive tests covering Units 1 & 2 across all 6 engineering departments."
    },
    {
      id: "ev-6",
      semester: "ODD",
      type: "CULTURAL",
      title: "Annual Tech Fest & Hackathon 'KALPANAAA INNOVATE'",
      dateRange: `October 22, ${sessionStart} – October 24, ${sessionStart}`,
      status: "UPCOMING",
      description: "National 48-hour hackathon, robotics exhibition, and corporate gaming summit."
    },
    {
      id: "ev-7",
      semester: "ODD",
      type: "HOLIDAY",
      title: "Diwali & Festival of Lights Break",
      dateRange: `November 01, ${sessionStart} – November 04, ${sessionStart}`,
      status: "UPCOMING",
      description: "Institutional holiday for students and faculty."
    },
    {
      id: "ev-8",
      semester: "ODD",
      type: "EXAM",
      title: "Internal Assessment 2 (IA-2) & Lab Viva Voce",
      dateRange: `November 18, ${sessionStart} – November 23, ${sessionStart}`,
      status: "UPCOMING",
      description: "IA-2 theory assessments, lab project practical examinations, and assignment reviews."
    },
    {
      id: "ev-9",
      semester: "ODD",
      type: "ACADEMIC",
      title: "Last Working Day for Odd Semester",
      dateRange: `November 28, ${sessionStart}`,
      status: "UPCOMING",
      description: "Display of final internal marks and attendance eligibility list."
    },
    {
      id: "ev-10",
      semester: "ODD",
      type: "EXAM",
      title: "Semester End Practical & Theory University Examinations",
      dateRange: `December 02, ${sessionStart} – December 20, ${sessionStart}`,
      status: "UPCOMING",
      description: "Final controller of examinations evaluation."
    },
    {
      id: "ev-11",
      semester: "ODD",
      type: "HOLIDAY",
      title: "Winter Vacation & Semester Break",
      dateRange: `December 21, ${sessionStart} – January 05, ${sessionEnd}`,
      status: "UPCOMING",
      description: "Winter recess for scholars and faculty research work."
    },

    // EVEN SEMESTER
    {
      id: "ev-12",
      semester: "EVEN",
      type: "ACADEMIC",
      title: "Commencement of Even Semester Classes (Sem 2, 4, 6, 8)",
      dateRange: `January 06, ${sessionEnd}`,
      status: "UPCOMING",
      description: "Opening day of Even Semester teaching and lab practicums."
    },
    {
      id: "ev-13",
      semester: "EVEN",
      type: "HOLIDAY",
      title: "Republic Day (National Holiday)",
      dateRange: `January 26, ${sessionEnd}`,
      status: "UPCOMING",
      description: "Ceremonial parade and address by Vice Chancellor."
    },
    {
      id: "ev-14",
      semester: "EVEN",
      type: "EXAM",
      title: "Internal Assessment 1 (IA-1 Even Semester)",
      dateRange: `March 02, ${sessionEnd} – March 07, ${sessionEnd}`,
      status: "UPCOMING",
      description: "First mid-term assessment cycle for spring session."
    },
    {
      id: "ev-15",
      semester: "EVEN",
      type: "CULTURAL",
      title: "Annual Sports Olympiad & Cultural Fest 'KALPANAAA SMRITI'",
      dateRange: `March 18, ${sessionEnd} – March 21, ${sessionEnd}`,
      status: "UPCOMING",
      description: "Inter-collegiate athletics meet, music concert, and drama showcase."
    },
    {
      id: "ev-16",
      semester: "EVEN",
      type: "EXAM",
      title: "Internal Assessment 2 (IA-2) & Final Year Capstone Project Defense",
      dateRange: `April 20, ${sessionEnd} – April 25, ${sessionEnd}`,
      status: "UPCOMING",
      description: "Evaluation of 8th Semester major capstone projects by external industry panels."
    },
    {
      id: "ev-17",
      semester: "EVEN",
      type: "EXAM",
      title: "Even Semester End University Final Examinations",
      dateRange: `May 05, ${sessionEnd} – May 26, ${sessionEnd}`,
      status: "UPCOMING",
      description: "Final university written examinations and grading."
    },
    {
      id: "ev-18",
      semester: "EVEN",
      type: "ACADEMIC",
      title: "Summer Corporate Internships & Research Incubation",
      dateRange: `June 01, ${sessionEnd} – July 25, ${sessionEnd}`,
      status: "UPCOMING",
      description: "8-week full-time industrial internship period for 2nd and 3rd year scholars."
    }
  ];

  const filteredEvents = scheduleEvents.filter(event => {
    if (selectedTab === 'ODD') return event.semester === 'ODD';
    if (selectedTab === 'EVEN') return event.semester === 'EVEN';
    if (selectedTab === 'EXAM') return event.type === 'EXAM';
    if (selectedTab === 'HOLIDAY') return event.type === 'HOLIDAY';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">Completed</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 animate-pulse">● Active Now</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">Upcoming</span>;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'EXAM':
        return <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">EXAMINATION</span>;
      case 'HOLIDAY':
        return <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">HOLIDAY</span>;
      case 'CULTURAL':
        return <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">FEST / EVENT</span>;
      case 'REGISTRATION':
        return <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">ENROLLMENT</span>;
      default:
        return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">ACADEMIC</span>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs customItems={[
        { label: 'Academics', to: '/academics' },
        { label: 'Academic Calendar', to: '' }
      ]} />

      {/* Hero Header */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.25em] bg-gold/10 px-3.5 py-1.5 rounded-full">
            OFFICIAL UNIVERSITY SCHEDULE
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Academic Calendar {selectedSession}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-sans leading-relaxed">
            Comprehensive schedule of instruction days, internal evaluation milestones, semester final examinations, and official institutional breaks.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-sans">
        
        {/* Controls & Quick Actions Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Dynamic Session Switcher */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Session:</span>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:outline-none focus:border-navy"
            >
              {availableSessions.map((session) => (
                <option key={session} value={session}>
                  Academic Year {session} {session === defaultSession ? '(Current Active)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Print & Download PDF Actions */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs rounded-xl transition-colors flex items-center shadow-sm"
            >
              <Printer className="w-4 h-4 mr-1.5" /> Print Calendar
            </button>
            <button
              onClick={() => alert(`Downloading official signed Academic Calendar PDF for session ${selectedSession}...`)}
              className="px-5 py-2 bg-navy hover:bg-navy-light text-gold font-bold text-xs rounded-xl transition-colors flex items-center shadow"
            >
              <Download className="w-4 h-4 mr-1.5" /> Download Official PDF
            </button>
          </div>

        </div>

        {/* Semester Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Odd Semester Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-l-4 border-gold shadow-sm border-t border-r border-b border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sun className="w-5 h-5 text-gold" />
                <h3 className="text-xl font-serif font-bold text-navy">Autumn / Odd Semester ({sessionStart})</h3>
              </div>
              <span className="text-xs font-bold text-gold uppercase bg-navy px-2.5 py-1 rounded">Semesters 1, 3, 5, 7</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-serif">
              Covers instructional period from August to November with 90 effective teaching days, followed by December final semester theory and lab evaluations.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Class Commencement</span>
                <strong className="text-navy">August 20, {sessionStart}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Semester Exams</span>
                <strong className="text-navy">December 02–20, {sessionStart}</strong>
              </div>
            </div>
          </div>

          {/* Even Semester Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-l-4 border-navy shadow-sm border-t border-r border-b border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Snowflake className="w-5 h-5 text-navy" />
                <h3 className="text-xl font-serif font-bold text-navy">Spring / Even Semester ({sessionEnd})</h3>
              </div>
              <span className="text-xs font-bold text-navy uppercase bg-slate-100 px-2.5 py-1 rounded border">Semesters 2, 4, 6, 8</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-serif">
              Covers instructional period from January to April with 90 effective teaching days, followed by May final degree examinations and summer internships.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Class Reopening</span>
                <strong className="text-navy">January 06, {sessionEnd}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Semester Exams</span>
                <strong className="text-navy">May 05–26, {sessionEnd}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <span className="text-xs font-bold text-slate-400 mr-2 uppercase flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" /> Filter View:
          </span>
          {[
            { key: 'ALL', label: 'All Schedule Events' },
            { key: 'ODD', label: 'Odd Semester (Autumn)' },
            { key: 'EVEN', label: 'Even Semester (Spring)' },
            { key: 'EXAM', label: 'Examination Windows' },
            { key: 'HOLIDAY', label: 'Holidays & Vacations' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedTab === tab.key
                  ? 'bg-navy text-gold shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Timeline Schedule Table / Roster */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredEvents.map((item) => (
              <div 
                key={item.id}
                className="p-6 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    {getTypeBadge(item.type)}
                    <span className="text-slate-300 text-xs">&bull;</span>
                    <span className="text-xs font-mono font-bold text-slate-500 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-gold" /> {item.dateRange}
                    </span>
                  </div>

                  <h4 className="text-base font-serif font-bold text-navy group-hover:text-gold transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed font-serif">
                    {item.description}
                  </p>
                </div>

                <div className="flex-shrink-0 self-start sm:self-center">
                  {getStatusBadge(item.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Guidelines Footer Box */}
        <div className="p-6 bg-amber-50/70 border border-gold/40 rounded-2xl flex items-start space-x-4">
          <AlertCircle className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 space-y-1">
            <h5 className="font-bold text-navy text-sm">Regulatory Attendance & Examination Rules</h5>
            <p>
              As per university academic regulations, a minimum of <strong>75% attendance</strong> is mandatory in each registered subject to be eligible for End-Semester examinations.
            </p>
            <p className="text-slate-500 font-serif">
              Any changes in the academic schedule due to statutory directives will be notified by the Office of Controller of Examinations.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
