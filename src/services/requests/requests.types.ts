export type RequestStatus =
  | 'PENDIENTE'
  | 'ACEPTADA'
  | 'RECHAZADA'
  | 'EN_PROCESO'
  | 'COMPLETADA'
  | 'CANCELADA'
  | 'CONFIRMADA'
  | 'EN_CAMINO';

export type Workday = 'MAÑANA' | 'TARDE';

export interface ServiceRequestDTO {
  id: string;
  userId: string;
  professionalId: string;
  serviceId: string;
  status: RequestStatus;
  workday: Workday;
  scheduledDate?: string | null;     // "YYYY-MM-DD"
  latitude: number;
  longitude: number;
  serviceName?: string | null;
  servicePrice?: number | null;
  proposedStartTime?: string | null; // "HH:MM:SS"
  proposedEndTime?: string | null;
}

export interface CreateServiceRequestPayload {
  professionalId: string;
  serviceId: string;
  scheduledDate?: string;  // "YYYY-MM-DD"
  workday: Workday;
  latitude: number;
  longitude: number;
  serviceName?: string;
  servicePrice?: number;
}

export interface AcceptServiceRequestPayload {
  proposedStartTime: string; // "HH:MM:SS"
  proposedEndTime: string;   // "HH:MM:SS"
}