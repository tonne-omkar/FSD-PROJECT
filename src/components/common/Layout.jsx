import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Toast from './Toast';
import ChatbotWidget from '../chat/ChatbotWidget';
import { useAuth } from '../../context/AuthContext';

export default function Layout({ children }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
        {children || <Outlet />}
      </main>
      <Footer />
      <Toast />
      {isAuthenticated && <ChatbotWidget />}
    </div>
  );
}
