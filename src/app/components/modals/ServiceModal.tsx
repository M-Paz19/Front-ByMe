/**
 * ServiceModal
 * ─────────────────────────────────────────────────────────
 * Modal para crear o editar un servicio profesional.
 *
 * Props:
 *  - open: si está abierto o no
 *  - mode: 'create' (nuevo) o 'edit' (modificar existente)
 *  - initial: valores iniciales en modo edit
 *  - loading: deshabilita el botón mientras guarda
 *  - onClose: callback al cancelar
 *  - onSubmit: callback con los datos validados
 *
 * Validaciones:
 *  - name: mínimo 3 caracteres
 *  - description: mínimo 10 caracteres
 *  - estimatedDurationHours: número ≥ 1
 *  - basePrice: número ≥ 0
 */
import React, { useEffect, useState } from 'react';
import { Save, X } from 'lucide-react';
import type { ServiceDetailDTO } from '../../../services/professionals/professionals.types';

interface ServiceFormData {
  name: string;
  description: string;
  estimatedDurationHours: number;
  basePrice: number;
}

interface ServiceModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: Partial<ServiceDetailDTO>;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => void;
}

export function ServiceModal(props: ServiceModalProps) {
  const { open, mode, initial, loading, onClose, onSubmit } = props;

  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [estimatedDurationHours, setEstimatedDurationHours] = useState(
    typeof initial?.estimatedDurationHours === 'number' ? String(initial.estimatedDurationHours) : ''
  );
  const [basePrice, setBasePrice] = useState(
    typeof initial?.basePrice === 'number' ? String(initial.basePrice) : ''
  );
  const [error, setError] = useState<string | null>(null);

  // Reiniciar/hidratar form cuando se abre el modal o cambia `initial`
  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? '');
    setDescription(initial?.description ?? '');
    setEstimatedDurationHours(
      typeof initial?.estimatedDurationHours === 'number' ? String(initial.estimatedDurationHours) : ''
    );
    setBasePrice(
      typeof initial?.basePrice === 'number' ? String(initial.basePrice) : ''
    );
    setError(null);
  }, [open, initial]);

  if (!open) return null;

  const submit = () => {
    setError(null);
    const n = name.trim();
    const d = description.trim();
    const dur = Number(estimatedDurationHours);
    const price = Number(basePrice);

    if (n.length < 3) return setError('El nombre debe tener mínimo 3 caracteres.');
    if (d.length < 10) return setError('La descripción debe tener mínimo 10 caracteres.');
    if (!Number.isFinite(dur) || dur < 1) return setError('La duración debe ser un número entero (mínimo 1).');
    if (!Number.isFinite(price) || price < 0) return setError('El precio debe ser un número válido (mínimo 0).');

    onSubmit({ name: n, description: d, estimatedDurationHours: dur, basePrice: price });
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E5E7EB] shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
            <div>
              <h2 className="text-base font-bold text-[#111827]">
                {mode === 'create' ? 'Añadir servicio' : 'Editar servicio'}
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">Completa los datos del servicio.</p>
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
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Nombre</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                placeholder="Ej: Reparación de tuberías"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] resize-none transition-all"
                placeholder="Describe el servicio (mínimo 10 caracteres)"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Duración (horas)</label>
                <input
                  value={estimatedDurationHours}
                  onChange={(e) => setEstimatedDurationHours(e.target.value)}
                  type="number"
                  min={1}
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Precio base (COP)</label>
                <input
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  type="number"
                  min={0}
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
                  placeholder="25000"
                />
              </div>
            </div>

            {error && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 whitespace-pre-line">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-[#1E40AF] hover:bg-[#1D3FA0] text-white px-4 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Save className="w-4 h-4" /> Guardar</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}