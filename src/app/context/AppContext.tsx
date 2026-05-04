import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { IMGS } from "../data/mockData";
import { AuthService } from "../../services/auth/auth.service";
import { ProfessionalsService } from "../../services/professionals/professionals.service";
import type { RegisterRequest, UpdateProfileRequest, UserProfileResponse } from "../../services/auth/auth.types";
import { clearToken, getToken, setToken } from "../../services/auth/storage";
import { decodeJwtPayload, isJwtExpired, mapRolesToAppRole } from "../../services/auth/jwt";

export type DemoRole = "visitor" | "usuario" | "profesional" | "admin";

export interface AuthUser {
  id?: string;
  professionalId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  phone?: string;
  address?: string;
  age?: number;
  photoUrl?: string;
}

interface AppContextType {
  role: DemoRole;
  setRole: (role: DemoRole) => void;
  userName: string;
  userPhoto: string;
  isLoggedIn: boolean;

  token: string | null;
  user: AuthUser | null;
  authLoading: boolean;
  authError: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest, file?: File | null) => Promise<void>;
  /**
   * Convierte la cuenta actual en perfil profesional.
   * Requiere `professionId` y coordenadas geográficas (lat/lng).
   */
  becomeProfessional: (professionId: string, lat: number, lng: number) => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  role: "visitor",
  setRole: () => {},
  userName: "",
  userPhoto: "",
  isLoggedIn: false,

  token: null,
  user: null,
  authLoading: false,
  authError: null,

  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  becomeProfessional: async () => {},
});

const ROLE_DATA: Record<DemoRole, { userName: string; userPhoto: string }> = {
  visitor: { userName: "", userPhoto: "" },
  usuario: { userName: "Felipe Arango", userPhoto: IMGS.man2 },
  profesional: { userName: "Carlos Ramírez", userPhoto: IMGS.man1 },
  admin: { userName: "Administrador", userPhoto: "" },
};

const USER_PHOTO_KEY = "byme:userPhotoUrl";

function extractApiErrorMessage(err: any, fallback: string): string {
  const data = err?.response?.data;
  if (!data) return err?.message || fallback;
  if (typeof data === "string") return data;

  if (data.fieldErrors && typeof data.fieldErrors === "object") {
    const msgs = Object.entries(data.fieldErrors)
      .map(([field, msg]) => `${msg}`)
      .join("\n");
    if (msgs) return msgs;
  }

  if (typeof data?.message === "string") return data.message;
  if (typeof data?.error === "string") return data.error;
  return fallback;
}

function withCacheBuster(url: string) {
  const t = Date.now();
  return url.includes("?") ? `${url}&t=${t}` : `${url}?t=${t}`;
}

function extractPhotoUrl(profile: any): string | null {
  if (!profile || typeof profile !== "object") return null;

  const direct = [
    profile.profilePictureUrl,
    profile.photoUrl,
    profile.profilePhotoUrl,
    profile.avatarUrl,
    profile.imageUrl,
    profile.profileImageUrl,
    profile.photo,
    profile.image,
    profile.url,
  ].filter((v) => typeof v === "string" && v.length > 0) as string[];

  if (direct.length) return direct[0];

  for (const [k, v] of Object.entries(profile)) {
    if (typeof v === "string" && v.length > 0) {
      const key = k.toLowerCase();
      if (
        (key.includes("photo") || key.includes("image") || key.includes("avatar")) &&
        (key.includes("url") || v.startsWith("http"))
      ) {
        return v;
      }
    }
  }

  return null;
}

