import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import {
  Search, MapPin, Star, SlidersHorizontal, X, Map,
  List, Droplets, Zap, Paintbrush2, Hammer, Sparkles, KeyRound,
  Leaf, Wind, Truck, Bug, Award, Wrench, ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';
import { categories as mockCategories, IMGS } from '../data/mockData';
import { RealMap } from '../components/RealMap';
import { ProfessionalsService } from '../../services/professionals/professionals.service';
import type {
  ProfessionalPublicDTO,
  ProfessionalDetailPublicDTO,
} from '../../services/professionals/professionals.types';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Droplets, Zap, Paintbrush2, Hammer, Sparkles, KeyRound, Leaf, Wind, Truck, Bug,
};

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

const SORT_OPTIONS = ['Relevancia', 'Mejor calificación', 'Más reseñas'];

const FALLBACK_PHOTOS = [IMGS.man1, IMGS.man2, IMGS.woman1].filter(Boolean);
function getFallbackPhoto(id: string): string {
  if (FALLBACK_PHOTOS.length === 0) return '';
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % FALLBACK_PHOTOS.length;
  return FALLBACK_PHOTOS[hash];
}

function slugify(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
}

interface DisplayProfessional {
  id: string;
  name: string;
  specialty: string;
  category: string;
  photo: string;
  rating: number;
  reviewCount: number;
  available: boolean;
  badge: string | null;
  shortDescription: string;
  distance: string;
  hourlyRate: number;
  responseTime: string;
  lat?: number;
  lng?: number;
  address?: string;
}

/**
 * Combina datos del listado paginado + detalle (para coords reales).
 * El backend tiene `lat`/`lng` invertidos, así que los corregimos aquí.
 */
function buildDisplay(
  base: ProfessionalPublicDTO,
  detail: ProfessionalDetailPublicDTO | null,
): DisplayProfessional {
  const fullName = `${base.firstName} ${base.lastName}`.trim();

  // ⚠ El backend invierte lat/lng en el endpoint individual:
  //    `lat` contiene en realidad la longitud
  //    `lng` contiene en realidad la latitud
  let realLat: number | undefined;
  let realLng: number | undefined;
  if (detail && typeof detail.lat === 'number' && typeof detail.lng === 'number') {
    realLat = detail.lng; // swap
    realLng = detail.lat; // swap
  }

  return {
    id: base.id,
    name: fullName || 'Profesional',
    specialty: base.professionName || '—',
    category: slugify(base.categoryName || ''),
    photo: base.profilePictureUrl || getFallbackPhoto(base.id),
    rating: base.rating || 0,
    reviewCount: 0,
    available: base.status === 'DISPONIBLE',
    badge: base.gold ? 'Top profesional' : (base.accountStatus === 'VERIFICADO' ? 'Verificado' : null),
    shortDescription: `${base.professionName || ''} · ${base.categoryName || ''}`,
    distance: '—',
    hourlyRate: 0,
    responseTime: 'Pronto',
    lat: realLat,
    lng: realLng,
  };
}

