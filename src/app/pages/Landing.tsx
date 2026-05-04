import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Search, MapPin, Star, Shield, Clock, ThumbsUp, Wrench,
  Droplets, Zap, Hammer, Sparkles, KeyRound, Leaf, Wind, Truck,
  Paintbrush2, Bug, ArrowRight, CheckCircle2, Users, Briefcase, Award
} from 'lucide-react';
import { categories as mockCategories, professionals as mockProfessionals, IMGS } from '../data/mockData';
import { ProfessionalsService } from '../../services/professionals/professionals.service';
import type { ProfessionalPublicDTO } from '../../services/professionals/professionals.types';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Droplets, Zap, Paintbrush2, Hammer, Sparkles, KeyRound, Leaf, Wind, Truck, Bug,
};

// Mapa visual por nombre de categoría
const CATEGORY_VISUAL: Record<string, { iconName: string; color: string; bgColor: string }> = {
  'Plomería':       { iconName: 'Droplets',    color: '#1E40AF', bgColor: '#EFF6FF' },
  'Electricidad':   { iconName: 'Zap',         color: '#D97706', bgColor: '#FFFBEB' },
  'Pintura':        { iconName: 'Paintbrush2', color: '#7C3AED', bgColor: '#F5F3FF' },
  'Carpintería':    { iconName: 'Hammer',      color: '#92400E', bgColor: '#FEF3C7' },
  'Limpieza':       { iconName: 'Sparkles',    color: '#10B981', bgColor: '#ECFDF5' },
  'Cerrajería':     { iconName: 'KeyRound',    color: '#0F766E', bgColor: '#F0FDFA' },
  'Jardinería':     { iconName: 'Leaf',        color: '#15803D', bgColor: '#F0FDF4' },
  'Climatización':  { iconName: 'Wind',        color: '#0369A1', bgColor: '#F0F9FF' },
  'Mudanzas':       { iconName: 'Truck',       color: '#9333EA', bgColor: '#FAF5FF' },
  'Fumigación':     { iconName: 'Bug',         color: '#BE185D', bgColor: '#FDF2F8' },
  'Tecnología':     { iconName: 'Zap',         color: '#6366F1', bgColor: '#EEF2FF' },
};

// Foto de respaldo cuando un profesional no tiene profilePictureUrl
const FALLBACK_PHOTOS = [IMGS.man1, IMGS.man2, IMGS.woman1].filter(Boolean);
function getFallbackPhoto(id: string): string {
  if (FALLBACK_PHOTOS.length === 0) return '';
  // Hash simple del id para escoger foto consistente
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % FALLBACK_PHOTOS.length;
  return FALLBACK_PHOTOS[hash];
}

const STATS = [
  { value: '500+', label: 'Profesionales activos', icon: Briefcase },
  { value: '4,800+', label: 'Servicios completados', icon: CheckCircle2 },
  { value: '4.8', label: 'Calificación promedio', icon: Star },
  { value: '12+', label: 'Categorías disponibles', icon: Award },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Busca el servicio',
    desc: 'Describe qué necesitas y filtra por categoría, ubicación en Popayán y disponibilidad.',
    icon: Search,
    color: '#1E40AF',
    bg: '#EFF6FF',
  },
  {
    step: '02',
    title: 'Elige tu profesional',
    desc: 'Revisa perfiles, calificaciones y reseñas reales. Todos nuestros profesionales están verificados.',
    icon: Users,
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    step: '03',
    title: 'Agenda y paga seguro',
    desc: 'Reserva en línea, elige la fecha y hora. Tu pago está protegido hasta que el trabajo esté listo.',
    icon: Shield,
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
];

