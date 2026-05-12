/**
 * Configuración global para tests con Vitest.
 *
 * Se ejecuta UNA vez antes de TODOS los archivos de test.
 */
import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Después de cada test, limpia el DOM para evitar fugas entre tests
afterEach(() => {
  cleanup();
});

// Mock global de import.meta.env (Vite expone env vars así)
if (!import.meta.env) {
  (import.meta as any).env = {};
}

// Mock de URL.createObjectURL / revokeObjectURL (jsdom no las trae por defecto)
if (typeof URL.createObjectURL !== 'function') {
  URL.createObjectURL = vi.fn(() => 'blob:mock-url');
}
if (typeof URL.revokeObjectURL !== 'function') {
  URL.revokeObjectURL = vi.fn();
}

// Mock de window.scrollTo (algunos componentes lo llaman al montar)
if (typeof window.scrollTo !== 'function') {
  // @ts-expect-error – jsdom no lo trae
  window.scrollTo = vi.fn();
}

// Mock básico de window.matchMedia (Tailwind / shadcn lo usan a veces)
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}