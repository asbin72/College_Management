import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Student, Teacher, Department } from '../../types';
import { Users, GraduationCap, Building2, BookOpen, UserPlus, CheckCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { data: students = [], isLoading: loadingStudents } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: async () => {
      const res = await apiClient.get('/students');
      return res.data?.data || [];
    },
  });

  const { data: teachers = [], isLoading: loadingTeachers } = useQuery<Teacher[]>({
    queryKey: ['teachers'],
    queryFn: async () => {
      const res = await apiClient.get('/teachers');
      return res.data?.data || [];
    },
  });

  const { data: departments = [], isLoading: loadingDepts } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await apiClient.get('/departments');
      return res.data?.data || [];
    },
  });

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Administrator Console</h1>
          <p style={{ color: 'var(--text-muted)' }}>Institutional ERP Overview & System Health</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary">
            <UserPlus size={16} /> New Admission
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid-cols-4">
        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Total Enrolled Students</div>
            <div className="stat-val">{loadingStudents ? '...' : students.length}</div>
            <span className="badge badge-success">Active Cohort</span>
          </div>
          <div className="stat-icon"><GraduationCap size={24} /></div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Faculty Professors</div>
            <div className="stat-val">{loadingTeachers ? '...' : teachers.length}</div>
            <span className="badge badge-info">100% On Duty</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE' }}><Users size={24} /></div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Academic Departments</div>
            <div className="stat-val">{loadingDepts ? '...' : departments.length}</div>
            <span className="badge badge-warning">Engineering & AI</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}><Building2 size={24} /></div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">System Status</div>
            <div className="stat-val" style={{ fontSize: '1.4rem', color: '#34D399' }}>Operational</div>
            <span className="badge badge-success"><CheckCircle size={12} style={{ marginRight: '4px' }} /> Spring Boot 3</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}><BookOpen size={24} /></div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid-cols-2">
        {/* Recent Students Table */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Enrolled Students</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.id || st.rollNo}>
                    <td><strong>{st.rollNo}</strong></td>
                    <td>{st.name}</td>
                    <td>{st.department}</td>
                    <td>Sem {st.semester}</td>
                    <td><span className="badge badge-success">{st.status || 'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Faculty Directory */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Faculty Members</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((tc) => (
                  <tr key={tc.id || tc.employeeId}>
                    <td><strong>{tc.employeeId}</strong></td>
                    <td>{tc.name}</td>
                    <td>{tc.department}</td>
                    <td>{tc.designation}</td>
                    <td><span className="badge badge-info">{tc.status || 'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
