import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';
import { GraduationCap, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data?.data) {
        const { token, id, name, email: userEmail, role, identifier, department } = res.data.data;
        login(token, { id, name, email: userEmail, role, identifier, department });

        // Route to respective dashboard
        if (role === 'ROLE_ADMIN') navigate('/admin');
        else if (role === 'ROLE_TEACHER') navigate('/teacher');
        else navigate('/student');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoUser = (userType: 'admin' | 'teacher' | 'student') => {
    if (userType === 'admin') {
      setEmail('admin@kalpanaaa.edu');
      setPassword('admin123');
    } else if (userType === 'teacher') {
      setEmail('teacher@kalpanaaa.edu');
      setPassword('teacher123');
    } else {
      setEmail('student@kalpanaaa.edu');
      setPassword('student123');
    }
  };

  return (
    <div className="page-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'rgba(79, 70, 229, 0.15)', borderRadius: 'var(--radius-sm)', color: '#818CF8', marginBottom: '1rem' }}>
            <GraduationCap size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Portal Sign In</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Access your academic workspace</p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or ID</label>
            <input
              type="text"
              className="form-input"
              placeholder="admin@kalpanaaa.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '0.5rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Quick Fill Demo Logins:</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button type="button" onClick={() => setDemoUser('admin')} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Admin</button>
            <button type="button" onClick={() => setDemoUser('teacher')} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Teacher</button>
            <button type="button" onClick={() => setDemoUser('student')} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Student</button>
          </div>
        </div>
      </div>
    </div>
  );
};
