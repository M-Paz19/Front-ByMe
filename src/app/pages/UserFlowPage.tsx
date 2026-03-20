import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Home, Search, User, Calendar, CheckCircle2, Star, LogIn,
  LayoutDashboard, Edit3, Clock, Bell, Shield, Briefcase, Users,
  MessageSquare, ChevronRight, ChevronDown, Wrench, ExternalLink,
  XCircle, AlertCircle, Navigation2, Settings, History, MapPin,
  Play, GitBranch, ArrowRight, ArrowDown, Zap, MousePointer,
  Eye, CheckCircle, X, Phone, CreditCard, FileText, RefreshCw,
  Award, Map, LogOut, ThumbsUp, ChevronLeft
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────
interface FlowStep {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  desc: string;
  interactions: string[];
  path: string;
  icon: React.ComponentType<any>;
  type: 'screen' | 'decision' | 'end';
  branchYes?: { label: string; desc: string; path: string; color: string };
  branchNo?: { label: string; desc: string; path: string; color: string };
}

interface RoleConfig {
  steps: FlowStep[];
  label: string;
  tagline: string;
  color: string;
  lightBg: string;
  borderColor: string;
  textLight: string;
  gradient: string;
}

// ── Flow data ─────────────────────────────────────────────────
const USER_FLOW: FlowStep[] = [
  {
    id: 'landing', step: 1, type: 'screen',
    title: 'Landing Page', subtitle: 'Descubrimiento',
    desc: 'El usuario llega a ByMe y descubre los servicios disponibles en Popayán.',
    interactions: ['Ver hero con búsqueda principal', 'Explorar 8 categorías de servicios', 'Ver profesionales destacados', 'Leer "Cómo funciona"'],
    path: '/', icon: Home,
  },
  {
    id: 'search', step: 2, type: 'screen',
    title: 'Búsqueda', subtitle: 'Filtrar y explorar',
    desc: 'Busca por tipo de servicio con filtros avanzados de precio, rating y disponibilidad.',
    interactions: ['Escribir servicio o profesional', 'Aplicar filtros (precio, rating)', 'Ordenar por distancia o calificación', 'Alternar vista lista / mapa'],
    path: '/buscar', icon: Search,
  },
  {
    id: 'map', step: 3, type: 'screen',
    title: 'Vista de Mapa', subtitle: 'Geolocalización',
    desc: 'Mapa SVG de Popayán con pins de profesionales. Visualización geográfica en tiempo real.',
    interactions: ['Ver pins de profesionales cercanos', 'Clicar pin para preview rápido', 'Filtrar por radio de distancia', 'Identificar barrios de cobertura'],
    path: '/buscar', icon: Map,
  },
  {
    id: 'profile', step: 4, type: 'screen',
    title: 'Perfil Profesional', subtitle: 'Evaluación',
    desc: 'Página detallada con fotos, reseñas verificadas, portafolio y disponibilidad.',
    interactions: ['Ver foto, rating y especialidad', 'Leer reseñas verificadas de usuarios', 'Ver portafolio de trabajos realizados', 'Verificar disponibilidad horaria'],
    path: '/profesional/1', icon: User,
  },
  {
    id: 'booking', step: 5, type: 'screen',
    title: 'Agendamiento', subtitle: 'Seleccionar cita',
    desc: 'Flujo de 4 pasos: fecha, hora, detalles del trabajo y método de pago.',
    interactions: ['Seleccionar fecha en calendario', 'Elegir horario disponible', 'Describir el trabajo a realizar', 'Elegir: Tarjeta/PSE o Efectivo'],
    path: '/agendar/1', icon: Calendar,
  },
  {
    id: 'confirm', step: 6, type: 'screen',
    title: 'Confirmación', subtitle: 'Reserva exitosa',
    desc: 'Pantalla de éxito con resumen completo. Notificación automática al profesional.',
    interactions: ['Ver resumen completo de reserva', 'Código único de reserva generado', 'Email de confirmación enviado', 'Profesional notificado en tiempo real'],
    path: '/agendar/1', icon: CheckCircle2,
  },
  {
    id: 'review', step: 7, type: 'end',
    title: 'Dejar Reseña', subtitle: 'Post-servicio',
    desc: 'Después del servicio completado, el usuario califica y comenta al profesional.',
    interactions: ['Calificar con 1–5 estrellas', 'Escribir comentario detallado', 'Reseña publicada y verificada', 'Sube el rating del profesional'],
    path: '/panel/usuario', icon: Star,
  },
];

