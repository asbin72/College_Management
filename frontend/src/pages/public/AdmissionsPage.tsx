import React, { useState } from 'react';
import { apiClient } from '../../services/api';
import { Send, CheckCircle2 } from 'lucide-react';

export const AdmissionsPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [course, setCourse] = useState('BTECH-CSE');
  const [qualifyingPercentage, setQualifyingPercentage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [appNumber, setAppNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/admissions/apply', {
        fullName,
        email,
        phone,
        department,
        course,
        qualifyingPercentage: parseFloat(qualifyingPercentage) || 85.0,
      });
      if (res.data?.data) {
        setAppNumber(res.data.data.applicationNumber);
        setSubmitted(true);
      }
    } catch (err) {
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '700px' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Online Admissions Application</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Apply for undergraduate and postgraduate engineering programs at Kalpanaaa Education for Academic Year 2026-2027.
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={48} color="#34D399" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Application Submitted Successfully!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Your application tracking reference code is:
            </p>
            <div style={{ background: 'rgba(79, 70, 229, 0.15)', border: '1px solid var(--primary)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', display: 'inline-block', fontSize: '1.25rem', fontWeight: 'bold', color: '#818CF8' }}>
              {appNumber}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. John Doe" />
            </div>

            <div className="grid-cols-2" style={{ marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" required value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="grid-cols-2" style={{ marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-select" value={department} onChange={e => setDepartment(e.target.value)}>
                  <option value="CSE">Computer Science & Engineering</option>
                  <option value="ECE">Electronics & Communication</option>
                  <option value="ME">Mechanical Engineering</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Target Program</label>
                <select className="form-select" value={course} onChange={e => setCourse(e.target.value)}>
                  <option value="BTECH-CSE">B.Tech - Computer Science</option>
                  <option value="BTECH-ECE">B.Tech - Electronics</option>
                  <option value="MTECH-AI">M.Tech - Artificial Intelligence</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">12th Grade / Qualifying Percentage (%)</label>
              <input type="number" step="0.1" className="form-input" required value={qualifyingPercentage} onChange={e => setQualifyingPercentage(e.target.value)} placeholder="e.g. 92.5" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
              <Send size={16} /> Submit Admission Application
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
