import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  Menu, X, ChevronDown, User, Settings, LogOut, Wrench, Shield,
  Bell, Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Navbar() {
  const { role, userName, userPhoto, isLoggedIn, logout } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isTransparent = location.pathname === '/' && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location]);

  const getDashboardLink = () => {
    if (role === 'usuario') return '/panel/usuario';
    if (role === 'profesional') return '/panel/profesional';
    if (role === 'admin') return '/panel/admin';
    return '/login';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white shadow-sm border-b border-[#E5E7EB]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#1E40AF] rounded-lg flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span
              className={`text-xl font-bold tracking-tight transition-colors ${
                isTransparent ? 'text-white' : 'text-[#111827]'
              }`}
            >
              By<span className="text-[#10B981]">Me</span>
            </span>
          </Link>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-7">
            <Link
              to="/buscar"
              className={`text-sm font-medium transition-colors hover:text-[#1E40AF] ${
                isTransparent ? 'text-white/90 hover:text-white' : 'text-[#374151]'
              }`}
            >
              Buscar Servicios
            </Link>
            <Link
              to="/#como-funciona"
              className={`text-sm font-medium transition-colors hover:text-[#1E40AF] ${
                isTransparent ? 'text-white/90 hover:text-white' : 'text-[#374151]'
              }`}
            >
              Cómo funciona
            </Link>
            {isLoggedIn && role === 'profesional' && (
              <Link
                to="/panel/profesional"
                className={`text-sm font-medium transition-colors hover:text-[#1E40AF] ${
                  isTransparent ? 'text-white/90 hover:text-white' : 'text-[#374151]'
                }`}
              >
                Mi Panel Pro
              </Link>
            )}
            {isLoggedIn && role === 'admin' && (
              <Link
                to="/panel/admin"
                className={`text-sm font-medium transition-colors hover:text-[#1E40AF] ${
                  isTransparent ? 'text-white/90 hover:text-white' : 'text-[#374151]'
                } flex items-center gap-1`}
              >
                <Shield className="w-3.5 h-3.5" /> Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button className={`p-2 rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-[#6B7280] hover:bg-[#F3F4F6]'}`}>
                  <Bell className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border transition-all ${
                      isTransparent ? 'border-white/30 hover:bg-white/10' : 'border-[#E5E7EB] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <img
                      src={userPhoto}
                      alt={userName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className={`text-sm font-medium max-w-28 truncate ${isTransparent ? 'text-white' : 'text-[#111827]'}`}>
                      {userName.split(' ')[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 ${isTransparent ? 'text-white' : 'text-[#6B7280]'}`} />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#E5E7EB] py-1 z-50">
                      <div className="px-4 py-3 border-b border-[#E5E7EB]">
                        <p className="text-sm font-semibold text-[#111827]">{userName}</p>
                        <p className="text-xs text-[#9CA3AF] capitalize">{role === 'usuario' ? 'Cliente' : role === 'profesional' ? 'Profesional' : 'Administrador'}</p>
                      </div>
                      <Link to={getDashboardLink()} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB]">
                        <Settings className="w-4 h-4 text-[#9CA3AF]" /> Mi Panel
                      </Link>
                      <Link to="/perfil" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB]">
                        <User className="w-4 h-4 text-[#9CA3AF]" /> Mi perfil
                      </Link>
                      <button
                        onClick={async () => {
                          await logout();
                          navigate('/');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" /> Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                    isTransparent
                      ? 'text-white hover:bg-white/10'
                      : 'text-[#374151] hover:bg-[#F3F4F6]'
                  }`}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className="text-sm font-medium px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1D3FA0] transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${isTransparent ? 'text-white' : 'text-[#374151]'}`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E7EB] px-4 py-4 space-y-1">
          <Link to="/buscar" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#374151] rounded-lg hover:bg-[#F9FAFB]">
            <Search className="w-4 h-4 text-[#9CA3AF]" /> Buscar Servicios
          </Link>
          <Link to="/#como-funciona" className="block px-3 py-2.5 text-sm font-medium text-[#374151] rounded-lg hover:bg-[#F9FAFB]">
            Cómo funciona
          </Link>
          {isLoggedIn ? (
            <div className="pt-2 border-t border-[#E5E7EB] mt-2 space-y-1">
              <div className="flex items-center gap-3 px-3 py-2">
                <img src={userPhoto} alt={userName} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{userName}</p>
                  <p className="text-xs text-[#9CA3AF] capitalize">{role}</p>
                </div>
              </div>
              <Link to={getDashboardLink()} className="block px-3 py-2.5 text-sm font-medium text-[#374151] rounded-lg hover:bg-[#F9FAFB]">Mi Panel</Link>
              <Link to="/perfil" className="block px-3 py-2.5 text-sm font-medium text-[#374151] rounded-lg hover:bg-[#F9FAFB]">Mi perfil</Link>
              <button
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-500 rounded-lg hover:bg-red-50"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="pt-2 flex flex-col gap-2 border-t border-[#E5E7EB] mt-2">
              <Link to="/login" className="block text-center px-4 py-2.5 text-sm font-medium text-[#374151] border border-[#E5E7EB] rounded-lg">Iniciar sesión</Link>
              <Link to="/registro" className="block text-center px-4 py-2.5 text-sm font-medium text-white bg-[#1E40AF] rounded-lg">Registrarse</Link>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdowns */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </nav>
  );
}
