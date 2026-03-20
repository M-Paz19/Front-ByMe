import React, { useState } from 'react';
import {
  Calendar, Clock, Star, User, Edit3, Bell, ChevronRight,
  CheckCircle2, XCircle, AlertCircle, MapPin, Phone, Mail,
  Shield, Camera, Save, LogOut, LayoutDashboard, History, Settings
} from 'lucide-react';
import { userBookings, IMGS } from '../data/mockData';
import { StarRating } from '../components/StarRating';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router';

type View = 'overview' | 'history' | 'profile';


const STATUS_CONFIG = {
  confirmed: { label: 'Confirmado', icon: CheckCircle2, color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]', border: 'border-[#A7F3D0]' },
  pending: { label: 'Pendiente', icon: AlertCircle, color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]', border: 'border-[#FCD34D]' },
  completed: { label: 'Completado', icon: CheckCircle2, color: 'text-[#6B7280]', bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]' },
  cancelled: { label: 'Cancelado', icon: XCircle, color: 'text-[#EF4444]', bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]' },
};

export function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [view, setView] = useState<View>('overview');
  const [reviewModalOpen, setReviewModalOpen] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const { logout, userName, userPhoto } = useApp();

  const upcoming = userBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const history = userBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 mb-4">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <img src={userPhoto || IMGS.man2} alt={userName} className="w-16 h-16 rounded-2xl object-cover" />
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#1E40AF] rounded-full flex items-center justify-center">
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                </div>
                <p className="font-bold text-[#111827] text-sm">{userName || 'Felipe Arango'}</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Usuario verificado</p>
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="w-3 h-3 text-[#10B981]" />
                  <span className="text-xs text-[#10B981]">Cuenta activa</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
              {([
                { key: 'overview', icon: LayoutDashboard, label: 'Mi panel' },
                { key: 'history', icon: History, label: 'Historial' },
                { key: 'profile', icon: Settings, label: 'Mi perfil' },
              ] as { key: View; icon: any; label: string }[]).map(item => (
                <button
                  key={item.key}
                  onClick={() => {
                    if (item.key === 'profile') {
                      navigate('/perfil');
                      return;
                    }
                    setView(item.key);
                  }}
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

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* OVERVIEW */}
            {view === 'overview' && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-[#111827]">Bienvenido, {(userName || 'Felipe').split(' ')[0]} 👋</h1>
                  <p className="text-[#6B7280] mt-1">Aquí tienes un resumen de tu actividad</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Reservas activas', value: upcoming.length, color: '#1E40AF', bg: '#EFF6FF' },
                    { label: 'Completadas', value: history.filter(b => b.status === 'completed').length, color: '#10B981', bg: '#ECFDF5' },
                    { label: 'Profesionales', value: 3, color: '#7C3AED', bg: '#F5F3FF' },
                    { label: 'Reseñas dadas', value: 2, color: '#D97706', bg: '#FFFBEB' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
                      <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Upcoming bookings */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB]">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
                    <h2 className="font-bold text-[#111827]">Próximas reservas</h2>
                    <button onClick={() => setView('history')} className="text-sm text-[#1E40AF] hover:underline flex items-center gap-1">
                      Ver todas <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {upcoming.length === 0 ? (
                    <div className="text-center py-10">
                      <Calendar className="w-10 h-10 text-[#D1D5DB] mx-auto mb-2" />
                      <p className="text-[#6B7280] text-sm">No tienes reservas próximas</p>
                      <Link to="/buscar" className="text-sm text-[#1E40AF] hover:underline mt-1 block">Buscar profesionales</Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#F3F4F6]">
                      {upcoming.map(booking => {
                        const status = STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG];
                        const StatusIcon = status.icon;
                        return (
                          <div key={booking.id} className="p-5 flex items-start gap-4">
                            <img src={booking.professionalPhoto} alt={booking.professionalName} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-semibold text-[#111827]">{booking.professionalName}</p>
                                  <p className="text-sm text-[#6B7280]">{booking.specialty} · {booking.service}</p>
                                </div>
                                <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${status.color} ${status.bg} ${status.border} flex-shrink-0`}>
                                  <StatusIcon className="w-3 h-3" /> {status.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 mt-2 flex-wrap">
                                <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                                  <Calendar className="w-3.5 h-3.5" /> {booking.date}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                                  <Clock className="w-3.5 h-3.5" /> {booking.time}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                                  <MapPin className="w-3.5 h-3.5" /> {booking.address}
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-[#111827]">${booking.price.toLocaleString()}</p>
                              {booking.status === 'confirmed' && (
                                <button className="text-xs text-red-500 hover:underline mt-1 block">Cancelar</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link to="/buscar" className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-[#E5E7EB] hover:border-[#1E40AF]/30 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center group-hover:bg-[#1E40AF] transition-colors">
                      <MapPin className="w-5 h-5 text-[#1E40AF] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#111827]">Buscar servicios</p>
                      <p className="text-xs text-[#9CA3AF]">Encuentra profesionales cerca</p>
                    </div>
                    <ChevronRight className="ml-auto w-4 h-4 text-[#9CA3AF]" />
                  </Link>
                  <button onClick={() => setView('profile')} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-[#E5E7EB] hover:border-[#1E40AF]/30 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center group-hover:bg-[#1E40AF] transition-colors">
                      <User className="w-5 h-5 text-[#1E40AF] group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-[#111827]">Editar perfil</p>
                      <p className="text-xs text-[#9CA3AF]">Actualiza tu información</p>
                    </div>
                    <ChevronRight className="ml-auto w-4 h-4 text-[#9CA3AF]" />
                  </button>
                </div>
              </div>
            )}

            {/* HISTORY */}
            {view === 'history' && (
              <div className="space-y-5">
                <h1 className="text-2xl font-bold text-[#111827]">Historial de reservas</h1>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] divide-y divide-[#F3F4F6]">
                  {userBookings.map(booking => {
                    const status = STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG];
                    const StatusIcon = status.icon;
                    return (
                      <div key={booking.id} className="p-5 flex items-start gap-4">
                        <img src={booking.professionalPhoto} alt={booking.professionalName} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <p className="font-semibold text-[#111827]">{booking.professionalName}</p>
                              <p className="text-sm text-[#6B7280]">{booking.specialty} · {booking.service}</p>
                              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                                  <Calendar className="w-3 h-3" /> {booking.date}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                                  <Clock className="w-3 h-3" /> {booking.time}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${status.color} ${status.bg} ${status.border}`}>
                                <StatusIcon className="w-3 h-3" /> {status.label}
                              </span>
                              <p className="font-bold text-[#111827]">${booking.price.toLocaleString()}</p>
                            </div>
                          </div>
                          {booking.status === 'completed' && !booking.reviewed && (
                            <button
                              onClick={() => setReviewModalOpen(booking.id)}
                              className="mt-3 flex items-center gap-1.5 text-sm text-[#1E40AF] bg-[#EFF6FF] px-3 py-1.5 rounded-lg hover:bg-[#DBEAFE] transition-colors"
                            >
                              <Star className="w-3.5 h-3.5" /> Dejar reseña
                            </button>
                          )}
                          {booking.reviewed && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-[#10B981]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Reseña enviada
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PROFILE */}
            {view === 'profile' && (
              <div className="space-y-5">
                <h1 className="text-2xl font-bold text-[#111827]">Mi perfil</h1>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#F3F4F6]">
                    <div className="relative">
                      <img src={userPhoto || IMGS.man2} alt={userName} className="w-20 h-20 rounded-2xl object-cover" />
                      <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#1E40AF] rounded-full flex items-center justify-center shadow">
                        <Camera className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#111827]">{userName || 'Felipe Arango'}</h3>
                      <p className="text-sm text-[#9CA3AF]">Miembro desde Enero 2025</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Nombre', defaultValue: 'Felipe', icon: User },
                      { label: 'Apellido', defaultValue: 'Arango', icon: User },
                      { label: 'Correo electrónico', defaultValue: 'felipe@email.com', icon: Mail },
                      { label: 'Teléfono', defaultValue: '+57 310 123 4567', icon: Phone },
                    ].map((field, i) => (
                      <div key={i}>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">{field.label}</label>
                        <div className="relative">
                          <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                          <input
                            type="text"
                            defaultValue={field.defaultValue}
                            className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">Dirección habitual</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                        <input
                          type="text"
                          defaultValue="Cra 5 #8-45, Centro, Popayán"
                          className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
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

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="font-bold text-[#111827] text-lg mb-1">Deja tu reseña</h3>
            <p className="text-sm text-[#6B7280] mb-5">Comparte tu experiencia con este profesional</p>
            <div className="flex items-center justify-center gap-2 mb-5">
              <StarRating rating={reviewRating} size="md" interactive onRate={setReviewRating} showNumber={false} />
              <span className="text-[#374151] font-medium">{reviewRating}/5</span>
            </div>
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              rows={3}
              placeholder="Describe tu experiencia con este profesional..."
              className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setReviewModalOpen(null)} className="flex-1 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-medium hover:bg-[#F9FAFB]">
                Cancelar
              </button>
              <button
                onClick={() => setReviewModalOpen(null)}
                disabled={!reviewComment.trim()}
                className="flex-1 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] disabled:opacity-50"
              >
                Enviar reseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