const PRO_FLOW: FlowStep[] = [
  {
    id: 'pro-login', step: 1, type: 'screen',
    title: 'Login / Registro', subtitle: 'Acceso al sistema',
    desc: 'El profesional accede con sus credenciales o se registra como nuevo profesional.',
    interactions: ['Login con email y contraseña', 'Registro como nuevo profesional', 'Subir documentos de verificación', 'Recuperar contraseña olvidada'],
    path: '/login', icon: LogIn,
  },
  {
    id: 'pro-dashboard', step: 2, type: 'screen',
    title: 'Panel Dashboard', subtitle: 'Vista general',
    desc: 'Vista central con estadísticas, reservas del día, calificación e ingresos.',
    interactions: ['Ver reservas del día y pendientes', 'Revisar estadísticas de ingresos', 'Ver rating y reseñas recientes', 'Acceder a notificaciones'],
    path: '/panel/profesional', icon: LayoutDashboard,
  },
  {
    id: 'edit-profile', step: 3, type: 'screen',
    title: 'Editar Perfil', subtitle: 'Gestión de información',
    desc: 'Actualizar datos profesionales: foto, descripción, servicios y tarifas.',
    interactions: ['Subir o actualizar foto de perfil', 'Editar especialidades y descripción', 'Agregar o modificar servicios', 'Establecer tarifa base por hora'],
    path: '/panel/profesional', icon: Edit3,
  },
  {
    id: 'availability', step: 4, type: 'screen',
    title: 'Disponibilidad', subtitle: 'Configurar horarios',
    desc: 'Definir días de trabajo, horarios de atención y zona geográfica de cobertura.',
    interactions: ['Marcar días disponibles en semana', 'Establecer horas de inicio/fin', 'Definir zona de cobertura en mapa', 'Bloquear fechas de vacaciones'],
    path: '/panel/profesional', icon: Clock,
  },
  {
    id: 'receive', step: 5, type: 'screen',
    title: 'Recibir Solicitud', subtitle: 'Nueva reserva entrante',
    desc: 'Notificación de nueva reserva con datos completos del cliente y el trabajo.',
    interactions: ['Recibir notificación push/email', 'Revisar descripción del trabajo', 'Ver ubicación exacta del cliente', 'Consultar historial del cliente'],
    path: '/panel/profesional', icon: Bell,
  },
  {
    id: 'decision', step: 6, type: 'decision',
    title: '¿Aceptar la reserva?', subtitle: 'Punto de decisión',
    desc: 'El profesional evalúa si puede atender la solicitud en la fecha y hora indicada.',
    interactions: ['Evaluar disponibilidad en la fecha', 'Revisar descripción del trabajo', 'Verificar distancia y zona'],
    path: '/panel/profesional', icon: GitBranch,
    branchYes: { label: 'Confirmar reserva', desc: 'Se notifica al usuario, la cita queda agendada en el calendario del profesional', path: '/panel/profesional', color: '#10B981' },
    branchNo: { label: 'Rechazar solicitud', desc: 'Se informa al usuario con una razón. Puede buscar otro profesional disponible', path: '/panel/profesional', color: '#EF4444' },
  },
];

