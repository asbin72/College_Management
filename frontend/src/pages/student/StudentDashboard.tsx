import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';
import { CheckCircle, Award, BookOpen, Calendar } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const rollNo = user?.identifier || 'CS2026-042';

  const { data: attendanceLogs = [] } = useQuery<any[]>({
    queryKey: ['my-attendance', rollNo],
    queryFn: async () => {
      const res = await apiClient.get(`/attendance?studentRollNo=${rollNo}`);
      return res.data?.data || [];
    },
  });

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Student Academic Hub</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Welcome back, {user?.name || 'Alex Morgan'} ({rollNo}) — B.Tech Computer Science (Semester 3)
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid-cols-4">
        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Overall Attendance</div>
            <div className="stat-val" style={{ color: '#34D399' }}>94.5%</div>
            <span className="badge badge-success">Eligible for Exams</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}><CheckCircle size={24} /></div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Current CGPA</div>
            <div className="stat-val" style={{ color: '#818CF8' }}>3.85 / 4.0</div>
            <span className="badge badge-info">Distinction Tier</span>
          </div>
          <div className="stat-icon"><Award size={24} /></div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Enrolled Courses</div>
            <div className="stat-val">5</div>
            <span className="badge badge-warning">18 Total Credits</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}><BookOpen size={24} /></div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Next Examination</div>
            <div className="stat-val" style={{ fontSize: '1.2rem' }}>Oct 15</div>
            <span className="badge badge-info">Mid-Terms 2026</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE' }}><Calendar size={24} /></div>
        </div>
      </div>

      {/* Academic Tables */}
      <div className="grid-cols-2">
        {/* Recent Attendance Records */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Recent Attendance Activity</h3>
          {attendanceLogs.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>No recorded absences. You have maintained a 94.5% attendance rate!</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceLogs.map((log, idx) => (
                    <tr key={idx}>
                      <td>{log.date || 'Today'}</td>
                      <td>{log.subjectCode} - {log.subjectName}</td>
                      <td>
                        <span className={`badge ${log.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Examination Scores & Grades */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Subject Grades & Evaluation</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Assessment</th>
                  <th>Score</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CS301 Data Structures</td>
                  <td>Internal Exam</td>
                  <td>48 / 50</td>
                  <td><span className="badge badge-success">A+</span></td>
                </tr>
                <tr>
                  <td>CS302 Database Systems</td>
                  <td>Mid-Term Project</td>
                  <td>45 / 50</td>
                  <td><span className="badge badge-success">A</span></td>
                </tr>
                <tr>
                  <td>CS303 Operating Systems</td>
                  <td>Lab Evaluation</td>
                  <td>42 / 50</td>
                  <td><span className="badge badge-info">B+</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