export function SearchPage() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const [selectedCat, setSelectedCat] = useState(params.get('cat') || 'all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('Relevancia');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [filterOpen, setFilterOpen] = useState(false);

  const [categories, setCategories] = useState(mockCategories);

  const [pros, setPros] = useState<DisplayProfessional[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar categorías para filtros
  useEffect(() => {
    let mounted = true;
    ProfessionalsService.getCategoriesNames()
      .then((apiCats) => {
        if (!mounted || apiCats.length === 0) return;
        const mapped = apiCats.map((c) => {
          const vis = CATEGORY_VISUAL[c.name] || { iconName: 'Wrench', color: '#6B7280', bgColor: '#F3F4F6' };
          return {
            id: slugify(c.name),
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

  // Cargar lista paginada + coords reales en paralelo
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    ProfessionalsService.getPublicList(page, size)
      .then(async (res) => {
        if (!mounted) return;
        const baseList = res.content || [];

        setTotalPages(res.totalPages || 0);
        setTotalElements(res.totalElements || 0);

        // Mostrar primero la lista sin coords (rápido), luego completar con coords
        setPros(baseList.map((p) => buildDisplay(p, null)));

        // Cargar coords reales en paralelo (no bloquea la UI)
        const detailPromises = baseList.map((p) =>
          ProfessionalsService.getPublicById(p.id).catch(() => null)
        );

        const details = await Promise.all(detailPromises);
        if (!mounted) return;

        const enriched = baseList.map((p, i) => buildDisplay(p, details[i]));
        setPros(enriched);
      })
      .catch((e) => {
        if (mounted) setError(e?.response?.data?.message || 'No se pudieron cargar los profesionales.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [page, size]);

  const filtered: DisplayProfessional[] = useMemo(() => {
    return pros.filter(p => {
      const q = search.toLowerCase().trim();
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q);
      const matchCat = selectedCat === 'all' || p.category === selectedCat;
      const matchRating = p.rating >= minRating;
      const matchAvail = !availableOnly || p.available;
      return matchSearch && matchCat && matchRating && matchAvail;
    }).sort((a, b) => {
      if (sortBy === 'Mejor calificación') return b.rating - a.rating;
      if (sortBy === 'Más reseñas') return b.reviewCount - a.reviewCount;
      return 0;
    });
  }, [pros, search, selectedCat, minRating, sortBy, availableOnly]);

  const selectedPro = filtered.find(p => p.id === selectedId);

  const reload = () => {
    setLoading(true);
    setPros([]);
    ProfessionalsService.getPublicList(page, size)
      .then(async (res) => {
        const baseList = res.content || [];
        setPros(baseList.map((p) => buildDisplay(p, null)));
        setTotalPages(res.totalPages || 0);
        setTotalElements(res.totalElements || 0);
        setError(null);

        const details = await Promise.all(
          baseList.map((p) => ProfessionalsService.getPublicById(p.id).catch(() => null))
        );
        setPros(baseList.map((p, i) => buildDisplay(p, details[i])));
      })
      .catch((e) => setError(e?.response?.data?.message || 'No se pudieron cargar los profesionales.'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col h-screen pt-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="bg-white border-b border-[#E5E7EB] px-4 py-4 flex-shrink-0 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4">

          <div className="flex-1 flex items-center gap-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl px-4 py-3 hover:border-[#1E40AF]/40 focus-within:border-[#1E40AF] focus-within:ring-2 focus-within:ring-[#1E40AF]/10 transition-all">
            <Search className="w-5 h-5 text-[#9CA3AF] flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar servicio o profesional..."
              className="flex-1 bg-transparent outline-none text-[#111827] placeholder:text-[#9CA3AF]"
            />
            {search && (
              <button onClick={() => setSearch('')} className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-[#E5E7EB] hover:bg-[#D1D5DB] transition-colors">
                <X className="w-3 h-3 text-[#6B7280]" />
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl px-4 py-3 min-w-[180px] hover:border-[#1E40AF]/40 transition-all cursor-pointer">
            <MapPin className="w-4 h-4 text-[#1E40AF] flex-shrink-0" />
            <span className="text-sm text-[#374151] font-medium whitespace-nowrap">Popayán, Cauca</span>
          </div>

          <div className="hidden md:block w-px h-8 bg-[#E5E7EB]" />

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border font-medium transition-all whitespace-nowrap ${
              filterOpen
                ? 'bg-[#1E40AF] text-white border-[#1E40AF] shadow-md'
                : 'bg-white text-[#374151] border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Filtros</span>
            {(minRating > 0 || availableOnly) && (
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            )}
          </button>

          <div className="hidden lg:flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-2xl px-4 py-3 hover:border-[#D1D5DB] transition-all">
            <span className="text-sm text-[#9CA3AF] whitespace-nowrap">Ordenar:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent outline-none text-sm font-medium text-[#374151] cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="flex lg:hidden border border-[#E5E7EB] rounded-2xl overflow-hidden">
            <button
              onClick={() => setMobileView('list')}
              className={`px-3 py-3 transition-colors ${mobileView === 'list' ? 'bg-[#1E40AF] text-white' : 'text-[#6B7280] hover:bg-[#F9FAFB]'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileView('map')}
              className={`px-3 py-3 transition-colors ${mobileView === 'map' ? 'bg-[#1E40AF] text-white' : 'text-[#6B7280] hover:bg-[#F9FAFB]'}`}
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>

        {filterOpen && (
          <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-[#E5E7EB] flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCat('all')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCat === 'all' ? 'bg-[#1E40AF] text-white' : 'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]'
                }`}
              >
                Todos
              </button>
              {categories.map(cat => {
                const Icon = CATEGORY_ICONS[cat.iconName] || Wrench;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedCat === cat.id ? 'bg-[#1E40AF] text-white' : 'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.name}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 flex-wrap ml-auto">
              <select
                value={minRating}
                onChange={e => setMinRating(Number(e.target.value))}
                className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-1.5 bg-white text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20"
              >
                <option value={0}>Todas las calificaciones</option>
                <option value={4}>⭐ 4+ estrellas</option>
                <option value={4.5}>⭐ 4.5+ estrellas</option>
                <option value={4.8}>⭐ 4.8+ estrellas</option>
              </select>

              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setAvailableOnly(!availableOnly)}
                  className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${availableOnly ? 'bg-[#10B981]' : 'bg-[#D1D5DB]'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${availableOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm text-[#374151]">Solo disponibles</span>
              </label>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-1.5 bg-white text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20"
              >
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`w-full lg:w-[420px] xl:w-[480px] flex flex-col overflow-hidden bg-[#F9FAFB] border-r border-[#E5E7EB] ${
          mobileView === 'map' ? 'hidden lg:flex' : 'flex'
        }`}>
          <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-[#E5E7EB] flex-shrink-0">
            <span className="text-sm font-medium text-[#374151]">
              <span className="text-[#111827] font-bold">{loading ? '...' : filtered.length}</span> en esta página
              {totalElements > 0 && (
                <span className="text-[#9CA3AF]"> · {totalElements} en total</span>
              )}
            </span>
            <div className="flex items-center gap-2">
              {selectedCat !== 'all' && (
                <button onClick={() => setSelectedCat('all')} className="flex items-center gap-1 text-xs text-[#1E40AF] hover:underline">
                  <X className="w-3 h-3" /> Limpiar
                </button>
              )}
              <button
                onClick={reload}
                disabled={loading}
                className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#1E40AF] disabled:opacity-50"
                aria-label="Refrescar"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {error && (
            <div className="m-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {loading ? (
              <>
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#F3F4F6]" />
                      <div className="w-14 h-14 rounded-xl bg-[#F3F4F6]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-[#F3F4F6] rounded w-3/4" />
                        <div className="h-3 bg-[#F3F4F6] rounded w-1/2" />
                        <div className="h-3 bg-[#F3F4F6] rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="w-12 h-12 text-[#D1D5DB] mb-3" />
                <p className="text-[#374151] font-medium">No encontramos resultados</p>
                <p className="text-sm text-[#9CA3AF] mt-1">
                  {pros.length === 0 ? 'No hay profesionales disponibles' : 'Intenta con otros filtros'}
                </p>
              </div>
            ) : (
              filtered.map((prof, index) => (
                <div
                  key={prof.id}
                  onClick={() => setSelectedId(selectedId === prof.id ? null : prof.id)}
                  className={`bg-white rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                    selectedId === prof.id
                      ? 'border-[#1E40AF] shadow-md ring-1 ring-[#1E40AF]/20'
                      : 'border-[#E5E7EB] hover:border-[#1E40AF]/30'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#1E40AF] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-1">
                        {index + 1}
                      </div>

                      <img
                        src={prof.photo}
                        alt={prof.name}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-[#111827] text-sm truncate">{prof.name}</h3>
                            <p className="text-xs text-[#6B7280] truncate">{prof.specialty}</p>
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs flex-shrink-0 ${
                            prof.available ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#FEF2F2] text-[#EF4444]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${prof.available ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                            {prof.available ? 'Disponible' : 'Ocupado'}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mt-1.5">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-medium text-[#374151]">{prof.rating.toFixed(1)}</span>
                        </div>

                        {prof.badge && (
                          <span className="inline-flex items-center gap-1 text-xs bg-[#EFF6FF] text-[#1E40AF] px-2 py-0.5 rounded-full mt-1.5">
                            <Award className="w-2.5 h-2.5" /> {prof.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-[#6B7280] mt-3 line-clamp-2 leading-relaxed">
                      {prof.shortDescription}
                    </p>
                  </div>

                  {selectedId === prof.id && (
                    <div className="px-4 pb-4 flex gap-2">
                      <Link
                        to={`/profesional/${prof.id}`}
                        className="flex-1 text-center py-2 text-sm font-medium text-[#1E40AF] border border-[#1E40AF] rounded-lg hover:bg-[#EFF6FF] transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        Ver perfil
                      </Link>
                      <Link
                        to={`/agendar/${prof.id}`}
                        className="flex-1 text-center py-2 text-sm font-medium text-white bg-[#1E40AF] rounded-lg hover:bg-[#1D3FA0] transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        Agendar cita
                      </Link>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-[#E5E7EB] flex-shrink-0">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || loading}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <span className="text-sm text-[#6B7280]">
                Página {page + 1} de {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || loading}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className={`flex-1 relative ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
          <RealMap
            professionals={filtered as any}
            selectedId={selectedId}
            onSelect={(id: string) => setSelectedId(selectedId === id ? null : id)}
          />

          {selectedPro && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] p-4 z-20">
              <div className="flex items-start gap-3">
                <img src={selectedPro.photo} alt={selectedPro.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-[#111827] text-sm">{selectedPro.name}</p>
                      <p className="text-xs text-[#6B7280]">{selectedPro.specialty}</p>
                    </div>
                    <button onClick={() => setSelectedId(null)}>
                      <X className="w-4 h-4 text-[#9CA3AF]" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium text-[#374151]">{selectedPro.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Link
                  to={`/profesional/${selectedPro.id}`}
                  className="flex-1 text-center py-2 text-sm font-medium text-[#1E40AF] border border-[#1E40AF] rounded-lg hover:bg-[#EFF6FF] transition-colors"
                >
                  Ver perfil
                </Link>
                <Link
                  to={`/agendar/${selectedPro.id}`}
                  className="flex-1 text-center py-2 text-sm font-medium text-white bg-[#1E40AF] rounded-lg hover:bg-[#1D3FA0] transition-colors"
                >
                  Agendar
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}