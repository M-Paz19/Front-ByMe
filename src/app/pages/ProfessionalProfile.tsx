import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
  Star, MapPin, Shield, Award, CheckCircle2,
  ChevronLeft, Calendar, Share2, Heart, MessageSquare, Briefcase,
  ChevronRight, AlertCircle, Layers
} from 'lucide-react';
import { IMGS } from '../data/mockData';
import { StarRating } from '../components/StarRating';
import { ProfessionalsService } from '../../services/professionals/professionals.service';
import type {
  ServiceDetailDTO,
  ProfessionalDetailPublicDTO,
  ProfessionalPublicDTO,
} from '../../services/professionals/professionals.types';

const FALLBACK_PHOTOS = [IMGS.man1, IMGS.man2, IMGS.woman1].filter(Boolean);
function getFallbackPhoto(id: string): string {
  if (FALLBACK_PHOTOS.length === 0) return '';
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % FALLBACK_PHOTOS.length;
  return FALLBACK_PHOTOS[hash];
}

function getApiMsg(err: any): string {
  const data = err?.response?.data;
  if (!data) return err?.message || 'Ocurrió un error inesperado.';
  if (typeof data === 'string') return data;
  if (typeof data?.message === 'string') return data.message;
  if (typeof data?.error === 'string') return data.error;
  return 'Ocurrió un error inesperado.';
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function ProfessionalProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'servicios' | 'resenas' | 'info'>('servicios');

  const [professional, setProfessional] = useState<ProfessionalDetailPublicDTO | null>(null);
  const [profLoading, setProfLoading] = useState(true);
  const [profError, setProfError] = useState<string | null>(null);

  const [services, setServices] = useState<ServiceDetailDTO[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const [similar, setSimilar] = useState<ProfessionalPublicDTO[]>([]);

  useEffect(() => {
    if (!id) return;
    if (!isUuid(id)) {
      setProfError('ID de profesional inválido.');
      setProfLoading(false);
      return;
    }

    setProfLoading(true);
    setProfError(null);
    ProfessionalsService.getPublicById(id)
      .then((data) => setProfessional(data))
      .catch((e) => setProfError(getApiMsg(e)))
      .finally(() => setProfLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !isUuid(id) || activeTab !== 'servicios') return;

    let mounted = true;
    setServicesLoading(true);
    setServicesError(null);
    ProfessionalsService.getServicesByProfessionalId(id)
      .then((list) => {
        if (mounted) setServices(list);
      })
      .catch((e) => {
        if (mounted) setServicesError(getApiMsg(e));
      })
      .finally(() => {
        if (mounted) setServicesLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, activeTab]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    ProfessionalsService.getPublicList(0, 6)
      .then((page) => {
        if (!mounted) return;
        const filtered = (page.content || []).filter(p => p.id !== id).slice(0, 3);
        setSimilar(filtered);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [id]);

  if (profError) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] pt-16 flex items-center justify-center p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-[#EF4444]" />
          </div>
          <h2 className="text-xl font-bold text-[#111827] mb-2">No se encontró el profesional</h2>
          <p className="text-[#6B7280] mb-6">{profError}</p>
          <Link
            to="/buscar"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] transition-colors"
          >
            Volver a buscar
          </Link>
        </div>
      </div>
    );
  }

  const profName = professional ? `${professional.firstName} ${professional.lastName}`.trim() : '';
  const profPhoto = professional ? (professional.profilePictureUrl || getFallbackPhoto(professional.id)) : '';
  const profSpecialty = professional?.professionName || '';
  const profCategory = professional?.categoryName || '';
  const profRating = professional?.rating || 0;
  const profIsAvailable = professional?.status === 'DISPONIBLE';
  const profIsVerified = professional?.accountStatus === 'VERIFICADO';
  const profIsGold = professional?.gold || false;

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
          className="absolute top-5 left-5 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full px-3 py-1.5 text-sm hover:bg-white/20 transition-colors z-10"
          type="button"
        >
          <ChevronLeft className="w-4 h-4" /> Atrás
        </button>

        <div className="absolute top-5 right-5 flex gap-2 z-10">
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
          {profLoading || !professional ? (
            <div className="animate-pulse">
              <div className="flex items-start gap-5">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#F3F4F6] -mt-16 sm:-mt-20 border-4 border-white" />
                <div className="flex-1 pt-2 space-y-3">
                  <div className="h-7 bg-[#F3F4F6] rounded w-64" />
                  <div className="h-4 bg-[#F3F4F6] rounded w-40" />
                  <div className="h-3 bg-[#F3F4F6] rounded w-56" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Foto (sale por arriba) */}
              <div className="relative w-fit -mt-16 sm:-mt-20">
                <img
                  src={profPhoto}
                  alt={profName}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${profIsAvailable ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
              </div>

              {/* Nombre + badges + meta + botón en una fila */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-[#111827]">{profName}</h1>
                    {profIsGold && (
                      <span className="flex items-center gap-1 text-xs bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-2.5 py-1 rounded-full font-medium shadow-sm">
                        <Award className="w-3 h-3" /> Top profesional
                      </span>
                    )}
                    {profIsVerified && (
                      <span className="flex items-center gap-1 text-xs bg-[#ECFDF5] text-[#10B981] px-2.5 py-1 rounded-full font-medium">
                        <Shield className="w-3 h-3" /> Verificado
                      </span>
                    )}
                  </div>
                  <p className="text-[#6B7280] mt-1">{profSpecialty}</p>
                  <div className="flex items-center gap-1 flex-wrap mt-2">
                    <Layers className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span className="text-sm text-[#6B7280]">{profCategory}</span>
                    <span className="text-[#E5E7EB] mx-2">·</span>
                    <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span className="text-sm text-[#10B981] font-medium">Popayán</span>
                  </div>
                </div>

                <Link
                  to={`/agendar/${professional.id}`}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] transition-colors flex-shrink-0 w-full sm:w-auto"
                >
                  <Calendar className="w-4 h-4" /> Agendar cita
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#F3F4F6]">
                <div className="text-center">
                  <Star className="w-5 h-5 mx-auto mb-1 text-yellow-400 fill-yellow-400" />
                  <p className="font-bold text-[#111827]">{profRating.toFixed(1)}</p>
                  <p className="text-xs text-[#9CA3AF]">Calificación</p>
                </div>
                <div className="text-center">
                  <Briefcase className="w-5 h-5 mx-auto mb-1 text-[#1E40AF]" />
                  <p className="font-bold text-[#111827] truncate">{profSpecialty}</p>
                  <p className="text-xs text-[#9CA3AF]">Profesión</p>
                </div>
                <div className="text-center">
                  <Shield className="w-5 h-5 mx-auto mb-1 text-[#10B981]" />
                  <p className="font-bold text-[#111827]">
                    {profIsVerified ? 'Verificado' : 'Sin verificar'}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">Cuenta</p>
                </div>
                <div className="text-center">
                  <CheckCircle2 className={`w-5 h-5 mx-auto mb-1 ${profIsAvailable ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`} />
                  <p className="font-bold text-[#111827]">{profIsAvailable ? 'Disponible' : 'Ocupado'}</p>
                  <p className="text-xs text-[#9CA3AF]">Estado</p>
                </div>
              </div>
            </>
          )}
        </div>

        {!profLoading && professional && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-16">
            <div className="lg:col-span-2 space-y-5">
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                profIsAvailable ? 'bg-[#ECFDF5] border-[#A7F3D0]' : 'bg-[#FEF2F2] border-[#FECACA]'
              }`}>
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${profIsAvailable ? 'bg-[#10B981] animate-pulse' : 'bg-[#EF4444]'}`} />
                <div>
                  <p className={`text-sm font-semibold ${profIsAvailable ? 'text-[#065F46]' : 'text-[#991B1B]'}`}>
                    {profIsAvailable ? '¡Disponible para trabajar hoy!' : 'No disponible actualmente'}
                  </p>
                  <p className={`text-xs ${profIsAvailable ? 'text-[#047857]' : 'text-[#DC2626]'}`}>
                    {profIsAvailable ? 'Envía tu solicitud y propondrá un horario' : 'Consulta disponibilidad para esta semana'}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                <div className="flex border-b border-[#E5E7EB]">
                  {([
                    { key: 'servicios', label: 'Servicios' },
                    { key: 'resenas', label: 'Reseñas' },
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
                          <div className="h-20 bg-[#F3F4F6] rounded-xl border border-[#E5E7EB] animate-pulse" />
                          <div className="h-20 bg-[#F3F4F6] rounded-xl border border-[#E5E7EB] animate-pulse" />
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
                              {service.description && (
                                <p className="text-sm text-[#6B7280] mt-1 ml-6">{service.description}</p>
                              )}
                              <div className="flex items-center gap-1 mt-1.5 ml-6">
                                <span className="text-xs text-[#9CA3AF]">{service.estimatedDurationHours} horas estimadas</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-[#1E40AF]">${Number(service.basePrice).toLocaleString()}</p>
                              <Link
                                to={`/agendar/${professional.id}?service=${service.id}`}
                                className="text-xs text-[#1E40AF] hover:underline mt-0.5 inline-block"
                              >
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
                          <p className="text-5xl font-bold text-[#111827]">{profRating.toFixed(1)}</p>
                          <StarRating rating={profRating} showNumber={false} size="md" />
                          <p className="text-xs text-[#9CA3AF] mt-1">Calificación promedio</p>
                        </div>
                        <div className="flex-1 text-sm text-[#6B7280]">
                          Las reseñas detalladas estarán disponibles próximamente.
                        </div>
                      </div>

                      <div className="text-center py-8 text-sm text-[#9CA3AF]">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 text-[#D1D5DB]" />
                        <p>Aún no hay reseñas para mostrar</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'info' && (
                    <div className="space-y-4">
                      {[
                        { label: 'Profesión', value: profSpecialty, icon: Briefcase },
                        { label: 'Categoría', value: profCategory, icon: Layers },
                        { label: 'Estado de cuenta', value: profIsVerified ? 'Verificado' : 'Sin verificar', icon: Shield },
                        { label: 'Estado actual', value: profIsAvailable ? 'Disponible' : 'No disponible', icon: CheckCircle2 },
                        ...(profIsGold ? [{ label: 'Reconocimiento', value: 'Top profesional', icon: Award }] : []),
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
                  Solicita una cita y el profesional propondrá un horario.
                </p>
                <Link
                  to={`/agendar/${professional.id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#1E40AF] text-white rounded-xl text-sm font-semibold hover:bg-[#1D3FA0] transition-colors"
                >
                  <Calendar className="w-4 h-4" /> Agendar ahora
                </Link>
                <button
                  className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 border border-[#E5E7EB] text-[#9CA3AF] rounded-xl text-sm font-medium cursor-not-allowed"
                  type="button"
                  disabled
                  title="Próximamente"
                >
                  <MessageSquare className="w-4 h-4" /> Enviar mensaje
                </button>
                <p className="text-xs text-center text-[#9CA3AF] mt-3 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" /> Pago protegido por ByMe
                </p>
              </div>

              {similar.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
                  <h3 className="font-bold text-[#111827] mb-4">Similares</h3>
                  <div className="space-y-3">
                    {similar.map(p => {
                      const fullName = `${p.firstName} ${p.lastName}`.trim();
                      const photo = p.profilePictureUrl || getFallbackPhoto(p.id);
                      return (
                        <Link
                          key={p.id}
                          to={`/profesional/${p.id}`}
                          className="flex items-center gap-3 hover:bg-[#F9FAFB] p-2 rounded-lg transition-colors -mx-2"
                        >
                          <img src={photo} alt={fullName} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#111827] truncate">{fullName}</p>
                            <p className="text-xs text-[#9CA3AF] truncate">{p.professionName}</p>
                            <div className="flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs text-[#374151]">{(p.rating || 0).toFixed(1)}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}