import React from 'react';
import Navbar from './components/common/Navbar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/20">
      <Navbar />
      <main className="relative z-10 w-full pt-16">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;