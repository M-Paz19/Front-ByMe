import { professionalsApi } from "./professionals.api";
import type {
  CategoryDetail,
  CategoryName,
  CreateProfessionalProfileRequest,
  CreateServiceRequest,
  PageResponse,
  ProfessionalDetailPublicDTO,
  ProfessionalPublicDTO,
  ProfessionDetail,
  ProfessionName,
  ServiceDetailDTO,
  UpdateServiceRequest,
  UserResponse,
  UUID,
} from "./professionals.types";

export class ProfessionalsService {
  static async createProfessionalProfile(body: CreateProfessionalProfileRequest): Promise<UserResponse> {
    const res = await professionalsApi.post("/professionals", body, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data as UserResponse;
  }

  static async getProfessionsNames(): Promise<ProfessionName[]> {
    const res = await professionalsApi.get("/professions/names");
    return res.data as ProfessionName[];
  }

  static async getProfessionsDetails(): Promise<ProfessionDetail[]> {
    const res = await professionalsApi.get("/professions/details");
    return res.data as ProfessionDetail[];
  }

  static async getCategoriesNames(): Promise<CategoryName[]> {
    const res = await professionalsApi.get("/categories/names");
    return res.data as CategoryName[];
  }

  static async getCategoriesDetails(): Promise<CategoryDetail[]> {
    const res = await professionalsApi.get("/categories/details");
    return res.data as CategoryDetail[];
  }

  static async getServicesByProfessionalId(professionalId: UUID): Promise<ServiceDetailDTO[]> {
    const res = await professionalsApi.get(`/services/professional/${professionalId}`);
    return res.data as ServiceDetailDTO[];
  }

  static async createService(body: CreateServiceRequest): Promise<ServiceDetailDTO> {
    const res = await professionalsApi.post("/services", body, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data as ServiceDetailDTO;
  }

  static async updateService(serviceId: UUID, body: UpdateServiceRequest): Promise<ServiceDetailDTO> {
    const res = await professionalsApi.put(`/services/${serviceId}`, body, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data as ServiceDetailDTO;
  }

  static async deleteService(serviceId: UUID): Promise<UserResponse> {
    const res = await professionalsApi.delete(`/services/${serviceId}`);
    return res.data as UserResponse;
  }

  static async getPublicList(page = 0, size = 6): Promise<PageResponse<ProfessionalPublicDTO>> {
  const res = await professionalsApi.get('/professionals', { params: { page, size } });
  return res.data;
  }

  static async getPublicById(id: string): Promise<ProfessionalDetailPublicDTO> {
    const res = await professionalsApi.get(`/professionals/${id}/public`);
    return res.data as ProfessionalDetailPublicDTO;
  }
}