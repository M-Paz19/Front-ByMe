import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router"; 
import { ArrowLeft, Camera, Save, X } from "lucide-react";
import { useApp } from "../context/AppContext"; 
import type { UpdateProfileRequest } from "../../services/auth/auth.types";

type DemoRole = "visitor" | "usuario" | "profesional" | "admin";

function PhotoModal(props: {
  open: boolean;
  currentSrc: string;
  tempPreviewSrc: string | null;
  onPickFile: () => void;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  const { open, currentSrc, tempPreviewSrc, onPickFile, onClose, onConfirm, loading } = props;
  if (!open) return null;

  const shown = tempPreviewSrc || currentSrc;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
            <div>
              <h2 className="text-base font-bold text-[#111827]">Cambiar foto de perfil</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Selecciona una imagen y revisa la vista previa.
              </p>
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
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border border-[#E5E7EB] bg-[#F3F4F6] overflow-hidden flex items-center justify-center">
                {shown ? (
                  <img src={shown} alt="Vista previa" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-7 h-7 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex-1">
                <button
                  type="button"
                  onClick={onPickFile}
                  className="inline-flex items-center gap-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                >
                  <Camera className="w-4 h-4" />
                  Elegir imagen
                </button>
                <p className="text-xs text-[#9CA3AF] mt-2">PNG/JPG. Máx. 5MB.</p>
              </div>
            </div>

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
                onClick={onConfirm}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-[#1E40AF] hover:bg-[#1D3FA0] text-white px-4 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Usar esta foto</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { user, role, userPhoto, updateProfile, authLoading, authError } = useApp();
  const navigate = useNavigate();

  const title = useMemo(() => {
    const r = role as DemoRole;
    if (r === "profesional") return "Perfil profesional";
    if (r === "admin") return "Perfil";
    return "Mi perfil";
  }, [role]);

  const [success, setSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // archivo definitivo que se enviará cuando el usuario guarde
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // estado del modal
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [tempPreviewUrl, setTempPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const shownPhoto = previewUrl || userPhoto;

  const openPhotoModal = () => {
    setFormError(null);
    setSuccess(null);

    // copiamos estado actual a temporal
    setTempFile(file);
    setTempPreviewUrl(previewUrl);

    setPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    setPhotoModalOpen(false);
  };

  const pickFile = () => {
    fileInputRef.current?.click();
  };

  const onFilePicked = (f: File | null) => {
    if (!f) return;
    const isAllowed = f.type === "image/png" || f.type === "image/jpeg";
    if (!isAllowed) {
      setFormError("Formato no permitido. Usa PNG o JPG.");
      return;
    }

    const maxBytes = 5 * 1024 * 1024;
    if (f.size > maxBytes) {
      setFormError("La imagen supera el máximo permitido (5MB).");
      return;
    }

    const nextPreview = URL.createObjectURL(f);

    if (tempPreviewUrl) {
      try {
        URL.revokeObjectURL(tempPreviewUrl);
      } catch {}
    }

    setTempFile(f);
    setTempPreviewUrl(nextPreview);
  };

  const confirmPhoto = () => {
    if (previewUrl && previewUrl !== tempPreviewUrl) {
      try {
        URL.revokeObjectURL(previewUrl);
      } catch {}
    }

    setFile(tempFile);
    setPreviewUrl(tempPreviewUrl);
    setPhotoModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(null);
    setFormError(null);

    const form = new FormData(e.currentTarget);
    const firstNameRaw = String(form.get("firstName") || "").trim();
    const lastNameRaw = String(form.get("lastName") || "").trim();
    const phoneRaw = String(form.get("phone") || "").trim();
    const addressRaw = String(form.get("address") || "").trim();
    const ageRaw = String(form.get("age") || "").trim();

    let age: number | undefined;
    if (ageRaw) {
      const n = Number(ageRaw);
      if (Number.isNaN(n)) {
        setFormError("La edad debe ser un número.");
        return;
      }
      if (n < 18) {
        setFormError("Debes ser mayor de 18 años.");
        return;
      }
      age = n;
    }

    const payload: UpdateProfileRequest = {
      ...(firstNameRaw ? { firstName: firstNameRaw } : {}),
      ...(lastNameRaw ? { lastName: lastNameRaw } : {}),
      ...(phoneRaw ? { phone: phoneRaw } : {}),
      ...(addressRaw ? { address: addressRaw } : {}),
      ...(typeof age === "number" ? { age } : {}),
    };

    if (Object.keys(payload).length === 0 && !file) {
      setFormError("No hay cambios para guardar.");
      return;
    }

    try {
      await updateProfile(payload, file);
      setSuccess("Perfil actualizado exitosamente.");
    } catch (err: any) {
      setFormError(err?.response?.data?.message ?? "Error actualizando perfil");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <PhotoModal
        open={photoModalOpen}
        currentSrc={shownPhoto}
        tempPreviewSrc={tempPreviewUrl}
        onPickFile={pickFile}
        onClose={closePhotoModal}
        onConfirm={confirmPhoto}
        loading={authLoading}
      />

      {/* input oculto para el modal */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(ev) => onFilePicked(ev.target.files?.[0] || null)}
      />

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111827] mb-6 transition-colors"
        type="button"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Volver
      </button>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E5E7EB]">
          <h1 className="text-xl font-bold text-[#111827]">{title}</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Actualiza tus datos personales y tu foto de perfil.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Foto de perfil</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={openPhotoModal}
                className="w-16 h-16 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center overflow-hidden hover:opacity-95 transition"
                aria-label="Cambiar foto"
              >
                {shownPhoto ? (
                  <img src={shownPhoto} alt="Foto de perfil" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </button>

              <div className="flex-1">
                <button
                  type="button"
                  onClick={openPhotoModal}
                  className="inline-flex items-center gap-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                >
                  <Camera className="w-4 h-4" /> Cambiar foto
                </button>
                <p className="text-xs text-[#9CA3AF] mt-1">PNG/JPG. Máx. 5MB.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Nombre</label>
              <input
                name="firstName"
                defaultValue={user?.firstName || ""}
                type="text"
                minLength={2}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Apellido</label>
              <input
                name="lastName"
                defaultValue={user?.lastName || ""}
                type="text"
                minLength={2}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Teléfono</label>
              <input
                name="phone"
                defaultValue={user?.phone || ""}
                type="tel"
                placeholder="3001234567"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
              />
              <p className="text-xs text-[#9CA3AF] mt-1">Si lo dejas vacío, no se actualiza.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Edad</label>
              <input
                name="age"
                defaultValue={user?.age?.toString() || ""}
                type="number"
                min={18}
                max={120}
                placeholder="28"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
              />
              <p className="text-xs text-[#9CA3AF] mt-1">Opcional (mínimo 18).</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Dirección</label>
            <input
              name="address"
              defaultValue={user?.address || ""}
              type="text"
              placeholder="Calle 123 #45-67"
              className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
            />
            <p className="text-xs text-[#9CA3AF] mt-1">Si lo dejas vacío, no se actualiza.</p>
          </div>

          {(authError || formError) && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 whitespace-pre-line">
              {formError || authError}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={authLoading}
              className="inline-flex items-center gap-2 bg-[#1E40AF] hover:bg-[#1D3FA0] text-white px-4 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-70"
            >
              {authLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" /> Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}