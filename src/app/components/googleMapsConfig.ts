/**
 * Configuración compartida del Google Maps Loader.
 * ─────────────────────────────────────────────────────────────────────────────
 * @react-google-maps/api carga Google Maps UNA SOLA VEZ por sesión.
 * Si dos componentes lo cargan con opciones distintas (libraries diferentes,
 * idioma diferente, etc.), arroja "Loader must not be called again with
 * different options".
 *
 * Por eso, TODOS los componentes que usen `useJsApiLoader` deben importar
 * estas opciones desde aquí, en vez de definirlas localmente.
 */

import type { LoadScriptProps } from '@react-google-maps/api';

export const GOOGLE_MAPS_LIBRARIES: LoadScriptProps['libraries'] = ['places'];

export const GOOGLE_MAPS_LOADER_OPTIONS = {
  id: 'byme-google-maps',
  googleMapsApiKey: (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? '',
  libraries: GOOGLE_MAPS_LIBRARIES,
  language: 'es',
  region: 'CO',
} as const;