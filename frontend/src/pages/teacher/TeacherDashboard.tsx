import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Student } from '../../types';
import { Check, X, Calendar, BookOpen, Clock, Award } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedSubject, setSelectedSubject] = useState('CS301');
  const [attendanceState, setAttendanceState] = useState<{ [key: string]: 'Present' | 'Absent' }>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ['students-cse'],
    queryFn: async () => {
      const res = await apiClient.get('/students?department=CSE');
      return res.data?.data || [];
    },
  });

  const markAttendanceMutation = useMutation({
    mutationFn: async (payload: any[]) => {
      return await apiClient.post('/attendance/bulk', payload);
    },
    onSuccess: () => {
      setSuccessMsg('Attendance marked successfully for the class!');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      setTimeout(() => setSuccessMsg(null), 4000);
    },
  });

  const handleToggleAttendance = (rollNo: string, status: 'Present' | 'Absent') => {
    setAttendanceState(prev => ({
      ...prev,
      [rollNo]: status,
    }));
  };

  const handleMarkAllPresent = () => {
    const newState: { [key: string]: 'Present' | 'Absent' } = {};
    students.forEach(st => {
      newState[st.rollNo] = 'Present';
    });
    setAttendanceState(newState);
  };

  const handleSubmitAttendance = () => {
    const logs = students.map(st => ({
      studentRollNo: st.rollNo,
      studentName: st.name,
      department: st.department,
      subjectCode: selectedSubject,
      subjectName: selectedSubject === 'CS301' ? 'Data Structures & Algorithms' : 'Database Management',
      status: attendanceState[st.rollNo] || 'Present',
      markedBy: 'Dr. Sarah Jenkins',
    }));
    markAttendanceMutation.mutate(logs);
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Faculty Classroom & Attendance Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>Dr. Sarah Jenkins — Department of Computer Science & Engineering</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleMarkAllPresent} className="btn btn-secondary">
            <Check size={16} /> Mark All Present
          </button>
          <button onClick={handleSubmitAttendance} className="btn btn-primary" disabled={markAttendanceMutation.isPending}>
            {markAttendanceMutation.isPending ? 'Saving...' : 'Submit Attendance Register'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          {successMsg}
        </div>
      )}

      {/* Course Selection Cards */}
      <div className="grid-cols-4">
        <div className="glass-card stat-card" style={{ borderColor: selectedSubject === 'CS301' ? 'var(--primary)' : undefined, cursor: 'pointer' }} onClick={() => setSelectedSubject('CS301')}>
          <div>
            <div className="stat-label">Subject Code</div>
            <div className="stat-val" style={{ fontSize: '1.3rem' }}>CS301</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Data Structures</p>
          </div>
          <div className="stat-icon"><BookOpen size={24} /></div>
        </div>

        <div className="glass-card stat-card" style={{ borderColor: selectedSubject === 'CS302' ? 'var(--primary)' : undefined, cursor: 'pointer' }} onClick={() => setSelectedSubject('CS302')}>
          <div>
            <div className="stat-label">Subject Code</div>
            <div className="stat-val" style={{ fontSize: '1.3rem' }}>CS302</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Database Systems</p>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE' }}><Clock size={24} /></div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Enrolled Students</div>
            <div className="stat-val">{students.length}</div>
            <span className="badge badge-info">Semester 3</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}><Calendar size={24} /></div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Pending Reviews</div>
            <div className="stat-val">3</div>
            <span className="badge badge-warning">Assignments</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA' }}><Award size={24} /></div>
        </div>
      </div>

      {/* Student Attendance Roster */}
      <div className="glass-card">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
          Class Attendance Register — {selectedSubject} ({new Date().toLocaleDateString()})
        </h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Semester</th>
                <th>Prior Attendance</th>
                <th>Today's Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st) => {
                const currentStatus = attendanceState[st.rollNo] || 'Present';
                return (
                  <tr key={st.rollNo}>
                    <td><strong>{st.rollNo}</strong></td>
                    <td>{st.name}</td>
                    <td>Sem {st.semester}</td>
                    <td>{st.attendancePercentage || 94.5}%</td>
                    <td>
                      <span className={`badge ${currentStatus === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                        {currentStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleAttendance(st.rollNo, 'Present')}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', background: currentStatus === 'Present' ? 'rgba(16, 185, 129, 0.25)' : undefined, color: currentStatus === 'Present' ? '#34D399' : undefined }}
                        >
                          <Check size={14} /> Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleAttendance(st.rollNo, 'Absent')}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', background: currentStatus === 'Absent' ? 'rgba(239, 68, 68, 0.25)' : undefined, color: currentStatus === 'Absent' ? '#F87171' : undefined }}
                        >
                          <X size={14} /> Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
