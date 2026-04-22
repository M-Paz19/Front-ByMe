import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Calendar, Clock, Star, User, ChevronRight,
  CheckCircle2, XCircle, AlertCircle, MapPin,
  Shield, Camera, LogOut, LayoutDashboard, History, Settings,
  Briefcase, Search, Sparkles, X
} from 'lucide-react';
import { userBookings, IMGS } from '../data/mockData';
import { StarRating } from '../components/StarRating';
import { useApp } from '../context/AppContext';
import { ProfessionalsService } from '../../services/professionals/professionals.service';
import type { ProfessionName } from '../../services/professionals/professionals.types';

type View = 'overview' | 'history';

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmado', icon: CheckCircle2, color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]', border: 'border-[#A7F3D0]' },
  pending: { label: 'Pendiente', icon: AlertCircle, color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]', border: 'border-[#FCD34D]' },
  completed: { label: 'Completado', icon: CheckCircle2, color: 'text-[#6B7280]', bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]' },
  cancelled: { label: 'Cancelado', icon: XCircle, color: 'text-[#EF4444]', bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]' },
};

function getApiMsg(err: any): string {
  const data = err?.response?.data;
  if (!data) return err?.message || 'Ocurrió un error inesperado.';
  if (typeof data === 'string') return data;
  if (typeof data?.message === 'string') return data.message;
  if (typeof data?.error === 'string') return data.error;
  return 'Ocurrió un error inesperado.';
}

