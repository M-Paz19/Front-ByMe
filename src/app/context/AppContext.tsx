import React, { createContext, useContext, useMemo, useState } from 'react';
import { IMGS } from '../data/mockData';
import { AuthService } from '../../services/auth/auth.service';
import type { RegisterRequest, UpdateProfileRequest } from '../../services/auth/auth.types';
import { clearToken, getToken, setToken } from '../../services/auth/storage';
import { decodeJwtPayload, isJwtExpired, mapRolesToAppRole } from '../../services/auth/jwt';

export type DemoRole = 'visitor' | 'usuario' | 'profesional' | 'admin';

export interface AuthUser {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  photoUrl?: string;
  phone?: string;
  address?: string;
  age?: number;
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
}

const AppContext = createContext<AppContextType>({
  role: 'visitor',
  setRole: () => {},
  userName: '',
  userPhoto: '',
  isLoggedIn: false,

  token: null,
  user: null,
  authLoading: false,
  authError: null,

  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

// Fallback demo (solo si NO hay overrides reales)
const ROLE_DATA: Record<DemoRole, { userName: string; userPhoto: string }> = {
  visitor: { userName: '', userPhoto: '' },
  usuario: { userName: 'Felipe Arango', userPhoto: IMGS.man2 },
  profesional: { userName: 'Carlos Ramírez', userPhoto: IMGS.man1 },
  admin: { userName: 'Administrador', userPhoto: '' },
};

// Persistencia
const USER_KEY = 'byme:user';
const PROFILE_OVERRIDE_KEY = 'byme:profileOverride';
const USER_PHOTO_KEY = 'byme:userPhotoUrl';

// Tipos override
type ProfileOverride = Partial<{
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  age: number;
  photoUrl: string;
}>;

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser | null) {
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function loadProfileOverride(): ProfileOverride {
  return safeJsonParse<ProfileOverride>(localStorage.getItem(PROFILE_OVERRIDE_KEY)) || {};
}

function saveProfileOverride(patch: ProfileOverride) {
  const current = loadProfileOverride();
  const next = { ...current, ...patch };
  localStorage.setItem(PROFILE_OVERRIDE_KEY, JSON.stringify(next));
}

function clearProfileOverride() {
  localStorage.removeItem(PROFILE_OVERRIDE_KEY);
}

function extractApiErrorMessage(err: any, fallback: string): string {
  const data = err?.response?.data;
  if (!data) return err?.message || fallback;

  if (typeof data === 'string') return data;
  if (typeof data?.message === 'string') return data.message;
  if (typeof data?.error === 'string') return data.error;

  if (Array.isArray(data?.errors)) {
    const msgs = data.errors
      .map((e: any) => e?.message || e?.defaultMessage || e?.error || null)
      .filter(Boolean);
    if (msgs.length) return msgs.join('\n');
  }

  if (data?.errors && typeof data.errors === 'object') {
    const msgs = Object.entries(data.errors).map(([k, v]) => `${k}: ${String(v)}`);
    if (msgs.length) return msgs.join('\n');
  }

  if (typeof data?.details === 'string') return data.details;
  return fallback;
}

// Por si algún día backend devuelve URL de foto (ahora no lo hace, devuelve token:null)
function extractPhotoUrlFromResponse(res: any): string | null {
  if (!res || typeof res !== 'object') return null;

  const candidates = [
    res.photoUrl,
    res.profilePhotoUrl,
    res.avatarUrl,
    res.imageUrl,
    res.photo,
    res.image,
    res.url,

    res.data?.photoUrl,
    res.data?.profilePhotoUrl,
    res.data?.avatarUrl,
    res.data?.imageUrl,
    res.data?.photo,
    res.data?.image,
    res.data?.url,

    res.user?.photoUrl,
    res.user?.avatarUrl,
    res.user?.imageUrl,
  ].filter((v) => typeof v === 'string' && v.length > 0) as string[];

  return candidates.length ? candidates[0] : null;
}

function withCacheBuster(url: string) {
  const t = Date.now();
  return url.includes('?') ? `${url}&t=${t}` : `${url}?t=${t}`;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.onload = () => resolve(String(reader.result || ''));
    reader.readAsDataURL(file);
  });
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ======== INIT DESDE TOKEN ========
  const tokenOnLoad = getToken();
  const payloadOnLoad = tokenOnLoad ? decodeJwtPayload(tokenOnLoad) : null;
  const tokenValid = tokenOnLoad && !isJwtExpired(payloadOnLoad);

  if (tokenOnLoad && !tokenValid) {
    clearToken();
  }

  const initialRole: DemoRole = tokenValid ? mapRolesToAppRole(payloadOnLoad?.roles) : 'visitor';

  const [role, setRole] = useState<DemoRole>(initialRole);
  const [token, setTokenState] = useState<string | null>(tokenValid ? tokenOnLoad! : null);

  // ======== INIT USER (JWT + localStorage overrides) ========
  const storedUser = safeJsonParse<AuthUser>(localStorage.getItem(USER_KEY));
  const override = loadProfileOverride();
  const storedPhoto = localStorage.getItem(USER_PHOTO_KEY) || '';

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (!tokenValid) return null;

    const jwtUser: AuthUser = {
      id: payloadOnLoad?.id,
      email: payloadOnLoad?.sub,
      firstName: payloadOnLoad?.firstName,
      lastName: payloadOnLoad?.lastName,
      roles: payloadOnLoad?.roles,
    };

    // 1) Merge storedUser si corresponde a la misma cuenta
    const mergedFromStored =
      storedUser?.email && jwtUser.email && storedUser.email === jwtUser.email
        ? { ...jwtUser, ...storedUser }
        : jwtUser;

    // 2) Apply profileOverride (si existe)
    const hydrated: AuthUser = {
      ...mergedFromStored,
      firstName: override.firstName ?? mergedFromStored.firstName,
      lastName: override.lastName ?? mergedFromStored.lastName,
      phone: override.phone ?? mergedFromStored.phone,
      address: override.address ?? mergedFromStored.address,
      age: typeof override.age === 'number' ? override.age : mergedFromStored.age,
      photoUrl: override.photoUrl ?? mergedFromStored.photoUrl,
    };

    return hydrated;
  });

  // Foto override para reemplazar la “quemada”
  const [userPhotoOverride, setUserPhotoOverride] = useState<string>(storedPhoto);

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const computedUserName = useMemo(() => {
    const name = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
    return name || user?.email || '';
  }, [user?.firstName, user?.lastName, user?.email]);

  const computedPhoto = useMemo(() => {
    return user?.photoUrl || userPhotoOverride || ROLE_DATA[role].userPhoto || '';
  }, [user?.photoUrl, userPhotoOverride, role]);

  // ======== ACTIONS ========
  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const session = await AuthService.login({ email, password });

      // Token
      setToken(session.token);
      setTokenState(session.token);

      // Role desde payload
      const payload = session.payload;
      const nextRole: DemoRole = mapRolesToAppRole(payload?.roles);
      setRole(nextRole);

      const nextUser: AuthUser = {
        id: payload?.id,
        email: payload?.sub || email,
        firstName: payload?.firstName,
        lastName: payload?.lastName,
        roles: payload?.roles,
      };

      // Aplica override (si ya existía para que sobreviva refresh)
      const o = loadProfileOverride();
      const hydrated: AuthUser = {
        ...nextUser,
        firstName: o.firstName ?? nextUser.firstName,
        lastName: o.lastName ?? nextUser.lastName,
        phone: o.phone,
        address: o.address,
        age: o.age,
        photoUrl: o.photoUrl,
      };

      setUser(hydrated);
      persistUser(hydrated);

      // Restaura foto override si existía
      const savedPhoto = localStorage.getItem(USER_PHOTO_KEY) || '';
      setUserPhotoOverride(savedPhoto);
    } catch (err: any) {
      const msg = extractApiErrorMessage(err, 'No se pudo iniciar sesión.');
      setAuthError(msg);
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
      const msg = extractApiErrorMessage(err, 'No se pudo completar el registro.');
      setAuthError(msg);
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
      setRole('visitor');

      // Limpia persistencia local (para que no quede “pegado”)
      persistUser(null);
      clearProfileOverride();
      localStorage.removeItem(USER_PHOTO_KEY);
      setUserPhotoOverride('');

      setAuthLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileRequest, file?: File | null) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res: any = await AuthService.updateProfile(data, file);

      // Backend NO devuelve perfil ni token (token:null). Por eso:
      // 1) Actualizamos UI con lo enviado
      setUser((prev) => {
        if (!prev) return prev;

        const next: AuthUser = {
          ...prev,
          firstName: data.firstName ?? prev.firstName,
          lastName: data.lastName ?? prev.lastName,
          phone: data.phone ?? prev.phone,
          address: data.address ?? prev.address,
          age: typeof data.age === 'number' ? data.age : prev.age,
        };

        persistUser(next);
        return next;
      });

      // 2) Persistimos override para sobrevivir refresh
      saveProfileOverride({
        ...(data.firstName ? { firstName: data.firstName } : {}),
        ...(data.lastName ? { lastName: data.lastName } : {}),
        ...(data.phone ? { phone: data.phone } : {}),
        ...(data.address ? { address: data.address } : {}),
        ...(typeof data.age === 'number' ? { age: data.age } : {}),
      });

      // 3) Foto
      const backendPhotoUrl = extractPhotoUrlFromResponse(res);

      if (backendPhotoUrl) {
        // Ideal: backend entrega URL persistente
        const url = withCacheBuster(backendPhotoUrl);
        localStorage.setItem(USER_PHOTO_KEY, url);
        setUserPhotoOverride(url);

        // opcional: también guardarla en user + override
        setUser((prev) => {
          if (!prev) return prev;
          const next = { ...prev, photoUrl: backendPhotoUrl };
          persistUser(next);
          return next;
        });
        saveProfileOverride({ photoUrl: backendPhotoUrl });
      } else if (file) {
        // Backend no devuelve URL: mostramos preview inmediato
        const previewUrl = URL.createObjectURL(file);
        setUserPhotoOverride(previewUrl);

        // Persistir foto en refresh solo si es pequeña (localStorage tiene límites)
        // Si es grande, seguirá viéndose en sesión, pero al refrescar dependerá del backend (hoy no hay URL).
        const MAX_PERSIST_BYTES = 250 * 1024; // 250KB aprox
        if (file.size <= MAX_PERSIST_BYTES) {
          try {
            const dataUrl = await fileToDataUrl(file);
            localStorage.setItem(USER_PHOTO_KEY, dataUrl);
          } catch {
            // si falla, no persistimos
          }
        } else {
          // Limpia persistencia vieja para no mostrar una foto anterior tras refresh
          localStorage.removeItem(USER_PHOTO_KEY);
        }
      }
    } catch (err: any) {
      const msg = extractApiErrorMessage(err, 'No se pudo actualizar el perfil.');
      setAuthError(msg);
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
        isLoggedIn: !!token && role !== 'visitor',

        token,
        user,
        authLoading,
        authError,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);