export type RegisterRequest = {
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  age?: number;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  age?: number;
};

export type UserProfileResponse = {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  age?: number;
  roles?: string[];

  // posibles nombres para foto
  photoUrl?: string;
  profilePhotoUrl?: string;
  avatarUrl?: string;
  imageUrl?: string;
  photo?: string;
  image?: string;
  url?: string;

  [key: string]: any;
};