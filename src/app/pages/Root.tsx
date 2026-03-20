import React from 'react';
import { Outlet, useLocation } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const HIDE_FOOTER_ROUTES = ['/panel/usuario', '/panel/profesional', '/panel/admin', '/buscar'];

export function Root() {
  const location = useLocation();
  const hideFooter = HIDE_FOOTER_ROUTES.some(r => location.pathname.startsWith(r));

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
