import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ChevronLeft, ChevronRight, Calendar, Clock, MapPin, CheckCircle2,
  FileText, Star, Shield, Briefcase, Sun, Moon
} from 'lucide-react';
import { professionals } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ProfessionalsService } from '../../services/professionals/professionals.service';
import { ServiceRequestsService } from '../../services/requests/requests.service';
import type { ServiceDetailDTO } from '../../services/professionals/professionals.types';
import type { Workday, ServiceRequestDTO } from '../../services/requests/requests.types';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Coordenadas por defecto (Popayán centro) — se reemplazarán cuando tengamos el mapa
const DEFAULT_LAT = 2.4419;
const DEFAULT_LNG = -76.6065;

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function getApiMsg(err: any): string {
  const data = err?.response?.data;
  if (!data) return err?.message || 'Ocurrió un error inesperado.';
  if (typeof data === 'string') return data;
  if (data.fieldErrors && typeof data.fieldErrors === 'object') {
    const msgs = Object.values(data.fieldErrors).filter(Boolean).join('\n');
    if (msgs) return msgs;
  }
  if (typeof data?.message === 'string') return data.message;
  if (typeof data?.error === 'string') return data.error;
  return 'Ocurrió un error inesperado.';
}

export function BookingPage() {
  const { id: professionalIdFromRoute } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useApp();

  // Fallback visual (nombre/foto del profesional) — mientras no exista GET /professionals/{id}
  const profMock = professionals.find(p => p.id === professionalIdFromRoute) || professionals[0];

  // === State ===
  const today = new Date();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: servicio
  const [services, setServices] = useState<ServiceDetailDTO[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceDetailDTO | null>(null);

  // Step 2: fecha + jornada
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<{ y: number; m: number; d: number } | null>(null);
  const [workday, setWorkday] = useState<Workday | null>(null);

  // Step 4: envío
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdRequest, setCreatedRequest] = useState<ServiceRequestDTO | null>(null);

  // Redirigir si no ha iniciado sesión
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/reservar/${professionalIdFromRoute}` } });
    }
  }, [isLoggedIn, navigate, professionalIdFromRoute]);

  // Cargar servicios del profesional al montar
  useEffect(() => {
    if (!professionalIdFromRoute) return;

    // Si el id de la ruta no parece UUID, es un mock — usa los servicios mock
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(professionalIdFromRoute);
    if (!isUuid) {
      // Mapear servicios mock al formato ServiceDetailDTO
      const mockServices: ServiceDetailDTO[] = profMock.services.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.duration || '',
        basePrice: s.price,
        estimatedDurationHours: 1,
        professionalId: profMock.id,
      }));
      setServices(mockServices);
      if (mockServices.length > 0) setSelectedService(mockServices[0]);
      return;
    }

    setServicesLoading(true);
    setServicesError(null);
    ProfessionalsService.getServicesByProfessionalId(professionalIdFromRoute)
      .then((list) => {
        setServices(list);
        if (list.length > 0) setSelectedService(list[0]);
      })
      .catch((e) => setServicesError(getApiMsg(e)))
      .finally(() => setServicesLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professionalIdFromRoute]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDay }, (_, i) => i);

  const canNext = () => {
    if (step === 1) return selectedService !== null;
    if (step === 2) return selectedDate !== null && workday !== null;
    if (step === 3) return selectedService !== null && selectedDate !== null && workday !== null;
    return false;
  };

  const formattedDate = selectedDate
    ? `${selectedDate.d} de ${MONTHS[selectedDate.m]} de ${selectedDate.y}`
    : '';

  const scheduledDateISO = selectedDate
    ? `${selectedDate.y}-${pad2(selectedDate.m + 1)}-${pad2(selectedDate.d)}`
    : '';

  const handleConfirm = async () => {
    if (!selectedService || !selectedDate || !workday || !professionalIdFromRoute) return;

    // Validar que el profesionalId del servicio sea un UUID real (no mock)
    const proId = selectedService.professionalId || professionalIdFromRoute;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(proId);
    if (!isUuid) {
      setSubmitError('No se puede reservar con un profesional de demostración. Selecciona uno real desde la búsqueda.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const created = await ServiceRequestsService.create({
        professionalId: proId,
        serviceId: selectedService.id,
        scheduledDate: scheduledDateISO,
        workday,
        latitude: DEFAULT_LAT,
        longitude: DEFAULT_LNG,
        serviceName: selectedService.name,
        servicePrice: Number(selectedService.basePrice),
      });

      setCreatedRequest(created);
      setStep(4);
    } catch (e: any) {
      setSubmitError(getApiMsg(e));
    } finally {
      setSubmitting(false);
    }
  };

  const STEPS = [
    { n: 1, label: 'Servicio' },
    { n: 2, label: 'Fecha' },
    { n: 3, label: 'Confirmar' },
    { n: 4, label: 'Listo' },
  ];

  // === VISTA: éxito ===
  if (step === 4 && createdRequest) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] pt-16 flex items-center justify-center p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-[#ECFDF5] text-[#10B981] text-sm font-semibold px-3 py-1 rounded-full mb-4">
            ¡Solicitud enviada!
          </div>
          <h2 className="text-2xl font-bold text-[#111827] mb-2">Tu solicitud está pendiente</h2>
          <p className="text-[#6B7280] mb-6">
            El profesional recibirá tu solicitud y propondrá un horario específico. Cuando lo acepte podrás confirmar la reserva desde tu panel.
          </p>

          <div className="bg-[#F9FAFB] rounded-2xl p-5 text-left mb-6 border border-[#E5E7EB]">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#E5E7EB]">
              <img src={profMock.photo} alt={profMock.name} className="w-11 h-11 rounded-xl object-cover" />
              <div>
                <p className="font-semibold text-[#111827]">{profMock.name}</p>
                <p className="text-sm text-[#6B7280]">{profMock.specialty}</p>
              </div>
            </div>
            {[
              { icon: Briefcase, label: 'Servicio', value: createdRequest.serviceName || selectedService?.name || '' },
              { icon: Calendar, label: 'Fecha', value: formattedDate },
              { icon: Clock, label: 'Jornada', value: createdRequest.workday },
              { icon: FileText, label: 'Estado', value: createdRequest.status },
              { icon: MapPin, label: 'Precio', value: createdRequest.servicePrice ? `$${Number(createdRequest.servicePrice).toLocaleString()} COP` : '—' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                <item.icon className="w-4 h-4 text-[#1E40AF] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#9CA3AF]">{item.label}</p>
                  <p className="text-sm font-medium text-[#111827]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/panel/usuario"
              className="w-full py-3 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] transition-colors"
            >
              Ver mis solicitudes
            </Link>
            <Link
              to="/"
              className="w-full py-3 border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-medium hover:bg-[#F9FAFB] transition-colors"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // === VISTA: stepper ===
  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[#6B7280] hover:text-[#111827] text-sm mb-6 transition-colors"
          type="button"
        >
          <ChevronLeft className="w-4 h-4" /> Volver al perfil
        </button>

        <h1 className="text-2xl font-bold text-[#111827] mb-6">Solicitar servicio</h1>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-2xl border border-[#E5E7EB] p-4">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > s.n ? 'bg-[#10B981] text-white' :
                  step === s.n ? 'bg-[#1E40AF] text-white' :
                  'bg-[#F3F4F6] text-[#9CA3AF]'
                }`}>
                  {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === s.n ? 'text-[#1E40AF]' : 'text-[#9CA3AF]'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > s.n ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Main */}
          <div className="md:col-span-2">
            {/* STEP 1: Servicio */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
                <h2 className="font-bold text-[#111827] mb-5 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#1E40AF]" /> Selecciona el servicio
                </h2>

                {servicesError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 whitespace-pre-line mb-4">
                    {servicesError}
                  </div>
                )}

                {servicesLoading ? (
                  <div className="space-y-2">
                    <div className="h-16 bg-[#F3F4F6] rounded-xl" />
                    <div className="h-16 bg-[#F3F4F6] rounded-xl" />
                  </div>
                ) : services.length === 0 ? (
                  <div className="p-4 text-sm text-[#6B7280] text-center">
                    Este profesional aún no tiene servicios publicados.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {services.map(s => (
                      <label key={s.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedService?.id === s.id ? 'border-[#1E40AF] bg-[#EFF6FF]' : 'border-[#E5E7EB] hover:border-[#1E40AF]/30'
                      }`}>
                        <input
                          type="radio"
                          name="service"
                          checked={selectedService?.id === s.id}
                          onChange={() => setSelectedService(s)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#111827]">{s.name}</p>
                          {s.description && <p className="text-xs text-[#6B7280] mt-0.5">{s.description}</p>}
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-[#9CA3AF]" />
                            <span className="text-xs text-[#9CA3AF]">{s.estimatedDurationHours} horas</span>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-[#1E40AF] flex-shrink-0">${Number(s.basePrice).toLocaleString()}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Fecha + Jornada */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 space-y-5">
                <div>
                  <h2 className="font-bold text-[#111827] mb-5 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#1E40AF]" /> Selecciona la fecha
                  </h2>

                  <div className="flex items-center justify-between mb-5">
                    <button
                      onClick={() => {
                        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
                        else setViewMonth(m => m - 1);
                      }}
                      className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                      type="button"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#374151]" />
                    </button>
                    <h3 className="font-semibold text-[#111827]">
                      {MONTHS[viewMonth]} {viewYear}
                    </h3>
                    <button
                      onClick={() => {
                        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
                        else setViewMonth(m => m + 1);
                      }}
                      className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                      type="button"
                    >
                      <ChevronRight className="w-4 h-4 text-[#374151]" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 mb-2">
                    {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map(d => (
                      <div key={d} className="text-center text-xs font-medium text-[#9CA3AF] py-1">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {padding.map((_, i) => <div key={`p${i}`} />)}
                    {days.map(day => {
                      const date = new Date(viewYear, viewMonth, day);
                      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                      const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
                      const isSelected = selectedDate?.y === viewYear && selectedDate?.m === viewMonth && selectedDate?.d === day;
                      return (
                        <button
                          key={day}
                          disabled={isPast}
                          onClick={() => setSelectedDate({ y: viewYear, m: viewMonth, d: day })}
                          className={`aspect-square rounded-xl text-sm font-medium transition-all ${
                            isSelected ? 'bg-[#1E40AF] text-white shadow-md' :
                            isToday ? 'bg-[#EFF6FF] text-[#1E40AF] font-bold' :
                            isPast ? 'text-[#D1D5DB] cursor-not-allowed' :
                            'hover:bg-[#F3F4F6] text-[#374151]'
                          }`}
                          type="button"
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-[#9CA3AF] mt-3 text-center">* No se pueden agendar fechas pasadas</p>
                </div>

                {/* Workday */}
                <div className="pt-5 border-t border-[#F3F4F6]">
                  <h3 className="font-bold text-[#111827] mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#1E40AF]" /> Jornada preferida
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { id: 'MAÑANA', icon: Sun, label: 'Mañana', desc: '6:00 AM – 12:00 PM' },
                      { id: 'TARDE', icon: Moon, label: 'Tarde', desc: '12:00 PM – 6:00 PM' },
                    ] as const).map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setWorkday(opt.id)}
                        type="button"
                        className={`flex flex-col items-start gap-1 p-4 rounded-xl border text-left transition-all ${
                          workday === opt.id
                            ? 'border-[#1E40AF] bg-[#EFF6FF]'
                            : 'border-[#E5E7EB] hover:border-[#1E40AF]/30'
                        }`}
                      >
                        <opt.icon className={`w-5 h-5 ${workday === opt.id ? 'text-[#1E40AF]' : 'text-[#9CA3AF]'}`} />
                        <p className="text-sm font-semibold text-[#111827]">{opt.label}</p>
                        <p className="text-xs text-[#6B7280]">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-[#9CA3AF] mt-2">
                    El profesional propondrá el horario exacto al aceptar la solicitud.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: Confirmación */}
            {step === 3 && selectedService && selectedDate && workday && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 space-y-4">
                <h2 className="font-bold text-[#111827] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#1E40AF]" /> Revisa tu solicitud
                </h2>

                <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-[#E5E7EB] space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB]">
                    <img src={profMock.photo} alt={profMock.name} className="w-11 h-11 rounded-xl object-cover" />
                    <div>
                      <p className="font-semibold text-[#111827]">{profMock.name}</p>
                      <p className="text-sm text-[#6B7280]">{profMock.specialty}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="w-4 h-4 text-[#1E40AF] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#9CA3AF]">Servicio</p>
                      <p className="text-sm font-medium text-[#111827]">{selectedService.name}</p>
                    </div>
                    <span className="text-sm font-bold text-[#1E40AF] flex-shrink-0">
                      ${Number(selectedService.basePrice).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-[#1E40AF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#9CA3AF]">Fecha</p>
                      <p className="text-sm font-medium text-[#111827]">{formattedDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#1E40AF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#9CA3AF]">Jornada</p>
                      <p className="text-sm font-medium text-[#111827]">{workday}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#1E40AF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#9CA3AF]">Ubicación</p>
                      <p className="text-sm font-medium text-[#111827]">Popayán centro (temporal)</p>
                      <p className="text-xs text-[#9CA3AF]">{DEFAULT_LAT.toFixed(4)}, {DEFAULT_LNG.toFixed(4)}</p>
                    </div>
                  </div>
                </div>

                {submitError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 whitespace-pre-line">
                    {submitError}
                  </div>
                )}

                <div className="bg-[#EFF6FF] rounded-xl p-3 flex items-start gap-2">
                  <Shield className="w-4 h-4 text-[#1E40AF] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#1E40AF]">
                    Tu solicitud quedará en estado <strong>PENDIENTE</strong>. El profesional la revisará y propondrá un horario específico.
                  </p>
                </div>
              </div>
            )}

            {/* Nav buttons */}
            {step < 4 && (
              <div className="flex gap-3 mt-5">
                {step > 1 && (
                  <button
                    onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)}
                    disabled={submitting}
                    className="flex items-center gap-2 px-5 py-3 border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-medium hover:bg-[#F9FAFB] transition-colors disabled:opacity-60"
                    type="button"
                  >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </button>
                )}
                <button
                  onClick={() => step === 3 ? handleConfirm() : setStep(s => (s + 1) as 2 | 3)}
                  disabled={!canNext() || submitting}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                    canNext() && !submitting
                      ? 'bg-[#1E40AF] text-white hover:bg-[#1D3FA0]'
                      : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                  }`}
                  type="button"
                >
                  {step === 3 ? (
                    submitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> Enviar solicitud</>
                    )
                  ) : (
                    <>Siguiente <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar resumen */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 h-fit sticky top-20">
            <h3 className="font-bold text-[#111827] mb-4">Resumen</h3>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#F3F4F6]">
              <img src={profMock.photo} alt={profMock.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <p className="text-sm font-semibold text-[#111827]">{profMock.name}</p>
                <p className="text-xs text-[#6B7280]">{profMock.specialty}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-[#374151]">{profMock.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {selectedService && (
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <Briefcase className="w-3.5 h-3.5 text-[#1E40AF] mt-0.5 flex-shrink-0" />
                    <span className="text-[#374151] truncate">{selectedService.name}</span>
                  </div>
                  <span className="font-bold text-[#111827] flex-shrink-0">${Number(selectedService.basePrice).toLocaleString()}</span>
                </div>
              )}
              {selectedDate && (
                <div className="flex items-center gap-2 text-[#374151]">
                  <Calendar className="w-3.5 h-3.5 text-[#1E40AF]" />
                  <span>{formattedDate}</span>
                </div>
              )}
              {workday && (
                <div className="flex items-center gap-2 text-[#374151]">
                  <Clock className="w-3.5 h-3.5 text-[#1E40AF]" />
                  <span>{workday}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
              <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                <Shield className="w-3.5 h-3.5" />
                <span>Tu solicitud está protegida</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}