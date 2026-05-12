/**
 * Tests para AuthService
 *
 * Estrategia:
 *  - Mockeamos ../api (la instancia axios) con vi.mock antes de importar el servicio
 *  - Verificamos que cada método llame al endpoint correcto con los datos correctos
 *  - Verificamos que el procesamiento de la respuesta sea el esperado (token, JWT decode, etc.)
 *
 * NO testeamos llamadas reales al backend — eso lo hace QA / integración.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';


vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('./jwt', () => ({
  decodeJwtPayload: vi.fn((token: string) => ({
    sub: 'user-uuid-mock',
    email: 'test@test.com',
    role: ['USER'],
    decoded_from: token, 
  })),
}));

import { AuthService } from './auth.service';
import api from '../api';
import { decodeJwtPayload } from './jwt';

const apiMock = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe('AuthService', () => {
  beforeEach(() => {
    // Reinicia todos los mocks antes de cada test
    vi.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────
  describe('register', () => {
    it('llama a POST /auth/register con el body y header Content-Type JSON', async () => {
      apiMock.post.mockResolvedValueOnce({ data: {} });

      const body = {
        firstName: 'Juana',
        lastName: 'Perez',
        email: 'juana@test.com',
        password: 'Password123!',
        phone: '3001234567',
        age: 25,
        address: 'Calle 1',
      };

      await AuthService.register(body as any);

      expect(apiMock.post).toHaveBeenCalledTimes(1);
      expect(apiMock.post).toHaveBeenCalledWith(
        '/auth/register',
        body,
        { headers: { 'Content-Type': 'application/json' } }
      );
    });

    it('propaga errores del backend', async () => {
      const error = new Error('Email ya existe');
      apiMock.post.mockRejectedValueOnce(error);

      await expect(
        AuthService.register({ email: 'a@a.com' } as any)
      ).rejects.toThrow('Email ya existe');
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('login', () => {
    it('devuelve { token, payload } cuando la respuesta trae token directo', async () => {
      apiMock.post.mockResolvedValueOnce({
        data: { token: 'jwt-token-abc' },
      });

      const result = await AuthService.login({
        email: 'juana@test.com',
        password: 'pwd',
      });

      expect(apiMock.post).toHaveBeenCalledWith(
        '/auth/login',
        { email: 'juana@test.com', password: 'pwd' },
        { headers: { 'Content-Type': 'application/json' } }
      );
      expect(result.token).toBe('jwt-token-abc');
      expect(result.payload.decoded_from).toBe('jwt-token-abc');
      expect(decodeJwtPayload).toHaveBeenCalledWith('jwt-token-abc');
    });

    it('extrae el token aunque venga como accessToken', async () => {
      apiMock.post.mockResolvedValueOnce({
        data: { accessToken: 'jwt-from-accessToken' },
      });
      const result = await AuthService.login({ email: 'x', password: 'x' } as any);
      expect(result.token).toBe('jwt-from-accessToken');
    });

    it('extrae el token aunque venga como access_token (snake_case)', async () => {
      apiMock.post.mockResolvedValueOnce({
        data: { access_token: 'jwt-snake' },
      });
      const result = await AuthService.login({ email: 'x', password: 'x' } as any);
      expect(result.token).toBe('jwt-snake');
    });

    it('extrae el token cuando viene anidado en data.token', async () => {
      apiMock.post.mockResolvedValueOnce({
        data: { data: { token: 'jwt-nested' } },
      });
      const result = await AuthService.login({ email: 'x', password: 'x' } as any);
      expect(result.token).toBe('jwt-nested');
    });

    it('extrae el token cuando la respuesta ES un string', async () => {
      apiMock.post.mockResolvedValueOnce({ data: 'jwt-as-string' });
      const result = await AuthService.login({ email: 'x', password: 'x' } as any);
      expect(result.token).toBe('jwt-as-string');
    });

    it('lanza error cuando la respuesta no contiene token reconocible', async () => {
      apiMock.post.mockResolvedValueOnce({ data: { foo: 'bar' } });
      await expect(
        AuthService.login({ email: 'x', password: 'x' } as any)
      ).rejects.toThrow(/No se encontró token/);
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('logout', () => {
    it('llama a POST /auth/logout sin body', async () => {
      apiMock.post.mockResolvedValueOnce({ data: {} });

      await AuthService.logout();

      expect(apiMock.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('getProfile', () => {
    it('hace GET /auth/profile y devuelve el body', async () => {
      const profile = {
        id: 'user-1',
        firstName: 'Juana',
        lastName: 'Perez',
        email: 'juana@test.com',
        roles: ['USER', 'PROFESSIONAL'],
        professionalId: 'pro-1',
      };
      apiMock.get.mockResolvedValueOnce({ data: profile });

      const result = await AuthService.getProfile();

      expect(apiMock.get).toHaveBeenCalledWith('/auth/profile');
      expect(result).toEqual(profile);
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('updateProfile', () => {
    it('envía FormData con un archivo "request.json" cuando NO hay file', async () => {
      apiMock.put.mockResolvedValueOnce({ data: { firstName: 'Juana' } });

      await AuthService.updateProfile({
        firstName: 'Juana',
        lastName: 'Perez',
      });

      expect(apiMock.put).toHaveBeenCalledTimes(1);
      const [url, body, config] = apiMock.put.mock.calls[0];

      expect(url).toBe('/auth/update-profile');
      expect(body).toBeInstanceOf(FormData);
      expect((config as any).headers.Accept).toBe('application/json');

      const fd = body as FormData;
      expect(fd.has('request')).toBe(true);
      expect(fd.has('file')).toBe(false);

      const requestField = fd.get('request') as File;
      expect(requestField).toBeInstanceOf(File);
      expect(requestField.name).toBe('request.json');
      expect(requestField.type).toBe('application/json');
    });

    it('incluye el archivo cuando se pasa un file', async () => {
      apiMock.put.mockResolvedValueOnce({ data: {} });

      const photo = new File(['fake-bytes'], 'photo.png', { type: 'image/png' });
      await AuthService.updateProfile({ firstName: 'Juana' }, photo);

      const [, body] = apiMock.put.mock.calls[0];
      const fd = body as FormData;

      expect(fd.has('file')).toBe(true);
      const fileField = fd.get('file') as File;
      expect(fileField.name).toBe('photo.png');
      expect(fileField.type).toBe('image/png');
    });

    it('omite campos null, undefined y string vacío del JSON enviado', async () => {
      apiMock.put.mockResolvedValueOnce({ data: {} });

      await AuthService.updateProfile({
        firstName: 'Juana',
        lastName: '',           
        phone: undefined,       
        address: null as any,   
        age: 25,
      });

      const [, body] = apiMock.put.mock.calls[0];
      const fd = body as FormData;
      const requestField = fd.get('request') as File;
      const requestText = await requestField.text();
      const parsed = JSON.parse(requestText);

      expect(parsed).toEqual({ firstName: 'Juana', age: 25 });
      expect(parsed).not.toHaveProperty('lastName');
      expect(parsed).not.toHaveProperty('phone');
      expect(parsed).not.toHaveProperty('address');
    });
  });
});