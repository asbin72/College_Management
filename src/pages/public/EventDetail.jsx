import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Calendar, Clock, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const EventDetail = () => {
  const { eventId } = useParams();
  const [showRegModal, setShowRegModal] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', attendeeType: 'Student' });
  const [registered, setRegistered] = useState(false);

  const eventsData = [
    {
      id: "evt-1",
      title: "National Tech Summit & Developer Hackathon 2026",
      date: "15 AUG",
      fullDate: "August 15, 2026",
      time: "09:00 AM - 06:00 PM IST",
      category: "HACKATHON",
      venue: "Main Auditorium & Advanced Computing Labs (Turing Block)",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200",
      description: "A 48-hour continuous software prototyping hackathon focusing on AI algorithms, Cloud infrastructure, DevOps tools, and distributed system architectures.",
      speakers: [
        { name: "Dr. Rajesh Sharma", role: "Professor & HOD Computer Science", company: "Kalpanaaa Education" },
        { name: "Suresh Sundaram", role: "Senior Principal Engineer", company: "Google Cloud Labs" },
        { name: "Priya Nair", role: "VP Engineering", company: "Amazon Web Services" }
      ],
      agenda: [
        { time: "09:00 AM", title: "Inaugural Ceremony & Keynote Address", desc: "Welcome address by Vice Chancellor and Google Cloud Lead." },
        { time: "10:30 AM", title: "Hackathon Problem Statements Release", desc: "Teams receive AI, Cloud, and Cybersecurity problem statements." },
        { time: "01:00 PM", title: "Networking Lunch & Mentor Checkpoints", desc: "1-on-1 feedback sessions with industry architects." },
        { time: "04:30 PM", title: "Final Team Project Demonstrations", desc: "Live prototype presentations to judging panel." },
        { time: "05:30 PM", title: "Awards & Cash Prize Distribution", desc: "Felicitation of top 3 winners with ₹2,00,000 in prizes." }
      ]
    },
    {
      id: "evt-2",
      title: "Global Industry Leaders & Placement Conclave",
      date: "22 AUG",
      fullDate: "August 22, 2026",
      time: "10:00 AM - 04:00 PM IST",
      category: "CONFERENCE",
      venue: "Convention Center & Bloomberg Trading Hall",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200",
      description: "Corporate leaders from Deloitte, Goldman Sachs, Microsoft, and Infosys discuss corporate finance, tech hiring trends, and resume benchmarks.",
      speakers: [
        { name: "Dr. Vikram Malhotra", role: "HOD Management Studies", company: "Kalpanaaa Education" },
        { name: "Anita Kapoor", role: "Head of University Relations", company: "Deloitte India" },
        { name: "Rohan Verma", role: "Managing Director", company: "Goldman Sachs" }
      ],
      agenda: [
        { time: "10:00 AM", title: "Corporate Panel: The Future of Global Hiring", desc: "Insights on technical and managerial skills for 2026 graduates." },
        { time: "11:45 AM", title: "Bloomberg Terminal Workshop", desc: "Hands-on equity research demo for MBA scholars." },
        { time: "02:00 PM", title: "Speed Mentoring & Resume Reviews", desc: "Direct mock interview sessions with corporate recruiters." }
      ]
    },
    {
      id: "evt-3",
      title: "Annual Cultural & Youth Festival 'KALPANAAA SMRITI'",
      date: "05 SEP",
      fullDate: "September 05, 2026",
      time: "05:00 PM - 10:00 PM IST",
      category: "CULTURAL",
      venue: "University Open Amphitheatre",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200",
      description: "Celebrating student creativity with live musical bands, inter-college choreography, theatrical acts, and food fests.",
      speakers: [
        { name: "Student Cultural Committee", role: "Organizing Body", company: "Kalpanaaa Education" }
      ],
      agenda: [
        { time: "05:00 PM", title: "Inter-College Dance & Battle of Bands", desc: "High energy performances by regional college teams." },
        { time: "08:00 PM", title: "Celebrity Guest Musical Evening", desc: "Live concert performance at the open amphitheatre." }
      ]
    }
  ];

  const evt = eventsData.find(e => e.id === eventId) || eventsData[0];

  const handleRegister = (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(regForm.email.trim())) {
      alert('Please enter a valid Gmail address ending with @gmail.com (e.g. name@gmail.com)');
      return;
    }
    setRegistered(true);
    setTimeout(() => {
      setShowRegModal(false);
      setRegistered(false);
      setRegForm({ name: '', email: '', phone: '', attendeeType: 'Student' });
      alert(`Registration Confirmed! Seat pass for "${evt.title}" has been sent to ${regForm.email}.`);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Header */}
      <div className="bg-white py-12 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            to="/events"
            className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-navy uppercase tracking-wider mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1 text-gold" /> Return to Campus Calendar
          </Link>

          <div className="flex items-center space-x-3 text-xs">
            <span className="bg-navy text-gold font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              {evt.category}
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="flex items-center text-slate-600 font-serif">
              <Calendar className="w-3.5 h-3.5 mr-1 text-gold" /> {evt.fullDate}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-navy leading-tight">
            {evt.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs font-sans">
            <div className="flex items-center space-x-2 text-slate-700">
              <Clock className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Timings: <strong>{evt.time}</strong></span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700">
              <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Venue: <strong>{evt.venue}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Event Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-sans">
        
        {/* Event Image Banner & Register Bar */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 space-y-6 p-6 sm:p-8">
          <div className="h-[380px] rounded-xl overflow-hidden relative">
            <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-navy text-gold p-3 rounded-xl text-center shadow-2xl font-num border border-gold/40">
              <span className="text-2xl font-bold block leading-none">{evt.date.split(' ')[0]}</span>
              <span className="text-xs font-bold uppercase block tracking-wider mt-0.5">{evt.date.split(' ')[1]}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border rounded-xl">
            <div>
              <span className="text-[10px] font-bold text-gold uppercase bg-navy px-2.5 py-0.5 rounded">OPEN REGISTRATION</span>
              <h4 className="text-base font-bold text-navy mt-1">Reserve Your Seat for this Event</h4>
              <p className="text-xs text-slate-500 font-serif">Free admission for registered students, faculty, and industry guests.</p>
            </div>

            <button
              onClick={() => setShowRegModal(true)}
              className="px-8 py-3.5 bg-gold hover:bg-gold-hover text-navy-dark font-bold text-xs rounded-xl shadow-lg uppercase tracking-wider flex-shrink-0"
            >
              Register for Event Now
            </button>
          </div>
        </div>

        {/* Overview */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-xl font-serif font-bold text-navy">About the Event</h3>
          <p className="text-slate-600 text-sm leading-relaxed font-serif">
            {evt.description}
          </p>
        </div>

        {/* Agenda / Schedule Timeline */}
        {evt.agenda && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-xl font-serif font-bold text-navy">Event Agenda & Timetable</h3>
            <div className="space-y-4 pt-2">
              {evt.agenda.map((slot, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="px-3 py-1 bg-navy text-gold font-mono font-bold text-xs rounded-lg flex-shrink-0 self-start">
                    {slot.time}
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-navy text-base">{slot.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{slot.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Speakers / Coordinators */}
        {evt.speakers && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-xl font-serif font-bold text-navy">Keynote Speakers & Organizers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {evt.speakers.map((spk, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                  <div className="w-12 h-12 bg-navy text-gold rounded-full flex items-center justify-center font-bold mx-auto mb-2 font-serif text-lg">
                    {spk.name.charAt(0)}
                  </div>
                  <h4 className="font-serif font-bold text-navy text-sm">{spk.name}</h4>
                  <p className="text-[11px] text-slate-600">{spk.role}</p>
                  <span className="text-[10px] font-bold text-gold bg-navy px-2 py-0.5 rounded inline-block mt-1">
                    {spk.company}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* REGISTRATION MODAL */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-gold bg-navy px-2 py-0.5 rounded">EVENT REGISTRATION</span>
                <h3 className="text-lg font-bold text-navy mt-1">{evt.title}</h3>
              </div>
              <button onClick={() => setShowRegModal(false)} className="text-slate-400 text-xl font-bold">&times;</button>
            </div>

            {registered ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-navy">Registration Successful!</h4>
                <p className="text-xs text-slate-500 font-serif">Generating entry QR pass and dispatching confirmation to {regForm.email}...</p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Enter your name"
                    value={regForm.name}
                    onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    required
                    type="email"
                    placeholder="name@kalpanaaa.edu"
                    value={regForm.email}
                    onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile / Phone Number (10 Digits) *</label>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder="e.g. 9876543210"
                    value={regForm.phone}
                    onChange={e => setRegForm({ ...regForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Attendee Category</label>
                  <select
                    value={regForm.attendeeType}
                    onChange={e => setRegForm({ ...regForm, attendeeType: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-bold text-navy"
                  >
                    <option value="Student">University Student</option>
                    <option value="Faculty">Faculty / Scholar</option>
                    <option value="External Guest">External Corporate Guest</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <button type="button" onClick={() => setShowRegModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-gold text-navy-dark font-bold rounded-xl shadow uppercase tracking-wider">
                    Confirm Seat Pass
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
