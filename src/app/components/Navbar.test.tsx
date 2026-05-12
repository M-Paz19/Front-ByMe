import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

vi.mock('../context/AppContext', () => ({
  useApp: vi.fn(),
}));

import { Navbar } from './Navbar';
import { useApp } from '../context/AppContext';

function mockUseApp(overrides: Partial<ReturnType<typeof useApp>> = {}) {
  vi.mocked(useApp).mockReturnValue({
    role: 'visitor',
    userName: '',
    userPhoto: '',
    isLoggedIn: false,
    logout: vi.fn(),
    ...overrides,
  } as any);
}

// Helper render con router
function renderNavbar() {
  return render(
    <MemoryRouter initialEntries={['/buscar']}>
      <Navbar />
    </MemoryRouter>
  );
}

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────
  describe('cuando hay sesión como ADMIN', () => {
  beforeEach(() => {
    mockUseApp({
      isLoggedIn: true,
      role: 'admin',
      userName: 'Carlos Admin',           
      userPhoto: 'https://example.com/photo.jpg',
      logout: vi.fn(),
    });
  });

  it('muestra el link a Admin', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument();
  });

  it('el link "Admin" apunta a /panel/admin', () => {
    renderNavbar();
    const link = screen.getByRole('link', { name: /admin/i });
    expect(link).toHaveAttribute('href', '/panel/admin');
  });
});

  // ──────────────────────────────────────────────────────────
  describe('cuando hay sesión como USUARIO', () => {
    beforeEach(() => {
      mockUseApp({
        isLoggedIn: true,
        role: 'usuario',
        userName: 'Juana Perez',
        userPhoto: 'https://example.com/photo.jpg',
        logout: vi.fn(),
      });
    });

    it('muestra el primer nombre del usuario', () => {
      renderNavbar();
      const matches = screen.getAllByText('Juana');
      expect(matches.length).toBeGreaterThan(0);
    });

    it('NO muestra "Mi Panel Pro" (solo para profesionales)', () => {
      renderNavbar();
      expect(screen.queryByText(/Mi Panel Pro/i)).not.toBeInTheDocument();
    });

    it('NO muestra el link de Admin', () => {
      renderNavbar();
      expect(screen.queryByText(/^Admin$/)).not.toBeInTheDocument();
    });

    it('NO muestra los links de "Iniciar sesión" ni "Registrarse"', () => {
      renderNavbar();
      expect(screen.queryByRole('link', { name: /iniciar sesi[oó]n/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /registrarse/i })).not.toBeInTheDocument();
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('cuando hay sesión como PROFESIONAL', () => {
    beforeEach(() => {
      mockUseApp({
        isLoggedIn: true,
        role: 'profesional',
        userName: 'Felipe Paz',
        userPhoto: 'https://example.com/photo.jpg',
        logout: vi.fn(),
      });
    });

    it('muestra el link a "Mi Panel Pro"', () => {
      renderNavbar();
      expect(screen.getByText(/Mi Panel Pro/i)).toBeInTheDocument();
    });

    it('el link "Mi Panel Pro" apunta a /panel/profesional', () => {
      renderNavbar();
      const link = screen.getByText(/Mi Panel Pro/i).closest('a');
      expect(link).toHaveAttribute('href', '/panel/profesional');
    });
  });

  // ──────────────────────────────────────────────────────────
 describe('cuando hay sesión como ADMIN', () => {
  beforeEach(() => {
    mockUseApp({
      isLoggedIn: true,
      role: 'admin',
      userName: 'Carlos Admin',
      userPhoto: 'https://example.com/photo.jpg',
      logout: vi.fn(),
    });
  });

  it('muestra el link a Admin', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument();
  });

  it('el link "Admin" apunta a /panel/admin', () => {
    renderNavbar();
    const link = screen.getByRole('link', { name: /admin/i });
    expect(link).toHaveAttribute('href', '/panel/admin');
  });
});

  // ──────────────────────────────────────────────────────────
  describe('dropdown de perfil', () => {
    let logoutMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      logoutMock = vi.fn();
      mockUseApp({
        isLoggedIn: true,
        role: 'usuario',
        userName: 'Juana Perez',
        userPhoto: 'https://example.com/photo.jpg',
        logout: logoutMock,
      });
    });

    it('al hacer click en el botón del perfil, abre el dropdown', async () => {
      renderNavbar();
      const user = userEvent.setup();

      expect(screen.queryByText('Mi perfil')).not.toBeInTheDocument();

      const profileButton = screen.getByText('Juana').closest('button')!;
      await user.click(profileButton);

      expect(screen.getByText('Mi perfil')).toBeInTheDocument();
      expect(screen.getByText('Mi Panel')).toBeInTheDocument();
    });

    it('al hacer click en "Cerrar sesión" llama a logout()', async () => {
      renderNavbar();
      const user = userEvent.setup();

      // Primero abrir el dropdown
      const profileButton = screen.getByText('Juana').closest('button')!;
      await user.click(profileButton);

      // Luego click en "Cerrar sesión"
      const logoutBtn = screen.getByRole('button', { name: /cerrar sesi[oó]n/i });
      await user.click(logoutBtn);

      expect(logoutMock).toHaveBeenCalledTimes(1);
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('logo y links públicos', () => {
    it('el logo apunta a /', () => {
      mockUseApp({ isLoggedIn: false });
      renderNavbar();
      const links = screen.getAllByRole('link');
      const homeLink = links.find((l) => l.getAttribute('href') === '/');
      expect(homeLink).toBeDefined();
    });

    it('"Buscar Servicios" apunta a /buscar', () => {
      mockUseApp({ isLoggedIn: false });
      renderNavbar();
      const link = screen.getAllByText(/Buscar Servicios/i)[0].closest('a');
      expect(link).toHaveAttribute('href', '/buscar');
    });
  });
});