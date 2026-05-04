import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Eye, EyeOff, Wrench, Mail, Lock, User, Phone, Briefcase, ChevronRight, CheckCircle2, ArrowLeft, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IMGS } from '../data/mockData';
import { decodeJwtPayload, mapRolesToAppRole } from '../../services/auth/jwt';
import { ProfessionalsService } from '../../services/professionals/professionals.service';
import type { ProfessionName } from '../../services/professionals/professionals.types';
import { GoogleMapPicker } from '../components/GoogleMapPicker';

type AuthView = 'login' | 'register-user' | 'register-pro';

function extractErrorMsg(err: any): string | null {
  const data = err?.response?.data;
  if (!data) return err?.message || null;
  if (typeof data === 'string') return data;
  if (data.fieldErrors && typeof data.fieldErrors === 'object') {
    const msgs = Object.values(data.fieldErrors).filter(Boolean).join('\n');
    if (msgs) return msgs;
  }
  if (typeof data.message === 'string') return data.message;
  if (typeof data.error === 'string') return data.error;
  return err?.message || null;
}

export function AuthPage({ initialView }: { initialView?: AuthView }) {
  const [view, setView] = useState<AuthView>(initialView || 'login');
  const [showPass, setShowPass] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { login, register, becomeProfessional, authLoading, authError } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { isLoggedIn, role } = useApp();

  // Registro profesional en 2 pasos
  const [proStep, setProStep] = useState<'form' | 'select-profession'>('form');

  // Profesiones desde el API
  const [professions, setProfessions] = useState<ProfessionName[]>([]);
  const [professionsLoading, setProfessionsLoading] = useState(false);

  // Coordenadas seleccionadas en el GoogleMapPicker (paso 2)
  const [proLat, setProLat] = useState<number | null>(null);
  const [proLng, setProLng] = useState<number | null>(null);
  const [proAddress, setProAddress] = useState<string>('');

  useEffect(() => {
    if (proStep !== 'select-profession') return;
    let mounted = true;
    setProfessionsLoading(true);
    ProfessionalsService.getProfessionsNames()
      .then((list) => { if (mounted) setProfessions(list); })
      .catch(() => { if (mounted) setFormError('No se pudieron cargar las profesiones. Intenta de nuevo.'); })
      .finally(() => { if (mounted) setProfessionsLoading(false); });
    return () => { mounted = false; };
  }, [proStep]);

  useEffect(() => {
    if (!isLoggedIn) return;

    // No redirigir si estamos en el paso 2 del registro profesional
    if (view === 'register-pro' && proStep === 'select-profession') return;

    const path =
      role === "admin"
        ? "/panel/admin"
        : role === "profesional"
        ? "/panel/profesional"
        : "/panel/usuario";

    navigate(path, { replace: true });
  }, [isLoggedIn, role, navigate, view, proStep]);

  const goToDashboard = () => {
    const token = localStorage.getItem('token');
    const payload = token ? decodeJwtPayload(token) : null;
    const role = mapRolesToAppRole(payload?.roles);
    if (role === 'admin') return navigate('/panel/admin');
    if (role === 'profesional') return navigate('/panel/profesional');
    return navigate('/panel/usuario');
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');

    try {
      await login(email, password);
      goToDashboard();
    } catch (err: any) {
      const msg = extractErrorMsg(err);
      if (msg && !authError) setFormError(msg);
    }
  };

  const handleRegisterUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const form = new FormData(e.currentTarget);
    const password = String(form.get('password') || '');
    const confirmPassword = String(form.get('confirmPassword') || '');
    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    const addressRaw = String(form.get('address') || '').trim();
    const ageRaw = String(form.get('age') || '').trim();

    let age: number | undefined;
    if (ageRaw) {
      const n = Number(ageRaw);
      if (Number.isNaN(n)) {
        setFormError('La edad debe ser un número.');
        return;
      }
      if (n < 18) {
        setFormError('Debes ser mayor de 18 años.');
        return;
      }
      age = n;
    }

    const address = addressRaw || undefined;

    try {
      await register({
        firstName: String(form.get('firstName') || '').trim(),
        lastName: String(form.get('lastName') || '').trim(),
        phone: String(form.get('phone') || '').trim(),
        address,
        age,
        email: String(form.get('email') || '').trim(),
        password,
        confirmPassword,
      });
      goToDashboard();
    } catch (err: any) {
      const msg = extractErrorMsg(err);
      if (msg && !authError) setFormError(msg);
    }
  };

  // Paso 1: Solo registrar usuario
  const handleRegisterPro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const form = new FormData(e.currentTarget);
    const password = String(form.get('password') || '');
    const confirmPassword = String(form.get('confirmPassword') || '');
    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    const addressRaw = String(form.get('address') || '').trim();
    const ageRaw = String(form.get('age') || '').trim();

    let age: number | undefined;
    if (ageRaw) {
      const n = Number(ageRaw);
      if (Number.isNaN(n)) {
        setFormError('La edad debe ser un número.');
        return;
      }
      if (n < 18) {
        setFormError('Debes ser mayor de 18 años.');
        return;
      }
      age = n;
    }

    const address = addressRaw || undefined;

    try {
      await register({
        firstName: String(form.get('firstName') || '').trim(),
        lastName: String(form.get('lastName') || '').trim(),
        phone: String(form.get('phone') || '').trim(),
        address,
        age,
        email: String(form.get('email') || '').trim(),
        password,
        confirmPassword,
      });

      setProStep('select-profession');
    } catch (err: any) {
      const msg = extractErrorMsg(err);
      if (msg && !authError) setFormError(msg);
    }
  };

  // Paso 2: Seleccionar profesión + ubicación y crear perfil profesional
  const handleSelectProfession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const form = new FormData(e.currentTarget);
    const professionId = String(form.get('professionId') || '').trim();

    if (!professionId) {
      setFormError('Selecciona una profesión.');
      return;
    }

    if (proLat == null || proLng == null) {
      setFormError('Selecciona tu ubicación de trabajo en el mapa. Escribe una dirección y elige una sugerencia, o haz clic en el mapa.');
      return;
    }

    try {
      await becomeProfessional(professionId, proLat, proLng);
      goToDashboard();
    } catch {
      // El error ya quedó en authError
    }
  };

  return (
    <div className="min-h-screen flex pt-16">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={IMGS.city} alt="Popayán" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F2460]/90 to-[#1E40AF]/80" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-16">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-[#1E40AF]" />
              </div>
              <span className="text-2xl font-bold text-white">By<span className="text-[#34D399]">Me</span></span>
            </Link>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              {view === 'register-pro'
                ? 'Haz crecer tu negocio con ByMe'
                : 'Los mejores profesionales de Popayán, a un clic'}
            </h2>
            <p className="text-blue-200 leading-relaxed">
              {view === 'register-pro'
                ? 'Únete a nuestra red y conecta con cientos de clientes. Sin comisiones los primeros 3 meses.'
                : 'Servicios verificados, precios justos y garantía de satisfacción. Tu hogar en buenas manos.'}
            </p>
          </div>
          <div className="space-y-4">
            {(view === 'register-pro' ? [
              'Perfil profesional gratuito',
              'Gestiona tu calendario y disponibilidad',
              'Pagos seguros y protegidos',
              'Soporte dedicado 24/7',
            ] : [
              'Más de 500 profesionales verificados',
              'Calificaciones y reseñas reales',
              'Reservas en línea en minutos',
              'Pago seguro y garantizado',
            ]).map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#34D399] flex-shrink-0" />
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <img src={IMGS.man1} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-white text-sm font-semibold">Carlos Ramírez</p>
                  <p className="text-blue-200 text-xs">⭐ 4.9 · 283 trabajos completados</p>
                </div>
              </div>
              <p className="text-white/70 text-xs mt-2 italic">"ByMe me ayudó a conseguir el doble de clientes en tres meses."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111827] mb-6 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
          </Link>

          {view === 'login' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#111827]">Bienvenido de vuelta</h1>
                <p className="text-[#6B7280] mt-1">Ingresa a tu cuenta de ByMe</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                      type="email"
                      name="email"
                      className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      name="password"
                      className="w-full pl-10 pr-10 py-2.5 border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPass ? <EyeOff className="w-4 h-4 text-[#9CA3AF]" /> : <Eye className="w-4 h-4 text-[#9CA3AF]" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-[#D1D5DB]" defaultChecked />
                    <span className="text-sm text-[#6B7280]">Recordarme</span>
                  </label>
                  <a href="#" className="text-sm text-[#1E40AF] hover:underline">¿Olvidaste tu contraseña?</a>
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#1E40AF] hover:bg-[#1D3FA0] text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {authLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Iniciar sesión <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              {authError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {authError}
                </div>
              )}
              {formError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-[#E5E7EB]" />
                <span className="text-sm text-[#9CA3AF]">o</span>
                <div className="flex-1 h-px bg-[#E5E7EB]" />
              </div>

              <p className="text-center text-sm text-[#6B7280]">
                ¿No tienes cuenta?{' '}
                <button onClick={() => setView('register-user')} className="text-[#1E40AF] font-medium hover:underline">
                  Regístrate gratis
                </button>
              </p>
              <p className="text-center text-sm text-[#6B7280] mt-2">
                ¿Eres profesional?{' '}
                <button onClick={() => setView('register-pro')} className="text-[#10B981] font-medium hover:underline">
                  Únete como profesional
                </button>
              </p>
            </>
          )}

          {view === 'register-user' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#111827]">Crear cuenta de usuario</h1>
                <p className="text-[#6B7280] mt-1">Encuentra profesionales en minutos</p>
              </div>
              <form onSubmit={handleRegisterUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Nombre</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                      <input name="firstName" type="text" placeholder="Felipe" required className="w-full pl-9 pr-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Apellido</label>
                    <input name="lastName" type="text" placeholder="Arango" required className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input name="email" type="email" placeholder="tu@email.com" required className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input name="phone" type="tel" placeholder="+57 300 000 0000" className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Dirección</label>
                  <input name="address" type="text" placeholder="Calle Falsa 123" className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Edad</label>
                  <input name="age" type="number" min={1} max={120} placeholder="25" className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input name="password" type={showPass ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" required className="w-full pl-10 pr-10 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPass ? <EyeOff className="w-4 h-4 text-[#9CA3AF]" /> : <Eye className="w-4 h-4 text-[#9CA3AF]" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Confirmar contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input name="confirmPassword" type={showPass ? 'text' : 'password'} placeholder="Repite tu contraseña" required className="w-full pl-10 pr-10 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all" />
                  </div>
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded border-[#D1D5DB]" required />
                  <span className="text-sm text-[#6B7280]">
                    Acepto los <a href="#" className="text-[#1E40AF] hover:underline">términos y condiciones</a> y la <a href="#" className="text-[#1E40AF] hover:underline">política de privacidad</a>
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#1E40AF] hover:bg-[#1D3FA0] text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {authLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Crear cuenta <ChevronRight className="w-4 h-4" /></>}
                </button>
              </form>
              {authError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {authError}
                </div>
              )}
              {formError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {formError}
                </div>
              )}
              <p className="text-center text-sm text-[#6B7280] mt-5">
                ¿Ya tienes cuenta?{' '}
                <button onClick={() => setView('login')} className="text-[#1E40AF] font-medium hover:underline">Iniciar sesión</button>
              </p>
              <p className="text-center text-sm text-[#6B7280] mt-2">
                ¿Eres profesional?{' '}
                <button onClick={() => setView('register-pro')} className="text-[#10B981] font-medium hover:underline">Regístrate aquí</button>
              </p>
            </>
          )}

          {view === 'register-pro' && (
            <>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-[#ECFDF5] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  <Briefcase className="w-3.5 h-3.5" /> Cuenta Profesional
                </div>
                <h1 className="text-2xl font-bold text-[#111827]">
                  {proStep === 'form' ? 'Únete como profesional' : 'Profesión y ubicación'}
                </h1>
                <p className="text-[#6B7280] mt-1">
                  {proStep === 'form'
                    ? 'Paso 1 de 2 — Crea tu cuenta'
                    : 'Paso 2 de 2 — Elige tu especialidad y zona de trabajo'}
                </p>
              </div>

              {/* ── PASO 1: Formulario de registro ── */}
              {proStep === 'form' && (
                <>
                  <form onSubmit={handleRegisterPro} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">Nombre</label>
                        <input name="firstName" type="text" placeholder="Carlos" required className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">Apellido</label>
                        <input name="lastName" type="text" placeholder="Ramírez" required className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">Correo electrónico</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                        <input name="email" type="email" placeholder="carlos@email.com" required className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">Teléfono</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                        <input name="phone" type="tel" placeholder="+57 310 000 0000" className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">Dirección</label>
                      <input name="address" type="text" placeholder="Calle Falsa 123" className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">Edad</label>
                      <input name="age" type="number" min={1} max={120} placeholder="30" className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">Contraseña</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                        <input name="password" type={showPass ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" required className="w-full pl-10 pr-10 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all" />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                          {showPass ? <EyeOff className="w-4 h-4 text-[#9CA3AF]" /> : <Eye className="w-4 h-4 text-[#9CA3AF]" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">Confirmar contraseña</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                        <input name="confirmPassword" type={showPass ? 'text' : 'password'} placeholder="Repite tu contraseña" required className="w-full pl-10 pr-10 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all" />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full bg-[#10B981] hover:bg-[#0EA875] text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {authLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Continuar <ChevronRight className="w-4 h-4" /></>}
                    </button>
                  </form>
                  <p className="text-center text-sm text-[#6B7280] mt-5">
                    ¿Ya tienes cuenta?{' '}
                    <button onClick={() => setView('login')} className="text-[#1E40AF] font-medium hover:underline">Iniciar sesión</button>
                  </p>
                </>
              )}

              {/* ── PASO 2: Seleccionar profesión + ubicación ── */}
              {proStep === 'select-profession' && (
                <>
                  <div className="p-4 bg-[#ECFDF5] rounded-xl border border-[#10B981]/20 mb-5">
                    <p className="text-sm text-[#10B981] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Cuenta creada exitosamente.
                    </p>
                  </div>

                  <form onSubmit={handleSelectProfession} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">Especialidad principal</label>
                      <select name="professionId" required className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] bg-white transition-all">
                        <option value="">
                          {professionsLoading ? 'Cargando profesiones...' : 'Selecciona tu especialidad'}
                        </option>
                        {professions.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">
                        Tu zona de trabajo
                      </label>
                      <p className="text-xs text-[#6B7280] mb-2">
                        Busca una dirección y elige una sugerencia, o haz clic en el mapa para ajustar el pin.
                      </p>
                      <GoogleMapPicker
                        defaultAddress=""
                        onAddressChange={(address, lat, lng) => {
                          setProAddress(address);
                          setProLat(lat);
                          setProLng(lng);
                        }}
                      />
                      {proLat != null && proLng != null && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-[#10B981]">
                          <MapPin className="w-3 h-3" />
                          <span>Ubicación seleccionada · {proLat.toFixed(4)}, {proLng.toFixed(4)}</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading || professionsLoading}
                      className="w-full bg-[#10B981] hover:bg-[#0EA875] text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {authLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Crear cuenta profesional <ChevronRight className="w-4 h-4" /></>}
                    </button>
                  </form>
                </>
              )}

              {authError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {authError}
                </div>
              )}
              {formError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {formError}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}