const ADMIN_FLOW: FlowStep[] = [
  {
    id: 'admin-login', step: 1, type: 'screen',
    title: 'Login Admin', subtitle: 'Acceso privilegiado',
    desc: 'Acceso seguro con credenciales de administrador. Sesión registrada en auditoría.',
    interactions: ['Login con credenciales de admin', 'Registro automático de auditoría', 'Sesión segura con expiración 8h', 'Alerta si IP no reconocida'],
    path: '/login', icon: Shield,
  },
  {
    id: 'admin-dash', step: 2, type: 'screen',
    title: 'Dashboard Admin', subtitle: 'Panel de control',
    desc: 'Métricas globales en tiempo real, alertas del sistema y actividad reciente.',
    interactions: ['Ver KPIs: usuarios, reservas, ingresos', 'Revisar alertas y reportes pendientes', 'Monitor de actividad en tiempo real', 'Exportar reportes en CSV/PDF'],
    path: '/panel/admin', icon: LayoutDashboard,
  },
  {
    id: 'users', step: 3, type: 'screen',
    title: 'Revisar Usuarios', subtitle: 'Gestión y moderación',
    desc: 'Lista completa de usuarios con herramientas de búsqueda, filtrado y moderación.',
    interactions: ['Buscar usuario por nombre o email', 'Ver historial completo de reservas', 'Suspender o bloquear cuenta', 'Ver estadísticas de actividad'],
    path: '/panel/admin', icon: Users,
  },
  {
    id: 'pros', step: 4, type: 'screen',
    title: 'Revisar Profesionales', subtitle: 'Verificación y calidad',
    desc: 'Verificar nuevos profesionales, aprobar registros y monitorear calidad del servicio.',
    interactions: ['Revisar documentos de identidad', 'Aprobar o rechazar nuevo registro', 'Ver métricas de calidad y quejas', 'Suspender cuenta problemática'],
    path: '/panel/admin', icon: Briefcase,
  },
  {
    id: 'reviews', step: 5, type: 'end',
    title: 'Moderar Reseñas', subtitle: 'Control de contenido',
    desc: 'Revisar reseñas reportadas, filtrar contenido inapropiado y resolver disputas.',
    interactions: ['Ver reseñas marcadas como spam', 'Aprobar o eliminar reseñas', 'Resolver disputas entre usuarios', 'Ver estadísticas de moderación'],
    path: '/panel/admin', icon: MessageSquare,
  },
];

const ROLES: Record<string, RoleConfig> = {
  usuario: {
    steps: USER_FLOW, label: 'Flujo Usuario',
    tagline: 'Desde que conoce ByMe hasta dejar una reseña al profesional',
    color: '#1E40AF', lightBg: '#EFF6FF', borderColor: '#BFDBFE',
    textLight: '#BFDBFE', gradient: 'from-[#1E3A8A] via-[#1E40AF] to-[#2563EB]',
  },
  profesional: {
    steps: PRO_FLOW, label: 'Flujo Profesional',
    tagline: 'Desde el registro hasta confirmar o rechazar reservas de clientes',
    color: '#10B981', lightBg: '#ECFDF5', borderColor: '#A7F3D0',
    textLight: '#A7F3D0', gradient: 'from-[#065F46] via-[#059669] to-[#10B981]',
  },
  admin: {
    steps: ADMIN_FLOW, label: 'Flujo Administrador',
    tagline: 'Desde el login hasta moderar todo el contenido de la plataforma',
    color: '#7C3AED', lightBg: '#F5F3FF', borderColor: '#DDD6FE',
    textLight: '#DDD6FE', gradient: 'from-[#4C1D95] via-[#6D28D9] to-[#7C3AED]',
  },
};

// ── Helper: Step type label ──────────────────────────────────
function TypeBadge({ type }: { type: FlowStep['type'] }) {
  if (type === 'decision') return (
    <span className="text-[10px] font-bold text-[#D97706] bg-[#FFFBEB] border border-[#FCD34D] px-2 py-0.5 rounded-full">
      Decisión
    </span>
  );
  if (type === 'end') return (
    <span className="text-[10px] font-bold text-[#6B7280] bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-0.5 rounded-full">
      Final
    </span>
  );
  return (
    <span className="text-[10px] font-bold text-[#1E40AF] bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-full">
      Pantalla
    </span>
  );
}

