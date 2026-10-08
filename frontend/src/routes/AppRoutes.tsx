import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

import { HomePage } from '../pages/public/HomePage';
import { AdmissionsPage } from '../pages/public/AdmissionsPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { TeacherDashboard } from '../pages/teacher/TeacherDashboard';
import { StudentDashboard } from '../pages/student/StudentDashboard';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/admissions" element={<AdmissionsPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Protected Teacher Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_TEACHER', 'ROLE_ADMIN']} />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
        </Route>

        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']} />}>
          <Route path="/student" element={<StudentDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