function BecomeProModal(props: {
  open: boolean;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  professions: ProfessionName[];
  query: string;
  selectedId: string;
  onChangeQuery: (v: string) => void;
  onSelect: (id: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const {
    open, loading, saving, error, success,
    professions, query, selectedId,
    onChangeQuery, onSelect, onClose, onSubmit
  } = props;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return professions;
    return professions.filter(p => p.name.toLowerCase().includes(q));
  }, [professions, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E5E7EB]">
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#E5E7EB]">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#ECFDF5] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <Briefcase className="w-3.5 h-3.5" /> Perfil Profesional
            </div>
            <h3 className="font-bold text-[#111827] text-lg">Únete como profesional</h3>
            <p className="text-sm text-[#6B7280] mt-1">
              Selecciona tu profesión para activar tu perfil profesional.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
            type="button"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
              Buscar profesión
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => onChangeQuery(e.target.value)}
                type="text"
                placeholder="Ej: Plomero, Electricista, Carpintero..."
                className="w-full pl-9 pr-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
              />
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Mostrando {filtered.length} de {professions.length}
            </p>
          </div>

          <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-3">
                <div className="h-10 bg-[#F3F4F6] rounded-xl" />
                <div className="h-10 bg-[#F3F4F6] rounded-xl" />
                <div className="h-10 bg-[#F3F4F6] rounded-xl" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-sm text-[#6B7280]">
                No hay resultados para <span className="font-semibold">"{query}"</span>.
              </div>
            ) : (
              <ul className="max-h-72 overflow-auto">
                {filtered.map((p) => {
                  const active = p.id === selectedId;
                  return (
                    <li key={p.id} className="border-b border-[#E5E7EB] last:border-b-0">
                      <button
                        type="button"
                        onClick={() => onSelect(p.id)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                          active ? 'bg-[#EFF6FF]' : 'hover:bg-[#F9FAFB]'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#111827] truncate">
                            {p.name}
                          </div>
                          <div className="text-xs text-[#9CA3AF] truncate">{p.id}</div>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                            active ? 'border-[#1E40AF] bg-[#1E40AF]' : 'border-[#D1D5DB] bg-white'
                          }`}
                        >
                          {active ? <CheckCircle2 className="w-4 h-4 text-white" /> : null}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 whitespace-pre-line">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-medium hover:bg-[#F9FAFB] transition-colors"
              type="button"
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              onClick={onSubmit}
              disabled={saving || loading || !selectedId}
              className="flex-1 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              type="button"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Activar perfil
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserDashboard() {
  const navigate = useNavigate();

  const [view, setView] = useState<View>('overview');
  const [reviewModalOpen, setReviewModalOpen] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const { logout, userName, userPhoto, becomeProfessional } = useApp();

  // Modal "Únete como profesional"
  const [becomeProOpen, setBecomeProOpen] = useState(false);
  const [professions, setProfessions] = useState<ProfessionName[]>([]);
  const [proQuery, setProQuery] = useState('');
  const [selectedProfessionId, setSelectedProfessionId] = useState('');
  const [proLoading, setProLoading] = useState(false);
  const [proSaving, setProSaving] = useState(false);
  const [proError, setProError] = useState<string | null>(null);
  const [proSuccess, setProSuccess] = useState<string | null>(null);

  const upcoming = userBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const history = userBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const openBecomePro = async () => {
    setProError(null);
    setProSuccess(null);
    setBecomeProOpen(true);

    if (professions.length > 0) return;

    setProLoading(true);
    try {
      const list = await ProfessionalsService.getProfessionsNames();
      setProfessions(list);
      if (list.length && !selectedProfessionId) setSelectedProfessionId(list[0].id);
    } catch (e: any) {
      setProError(getApiMsg(e));
    } finally {
      setProLoading(false);
    }
  };

  const submitBecomePro = async () => {
    setProError(null);
    setProSuccess(null);

    if (!selectedProfessionId) {
      setProError('Selecciona una profesión para continuar.');
      return;
    }

    setProSaving(true);
    try {
      // becomeProfessional del contexto:
      // - hace POST /professionals
      // - actualiza el token con el nuevo que incluye rol PROFESSIONAL
      // - cambia role a 'profesional' en el contexto
      await becomeProfessional(selectedProfessionId);

      setProSuccess('Perfil profesional activado. Redirigiendo...');

      setTimeout(() => {
        setBecomeProOpen(false);
        navigate('/panel/profesional');
      }, 600);
    } catch (e: any) {
      setProError(getApiMsg(e));
    } finally {
      setProSaving(false);
    }
  };

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
                  <button
                    onClick={() => navigate('/perfil')}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#1E40AF] rounded-full flex items-center justify-center"
                    type="button"
                    aria-label="Cambiar foto"
                  >
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
              ] as { key: View; icon: any; label: string }[]).map(item => (
                <button
                  key={item.key}
                  onClick={() => setView(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    view === item.key
                      ? 'bg-[#EFF6FF] text-[#1E40AF] font-medium border-r-2 border-[#1E40AF]'
                      : 'text-[#374151] hover:bg-[#F9FAFB]'
                  }`}
                  type="button"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => navigate('/perfil')}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors"
                type="button"
              >
                <Settings className="w-4 h-4" />
                Mi perfil
              </button>
              <button
                onClick={async () => {
                  await logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                type="button"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {view === 'overview' && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-[#111827]">Bienvenido, {(userName || 'Felipe').split(' ')[0]} 👋</h1>
                  <p className="text-[#6B7280] mt-1">Aquí tienes un resumen de tu actividad</p>
                </div>

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

                <div className="bg-white rounded-2xl border border-[#E5E7EB]">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
                    <h2 className="font-bold text-[#111827]">Próximas reservas</h2>
                    <button onClick={() => setView('history')} className="text-sm text-[#1E40AF] hover:underline flex items-center gap-1" type="button">
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
                                <button className="text-xs text-red-500 hover:underline mt-1 block" type="button">Cancelar</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

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

                  <Link to="/perfil" className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-[#E5E7EB] hover:border-[#1E40AF]/30 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center group-hover:bg-[#1E40AF] transition-colors">
                      <User className="w-5 h-5 text-[#1E40AF] group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-[#111827]">Editar perfil</p>
                      <p className="text-xs text-[#9CA3AF]">Actualiza tu información</p>
                    </div>
                    <ChevronRight className="ml-auto w-4 h-4 text-[#9CA3AF]" />
                  </Link>

                  <button
                    onClick={openBecomePro}
                    className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-[#E5E7EB] hover:border-[#10B981]/30 hover:shadow-md transition-all group sm:col-span-2"
                    type="button"
                  >
                    <div className="w-10 h-10 bg-[#ECFDF5] rounded-xl flex items-center justify-center group-hover:bg-[#10B981] transition-colors">
                      <Briefcase className="w-5 h-5 text-[#10B981] group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-[#111827]">Únete como profesional</p>
                      <p className="text-xs text-[#9CA3AF]">Activa tu perfil y publica servicios</p>
                    </div>
                    <ChevronRight className="ml-auto w-4 h-4 text-[#9CA3AF]" />
                  </button>
                </div>
              </div>
            )}

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
                              type="button"
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
          </main>
        </div>
      </div>

      <BecomeProModal
        open={becomeProOpen}
        loading={proLoading}
        saving={proSaving}
        error={proError}
        success={proSuccess}
        professions={professions}
        query={proQuery}
        selectedId={selectedProfessionId}
        onChangeQuery={setProQuery}
        onSelect={setSelectedProfessionId}
        onClose={() => setBecomeProOpen(false)}
        onSubmit={submitBecomePro}
      />

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
              <button onClick={() => setReviewModalOpen(null)} className="flex-1 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-medium hover:bg-[#F9FAFB]" type="button">
                Cancelar
              </button>
              <button
                onClick={() => setReviewModalOpen(null)}
                disabled={!reviewComment.trim()}
                className="flex-1 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] disabled:opacity-50"
                type="button"
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