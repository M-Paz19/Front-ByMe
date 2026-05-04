/**
 * RealMap
 * ─────────────────────────────────────────────────────────────────────────────
 * Reemplazo del MockMap SVG con Google Maps real.
 *
 * Si el profesional ya trae `lat` y `lng` en sus props, los usa DIRECTAMENTE.
 * Si no, intenta geocodificar `prof.address` como fallback.
 *
 * Props: idénticas a MockMap
 *   - professionals: Professional[]  (con lat/lng opcionales)
 *   - selectedId: string | null
 *   - onSelect: (id: string) => void
 *
 * APIs de Google usadas:  Maps JavaScript API · Geocoding API
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  InfoWindowF,
} from '@react-google-maps/api';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { Professional } from '../data/mockData';
import { GOOGLE_MAPS_LOADER_OPTIONS } from './googleMapsConfig';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface RealMapProps {
  professionals: (Professional & { lat?: number; lng?: number })[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

interface ProfWithCoords extends Professional {
  lat?: number;
  lng?: number;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const MAP_CONTAINER_STYLE: React.CSSProperties = { width: '100%', height: '100%' };

const DEFAULT_CENTER = { lat: 2.4448, lng: -76.6147 };

const MAP_OPTIONS: google.maps.MapOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  styles: [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  ],
};

// ─── Componente ───────────────────────────────────────────────────────────────

export function RealMap({ professionals, selectedId, onSelect }: RealMapProps) {
  const apiKey = GOOGLE_MAPS_LOADER_OPTIONS.googleMapsApiKey;

  const { isLoaded, loadError } = useJsApiLoader(GOOGLE_MAPS_LOADER_OPTIONS);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [profsWithCoords, setProfsWithCoords] = useState<ProfWithCoords[]>([]);
  const [geocoding, setGeocoding] = useState(false);
  const [openInfoId, setOpenInfoId] = useState<string | null>(null);

  // ── Resolver coordenadas: usar las del prop si existen, geocodificar si no ─
  useEffect(() => {
    if (!isLoaded || professionals.length === 0) {
      setProfsWithCoords([]);
      return;
    }

    // Separar los que YA tienen coords vs. los que necesitan geocoding
    const withCoords: ProfWithCoords[] = [];
    const needGeocode: { prof: Professional; index: number }[] = [];

    const results: ProfWithCoords[] = professionals.map((p, i) => {
      const hasCoords = typeof p.lat === 'number' && typeof p.lng === 'number';
      if (hasCoords) {
        const item = { ...p, lat: p.lat, lng: p.lng };
        withCoords.push(item);
        return item;
      } else {
        needGeocode.push({ prof: p, index: i });
        return { ...p };
      }
    });

    // Si todos ya tienen coords, no hace falta geocodificar nada
    if (needGeocode.length === 0) {
      setProfsWithCoords(results);
      setGeocoding(false);
      return;
    }

    setGeocoding(true);
    const geocoder = new google.maps.Geocoder();
    let remaining = needGeocode.length;

    needGeocode.forEach(({ prof, index }) => {
      const query = prof.address
        ? `${prof.address}, Popayán, Colombia`
        : 'Popayán, Cauca, Colombia';

      geocoder.geocode({ address: query, region: 'CO' }, (geoResults, status) => {
        if (status === 'OK' && geoResults?.[0]?.geometry?.location) {
          // Pequeño offset para evitar marcadores superpuestos
          results[index].lat = geoResults[0].geometry.location.lat() + (Math.random() - 0.5) * 0.0008;
          results[index].lng = geoResults[0].geometry.location.lng() + (Math.random() - 0.5) * 0.0008;
        }
        remaining--;
        if (remaining === 0) {
          setProfsWithCoords([...results]);
          setGeocoding(false);
        }
      });
    });
  }, [isLoaded, professionals]);

  // ── Centrar en profesional seleccionado ────────────────────────────────────
  useEffect(() => {
    if (!map || !selectedId) return;
    const prof = profsWithCoords.find((p) => p.id === selectedId);
    if (prof?.lat && prof?.lng) {
      map.panTo({ lat: prof.lat, lng: prof.lng });
      map.setZoom(16);
      setOpenInfoId(selectedId);
    }
  }, [selectedId, profsWithCoords, map]);

  const onMapLoad = useCallback((m: google.maps.Map) => setMap(m), []);
  const onMapUnmount = useCallback(() => setMap(null), []);

  const handleMarkerClick = (prof: ProfWithCoords) => {
    onSelect(prof.id);
    setOpenInfoId(prof.id);
  };

  // ── Iconos ──────────────────────────────────────────────────────────────────
  const pinDefault = isLoaded
    ? {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#1E40AF',
        fillOpacity: 0.85,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 10,
      }
    : undefined;

  const pinSelected = isLoaded
    ? {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#1E40AF',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
        scale: 13,
      }
    : undefined;

  // ── Estados de error / carga ───────────────────────────────────────────────
  if (!apiKey || loadError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-3 bg-[#F9FAFB] rounded-xl">
        <AlertCircle className="w-7 h-7 text-red-400" />
        <p className="text-sm text-[#6B7280] text-center px-4">
          {!apiKey
            ? 'Falta VITE_GOOGLE_MAPS_API_KEY en el archivo .env'
            : 'Error al cargar Google Maps. Verifica la API Key.'}
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full gap-2 text-[#6B7280] text-sm">
        <Loader2 className="w-5 h-5 animate-spin" />
        Cargando mapa…
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={DEFAULT_CENTER}
        zoom={13}
        options={MAP_OPTIONS}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        onClick={() => setOpenInfoId(null)}
      >
        {profsWithCoords.map((prof, index) => {
          if (!prof.lat || !prof.lng) return null;
          const isSelected = selectedId === prof.id;
          const pos = { lat: prof.lat, lng: prof.lng };

          return (
            <React.Fragment key={prof.id}>
              <MarkerF
                position={pos}
                icon={isSelected ? pinSelected : pinDefault}
                label={{
                  text: String(index + 1),
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 'bold',
                }}
                zIndex={isSelected ? 10 : 1}
                animation={isSelected ? google.maps.Animation.BOUNCE : undefined}
                onClick={() => handleMarkerClick(prof)}
              />

              {openInfoId === prof.id && (
                <InfoWindowF
                  position={pos}
                  onCloseClick={() => setOpenInfoId(null)}
                  options={{ pixelOffset: new google.maps.Size(0, -20) }}
                >
                  <div className="p-1 w-44 font-sans">
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={prof.photo}
                        alt={prof.name}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#111827] leading-tight truncate">
                          {prof.name}
                        </p>
                        <p className="text-xs text-[#6B7280] truncate">{prof.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6]">
                      <span className="text-xs text-yellow-500">★ {prof.rating}</span>
                      {prof.distance && prof.distance !== '—' && (
                        <span className="text-xs text-[#10B981] font-medium">{prof.distance}</span>
                      )}
                    </div>
                  </div>
                </InfoWindowF>
              )}
            </React.Fragment>
          );
        })}
      </GoogleMap>

      {/* Overlay mientras geocodifica */}
      {geocoding && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
          <div className="flex items-center gap-2 text-sm text-[#374151]">
            <Loader2 className="w-4 h-4 animate-spin" />
            Localizando profesionales…
          </div>
        </div>
      )}

      {/* Etiqueta de ciudad */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm border border-[#E5E7EB] flex items-center gap-1.5 pointer-events-none">
        <span className="text-xs text-[#374151] font-medium">📍 Popayán, Colombia</span>
      </div>
    </div>
  );
}