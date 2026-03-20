import React, { useState } from 'react';
import {
  LayoutDashboard, Users, Briefcase, Star, Settings, LogOut,
  Search, CheckCircle2, XCircle, AlertCircle, Shield, MoreVertical,
  TrendingUp, DollarSign, Activity, Eye, Ban, ChevronDown, Filter,
  Download, RefreshCw, Bell, Flag, ThumbsUp, ThumbsDown, Wrench,
  UserCheck, UserX, Clock, BarChart3, ArrowUpRight, ChevronRight
} from 'lucide-react';
import { adminUsers, adminReviews, professionals, IMGS } from '../data/mockData';
import { useApp } from '../context/AppContext';

type View = 'overview' | 'usuarios' | 'profesionales' | 'resenas' | 'configuracion';

const STATUS_BADGE = {
  active: { label: 'Activo', color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]', border: 'border-[#A7F3D0]', dot: 'bg-[#10B981]' },
  inactive: { label: 'Inactivo', color: 'text-[#EF4444]', bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]', dot: 'bg-[#EF4444]' },
  pending: { label: 'Pendiente', color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]', border: 'border-[#FCD34D]', dot: 'bg-[#D97706]' },
  approved: { label: 'Aprobado', color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]', border: 'border-[#A7F3D0]', dot: 'bg-[#10B981]' },
};

const STATS = [
  { label: 'Usuarios registrados', value: '1,284', change: '+12%', icon: Users, color: '#1E40AF', bg: '#EFF6FF', trend: 'up' },
  { label: 'Profesionales activos', value: '347', change: '+8%', icon: Briefcase, color: '#10B981', bg: '#ECFDF5', trend: 'up' },
  { label: 'Servicios este mes', value: '2,156', change: '+23%', icon: Activity, color: '#7C3AED', bg: '#F5F3FF', trend: 'up' },
  { label: 'Ingresos (COP)', value: '$48.2M', change: '+18%', icon: DollarSign, color: '#D97706', bg: '#FFFBEB', trend: 'up' },
];

const RECENT_ACTIVITY = [
  { type: 'user', text: 'Nuevo usuario registrado: Camilo Martínez', time: 'Hace 5 min', icon: Users, color: '#1E40AF' },
  { type: 'pro', text: 'Profesional verificado: Sofía Muñoz (Pintura)', time: 'Hace 12 min', icon: Briefcase, color: '#10B981' },
  { type: 'booking', text: 'Reserva completada: Plomería #B-2041', time: 'Hace 30 min', icon: CheckCircle2, color: '#10B981' },
  { type: 'review', text: 'Nueva reseña pendiente de moderación', time: 'Hace 1 hora', icon: Star, color: '#D97706' },
  { type: 'alert', text: 'Reporte de usuario: Reseña inapropiada', time: 'Hace 2 horas', icon: Flag, color: '#EF4444' },
];

export function AdminDashboard() {
  const [view, setView] = useState<View>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [proSearch, setProSearch] = useState('');
  const [users, setUsers] = useState(adminUsers);
  const [reviews, setReviews] = useState(adminReviews);
  const [proList, setProList] = useState(professionals.map(p => ({ ...p, status: 'active' as 'active' | 'inactive' })));
  const { logout } = useApp();

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredPros = proList.filter(p =>
    p.name.toLowerCase().includes(proSearch.toLowerCase()) ||
    p.specialty.toLowerCase().includes(proSearch.toLowerCase())
  );

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  const toggleProStatus = (id: string) => {
    setProList(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    ));
  };

  const updateReview = (id: string, status: 'approved' | 'rejected') => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const NAV_ITEMS = [
    { key: 'overview', icon: LayoutDashboard, label: 'Panel General' },
    { key: 'usuarios', icon: Users, label: `Usuarios (${users.length})` },
    { key: 'profesionales', icon: Briefcase, label: `Profesionales (${proList.length})` },
    { key: 'resenas', icon: Star, label: `Reseñas (${reviews.filter(r => r.status === 'pending').length} pend.)` },
    { key: 'configuracion', icon: Settings, label: 'Configuración' },
  ] as { key: View; icon: any; label: string }[];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            {/* Admin card */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-[#111827] text-sm">Administrador</p>
                  <p className="text-xs text-[#9CA3AF]">admin@byme.co</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#ECFDF5] rounded-lg px-3 py-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs text-[#065F46] font-medium">Sistema operativo</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.key}
                  onClick={() => setView(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                    view === item.key
                      ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold border-r-2 border-[#1E40AF]'
                      : 'text-[#374151] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {view === item.key && <ChevronRight className="w-3 h-3 text-[#1E40AF]" />}
                </button>
              ))}
              <div className="border-t border-[#E5E7EB]">
                <button
                  onClick={async () => {
                    await logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Cerrar sesión
                </button>
              </div>
            </div>

            {/* Quick stats sidebar */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 mt-4 space-y-3">
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Hoy</p>
              {[
                { label: 'Nuevos usuarios', value: '+14', color: '#1E40AF' },
                { label: 'Servicios realizados', value: '89', color: '#10B981' },
                { label: 'Reseñas pendientes', value: reviews.filter(r => r.status === 'pending').length.toString(), color: '#D97706' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">{s.label}</span>
                  <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">

            {/* ── OVERVIEW ── */}
            {view === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-[#111827]">Panel de Administración</h1>
                    <p className="text-[#6B7280] mt-1">Bienvenido · {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#374151] border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" /> Actualizar
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#374151] border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-colors">
                      <Download className="w-3.5 h-3.5" /> Exportar
                    </button>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {STATS.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                          <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#10B981]">
                          <ArrowUpRight className="w-3 h-3" />
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-[#111827]">{stat.value}</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
                      <h2 className="font-bold text-[#111827]">Actividad reciente</h2>
                      <Bell className="w-4 h-4 text-[#9CA3AF]" />
                    </div>
                    <div className="divide-y divide-[#F9FAFB]">
                      {RECENT_ACTIVITY.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: `${item.color}15` }}>
                            <item.icon className="w-4 h-4" style={{ color: item.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#374151] leading-snug">{item.text}</p>
                            <p className="text-xs text-[#9CA3AF] mt-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {item.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="space-y-4">
                    {/* Pending reviews alert */}
                    {reviews.filter(r => r.status === 'pending').length > 0 && (
                      <div className="bg-[#FFFBEB] border border-[#FCD34D] rounded-2xl p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-[#D97706] flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#92400E]">
                            {reviews.filter(r => r.status === 'pending').length} reseñas esperan moderación
                          </p>
                          <p className="text-xs text-[#B45309] mt-0.5">Revísalas y toma acción</p>
                        </div>
                        <button
                          onClick={() => setView('resenas')}
                          className="text-xs font-semibold text-[#D97706] border border-[#FCD34D] px-3 py-1.5 rounded-lg hover:bg-[#FEF3C7] transition-colors"
                        >
                          Revisar
                        </button>
                      </div>
                    )}

                    {/* Management shortcuts */}
                    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                      <div className="px-5 py-4 border-b border-[#F3F4F6]">
                        <h2 className="font-bold text-[#111827]">Acciones rápidas</h2>
                      </div>
                      {[
                        { label: 'Gestionar usuarios', desc: `${users.filter(u => u.status === 'active').length} activos`, icon: Users, color: '#1E40AF', bg: '#EFF6FF', action: () => setView('usuarios') },
                        { label: 'Gestionar profesionales', desc: `${proList.filter(p => p.status === 'active').length} activos`, icon: Briefcase, color: '#10B981', bg: '#ECFDF5', action: () => setView('profesionales') },
                        { label: 'Moderar reseñas', desc: `${reviews.filter(r => r.status === 'pending').length} pendientes`, icon: Star, color: '#D97706', bg: '#FFFBEB', action: () => setView('resenas') },
                        { label: 'Configuración', desc: 'Ajustes del sistema', icon: Settings, color: '#7C3AED', bg: '#F5F3FF', action: () => setView('configuracion') },
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={item.action}
                          className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-[#F9FAFB] transition-colors border-b border-[#F9FAFB] last:border-0"
                        >
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.bg }}>
                            <item.icon className="w-4 h-4" style={{ color: item.color }} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                            <p className="text-xs text-[#9CA3AF]">{item.desc}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                        </button>
                      ))}
                    </div>

                    {/* Platform health */}
                    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
                      <h3 className="font-bold text-[#111827] mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[#1E40AF]" /> Salud de la plataforma
                      </h3>
                      {[
                        { label: 'Tasa de aceptación', value: 94, color: '#10B981' },
                        { label: 'Satisfacción promedio', value: 96, color: '#1E40AF' },
                        { label: 'Cobertura Popayán', value: 78, color: '#7C3AED' },
                      ].map((item, i) => (
                        <div key={i} className="mb-3 last:mb-0">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-[#6B7280]">{item.label}</span>
                            <span className="text-xs font-bold text-[#111827]">{item.value}%</span>
                          </div>
                          <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{ width: `${item.value}%`, backgroundColor: item.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── USUARIOS ── */}
            {view === 'usuarios' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-[#111827]">Gestión de Usuarios</h1>
                    <p className="text-[#6B7280] mt-0.5">{users.length} usuarios registrados en la plataforma</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#374151] border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-colors">
                      <Filter className="w-3.5 h-3.5" /> Filtrar
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#374151] border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-colors">
                      <Download className="w-3.5 h-3.5" /> Exportar
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    placeholder="Buscar por nombre o correo..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                  />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total usuarios', value: users.length, color: '#1E40AF', bg: '#EFF6FF' },
                    { label: 'Activos', value: users.filter(u => u.status === 'active').length, color: '#10B981', bg: '#ECFDF5' },
                    { label: 'Inactivos', value: users.filter(u => u.status === 'inactive').length, color: '#EF4444', bg: '#FEF2F2' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                        <Users className="w-4 h-4" style={{ color: s.color }} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-[#111827]">{s.value}</p>
                        <p className="text-xs text-[#9CA3AF]">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                  {/* Table header */}
                  <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                    <div className="col-span-4">Usuario</div>
                    <div className="col-span-3">Correo</div>
                    <div className="col-span-2">Reservas</div>
                    <div className="col-span-2">Estado</div>
                    <div className="col-span-1">Acción</div>
                  </div>

                  <div className="divide-y divide-[#F9FAFB]">
                    {filteredUsers.map(user => {
                      const statusCfg = STATUS_BADGE[user.status as keyof typeof STATUS_BADGE] || STATUS_BADGE.active;
                      return (
                        <div key={user.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center px-5 py-4 hover:bg-[#FAFAFA] transition-colors">
                          <div className="sm:col-span-4 flex items-center gap-3">
                            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#111827] truncate">{user.name}</p>
                              <p className="text-xs text-[#9CA3AF]">{user.phone}</p>
                              <p className="text-xs text-[#C4C7CE]">Desde {user.joined}</p>
                            </div>
                          </div>
                          <div className="sm:col-span-3 hidden sm:block">
                            <p className="text-sm text-[#374151] truncate">{user.email}</p>
                          </div>
                          <div className="sm:col-span-2 hidden sm:flex items-center gap-1">
                            <span className="text-sm font-semibold text-[#111827]">{user.bookings}</span>
                            <span className="text-xs text-[#9CA3AF]">reservas</span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusCfg.color} ${statusCfg.bg} ${statusCfg.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                              {statusCfg.label}
                            </span>
                          </div>
                          <div className="sm:col-span-1">
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 text-[#6B7280] hover:text-[#1E40AF] hover:bg-[#EFF6FF] rounded-lg transition-colors">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => toggleUserStatus(user.id)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  user.status === 'active'
                                    ? 'text-[#6B7280] hover:text-red-500 hover:bg-red-50'
                                    : 'text-[#6B7280] hover:text-[#10B981] hover:bg-[#ECFDF5]'
                                }`}
                                title={user.status === 'active' ? 'Desactivar cuenta' : 'Activar cuenta'}
                              >
                                {user.status === 'active'
                                  ? <UserX className="w-3.5 h-3.5" />
                                  : <UserCheck className="w-3.5 h-3.5" />
                                }
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {filteredUsers.length === 0 && (
                      <div className="py-12 text-center">
                        <Users className="w-10 h-10 text-[#D1D5DB] mx-auto mb-2" />
                        <p className="text-[#6B7280]">No se encontraron usuarios</p>
                      </div>
                    )}
                  </div>

                  {/* Table footer */}
                  <div className="px-5 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between">
                    <p className="text-xs text-[#9CA3AF]">Mostrando {filteredUsers.length} de {users.length} usuarios</p>
                    <div className="flex items-center gap-1">
                      <button className="px-3 py-1.5 text-xs text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-white transition-colors">Anterior</button>
                      <button className="px-3 py-1.5 text-xs bg-[#1E40AF] text-white rounded-lg">1</button>
                      <button className="px-3 py-1.5 text-xs text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-white transition-colors">Siguiente</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── PROFESIONALES ── */}
            {view === 'profesionales' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-[#111827]">Gestión de Profesionales</h1>
                    <p className="text-[#6B7280] mt-0.5">{proList.length} profesionales en la plataforma</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1E40AF] text-white rounded-xl hover:bg-[#1D3FA0] transition-colors">
                    + Nuevo profesional
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={proSearch}
                    onChange={e => setProSearch(e.target.value)}
                    placeholder="Buscar profesional o especialidad..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                  />
                </div>

                <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                  {/* Header */}
                  <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                    <div className="col-span-4">Profesional</div>
                    <div className="col-span-2">Especialidad</div>
                    <div className="col-span-2">Calificación</div>
                    <div className="col-span-2">Trabajos</div>
                    <div className="col-span-1">Estado</div>
                    <div className="col-span-1">Acción</div>
                  </div>

                  <div className="divide-y divide-[#F9FAFB]">
                    {filteredPros.map(pro => {
                      const statusCfg = STATUS_BADGE[pro.status as keyof typeof STATUS_BADGE] || STATUS_BADGE.active;
                      return (
                        <div key={pro.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center px-5 py-4 hover:bg-[#FAFAFA] transition-colors">
                          <div className="sm:col-span-4 flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                              <img src={pro.photo} alt={pro.name} className="w-10 h-10 rounded-xl object-cover" />
                              {pro.badge && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#1E40AF] rounded-full flex items-center justify-center">
                                  <Shield className="w-2.5 h-2.5 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#111827] truncate">{pro.name}</p>
                              <p className="text-xs text-[#9CA3AF]">{pro.address}</p>
                            </div>
                          </div>
                          <div className="sm:col-span-2 hidden sm:block">
                            <span className="text-xs bg-[#EFF6FF] text-[#1E40AF] px-2 py-1 rounded-full">{pro.specialty.split(' ')[0]}</span>
                          </div>
                          <div className="sm:col-span-2 hidden sm:flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-semibold text-[#111827]">{pro.rating}</span>
                            <span className="text-xs text-[#9CA3AF]">({pro.reviewCount})</span>
                          </div>
                          <div className="sm:col-span-2 hidden sm:block">
                            <span className="text-sm font-semibold text-[#111827]">{pro.completedJobs}</span>
                            <span className="text-xs text-[#9CA3AF] ml-1">completados</span>
                          </div>
                          <div className="sm:col-span-1">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${statusCfg.color} ${statusCfg.bg} ${statusCfg.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                              {statusCfg.label}
                            </span>
                          </div>
                          <div className="sm:col-span-1">
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 text-[#6B7280] hover:text-[#1E40AF] hover:bg-[#EFF6FF] rounded-lg transition-colors">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => toggleProStatus(pro.id)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  pro.status === 'active'
                                    ? 'text-[#6B7280] hover:text-red-500 hover:bg-red-50'
                                    : 'text-[#6B7280] hover:text-[#10B981] hover:bg-[#ECFDF5]'
                                }`}
                                title={pro.status === 'active' ? 'Suspender' : 'Activar'}
                              >
                                {pro.status === 'active'
                                  ? <Ban className="w-3.5 h-3.5" />
                                  : <CheckCircle2 className="w-3.5 h-3.5" />
                                }
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-5 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between">
                    <p className="text-xs text-[#9CA3AF]">Mostrando {filteredPros.length} de {proList.length} profesionales</p>
                    <div className="flex items-center gap-1">
                      <button className="px-3 py-1.5 text-xs text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-white transition-colors">Anterior</button>
                      <button className="px-3 py-1.5 text-xs bg-[#1E40AF] text-white rounded-lg">1</button>
                      <button className="px-3 py-1.5 text-xs text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-white transition-colors">Siguiente</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── RESEÑAS ── */}
            {view === 'resenas' && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-[#111827]">Moderación de Reseñas</h1>
                  <p className="text-[#6B7280] mt-0.5">Revisa y modera las reseñas de la plataforma</p>
                </div>

                {/* Review stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Pendientes', value: reviews.filter(r => r.status === 'pending').length, color: '#D97706', bg: '#FFFBEB' },
                    { label: 'Aprobadas', value: reviews.filter(r => r.status === 'approved').length, color: '#10B981', bg: '#ECFDF5' },
                    { label: 'Total', value: reviews.length, color: '#1E40AF', bg: '#EFF6FF' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3 text-center">
                      <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-xs text-[#9CA3AF]">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Reviews list */}
                <div className="space-y-4">
                  {reviews.map(review => {
                    const isPending = review.status === 'pending';
                    const isApproved = review.status === 'approved';
                    const isRejected = review.status === 'rejected';
                    return (
                      <div
                        key={review.id}
                        className={`bg-white rounded-2xl border p-5 transition-all ${
                          isPending ? 'border-[#FCD34D] shadow-sm' : 'border-[#E5E7EB]'
                        }`}
                      >
                        {isPending && (
                          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#FEF3C7]">
                            <AlertCircle className="w-4 h-4 text-[#D97706]" />
                            <span className="text-xs font-semibold text-[#D97706]">Pendiente de moderación</span>
                          </div>
                        )}

                        <div className="flex items-start gap-4 flex-wrap">
                          {/* Reviewer */}
                          <div className="flex items-center gap-3 min-w-[160px]">
                            <img src={review.reviewerPhoto} alt={review.reviewer} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                            <div>
                              <p className="text-xs text-[#9CA3AF]">Reseñador</p>
                              <p className="text-sm font-semibold text-[#111827]">{review.reviewer}</p>
                            </div>
                          </div>

                          {/* Arrow */}
                          <div className="hidden sm:flex items-center self-center text-[#9CA3AF]">→</div>

                          {/* Professional */}
                          <div className="flex items-center gap-3 min-w-[160px]">
                            <img src={review.proPhoto} alt={review.professional} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                            <div>
                              <p className="text-xs text-[#9CA3AF]">Profesional</p>
                              <p className="text-sm font-semibold text-[#111827]">{review.professional}</p>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1 ml-auto">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-[#D1D5DB] fill-[#D1D5DB]'}`}
                              />
                            ))}
                            <span className="text-sm font-bold text-[#111827] ml-1">{review.rating}/5</span>
                          </div>

                          {/* Status badge */}
                          <div className="flex items-center">
                            {isApproved && (
                              <span className="flex items-center gap-1 text-xs font-semibold text-[#10B981] bg-[#ECFDF5] px-2.5 py-1 rounded-full border border-[#A7F3D0]">
                                <CheckCircle2 className="w-3 h-3" /> Aprobada
                              </span>
                            )}
                            {isRejected && (
                              <span className="flex items-center gap-1 text-xs font-semibold text-[#EF4444] bg-[#FEF2F2] px-2.5 py-1 rounded-full border border-[#FECACA]">
                                <XCircle className="w-3 h-3" /> Rechazada
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Comment */}
                        <div className="mt-4 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                          <p className="text-sm text-[#374151] leading-relaxed italic">"{review.comment}"</p>
                          <p className="text-xs text-[#9CA3AF] mt-2">{review.date}</p>
                        </div>

                        {/* Actions */}
                        {isPending && (
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => updateReview(review.id, 'approved')}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#10B981] text-white rounded-xl text-sm font-semibold hover:bg-[#0EA875] transition-colors"
                            >
                              <ThumbsUp className="w-4 h-4" /> Aprobar
                            </button>
                            <button
                              onClick={() => updateReview(review.id, 'rejected')}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#E5E7EB] text-[#EF4444] rounded-xl text-sm font-semibold hover:bg-[#FEF2F2] transition-colors"
                            >
                              <ThumbsDown className="w-4 h-4" /> Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── CONFIGURACIÓN ── */}
            {view === 'configuracion' && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-[#111827]">Configuración del sistema</h1>
                  <p className="text-[#6B7280] mt-0.5">Ajusta los parámetros globales de la plataforma ByMe</p>
                </div>

                {[
                  {
                    section: 'General',
                    icon: Settings,
                    color: '#1E40AF',
                    fields: [
                      { label: 'Nombre de la plataforma', value: 'ByMe', type: 'text' },
                      { label: 'Ciudad principal', value: 'Popayán, Cauca, Colombia', type: 'text' },
                      { label: 'Correo de soporte', value: 'soporte@byme.co', type: 'email' },
                      { label: 'Teléfono de soporte', value: '+57 (602) 820 0000', type: 'tel' },
                    ],
                  },
                  {
                    section: 'Comisiones',
                    icon: DollarSign,
                    color: '#10B981',
                    fields: [
                      { label: 'Comisión por servicio (%)', value: '12', type: 'number' },
                      { label: 'Meses gratis para nuevos profesionales', value: '3', type: 'number' },
                      { label: 'Pago mínimo de profesional (COP)', value: '20000', type: 'number' },
                    ],
                  },
                  {
                    section: 'Notificaciones',
                    icon: Bell,
                    color: '#7C3AED',
                    toggles: [
                      { label: 'Notificaciones por correo', desc: 'Envía emails automáticos a usuarios', on: true },
                      { label: 'Notificaciones por SMS', desc: 'Alertas de reserva por mensaje de texto', on: false },
                      { label: 'Modo mantenimiento', desc: 'Desactiva temporalmente la plataforma', on: false },
                      { label: 'Registro abierto', desc: 'Permite nuevos registros de usuarios', on: true },
                    ],
                  },
                ].map((section, si) => (
                  <div key={si} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F3F4F6]">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${section.color}15` }}>
                        <section.icon className="w-4 h-4" style={{ color: section.color }} />
                      </div>
                      <h3 className="font-bold text-[#111827]">{section.section}</h3>
                    </div>
                    <div className="p-5">
                      {section.fields && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {section.fields.map((field, fi) => (
                            <div key={fi}>
                              <label className="block text-sm font-medium text-[#374151] mb-1.5">{field.label}</label>
                              <input
                                type={field.type}
                                defaultValue={field.value}
                                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {section.toggles && (
                        <div className="space-y-4">
                          {section.toggles.map((toggle, ti) => (
                            <ToggleRow key={ti} label={toggle.label} desc={toggle.desc} defaultOn={toggle.on} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] transition-colors">
                    <CheckCircle2 className="w-4 h-4" /> Guardar cambios
                  </button>
                  <button className="px-6 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-medium hover:bg-[#F9FAFB] transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[#111827]">{label}</p>
        <p className="text-xs text-[#9CA3AF] mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-[#1E40AF]' : 'bg-[#D1D5DB]'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}
