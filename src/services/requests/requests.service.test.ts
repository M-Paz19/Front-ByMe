/**
 * Tests para ServiceRequestsService
 *
 * Verifica que cada método llame a la URL correcta del backend con los
 * parámetros y headers esperados. NO toca la red — todo es mockeado.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';


vi.mock('../professionals/professionals.api', () => ({
  professionalsApi: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { ServiceRequestsService } from './requests.service';
import { professionalsApi } from '../professionals/professionals.api';

const apiMock = professionalsApi as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

// Datos de ejemplo reutilizables
const SAMPLE_REQUEST = {
  id: 'req-1',
  userId: 'user-1',
  professionalId: 'pro-1',
  serviceId: 'service-1',
  serviceName: 'Reparación de tuberías',
  servicePrice: 50000,
  status: 'PENDIENTE',
  workday: 'MAÑANA',
  scheduledDate: '2026-05-20',
  latitude: 2.4448,
  longitude: -76.6147,
};

describe('ServiceRequestsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────
  describe('create', () => {
    it('llama a POST /service-requests con body y header JSON', async () => {
      apiMock.post.mockResolvedValueOnce({ data: SAMPLE_REQUEST });

      const payload = {
        professionalId: 'pro-1',
        serviceId: 'service-1',
        workday: 'MAÑANA' as const,
        scheduledDate: '2026-05-20',
        latitude: 2.4448,
        longitude: -76.6147,
      };

      const result = await ServiceRequestsService.create(payload as any);

      expect(apiMock.post).toHaveBeenCalledTimes(1);
      expect(apiMock.post).toHaveBeenCalledWith(
        '/service-requests',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      expect(result).toEqual(SAMPLE_REQUEST);
    });

    it('propaga errores del backend', async () => {
      const error = Object.assign(new Error('Bad Request'), {
        response: { status: 400, data: { message: 'Fecha inválida' } },
      });
      apiMock.post.mockRejectedValueOnce(error);

      await expect(
        ServiceRequestsService.create({} as any)
      ).rejects.toThrow('Bad Request');
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('accept', () => {
    it('llama a POST /service-requests/{id}/accept con startTime y endTime', async () => {
      const accepted = { ...SAMPLE_REQUEST, status: 'ACEPTADA' };
      apiMock.post.mockResolvedValueOnce({ data: accepted });

      const payload = {
        proposedStartTime: '08:00:00',
        proposedEndTime: '10:00:00',
      };

      const result = await ServiceRequestsService.accept('req-1', payload);

      expect(apiMock.post).toHaveBeenCalledWith(
        '/service-requests/req-1/accept',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      expect(result.status).toBe('ACEPTADA');
    });

    it('inserta el ID correctamente en la URL aunque sea un UUID largo', async () => {
      apiMock.post.mockResolvedValueOnce({ data: SAMPLE_REQUEST });

      const id = 'feccae0b-8ad3-456d-b684-43fb4b8aba1a';
      await ServiceRequestsService.accept(id, {
        proposedStartTime: '09:00:00',
        proposedEndTime: '11:00:00',
      });

      const [url] = apiMock.post.mock.calls[0];
      expect(url).toBe(`/service-requests/${id}/accept`);
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('reject', () => {
    it('llama a POST /service-requests/{id}/reject SIN body', async () => {
      const rejected = { ...SAMPLE_REQUEST, status: 'RECHAZADA' };
      apiMock.post.mockResolvedValueOnce({ data: rejected });

      const result = await ServiceRequestsService.reject('req-1');

      expect(apiMock.post).toHaveBeenCalledTimes(1);
      expect(apiMock.post).toHaveBeenCalledWith('/service-requests/req-1/reject');

      const callArgs = apiMock.post.mock.calls[0];
      expect(callArgs).toHaveLength(1);

      expect(result.status).toBe('RECHAZADA');
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('confirm', () => {
    it('llama a POST /service-requests/{id}/confirm SIN body', async () => {
      const confirmed = { ...SAMPLE_REQUEST, status: 'CONFIRMADA' };
      apiMock.post.mockResolvedValueOnce({ data: confirmed });

      const result = await ServiceRequestsService.confirm('req-1');

      expect(apiMock.post).toHaveBeenCalledWith('/service-requests/req-1/confirm');
      expect(result.status).toBe('CONFIRMADA');
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('cancel', () => {
    it('llama a POST /service-requests/{id}/cancel SIN body', async () => {
      const cancelled = { ...SAMPLE_REQUEST, status: 'CANCELADA' };
      apiMock.post.mockResolvedValueOnce({ data: cancelled });

      const result = await ServiceRequestsService.cancel('req-1');

      expect(apiMock.post).toHaveBeenCalledWith('/service-requests/req-1/cancel');
      expect(result.status).toBe('CANCELADA');
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('getByUser', () => {
    it('llama a GET /service-requests/user/{userId} sin status', async () => {
      apiMock.get.mockResolvedValueOnce({ data: [SAMPLE_REQUEST] });

      const result = await ServiceRequestsService.getByUser('user-1');

      expect(apiMock.get).toHaveBeenCalledWith(
        '/service-requests/user/user-1',
        { params: undefined }
      );
      expect(result).toEqual([SAMPLE_REQUEST]);
    });

    it('pasa el filtro de status como query param cuando se provee', async () => {
      apiMock.get.mockResolvedValueOnce({ data: [] });

      await ServiceRequestsService.getByUser('user-1', 'PENDIENTE');

      expect(apiMock.get).toHaveBeenCalledWith(
        '/service-requests/user/user-1',
        { params: { status: 'PENDIENTE' } }
      );
    });

    it('devuelve un array vacío cuando no hay solicitudes', async () => {
      apiMock.get.mockResolvedValueOnce({ data: [] });
      const result = await ServiceRequestsService.getByUser('user-1');
      expect(result).toEqual([]);
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('getByProfessional', () => {
    it('llama a GET /service-requests/professional/{id} sin status', async () => {
      apiMock.get.mockResolvedValueOnce({ data: [SAMPLE_REQUEST] });

      await ServiceRequestsService.getByProfessional('pro-1');

      expect(apiMock.get).toHaveBeenCalledWith(
        '/service-requests/professional/pro-1',
        { params: undefined }
      );
    });

    it('pasa status como query param cuando se provee', async () => {
      apiMock.get.mockResolvedValueOnce({ data: [] });

      await ServiceRequestsService.getByProfessional('pro-1', 'EN_PROCESO');

      expect(apiMock.get).toHaveBeenCalledWith(
        '/service-requests/professional/pro-1',
        { params: { status: 'EN_PROCESO' } }
      );
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('integración de estados', () => {
    const ALL_STATUSES = [
      'PENDIENTE',
      'ACEPTADA',
      'RECHAZADA',
      'EN_PROCESO',
      'COMPLETADA',
      'CANCELADA',
      'CONFIRMADA',
      'EN_CAMINO',
    ] as const;

    it.each(ALL_STATUSES)(
      'getByUser acepta filtrar por status="%s"',
      async (status) => {
        apiMock.get.mockResolvedValueOnce({ data: [] });
        await ServiceRequestsService.getByUser('any-user', status);
        const callConfig = apiMock.get.mock.calls[0][1];
        expect(callConfig.params.status).toBe(status);
      }
    );
  });
});