import React, { useState, useEffect, useRef } from 'react';
import {
  Wrench, Search, MapPin, Star, Bell, ChevronDown, LogOut,
  User, Settings, Shield, Briefcase, CheckCircle2, XCircle,
  AlertCircle, Clock, Calendar, Phone, Mail, Heart, Share2,
  Plus, Edit3, Home, LayoutDashboard, History, Menu, X, Award,
  ChevronRight, ArrowRight, Palette, Type, Box, Layers,
  MousePointer, Copy, Check, Zap, Droplets, Hammer, Sparkles
} from 'lucide-react';
import { IMGS } from '../data/mockData';

/* ─────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────── */

const COLORS = {
  primary: [
    { name: 'Primary 900', hex: '#1E3A8A', token: 'blue-900', use: 'Texto sobre fondo claro' },
    { name: 'Primary 800', hex: '#1E40AF', token: 'blue-800', use: 'Color principal de marca', main: true },
    { name: 'Primary 600', hex: '#2563EB', token: 'blue-600', use: 'Hover sobre botones' },
    { name: 'Primary 400', hex: '#60A5FA', token: 'blue-400', use: 'Íconos sobre fondos oscuros' },
    { name: 'Primary 200', hex: '#BFDBFE', token: 'blue-200', use: 'Bordes activos suaves' },
    { name: 'Primary 50', hex: '#EFF6FF', token: 'blue-50', use: 'Fondos activos, highlights' },
  ],
  secondary: [
    { name: 'Secondary 700', hex: '#047857', token: 'green-700', use: 'Texto de éxito sobre fondo claro' },
    { name: 'Secondary 500', hex: '#10B981', token: 'green-500', use: 'Color secundario de marca', main: true },
    { name: 'Secondary 400', hex: '#34D399', token: 'green-400', use: 'Acentos, íconos de estado' },
    { name: 'Secondary 200', hex: '#A7F3D0', token: 'green-200', use: 'Bordes de estado disponible' },
    { name: 'Secondary 50', hex: '#ECFDF5', token: 'green-50', use: 'Fondos de estado disponible' },
  ],
  grays: [
    { name: 'Gray 900', hex: '#111827', token: 'gray-900', use: 'Texto principal' },
    { name: 'Gray 700', hex: '#374151', token: 'gray-700', use: 'Texto secundario oscuro' },
    { name: 'Gray 500', hex: '#6B7280', token: 'gray-500', use: 'Texto placeholder y subtítulos' },
    { name: 'Gray 400', hex: '#9CA3AF', token: 'gray-400', use: 'Íconos inactivos' },
    { name: 'Gray 200', hex: '#E5E7EB', token: 'gray-200', use: 'Bordes y separadores', main: true },
    { name: 'Gray 100', hex: '#F3F4F6', token: 'gray-100', use: 'Fondos de inputs' },
    { name: 'Gray 50', hex: '#F9FAFB', token: 'gray-50', use: 'Fondo de página', main: true },
  ],
  status: [
    { name: 'Success', hex: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', use: 'Confirmado, disponible, éxito' },
    { name: 'Warning', hex: '#D97706', bg: '#FFFBEB', border: '#FCD34D', use: 'Pendiente, precaución' },
    { name: 'Error', hex: '#EF4444', bg: '#FEF2F2', border: '#FECACA', use: 'Error, cancelado, no disponible' },
    { name: 'Info', hex: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE', use: 'Información, notificaciones' },
  ],
};

const TYPOGRAPHY = [
  { tag: 'H1', size: '36px', weight: '700 Bold', lh: '1.2', sample: 'Encuentra el profesional perfecto', class: 'text-4xl font-bold', use: 'Héroes, página principal' },
  { tag: 'H2', size: '30px', weight: '700 Bold', lh: '1.3', sample: 'Profesionales destacados', class: 'text-3xl font-bold', use: 'Títulos de sección' },
  { tag: 'H3', size: '24px', weight: '600 Semibold', lh: '1.4', sample: 'Servicios ofrecidos', class: 'text-2xl font-semibold', use: 'Subtítulos de tarjeta' },
  { tag: 'H4', size: '20px', weight: '600 Semibold', lh: '1.5', sample: 'Reservar servicio', class: 'text-xl font-semibold', use: 'Títulos de sidebar, modales' },
  { tag: 'Body L', size: '18px', weight: '400 Regular', lh: '1.6', sample: 'Conectamos con profesionales locales verificados de Popayán.', class: 'text-lg', use: 'Subtítulos hero' },
  { tag: 'Body', size: '16px', weight: '400 Regular', lh: '1.6', sample: 'Especialista en plomería residencial y comercial con más de 10 años de experiencia en Popayán.', class: 'text-base', use: 'Texto general, descripciones' },
  { tag: 'Body S', size: '14px', weight: '400 Regular', lh: '1.5', sample: 'Plomería residencial y comercial, reparaciones urgentes disponibles 24h.', class: 'text-sm', use: 'Labels, metadata, ayuda' },
  { tag: 'Caption', size: '12px', weight: '400 Regular', lh: '1.4', sample: 'Miembro desde Enero 2025 · 283 trabajos completados', class: 'text-xs', use: 'Notas, fechas, pie de foto' },
];

const SPACING = [
  { name: '1', px: '4px', rem: '0.25rem', token: 'p-1', use: 'Gap mínimo, separador' },
  { name: '2', px: '8px', rem: '0.5rem', token: 'p-2', use: 'Padding interno de badge' },
  { name: '3', px: '12px', rem: '0.75rem', token: 'p-3', use: 'Padding pequeño de card' },
  { name: '4', px: '16px', rem: '1rem', token: 'p-4', use: 'Padding estándar de card', main: true },
  { name: '5', px: '20px', rem: '1.25rem', token: 'p-5', use: 'Padding de sección card' },
  { name: '6', px: '24px', rem: '1.5rem', token: 'p-6', use: 'Padding cómodo de formulario', main: true },
  { name: '8', px: '32px', rem: '2rem', token: 'p-8', use: 'Padding de modal' },
  { name: '12', px: '48px', rem: '3rem', token: 'p-12', use: 'Padding de sección hero' },
  { name: '16', px: '64px', rem: '4rem', token: 'p-16', use: 'Separación entre secciones', main: true },
  { name: '20', px: '80px', rem: '5rem', token: 'p-20', use: 'Secciones de landing' },
];

const RADII = [
  { name: 'sm', px: '4px', token: 'rounded-sm', use: 'Badges compactos' },
  { name: 'md', px: '8px', token: 'rounded-lg', use: 'Botones pequeños, tooltips' },
  { name: 'lg', px: '12px', token: 'rounded-xl', use: 'Botones estándar, inputs', main: true },
  { name: 'xl', px: '16px', token: 'rounded-2xl', use: 'Cards, modales, panels', main: true },
  { name: '2xl', px: '24px', token: 'rounded-3xl', use: 'CTA sections, hero blocks' },
  { name: 'full', px: '9999px', token: 'rounded-full', use: 'Badges de estado, avatares', main: true },
];

const SECTIONS = [
  { id: 'colores', label: 'Colores', icon: Palette },
  { id: 'tipografia', label: 'Tipografía', icon: Type },
  { id: 'espaciado', label: 'Espaciado', icon: Layers },
  { id: 'botones', label: 'Botones', icon: MousePointer },
  { id: 'inputs', label: 'Inputs & Select', icon: Box },
  { id: 'cards', label: 'Card Profesional', icon: Briefcase },
  { id: 'badges', label: 'Badges de estado', icon: CheckCircle2 },
  { id: 'modal', label: 'Modal', icon: Layers },
  { id: 'navbar', label: 'Navbar', icon: Menu },
  { id: 'sidebar', label: 'Sidebar Dashboard', icon: LayoutDashboard },
];

/* ─────────────────────────────────────────────────────────
   HELPER COMPONENTS
───────────────────────────────────────────────────────── */

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="w-10 h-10 rounded-xl bg-[#1E40AF] flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-white text-sm font-bold">{number}</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">{title}</h2>
        <p className="text-[#6B7280] mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function Token({ label }: { label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(label);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280] text-xs px-2 py-0.5 rounded font-mono transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
      {label}
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-[#E5E7EB] my-10" />;
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */

export function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState('colores');
  const [modalOpen, setModalOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [selectVal, setSelectVal] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Page hero */}
      <div className="bg-gradient-to-br from-[#1E40AF] to-[#2563EB] text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
                <Palette className="w-3.5 h-3.5 text-[#34D399]" />
                <span className="text-sm text-white/90">ByMe · Sistema de Diseño v1.0</span>
              </div>
              <h1 className="text-4xl font-bold mb-3 leading-tight">Design System <span className="text-[#34D399]">ByMe</span></h1>
              <p className="text-blue-200 max-w-xl leading-relaxed">
                Guía completa de tokens de diseño, componentes reutilizables y patrones de interfaz
                para la plataforma ByMe. Construido sobre Tailwind CSS v4 e Inter.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              {[
                { label: 'Versión', value: '1.0.0' },
                { label: 'Componentes', value: '10+' },
                { label: 'Tokens', value: '40+' },
                { label: 'Fuente', value: 'Inter' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center backdrop-blur-sm">
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-blue-200">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex gap-8">

        {/* ── STICKY SIDEBAR ── */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-[#E5E7EB]">
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">Secciones</p>
            </div>
            <nav className="py-1">
              {SECTIONS.map((sec, i) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all text-left ${
                      isActive
                        ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold border-r-2 border-[#1E40AF]'
                        : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#374151]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="px-4 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB]">
              <p className="text-xs text-[#9CA3AF]">Haz clic para navegar</p>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 min-w-0 space-y-2">

          {/* ══════════════════════════════════════════
              1. COLORES
          ══════════════════════════════════════════ */}
          <section id="colores" className="scroll-mt-20 bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8">
            <SectionHeader number="01" title="Colores" subtitle="Paleta de color completa con tokens de diseño y casos de uso" />

            {/* Primary */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#1E40AF]" />
                <h3 className="font-bold text-[#111827]">Color Primario</h3>
                <span className="text-xs text-[#9CA3AF]">Azul · Confianza, profesionalismo</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {COLORS.primary.map(c => (
                  <div key={c.hex} className={`rounded-xl overflow-hidden border ${c.main ? 'border-[#1E40AF]/30 ring-2 ring-[#1E40AF]/20' : 'border-[#E5E7EB]'}`}>
                    <div className="h-16" style={{ backgroundColor: c.hex }} />
                    <div className="p-2.5 bg-white">
                      {c.main && <span className="text-[10px] font-bold text-[#1E40AF] bg-[#EFF6FF] px-1.5 py-0.5 rounded mb-1 inline-block">Principal</span>}
                      <p className="text-xs font-semibold text-[#111827]">{c.name}</p>
                      <p className="text-[10px] text-[#9CA3AF] font-mono mt-0.5">{c.hex}</p>
                      <p className="text-[10px] text-[#6B7280] mt-1 leading-tight">{c.use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                <h3 className="font-bold text-[#111827]">Color Secundario</h3>
                <span className="text-xs text-[#9CA3AF]">Verde · Disponibilidad, éxito, confianza</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {COLORS.secondary.map(c => (
                  <div key={c.hex} className={`rounded-xl overflow-hidden border ${c.main ? 'border-[#10B981]/30 ring-2 ring-[#10B981]/20' : 'border-[#E5E7EB]'}`}>
                    <div className="h-16" style={{ backgroundColor: c.hex }} />
                    <div className="p-2.5 bg-white">
                      {c.main && <span className="text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] px-1.5 py-0.5 rounded mb-1 inline-block">Principal</span>}
                      <p className="text-xs font-semibold text-[#111827]">{c.name}</p>
                      <p className="text-[10px] text-[#9CA3AF] font-mono mt-0.5">{c.hex}</p>
                      <p className="text-[10px] text-[#6B7280] mt-1 leading-tight">{c.use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grays */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#6B7280]" />
                <h3 className="font-bold text-[#111827]">Escala de Grises</h3>
                <span className="text-xs text-[#9CA3AF]">Texto, bordes, fondos</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {COLORS.grays.map(c => (
                  <div key={c.hex} className={`rounded-xl overflow-hidden border ${c.main ? 'border-[#374151]/20 ring-1 ring-[#374151]/10' : 'border-[#E5E7EB]'}`}>
                    <div className="h-12 border-b border-[#E5E7EB]/50" style={{ backgroundColor: c.hex }} />
                    <div className="p-2 bg-white">
                      <p className="text-[10px] font-semibold text-[#111827] leading-tight">{c.name}</p>
                      <p className="text-[10px] text-[#9CA3AF] font-mono">{c.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <h3 className="font-bold text-[#111827]">Estados del Sistema</h3>
                <span className="text-xs text-[#9CA3AF]">Feedback visual y semántico</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {COLORS.status.map(c => (
                  <div key={c.name} className="rounded-xl border overflow-hidden" style={{ borderColor: c.border }}>
                    <div className="h-3" style={{ backgroundColor: c.hex }} />
                    <div className="p-4" style={{ backgroundColor: c.bg }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                        <p className="text-sm font-bold text-[#111827]">{c.name}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#6B7280]">Text</span>
                          <span className="text-[10px] font-mono text-[#374151]">{c.hex}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#6B7280]">Bg</span>
                          <span className="text-[10px] font-mono text-[#374151]">{c.bg}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#6B7280]">Border</span>
                          <span className="text-[10px] font-mono text-[#374151]">{c.border}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#6B7280] mt-2 pt-2 border-t" style={{ borderColor: c.border }}>{c.use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              2. TIPOGRAFÍA
          ══════════════════════════════════════════ */}
          <section id="tipografia" className="scroll-mt-20 bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8">
            <SectionHeader number="02" title="Tipografía" subtitle="Jerarquía visual con Inter · Sistema de tamaños basado en escala modular" />

            <div className="mb-6 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex items-center gap-4">
              <div>
                <p className="text-2xl font-bold text-[#111827]" style={{ fontFamily: 'Inter, sans-serif' }}>Inter</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Google Fonts · Variable font · Pesos: 300 → 800</p>
              </div>
              <div className="h-10 w-px bg-[#E5E7EB]" />
              <p className="text-2xl text-[#6B7280] tracking-widest">AaBbCc 0123</p>
              <div className="ml-auto">
                <Token label="font-family: Inter" />
              </div>
            </div>

            <div className="space-y-1">
              {TYPOGRAPHY.map((t, i) => (
                <div key={i} className={`group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl hover:bg-[#F9FAFB] border border-transparent hover:border-[#E5E7EB] transition-all`}>
                  {/* Tag */}
                  <div className="w-16 flex-shrink-0">
                    <span className="inline-block bg-[#EFF6FF] text-[#1E40AF] text-xs font-bold px-2.5 py-1 rounded-lg">{t.tag}</span>
                  </div>
                  {/* Specs */}
                  <div className="w-40 flex-shrink-0">
                    <div className="flex flex-wrap gap-1">
                      <Token label={t.size} />
                      <Token label={t.weight.split(' ')[0]} />
                      <Token label={`lh: ${t.lh}`} />
                    </div>
                    <p className="text-[10px] text-[#9CA3AF] mt-1">{t.use}</p>
                  </div>
                  {/* Sample */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[#111827] leading-snug ${t.class} truncate`}
                    >
                      {t.sample}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Font weights showcase */}
            <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
              <h4 className="font-semibold text-[#111827] mb-4">Pesos de tipografía</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { weight: 300, label: 'Light', sample: 'ByMe Plomería' },
                  { weight: 400, label: 'Regular', sample: 'ByMe Plomería' },
                  { weight: 600, label: 'Semibold', sample: 'ByMe Plomería' },
                  { weight: 700, label: 'Bold', sample: 'ByMe Plomería' },
                ].map(w => (
                  <div key={w.weight} className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB]">
                    <p style={{ fontWeight: w.weight }} className="text-lg text-[#111827] mb-1">{w.sample}</p>
                    <p className="text-xs text-[#9CA3AF]">{w.weight} · {w.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              3. ESPACIADO
          ══════════════════════════════════════════ */}
          <section id="espaciado" className="scroll-mt-20 bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8">
            <SectionHeader number="03" title="Espaciado" subtitle="Sistema de 8px · Consistencia y ritmo visual en toda la plataforma" />

            <div className="mb-6 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex items-center gap-3">
              <div className="w-2 h-2 bg-[#1E40AF] rounded" />
              <p className="text-sm text-[#374151]">
                <strong>Base unit:</strong> 4px · Todos los espaciados son múltiplos de 4px para coherencia de cuadrícula
              </p>
            </div>

            {/* Visual scale */}
            <div className="space-y-3 mb-8">
              {SPACING.map(s => (
                <div key={s.name} className={`flex items-center gap-4 group p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors ${s.main ? 'bg-[#F9FAFB]' : ''}`}>
                  <div className="w-16 text-right flex-shrink-0">
                    <Token label={s.token} />
                  </div>
                  <div className="w-16 flex-shrink-0 text-center">
                    <span className="text-xs font-mono text-[#374151] font-semibold">{s.px}</span>
                  </div>
                  {/* Visual bar */}
                  <div className="flex-shrink-0">
                    <div
                      className="bg-[#1E40AF] rounded-sm h-5 opacity-80"
                      style={{ width: s.px }}
                    />
                  </div>
                  <div className="flex-1 text-xs text-[#9CA3AF]">{s.use}</div>
                  {s.main && (
                    <span className="text-[10px] bg-[#EFF6FF] text-[#1E40AF] px-2 py-0.5 rounded-full flex-shrink-0">Más usado</span>
                  )}
                </div>
              ))}
            </div>

            {/* Border radius */}
            <div>
              <h3 className="font-bold text-[#111827] mb-4">Bordes redondeados</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {RADII.map(r => (
                  <div key={r.name} className={`p-4 border bg-[#F9FAFB] text-center ${r.main ? 'border-[#1E40AF]/30 bg-[#EFF6FF]/50' : 'border-[#E5E7EB]'}`}
                    style={{ borderRadius: r.px }}>
                    <p className="text-sm font-bold text-[#111827]">{r.name}</p>
                    <p className="text-xs font-mono text-[#9CA3AF] mt-0.5">{r.px}</p>
                    <div className="mt-2">
                      <Token label={r.token} />
                    </div>
                    <p className="text-[10px] text-[#6B7280] mt-1.5 leading-tight">{r.use}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              4. BOTONES
          ══════════════════════════════════════════ */}
          <section id="botones" className="scroll-mt-20 bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8">
            <SectionHeader number="04" title="Botones" subtitle="Variantes y estados de interacción para todos los contextos" />

            {/* Button variants */}
            <div className="space-y-8">

              {/* Primary */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-semibold text-[#111827]">Botón Primario</h3>
                  <Token label="bg-[#1E40AF]" />
                </div>
                <div className="flex flex-wrap items-center gap-3 p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  {/* Default */}
                  <div className="flex flex-col items-center gap-2">
                    <button className="px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all">
                      <Calendar className="w-4 h-4" /> Agendar cita
                    </button>
                    <span className="text-xs text-[#9CA3AF]">Default</span>
                  </div>
                  {/* Hover */}
                  <div className="flex flex-col items-center gap-2">
                    <button className="px-5 py-2.5 bg-[#1D3FA0] text-white rounded-xl text-sm font-semibold flex items-center gap-2 ring-2 ring-[#1E40AF]/20">
                      <Calendar className="w-4 h-4" /> Agendar cita
                    </button>
                    <span className="text-xs text-[#9CA3AF]">Hover</span>
                  </div>
                  {/* Active */}
                  <div className="flex flex-col items-center gap-2">
                    <button className="px-5 py-2.5 bg-[#1E3A8A] text-white rounded-xl text-sm font-semibold flex items-center gap-2 scale-95 shadow-inner">
                      <Calendar className="w-4 h-4" /> Agendar cita
                    </button>
                    <span className="text-xs text-[#9CA3AF]">Activo</span>
                  </div>
                  {/* Loading */}
                  <div className="flex flex-col items-center gap-2">
                    <button className="px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Cargando...
                    </button>
                    <span className="text-xs text-[#9CA3AF]">Loading</span>
                  </div>
                  {/* Disabled */}
                  <div className="flex flex-col items-center gap-2">
                    <button disabled className="px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold flex items-center gap-2 opacity-40 cursor-not-allowed">
                      <Calendar className="w-4 h-4" /> Agendar cita
                    </button>
                    <span className="text-xs text-[#9CA3AF]">Disabled</span>
                  </div>
                </div>
                {/* Sizes */}
                <div className="flex flex-wrap items-center gap-3 mt-3 px-2">
                  <span className="text-xs text-[#9CA3AF]">Tamaños:</span>
                  <button className="px-3 py-1.5 bg-[#1E40AF] text-white rounded-lg text-xs font-semibold">XS · Pequeño</button>
                  <button className="px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold">SM · Estándar</button>
                  <button className="px-6 py-3 bg-[#1E40AF] text-white rounded-xl font-semibold">MD · Grande</button>
                  <button className="px-8 py-3.5 bg-[#1E40AF] text-white rounded-xl font-semibold text-lg">LG · Hero</button>
                </div>
              </div>

              {/* Secondary green */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-semibold text-[#111827]">Botón Secundario (Verde)</h3>
                  <Token label="bg-[#10B981]" />
                </div>
                <div className="flex flex-wrap items-center gap-3 p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  <div className="flex flex-col items-center gap-2">
                    <button className="px-5 py-2.5 bg-[#10B981] text-white rounded-xl text-sm font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Aceptar solicitud
                    </button>
                    <span className="text-xs text-[#9CA3AF]">Default</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button className="px-5 py-2.5 bg-[#0EA875] text-white rounded-xl text-sm font-semibold flex items-center gap-2 ring-2 ring-[#10B981]/20">
                      <CheckCircle2 className="w-4 h-4" /> Aceptar solicitud
                    </button>
                    <span className="text-xs text-[#9CA3AF]">Hover</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button disabled className="px-5 py-2.5 bg-[#10B981] text-white rounded-xl text-sm font-semibold flex items-center gap-2 opacity-40 cursor-not-allowed">
                      <CheckCircle2 className="w-4 h-4" /> Aceptar solicitud
                    </button>
                    <span className="text-xs text-[#9CA3AF]">Disabled</span>
                  </div>
                </div>
              </div>

              {/* Outline */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-semibold text-[#111827]">Botón Outline</h3>
                  <Token label="border border-[#E5E7EB]" />
                </div>
                <div className="flex flex-wrap items-center gap-3 p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  <div className="flex flex-col items-center gap-2">
                    <button className="px-5 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-medium flex items-center gap-2 bg-white hover:bg-[#F9FAFB] transition-colors">
                      <Phone className="w-4 h-4" /> Llamar
                    </button>
                    <span className="text-xs text-[#9CA3AF]">Default</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button className="px-5 py-2.5 border border-[#1E40AF] text-[#1E40AF] rounded-xl text-sm font-medium flex items-center gap-2 bg-[#EFF6FF]">
                      <Phone className="w-4 h-4" /> Llamar
                    </button>
                    <span className="text-xs text-[#9CA3AF]">Hover</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button className="px-5 py-2.5 border border-[#E5E7EB] text-[#1E40AF] bg-[#EFF6FF] rounded-xl text-sm font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Ver perfil
                    </button>
                    <span className="text-xs text-[#9CA3AF]">Primary outline</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button disabled className="px-5 py-2.5 border border-[#E5E7EB] text-[#9CA3AF] rounded-xl text-sm font-medium flex items-center gap-2 bg-white cursor-not-allowed opacity-60">
                      <Phone className="w-4 h-4" /> Llamar
                    </button>
                    <span className="text-xs text-[#9CA3AF]">Disabled</span>
                  </div>
                </div>
              </div>

              {/* Destructive */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-semibold text-[#111827]">Botón Destructivo</h3>
                  <Token label="text-[#EF4444]" />
                </div>
                <div className="flex flex-wrap items-center gap-3 p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  <div className="flex flex-col items-center gap-2">
                    <button className="px-5 py-2.5 bg-[#EF4444] text-white rounded-xl text-sm font-semibold flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> Cancelar reserva
                    </button>
                    <span className="text-xs text-[#9CA3AF]">Filled</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button className="px-5 py-2.5 border border-[#FECACA] text-[#EF4444] bg-[#FEF2F2] rounded-xl text-sm font-medium flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> Cancelar reserva
                    </button>
                    <span className="text-xs text-[#9CA3AF]">Outline</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              5. INPUTS & SELECT
          ══════════════════════════════════════════ */}
          <section id="inputs" className="scroll-mt-20 bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8">
            <SectionHeader number="05" title="Inputs & Select" subtitle="Campos de formulario con todos los estados de interacción" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Text inputs */}
              <div className="space-y-5">
                <h3 className="font-semibold text-[#111827]">Input de texto</h3>

                {/* Default */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Correo electrónico <span className="text-[10px] text-[#9CA3AF] ml-1">Estado: Default</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none transition-all bg-white"
                    />
                  </div>
                  <div className="flex gap-2 mt-1.5">
                    <Token label="border-[#E5E7EB]" />
                    <Token label="rounded-xl" />
                    <Token label="py-2.5 pl-10" />
                  </div>
                </div>

                {/* Focus */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Teléfono <span className="text-[10px] text-[#1E40AF] ml-1 font-normal">Estado: Focus</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E40AF]" />
                    <input
                      type="tel"
                      defaultValue="+57 310 456 7890"
                      className="w-full pl-10 pr-4 py-2.5 border border-[#1E40AF] rounded-xl text-[#111827] outline-none ring-2 ring-[#1E40AF]/20 transition-all bg-white"
                    />
                  </div>
                  <div className="flex gap-2 mt-1.5">
                    <Token label="border-[#1E40AF]" />
                    <Token label="ring-2 ring-[#1E40AF]/20" />
                  </div>
                </div>

                {/* Error */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Contraseña <span className="text-[10px] text-[#EF4444] ml-1 font-normal">Estado: Error</span></label>
                  <div className="relative">
                    <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EF4444]" />
                    <input
                      type="password"
                      defaultValue="123"
                      className="w-full pl-10 pr-4 py-2.5 border border-[#EF4444] rounded-xl text-[#111827] outline-none ring-2 ring-[#EF4444]/20 bg-white"
                    />
                  </div>
                  <p className="text-xs text-[#EF4444] mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> La contraseña debe tener mínimo 8 caracteres</p>
                  <div className="flex gap-2 mt-1">
                    <Token label="border-[#EF4444]" />
                    <Token label="ring-[#EF4444]/20" />
                  </div>
                </div>

                {/* Success */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Nombre de usuario <span className="text-[10px] text-[#10B981] ml-1 font-normal">Estado: Válido</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                      type="text"
                      defaultValue="Carlos Ramírez"
                      className="w-full pl-10 pr-10 py-2.5 border border-[#10B981] rounded-xl text-[#111827] outline-none ring-2 ring-[#10B981]/20 bg-white"
                    />
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10B981]" />
                  </div>
                  <div className="flex gap-2 mt-1.5">
                    <Token label="border-[#10B981]" />
                    <Token label="ring-[#10B981]/20" />
                  </div>
                </div>

                {/* Disabled */}
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Campo deshabilitado <span className="text-[10px] ml-1">Estado: Disabled</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D1D5DB]" />
                    <input
                      disabled
                      type="text"
                      value="readonly@byme.co"
                      className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl text-[#9CA3AF] bg-[#F9FAFB] cursor-not-allowed"
                    />
                  </div>
                  <div className="flex gap-2 mt-1.5">
                    <Token label="bg-[#F9FAFB]" />
                    <Token label="cursor-not-allowed" />
                    <Token label="opacity-60" />
                  </div>
                </div>

                {/* Textarea */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Descripción</label>
                  <textarea
                    rows={3}
                    placeholder="Describe tu servicio o problema..."
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] resize-none transition-all bg-white"
                  />
                </div>
              </div>

              {/* Selects & other */}
              <div className="space-y-5">
                <h3 className="font-semibold text-[#111827]">Select & Otros</h3>

                {/* Select */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Especialidad</label>
                  <select className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] bg-white transition-all appearance-none cursor-pointer">
                    <option value="">Selecciona una especialidad</option>
                    <option>Plomería</option>
                    <option>Electricidad</option>
                    <option>Pintura</option>
                    <option>Carpintería</option>
                    <option>Limpieza</option>
                  </select>
                  <div className="flex gap-2 mt-1.5">
                    <Token label="appearance-none" />
                    <Token label="border-[#E5E7EB]" />
                  </div>
                </div>

                {/* Checkbox */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-3">Checkboxes</label>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Plomería disponible', checked: true, id: 'cb1' },
                      { label: 'Electricidad (no seleccionado)', checked: false, id: 'cb2' },
                      { label: 'Campo deshabilitado', checked: false, disabled: true, id: 'cb3' },
                    ].map(cb => (
                      <label key={cb.id} className={`flex items-center gap-3 cursor-pointer group ${cb.disabled ? 'cursor-not-allowed opacity-50' : ''}`}>
                        <div className={`w-4.5 h-4.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${cb.checked ? 'bg-[#1E40AF] border-[#1E40AF]' : 'border-[#D1D5DB] bg-white'}`}>
                          {cb.checked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-[#374151]">{cb.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Toggle */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-3">Toggle Switch</label>
                  <div className="space-y-3">
                    {[
                      { label: 'Disponible para trabajar', on: true },
                      { label: 'Notificaciones por email', on: false },
                      { label: 'Modo mantenimiento', on: false, disabled: true },
                    ].map((t, i) => (
                      <ToggleDemo key={i} label={t.label} initialOn={t.on} disabled={t.disabled} />
                    ))}
                  </div>
                </div>

                {/* Search input */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Input de búsqueda</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                      type="text"
                      value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      placeholder="Buscar profesional o servicio..."
                      className="w-full pl-10 pr-8 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] focus:bg-white transition-all"
                    />
                    {inputVal && (
                      <button onClick={() => setInputVal('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              6. CARD PROFESIONAL
          ══════════════════════════════════════════ */}
          <section id="cards" className="scroll-mt-20 bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8">
            <SectionHeader number="06" title="Card Profesional" subtitle="Tarjeta de perfil con variantes de estado y tamaño" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Card disponible */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-xs font-medium text-[#10B981]">Disponible</span>
                </div>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer">
                  <div className="relative h-28 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6]">
                    <div className="absolute top-3 left-3 bg-white/90 text-[#1E40AF] text-xs font-bold px-2.5 py-1 rounded-full">Top Profesional</div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#ECFDF5] text-[#10B981] text-xs font-medium px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Disponible
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-3 -mt-9 mb-3">
                      <img src={IMGS.man1} alt="Carlos" className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md flex-shrink-0" />
                      <div className="mt-7">
                        <h3 className="font-semibold text-[#111827] group-hover:text-[#1E40AF] transition-colors">Carlos Ramírez</h3>
                        <p className="text-xs text-[#6B7280]">Plomero Certificado</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                      <span className="text-xs font-medium text-[#374151] ml-1">4.9</span>
                      <span className="text-xs text-[#9CA3AF]">(47 reseñas)</span>
                    </div>
                    <p className="text-xs text-[#6B7280] line-clamp-2 mb-3">Plomería residencial y comercial. Reparaciones urgentes disponibles 24h.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#9CA3AF] flex items-center gap-1"><MapPin className="w-3 h-3" /> 1.2 km</span>
                      <span className="text-sm font-bold text-[#1E40AF]">$35.000/hr</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card no disponible */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  <span className="text-xs font-medium text-[#EF4444]">No disponible</span>
                </div>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] opacity-75 overflow-hidden">
                  <div className="relative h-28 bg-gradient-to-br from-[#6B7280] to-[#9CA3AF]">
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#FEF2F2] text-[#EF4444] text-xs font-medium px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" /> Ocupado
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-3 -mt-9 mb-3">
                      <img src={IMGS.woman2} alt="Sofía" className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md grayscale flex-shrink-0" />
                      <div className="mt-7">
                        <h3 className="font-semibold text-[#9CA3AF]">Sofía Muñoz</h3>
                        <p className="text-xs text-[#9CA3AF]">Pintora Profesional</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-[#D1D5DB] fill-[#D1D5DB]'}`} />)}
                      <span className="text-xs font-medium text-[#9CA3AF] ml-1">4.7</span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] line-clamp-2 mb-3">Pintura interior y exterior, estucos y acabados decorativos.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#9CA3AF] flex items-center gap-1"><MapPin className="w-3 h-3" /> 2.1 km</span>
                      <span className="text-sm font-bold text-[#9CA3AF]">$30.000/hr</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card compacta (lista) */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-[#6B7280]">Variante compacta (lista)</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Carlos Ramírez', spec: 'Plomero', rating: 4.9, dist: '1.2 km', available: true, img: IMGS.man1 },
                    { name: 'María González', spec: 'Electricista', rating: 4.8, dist: '0.8 km', available: true, img: IMGS.woman1 },
                    { name: 'Andrés Torres', spec: 'Carpintero', rating: 4.6, dist: '3.4 km', available: false, img: IMGS.man2 },
                  ].map((p, i) => (
                    <div key={i} className="bg-white rounded-xl border border-[#E5E7EB] p-3 flex items-center gap-3 hover:border-[#1E40AF]/30 hover:shadow-sm transition-all cursor-pointer">
                      <img src={p.img} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#111827] truncate">{p.name}</p>
                        <p className="text-xs text-[#9CA3AF]">{p.spec}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-[#374151]">{p.rating}</span>
                          <span className="text-[#E5E7EB] mx-1">·</span>
                          <span className="text-xs text-[#9CA3AF]">{p.dist}</span>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.available ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              7. BADGES DE ESTADO
          ══════════════════════════════════════════ */}
          <section id="badges" className="scroll-mt-20 bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8">
            <SectionHeader number="07" title="Badges de Estado" subtitle="Indicadores visuales para estados de reserva, disponibilidad y verificación" />

            <div className="space-y-8">
              {/* Availability badges */}
              <div>
                <h3 className="font-semibold text-[#111827] mb-4">Disponibilidad del profesional</h3>
                <div className="flex flex-wrap gap-3 p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#10B981] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" /> Disponible
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#EF4444] bg-[#FEF2F2] border border-[#FECACA] px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> Ocupado
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9CA3AF] bg-[#F3F4F6] border border-[#E5E7EB] px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[#9CA3AF]" /> Inactivo
                  </span>
                </div>
              </div>

              {/* Booking status */}
              <div>
                <h3 className="font-semibold text-[#111827] mb-4">Estado de reserva</h3>
                <div className="flex flex-wrap gap-3 p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  {[
                    { label: 'Confirmado', icon: CheckCircle2, color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]', border: 'border-[#A7F3D0]' },
                    { label: 'Pendiente', icon: AlertCircle, color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]', border: 'border-[#FCD34D]' },
                    { label: 'Completado', icon: CheckCircle2, color: 'text-[#6B7280]', bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]' },
                    { label: 'Cancelado', icon: XCircle, color: 'text-[#EF4444]', bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]' },
                  ].map(b => {
                    const Icon = b.icon;
                    return (
                      <span key={b.label} className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border ${b.color} ${b.bg} ${b.border}`}>
                        <Icon className="w-3.5 h-3.5" /> {b.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Trust badges */}
              <div>
                <h3 className="font-semibold text-[#111827] mb-4">Badges de confianza y logros</h3>
                <div className="flex flex-wrap gap-3 p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1.5 rounded-full">
                    <Award className="w-3.5 h-3.5" /> Top Profesional
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10B981] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1.5 rounded-full">
                    <Shield className="w-3.5 h-3.5" /> Verificado
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] bg-[#F5F3FF] border border-[#DDD6FE] px-3 py-1.5 rounded-full">
                    <Star className="w-3.5 h-3.5" /> Más Popular
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] bg-[#FFFBEB] border border-[#FCD34D] px-3 py-1.5 rounded-full">
                    <Zap className="w-3.5 h-3.5" /> Respuesta rápida
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1E40AF] px-3 py-1.5 rounded-full">
                    <Award className="w-3.5 h-3.5" /> Pro · 3 meses gratis
                  </span>
                </div>
              </div>

              {/* Notification dots */}
              <div>
                <h3 className="font-semibold text-[#111827] mb-4">Indicadores de notificación</h3>
                <div className="flex flex-wrap items-center gap-6 p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  {[
                    { label: '3 pendientes', color: 'bg-[#EF4444]', val: '3' },
                    { label: '12 mensajes', color: 'bg-[#1E40AF]', val: '12' },
                    { label: '99+ alertas', color: 'bg-[#D97706]', val: '99+' },
                  ].map((n, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <div className="w-10 h-10 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-center">
                          <Bell className="w-5 h-5 text-[#6B7280]" />
                        </div>
                        <span className={`absolute -top-1.5 -right-1.5 ${n.color} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-tight`}>{n.val}</span>
                      </div>
                      <span className="text-xs text-[#9CA3AF]">{n.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              8. MODAL
          ══════════════════════════════════════════ */}
          <section id="modal" className="scroll-mt-20 bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8">
            <SectionHeader number="08" title="Modal" subtitle="Diálogos de confirmación, formularios y alertas" />

            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setModalOpen(true)}
                className="px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] transition-colors flex items-center gap-2"
              >
                <Layers className="w-4 h-4" /> Abrir modal
              </button>
              <span className="text-sm text-[#9CA3AF]">Haz clic para ver el modal en acción</span>
            </div>

            {/* Static preview */}
            <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20 rounded-xl" />
              <div className="relative max-w-sm mx-auto bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-[#111827]">Dejar reseña</h4>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-[#6B7280] mb-4">Comparte tu experiencia con Carlos Ramírez</p>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-7 h-7 text-yellow-400 fill-yellow-400 cursor-pointer hover:scale-110 transition-transform" />)}
                </div>
                <textarea rows={3} placeholder="Describe tu experiencia..." className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] mb-4" />
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-medium hover:bg-[#F9FAFB]">Cancelar</button>
                  <button className="flex-1 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0]">Enviar reseña</button>
                </div>
              </div>
              <div className="text-center mt-3">
                <span className="text-xs text-white/70">Vista previa del modal</span>
              </div>
            </div>

            {/* Tokens */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Token label="rounded-2xl" />
              <Token label="shadow-2xl" />
              <Token label="max-w-sm" />
              <Token label="p-6" />
              <Token label="bg-black/50 (overlay)" />
            </div>
          </section>

          {/* ══════════════════════════════════════════
              9. NAVBAR
          ══════════════════════════════════════════ */}
          <section id="navbar" className="scroll-mt-20 bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8">
            <SectionHeader number="09" title="Navbar" subtitle="Barra de navegación con variantes para visitante y usuario autenticado" />

            <div className="space-y-5">
              {/* Visitor state */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">Estado: Visitante · Fondo sólido</span>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 h-14 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#1E40AF] rounded-lg flex items-center justify-center">
                        <Wrench className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-lg font-bold text-[#111827]">By<span className="text-[#10B981]">Me</span></span>
                    </div>
                    {/* Nav links */}
                    <div className="hidden sm:flex items-center gap-5">
                      <span className="text-sm text-[#374151]">Buscar Servicios</span>
                      <span className="text-sm text-[#374151]">Cómo funciona</span>
                    </div>
                    {/* Auth */}
                    <div className="flex items-center gap-2">
                      <button className="text-sm font-medium px-4 py-2 text-[#374151] rounded-lg hover:bg-[#F3F4F6] transition-colors">Iniciar sesión</button>
                      <button className="text-sm font-medium px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1D3FA0] transition-colors">Registrarse</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transparent hero state */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">Estado: Hero / Transparente</span>
                </div>
                <div className="relative rounded-xl overflow-hidden h-14">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1E40AF] to-[#3B82F6]" />
                  <div className="relative px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                        <Wrench className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-lg font-bold text-white">By<span className="text-[#34D399]">Me</span></span>
                    </div>
                    <div className="hidden sm:flex items-center gap-5">
                      <span className="text-sm text-white/90">Buscar Servicios</span>
                      <span className="text-sm text-white/90">Cómo funciona</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-sm font-medium px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors">Iniciar sesión</button>
                      <button className="text-sm font-medium px-4 py-2 bg-white/20 border border-white/30 text-white rounded-lg hover:bg-white/30 transition-colors">Registrarse</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Authenticated */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">Estado: Usuario autenticado</span>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#1E40AF] rounded-lg flex items-center justify-center">
                        <Wrench className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-lg font-bold text-[#111827]">By<span className="text-[#10B981]">Me</span></span>
                    </div>
                    <div className="hidden sm:flex items-center gap-5">
                      <span className="text-sm text-[#374151]">Buscar Servicios</span>
                      <span className="text-sm text-[#374151]">Cómo funciona</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-[#6B7280] hover:bg-[#F3F4F6] rounded-full relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
                      </button>
                      <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 border border-[#E5E7EB] rounded-full hover:bg-[#F9FAFB] cursor-pointer">
                        <img src={IMGS.man2} alt="Felipe" className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-sm font-medium text-[#111827]">Felipe</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tokens */}
              <div className="flex flex-wrap gap-2">
                <Token label="h-16 fixed top-0" />
                <Token label="bg-white shadow-sm" />
                <Token label="border-b border-[#E5E7EB]" />
                <Token label="z-50" />
                <Token label="transition-all duration-300" />
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              10. SIDEBAR DASHBOARD
          ══════════════════════════════════════════ */}
          <section id="sidebar" className="scroll-mt-20 bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8">
            <SectionHeader number="10" title="Sidebar Dashboard" subtitle="Navegación lateral para paneles de usuario, profesional y administrador" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

              {/* User sidebar */}
              <div>
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">Panel Usuario</p>
                <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-[#E5E7EB]">
                    <div className="flex flex-col items-center text-center">
                      <img src={IMGS.man2} alt="Felipe" className="w-12 h-12 rounded-xl object-cover mb-2" />
                      <p className="text-sm font-bold text-[#111827]">Felipe Arango</p>
                      <p className="text-xs text-[#9CA3AF]">Usuario verificado</p>
                      <span className="flex items-center gap-1 text-xs text-[#10B981] mt-1">
                        <Shield className="w-3 h-3" /> Cuenta activa
                      </span>
                    </div>
                  </div>
                  {[
                    { icon: LayoutDashboard, label: 'Mi panel', active: true },
                    { icon: History, label: 'Historial', active: false },
                    { icon: Settings, label: 'Mi perfil', active: false },
                    { icon: LogOut, label: 'Cerrar sesión', active: false, red: true },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className={`flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors ${
                        item.red ? 'text-red-500 hover:bg-red-50' :
                        item.active ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold border-r-2 border-[#1E40AF]' :
                        'text-[#374151] hover:bg-[#F9FAFB]'
                      }`}>
                        <Icon className="w-4 h-4" /> {item.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Professional sidebar */}
              <div>
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">Panel Profesional</p>
                <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-[#E5E7EB]">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-2">
                        <img src={IMGS.man1} alt="Carlos" className="w-12 h-12 rounded-xl object-cover" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-white" />
                      </div>
                      <p className="text-sm font-bold text-[#111827]">Carlos Ramírez</p>
                      <p className="text-xs text-[#9CA3AF]">Plomero Certificado</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-medium text-[#374151]">4.9</span>
                        <span className="text-xs text-[#9CA3AF]">(47)</span>
                      </div>
                    </div>
                  </div>
                  {[
                    { icon: LayoutDashboard, label: 'Mi panel', active: true },
                    { icon: Calendar, label: 'Solicitudes (2)', active: false, badge: '2' },
                    { icon: Briefcase, label: 'Mis servicios', active: false },
                    { icon: Clock, label: 'Disponibilidad', active: false },
                    { icon: Settings, label: 'Editar perfil', active: false },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className={`flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors ${
                        item.active ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold border-r-2 border-[#1E40AF]' : 'text-[#374151] hover:bg-[#F9FAFB]'
                      }`}>
                        <Icon className="w-4 h-4" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="w-5 h-5 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.badge}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Admin sidebar */}
              <div>
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">Panel Admin</p>
                <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#111827]">Administrador</p>
                        <p className="text-xs text-[#9CA3AF]">admin@byme.co</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-[#ECFDF5] rounded-lg px-3 py-1.5 mt-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                      <span className="text-xs text-[#065F46] font-medium">Sistema operativo</span>
                    </div>
                  </div>
                  {[
                    { icon: LayoutDashboard, label: 'Panel General', active: true },
                    { icon: User, label: 'Usuarios', active: false },
                    { icon: Briefcase, label: 'Profesionales', active: false },
                    { icon: Star, label: 'Reseñas', active: false, badge: '3' },
                    { icon: Settings, label: 'Configuración', active: false },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className={`flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors ${
                        item.active ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold border-r-2 border-[#1E40AF]' : 'text-[#374151] hover:bg-[#F9FAFB]'
                      }`}>
                        <Icon className="w-4 h-4" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="w-5 h-5 bg-[#D97706] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.badge}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tokens */}
            <div className="mt-5 flex flex-wrap gap-2">
              <Token label="w-56 lg:w-64 flex-shrink-0" />
              <Token label="rounded-2xl border border-[#E5E7EB]" />
              <Token label="border-r-2 border-[#1E40AF] (active)" />
              <Token label="bg-[#EFF6FF] text-[#1E40AF] (active)" />
            </div>
          </section>

          {/* ── Footer del Design System ── */}
          <div className="bg-gradient-to-br from-[#1E40AF] to-[#2563EB] rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Design System ByMe v1.0</h3>
            <p className="text-blue-200 text-sm mb-4">Construido con Inter · Tailwind CSS v4 · React · Popayán, Colombia 🇨🇴</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Token label="#1E40AF · Primario" />
              <Token label="#10B981 · Secundario" />
              <Token label="#F9FAFB · Fondo" />
              <Token label="#111827 · Texto" />
              <Token label="#E5E7EB · Borde" />
            </div>
          </div>

        </main>
      </div>

      {/* ── MODAL OVERLAY ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#EFF6FF] rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#1E40AF]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111827]">Dejar reseña</h3>
                  <p className="text-xs text-[#9CA3AF]">Carlos Ramírez · Plomero</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mb-4 pb-4 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-3">
                <img src={IMGS.man1} alt="Carlos" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="font-semibold text-[#111827]">Carlos Ramírez</p>
                  <p className="text-sm text-[#6B7280]">Reparación de tuberías · 28 Feb 2025</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-[#6B7280] mb-4">¿Cómo calificarías el servicio?</p>
            <div className="flex items-center justify-center gap-2 mb-5">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className="w-8 h-8 text-yellow-400 fill-yellow-400 cursor-pointer hover:scale-110 transition-transform" />
              ))}
            </div>
            <textarea
              rows={3}
              placeholder="Comparte tu experiencia con este profesional..."
              className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] resize-none transition-all mb-4"
            />
            <div className="flex items-center gap-2 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] mb-4 text-xs text-[#6B7280]">
              <Shield className="w-4 h-4 text-[#1E40AF] flex-shrink-0" />
              Tu reseña es anónima para el profesional hasta su publicación
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-medium hover:bg-[#F9FAFB] transition-colors">
                Cancelar
              </button>
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] transition-colors flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Enviar reseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TOGGLE DEMO COMPONENT
───────────────────────────────────────────────────────── */
function ToggleDemo({ label, initialOn, disabled }: { label: string; initialOn: boolean; disabled?: boolean }) {
  const [on, setOn] = useState(initialOn);
  return (
    <div className={`flex items-center justify-between ${disabled ? 'opacity-50' : ''}`}>
      <span className={`text-sm ${disabled ? 'text-[#9CA3AF]' : 'text-[#374151]'}`}>{label}</span>
      <button
        disabled={disabled}
        onClick={() => !disabled && setOn(!on)}
        className={`relative w-10 h-5.5 h-6 rounded-full transition-colors ${on ? 'bg-[#1E40AF]' : 'bg-[#D1D5DB]'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}
