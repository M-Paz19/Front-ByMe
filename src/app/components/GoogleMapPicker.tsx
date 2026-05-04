/**
 * GoogleMapPicker
 * ─────────────────────────────────────────────────────────────────────────────
 * Campo de dirección con Google Places Autocomplete + mapa interactivo.
 * Diseñado para usarse dentro del formulario de "Editar perfil" del profesional.
 *
 * Flujo:
 *  1. El usuario escribe → Places Autocomplete sugiere direcciones.
 *  2. Al elegir una, el mapa centra el marcador en esa ubicación.
 *  3. El usuario puede hacer clic en el mapa para ajustar el pin manualmente
 *     (geocodificación inversa → actualiza el texto del campo).
 *  4. El input hidden "address" se mantiene sincronizado para que el
 *     <form> del padre lo lea con FormData como siempre.
 *
 * APIs de Google usadas:  Maps JavaScript API · Places API · Geocoding API
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
} from '@react-google-maps/api';
import { AlertCircle, Loader2, MapPin } from 'lucide-react';
import { GOOGLE_MAPS_LOADER_OPTIONS } from './googleMapsConfig';

// ─── Constantes ───────────────────────────────────────────────────────────────

const MAP_CONTAINER_STYLE: React.CSSProperties = {
  width: '100%',
  height: '240px',
  borderRadius: '12px',
};

/** Centro por defecto → Popayán, Colombia */
const DEFAULT_CENTER = { lat: 2.4448, lng: -76.6147 };

const MAP_OPTIONS: google.maps.MapOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  styles: [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  ],
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface GoogleMapPickerProps {
  /** Valor inicial del campo (viene de user.address) */
  defaultAddress?: string;
  /**
   * Callback para que el padre pueda actualizar su propio estado si lo necesita.
   * El formulario lee la dirección desde el input hidden, así que esto es opcional.
   */
  onAddressChange?: (address: string, lat: number, lng: number) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function GoogleMapPicker({ defaultAddress = '', onAddressChange }: GoogleMapPickerProps) {
  const apiKey = GOOGLE_MAPS_LOADER_OPTIONS.googleMapsApiKey;

  const { isLoaded, loadError } = useJsApiLoader(GOOGLE_MAPS_LOADER_OPTIONS);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(null);
  const [inputValue, setInputValue] = useState(defaultAddress);
  const [geocodeError, setGeocodeError] = useState(false);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  // Ref al input hidden que el <form> leerá con name="address"
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // ── Actualiza el campo oculto y dispara el callback ────────────────────────
  const syncAddress = useCallback(
    (addr: string, lat: number, lng: number) => {
      setInputValue(addr);
      if (hiddenInputRef.current) hiddenInputRef.current.value = addr;
      onAddressChange?.(addr, lat, lng);
    },
    [onAddressChange],
  );

  // ── Geocodificar la dirección por defecto al montar ────────────────────────
  useEffect(() => {
    if (!isLoaded || !defaultAddress) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: defaultAddress, region: 'CO' }, (results, status) => {
      if (status === 'OK' && results?.[0]?.geometry?.location) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        setMarkerPos({ lat, lng });
        setCenter({ lat, lng });
        setGeocodeError(false);
      } else {
        setGeocodeError(true);
      }
    });
  }, [isLoaded, defaultAddress]);

  // ── Clic en el mapa → geocodificación inversa ──────────────────────────────
  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPos({ lat, lng });
      setCenter({ lat, lng });
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          syncAddress(results[0].formatted_address, lat, lng);
        }
      });
    },
    [syncAddress],
  );

  // ── Autocomplete: lugar seleccionado ──────────────────────────────────────
  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry?.location) return;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const addr = place.formatted_address ?? inputValue;
    setMarkerPos({ lat, lng });
    setCenter({ lat, lng });
    setGeocodeError(false);
    map?.panTo({ lat, lng });
    map?.setZoom(17);
    syncAddress(addr, lat, lng);
  };

  // ── Estados de carga / error ───────────────────────────────────────────────
  if (!apiKey) {
    return (
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        Falta la variable <code className="font-mono bg-amber-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> en el archivo <code className="font-mono bg-amber-100 px-1 rounded">.env</code>.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        Error al cargar Google Maps. Verifica que la API Key sea válida y que Maps JavaScript API + Places API estén habilitadas.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="space-y-2">
        {/* Skeleton del input */}
        <div className="w-full h-11 bg-[#F3F4F6] rounded-xl animate-pulse" />
        <div className="flex items-center gap-2 text-[#9CA3AF] text-sm py-1">
          <Loader2 className="w-4 h-4 animate-spin" />
          Cargando mapa…
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      {/*
        Input VISIBLE con Autocomplete.
        El <form> NO leerá este input directamente (no tiene `name`).
        El valor real va al input hidden de abajo.
      */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] z-10 pointer-events-none" />
        <Autocomplete
          onLoad={(ac) => { autocompleteRef.current = ac; }}
          onPlaceChanged={onPlaceChanged}
          options={{ componentRestrictions: { country: 'co' } }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              // Sincronizar también mientras escribe (sin coordenadas exactas)
              if (hiddenInputRef.current) hiddenInputRef.current.value = e.target.value;
            }}
            placeholder="Ej: Calle 5 # 4-32, Popayán, Cauca"
            className="w-full pl-9 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all text-sm"
          />
        </Autocomplete>
      </div>

      {/* Input OCULTO que el <form> lee con name="address" */}
      <input
        ref={hiddenInputRef}
        type="hidden"
        name="address"
        defaultValue={defaultAddress}
      />

      {geocodeError && (
        <p className="text-xs text-amber-600 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          La dirección guardada no pudo ubicarse en el mapa. Busca una nueva dirección arriba.
        </p>
      )}

      {/* Mapa */}
      <div className="rounded-xl overflow-hidden border border-[#E5E7EB] shadow-sm">
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={center}
          zoom={markerPos ? 16 : 13}
          options={MAP_OPTIONS}
          onLoad={(m) => setMap(m)}
          onUnmount={() => setMap(null)}
          onClick={onMapClick}
        >
          {markerPos && (
            <MarkerF
              position={markerPos}
              title={inputValue}
              animation={google.maps.Animation.DROP}
            />
          )}
        </GoogleMap>
      </div>

      <p className="text-xs text-[#9CA3AF]">
        💡 Selecciona una sugerencia del campo o haz clic en el mapa para ajustar el pin.
      </p>
    </div>
  );
}