// src/app/components/UserAvatar.tsx
// Componente reutilizable para mostrar la foto de perfil del usuario.
// Maneja automáticamente errores de carga (403 de S3, imagen no encontrada, etc.)
// y muestra un avatar por defecto estilo red social.

import React, { useState, useCallback } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface UserAvatarProps {
  /** URL de la foto de perfil (puede venir de S3 u otra fuente) */
  src?: string | null;
  /** Nombre del usuario — se usa para las iniciales del fallback */
  name?: string | null;
  /** Tamaño del avatar */
  size?: AvatarSize;
  /** Clases CSS adicionales */
  className?: string;
  /** Alt text para accesibilidad */
  alt?: string;
  /** Mostrar indicador de "en línea" */
  showOnlineIndicator?: boolean;
  /** Si el usuario está en línea (solo aplica si showOnlineIndicator=true) */
  isOnline?: boolean;
}

// ─── Configuración de tamaños ─────────────────────────────────────────────────

const SIZE_MAP: Record<AvatarSize, { container: string; text: string; indicator: string }> = {
  xs:  { container: 'w-7 h-7',   text: 'text-xs',    indicator: 'w-2 h-2 border' },
  sm:  { container: 'w-9 h-9',   text: 'text-sm',    indicator: 'w-2.5 h-2.5 border' },
  md:  { container: 'w-11 h-11', text: 'text-base',  indicator: 'w-3 h-3 border-2' },
  lg:  { container: 'w-16 h-16', text: 'text-xl',    indicator: 'w-3.5 h-3.5 border-2' },
  xl:  { container: 'w-24 h-24', text: 'text-3xl',   indicator: 'w-4 h-4 border-2' },
  '2xl': { container: 'w-32 h-32', text: 'text-4xl', indicator: 'w-5 h-5 border-2' },
};

// ─── Paleta de colores para el avatar de iniciales ───────────────────────────
// Paleta consistente: el mismo nombre siempre genera el mismo color

const AVATAR_COLORS = [
  { bg: 'bg-violet-100',  text: 'text-violet-700' },
  { bg: 'bg-blue-100',    text: 'text-blue-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-amber-100',   text: 'text-amber-700' },
  { bg: 'bg-rose-100',    text: 'text-rose-700' },
  { bg: 'bg-cyan-100',    text: 'text-cyan-700' },
  { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700' },
  { bg: 'bg-orange-100',  text: 'text-orange-700' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Genera las iniciales a partir del nombre completo.
 * "Juan Pérez" → "JP" | "María" → "M" | "" → null
 */
function getInitials(name: string | null | undefined): string | null {
  if (!name?.trim()) return null;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Devuelve un color consistente basado en el nombre (hash simple).
 */
function getColorForName(name: string | null | undefined) {
  if (!name) return AVATAR_COLORS[0];
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

// ─── SVG del avatar genérico (sin nombre / sin iniciales) ────────────────────

const DefaultAvatarSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Fondo */}
    <rect width="40" height="40" fill="#E5E7EB" />
    {/* Cabeza */}
    <circle cx="20" cy="15" r="7" fill="#9CA3AF" />
    {/* Cuerpo / hombros */}
    <ellipse cx="20" cy="34" rx="12" ry="8" fill="#9CA3AF" />
  </svg>
);

// ─── Componente principal ─────────────────────────────────────────────────────

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  alt,
  showOnlineIndicator = false,
  isOnline = false,
}) => {
  const [imgError, setImgError] = useState(false);

  // Resetear el error si cambia la URL (el usuario sube una foto nueva)
  const handleError = useCallback(() => {
    setImgError(true);
  }, []);

  const { container, text, indicator } = SIZE_MAP[size];
  const initials = getInitials(name);
  const color = getColorForName(name);
  const altText = alt ?? (name ? `Foto de perfil de ${name}` : 'Avatar de usuario');

  // ── Decidir qué mostrar ──────────────────────────────────────────────────
  const showImage = !!src && !imgError;
  const showInitials = !showImage && !!initials;
  // showDefaultSVG cuando no hay ni imagen ni nombre

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      <div
        className={`
          ${container}
          rounded-full
          overflow-hidden
          ring-2 ring-white
          shadow-sm
          flex items-center justify-center
          select-none
          ${!showImage ? (showInitials ? `${color.bg}` : '') : ''}
        `}
      >
        {showImage && (
          <img
            src={src}
            alt={altText}
            onError={handleError}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {showInitials && (
          <span
            className={`font-semibold ${text} ${color.text} leading-none`}
            aria-label={altText}
          >
            {initials}
          </span>
        )}

        {!showImage && !showInitials && (
          <DefaultAvatarSVG className="w-full h-full" />
        )}
      </div>

      {/* Indicador de en línea */}
      {showOnlineIndicator && (
        <span
          className={`
            absolute bottom-0 right-0
            ${indicator}
            rounded-full
            border-white
            ${isOnline ? 'bg-emerald-400' : 'bg-gray-300'}
          `}
          aria-label={isOnline ? 'En línea' : 'Desconectado'}
        />
      )}
    </div>
  );
};

export default UserAvatar;
