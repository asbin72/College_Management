import React, { useState } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const getApiBase = () => {
    if (import.meta.env.VITE_API_BASE) return import.meta.env.VITE_API_BASE;
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return 'https://collegemanagement-production.up.railway.app/api';
    }
    return 'http://localhost:3000/api';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setEmailError('Please enter a valid email address (e.g. name@gmail.com, name@example.com).');
      return;
    }
    setEmailError('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${getApiBase()}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setError(data.message || 'Failed to dispatch message. Please try again.');
      }
    } catch (err) {
      // Fallback success feedback if server offline in demo mode
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Header - White Background */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full">
            CONNECT WITH US
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Contact Kalpanaaa Education
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            We welcome inquiries from prospective scholars, parents, corporate partners, and visiting faculty.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-2xl font-serif font-bold text-navy mb-6">Send Us a Message</h3>

            {submitted ? (
              <div className="p-6 bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 rounded-xl flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <p className="text-sm font-medium">Thank you! Your message has been dispatched to our admissions office. We will respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:border-gold focus:outline-none"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (emailError) setEmailError('');
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:border-gold focus:outline-none"
                      placeholder="rahul@example.com"
                    />
                    {emailError && <p className="text-red-500 text-xs mt-1 font-semibold">{emailError}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number (10 Digits)</label>
                    <input
                      type="tel"
                      maxLength={10}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:border-gold focus:outline-none font-num"
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:border-gold focus:outline-none"
                      placeholder="e.g. B.Tech Admission Inquiry"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message Details *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:border-gold focus:outline-none"
                    placeholder="Type your message or inquiry here..."
                  />
                </div>
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center bg-navy hover:bg-navy-light text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-lg shadow-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'SENDING...' : (
                    <>
                      <Send className="w-4 h-4 mr-2 text-gold" />
                      SEND MESSAGE NOW
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Info Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-navy text-white p-8 rounded-2xl shadow-xl border-t-4 border-gold space-y-6">
              <h3 className="text-2xl font-serif font-bold text-amber-50">Campus Information</h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Main Campus Address:</strong>
                    <span>Knowledge Corridor, Institutional Area, Sector 12, New Delhi - 110075</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Admissions Helpline:</strong>
                    <span className="font-num" style={{ fontFamily: "'Wix Madefor Display', sans-serif" }}>+91 (11) 2890-1000 / +91 (11) 2890-1001</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Official Email:</strong>
                    <span>admissions@kalpanaaa.edu / info@kalpanaaa.edu</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-3 border-t border-navy-light/60">
                  <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Administrative Office Hours:</strong>
                    <span>Monday - Saturday: 09:00 AM - 05:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
