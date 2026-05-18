// src/app/hooks/useProfileImage.ts
// Hook utilitario para construir la URL de la foto de perfil desde S3
// con manejo de caché y soporte para presigned URLs futuras.

import { useMemo } from 'react';

interface UseProfileImageOptions {
  /** UUID o nombre del archivo en S3, o URL completa */
  photoKey?: string | null;
  /** Base URL del bucket S3 (default: variable de entorno) */
  bucketUrl?: string;
  /** Agregar timestamp para forzar re-fetch (útil después de subir nueva foto) */
  bustCache?: boolean;
  /** Timestamp personalizado para el cache-bust */
  cacheTimestamp?: number;
}

/**
 * Construye la URL pública de la foto de perfil desde S3.
 *
 * Si el 403 persiste, la URL se retorna igual — el componente UserAvatar
 * mostrará el fallback automáticamente via onError.
 *
 * @example
 * const { photoUrl } = useProfileImage({ photoKey: user.profilePhoto });
 * <UserAvatar src={photoUrl} name={user.fullName} />
 */
export function useProfileImage({
  photoKey,
  bucketUrl,
  bustCache = false,
  cacheTimestamp,
}: UseProfileImageOptions = {}) {
  const base =
    bucketUrl ??
    import.meta.env.VITE_S3_BUCKET_URL ??
    'https://byme-profile-photos.s3.amazonaws.com';

  const photoUrl = useMemo(() => {
    if (!photoKey) return null;

    // Si ya es una URL completa (http/https), la usamos directamente
    const isFullUrl = photoKey.startsWith('http');
    const rawUrl = isFullUrl ? photoKey : `${base}/photos_profile/${photoKey}`;

    // Cache-bust opcional (útil cuando el usuario recién actualizó su foto)
    if (bustCache) {
      const ts = cacheTimestamp ?? Date.now();
      return `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}t=${ts}`;
    }

    return rawUrl;
  }, [photoKey, base, bustCache, cacheTimestamp]);

  return { photoUrl };
}
