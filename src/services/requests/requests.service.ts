import { professionalsApi } from "../professionals/professionals.api";
import type {
  ServiceRequestDTO,
  CreateServiceRequestPayload,
  AcceptServiceRequestPayload,
  RequestStatus,
} from "./requests.types";

const BASE = "/service-requests";

export class ServiceRequestsService {
  /** POST /service-requests — crear nueva solicitud (USER) */
  static async create(payload: CreateServiceRequestPayload): Promise<ServiceRequestDTO> {
    const res = await professionalsApi.post(BASE, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data as ServiceRequestDTO;
  }

  /** POST /service-requests/{id}/accept — aceptar (PROFESSIONAL/ADMIN) */
  static async accept(id: string, payload: AcceptServiceRequestPayload): Promise<ServiceRequestDTO> {
    const res = await professionalsApi.post(`${BASE}/${id}/accept`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data as ServiceRequestDTO;
  }

  /** POST /service-requests/{id}/reject — rechazar (PROFESSIONAL/ADMIN) */
  static async reject(id: string): Promise<ServiceRequestDTO> {
    const res = await professionalsApi.post(`${BASE}/${id}/reject`);
    return res.data as ServiceRequestDTO;
  }

  /** POST /service-requests/{id}/confirm — confirmar (USER/ADMIN) */
  static async confirm(id: string): Promise<ServiceRequestDTO> {
    const res = await professionalsApi.post(`${BASE}/${id}/confirm`);
    return res.data as ServiceRequestDTO;
  }

  /** POST /service-requests/{id}/cancel — cancelar (USER/PROFESSIONAL/ADMIN) */
  static async cancel(id: string): Promise<ServiceRequestDTO> {
    const res = await professionalsApi.post(`${BASE}/${id}/cancel`);
    return res.data as ServiceRequestDTO;
  }

  /** GET /service-requests/user/{userId} — lista por usuario */
  static async getByUser(userId: string, status?: RequestStatus): Promise<ServiceRequestDTO[]> {
    const res = await professionalsApi.get(`${BASE}/user/${userId}`, {
      params: status ? { status } : undefined,
    });
    return res.data as ServiceRequestDTO[];
  }

  /** GET /service-requests/professional/{professionalId} — lista por profesional */
  static async getByProfessional(professionalId: string, status?: RequestStatus): Promise<ServiceRequestDTO[]> {
    const res = await professionalsApi.get(`${BASE}/professional/${professionalId}`, {
      params: status ? { status } : undefined,
    });
    return res.data as ServiceRequestDTO[];
  }
}