export function Landing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Popayán, Cauca');

  // Categorías
  const [categories, setCategories] = useState(mockCategories);

  // Profesionales destacados (API real con fallback a mock)
  const [featuredPros, setFeaturedPros] = useState<ProfessionalPublicDTO[] | null>(null);
  const [usingMockPros, setUsingMockPros] = useState(false);
  const [prosLoading, setProsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    ProfessionalsService.getCategoriesNames()
      .then((apiCats) => {
        if (!mounted || apiCats.length === 0) return;
        const mapped = apiCats.map((c) => {
          const vis = CATEGORY_VISUAL[c.name] || { iconName: 'Wrench', color: '#6B7280', bgColor: '#F3F4F6' };
          return {
            id: c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'),
            name: c.name,
            iconName: vis.iconName,
            color: vis.color,
            bgColor: vis.bgColor,
            count: 0,
          };
        });
        setCategories(mapped);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Cargar profesionales destacados del endpoint público
  useEffect(() => {
    let mounted = true;
    setProsLoading(true);

    ProfessionalsService.getPublicList(0, 6)
      .then((page) => {
        if (!mounted) return;
        if (page.content && page.content.length > 0) {
          // Ordenar: primero gold=true, luego por rating
          const sorted = [...page.content].sort((a, b) => {
            if (a.gold !== b.gold) return a.gold ? -1 : 1;
            return (b.rating || 0) - (a.rating || 0);
          });
          setFeaturedPros(sorted);
          setUsingMockPros(false);
        } else {
          setUsingMockPros(true);
        }
      })
      .catch(() => {
        if (mounted) setUsingMockPros(true);
      })
      .finally(() => {
        if (mounted) setProsLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/buscar?q=${encodeURIComponent(searchQuery)}&loc=${encodeURIComponent(location)}`);
  };

  return (
    <div className="bg-[#F9FAFB]">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={IMGS.hero}
            alt="Profesionales en Popayán"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2460]/90 via-[#1E40AF]/75 to-[#1E40AF]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-white/90 text-sm">Exclusivo para Popayán, Cauca</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
              Encuentra el profesional{' '}
              <span className="text-[#34D399]">que necesitas</span>
              {' '}en minutos
            </h1>
            <p className="text-white/80 text-lg mb-10 leading-relaxed max-w-xl">
              Plomería, electricidad, pintura, carpintería y mucho más. Conectamos
              con profesionales locales verificados de Popayán.
            </p>

            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-xl">
              <div className="flex items-center gap-3 flex-1 px-3">
                <Search className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="¿Qué servicio necesitas?"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-[#111827] placeholder:text-[#9CA3AF] bg-transparent py-2"
                />
              </div>
              <div className="h-px sm:h-auto sm:w-px bg-[#E5E7EB] sm:my-2" />
              <div className="flex items-center gap-3 px-3 sm:min-w-40">
                <MapPin className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="flex-1 outline-none text-[#111827] bg-transparent py-2 w-full"
                />
              </div>
              <button
                type="submit"
                className="bg-[#1E40AF] hover:bg-[#1D3FA0] text-white px-6 py-3 rounded-xl transition-colors font-medium flex items-center gap-2 justify-center"
              >
                <Search className="w-4 h-4" />
                Buscar
              </button>
            </form>

            <div className="flex flex-wrap gap-2 mt-5">
              {categories.slice(0, 5).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/buscar?cat=${cat.id}`)}
                  className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm border border-white/20 hover:bg-white/20 transition-colors"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 hidden lg:flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-xl p-4 w-52 border border-[#E5E7EB]">
            <div className="flex items-center gap-3 mb-2">
              <img src={IMGS.man1} alt="" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <p className="text-xs font-semibold text-[#111827]">Carlos Ramírez</p>
                <p className="text-xs text-[#6B7280]">Plomero Certificado</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-1">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
              <span className="text-xs text-[#374151] ml-1">4.9</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-xs text-[#10B981]">Disponible ahora</span>
            </div>
          </div>
          <div className="bg-[#1E40AF] rounded-xl shadow-xl p-4 w-52 text-white">
            <CheckCircle2 className="w-5 h-5 text-[#34D399] mb-2" />
            <p className="text-sm font-semibold">¡Servicio agendado!</p>
            <p className="text-xs text-blue-200 mt-0.5">Hoy 10:00 AM · Plomería</p>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-6 h-6 text-[#1E40AF] mx-auto mb-2" />
                <p className="text-3xl font-bold text-[#111827]">{stat.value}</p>
                <p className="text-sm text-[#6B7280] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-medium text-[#10B981] uppercase tracking-wider mb-2">¿Qué necesitas?</p>
            <h2 className="text-3xl font-bold text-[#111827]">Explora por categoría</h2>
            <p className="text-[#6B7280] mt-2">Encuentra el experto perfecto para cada tarea del hogar</p>
          </div>
          <Link
            to="/buscar"
            className="hidden sm:flex items-center gap-1.5 text-[#1E40AF] text-sm font-medium hover:gap-2.5 transition-all"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map(cat => {
            const Icon = CATEGORY_ICONS[cat.iconName] || Wrench;
            return (
              <Link
                key={cat.id}
                to={`/buscar?cat=${cat.id}`}
                className="group bg-white rounded-2xl p-5 text-center border border-[#E5E7EB] hover:border-[#1E40AF]/30 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: cat.bgColor }}
                >
                  <Icon className="w-6 h-6" style={{ color: cat.color }} />
                </div>
                <p className="text-sm font-semibold text-[#111827]">{cat.name}</p>
                {cat.count > 0 && (
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{cat.count} profesionales</p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── FEATURED PROFESSIONALS (REAL DATA) ─── */}
      <section className="py-20 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-medium text-[#10B981] uppercase tracking-wider mb-2">Los mejores</p>
              <h2 className="text-3xl font-bold text-[#111827]">Profesionales destacados</h2>
              <p className="text-[#6B7280] mt-2">Los más solicitados y mejor calificados en Popayán</p>
            </div>
            <Link to="/buscar" className="hidden sm:flex items-center gap-1.5 text-[#1E40AF] text-sm font-medium hover:gap-2.5 transition-all">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Loading skeletons */}
          {prosLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden animate-pulse">
                  <div className="h-28 bg-[#F3F4F6]" />
                  <div className="px-5 pb-5 -mt-9 relative z-10">
                    <div className="w-[72px] h-[72px] rounded-xl bg-[#E5E7EB] mx-auto mb-3 border-4 border-white" />
                    <div className="h-4 bg-[#F3F4F6] rounded w-32 mx-auto mb-2" />
                    <div className="h-3 bg-[#F3F4F6] rounded w-24 mx-auto mb-3" />
                    <div className="h-3 bg-[#F3F4F6] rounded w-20 mx-auto mb-4" />
                    <div className="h-12 bg-[#F3F4F6] rounded mt-3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Datos reales del API */}
          {!prosLoading && !usingMockPros && featuredPros && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPros.map(prof => {
                const fullName = `${prof.firstName} ${prof.lastName}`.trim();
                const photo = prof.profilePictureUrl || getFallbackPhoto(prof.id);
                const isAvailable = prof.status === 'DISPONIBLE';
                return (
                  <Link
                    key={prof.id}
                    to={`/profesional/${prof.id}`}
                    className="group bg-white rounded-2xl border border-[#E5E7EB] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-28 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-t-2xl overflow-hidden">
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `url(${IMGS.service})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }} />
                      {prof.gold && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <Award className="w-3 h-3" /> Top
                        </div>
                      )}
                      <div className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        isAvailable ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#FEF2F2] text-[#EF4444]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                        {isAvailable ? 'Disponible' : 'Ocupado'}
                      </div>
                    </div>

                    <div className="flex justify-center -mt-9 relative z-10 mb-3">
                      <img
                        src={photo}
                        alt={fullName}
                        className="w-[72px] h-[72px] rounded-xl object-cover border-4 border-white shadow-lg"
                      />
                    </div>

                    <div className="px-5 pb-5 text-center">
                      <h3 className="font-semibold text-[#111827] group-hover:text-[#1E40AF] transition-colors">
                        {fullName}
                      </h3>
                      <p className="text-sm text-[#6B7280] mt-0.5">{prof.professionName}</p>

                      <div className="flex items-center justify-center gap-1 mt-2 mb-3">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(prof.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-[#D1D5DB] fill-[#D1D5DB]'}`} />
                        ))}
                        <span className="text-sm font-medium text-[#374151] ml-1">{(prof.rating || 0).toFixed(1)}</span>
                      </div>

                      <p className="text-sm text-[#6B7280] line-clamp-2 mb-4">
                        {prof.categoryName}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                        <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                          <Shield className="w-3.5 h-3.5 text-[#10B981]" />
                          <span className="text-xs">{prof.accountStatus === 'VERIFICADO' ? 'Verificado' : prof.accountStatus}</span>
                        </div>
                        <span className="text-sm font-semibold text-[#1E40AF]">
                          Ver perfil →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Fallback: mock cuando el API no responde */}
          {!prosLoading && usingMockPros && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProfessionals.slice(0, 6).map(prof => (
                <Link
                  key={prof.id}
                  to={`/profesional/${prof.id}`}
                  className="group bg-white rounded-2xl border border-[#E5E7EB] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-28 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-t-2xl overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `url(${IMGS.service})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }} />
                    {prof.badge && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#1E40AF] text-xs font-semibold px-2.5 py-1 rounded-full">
                        {prof.badge}
                      </div>
                    )}
                    <div className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      prof.available ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#FEF2F2] text-[#EF4444]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${prof.available ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                      {prof.available ? 'Disponible' : 'Ocupado'}
                    </div>
                  </div>

                  <div className="flex justify-center -mt-9 relative z-10 mb-3">
                    <img
                      src={prof.photo}
                      alt={prof.name}
                      className="w-[72px] h-[72px] rounded-xl object-cover border-4 border-white shadow-lg"
                    />
                  </div>

                  <div className="px-5 pb-5 text-center">
                    <h3 className="font-semibold text-[#111827] group-hover:text-[#1E40AF] transition-colors">{prof.name}</h3>
                    <p className="text-sm text-[#6B7280] mt-0.5">{prof.specialty}</p>

                    <div className="flex items-center justify-center gap-1 mt-2 mb-3">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(prof.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-[#D1D5DB] fill-[#D1D5DB]'}`} />
                      ))}
                      <span className="text-sm font-medium text-[#374151] ml-1">{prof.rating}</span>
                      <span className="text-sm text-[#9CA3AF]">({prof.reviewCount})</span>
                    </div>

                    <p className="text-sm text-[#6B7280] line-clamp-2 mb-4">{prof.shortDescription}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                      <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{prof.distance}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#1E40AF]">
                        ${prof.hourlyRate.toLocaleString()} /hr
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="como-funciona" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-[#10B981] uppercase tracking-wider mb-2">Simple y seguro</p>
          <h2 className="text-3xl font-bold text-[#111827]">¿Cómo funciona ByMe?</h2>
          <p className="text-[#6B7280] mt-2 max-w-xl mx-auto">
            En tres pasos tienes al profesional que necesitas en tu puerta
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((item, i) => (
            <div key={i} className="relative">
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-[#E5E7EB] z-0 -translate-x-4" />
              )}
              <div className="relative bg-white rounded-2xl p-8 border border-[#E5E7EB] hover:shadow-lg transition-all hover:-translate-y-1">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: item.bg }}
                >
                  <item.icon className="w-7 h-7" style={{ color: item.color }} />
                </div>
                <div className="text-4xl font-black mb-3" style={{ color: `${item.color}15` }}>{item.step}</div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">{item.title}</h3>
                <p className="text-[#6B7280] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TRUST SECTION ─── */}
      <section className="py-20 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-medium text-[#10B981] uppercase tracking-wider mb-3">¿Por qué elegirnos?</p>
              <h2 className="text-3xl font-bold text-[#111827] mb-4">Tu confianza es nuestra prioridad</h2>
              <p className="text-[#6B7280] mb-8 leading-relaxed">
                Cada profesional en ByMe pasa por un proceso riguroso de verificación. 
                Revisamos antecedentes, validamos certificaciones y monitoreamos las calificaciones 
                para garantizarte la mejor experiencia.
              </p>
              {[
                { icon: Shield, title: 'Profesionales verificados', desc: 'Antecedentes y certificaciones revisados por nuestro equipo', color: '#1E40AF' },
                { icon: Clock, title: 'Respuesta rápida', desc: 'La mayoría de profesionales responden en menos de 30 minutos', color: '#10B981' },
                { icon: ThumbsUp, title: 'Satisfacción garantizada', desc: 'Si no quedas satisfecho, te reembolsamos sin preguntas', color: '#7C3AED' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827]">{item.title}</p>
                    <p className="text-sm text-[#6B7280] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <img
                src={IMGS.service}
                alt="Profesional trabajando"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-xl p-4 border border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#ECFDF5] rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">+4,800 trabajos</p>
                    <p className="text-xs text-[#6B7280]">completados este año</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-3">¿Eres un profesional en Popayán?</h2>
            <p className="text-blue-200 mb-8 max-w-xl mx-auto">
              Únete a nuestra red y conecta con cientos de clientes que necesitan tu talento.
              Sin comisiones los primeros 3 meses.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/registro/profesional"
                className="px-8 py-3.5 bg-white text-[#1E40AF] rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                Registrarme como profesional
              </Link>
              <Link
                to="/buscar"
                className="px-8 py-3.5 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                Buscar un servicio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}