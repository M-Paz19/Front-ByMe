import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { UpdateProfileRequest } from "../../services/auth/auth.types";

export function ProfilePage() {
  const { user, role, updateProfile, authLoading, authError } = useApp();
  const navigate = useNavigate();

  const [success, setSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const title = useMemo(() => {
    if (role === "profesional") return "Perfil profesional";
    if (role === "admin") return "Perfil";
    return "Mi perfil";
  }, [role]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(null);
    setFormError(null);

    // Validación de archivo (según API: imagen máx 5MB)
    if (file) {
      const isImage = file.type?.startsWith("image/");
      if (!isImage) {
        setFormError("El archivo debe ser una imagen (PNG/JPG).");
        return;
      }
      const maxBytes = 5 * 1024 * 1024;
      if (file.size > maxBytes) {
        setFormError("La imagen supera el máximo permitido (5MB).");
        return;
      }
    }

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

    // Evita request vacía si tampoco hay archivo
    if (Object.keys(payload).length === 0 && !file) {
      setFormError("No hay cambios para guardar.");
      return;
    }

    try {
      await updateProfile(payload, file);
      setSuccess("Perfil actualizado exitosamente.");
      setFile(null);
    } catch {
      // El mensaje lo muestra authError desde el contexto
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111827] mb-6 transition-colors"
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
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
              Foto de perfil
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center overflow-hidden">
                <Camera className="w-6 h-6 text-[#9CA3AF]" />
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(ev) => setFile(ev.target.files?.[0] || null)}
                  className="block w-full text-sm text-[#374151] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#F3F4F6] file:text-[#111827] hover:file:bg-[#E5E7EB]"
                />
                <p className="text-xs text-[#9CA3AF] mt-1">PNG/JPG. Máx. 5MB.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Nombre
              </label>
              <input
                name="firstName"
                defaultValue={user?.firstName || ""}
                type="text"
                minLength={2}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Apellido
              </label>
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
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Teléfono
              </label>
              <input
                name="phone"
                defaultValue={""}
                type="tel"
                placeholder="3001234567"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
              />
              <p className="text-xs text-[#9CA3AF] mt-1">
                Si lo dejas vacío, no se actualiza.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Edad
              </label>
              <input
                name="age"
                defaultValue={""}
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
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
              Dirección
            </label>
            <input
              name="address"
              defaultValue={""}
              type="text"
              placeholder="Calle 123 #45-67"
              className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all"
            />
            <p className="text-xs text-[#9CA3AF] mt-1">
              Si lo dejas vacío, no se actualiza.
            </p>
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