export type UUID = string;

export type UserResponse = {
  token?: string | null;
  message: string;
};

/** UserProfileResponse (Obtener y Actualizar Perfil) */
export type UserProfileResponse = {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  age?: number;
  profilePictureUrl?: string; 
  roles: string[];
};

/** 1.1 Crear Perfil Profesional */
export type CreateProfessionalProfileRequest = {
  professionId: UUID;
};

/** 2.1 Profesiones (Nombres) */
export type ProfessionName = {
  id: UUID;
  name: string;
};

/** 2.2 Profesiones (Detalles) */
export type ProfessionDetail = {
  id: UUID;
  name: string;
  description: string;
};

/** 2.3 Categorías (Nombres) */
export type CategoryName = {
  name: string;
};

/** 2.4 Categorías (Detalles) */
export type CategoryDetail = {
  name: string;
  description: string;
};

/** ServiceDetailDTO (Al crear, actualizar u obtener) */
export type ServiceDetailDTO = {
  id: UUID;
  name: string;
  description: string;
  estimatedDurationHours: number;
  basePrice: number;
  professionalId: UUID;
};

/** 3.2 Crear servicio */
export type CreateServiceRequest = {
  name: string;
  description: string;
  estimatedDurationHours: number;
  basePrice: number;
};

/** 3.3 Actualizar servicio*/
export type UpdateServiceRequest = CreateServiceRequest;