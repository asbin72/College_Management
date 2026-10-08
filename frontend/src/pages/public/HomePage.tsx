import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, Users, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 1rem', maxWidth: '850px', margin: '0 auto' }}>
        <div className="badge badge-info" style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
          🚀 Next-Gen Enterprise College & Campus ERP System
        </div>
        <h1 style={{ fontSize: '3.25rem', lineHeight: 1.15, marginBottom: '1.5rem', background: 'linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Empowering Academic Excellence & Campus Administration
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Kalpanaaa Education offers unified real-time workflows for college administrators, faculty professors, and ambitious students built with Spring Boot 3 & React TypeScript.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            Access Campus Portal <ArrowRight size={18} />
          </Link>
          <Link to="/admissions" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            Apply for Admission
          </Link>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="grid-cols-4" style={{ marginTop: '2rem' }}>
        <div className="glass-card">
          <div className="stat-icon" style={{ marginBottom: '1rem' }}>
            <Shield size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Enterprise Security</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Spring Security 6 with JWT and fine-grained RBAC protecting faculty records and student privacy.
          </p>
        </div>

        <div className="glass-card">
          <div className="stat-icon" style={{ marginBottom: '1rem', background: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE' }}>
            <BookOpen size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Curriculum & Exams</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Comprehensive course catalogs, semester scheduling, assignment tracking, and automated gradebook computations.
          </p>
        </div>

        <div className="glass-card">
          <div className="stat-icon" style={{ marginBottom: '1rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
            <Users size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Live Attendance</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Single-click faculty attendance registers with automated student eligibility analytics and alerts.
          </p>
        </div>

        <div className="glass-card">
          <div className="stat-icon" style={{ marginBottom: '1rem', background: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA' }}>
            <Award size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Institutional Insights</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Comprehensive administrative analytics, fee reconciliations, and academic performance monitors.
          </p>
        </div>
      </section>

      {/* Demo Credentials Quick Reference */}
      <section className="glass-card" style={{ marginTop: '2rem', padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={20} color="#34D399" /> Fast Demo Access Accounts
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Administrator</span>
            <p style={{ fontSize: '0.9rem' }}><strong>Email:</strong> admin@kalpanaaa.edu</p>
            <p style={{ fontSize: '0.9rem' }}><strong>Password:</strong> admin123</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Faculty / Teacher</span>
            <p style={{ fontSize: '0.9rem' }}><strong>Email:</strong> teacher@kalpanaaa.edu</p>
            <p style={{ fontSize: '0.9rem' }}><strong>Password:</strong> teacher123</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>Student</span>
            <p style={{ fontSize: '0.9rem' }}><strong>Email:</strong> student@kalpanaaa.edu</p>
            <p style={{ fontSize: '0.9rem' }}><strong>Password:</strong> student123</p>
          </div>
        </div>
      </section>
    </div>
  );
};
