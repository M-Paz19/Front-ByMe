import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Wrench, ChevronRight, Eye, EyeOff, Search, Mail, Lock,
  MapPin, Calendar, Star, Shield, Award, Clock, CheckCircle2,
  AlertCircle, XCircle, Briefcase, Settings, LogOut, Bell,
  LayoutDashboard, History, Plus, X, Info, Phone, User,
  ArrowRight, Layers, Palette, Type, Grid3x3, MousePointer2
} from 'lucide-react';
import { professionals } from '../data/mockData';

// ── Color data ────────────────────────────────────────────────────────────
const PRIMARY_SCALE = [
  { shade: '50',  hex: '#EFF6FF', label: 'Fondo énfasis' },
  { shade: '100', hex: '#DBEAFE', label: 'Selección' },
  { shade: '200', hex: '#BFDBFE', label: 'Borde claro' },
  { shade: '300', hex: '#93C5FD', label: '' },
  { shade: '400', hex: '#60A5FA', label: '' },
  { shade: '500', hex: '#3B82F6', label: '' },
  { shade: '600', hex: '#2563EB', label: '' },
  { shade: '700', hex: '#1D4ED8', label: 'Hover' },
  { shade: '800', hex: '#1E40AF', label: '★ Principal' },
  { shade: '900', hex: '#1E3A8A', label: 'Texto énfasis' },
];

const SECONDARY_SCALE = [
  { shade: '50',  hex: '#ECFDF5', label: 'Fondo success' },
  { shade: '100', hex: '#D1FAE5', label: '' },
  { shade: '200', hex: '#A7F3D0', label: 'Borde' },
  { shade: '300', hex: '#6EE7B7', label: '' },
  { shade: '400', hex: '#34D399', label: '' },
  { shade: '500', hex: '#10B981', label: '★ Principal' },
  { shade: '600', hex: '#059669', label: '' },
  { shade: '700', hex: '#047857', label: 'Hover' },
  { shade: '800', hex: '#065F46', label: 'Texto' },
  { shade: '900', hex: '#064E3B', label: '' },
];

const GRAY_SCALE = [
  { shade: '50',  hex: '#F9FAFB', label: 'Fondo página' },
  { shade: '100', hex: '#F3F4F6', label: 'Fondo alt.' },
  { shade: '200', hex: '#E5E7EB', label: 'Bordes' },
  { shade: '300', hex: '#D1D5DB', label: 'Desactivado' },
  { shade: '400', hex: '#9CA3AF', label: 'Placeholder' },
  { shade: '500', hex: '#6B7280', label: 'Sec. text' },
  { shade: '600', hex: '#4B5563', label: '' },
  { shade: '700', hex: '#374151', label: 'Cuerpo' },
  { shade: '800', hex: '#1F2937', label: '' },
  { shade: '900', hex: '#111827', label: '★ Principal' },
];

const STATUS_COLORS = [
  { name: 'Éxito',        bg: '#ECFDF5', border: '#A7F3D0', text: '#10B981', dark: '#065F46', icon: CheckCircle2 },
  { name: 'Error',        bg: '#FEF2F2', border: '#FECACA', text: '#EF4444', dark: '#991B1B', icon: XCircle },
  { name: 'Advertencia',  bg: '#FFFBEB', border: '#FCD34D', text: '#D97706', dark: '#92400E', icon: AlertCircle },
  { name: 'Información',  bg: '#EFF6FF', border: '#BFDBFE', text: '#3B82F6', dark: '#1E40AF', icon: Info },
];

const TYPE_SCALE = [
  { name: 'Display',  size: '60px', weight: 800, tailwind: 'font-extrabold', sample: 'ByMe' },
  { name: 'H1',       size: '36px', weight: 700, tailwind: 'font-bold',       sample: 'Encuentra al experto perfecto' },
  { name: 'H2',       size: '28px', weight: 700, tailwind: 'font-bold',       sample: 'Profesionales verificados' },
  { name: 'H3',       size: '22px', weight: 600, tailwind: 'font-semibold',   sample: 'Plomería en Popayán' },
  { name: 'H4',       size: '18px', weight: 600, tailwind: 'font-semibold',   sample: 'Carlos Ramírez · Plomero Certificado' },
  { name: 'Large',    size: '16px', weight: 400, tailwind: 'font-normal',     sample: 'Conectamos tu hogar con los mejores técnicos locales.' },
  { name: 'Base',     size: '14px', weight: 400, tailwind: 'font-normal',     sample: 'Especialista en plomería residencial con más de 10 años de experiencia.' },
  { name: 'Small',    size: '12px', weight: 400, tailwind: 'font-normal',     sample: 'Responde en menos de 30 min · 283 trabajos completados' },
  { name: 'Caption',  size: '11px', weight: 500, tailwind: 'font-medium',     sample: 'CATEGORÍA · VERIFICADO · POPAYÁN' },
];

const SPACING_TOKENS = [
  { token: 'sp-0.5', px: '4px',  bar: 4,  tw: 'p-0.5' },
  { token: 'sp-1',   px: '8px',  bar: 8,  tw: 'p-1' },
  { token: 'sp-2',   px: '16px', bar: 16, tw: 'p-2' },
  { token: 'sp-3',   px: '24px', bar: 24, tw: 'p-3' },
  { token: 'sp-4',   px: '32px', bar: 32, tw: 'p-4' },
  { token: 'sp-6',   px: '48px', bar: 48, tw: 'p-6' },
  { token: 'sp-8',   px: '64px', bar: 64, tw: 'p-8' },
  { token: 'sp-10',  px: '80px', bar: 80, tw: 'p-10' },
  { token: 'sp-12',  px: '96px', bar: 96, tw: 'p-12' },
];

const NAV_SECTIONS = [
  { id: 'intro',       label: 'Introducción',     icon: Layers },
  { id: 'colores',     label: 'Colores',           icon: Palette },
  { id: 'tipografia',  label: 'Tipografía',        icon: Type },
  { id: 'espaciado',   label: 'Espaciado',         icon: Grid3x3 },
  { id: 'botones',     label: 'Botones',           icon: MousePointer2 },
  { id: 'formularios', label: 'Formularios',       icon: null },
  { id: 'cards',       label: 'Cards',             icon: null },
  { id: 'modal',       label: 'Modal',             icon: null },
  { id: 'navbar',      label: 'Navbar',            icon: null },
  { id: 'sidebar',     label: 'Sidebar',           icon: null },
  { id: 'badges',      label: 'Badges',            icon: null },
];

