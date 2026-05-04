/**
 * GoogleMapPicker
 * ─────────────────────────────────────────────────────────────────────────────
 * Campo de dirección con Google Places Autocomplete + mapa interactivo.
 *
 * APIs de Google usadas:  Maps JavaScript API · Places API · Geocoding API
 *
 * NOTA DE DISEÑO:
 * El input es CONTROLADO por React (`value=...`). Hay tres formas de modificar
 * la dirección:
 *  1. Escribir a mano: dispara `onAddressChange(addr, NaN, NaN)` para que el
 *     padre actualice su state. lat/lng son NaN porque no sabemos las coords.
 *  2. Elegir sugerencia del autocomplete: dispara `onAddressChange(addr, lat, lng)`.
 *  3. Click en el mapa: dispara `onAddressChange(addr, lat, lng)` con la dirección
 *     resuelta por geocodificación inversa.
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

const MAP_CONTAINER_STYLE: React.CSSProperties = {
  width: '100%',
  height: '240px',
  borderRadius: '12px',
};

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

interface GoogleMapPickerProps {
  /** Valor inicial del campo (viene de user.address) */
  defaultAddress?: string;
  /**
   * Callback que se dispara cuando cambia la dirección.
   * - Si el usuario eligió sugerencia o hizo clic en el mapa: lat/lng son números válidos
   * - Si el usuario solo escribió a mano: lat=NaN, lng=NaN
   */
  onAddressChange?: (address: string, lat: number, lng: number) => void;
}

export function GoogleMapPicker({ defaultAddress = '', onAddressChange }: GoogleMapPickerProps) {
  const apiKey = GOOGLE_MAPS_LOADER_OPTIONS.googleMapsApiKey;

  const { isLoaded, loadError } = useJsApiLoader(GOOGLE_MAPS_LOADER_OPTIONS);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(null);
  const [inputValue, setInputValue] = useState(defaultAddress);
  const [geocodeError, setGeocodeError] = useState(false);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Sincronizar el inputValue cuando llega defaultAddress por primera vez.
  // Solo lo hacemos UNA vez para no sobrescribir lo que el usuario está escribiendo.
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current && defaultAddress) {
      setInputValue(defaultAddress);
      initializedRef.current = true;
    }
  }, [defaultAddress]);

  const syncAddress = useCallback(
    (addr: string, lat: number, lng: number) => {
      setInputValue(addr);
      onAddressChange?.(addr, lat, lng);
    },
    [onAddressChange],
  );

  // Geocodificar la dirección por defecto al montar
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

  // Cambio manual del input: notifica al padre con coords NaN
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onAddressChange?.(value, NaN, NaN);
  };

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
        <div className="w-full h-11 bg-[#F3F4F6] rounded-xl animate-pulse" />
        <div className="flex items-center gap-2 text-[#9CA3AF] text-sm py-1">
          <Loader2 className="w-4 h-4 animate-spin" />
          Cargando mapa…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] z-10 pointer-events-none" />
        <Autocomplete
          onLoad={(ac) => { autocompleteRef.current = ac; }}
          onPlaceChanged={onPlaceChanged}
          options={{ componentRestrictions: { country: 'co' } }}
        >
          <input
            type="text"
            name="address"
            value={inputValue}
            onChange={handleManualChange}
            placeholder="Ej: Calle 5 # 4-32, Popayán, Cauca"
            className="w-full pl-9 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-all text-sm"
          />
        </Autocomplete>
      </div>

      {geocodeError && (
        <p className="text-xs text-amber-600 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          La dirección guardada no pudo ubicarse en el mapa. Busca una nueva dirección arriba.
        </p>
      )}

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