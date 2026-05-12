/**
 * AcceptModal
 * ─────────────────────────────────────────────────────────
 * Modal para aceptar una solicitud de servicio.
 * El profesional propone una hora de inicio y una hora de fin.
 *
 * Validaciones:
 *  - startTime y endTime obligatorios
 *  - endTime > startTime
 *
 * Al abrir, los campos se resetean a 08:00 y 10:00.
 */
import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface AcceptModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (startTime: string, endTime: string) => void;
}

export function AcceptModal(props: AcceptModalProps) {
  const { open, loading, onClose, onSubmit } = props;
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStartTime('08:00');
      setEndTime('10:00');
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const submit = () => {
    setError(null);
    if (!startTime || !endTime) {
      setError('Debes ingresar hora de inicio y fin.');
      return;
    }
    if (endTime <= startTime) {
      setError('La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }
    onSubmit(`${startTime}:00`, `${endTime}:00`);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
            <div>
              <h2 className="text-base font-bold text-[#111827]">Aceptar solicitud</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">Propone el horario para el servicio.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>

          <div className="px-5 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="accept-start" className="block text-sm font-medium text-[#374151] mb-1.5">
                  Hora de inicio
                </label>
                <input
                  id="accept-start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                />
              </div>
              <div>
                <label htmlFor="accept-end" className="block text-sm font-medium text-[#374151] mb-1.5">
                  Hora de fin
                </label>
                <input
                  id="accept-end"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                />
              </div>
            </div>

            {error && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#0EA875] text-white px-4 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Aceptar solicitud</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}