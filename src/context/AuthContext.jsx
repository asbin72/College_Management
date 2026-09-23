import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentYear, getAcademicYear, generateRegisterNumber } from '../utils/idGenerator';
import { setAuthToken, getApiBaseUrl, getAuthHeaders } from '../utils/apiClient';

const AuthContext = createContext();

const API_BASE = getApiBaseUrl();

export const AuthProvider = ({ children, users = [] }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kalpanaaa_auth_user');
      if (!saved) return null;
      const user = JSON.parse(saved);
      if (user && (user.name === 'Demo Teacher' || user.id === 'user-teacher-demo' || user.employeeId === 'EMP-100')) {
        const migrated = {
          ...user,
          name: 'Dr. Sanjay Kulkarni',
          employeeId: 'EMP-100',
          id: user.id || 'user-teacher-demo',
          email: user.email === 'teacher@kalpanaa.edu' || !user.email ? 'teacher@kalpanaaa.edu' : user.email,
          designation: (user.designation && user.designation !== 'Teacher') ? user.designation : 'Senior Professor & Research Dean',
          department: user.department || 'Computer Science & Engineering',
          departmentCode: 'CSE',
          qualification: 'Ph.D. in Computer Science (IIT Bombay)',
          specialization: 'Artificial Intelligence & Neural Networks',
          avatar: user.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
          photoUrl: user.photoUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
        };
        localStorage.setItem('kalpanaaa_auth_user', JSON.stringify(migrated));
        return migrated;
      }
      return user;
    } catch (e) {
      return null;
    }
  });

  const [authError, setAuthError] = useState('');

  // Sandbox Role Switching State (For Admin Previewing)
  const [sandboxState, setSandboxState] = useState(() => {
    const savedSandbox = localStorage.getItem('kalpanaaa_sandbox_state');
    return savedSandbox ? JSON.parse(savedSandbox) : {
      isPreview: false,
      previewRole: null,
      realUser: null
    };
  });

  useEffect(() => {
    localStorage.setItem('kalpanaaa_sandbox_state', JSON.stringify(sandboxState));
  }, [sandboxState]);

  // LOGIN
  const login = async (identifier, password) => {
    setAuthError('');
    const cleanId = (identifier || '').trim();

    if (!cleanId || !password) {
      setAuthError('Please provide both Email/ID and Password.');
      return { success: false, error: 'Identifier and password are required.' };
    }

    // Server-side Authentication: MySQL Express REST API Server Login
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password })
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data && data.success && data.user) {
        if (data.token) {
          setAuthToken(data.token);
        }
        setCurrentUser(data.user);
        localStorage.setItem('kalpanaaa_auth_user', JSON.stringify(data.user));
        setSandboxState({ isPreview: false, previewRole: null, realUser: null });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('kalpanaaa_auth_changed'));
        }
        return { success: true, user: data.user, role: data.user.role };
      } else {
        const errorMsg = (data && data.message) || 'Invalid credentials. Please verify your Email/ID and Password.';
        setAuthError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('[AuthContext] Backend server unreachable:', err.message);
      const errorMsg = 'Authentication service is unavailable. Please ensure the backend server is running.';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // STUDENT SIGNUP
  const signupStudent = async (studentData) => {
    setAuthError('');
    try {
      const response = await fetch(`${API_BASE}/auth/student-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        data = null;
      }

      if (response.ok && data && data.success) {
        // Sync new student to local cached pool
        try {
          const stored = localStorage.getItem('kalpanaaa_data_users_v5');
          const list = stored ? JSON.parse(stored) : [];
          if (Array.isArray(list)) {
            list.push(data.user);
            localStorage.setItem('kalpanaaa_data_users_v5', JSON.stringify(list));
          }
        } catch (e) {}

        return { success: true, user: data.user };
      } else if (data && data.message) {
        return { success: false, error: data.message };
      } else {
        return { success: false, error: 'Registration failed. Please try again.' };
      }
    } catch (err) {
      console.error('Registration server error:', err.message);
      return { success: false, error: 'Registration service is unavailable. Please ensure the backend server is running.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setSandboxState({ isPreview: false, previewRole: null, realUser: null });
    localStorage.removeItem('kalpanaaa_auth_user');
    localStorage.removeItem('kalpanaaa_sandbox_state');
    setAuthToken(null);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('kalpanaaa_auth_changed'));
    }
  };

  const updateProfile = async (updatedData) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    localStorage.setItem('kalpanaaa_auth_user', JSON.stringify(updated));

    // Also persist immediately in central user database (kalpanaaa_data_users_v5)
    try {
      const storedUsers = localStorage.getItem('kalpanaaa_data_users_v5');
      if (storedUsers) {
        const parsed = JSON.parse(storedUsers);
        if (Array.isArray(parsed)) {
          const updatedList = parsed.map(u => {
            const isMatch = 
              (updated.id && u.id === updated.id) ||
              (updated.studentId && (u.studentId === updated.studentId || u.id === updated.studentId)) ||
              (updated.employeeId && (u.employeeId === updated.employeeId || u.id === updated.employeeId)) ||
              (updated.email && u.email && u.email.toLowerCase() === updated.email.toLowerCase());
            if (isMatch) {
              return { ...u, ...updatedData };
            }
            return u;
          });
          localStorage.setItem('kalpanaaa_data_users_v5', JSON.stringify(updatedList));
        }
      }
    } catch (e) {
      console.warn('Error syncing profile update to user database cache:', e);
    }

    // Persist directly to MySQL database via Express REST API
    try {
      await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updatedData)
      });
    } catch (err) {
      console.warn('Backend offline or profile sync error:', err.message);
    }
  };

  // --- SANDBOX ROLE SWITCHING FUNCTIONS ---
  const enterSandboxPreview = (targetRole) => {
    const realUserObj = sandboxState.isPreview ? sandboxState.realUser : currentUser;
    if (!realUserObj || (realUserObj.role !== 'ADMIN' && !sandboxState.isPreview)) {
      alert('Only System Administrators can launch the Role Sandbox Preview.');
      return;
    }

    let mockPreviewUser;

    if (targetRole === 'STUDENT') {
      const existingStudent = users.find(u => u.role === 'STUDENT') || {};
      mockPreviewUser = {
        ...existingStudent,
        id: existingStudent.id || 'STU-2024-001',
        studentId: existingStudent.studentId || 'STU-2024-001',
        name: `${realUserObj.name} (Preview as Student)`,
        email: realUserObj.email,
        role: 'STUDENT',
        department: 'Computer Science & Engineering',
        course: 'B.Tech Computer Science & Engineering',
        semester: '6th Semester',
        section: 'Sec A',
        gpa: '3.85',
        overallAttendance: '92%',
        isSandboxPreview: true,
        realAdminName: realUserObj.name
      };
    } else if (targetRole === 'TEACHER' || targetRole === 'STAFF') {
      const existingTeacher = users.find(u => u.role === 'TEACHER' || u.role === 'STAFF') || {};
      mockPreviewUser = {
        ...existingTeacher,
        id: existingTeacher.id || 'EMP-101',
        employeeId: existingTeacher.employeeId || 'EMP-101',
        name: `${realUserObj.name} (Preview as Faculty)`,
        email: realUserObj.email,
        role: 'TEACHER',
        department: 'Computer Science & Engineering',
        designation: 'Senior Assistant Professor',
        assignedSubjects: ['CS-601', 'CS-604'],
        isSandboxPreview: true,
        realAdminName: realUserObj.name
      };
    }

    setSandboxState({
      isPreview: true,
      previewRole: targetRole,
      realUser: realUserObj
    });

    setCurrentUser(mockPreviewUser);
  };

  const exitSandboxPreview = () => {
    if (sandboxState.realUser) {
      setCurrentUser(sandboxState.realUser);
      setSandboxState({ isPreview: false, previewRole: null, realUser: null });
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      authError,
      login,
      signupStudent,
      logout,
      updateProfile,
      sandboxState,
      enterSandboxPreview,
      exitSandboxPreview,
      isAuthenticated: !!currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
