/**
 * Tests para ProfessionalsService
 *
 * Mockeamos ./professionals.api (la instancia axios) y verificamos:
 *  - URL correcta de cada endpoint
 *  - Parámetros enviados (path, query, body)
 *  - Que se devuelve el .data del response sin tocar
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mockeamos la instancia axios ANTES de importar el servicio
vi.mock('./professionals.api', () => ({
  professionalsApi: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { ProfessionalsService } from './professionals.service';
import { professionalsApi } from './professionals.api';

const apiMock = professionalsApi as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe('ProfessionalsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────
  describe('createProfessionalProfile', () => {
    it('llama a POST /professionals con body y header JSON', async () => {
      const responseData = { id: 'user-1', roles: ['PROFESSIONAL'] };
      apiMock.post.mockResolvedValueOnce({ data: responseData });

      const body = {
        professionId: 'prof-uuid',
        lat: 2.4448,
        lng: -76.6147,
      };
      const result = await ProfessionalsService.createProfessionalProfile(body);

      expect(apiMock.post).toHaveBeenCalledTimes(1);
      expect(apiMock.post).toHaveBeenCalledWith(
        '/professionals',
        body,
        { headers: { 'Content-Type': 'application/json' } }
      );
      expect(result).toEqual(responseData);
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('getProfessionsNames', () => {
    it('llama a GET /professions/names y devuelve la lista', async () => {
      const list = [
        { id: 'p1', name: 'Plomero' },
        { id: 'p2', name: 'Electricista' },
      ];
      apiMock.get.mockResolvedValueOnce({ data: list });

      const result = await ProfessionalsService.getProfessionsNames();

      expect(apiMock.get).toHaveBeenCalledWith('/professions/names');
      expect(result).toEqual(list);
    });
  });

  describe('getProfessionsDetails', () => {
    it('llama a GET /professions/details', async () => {
      apiMock.get.mockResolvedValueOnce({ data: [] });
      await ProfessionalsService.getProfessionsDetails();
      expect(apiMock.get).toHaveBeenCalledWith('/professions/details');
    });
  });

  describe('getCategoriesNames', () => {
    it('llama a GET /categories/names', async () => {
      apiMock.get.mockResolvedValueOnce({ data: [] });
      await ProfessionalsService.getCategoriesNames();
      expect(apiMock.get).toHaveBeenCalledWith('/categories/names');
    });
  });

  describe('getCategoriesDetails', () => {
    it('llama a GET /categories/details', async () => {
      apiMock.get.mockResolvedValueOnce({ data: [] });
      await ProfessionalsService.getCategoriesDetails();
      expect(apiMock.get).toHaveBeenCalledWith('/categories/details');
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('getServicesByProfessionalId', () => {
    it('inserta el ID en la URL', async () => {
      apiMock.get.mockResolvedValueOnce({ data: [] });
      const id = '6d1f7ca9-f682-419d-8c54-5fb845f8ab61';

      await ProfessionalsService.getServicesByProfessionalId(id);

      expect(apiMock.get).toHaveBeenCalledWith(`/services/professional/${id}`);
    });

    it('devuelve el array de servicios sin modificar', async () => {
      const services = [
        { id: 's1', name: 'Reparación tuberías', basePrice: 50000 },
        { id: 's2', name: 'Instalación de griferías', basePrice: 30000 },
      ];
      apiMock.get.mockResolvedValueOnce({ data: services });

      const result = await ProfessionalsService.getServicesByProfessionalId('any-id');

      expect(result).toEqual(services);
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('createService', () => {
    it('llama a POST /services con body y header JSON', async () => {
      const created = { id: 'new-service', name: 'X' };
      apiMock.post.mockResolvedValueOnce({ data: created });

      const body = {
        name: 'Reparación de techos',
        description: 'Reparación completa de techos',
        estimatedDurationHours: 4,
        basePrice: 80000,
      };
      const result = await ProfessionalsService.createService(body);

      expect(apiMock.post).toHaveBeenCalledWith(
        '/services',
        body,
        { headers: { 'Content-Type': 'application/json' } }
      );
      expect(result).toEqual(created);
    });
  });

  describe('updateService', () => {
    it('llama a PUT /services/{id} con el body', async () => {
      apiMock.put.mockResolvedValueOnce({ data: { id: 's1' } });

      const body = {
        name: 'Nuevo nombre',
        description: 'Nueva descripción',
        estimatedDurationHours: 2,
        basePrice: 25000,
      };
      await ProfessionalsService.updateService('s1', body);

      expect(apiMock.put).toHaveBeenCalledWith(
        '/services/s1',
        body,
        { headers: { 'Content-Type': 'application/json' } }
      );
    });
  });

  describe('deleteService', () => {
    it('llama a DELETE /services/{id}', async () => {
      apiMock.delete.mockResolvedValueOnce({ data: { ok: true } });

      await ProfessionalsService.deleteService('service-uuid');

      expect(apiMock.delete).toHaveBeenCalledWith('/services/service-uuid');
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('getPublicList', () => {
    it('usa page=0 y size=6 por defecto', async () => {
      apiMock.get.mockResolvedValueOnce({
        data: { content: [], totalElements: 0, page: 0, size: 6 },
      });

      await ProfessionalsService.getPublicList();

      expect(apiMock.get).toHaveBeenCalledWith('/professionals', {
        params: { page: 0, size: 6 },
      });
    });

    it('respeta los parámetros pasados', async () => {
      apiMock.get.mockResolvedValueOnce({ data: { content: [] } });

      await ProfessionalsService.getPublicList(2, 12);

      expect(apiMock.get).toHaveBeenCalledWith('/professionals', {
        params: { page: 2, size: 12 },
      });
    });

    it('devuelve el objeto paginado completo', async () => {
      const pageData = {
        content: [{ id: 'p1' }, { id: 'p2' }],
        totalElements: 2,
        page: 0,
        size: 6,
      };
      apiMock.get.mockResolvedValueOnce({ data: pageData });

      const result = await ProfessionalsService.getPublicList();

      expect(result).toEqual(pageData);
    });
  });

  // ──────────────────────────────────────────────────────────
  describe('getPublicById', () => {
    it('llama a GET /professionals/{id}/public', async () => {
      const detail = {
        id: 'pro-uuid',
        firstName: 'Juana',
        lastName: 'Perez',
        professionName: 'Plomera',
        categoryName: 'Hogar',
        rating: 4.5,
        lat: -76.6,
        lng: 2.44,
      };
      apiMock.get.mockResolvedValueOnce({ data: detail });

      const result = await ProfessionalsService.getPublicById('pro-uuid');

      expect(apiMock.get).toHaveBeenCalledWith('/professionals/pro-uuid/public');
      expect(result).toEqual(detail);
    });

    it('propaga errores del backend (404 si el ID no existe)', async () => {
      const error = Object.assign(new Error('Not Found'), {
        response: { status: 404 },
      });
      apiMock.get.mockRejectedValueOnce(error);

      await expect(
        ProfessionalsService.getPublicById('bad-id')
      ).rejects.toThrow('Not Found');
    });
  });
});