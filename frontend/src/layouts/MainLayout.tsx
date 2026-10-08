import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const MainLayout: React.FC = () => {
  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
