import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
  Star, MapPin, Phone, Mail, Shield, Clock, Award, CheckCircle2,
  ChevronLeft, Calendar, Share2, Heart, MessageSquare, Briefcase,
  ChevronRight
} from 'lucide-react';
import { professionals, IMGS } from '../data/mockData';
import { StarRating } from '../components/StarRating';
import { ProfessionalsService } from '../../services/professionals/professionals.service';
import type { ServiceDetailDTO } from '../../services/professionals/professionals.types';

function getApiMsg(err: any): string {
  const data = err?.response?.data;
  if (!data) return err?.message || 'Ocurrió un error inesperado.';
  if (typeof data === 'string') return data;
  if (typeof data?.message === 'string') return data.message;
  if (typeof data?.error === 'string') return data.error;
  return 'Ocurrió un error inesperado.';
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function ProfessionalProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'servicios' | 'resenas' | 'info'>('servicios');

  // OJO: tu mock usa ids tipo "1", "2"... (no UUID)
  const prof = professionals.find(p => p.id === id) || professionals[0];

  // - si la ruta trae un UUID, úsalo
  // - si no, intenta usar prof.professionalId (si lo agregas al mock)
  // - si no hay UUID válido, NO llames al backend
  const professionalIdForApi = useMemo(() => {
    if (typeof id === 'string' && isUuid(id)) return id;

    const candidate = (prof as any)?.professionalId;
    if (typeof candidate === 'string' && isUuid(candidate)) return candidate;

    return null;
  }, [id, prof]);

  const [services, setServices] = useState<ServiceDetailDTO[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setServicesError(null);

      // Si no tenemos UUID válido, usamos los servicios mock del profesional
      if (!professionalIdForApi) {
        const mockMapped: ServiceDetailDTO[] = prof.services.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          estimatedDurationHours: parseFloat(s.duration) || 1,
          basePrice: s.price,
          professionalId: prof.id,
        }));
        setServices(mockMapped);
        return;
      }

      setServicesLoading(true);
      try {
        const list = await ProfessionalsService.getServicesByProfessionalId(professionalIdForApi);
        if (!mounted) return;
        setServices(list);
      } catch (e: any) {
        if (!mounted) return;
        setServicesError(getApiMsg(e));
      } finally {
        if (!mounted) return;
        setServicesLoading(false);
      }
    };

    if (activeTab === 'servicios') void load();

    return () => {
      mounted = false;
    };
  }, [activeTab, professionalIdForApi]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header banner */}
      <div className="relative h-64 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${IMGS.service})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full px-3 py-1.5 text-sm hover:bg-white/20 transition-colors"
          type="button"
        >
          <ChevronLeft className="w-4 h-4" /> Atrás
        </button>

        <div className="absolute top-5 right-5 flex gap-2">
          <button
            className="w-9 h-9 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20"
            type="button"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className={`w-9 h-9 backdrop-blur-sm border rounded-full flex items-center justify-center transition-colors ${
              liked ? 'bg-red-500 border-red-500 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
            type="button"
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Profile header card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] -mt-12 mb-6 p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="relative flex-shrink-0 -mt-16 sm:-mt-20">
              <img
                src={prof.photo}
                alt={prof.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
              />
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${prof.available ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-[#111827]">{prof.name}</h1>
                    {prof.badge && (
                      <span className="flex items-center gap-1 text-xs bg-[#EFF6FF] text-[#1E40AF] px-2.5 py-1 rounded-full font-medium">
                        <Award className="w-3 h-3" /> {prof.badge}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs bg-[#ECFDF5] text-[#10B981] px-2.5 py-1 rounded-full font-medium">
                      <Shield className="w-3 h-3" /> Verificado
                    </span>
                  </div>
                  <p className="text-[#6B7280] mt-1">{prof.specialty}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span className="text-sm text-[#6B7280]">{prof.address}</span>
                    <span className="text-[#E5E7EB] mx-2">·</span>
                    <span className="text-sm text-[#10B981] font-medium">{prof.distance}</span>
                  </div>
                </div>

                <div className="flex gap-2 sm:flex-col">
                  <Link
                    to={`/agendar/${prof.id}`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] transition-colors"
                  >
                    <Calendar className="w-4 h-4" /> Agendar cita
                  </Link>
                  <a
                    href={`tel:${prof.phone}`}
                    className="flex items-center gap-2 px-5 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-medium hover:bg-[#F9FAFB] transition-colors"
                  >
                    <Phone className="w-4 h-4" /> Llamar
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#F3F4F6]">
            {[
              { label: 'Calificación', value: `${prof.rating}`, icon: Star, color: '#F59E0B' },
              { label: 'Trabajos', value: `${prof.completedJobs}+`, icon: CheckCircle2, color: '#10B981' },
              { label: 'Experiencia', value: `${prof.yearsExp} años`, icon: Briefcase, color: '#1E40AF' },
              { label: 'Respuesta', value: prof.responseTime, icon: Clock, color: '#7C3AED' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-5 h-5 mx-auto mb-1" style={{ color: stat.color }} />
                <p className="font-bold text-[#111827]">{stat.value}</p>
                <p className="text-xs text-[#9CA3AF]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-16">
          <div className="lg:col-span-2 space-y-5">
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${
              prof.available ? 'bg-[#ECFDF5] border-[#A7F3D0]' : 'bg-[#FEF2F2] border-[#FECACA]'
            }`}>
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${prof.available ? 'bg-[#10B981] animate-pulse' : 'bg-[#EF4444]'}`} />
              <div>
                <p className={`text-sm font-semibold ${prof.available ? 'text-[#065F46]' : 'text-[#991B1B]'}`}>
                  {prof.available ? '¡Disponible para trabajar hoy!' : 'No disponible actualmente'}
                </p>
                <p className={`text-xs ${prof.available ? 'text-[#047857]' : 'text-[#DC2626]'}`}>
                  {prof.available ? `Responde en ${prof.responseTime}` : 'Consulta disponibilidad para esta semana'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
              <div className="flex border-b border-[#E5E7EB]">
                {([
                  { key: 'servicios', label: 'Servicios' },
                  { key: 'resenas', label: `Reseñas (${prof.reviewCount})` },
                  { key: 'info', label: 'Información' },
                ] as { key: typeof activeTab; label: string }[]).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-4 py-3.5 text-sm font-medium transition-colors ${
                      activeTab === tab.key
                        ? 'text-[#1E40AF] border-b-2 border-[#1E40AF]'
                        : 'text-[#6B7280] hover:text-[#374151]'
                    }`}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5">
                <div className="mb-5">
                  <p className="text-[#374151] leading-relaxed">{prof.description}</p>
                </div>

                {activeTab === 'servicios' && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#111827] mb-4">Servicios ofrecidos</h3>

                    {servicesError && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 whitespace-pre-line mb-3">
                        {servicesError}
                      </div>
                    )}

                    {servicesLoading ? (
                      <>
                        <div className="h-20 bg-[#F3F4F6] rounded-xl border border-[#E5E7EB]" />
                        <div className="h-20 bg-[#F3F4F6] rounded-xl border border-[#E5E7EB]" />
                        <div className="h-20 bg-[#F3F4F6] rounded-xl border border-[#E5E7EB]" />
                      </>
                    ) : services.length === 0 ? (
                      <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] text-sm text-[#6B7280]">
                        Este profesional aún no tiene servicios publicados.
                      </div>
                    ) : (
                      services.map(service => (
                        <div key={service.id} className="flex items-start justify-between gap-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] hover:border-[#1E40AF]/30 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                              <p className="font-medium text-[#111827]">{service.name}</p>
                            </div>
                            <p className="text-sm text-[#6B7280] mt-1 ml-6">{service.description}</p>
                            <div className="flex items-center gap-1 mt-1.5 ml-6">
                              <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
                              <span className="text-xs text-[#9CA3AF]">{service.estimatedDurationHours} horas</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-[#1E40AF]">${Number(service.basePrice).toLocaleString()}</p>
                            <Link to={`/agendar/${prof.id}?service=${service.id}`} className="text-xs text-[#1E40AF] hover:underline mt-0.5 inline-block">
                              Agendar →
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'resenas' && (
                  <div>
                    <div className="flex items-center gap-6 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] mb-5">
                      <div className="text-center">
                        <p className="text-5xl font-bold text-[#111827]">{prof.rating}</p>
                        <StarRating rating={prof.rating} showNumber={false} size="md" />
                        <p className="text-xs text-[#9CA3AF] mt-1">{prof.reviewCount} reseñas</p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {[5, 4, 3, 2, 1].map(stars => {
                          const pct = stars === 5 ? 72 : stars === 4 ? 18 : stars === 3 ? 7 : stars === 2 ? 2 : 1;
                          return (
                            <div key={stars} className="flex items-center gap-2">
                              <span className="text-xs text-[#6B7280] w-4">{stars}</span>
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <div className="flex-1 bg-[#E5E7EB] rounded-full h-1.5">
                                <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs text-[#9CA3AF] w-6">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {prof.reviews.map(review => (
                        <div key={review.id} className="border-b border-[#F3F4F6] pb-4 last:border-0 last:pb-0">
                          <div className="flex items-start gap-3">
                            <img src={review.userPhoto} alt={review.userName} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-[#111827] text-sm">{review.userName}</p>
                                <span className="text-xs text-[#9CA3AF]">{review.date}</span>
                              </div>
                              <StarRating rating={review.rating} showNumber={false} size="xs" />
                              <p className="text-sm text-[#6B7280] mt-1.5 leading-relaxed">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className="space-y-4">
                    {[
                      { label: 'Teléfono', value: prof.phone, icon: Phone },
                      { label: 'Correo', value: prof.email, icon: Mail },
                      { label: 'Ubicación', value: prof.address, icon: MapPin },
                      { label: 'Especialidad', value: prof.specialty, icon: Briefcase },
                      { label: 'Experiencia', value: `${prof.yearsExp} años de trayectoria`, icon: Award },
                      { label: 'Trabajos completados', value: `${prof.completedJobs} trabajos`, icon: CheckCircle2 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl">
                        <item.icon className="w-4 h-4 text-[#1E40AF] flex-shrink-0" />
                        <div>
                          <p className="text-xs text-[#9CA3AF]">{item.label}</p>
                          <p className="text-sm font-medium text-[#111827]">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
              <h3 className="font-bold text-[#111827] mb-1">Reservar servicio</h3>
              <p className="text-sm text-[#6B7280] mb-4">
                desde <span className="font-bold text-[#1E40AF] text-lg">${prof.hourlyRate.toLocaleString()}</span>/hora
              </p>
              <Link
                to={`/agendar/${prof.id}`}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] transition-colors"
              >
                <Calendar className="w-4 h-4" /> Agendar ahora
              </Link>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-medium hover:bg-[#F9FAFB] transition-colors" type="button">
                <MessageSquare className="w-4 h-4" /> Enviar mensaje
              </button>
              <p className="text-xs text-center text-[#9CA3AF] mt-3 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" /> Pago protegido por ByMe
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
              <h3 className="font-bold text-[#111827] mb-4">Similares</h3>
              <div className="space-y-3">
                {professionals.filter(p => p.id !== prof.id).slice(0, 3).map(p => (
                  <Link key={p.id} to={`/profesional/${p.id}`} className="flex items-center gap-3 hover:bg-[#F9FAFB] p-2 rounded-lg transition-colors -mx-2">
                    <img src={p.photo} alt={p.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111827] truncate">{p.name}</p>
                      <p className="text-xs text-[#9CA3AF]">{p.specialty}</p>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-[#374151]">{p.rating}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}