// ── Step Card ─────────────────────────────────────────────────
function StepCard({
  step, color, lightBg, borderColor, isActive, onSelect
}: {
  step: FlowStep; color: string; lightBg: string; borderColor: string;
  isActive: boolean; onSelect: (id: string) => void;
}) {
  const Icon = step.icon;
  const isDecision = step.type === 'decision';
  const isEnd = step.type === 'end';

  return (
    <div
      className={`flex flex-col items-center flex-shrink-0 ${isDecision ? 'gap-0' : ''}`}
      style={{ width: isDecision ? 220 : 204 }}
    >
      {/* Main card */}
      <div
        onClick={() => onSelect(step.id)}
        className={`w-full rounded-2xl border-2 bg-white overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
          isActive
            ? 'shadow-xl ring-2 ring-offset-2'
            : 'shadow-sm hover:shadow-lg'
        } ${isDecision ? 'border-[#FCD34D]' : isEnd ? 'border-[#D1D5DB]' : ''}`}
        style={isActive
          ? { borderColor: color, ringColor: color }
          : isDecision ? {} : { borderColor }}
      >
        {/* Top accent bar */}
        <div className="h-1.5" style={{ backgroundColor: isDecision ? '#D97706' : isEnd ? '#6B7280' : color }} />

        <div className="p-4">
          {/* Step badge + type */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-white px-2.5 py-1 rounded-full"
              style={{ backgroundColor: isDecision ? '#D97706' : isEnd ? '#6B7280' : color }}>
              {step.step.toString().padStart(2, '0')}
            </span>
            <TypeBadge type={step.type} />
          </div>

          {/* Icon */}
          <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center"
            style={{ backgroundColor: isDecision ? '#FFFBEB' : lightBg }}>
            <Icon className="w-5 h-5"
              style={{ color: isDecision ? '#D97706' : color }} />
          </div>

          {/* Title */}
          <h3 className="font-bold text-[#111827] text-sm leading-snug mb-0.5">{step.title}</h3>
          <p className="text-[10px] text-[#9CA3AF] mb-2.5 font-medium uppercase tracking-wide">{step.subtitle}</p>

          {/* Description */}
          <p className="text-xs text-[#6B7280] leading-relaxed mb-3">{step.desc}</p>

          {/* Interactions */}
          <div className="border-t border-[#F3F4F6] pt-3 space-y-1.5 mb-4">
            {step.interactions.slice(0, 3).map((action, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: isDecision ? '#D97706' : color }} />
                <span className="text-[11px] text-[#6B7280] leading-snug">{action}</span>
              </div>
            ))}
          </div>

          {/* Navigate button */}
          <Link
            to={step.path}
            onClick={e => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: isDecision ? '#FFFBEB' : lightBg, color: isDecision ? '#D97706' : color }}
          >
            <ExternalLink className="w-3 h-3" /> Ir a la pantalla
          </Link>
        </div>
      </div>

      {/* Decision branches */}
      {isDecision && step.branchYes && step.branchNo && (
        <div className="flex flex-col items-center">
          {/* Vertical connector */}
          <div className="w-px h-6 bg-[#D1D5DB]" />

          {/* Question label */}
          <div className="text-[10px] text-[#6B7280] font-semibold mb-2 bg-[#F9FAFB] border border-[#E5E7EB] px-3 py-1 rounded-full">
            ¿Puede atender la reserva?
          </div>

          {/* Branches */}
          <div className="flex items-start gap-3">
            {/* YES branch */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-0">
                <div className="w-12 h-px bg-[#A7F3D0]" />
                <div className="w-px h-5 bg-[#A7F3D0]" />
              </div>
              <Link
                to={step.branchYes.path}
                className="w-24 bg-[#ECFDF5] border-2 border-[#A7F3D0] rounded-xl p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <CheckCircle2 className="w-5 h-5 text-[#10B981] mx-auto mb-1.5" />
                <p className="text-[10px] font-bold text-[#065F46] leading-tight">{step.branchYes.label}</p>
              </Link>
              <div className="text-[9px] text-[#10B981] font-bold mt-1.5">✓ SÍ</div>
            </div>

            {/* NO branch */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-0">
                <div className="w-12 h-px bg-[#FECACA]" />
                <div className="w-px h-5 bg-[#FECACA]" />
              </div>
              <Link
                to={step.branchNo.path}
                className="w-24 bg-[#FEF2F2] border-2 border-[#FECACA] rounded-xl p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <XCircle className="w-5 h-5 text-[#EF4444] mx-auto mb-1.5" />
                <p className="text-[10px] font-bold text-[#991B1B] leading-tight">{step.branchNo.label}</p>
              </Link>
              <div className="text-[9px] text-[#EF4444] font-bold mt-1.5">✗ NO</div>
            </div>
          </div>

          {/* Branch descriptions */}
          <div className="flex items-start gap-3 mt-3">
            <div className="w-24 text-center">
              <p className="text-[9px] text-[#6B7280] leading-tight">{step.branchYes.desc}</p>
            </div>
            <div className="w-24 text-center">
              <p className="text-[9px] text-[#6B7280] leading-tight">{step.branchNo.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Arrow connector ───────────────────────────────────────────
function FlowArrow({ label, color }: { label?: string; color: string }) {
  return (
    <div className="flex flex-col items-center justify-start flex-shrink-0 self-start mt-[52px] mx-1">
      <div className="flex items-center">
        <div className="w-6 h-px bg-[#D1D5DB]" />
        <ChevronRight className="w-4 h-4 text-[#9CA3AF] -ml-1" />
      </div>
      {label && (
        <span className="text-[9px] text-[#9CA3AF] mt-0.5 max-w-[48px] text-center leading-tight">{label}</span>
      )}
    </div>
  );
}

// ── Step Detail Panel (slide in) ─────────────────────────────
function StepDetail({
  step, color, lightBg, onClose
}: {
  step: FlowStep | null; color: string; lightBg: string; onClose: () => void;
}) {
  if (!step) return null;
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-lg w-full z-10 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#F3F4F6]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: lightBg }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: color }}>
                    Paso {step.step.toString().padStart(2, '0')}
                  </span>
                  <TypeBadge type={step.type} />
                </div>
                <h2 className="text-lg font-bold text-[#111827]">{step.title}</h2>
                <p className="text-xs text-[#9CA3AF] font-medium uppercase tracking-wide">{step.subtitle}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-[#9CA3AF] hover:bg-[#F3F4F6] transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Description */}
          <p className="text-sm text-[#374151] leading-relaxed mb-5">{step.desc}</p>

          {/* All interactions */}
          <div className="mb-5">
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Interacciones disponibles</p>
            <div className="space-y-2.5">
              {step.interactions.map((action, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold"
                    style={{ backgroundColor: color }}>
                    {i + 1}
                  </div>
                  <span className="text-sm text-[#374151]">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decision branches */}
          {step.type === 'decision' && step.branchYes && step.branchNo && (
            <div className="mb-5">
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Caminos posibles</p>
              <div className="grid grid-cols-2 gap-3">
                <Link to={step.branchYes.path} className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl hover:shadow-md transition-all">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] mb-2" />
                  <p className="text-sm font-bold text-[#065F46] mb-1">{step.branchYes.label}</p>
                  <p className="text-xs text-[#6B7280] leading-snug">{step.branchYes.desc}</p>
                </Link>
                <Link to={step.branchNo.path} className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl hover:shadow-md transition-all">
                  <XCircle className="w-5 h-5 text-[#EF4444] mb-2" />
                  <p className="text-sm font-bold text-[#991B1B] mb-1">{step.branchNo.label}</p>
                  <p className="text-xs text-[#6B7280] leading-snug">{step.branchNo.desc}</p>
                </Link>
              </div>
            </div>
          )}

          {/* Navigate CTA */}
          <Link
            to={step.path}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
            style={{ backgroundColor: color }}
          >
            <ExternalLink className="w-4 h-4" /> Abrir esta pantalla en el prototipo
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export function UserFlowPage() {
  const [activeRole, setActiveRole] = useState<'usuario' | 'profesional' | 'admin'>('usuario');
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const role = ROLES[activeRole];
  const activeStepData = role.steps.find(s => s.id === selectedStep) || null;

  const handleSelect = (id: string) => {
    setSelectedStep(prev => prev === id ? null : id);
  };

  // Walk-through navigation
  const allStepIds = role.steps.map(s => s.id);
  const currentIndex = selectedStep ? allStepIds.indexOf(selectedStep) : -1;

  const handleWalkthrough = () => {
    const firstStep = role.steps[0];
    setSelectedStep(firstStep.id);
    navigate(firstStep.path);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Hero Header ── */}
      <div className={`bg-gradient-to-br ${role.gradient} pt-16`}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-5 text-sm" style={{ color: role.textLight }}>
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-white font-medium">User Flow</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/15 rounded-2xl flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: role.textLight }}>ByMe · Diagrama de Flujos</p>
                  <h1 className="text-3xl font-black text-white leading-tight">User Flow & Navigation</h1>
                </div>
              </div>
              <p className="text-white/70 max-w-xl leading-relaxed">{role.tagline}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 flex-wrap">
              {[
                { label: 'Pasos totales', value: role.steps.length },
                { label: 'Pantallas', value: role.steps.filter(s => s.type !== 'decision').length },
                { label: 'Decisiones', value: role.steps.filter(s => s.type === 'decision').length },
                { label: 'Interacciones', value: role.steps.reduce((acc, s) => acc + s.interactions.length, 0) },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 text-center min-w-[72px]">
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-[10px] font-medium leading-tight" style={{ color: role.textLight }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Role tabs */}
          <div className="flex gap-2 mt-8 flex-wrap">
            {(['usuario', 'profesional', 'admin'] as const).map(r => {
              const cfg = ROLES[r];
              const isActive = activeRole === r;
              return (
                <button
                  key={r}
                  onClick={() => { setActiveRole(r); setSelectedStep(null); }}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    isActive ? 'bg-white shadow-lg' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}
                  style={isActive ? { color: cfg.color } : {}}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isActive ? cfg.color : '#fff' }} />
                  {cfg.label}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-[#F3F4F6]' : 'bg-white/15'}`}
                    style={isActive ? { color: cfg.color } : { color: '#fff' }}>
                    {cfg.steps.length}
                  </span>
                </button>
              );
            })}
            <div className="ml-auto">
              <button
                onClick={handleWalkthrough}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#111827] rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
              >
                <Play className="w-4 h-4" style={{ color: role.color }} /> Recorrer flujo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Flow Diagram ── */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Instructions bar */}
        <div className="flex items-center gap-3 mb-8 p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
          <MousePointer className="w-5 h-5 flex-shrink-0" style={{ color: role.color }} />
          <p className="text-sm text-[#374151]">
            <strong>Clic en un paso</strong> para ver detalles. <strong>Clic en "Ir a la pantalla"</strong> para abrir la vista del prototipo.
            Desliza horizontalmente para ver todos los pasos.
          </p>
          {selectedStep && (
            <button
              onClick={() => setSelectedStep(null)}
              className="ml-auto flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#374151] transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Cerrar
            </button>
          )}
        </div>

        {/* Horizontal flow */}
        <div
          ref={flowRef}
          className="overflow-x-auto pb-8 -mx-2 px-2"
        >
          <div className="flex items-start gap-0 min-w-max">
            {role.steps.map((step, i) => (
              <React.Fragment key={step.id}>
                <StepCard
                  step={step}
                  color={role.color}
                  lightBg={role.lightBg}
                  borderColor={role.borderColor}
                  isActive={selectedStep === step.id}
                  onSelect={handleSelect}
                />
                {i < role.steps.length - 1 && (
                  <FlowArrow
                    color={role.color}
                    label={
                      step.id === 'search' && activeRole === 'usuario' ? 'Ver mapa' :
                      step.id === 'map' && activeRole === 'usuario' ? 'Seleccionar' :
                      step.id === 'profile' && activeRole === 'usuario' ? 'Agendar' :
                      step.id === 'booking' && activeRole === 'usuario' ? 'Confirmar' :
                      step.id === 'confirm' && activeRole === 'usuario' ? 'Completado' :
                      step.id === 'receive' && activeRole === 'profesional' ? 'Revisar' :
                      undefined
                    }
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { color: role.color, bg: role.lightBg, label: 'Pantalla del prototipo', desc: 'Vista navegable con interacciones', icon: Eye },
            { color: '#D97706', bg: '#FFFBEB', label: 'Punto de decisión', desc: 'Bifurcación del flujo según acción', icon: GitBranch },
            { color: '#10B981', bg: '#ECFDF5', label: 'Resultado positivo', desc: 'Acción confirmada con éxito', icon: CheckCircle2 },
            { color: '#EF4444', bg: '#FEF2F2', label: 'Resultado negativo', desc: 'Acción rechazada o cancelada', icon: XCircle },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-[#E5E7EB]">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.bg }}>
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full connection map - all 3 flows overview */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#1E40AF]/10 rounded-xl flex items-center justify-center">
              <Wrench className="w-4 h-4 text-[#1E40AF]" />
            </div>
            <div>
              <h2 className="font-bold text-[#111827]">Mapa completo de navegación</h2>
              <p className="text-xs text-[#9CA3AF]">Conexiones entre pantallas de los 3 roles</p>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(ROLES).map(([roleKey, cfg]) => (
              <div key={roleKey}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <p className="text-sm font-bold text-[#374151]">{cfg.label}</p>
                  <span className="text-xs text-[#9CA3AF]">· {cfg.steps.length} pasos</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {cfg.steps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <React.Fragment key={step.id}>
                        <Link
                          to={step.path}
                          onClick={() => setActiveRole(roleKey as any)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all hover:shadow-md hover:-translate-y-0.5"
                          style={{
                            backgroundColor: step.type === 'decision' ? '#FFFBEB' : cfg.lightBg,
                            borderColor: step.type === 'decision' ? '#FCD34D' : cfg.borderColor,
                            color: step.type === 'decision' ? '#D97706' : cfg.color,
                          }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{step.title}</span>
                          {step.type === 'decision' && <GitBranch className="w-3 h-3 ml-0.5 opacity-70" />}
                        </Link>
                        {i < cfg.steps.length - 1 && (
                          <ChevronRight className="w-4 h-4 text-[#D1D5DB] flex-shrink-0" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick navigation grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Object.entries(ROLES).map(([roleKey, cfg]) => (
            <div
              key={roleKey}
              className={`rounded-2xl border-2 overflow-hidden transition-all ${activeRole === roleKey ? 'shadow-lg' : 'shadow-sm'}`}
              style={{ borderColor: activeRole === roleKey ? cfg.color : '#E5E7EB' }}
            >
              {/* Card header */}
              <div className={`bg-gradient-to-br p-5 ${cfg.gradient}`}>
                <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">{cfg.steps.length} pasos</p>
                <h3 className="text-lg font-black text-white">{cfg.label}</h3>
                <p className="text-xs text-white/70 mt-1 leading-snug">{cfg.tagline}</p>
              </div>

              {/* Steps list */}
              <div className="bg-white divide-y divide-[#F3F4F6]">
                {cfg.steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <Link
                      key={step.id}
                      to={step.path}
                      onClick={() => setActiveRole(roleKey as any)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors group"
                    >
                      <span className="text-[10px] font-black text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: step.type === 'decision' ? '#D97706' : cfg.color }}>
                        {i + 1}
                      </span>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: step.type === 'decision' ? '#FFFBEB' : cfg.lightBg }}>
                        <Icon className="w-3.5 h-3.5"
                          style={{ color: step.type === 'decision' ? '#D97706' : cfg.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#111827] group-hover:text-[#1E40AF] transition-colors truncate">{step.title}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{step.subtitle}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB] group-hover:text-[#1E40AF] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>

              {/* Footer CTA */}
              <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
                <button
                  onClick={() => { setActiveRole(roleKey as any); setSelectedStep(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 text-white"
                  style={{ backgroundColor: cfg.color }}
                >
                  Ver diagrama completo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Step Detail Modal ── */}
      {selectedStep && (
        <StepDetail
          step={activeStepData}
          color={role.color}
          lightBg={role.lightBg}
          onClose={() => setSelectedStep(null)}
        />
      )}
    </div>
  );
}
