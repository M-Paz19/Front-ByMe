import React, { useState } from 'react';
import { Link } from 'react-router';
import {
  LayoutDashboard, Briefcase, Calendar, Settings, LogOut, Star,
  CheckCircle2, XCircle, AlertCircle, Clock, MapPin, ChevronRight,
  Plus, Edit3, Trash2, Save, Camera, Phone, Mail, DollarSign,
  TrendingUp, Users, Award
} from 'lucide-react';
import { professionals, proBookingRequests, IMGS } from '../data/mockData';
import { useApp } from '../context/AppContext';

type View = 'overview' | 'solicitudes' | 'servicios' | 'disponibilidad' | 'perfil';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HOURS = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

export function ProfessionalDashboard() {
  const [view, setView] = useState<View>('overview');
  const [requests, setRequests] = useState(proBookingRequests);
  const [availability, setAvailability] = useState<Record<string, string[]>>({
    Lunes: ['8:00 AM', '9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'],
    Martes: ['8:00 AM', '9:00 AM', '10:00 AM'],
    Miércoles: ['9:00 AM', '10:00 AM', '11:00 AM', '3:00 PM'],
    Jueves: ['8:00 AM', '9:00 AM'],
    Viernes: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    Sábado: ['9:00 AM', '10:00 AM'],
  });

  const { logout, userName, userPhoto } = useApp();
  const prof = professionals[0];

  const handleStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const toggleSlot = (day: string, hour: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].includes(hour)
        ? prev[day].filter(h => h !== hour)
        : [...prev[day], hour],
    }));
  };

  const STATUS_CONFIG = {
    pending: { label: 'Pendiente', icon: AlertCircle, color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]' },
    confirmed: { label: 'Confirmado', icon: CheckCircle2, color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]' },
    completed: { label: 'Completado', icon: CheckCircle2, color: 'text-[#6B7280]', bg: 'bg-[#F3F4F6]' },
    cancelled: { label: 'Cancelado', icon: XCircle, color: 'text-[#EF4444]', bg: 'bg-[#FEF2F2]' },
  };

  const NAV_ITEMS = [
    { key: 'overview', icon: LayoutDashboard, label: 'Mi panel' },
    { key: 'solicitudes', icon: Calendar, label: `Solicitudes (${requests.filter(r => r.status === 'pending').length})` },
    { key: 'servicios', icon: Briefcase, label: 'Mis servicios' },
    { key: 'disponibilidad', icon: Clock, label: 'Disponibilidad' },
    { key: 'perfil', icon: Settings, label: 'Editar perfil' },
  ] as { key: View; icon: any; label: string }[];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 mb-4">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <img src={userPhoto || prof.photo} alt={userName || prof.name} className="w-16 h-16 rounded-2xl object-cover" />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${prof.available ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
                </div>
                <p className="font-bold text-[#111827] text-sm">{userName || prof.name}</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">{prof.specialty}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-medium text-[#374151]">{prof.rating}</span>
                  <span className="text-xs text-[#9CA3AF]">({prof.reviewCount})</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.key}
                  onClick={() => setView(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    view === item.key
                      ? 'bg-[#EFF6FF] text-[#1E40AF] font-medium border-r-2 border-[#1E40AF]'
                      : 'text-[#374151] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={async () => {
                  await logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {/* OVERVIEW */}
            {view === 'overview' && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-[#111827]">Panel Profesional</h1>
                  <p className="text-[#6B7280] mt-1">Bienvenido, {(userName || prof.name).split(' ')[0]}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Solicitudes pendientes', value: requests.filter(r => r.status === 'pending').length, icon: AlertCircle, color: '#D97706', bg: '#FFFBEB' },
                    { label: 'Trabajos completados', value: prof.completedJobs, icon: CheckCircle2, color: '#10B981', bg: '#ECFDF5' },
                    { label: 'Calificación', value: prof.rating, icon: Star, color: '#F59E0B', bg: '#FFFBEB' },
                    { label: 'Clientes atendidos', value: 89, icon: Users, color: '#1E40AF', bg: '#EFF6FF' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                          <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-[#111827]">{stat.value}</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent requests */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB]">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
                    <h2 className="font-bold text-[#111827]">Solicitudes recientes</h2>
                    <button onClick={() => setView('solicitudes')} className="text-sm text-[#1E40AF] hover:underline flex items-center gap-1">
                      Ver todas <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="divide-y divide-[#F3F4F6]">
                    {requests.slice(0, 2).map(req => {
                      const status = STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG];
                      const StatusIcon = status.icon;
                      return (
                        <div key={req.id} className="p-5 flex items-start gap-4">
                          <img src={req.clientPhoto} alt={req.clientName} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-medium text-[#111827] text-sm">{req.clientName}</p>
                                <p className="text-xs text-[#6B7280]">{req.service}</p>
                              </div>
                              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${status.color} ${status.bg}`}>
                                <StatusIcon className="w-2.5 h-2.5" /> {status.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-xs text-[#9CA3AF] flex items-center gap-1"><Calendar className="w-3 h-3" /> {req.date}</span>
                              <span className="text-xs text-[#9CA3AF] flex items-center gap-1"><Clock className="w-3 h-3" /> {req.time}</span>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-[#1E40AF] flex-shrink-0">${req.price.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Gestionar servicios', desc: 'Añade o edita tus servicios', icon: Briefcase, action: () => setView('servicios'), color: '#1E40AF', bg: '#EFF6FF' },
                    { label: 'Disponibilidad', desc: 'Configura tu horario', icon: Clock, action: () => setView('disponibilidad'), color: '#10B981', bg: '#ECFDF5' },
                    { label: 'Editar perfil', desc: 'Actualiza tu información', icon: Edit3, action: () => setView('perfil'), color: '#7C3AED', bg: '#F5F3FF' },
                  ].map((item, i) => (
                    <button key={i} onClick={item.action} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-[#E5E7EB] hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.bg }}>
                        <item.icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                        <p className="text-xs text-[#9CA3AF]">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SOLICITUDES */}
            {view === 'solicitudes' && (
              <div className="space-y-5">
                <h1 className="text-2xl font-bold text-[#111827]">Solicitudes de reserva</h1>
                <div className="space-y-4">
                  {requests.map(req => {
                    const status = STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG];
                    const StatusIcon = status.icon;
                    return (
                      <div key={req.id} className={`bg-white rounded-2xl border ${req.status === 'pending' ? 'border-[#FCD34D]' : 'border-[#E5E7EB]'} p-5 shadow-sm`}>
                        <div className="flex items-start gap-4 flex-wrap">
                          <img src={req.clientPhoto} alt={req.clientName} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div>
                                <p className="font-semibold text-[#111827]">{req.clientName}</p>
                                <p className="text-sm text-[#6B7280]">Solicita: <span className="font-medium text-[#374151]">{req.service}</span></p>
                              </div>
                              <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${status.color} ${status.bg}`}>
                                <StatusIcon className="w-3 h-3" /> {status.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                              <span className="text-sm text-[#6B7280] flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {req.date}</span>
                              <span className="text-sm text-[#6B7280] flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {req.time}</span>
                              <span className="text-sm text-[#6B7280] flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {req.address}</span>
                            </div>
                            {req.notes && (
                              <div className="mt-2 p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                                <p className="text-xs text-[#6B7280]">📝 {req.notes}</p>
                              </div>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-lg font-bold text-[#1E40AF]">${req.price.toLocaleString()}</p>
                          </div>
                        </div>
                        {req.status === 'pending' && (
                          <div className="flex gap-2 mt-4 pt-4 border-t border-[#F3F4F6]">
                            <button
                              onClick={() => handleStatus(req.id, 'confirmed')}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#10B981] text-white rounded-xl text-sm font-semibold hover:bg-[#0EA875] transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Aceptar
                            </button>
                            <button
                              onClick={() => handleStatus(req.id, 'cancelled')}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#E5E7EB] text-[#EF4444] rounded-xl text-sm font-medium hover:bg-[#FEF2F2] transition-colors"
                            >
                              <XCircle className="w-4 h-4" /> Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SERVICIOS */}
            {view === 'servicios' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-[#111827]">Mis servicios</h1>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] transition-colors">
                    <Plus className="w-4 h-4" /> Añadir servicio
                  </button>
                </div>
                <div className="space-y-3">
                  {prof.services.map(service => (
                    <div key={service.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-[#1E40AF]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-[#111827]">{service.name}</p>
                            <p className="text-sm text-[#6B7280] mt-0.5">{service.description}</p>
                            <div className="flex items-center gap-1 mt-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
                              <span className="text-xs text-[#9CA3AF]">{service.duration}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-[#1E40AF]">${service.price.toLocaleString()}</p>
                            <div className="flex gap-1.5 mt-1.5">
                              <button className="p-1.5 text-[#6B7280] hover:text-[#1E40AF] hover:bg-[#EFF6FF] rounded-lg transition-colors">
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 text-[#6B7280] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DISPONIBILIDAD */}
            {view === 'disponibilidad' && (
              <div className="space-y-5">
                <h1 className="text-2xl font-bold text-[#111827]">Configurar disponibilidad</h1>
                <p className="text-[#6B7280]">Selecciona los horarios en que estás disponible para trabajar</p>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 overflow-x-auto">
                  <div className="min-w-[600px]">
                    <div className="grid gap-4">
                      {DAYS.map(day => (
                        <div key={day} className="flex items-center gap-4">
                          <div className="w-24 flex-shrink-0">
                            <p className="text-sm font-medium text-[#374151]">{day}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {HOURS.map(hour => {
                              const active = availability[day]?.includes(hour);
                              return (
                                <button
                                  key={hour}
                                  onClick={() => toggleSlot(day, hour)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                                    active
                                      ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                                      : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#1E40AF]/30'
                                  }`}
                                >
                                  {hour}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] transition-colors">
                  <Save className="w-4 h-4" /> Guardar disponibilidad
                </button>
              </div>
            )}

            {/* PERFIL */}
            {view === 'perfil' && (
              <div className="space-y-5">
                <h1 className="text-2xl font-bold text-[#111827]">Editar perfil profesional</h1>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                  {/* Photo */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#F3F4F6]">
                    <div className="relative">
                      <img src={userPhoto || prof.photo} alt={userName || prof.name} className="w-20 h-20 rounded-2xl object-cover" />
                      <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#1E40AF] rounded-full flex items-center justify-center shadow">
                        <Camera className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#111827]">Foto de perfil</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">Recomendado: 400x400px</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Nombre', value: prof.name.split(' ')[0], icon: null },
                      { label: 'Apellido', value: prof.name.split(' ')[1] || '', icon: null },
                      { label: 'Teléfono', value: prof.phone, icon: Phone },
                      { label: 'Correo', value: prof.email, icon: Mail },
                    ].map((field, i) => (
                      <div key={i}>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">{field.label}</label>
                        <input
                          type="text"
                          defaultValue={field.value}
                          className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">Descripción profesional</label>
                      <textarea
                        rows={3}
                        defaultValue={prof.description}
                        className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] resize-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">Tarifa por hora (COP)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                        <input
                          type="number"
                          defaultValue={prof.hourlyRate}
                          className="w-full pl-9 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">Dirección de trabajo</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                        <input
                          type="text"
                          defaultValue={prof.address}
                          className="w-full pl-9 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6 pt-5 border-t border-[#F3F4F6]">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] transition-colors">
                      <Save className="w-4 h-4" /> Guardar cambios
                    </button>
                    <button className="px-5 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-medium hover:bg-[#F9FAFB] transition-colors">
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