// ── Helper Components ─────────────────────────────────────────────────────
function SectionHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 pb-6 border-b-2 border-[#E5E7EB]">
      <h2 className="text-[22px] font-bold text-[#111827]">{title}</h2>
      <p className="text-sm text-[#6B7280] mt-1 max-w-xl">{subtitle}</p>
    </div>
  );
}

function PreviewBox({ label, children, dark = false }: { label?: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="mb-8">
      {label && (
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-[#E5E7EB]" />
          <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest px-2 flex-shrink-0">{label}</p>
          <div className="h-px flex-1 bg-[#E5E7EB]" />
        </div>
      )}
      <div className={`rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 ${dark ? 'bg-[#111827]' : 'bg-white'} shadow-sm`}>
        {children}
      </div>
    </div>
  );
}

function Token({ value }: { value: string }) {
  return (
    <code className="inline-block text-[11px] bg-[#F3F4F6] text-[#4B5563] px-2 py-0.5 rounded-md font-mono border border-[#E5E7EB]">
      {value}
    </code>
  );
}

function Divider() {
  return <div className="my-4 h-px bg-[#F3F4F6]" />;
}

// ── Main Component ────────────────────────────────────────────────────────
export function DesignSystem() {
  const [activeSection, setActiveSection] = useState('intro');
  const [showPassword, setShowPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toggleOn, setToggleOn] = useState(true);
  const [checkOn, setCheckOn] = useState(true);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const prof = professionals[0];

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 96;
      for (const s of [...NAV_SECTIONS].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(s.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#F9FAFB' }}>

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#E5E7EB] z-50 flex items-center px-4 sm:px-6 gap-2 shadow-sm">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-[#1E40AF] rounded-lg flex items-center justify-center">
            <Wrench className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-[#111827]">By<span className="text-[#10B981]">Me</span></span>
        </Link>
        <span className="text-[#D1D5DB] mx-1">/</span>
        <span className="text-sm text-[#6B7280] font-semibold">Design System</span>
        <div className="flex items-center gap-2 ml-2">
          <span className="hidden sm:inline text-[11px] font-bold bg-[#EFF6FF] text-[#1E40AF] px-2.5 py-1 rounded-full border border-[#BFDBFE]">v1.0.0</span>
          <span className="hidden md:inline text-[11px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full border border-[#E5E7EB]">React + Tailwind</span>
          <span className="hidden md:inline text-[11px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full border border-[#E5E7EB]">Inter</span>
        </div>
        <div className="ml-auto">
          <Link to="/" className="text-sm text-[#6B7280] hover:text-[#1E40AF] transition-colors flex items-center gap-1">
            <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Volver
          </Link>
        </div>
      </div>

      <div className="flex pt-14">

        {/* ── Sidebar Nav ─────────────────────────────────────── */}
        <aside className="fixed left-0 top-14 bottom-0 w-52 bg-white border-r border-[#E5E7EB] overflow-y-auto hidden lg:flex flex-col z-40">
          <div className="p-4 flex-1">
            <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-4 px-2">Navegación</p>
            <nav className="space-y-0.5">
              {NAV_SECTIONS.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                    activeSection === s.id
                      ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold'
                      : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]'
                  }`}
                >
                  {activeSection === s.id
                    ? <span className="w-1.5 h-1.5 rounded-full bg-[#1E40AF] flex-shrink-0" />
                    : <span className="w-1.5 h-1.5 rounded-full bg-transparent flex-shrink-0" />
                  }
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-[#E5E7EB]">
            <div className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]">
              <p className="text-[11px] font-bold text-[#374151] mb-1">ByMe Design System</p>
              <p className="text-[10px] text-[#9CA3AF] leading-relaxed">Marketplace de servicios locales · Popayán, Colombia 🇨🇴</p>
            </div>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────── */}
        <main className="lg:ml-52 flex-1 min-w-0 px-5 sm:px-8 lg:px-12 py-10 max-w-5xl">

          {/* ══════════════════════════════════════════════════════
              INTRODUCCIÓN
          ══════════════════════════════════════════════════════ */}
          <section id="intro" className="scroll-mt-20 mb-16">
            {/* Hero banner */}
            <div className="relative bg-gradient-to-br from-[#0F2460] via-[#1E40AF] to-[#3B82F6] rounded-3xl p-8 sm:p-12 text-white mb-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Wrench className="w-7 h-7 text-[#1E40AF]" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold">Design System</h1>
                    <p className="text-blue-200 text-sm">ByMe · Marketplace de servicios · Popayán</p>
                  </div>
                </div>
                <p className="text-blue-100 leading-relaxed max-w-2xl mb-6 text-sm sm:text-base">
                  Biblioteca de diseño unificada para la plataforma ByMe. Todos los componentes,
                  tokens y patrones han sido creados priorizando{' '}
                  <strong className="text-white">confianza, claridad y usabilidad</strong> para el
                  mercado local de Popayán.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['React 18', 'Tailwind CSS v4', 'Lucide Icons', 'Inter Font', '8px Grid System', 'Accesibilidad AA'].map(tag => (
                    <span key={tag} className="text-xs bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick-jump cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'colores',     icon: '🎨', label: 'Colores',     desc: 'Paleta primaria, secundaria y estados' },
                { id: 'tipografia',  icon: '✍️', label: 'Tipografía',  desc: 'Escala Inter, 9 niveles' },
                { id: 'espaciado',   icon: '📐', label: 'Espaciado',   desc: 'Sistema de 8px base' },
                { id: 'botones',     icon: '🔘', label: 'Botones',     desc: '5 variantes + estados' },
                { id: 'cards',       icon: '🃏', label: 'Cards',       desc: 'Profesional, compacta' },
                { id: 'badges',      icon: '🏷️', label: 'Badges',     desc: '8 tipos de estado' },
              ].map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
                >
                  <span className="text-2xl mb-3 block">{item.icon}</span>
                  <p className="text-sm font-bold text-[#111827] group-hover:text-[#1E40AF] transition-colors">{item.label}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5 leading-snug">{item.desc}</p>
                </a>
              ))}
            </div>

            {/* Companion links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <Link
                to="/flujo"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#ECFDF5] to-[#F0FDF4] border border-[#A7F3D0] rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#065F46] group-hover:text-[#10B981]">Ver User Flow →</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">Diagrama interactivo de flujos de los 3 roles</p>
                </div>
              </Link>
              <Link
                to="/"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#EFF6FF] to-[#F0F7FF] border border-[#BFDBFE] rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-10 h-10 bg-[#1E40AF] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1E3A8A] group-hover:text-[#1E40AF]">Abrir el prototipo →</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">Landing page y 10 pantallas completas</p>
                </div>
              </Link>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              COLORES
          ══════════════════════════════════════════════════════ */}
          <section id="colores" className="scroll-mt-20 mb-16">
            <SectionHead
              title="🎨 Colores"
              subtitle="Sistema de color semántico. Cada tono transmite un significado específico para garantizar consistencia visual."
            />

            {/* Primary scale */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-5 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-5 h-5 rounded-full bg-[#1E40AF] shadow-sm" />
                <p className="text-sm font-bold text-[#111827]">Azul Primario</p>
                <Token value="ByMe Blue · #1E40AF" />
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {PRIMARY_SCALE.map(c => (
                  <button
                    key={c.shade}
                    onClick={() => copyHex(c.hex)}
                    className="group text-left"
                    title={`Copiar ${c.hex}`}
                  >
                    <div
                      className="h-10 sm:h-14 rounded-xl border border-black/5 mb-1.5 group-hover:scale-105 transition-transform relative overflow-hidden"
                      style={{ backgroundColor: c.hex }}
                    >
                      {copiedHex === c.hex && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#374151]">{c.shade}</p>
                    <p className="text-[10px] text-[#9CA3AF] font-mono">{c.hex}</p>
                    {c.label && <p className="text-[9px] text-[#10B981] font-semibold hidden sm:block mt-0.5">{c.label}</p>}
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary scale */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-5 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-5 h-5 rounded-full bg-[#10B981] shadow-sm" />
                <p className="text-sm font-bold text-[#111827]">Verde Secundario</p>
                <Token value="ByMe Green · #10B981" />
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {SECONDARY_SCALE.map(c => (
                  <button key={c.shade} onClick={() => copyHex(c.hex)} className="group text-left">
                    <div
                      className="h-10 sm:h-14 rounded-xl border border-black/5 mb-1.5 group-hover:scale-105 transition-transform relative overflow-hidden"
                      style={{ backgroundColor: c.hex }}
                    >
                      {copiedHex === c.hex && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#374151]">{c.shade}</p>
                    <p className="text-[10px] text-[#9CA3AF] font-mono">{c.hex}</p>
                    {c.label && <p className="text-[9px] text-[#10B981] font-semibold hidden sm:block mt-0.5">{c.label}</p>}
                  </button>
                ))}
              </div>
            </div>

            {/* Grays */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-5 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-5 h-5 rounded-full bg-[#6B7280] shadow-sm" />
                <p className="text-sm font-bold text-[#111827]">Escala de Grises</p>
                <Token value="Gray · #6B7280" />
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {GRAY_SCALE.map(c => (
                  <button key={c.shade} onClick={() => copyHex(c.hex)} className="group text-left">
                    <div
                      className="h-10 sm:h-14 rounded-xl border border-[#E5E7EB] mb-1.5 group-hover:scale-105 transition-transform relative overflow-hidden"
                      style={{ backgroundColor: c.hex }}
                    >
                      {copiedHex === c.hex && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <CheckCircle2 className="w-4 h-4 text-[#374151]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#374151]">{c.shade}</p>
                    <p className="text-[10px] text-[#9CA3AF] font-mono">{c.hex}</p>
                    {c.label && <p className="text-[9px] text-[#6B7280] font-semibold hidden sm:block mt-0.5">{c.label}</p>}
                  </button>
                ))}
              </div>
            </div>

            {/* Status colors */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
              <p className="text-sm font-bold text-[#111827] mb-5">Estados del sistema</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STATUS_COLORS.map(s => (
                  <div
                    key={s.name}
                    className="rounded-2xl border p-4 flex items-start gap-4"
                    style={{ backgroundColor: s.bg, borderColor: s.border }}
                  >
                    <s.icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: s.text }} />
                    <div className="flex-1">
                      <p className="text-sm font-bold mb-2" style={{ color: s.dark }}>{s.name}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                        {[
                          { k: 'Background', v: s.bg },
                          { k: 'Border', v: s.border },
                          { k: 'Text', v: s.text },
                        ].map(t => (
                          <div key={t.k} className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm shadow-sm border border-black/10 flex-shrink-0" style={{ backgroundColor: t.v }} />
                            <span className="text-[10px] font-mono text-[#6B7280]">{t.k}: {t.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              TIPOGRAFÍA
          ══════════════════════════════════════════════════════ */}
          <section id="tipografia" className="scroll-mt-20 mb-16">
            <SectionHead
              title="✍️ Tipografía"
              subtitle="Inter — Fuente humanista sans-serif optimizada para pantallas. Claridad y legibilidad en todas las resoluciones."
            />

            {/* Font family */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 mb-5 text-center shadow-sm">
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">Familia tipográfica · Google Fonts</p>
              <p className="text-6xl font-bold text-[#111827] tracking-tight mb-3">Inter</p>
              <p className="text-sm text-[#6B7280] mb-1">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz</p>
              <p className="text-sm text-[#9CA3AF]">0 1 2 3 4 5 6 7 8 9  ·  @ # $ % & * ( ) + - = /  ·  ¡ ¿ á é í ó ú ñ ü</p>
            </div>

            {/* Type scale */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden mb-5 shadow-sm">
              <div className="hidden sm:grid grid-cols-12 gap-3 px-6 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <div className="col-span-2 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Nivel</div>
                <div className="col-span-1 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Size</div>
                <div className="col-span-2 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Weight</div>
                <div className="col-span-7 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Muestra</div>
              </div>
              <div className="divide-y divide-[#F9FAFB]">
                {TYPE_SCALE.map((t, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center px-6 py-4 hover:bg-[#F9FAFB] transition-colors">
                    <div className="sm:col-span-2">
                      <span className="text-xs font-bold text-[#374151] bg-[#F3F4F6] px-2.5 py-1 rounded-lg">{t.name}</span>
                    </div>
                    <div className="hidden sm:block sm:col-span-1">
                      <Token value={t.size} />
                    </div>
                    <div className="hidden sm:block sm:col-span-2">
                      <Token value={t.tailwind} />
                    </div>
                    <div className="sm:col-span-7">
                      <span
                        className="text-[#111827] leading-tight block"
                        style={{
                          fontSize: t.size,
                          fontWeight: t.weight,
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {t.sample}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Font weights */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-5">Pesos tipográficos disponibles</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {[
                  { name: 'Light',     w: 300, tw: 'font-light' },
                  { name: 'Regular',   w: 400, tw: 'font-normal' },
                  { name: 'Medium',    w: 500, tw: 'font-medium' },
                  { name: 'SemiBold',  w: 600, tw: 'font-semibold' },
                  { name: 'Bold',      w: 700, tw: 'font-bold' },
                  { name: 'ExtraBold', w: 800, tw: 'font-extrabold' },
                ].map(wt => (
                  <div key={wt.name}>
                    <p className="text-3xl text-[#111827] mb-1.5 tracking-tight" style={{ fontWeight: wt.w }}>
                      ByMe
                    </p>
                    <p className="text-xs text-[#6B7280] mb-1">{wt.name} · {wt.w}</p>
                    <Token value={wt.tw} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              ESPACIADO
          ══════════════════════════════════════════════════════ */}
          <section id="espaciado" className="scroll-mt-20 mb-16">
            <SectionHead
              title="📐 Espaciado"
              subtitle="Sistema de diseño basado en la unidad de 8px. Todos los espaciados son múltiplos de esta base para garantizar consistencia."
            />

            {/* Base unit callout */}
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-5 mb-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-[#1E40AF] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white font-black text-lg">8</span>
              </div>
              <div>
                <p className="font-bold text-[#1E40AF] mb-1">Unidad base = 8px</p>
                <p className="text-sm text-[#374151] leading-relaxed">
                  Cada token de espaciado es un múltiplo de 8px. Esto garantiza armonía visual,
                  alineación en cuadrículas y coherencia entre componentes en todas las vistas.
                </p>
              </div>
            </div>

            {/* Spacing tokens */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-5 shadow-sm">
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-5">Escala de espaciado</p>
              <div className="space-y-3">
                {SPACING_TOKENS.map(t => (
                  <div key={t.token} className="flex items-center gap-4">
                    <div className="w-20 flex-shrink-0">
                      <p className="text-xs font-bold text-[#374151]">{t.token}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{t.px}</p>
                    </div>
                    <div
                      className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] rounded-md h-5 flex-shrink-0 transition-all shadow-sm"
                      style={{ width: `${Math.min(t.bar, 240)}px` }}
                    />
                    <Token value={t.tw} />
                  </div>
                ))}
              </div>
            </div>

            {/* Border radius */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-6">Radio de borde</p>
              <div className="flex flex-wrap gap-8 items-end">
                {[
                  { label: 'none',  cls: 'rounded-none',   desc: '0px' },
                  { label: 'sm',    cls: 'rounded',        desc: '4px' },
                  { label: 'md',    cls: 'rounded-md',     desc: '6px' },
                  { label: 'lg',    cls: 'rounded-lg',     desc: '8px' },
                  { label: 'xl',    cls: 'rounded-xl',     desc: '12px' },
                  { label: '2xl',   cls: 'rounded-2xl',    desc: '16px' },
                  { label: '3xl',   cls: 'rounded-3xl',    desc: '24px' },
                  { label: 'full',  cls: 'rounded-full',   desc: '∞' },
                ].map(r => (
                  <div key={r.label} className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 bg-[#1E40AF]/10 border-2 border-[#1E40AF] ${r.cls}`} />
                    <p className="text-xs font-semibold text-[#374151]">{r.label}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              BOTONES
          ══════════════════════════════════════════════════════ */}
          <section id="botones" className="scroll-mt-20 mb-16">
            <SectionHead
              title="🔘 Botones"
              subtitle="Componentes de acción principales. Cada variante incluye estados Default, Hover, Activo y Deshabilitado."
            />

            {/* Primary */}
            <PreviewBox label="Botón Primario — bg-[#1E40AF]">
              <div className="space-y-6">
                {/* States */}
                <div>
                  <p className="text-xs text-[#9CA3AF] font-semibold mb-3 uppercase tracking-wider">Estados</p>
                  <div className="flex flex-wrap gap-4 items-end">
                    {[
                      { label: 'Default', cls: 'bg-[#1E40AF] text-white', token: 'bg-[#1E40AF]' },
                      { label: 'Hover',   cls: 'bg-[#1D4ED8] text-white shadow-lg shadow-blue-200', token: 'bg-[#1D4ED8] shadow-lg' },
                      { label: 'Activo',  cls: 'bg-[#1E3A8A] text-white ring-2 ring-[#1E40AF]/30 ring-offset-2', token: 'bg-[#1E3A8A] ring-2' },
                      { label: 'Disabled', cls: 'bg-[#1E40AF]/40 text-white/60 cursor-not-allowed', token: 'opacity-40' },
                    ].map(state => (
                      <div key={state.label} className="flex flex-col items-center gap-2">
                        <button className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${state.cls}`}>
                          {state.label}
                        </button>
                        <Token value={state.token} />
                      </div>
                    ))}
                    <div className="flex flex-col items-center gap-2">
                      <button className="px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Cargando
                      </button>
                      <Token value="animate-spin" />
                    </div>
                  </div>
                </div>
                <Divider />

                {/* With icons */}
                <div>
                  <p className="text-xs text-[#9CA3AF] font-semibold mb-3 uppercase tracking-wider">Con iconos</p>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition-colors">
                      <Calendar className="w-4 h-4" /> Agendar cita
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition-colors">
                      <Search className="w-4 h-4" /> Buscar
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 bg-[#1E40AF] text-white rounded-xl hover:bg-[#1D4ED8] transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <Divider />

                {/* Sizes */}
                <div>
                  <p className="text-xs text-[#9CA3AF] font-semibold mb-3 uppercase tracking-wider">Tamaños</p>
                  <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex flex-col items-center gap-2">
                      <button className="px-3 py-1.5 bg-[#1E40AF] text-white rounded-lg text-xs font-semibold">Pequeño</button>
                      <Token value="px-3 py-1.5 text-xs" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <button className="px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold">Mediano</button>
                      <Token value="px-5 py-2.5 text-sm" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <button className="px-7 py-3.5 bg-[#1E40AF] text-white rounded-xl font-semibold">Grande</button>
                      <Token value="px-7 py-3.5" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <button className="w-full px-8 py-3.5 bg-[#1E40AF] text-white rounded-xl font-semibold">Full width</button>
                      <Token value="w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </PreviewBox>

            {/* Secondary */}
            <PreviewBox label="Botón Secundario — Outline">
              <div className="flex flex-wrap gap-4 items-end">
                {[
                  { label: 'Default', cls: 'border-[#1E40AF] text-[#1E40AF]',                     token: 'border-[#1E40AF]' },
                  { label: 'Hover',   cls: 'border-[#1E40AF] text-[#1E40AF] bg-[#EFF6FF]',         token: 'bg-[#EFF6FF]' },
                  { label: 'Activo',  cls: 'border-[#1E40AF] text-[#1E40AF] bg-[#DBEAFE] ring-2 ring-[#1E40AF]/20', token: 'bg-[#DBEAFE] ring-2' },
                  { label: 'Disabled',cls: 'border-[#E5E7EB] text-[#D1D5DB] cursor-not-allowed',   token: 'border-[#E5E7EB] text-[#D1D5DB]' },
                ].map(state => (
                  <div key={state.label} className="flex flex-col items-center gap-2">
                    <button className={`px-5 py-2.5 border rounded-xl text-sm font-semibold transition-all ${state.cls}`}>
                      {state.label}
                    </button>
                    <Token value={state.token} />
                  </div>
                ))}
              </div>
            </PreviewBox>

            {/* Other variants */}
            <PreviewBox label="Otras variantes">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex flex-col items-center gap-2">
                  <button className="px-5 py-2.5 bg-[#10B981] text-white rounded-xl text-sm font-semibold hover:bg-[#059669] transition-colors">Éxito</button>
                  <Token value="bg-[#10B981]" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button className="px-5 py-2.5 bg-[#EF4444] text-white rounded-xl text-sm font-semibold hover:bg-[#DC2626] transition-colors">Destructivo</button>
                  <Token value="bg-[#EF4444]" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button className="px-5 py-2.5 bg-[#F3F4F6] text-[#374151] rounded-xl text-sm font-semibold hover:bg-[#E5E7EB] transition-colors">Ghost</button>
                  <Token value="bg-[#F3F4F6] text-[#374151]" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button className="px-5 py-2.5 text-[#1E40AF] rounded-xl text-sm font-semibold hover:bg-[#EFF6FF] transition-colors">Texto / Link</button>
                  <Token value="text-[#1E40AF]" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button className="px-5 py-2.5 bg-[#111827] text-white rounded-xl text-sm font-semibold hover:bg-[#1F2937] transition-colors">Oscuro</button>
                  <Token value="bg-[#111827]" />
                </div>
              </div>
            </PreviewBox>
          </section>

          {/* ══════════════════════════════════════════════════════
              FORMULARIOS
          ══════════════════════════════════════════════════════ */}
          <section id="formularios" className="scroll-mt-20 mb-16">
            <SectionHead
              title="📝 Formularios"
              subtitle="Campos de entrada con retroalimentación visual clara en cada estado. Accesibles y consistentes."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Inputs */}
              <PreviewBox label="Input de texto — Estados">
                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Default</p>
                    <input type="text" placeholder="Nombre completo" className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all bg-white text-[#111827]" />
                    <Token value="border-[#E5E7EB] rounded-xl" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Con icono izquierda</p>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                      <input type="email" placeholder="correo@email.com" className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all" />
                    </div>
                    <Token value="pl-10 (icono left)" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Error</p>
                    <input type="text" defaultValue="correo-invalido" className="w-full px-3 py-2.5 border border-[#EF4444] rounded-xl text-sm bg-[#FEF2F2] focus:outline-none focus:ring-2 focus:ring-[#EF4444]/20 text-[#111827]" />
                    <p className="text-xs text-[#EF4444] mt-1 flex items-center gap-1"><XCircle className="w-3 h-3" /> Correo electrónico no válido</p>
                    <Token value="border-[#EF4444] bg-[#FEF2F2]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Disabled</p>
                    <input type="text" defaultValue="Campo desactivado" disabled className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#9CA3AF] bg-[#F3F4F6] cursor-not-allowed" />
                    <Token value="bg-[#F3F4F6] cursor-not-allowed" />
                  </div>
                </div>
              </PreviewBox>

              <div className="space-y-0">
                <PreviewBox label="Contraseña con toggle">
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                      <input type={showPassword ? 'text' : 'password'} defaultValue="contraseña123" className="w-full pl-10 pr-10 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Token value="pr-10 + toggle button" />
                  </div>
                </PreviewBox>

                <PreviewBox label="Select">
                  <div>
                    <select className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] bg-white transition-all appearance-auto">
                      <option value="">Selecciona especialidad</option>
                      <option>Plomería</option>
                      <option>Electricidad</option>
                      <option>Pintura</option>
                      <option>Carpintería</option>
                    </select>
                    <Token value="appearance-auto rounded-xl" />
                  </div>
                </PreviewBox>

                <PreviewBox label="Textarea">
                  <div>
                    <textarea rows={3} placeholder="Describe el problema o instrucciones especiales..." className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] resize-none transition-all" />
                    <Token value="resize-none rounded-xl" />
                  </div>
                </PreviewBox>
              </div>
            </div>

            {/* Checkbox, Toggle, Radio */}
            <PreviewBox label="Controles de selección">
              <div className="flex flex-wrap gap-12">
                <div>
                  <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Checkbox</p>
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCheckOn(!checkOn)}>
                      <div className={`w-4.5 h-4.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${checkOn ? 'bg-[#1E40AF] border-[#1E40AF]' : 'border-[#D1D5DB] bg-white'}`}>
                        {checkOn && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-[#374151]">Activo</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-not-allowed opacity-40">
                      <div className="w-4 h-4 rounded border-2 border-[#D1D5DB] bg-[#F3F4F6]" />
                      <span className="text-sm text-[#9CA3AF]">Desactivado</span>
                    </label>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Toggle Switch</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setToggleOn(!toggleOn)} className={`relative w-11 h-6 rounded-full transition-colors ${toggleOn ? 'bg-[#1E40AF]' : 'bg-[#D1D5DB]'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${toggleOn ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="text-sm text-[#374151]">{toggleOn ? 'Activo' : 'Inactivo'}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Radio</p>
                  <div className="space-y-2.5">
                    {['Tarjeta / PSE', 'Efectivo'].map((opt, i) => (
                      <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${i === 0 ? 'border-[#1E40AF]' : 'border-[#D1D5DB]'}`}>
                          {i === 0 && <div className="w-2 h-2 rounded-full bg-[#1E40AF]" />}
                        </div>
                        <span className="text-sm text-[#374151]">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </PreviewBox>
          </section>

          {/* ══════════════════════════════════════════════════════
              CARDS
          ══════════════════════════════════════════════════════ */}
          <section id="cards" className="scroll-mt-20 mb-16">
            <SectionHead
              title="🃏 Cards"
              subtitle="Tarjetas de profesional en dos variantes: completa para grid y compacta para listas."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <PreviewBox label="Card completa — Grid view">
                <div className="max-w-xs mx-auto">
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer group">
                    <div className="relative h-28 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6]">
                      <div className="absolute top-3 left-3 bg-white/90 text-[#1E40AF] text-xs font-semibold px-2.5 py-1 rounded-full">Top Profesional</div>
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#10B981]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Disponible
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start gap-3 -mt-10 mb-3">
                        <img src={prof.photo} alt={prof.name} className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md flex-shrink-0" />
                        <div className="mt-8">
                          <h3 className="font-semibold text-[#111827] group-hover:text-[#1E40AF] transition-colors">{prof.name}</h3>
                          <p className="text-sm text-[#6B7280]">{prof.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(prof.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-[#D1D5DB] fill-[#D1D5DB]'}`} />)}
                        <span className="text-sm font-medium text-[#374151] ml-1">{prof.rating}</span>
                        <span className="text-sm text-[#9CA3AF]">({prof.reviewCount})</span>
                      </div>
                      <p className="text-sm text-[#6B7280] line-clamp-2 mb-4">{prof.shortDescription}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                        <span className="flex items-center gap-1 text-sm text-[#6B7280]"><MapPin className="w-3.5 h-3.5" />{prof.distance}</span>
                        <span className="text-sm font-bold text-[#1E40AF]">${prof.hourlyRate.toLocaleString()}/hr</span>
                      </div>
                    </div>
                  </div>
                </div>
              </PreviewBox>

              <PreviewBox label="Card compacta — List view">
                <div className="space-y-3">
                  {professionals.slice(0, 3).map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3 p-4 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#1E40AF]/40 hover:shadow-md transition-all cursor-pointer group">
                      <span className="w-6 h-6 rounded-full bg-[#1E40AF] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                      <img src={p.photo} alt={p.name} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#111827] truncate group-hover:text-[#1E40AF]">{p.name}</p>
                        <p className="text-xs text-[#6B7280]">{p.specialty}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-semibold text-[#374151]">{p.rating}</span>
                          <span className="text-xs text-[#9CA3AF] ml-1">{p.distance}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-[#1E40AF]">${p.hourlyRate.toLocaleString()}/hr</p>
                        <span className={`text-xs font-medium ${p.available ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                          ● {p.available ? 'Disponible' : 'Ocupado'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </PreviewBox>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              MODAL
          ══════════════════════════════════════════════════════ */}
          <section id="modal" className="scroll-mt-20 mb-16">
            <SectionHead
              title="🪟 Modal / Diálogo"
              subtitle="Componente de capa superior para confirmaciones, formularios y mensajes críticos."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Demo trigger */}
              <PreviewBox label="Demo interactivo">
                <div className="flex flex-col items-center justify-center gap-4 py-4">
                  <div className="w-14 h-14 bg-[#EFF6FF] rounded-2xl flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-[#1E40AF]" />
                  </div>
                  <p className="text-sm text-[#6B7280] text-center">Haz clic para abrir el modal de confirmación de reserva</p>
                  <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition-colors shadow-md shadow-blue-100">
                    <Calendar className="w-4 h-4" /> Abrir modal demo
                  </button>
                </div>
              </PreviewBox>

              {/* Anatomy */}
              <PreviewBox label="Anatomía estática">
                <div className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]">
                  <div className="bg-white rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
                      <h3 className="text-sm font-bold text-[#111827]">Confirmar reserva</h3>
                      <button className="w-6 h-6 flex items-center justify-center text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F3F4F6] rounded-lg transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-4 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                        <img src={prof.photo} alt="" className="w-9 h-9 rounded-xl object-cover" />
                        <div>
                          <p className="text-xs font-semibold text-[#111827]">{prof.name}</p>
                          <p className="text-[11px] text-[#6B7280]">Plomería · 28 Feb · 10:00 AM</p>
                        </div>
                      </div>
                      <p className="text-xs text-[#6B7280] leading-relaxed mb-4">Al confirmar, el profesional recibirá tu solicitud.</p>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 border border-[#E5E7EB] text-[#374151] rounded-xl text-xs font-semibold">Cancelar</button>
                        <button className="flex-1 py-2 bg-[#1E40AF] text-white rounded-xl text-xs font-semibold">Confirmar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </PreviewBox>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              NAVBAR
          ══════════════════════════════════════════════════════ */}
          <section id="navbar" className="scroll-mt-20 mb-16">
            <SectionHead
              title="🧭 Navbar"
              subtitle="Barra de navegación principal. Tres estados: visitante, autenticado y hero transparente."
            />

            <PreviewBox label="Estado: Visitante (sin sesión)">
              <div className="bg-[#F9FAFB] rounded-xl overflow-hidden border border-[#E5E7EB]">
                <div className="bg-white border-b border-[#E5E7EB] px-4 h-14 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#1E40AF] rounded-lg flex items-center justify-center"><Wrench className="w-3.5 h-3.5 text-white" /></div>
                      <span className="font-bold text-[#111827]">By<span className="text-[#10B981]">Me</span></span>
                    </div>
                    <div className="hidden sm:flex items-center gap-5">
                      <span className="text-sm text-[#374151] cursor-pointer hover:text-[#1E40AF]">Buscar servicios</span>
                      <span className="text-sm text-[#374151] cursor-pointer hover:text-[#1E40AF]">Cómo funciona</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-sm font-medium px-4 py-2 text-[#374151] rounded-lg hover:bg-[#F3F4F6] transition-colors">Iniciar sesión</button>
                    <button className="text-sm font-medium px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors">Registrarse</button>
                  </div>
                </div>
              </div>
            </PreviewBox>

            <PreviewBox label="Estado: Autenticado (usuario logueado)">
              <div className="bg-[#F9FAFB] rounded-xl overflow-hidden border border-[#E5E7EB]">
                <div className="bg-white border-b border-[#E5E7EB] px-4 h-14 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#1E40AF] rounded-lg flex items-center justify-center"><Wrench className="w-3.5 h-3.5 text-white" /></div>
                      <span className="font-bold text-[#111827]">By<span className="text-[#10B981]">Me</span></span>
                    </div>
                    <div className="hidden sm:flex items-center gap-5">
                      <span className="text-sm text-[#374151] cursor-pointer hover:text-[#1E40AF]">Buscar servicios</span>
                      <span className="text-sm text-[#374151] cursor-pointer hover:text-[#1E40AF]">Cómo funciona</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-[#6B7280] hover:bg-[#F3F4F6] rounded-full transition-colors relative">
                      <Bell className="w-4 h-4" />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] border border-white" />
                    </button>
                    <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-[#E5E7EB] hover:bg-[#F9FAFB] cursor-pointer">
                      <img src={professionals[3].photo} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-sm font-semibold text-[#111827]">Felipe</span>
                      <ChevronRight className="w-3 h-3 text-[#9CA3AF]" />
                    </div>
                  </div>
                </div>
              </div>
            </PreviewBox>

            <PreviewBox label="Estado: Transparente (sobre hero)" dark>
              <div className="rounded-xl overflow-hidden">
                <div className="bg-white/5 border-b border-white/20 px-4 h-14 flex items-center justify-between backdrop-blur-sm">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center"><Wrench className="w-3.5 h-3.5 text-white" /></div>
                      <span className="font-bold text-white">By<span className="text-[#34D399]">Me</span></span>
                    </div>
                    <div className="hidden sm:flex items-center gap-5">
                      <span className="text-sm text-white/80 cursor-pointer hover:text-white transition-colors">Buscar servicios</span>
                      <span className="text-sm text-white/80 cursor-pointer hover:text-white transition-colors">Cómo funciona</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-sm font-medium px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors">Iniciar sesión</button>
                    <button className="text-sm font-medium px-4 py-2 bg-white/15 text-white border border-white/25 rounded-lg hover:bg-white/25 transition-colors backdrop-blur-sm">Registrarse</button>
                  </div>
                </div>
              </div>
            </PreviewBox>
          </section>

          {/* ══════════════════════════════════════════════════════
              SIDEBAR
          ══════════════════════════════════════════════════════ */}
          <section id="sidebar" className="scroll-mt-20 mb-16">
            <SectionHead
              title="📊 Sidebar Dashboard"
              subtitle="Navegación lateral para paneles internos. Tres variantes según el rol del usuario."
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* User sidebar */}
              <div>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3 text-center">Panel Usuario</p>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
                  <div className="p-4 bg-[#F9FAFB] border-b border-[#E5E7EB] text-center">
                    <div className="relative inline-block mb-2">
                      <img src={professionals[3].photo} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#1E40AF] rounded-full border-2 border-white flex items-center justify-center"><CheckCircle2 className="w-2.5 h-2.5 text-white" /></div>
                    </div>
                    <p className="text-sm font-bold text-[#111827]">Felipe Arango</p>
                    <p className="text-xs text-[#9CA3AF]">Usuario verificado</p>
                  </div>
                  {[
                    { icon: LayoutDashboard, label: 'Mi panel', active: true },
                    { icon: History, label: 'Historial', active: false },
                    { icon: Settings, label: 'Mi perfil', active: false },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors ${item.active ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold border-r-2 border-[#1E40AF]' : 'text-[#374151] hover:bg-[#F9FAFB]'}`}>
                      <item.icon className="w-4 h-4 flex-shrink-0" />{item.label}
                    </div>
                  ))}
                  <div className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors border-t border-[#F3F4F6]">
                    <LogOut className="w-4 h-4 flex-shrink-0" /> Cerrar sesión
                  </div>
                </div>
              </div>

              {/* Professional sidebar */}
              <div>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3 text-center">Panel Profesional</p>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
                  <div className="p-4 bg-[#F9FAFB] border-b border-[#E5E7EB] text-center">
                    <div className="relative inline-block mb-2">
                      <img src={prof.photo} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white" />
                    </div>
                    <p className="text-sm font-bold text-[#111827]">{prof.name}</p>
                    <div className="flex items-center justify-center gap-0.5 mt-0.5">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-semibold text-[#374151]">{prof.rating}</span>
                    </div>
                  </div>
                  {[
                    { icon: LayoutDashboard, label: 'Mi panel', active: false },
                    { icon: Calendar, label: 'Solicitudes (2)', active: true },
                    { icon: Briefcase, label: 'Mis servicios', active: false },
                    { icon: Clock, label: 'Disponibilidad', active: false },
                    { icon: Settings, label: 'Editar perfil', active: false },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 px-4 py-2.5 text-xs cursor-pointer transition-colors ${item.active ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold border-r-2 border-[#1E40AF]' : 'text-[#374151] hover:bg-[#F9FAFB]'}`}>
                      <item.icon className="w-3.5 h-3.5 flex-shrink-0" />{item.label}
                    </div>
                  ))}
                  <div className="flex items-center gap-3 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 cursor-pointer transition-colors border-t border-[#F3F4F6]">
                    <LogOut className="w-3.5 h-3.5 flex-shrink-0" /> Cerrar sesión
                  </div>
                </div>
              </div>

              {/* Admin sidebar */}
              <div>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3 text-center">Panel Admin</p>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
                  <div className="p-4 bg-gradient-to-b from-[#1E40AF]/5 to-transparent border-b border-[#E5E7EB] text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-bold text-[#111827]">Administrador</p>
                    <p className="text-xs text-[#9CA3AF]">admin@byme.co</p>
                  </div>
                  {[
                    { icon: LayoutDashboard, label: 'Panel General', active: true },
                    { icon: User, label: 'Usuarios', active: false },
                    { icon: Briefcase, label: 'Profesionales', active: false },
                    { icon: Star, label: 'Reseñas', active: false },
                    { icon: Settings, label: 'Configuración', active: false },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 px-4 py-2.5 text-xs cursor-pointer transition-colors ${item.active ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold border-r-2 border-[#1E40AF]' : 'text-[#374151] hover:bg-[#F9FAFB]'}`}>
                      <item.icon className="w-3.5 h-3.5 flex-shrink-0" />{item.label}
                    </div>
                  ))}
                  <div className="flex items-center gap-3 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 cursor-pointer transition-colors border-t border-[#F3F4F6]">
                    <LogOut className="w-3.5 h-3.5 flex-shrink-0" /> Cerrar sesión
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              BADGES
          ══════════════════════════════════════════════════════ */}
          <section id="badges" className="scroll-mt-20 mb-16">
            <SectionHead
              title="🏷️ Badges de Estado"
              subtitle="Indicadores visuales compactos para transmitir estado, verificación y categoría de forma inmediata."
            />

            <PreviewBox label="Estados de reserva">
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Disponible',  dotCls: 'bg-[#10B981]', textCls: 'text-[#10B981]', bgCls: 'bg-[#ECFDF5]', borderCls: 'border-[#A7F3D0]', tw: 'bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0]' },
                  { label: 'Pendiente',   dotCls: 'bg-[#D97706]', textCls: 'text-[#D97706]', bgCls: 'bg-[#FFFBEB]', borderCls: 'border-[#FCD34D]', tw: 'bg-[#FFFBEB] text-[#D97706] border-[#FCD34D]' },
                  { label: 'Confirmado',  dotCls: 'bg-[#1E40AF]', textCls: 'text-[#1E40AF]', bgCls: 'bg-[#EFF6FF]', borderCls: 'border-[#BFDBFE]', tw: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' },
                  { label: 'Completado',  dotCls: 'bg-[#6B7280]', textCls: 'text-[#6B7280]', bgCls: 'bg-[#F3F4F6]', borderCls: 'border-[#E5E7EB]',  tw: 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]' },
                  { label: 'Cancelado',   dotCls: 'bg-[#EF4444]', textCls: 'text-[#EF4444]', bgCls: 'bg-[#FEF2F2]', borderCls: 'border-[#FECACA]', tw: 'bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]' },
                ].map(b => (
                  <div key={b.label} className="flex flex-col items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${b.textCls} ${b.bgCls} ${b.borderCls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${b.dotCls}`} />
                      {b.label}
                    </span>
                    <Token value={b.tw.split(' ')[0]} />
                  </div>
                ))}
              </div>
            </PreviewBox>

            <PreviewBox label="Badges de verificación y rol">
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]"><Shield className="w-3 h-3" /> Verificado</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]"><Award className="w-3 h-3" /> Top Profesional</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D]"><Star className="w-3 h-3 fill-current" /> Más Popular</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]"><CheckCircle2 className="w-3 h-3" /> Certificado</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]"><XCircle className="w-3 h-3" /> Inactivo</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#111827] text-white border border-[#1F2937]"><Shield className="w-3 h-3" /> Admin</span>
              </div>
            </PreviewBox>

            <PreviewBox label="Indicador de disponibilidad">
              <div className="flex flex-wrap gap-5">
                {[
                  { text: '¡Disponible ahora!', dotCls: 'bg-[#10B981] animate-pulse', textCls: 'text-[#065F46]', bgCls: 'bg-[#ECFDF5]', borderCls: 'border-[#A7F3D0]', tw: 'animate-pulse' },
                  { text: 'No disponible',       dotCls: 'bg-[#EF4444]',               textCls: 'text-[#991B1B]', bgCls: 'bg-[#FEF2F2]', borderCls: 'border-[#FECACA]', tw: 'bg-[#FEF2F2]' },
                  { text: 'Disponible esta semana', dotCls: 'bg-[#D97706]',            textCls: 'text-[#92400E]', bgCls: 'bg-[#FFFBEB]', borderCls: 'border-[#FCD34D]', tw: 'bg-[#FFFBEB]' },
                ].map(b => (
                  <div key={b.text} className="flex flex-col items-start gap-1.5">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${b.bgCls} ${b.borderCls}`}>
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${b.dotCls}`} />
                      <span className={`text-sm font-semibold ${b.textCls}`}>{b.text}</span>
                    </div>
                    <Token value={b.tw} />
                  </div>
                ))}
              </div>
            </PreviewBox>

            <PreviewBox label="Tamaños de badge">
              <div className="flex flex-wrap gap-5 items-center">
                {[
                  { size: 'XS', textCls: 'text-[10px]', padCls: 'px-2 py-0.5', tw: 'text-[10px] px-2 py-0.5' },
                  { size: 'SM', textCls: 'text-xs',     padCls: 'px-2.5 py-1', tw: 'text-xs px-2.5 py-1' },
                  { size: 'MD', textCls: 'text-xs',     padCls: 'px-3 py-1.5', tw: 'text-xs px-3 py-1.5' },
                  { size: 'LG', textCls: 'text-sm',     padCls: 'px-4 py-2',   tw: 'text-sm px-4 py-2' },
                ].map(b => (
                  <div key={b.size} className="flex flex-col items-center gap-1.5">
                    <span className={`inline-block font-bold bg-[#EFF6FF] text-[#1E40AF] rounded-full border border-[#BFDBFE] ${b.textCls} ${b.padCls}`}>
                      {b.size} · Badge
                    </span>
                    <Token value={b.tw} />
                  </div>
                ))}
              </div>
            </PreviewBox>
          </section>

          {/* Footer */}
          <div className="text-center py-8 border-t border-[#E5E7EB] mt-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-6 bg-[#1E40AF] rounded-lg flex items-center justify-center"><Wrench className="w-3 h-3 text-white" /></div>
              <span className="font-bold text-[#111827]">By<span className="text-[#10B981]">Me</span></span>
              <span className="text-[11px] font-bold bg-[#EFF6FF] text-[#1E40AF] px-2 py-0.5 rounded-full border border-[#BFDBFE] ml-1">Design System v1.0.0</span>
            </div>
            <p className="text-xs text-[#9CA3AF]">Popayán, Colombia · React + Tailwind CSS v4 · Inter Font</p>
          </div>
        </main>
      </div>

      {/* ── Modal Demo ──────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full border border-[#E5E7EB] z-10 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#EFF6FF] rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#1E40AF]" />
                </div>
                <h3 className="font-bold text-[#111827]">Confirmar reserva</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-7 h-7 flex items-center justify-center text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F3F4F6] rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-5 p-4 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB]">
                <img src={prof.photo} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-[#111827]">{prof.name}</p>
                  <p className="text-sm text-[#6B7280]">{prof.specialty}</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                    <span className="text-xs text-[#374151] ml-1">{prof.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#9CA3AF]">Total</p>
                  <p className="font-bold text-[#1E40AF]">$50.000</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { icon: Calendar, label: 'Fecha',     value: '28 de Febrero 2025' },
                  { icon: Clock,    label: 'Hora',      value: '10:00 AM' },
                  { icon: MapPin,   label: 'Dirección', value: 'Cra 5 #8-45, Centro' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#EFF6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-[#1E40AF]" />
                    </div>
                    <span className="text-xs text-[#9CA3AF] w-16 flex-shrink-0">{item.label}</span>
                    <span className="text-sm font-medium text-[#374151]">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 p-3 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] mb-6">
                <Shield className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                <p className="text-xs text-[#065F46]">Tu pago está 100% protegido por ByMe hasta que el servicio sea completado.</p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-3 border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-semibold hover:bg-[#F9FAFB] transition-colors">
                Cancelar
              </button>
              <button onClick={() => setModalOpen(false)} className="flex-1 py-3 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-100">
                <CheckCircle2 className="w-4 h-4" /> Confirmar reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
