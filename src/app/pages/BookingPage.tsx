import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ChevronLeft, ChevronRight, Calendar, Clock, MapPin, CheckCircle2,
  User, Phone, FileText, Star, Shield, CreditCard, Banknote
} from 'lucide-react';
import { professionals } from '../data/mockData';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const UNAVAILABLE = ['9:00 AM', '2:00 PM'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const prof = professionals.find(p => p.id === id) || professionals[0];

  const today = new Date();
  const [step, setStep] = useState(1);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState(prof.services[0]);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [payMethod, setPayMethod] = useState<'card' | 'cash'>('card');
  const [confirmed, setConfirmed] = useState(false);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDay }, (_, i) => i);

  const canNext = () => {
    if (step === 1) return selectedDate !== null;
    if (step === 2) return selectedTime !== null;
    if (step === 3) return address.trim().length > 0;
    return false;
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setStep(4);
  };

  const STEPS = [
    { n: 1, label: 'Fecha' },
    { n: 2, label: 'Hora' },
    { n: 3, label: 'Detalles' },
    { n: 4, label: 'Confirmación' },
  ];

  const formattedDate = selectedDate
    ? `${selectedDate} de ${MONTHS[viewMonth]} de ${viewYear}`
    : '';

  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] pt-16 flex items-center justify-center p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl max-w-md w-full p-8 text-center">
          {/* Success animation */}
          <div className="w-20 h-20 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-[#ECFDF5] text-[#10B981] text-sm font-semibold px-3 py-1 rounded-full mb-4">
            ¡Reserva confirmada!
          </div>
          <h2 className="text-2xl font-bold text-[#111827] mb-2">¡Listo! Tu cita está agendada</h2>
          <p className="text-[#6B7280] mb-6">Hemos enviado los detalles a tu correo. El profesional te contactará en breve.</p>

          {/* Booking summary */}
          <div className="bg-[#F9FAFB] rounded-2xl p-5 text-left mb-6 border border-[#E5E7EB]">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#E5E7EB]">
              <img src={prof.photo} alt={prof.name} className="w-11 h-11 rounded-xl object-cover" />
              <div>
                <p className="font-semibold text-[#111827]">{prof.name}</p>
                <p className="text-sm text-[#6B7280]">{prof.specialty}</p>
              </div>
            </div>
            {[
              { icon: Calendar, label: 'Fecha', value: formattedDate },
              { icon: Clock, label: 'Hora', value: selectedTime || '' },
              { icon: FileText, label: 'Servicio', value: selectedService.name },
              { icon: MapPin, label: 'Dirección', value: address },
              { icon: CreditCard, label: 'Precio', value: `$${selectedService.price.toLocaleString()} COP` },
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
              Ver mis reservas
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

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[#6B7280] hover:text-[#111827] text-sm mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Volver al perfil
        </button>

        <h1 className="text-2xl font-bold text-[#111827] mb-6">Agendar cita</h1>

        {/* Steps */}
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
          {/* Main step content */}
          <div className="md:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
                <h2 className="font-bold text-[#111827] mb-5 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#1E40AF]" /> Selecciona la fecha
                </h2>

                {/* Calendar navigation */}
                <div className="flex items-center justify-between mb-5">
                  <button
                    onClick={() => {
                      if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
                      else setViewMonth(m => m - 1);
                    }}
                    className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
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
                  >
                    <ChevronRight className="w-4 h-4 text-[#374151]" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map(d => (
                    <div key={d} className="text-center text-xs font-medium text-[#9CA3AF] py-1">{d}</div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                  {padding.map((_, i) => <div key={`p${i}`} />)}
                  {days.map(day => {
                    const isPast = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day < today.getDate();
                    const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
                    const isSelected = selectedDate === day && viewMonth === viewMonth;
                    const isWeekend = (new Date(viewYear, viewMonth, day).getDay() === 0);
                    return (
                      <button
                        key={day}
                        disabled={isPast || isWeekend}
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square rounded-xl text-sm font-medium transition-all ${
                          isSelected ? 'bg-[#1E40AF] text-white shadow-md' :
                          isToday ? 'bg-[#EFF6FF] text-[#1E40AF] font-bold' :
                          isPast || isWeekend ? 'text-[#D1D5DB] cursor-not-allowed' :
                          'hover:bg-[#F3F4F6] text-[#374151]'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-[#9CA3AF] mt-3 text-center">* Los domingos no están disponibles</p>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
                <h2 className="font-bold text-[#111827] mb-1 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#1E40AF]" /> Selecciona la hora
                </h2>
                <p className="text-sm text-[#6B7280] mb-5">{formattedDate}</p>
                <div className="grid grid-cols-3 gap-2.5">
                  {TIME_SLOTS.map(slot => {
                    const unavail = UNAVAILABLE.includes(slot);
                    return (
                      <button
                        key={slot}
                        disabled={unavail}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                          selectedTime === slot ? 'bg-[#1E40AF] text-white border-[#1E40AF] shadow-md' :
                          unavail ? 'border-[#E5E7EB] text-[#D1D5DB] cursor-not-allowed bg-[#F9FAFB] line-through' :
                          'border-[#E5E7EB] text-[#374151] hover:border-[#1E40AF] hover:bg-[#EFF6FF]'
                        }`}
                      >
                        {slot}
                        {unavail && <span className="block text-xs mt-0.5">No disponible</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 space-y-5">
                <h2 className="font-bold text-[#111827] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#1E40AF]" /> Detalles de la reserva
                </h2>

                {/* Service selection */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Servicio</label>
                  <div className="space-y-2">
                    {prof.services.map(s => (
                      <label key={s.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedService.id === s.id ? 'border-[#1E40AF] bg-[#EFF6FF]' : 'border-[#E5E7EB] hover:border-[#1E40AF]/30'
                      }`}>
                        <input
                          type="radio"
                          name="service"
                          checked={selectedService.id === s.id}
                          onChange={() => setSelectedService(s)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#111827]">{s.name}</p>
                          <p className="text-xs text-[#6B7280]">{s.duration}</p>
                        </div>
                        <span className="text-sm font-bold text-[#1E40AF]">${s.price.toLocaleString()}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">
                    Dirección del servicio *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-[#9CA3AF]" />
                    <input
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Ej: Cra 5 #8-45, Barrio Centro"
                      className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Describe el problema o instrucciones especiales..."
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] resize-none transition-all"
                  />
                </div>

                {/* Payment method */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Método de pago</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { id: 'card', icon: CreditCard, label: 'Tarjeta / PSE' },
                      { id: 'cash', icon: Banknote, label: 'Efectivo' },
                    ] as const).map(method => (
                      <label key={method.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        payMethod === method.id ? 'border-[#1E40AF] bg-[#EFF6FF]' : 'border-[#E5E7EB] hover:border-[#1E40AF]/30'
                      }`}>
                        <input type="radio" name="payment" checked={payMethod === method.id} onChange={() => setPayMethod(method.id)} />
                        <method.icon className={`w-4 h-4 ${payMethod === method.id ? 'text-[#1E40AF]' : 'text-[#9CA3AF]'}`} />
                        <span className="text-sm font-medium text-[#374151]">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            {step < 4 && (
              <div className="flex gap-3 mt-5">
                {step > 1 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-2 px-5 py-3 border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-medium hover:bg-[#F9FAFB] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </button>
                )}
                <button
                  onClick={() => step === 3 ? handleConfirm() : setStep(s => s + 1)}
                  disabled={!canNext()}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                    canNext()
                      ? 'bg-[#1E40AF] text-white hover:bg-[#1D3FA0]'
                      : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                  }`}
                >
                  {step === 3 ? (
                    <><CheckCircle2 className="w-4 h-4" /> Confirmar reserva</>
                  ) : (
                    <>Siguiente <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar: booking summary */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 h-fit sticky top-20">
            <h3 className="font-bold text-[#111827] mb-4">Resumen</h3>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#F3F4F6]">
              <img src={prof.photo} alt={prof.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <p className="text-sm font-semibold text-[#111827]">{prof.name}</p>
                <p className="text-xs text-[#6B7280]">{prof.specialty}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-[#374151]">{prof.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {selectedDate && (
                <div className="flex items-center gap-2 text-[#374151]">
                  <Calendar className="w-3.5 h-3.5 text-[#1E40AF]" />
                  <span>{formattedDate}</span>
                </div>
              )}
              {selectedTime && (
                <div className="flex items-center gap-2 text-[#374151]">
                  <Clock className="w-3.5 h-3.5 text-[#1E40AF]" />
                  <span>{selectedTime}</span>
                </div>
              )}
              {step >= 3 && (
                <div className="flex items-start justify-between pt-3 border-t border-[#F3F4F6]">
                  <span className="text-[#6B7280]">{selectedService.name}</span>
                  <span className="font-bold text-[#111827]">${selectedService.price.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
              <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                <Shield className="w-3.5 h-3.5" />
                <span>Pago 100% protegido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
