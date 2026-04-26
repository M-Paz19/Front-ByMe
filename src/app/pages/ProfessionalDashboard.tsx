import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  LayoutDashboard, Briefcase, Calendar, Settings, LogOut, Star,
  CheckCircle2, XCircle, AlertCircle, Clock, MapPin, ChevronRight,
  Plus, Edit3, Trash2, Save, Phone,
  Users, X
} from 'lucide-react';
import { professionals, proBookingRequests } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ProfessionalsService } from '../../services/professionals/professionals.service';
import type { ServiceDetailDTO } from '../../services/professionals/professionals.types';
import { GoogleMapPicker } from '../components/GoogleMapPicker';

type View = 'overview' | 'solicitudes' | 'servicios' | 'disponibilidad' | 'perfil';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HOURS = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

function getApiMsg(err: any): string {
  const data = err?.response?.data;
  if (!data) return err?.message || 'Ocurrió un error inesperado.';
  if (typeof data === 'string') return data;
  if (typeof data?.message === 'string') return data.message;
  if (typeof data?.error === 'string') return data.error;
  return 'Ocurrió un error inesperado.';
}

function ServiceModal(props: {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: Partial<ServiceDetailDTO>;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; estimatedDurationHours: number; basePrice: number }) => void;
}) {
  const { open, mode, initial, loading, onClose, onSubmit } = props;
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [estimatedDurationHours, setEstimatedDurationHours] = useState(
    typeof initial?.estimatedDurationHours === 'number' ? String(initial.estimatedDurationHours) : ''
  );
  const [basePrice, setBasePrice] = useState(
    typeof initial?.basePrice === 'number' ? String(initial.basePrice) : ''
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? '');
    setDescription(initial?.description ?? '');
    setEstimatedDurationHours(typeof initial?.estimatedDurationHours === 'number' ? String(initial.estimatedDurationHours) : '');
    setBasePrice(typeof initial?.basePrice === 'number' ? String(initial.basePrice) : '');
    setError(null);
  }, [open, initial]);

  if (!open) return null;

  const submit = () => {
    setError(null);
    const n = name.trim();
    const d = description.trim();
    const dur = Number(estimatedDurationHours);
    const price = Number(basePrice);

    if (n.length < 3) return setError('El nombre debe tener mínimo 3 caracteres.');
    if (d.length < 10) return setError('La descripción debe tener mínimo 10 caracteres.');
    if (!Number.isFinite(dur) || dur < 1) return setError('La duración debe ser un número entero (mínimo 1).');
    if (!Number.isFinite(price) || price < 0) return setError('El precio debe ser un número válido (mínimo 0).');

    onSubmit({ name: n, description: d, estimatedDurationHours: dur, basePrice: price });
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E5E7EB] shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
            <div>
              <h2 className="text-base font-bold text-[#111827]">
                {mode === 'create' ? 'Añadir servicio' : 'Editar servicio'}
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Completa los datos del servicio.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>

          <div className="px-5 py-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Nombre</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                placeholder="Ej: Reparación de tuberías"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] resize-none transition-all"
                placeholder="Describe el servicio (mínimo 10 caracteres)"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Duración (horas)</label>
                <input
                  value={estimatedDurationHours}
                  onChange={(e) => setEstimatedDurationHours(e.target.value)}
                  type="number"
                  min={1}
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Precio base (COP)</label>
                <input
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  type="number"
                  min={0}
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                  placeholder="25000"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 whitespace-pre-line">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-all"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-[#1E40AF] hover:bg-[#1D3FA0] text-white px-4 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

  const { logout, userName, userPhoto, user, updateProfile, authLoading, authError } = useApp() as any;
  const prof = professionals[0];

  // === Perfil ===
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // === Servicios (API) ===
  // El backend ahora devuelve el professionalId como user.id cuando el rol es PROFESSIONAL
  const professionalId = user?.id as string | undefined;

  const [services, setServices] = useState<ServiceDetailDTO[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceModalMode, setServiceModalMode] = useState<'create' | 'edit'>('create');
  const [editing, setEditing] = useState<ServiceDetailDTO | null>(null);
  const [savingService, setSavingService] = useState(false);

  const loadServices = async () => {
    if (!professionalId) {
      setServicesError('No se pudo determinar el profesionalId.');
      return;
    }
    setServicesLoading(true);
    setServicesError(null);
    try {
      const list = await ProfessionalsService.getServicesByProfessionalId(professionalId);
      setServices(list);
    } catch (e: any) {
      setServicesError(getApiMsg(e));
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    if (view !== 'servicios') return;
    void loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, professionalId]);

  const openCreate = () => {
    setEditing(null);
    setServiceModalMode('create');
    setServiceModalOpen(true);
  };

  const openEdit = (s: ServiceDetailDTO) => {
    setEditing(s);
    setServiceModalMode('edit');
    setServiceModalOpen(true);
  };

  const handleSaveService = async (data: { name: string; description: string; estimatedDurationHours: number; basePrice: number }) => {
    setSavingService(true);
    setServicesError(null);
    try {
      if (serviceModalMode === 'create') {
        const created = await ProfessionalsService.createService(data);
        setServices((prev) => [created, ...prev]);
      } else if (serviceModalMode === 'edit' && editing) {
        const updated = await ProfessionalsService.updateService(editing.id, data);
        setServices((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      }
      setServiceModalOpen(false);
    } catch (e: any) {
      setServicesError(getApiMsg(e));
    } finally {
      setSavingService(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    const ok = window.confirm('¿Seguro que deseas eliminar este servicio?');
    if (!ok) return;

    setServicesError(null);
    try {
      await ProfessionalsService.deleteService(serviceId);
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
    } catch (e: any) {
      setServicesError(getApiMsg(e));
    }
  };

  // === resto de lógica visual (mock) ===
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
      <ServiceModal
        open={serviceModalOpen}
        mode={serviceModalMode}
        initial={editing ?? undefined}
        loading={savingService}
        onClose={() => setServiceModalOpen(false)}
        onSubmit={handleSaveService}
      />

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
                onClick={async () => { await logout(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {view === 'overview' && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-[#111827]">Panel Profesional</h1>
                  <p className="text-[#6B7280] mt-1">Bienvenido, {(userName || prof.name).split(' ')[0]}</p>
                </div>

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

            {view === 'servicios' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-[#111827]">Mis servicios</h1>
                  <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Añadir servicio
                  </button>
                </div>

                {servicesError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 whitespace-pre-line">
                    {servicesError}
                  </div>
                )}

                <div className="space-y-3">
                  {servicesLoading ? (
                    <>
                      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 h-24" />
                      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 h-24" />
                      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 h-24" />
                    </>
                  ) : services.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
                      <p className="text-sm text-[#6B7280]">
                        Aún no tienes servicios. Haz clic en <span className="font-semibold">"Añadir servicio"</span>.
                      </p>
                    </div>
                  ) : (
                    services.map(service => (
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
                                <span className="text-xs text-[#9CA3AF]">{service.estimatedDurationHours} horas</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-[#1E40AF]">${Number(service.basePrice).toLocaleString()}</p>
                              <div className="flex gap-1.5 mt-1.5 justify-end">
                                <button
                                  onClick={() => openEdit(service)}
                                  className="p-1.5 text-[#6B7280] hover:text-[#1E40AF] hover:bg-[#EFF6FF] rounded-lg transition-colors"
                                  aria-label="Editar"
                                  type="button"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteService(service.id)}
                                  className="p-1.5 text-[#6B7280] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  aria-label="Eliminar"
                                  type="button"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={loadServices}
                    className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-all"
                    type="button"
                  >
                    Refrescar
                  </button>
                </div>
              </div>
            )}

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
                                  type="button"
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
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] transition-colors" type="button">
                  <Save className="w-4 h-4" /> Guardar disponibilidad
                </button>
              </div>
            )}

            {view === 'perfil' && (
              <div className="space-y-5">
                <h1 className="text-2xl font-bold text-[#111827]">Editar perfil profesional</h1>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#F3F4F6]">
                    <div className="relative">
                      <img src={userPhoto || prof.photo} alt={userName || prof.name} className="w-20 h-20 rounded-2xl object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#111827]">Foto de perfil</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">Puedes cambiarla desde <Link to="/perfil" className="text-[#1E40AF] hover:underline">Mi perfil</Link></p>
                    </div>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setProfileSuccess(null);
                      setProfileError(null);
                      const form = new FormData(e.currentTarget);
                      const firstName = String(form.get('firstName') || '').trim();
                      const lastName = String(form.get('lastName') || '').trim();
                      const phone = String(form.get('phone') || '').trim();
                      const address = String(form.get('address') || '').trim();
                      const ageRaw = String(form.get('age') || '').trim();

                      let age: number | undefined;
                      if (ageRaw) {
                        const n = Number(ageRaw);
                        if (Number.isNaN(n) || n < 18) {
                          setProfileError('La edad debe ser un número (mínimo 18).');
                          return;
                        }
                        age = n;
                      }

                      const payload: any = {};
                      if (firstName) payload.firstName = firstName;
                      if (lastName) payload.lastName = lastName;
                      if (phone) payload.phone = phone;
                      if (address) payload.address = address;
                      if (typeof age === 'number') payload.age = age;

                      if (Object.keys(payload).length === 0) {
                        setProfileError('No hay cambios para guardar.');
                        return;
                      }

                      try {
                        await updateProfile(payload);
                        setProfileSuccess('Perfil actualizado exitosamente.');
                      } catch (err: any) {
                        setProfileError(err?.response?.data?.message ?? 'Error actualizando perfil.');
                      }
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">Nombre</label>
                        <input
                          name="firstName"
                          type="text"
                          defaultValue={user?.firstName || ''}
                          className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">Apellido</label>
                        <input
                          name="lastName"
                          type="text"
                          defaultValue={user?.lastName || ''}
                          className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">Teléfono</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                          <input
                            name="phone"
                            type="tel"
                            defaultValue={user?.phone || ''}
                            className="w-full pl-9 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">Edad</label>
                        <input
                          name="age"
                          type="number"
                          min={18}
                          defaultValue={user?.age?.toString() || ''}
                          placeholder="28"
                          className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">Dirección de trabajo</label>
                        {/*
                          GoogleMapPicker renderiza internamente un <input type="hidden" name="address">
                          que el FormData del <form> de abajo leerá automáticamente,
                          manteniendo el comportamiento original del submit.
                        */}
                        <GoogleMapPicker defaultAddress={user?.address || ''} />
                      </div>
                    </div>

                    {(profileError || authError) && (
                      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                        {profileError || authError}
                      </div>
                    )}
                    {profileSuccess && (
                      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                        {profileSuccess}
                      </div>
                    )}

                    <div className="flex gap-3 mt-6 pt-5 border-t border-[#F3F4F6]">
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] transition-colors disabled:opacity-70"
                      >
                        {authLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <><Save className="w-4 h-4" /> Guardar cambios</>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setView('overview')}
                        className="px-5 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-medium hover:bg-[#F9FAFB] transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}