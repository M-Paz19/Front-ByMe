/**
 * Tests para RequireAuth
 *
 * RequireAuth es un "guardián" de rutas: si el usuario NO está logueado,
 * redirige a /login. Si SÍ está logueado, renderiza sus children.
 *
 * Estrategia:
 *  - Mockear useApp para controlar isLoggedIn
 *  - Renderizar el componente dentro de un MemoryRouter (router en memoria,
 *    sin tocar window.location) y verificar:
 *      a) Si NO está logueado → vemos el contenido de /login (porque hubo redirect)
 *      b) Si SÍ está logueado → vemos los children que le pasamos
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';

vi.mock('../../context/AppContext', () => ({
  useApp: vi.fn(),
}));

import { RequireAuth } from './RequireAuth';
import { useApp } from '../../context/AppContext';

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/privado']}>
      <Routes>
        <Route
          path="/privado"
          element={
            <RequireAuth>
              <div>Contenido secreto</div>
            </RequireAuth>
          }
        />
        <Route path="/login" element={<div>Pantalla de login</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('RequireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza los children cuando el usuario está logueado', () => {
    // Mockear que el user SÍ está logueado
    vi.mocked(useApp).mockReturnValue({ isLoggedIn: true } as any);

    renderWithRouter();

    // Debe verse el contenido protegido
    expect(screen.getByText('Contenido secreto')).toBeInTheDocument();
    // Y NO debe verse la pantalla de login
    expect(screen.queryByText('Pantalla de login')).not.toBeInTheDocument();
  });

  it('redirige a /login cuando el usuario NO está logueado', () => {
    vi.mocked(useApp).mockReturnValue({ isLoggedIn: false } as any);

    renderWithRouter();

    // El Navigate hace que cambie la ruta a /login, así que el children
    // del RequireAuth NO se renderiza, y en su lugar vemos la página de login.
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido secreto')).not.toBeInTheDocument();
  });
});