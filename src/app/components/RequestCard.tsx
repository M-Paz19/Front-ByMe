/**
 * RequestCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Card que renderiza una solicitud de servicio.
 *
 * Se usa tanto en el UserDashboard (vista cliente) como en el
 * ProfessionalDashboard (cuando un profesional ve las reservas que ÉL hizo
 * como cliente a otros profesionales).
 *
 * Props:
 *   - req: la solicitud a renderizar
 *   - onConfirm: callback cuando el usuario confirma (visible si status === 'ACEPTADA')
 *   - onCancel: callback cuando el usuario cancela (visible si status puede cancelarse)
 *   - actionLoadingId: id de la solicitud que está procesando una acción, para mostrar loading
 *   - professionalsById: cache de profesionales conocidos { uuid -> { firstName, lastName } }
 *     Si no se pasa, muestra el UUID truncado como fallback.
 *
 * Las acciones se muestran según el estado:
 *   - PENDIENTE          → Cancelar
 *   - ACEPTADA           → Confirmar + Cancelar
 *   - CONFIRMADA         → Cancelar
 *   - EN_CAMINO/EN_PROCESO/COMPLETADA/RECHAZADA/CANCELADA → solo ver
 */
import React from 'react';
import { Link } from 'react-router';
import {
  Calendar, Clock, MapPin, CheckCircle2, XCircle, AlertCircle,
  Briefcase, Send, PlayCircle, Truck, User,
} from 'lucide-react';
import type { ServiceRequestDTO, RequestStatus } from '../../services/requests/requests.types';

const STATUS_CONFIG: Record<RequestStatus, {
  label: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
}> = {
  PENDIENTE:  { label: 'Pendiente',    icon: AlertCircle,  color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]', border: 'border-[#FCD34D]' },
  ACEPTADA:   { label: 'Aceptada',     icon: Send,         color: 'text-[#1E40AF]', bg: 'bg-[#EFF6FF]', border: 'border-[#93C5FD]' },
  CONFIRMADA: { label: 'Confirmada',   icon: CheckCircle2, color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]', border: 'border-[#A7F3D0]' },
  EN_CAMINO:  { label: 'En camino',    icon: Truck,        color: 'text-[#7C3AED]', bg: 'bg-[#F5F3FF]', border: 'border-[#C4B5FD]' },
  EN_PROCESO: { label: 'En proceso',   icon: PlayCircle,   color: 'text-[#0369A1]', bg: 'bg-[#F0F9FF]', border: 'border-[#7DD3FC]' },
  COMPLETADA: { label: 'Completada',   icon: CheckCircle2, color: 'text-[#6B7280]', bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]' },
  RECHAZADA:  { label: 'Rechazada',    icon: XCircle,      color: 'text-[#EF4444]', bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]' },
  CANCELADA:  { label: 'Cancelada',    icon: XCircle,      color: 'text-[#6B7280]', bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]' },
};

function formatPrice(v: number | null | undefined): string {
  if (typeof v !== 'number') return '—';
  return `$${v.toLocaleString()}`;
}

export interface ProfessionalInfo {
  firstName: string;
  lastName: string;
  profilePictureUrl?: string | null;
}

interface RequestCardProps {
  req: ServiceRequestDTO;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  actionLoadingId: string | null;
  professionalsById?: Record<string, ProfessionalInfo>;
}

export function RequestCard({
  req,
  onConfirm,
  onCancel,
  actionLoadingId,
  professionalsById,
}: RequestCardProps) {
  const status = STATUS_CONFIG[req.status];
  const StatusIcon = status.icon;
  const loading = actionLoadingId === req.id;

  const canConfirm = req.status === 'ACEPTADA';
  const canCancel = ['PENDIENTE', 'ACEPTADA', 'CONFIRMADA'].includes(req.status);

  // Resolver nombre del profesional desde el cache, o usar fallback al UUID truncado
  const proInfo = professionalsById?.[req.professionalId];
  const proName = proInfo
    ? `${proInfo.firstName} ${proInfo.lastName}`.trim() || `${req.professionalId.slice(0, 8)}…`
    : `${req.professionalId.slice(0, 8)}…`;

  return (
    <div className="p-5 flex flex-col gap-3">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 overflow-hidden">
          {proInfo?.profilePictureUrl ? (
            <img src={proInfo.profilePictureUrl} alt={proName} className="w-full h-full object-cover" />
          ) : (
            <Briefcase className="w-5 h-5 text-[#1E40AF]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <p className="font-semibold text-[#111827] truncate">
                {req.serviceName || 'Servicio'}
              </p>
              <p className="text-xs text-[#9CA3AF] mt-0.5 flex items-center gap-1">
                <User className="w-3 h-3" />
                Profesional:{' '}
                {proInfo ? (
                  <Link
                    to={`/profesional/${req.professionalId}`}
                    className="text-[#1E40AF] hover:underline font-medium"
                  >
                    {proName}
                  </Link>
                ) : (
                  <span>{proName}</span>
                )}
              </p>
            </div>
            <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${status.color} ${status.bg} ${status.border} flex-shrink-0`}>
              <StatusIcon className="w-3 h-3" /> {status.label}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-[#6B7280]">
            {req.scheduledDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {req.scheduledDate}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {req.workday}
            </span>
            {req.proposedStartTime && req.proposedEndTime && (
              <span className="flex items-center gap-1 text-[#1E40AF] font-medium">
                <Clock className="w-3.5 h-3.5" />
                {req.proposedStartTime.slice(0, 5)} - {req.proposedEndTime.slice(0, 5)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 mt-1 text-xs text-[#9CA3AF]">
            <MapPin className="w-3 h-3" />
            <span>{req.latitude.toFixed(4)}, {req.longitude.toFixed(4)}</span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="font-bold text-[#111827]">{formatPrice(req.servicePrice)}</p>
        </div>
      </div>

      {(canConfirm || canCancel) && (
        <div className="flex gap-2 pt-3 border-t border-[#F3F4F6]">
          {canConfirm && (
            <button
              onClick={() => onConfirm(req.id)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#10B981] text-white rounded-lg text-sm font-semibold hover:bg-[#0EA875] transition-colors disabled:opacity-60"
              type="button"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Confirmar</>
              )}
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => onCancel(req.id)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2 border border-[#E5E7EB] text-[#EF4444] rounded-lg text-sm font-medium hover:bg-[#FEF2F2] transition-colors disabled:opacity-60"
              type="button"
            >
              <XCircle className="w-4 h-4" /> Cancelar
            </button>
          )}
        </div>
      )}
    </div>
  );
}