function mapUserFromProfile(profile: UserProfileResponse | any, fallback?: AuthUser | null): AuthUser {
  return {
    ...fallback,
    id: profile.id ?? fallback?.id,
    professionalId: profile.professionalId ?? fallback?.professionalId,
    email: profile.email ?? fallback?.email,
    firstName: profile.firstName ?? fallback?.firstName,
    lastName: profile.lastName ?? fallback?.lastName,
    roles: (profile.roles as any) ?? fallback?.roles,
    phone: profile.phone ?? fallback?.phone,
    address: profile.address ?? fallback?.address,
    age: typeof profile.age === "number" ? profile.age : fallback?.age,
    photoUrl: extractPhotoUrl(profile) ?? fallback?.photoUrl,
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const tokenOnLoad = getToken();
  const payloadOnLoad = tokenOnLoad ? decodeJwtPayload(tokenOnLoad) : null;
  const tokenValidOnLoad = tokenOnLoad && !isJwtExpired(payloadOnLoad);

  if (tokenOnLoad && !tokenValidOnLoad) clearToken();

  const initialRole: DemoRole = tokenValidOnLoad ? mapRolesToAppRole(payloadOnLoad?.roles) : "visitor";

  const [role, setRole] = useState<DemoRole>(initialRole);
  const [token, setTokenState] = useState<string | null>(tokenValidOnLoad ? tokenOnLoad! : null);

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (!tokenValidOnLoad) return null;
    return {
      id: payloadOnLoad?.id,
      email: payloadOnLoad?.sub,
      firstName: payloadOnLoad?.firstName,
      lastName: payloadOnLoad?.lastName,
      roles: payloadOnLoad?.roles,
    };
  });

  const [userPhotoOverride, setUserPhotoOverride] = useState<string>(() => {
    return localStorage.getItem(USER_PHOTO_KEY) || "";
  });

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const computedUserName = useMemo(() => {
    const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
    return name || user?.email || "";
  }, [user?.firstName, user?.lastName, user?.email]);

  const computedPhoto = useMemo(() => {
    return userPhotoOverride || user?.photoUrl || ROLE_DATA[role].userPhoto || "";
  }, [userPhotoOverride, user?.photoUrl, role]);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      if (!token) return;
      try {
        const profile = await AuthService.getProfile();
        if (!mounted) return;

        setUser((prev) => mapUserFromProfile(profile, prev));

        if (profile.roles && Array.isArray(profile.roles)) {
          setRole(mapRolesToAppRole(profile.roles));
        }

        const photo = extractPhotoUrl(profile);
        if (photo) {
          const busted = withCacheBuster(photo);
          localStorage.setItem(USER_PHOTO_KEY, busted);
          setUserPhotoOverride(busted);
        }
      } catch {
      }
    };

    hydrate();
    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const session = await AuthService.login({ email, password });

      setToken(session.token);
      setTokenState(session.token);

      const payload = session.payload;
      setRole(mapRolesToAppRole(payload?.roles));

      setUser({
        id: payload?.id,
        email: payload?.sub || email,
        firstName: payload?.firstName,
        lastName: payload?.lastName,
        roles: payload?.roles,
      });

    } catch (err: any) {
      setAuthError(extractApiErrorMessage(err, "No se pudo iniciar sesión."));
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      await AuthService.register(data);
      await login(data.email, data.password);
    } catch (err: any) {
      setAuthError(extractApiErrorMessage(err, "No se pudo completar el registro."));
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      await AuthService.logout().catch(() => {});
    } finally {
      clearToken();
      setTokenState(null);
      setUser(null);
      setRole("visitor");

      localStorage.removeItem(USER_PHOTO_KEY);
      setUserPhotoOverride("");

      setAuthLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileRequest, file?: File | null) => {
    setAuthLoading(true);
    setAuthError(null);

    let previewUrl: string | null = null;
    if (file) {
      previewUrl = URL.createObjectURL(file);
      setUserPhotoOverride(previewUrl);
    }

    try {
      const updated = await AuthService.updateProfile(data, file);
      setUser((prev) => mapUserFromProfile(updated, prev));

      const fresh = await AuthService.getProfile();
      setUser((prev) => mapUserFromProfile(fresh, prev));

      const photo = extractPhotoUrl(fresh);
      if (photo) {
        setUserPhotoOverride(withCacheBuster(photo));
      }
    } catch (err: any) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setAuthError(extractApiErrorMessage(err, "No se pudo actualizar el perfil."));
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const becomeProfessional = async (professionId: string, lat: number, lng: number) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await ProfessionalsService.createProfessionalProfile({
        professionId,
        lat,
        lng,
      });

      // El endpoint devuelve un nuevo token con rol PROFESSIONAL
      const newToken = res.token;
      if (newToken) {
        setToken(newToken);
        setTokenState(newToken);

        const payload = decodeJwtPayload(newToken);
        setRole(mapRolesToAppRole(payload?.roles));

        setUser((prev) => ({
          ...prev,
          id: payload?.id ?? prev?.id,
          email: payload?.sub ?? prev?.email,
          firstName: payload?.firstName ?? prev?.firstName,
          lastName: payload?.lastName ?? prev?.lastName,
          roles: payload?.roles ?? prev?.roles,
        }));

        // Refrescar el profile completo para obtener el nuevo professionalId
        try {
          const fresh = await AuthService.getProfile();
          setUser((prev) => mapUserFromProfile(fresh, prev));
        } catch {
          // si falla, no es crítico — el siguiente hydrate lo capturará
        }
      }
    } catch (err: any) {
      setAuthError(extractApiErrorMessage(err, "No se pudo crear el perfil profesional."));
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        userName: computedUserName || ROLE_DATA[role].userName,
        userPhoto: computedPhoto,
        isLoggedIn: !!token && role !== "visitor",

        token,
        user,
        authLoading,
        authError,

        login,
        register,
        logout,
        updateProfile,
        becomeProfessional,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useApp = () => useContext(AppContext);