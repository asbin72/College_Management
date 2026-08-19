import React from 'react';
import { MainHeader } from './MainHeader';
import { Footer } from './Footer';

export const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};
