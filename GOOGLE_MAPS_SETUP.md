# Integración Google Maps — Guía de configuración

## ¿Qué se implementó?

### 1. `GoogleMapPicker.tsx` (nuevo)
Componente para el **perfil del profesional** (`ProfessionalDashboard → Editar perfil`):
- Campo de dirección con **Google Places Autocomplete** (sugerencias en tiempo real, filtrado a Colombia)
- **Mapa interactivo** que muestra el pin en la dirección ingresada
- Al escribir y seleccionar una dirección, el mapa hace zoom y centra el marcador
- El profesional también puede **hacer clic en el mapa** para ajustar la ubicación manualmente
- Devuelve `{ formattedAddress, lat, lng }` para que el backend guarde las coordenadas

### 2. `RealMap.tsx` (nuevo — reemplaza `MockMap.tsx`)
Mapa real de Google Maps para la **página de búsqueda** (`SearchPage`):
- Geocodifica automáticamente la dirección de cada profesional para obtener sus coordenadas reales
- Marcadores numerados con el color de marca `#1E40AF`
- Al seleccionar un profesional en la lista, el mapa centra y hace zoom en su ubicación
- InfoWindow con foto, nombre, especialidad, rating y distancia al hacer clic en un marcador

### 3. `ProfessionalDashboard.tsx` (actualizado)
- El campo de "Dirección de trabajo" fue reemplazado por el `GoogleMapPicker`
- Al guardar cambios, el objeto `workAddress` contiene `{ formattedAddress, lat, lng }`

---

## Pasos de instalación

### Paso 1 — Instalar la librería
```bash
cd byme-marketplace
pnpm add @react-google-maps/api
# o con npm:
npm install @react-google-maps/api
```

### Paso 2 — Crear el archivo `.env`
```bash
cp .env.example .env
```
Edita `.env` y reemplaza `AIzaSy_TU_API_KEY_AQUI` con tu API Key real:
```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Paso 3 — Verificar APIs habilitadas en Google Cloud Console
Tu API Key ya tiene habilitadas las APIs necesarias. Para este proyecto se usan:
| API | Uso |
|-----|-----|
| **Maps JavaScript API** | Renderizar el mapa interactivo |
| **Places API** | Autocompletar la dirección del profesional |
| **Geocoding API** | Convertir dirección → coordenadas y viceversa |

### Paso 4 — Reemplazar MockMap en SearchPage (opcional)
Si quieres usar el mapa real también en la página de búsqueda, en `SearchPage.tsx` cambia:
```tsx
// Antes:
import { MockMap } from '../components/MockMap';
// ...
<MockMap professionals={...} selectedId={...} onSelect={...} />

// Después:
import { RealMap } from '../components/RealMap';
// ...
<RealMap professionals={...} selectedId={...} onSelect={...} />
```

### Paso 5 — Iniciar el proyecto
```bash
pnpm dev
# o
npm run dev
```

---

## Restricciones recomendadas para la API Key (seguridad)

En Google Cloud Console → Credenciales → tu API Key:
1. **Restricciones de aplicación**: HTTP referrers → agrega `https://tu-dominio.com/*`
2. **Restricciones de API**: limita a las 3 APIs de la tabla anterior

Esto evita que otros usen tu API Key si llega a quedar expuesta.

---

## Flujo de datos (perfil profesional)

```
Usuario escribe dirección
        ↓
Places Autocomplete sugiere opciones
        ↓
Usuario selecciona una sugerencia
        ↓
GoogleMapPicker obtiene { lat, lng, formattedAddress }
        ↓
Mapa centra el marcador en esas coordenadas
        ↓
onAddressChange({ formattedAddress, lat, lng }) →
ProfessionalDashboard actualiza workAddress state
        ↓
Al presionar "Guardar cambios" → enviar workAddress al backend
```
