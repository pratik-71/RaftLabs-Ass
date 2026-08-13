import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-background font-body text-textMain relative">
      <Navbar />
      <div className={`flex-1 ${!isHome ? 'pt-20' : ''}`}>
        {children}
      </div>
      <Footer />
    </div>
  );
}
