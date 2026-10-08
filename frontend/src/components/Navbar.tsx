import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogOut, User as UserIcon, Shield, BookOpen } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo-badge">
        <GraduationCap size={28} />
        <span>Kalpanaaa Education</span>
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
        <Link to="/admissions" style={{ color: 'var(--text-muted)' }}>Admissions</Link>

        {isAuthenticated && user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user.role === 'ROLE_ADMIN' && (
              <Link to="/admin" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <Shield size={16} /> Admin Portal
              </Link>
            )}
            {user.role === 'ROLE_TEACHER' && (
              <Link to="/teacher" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <BookOpen size={16} /> Faculty Portal
              </Link>
            )}
            {user.role === 'ROLE_STUDENT' && (
              <Link to="/student" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <UserIcon size={16} /> Student Portal
              </Link>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
              Portal Sign In
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};
