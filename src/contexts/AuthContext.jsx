import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getPerfilRequest,
  loginRequest,
  logoutRequest
} from '../api/authApi';
import {
  setAccessToken,
  clearAccessToken
} from '../utils/authToken';

export const AuthContext = createContext(null);

function mapUser(raw) {
  if (!raw) return null;
  return {
    id_usuario: raw.id_usuario,
    nombre_completo: raw.nombre_completo,
    nombre_usuario: raw.nombre_usuario,
    rol: raw.rol,
    id_empresa: raw.id_empresa == null ? null : Number(raw.id_empresa)
  };
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // sesión ya inválida
    } finally {
      clearAccessToken();
      setUser(null);
      queryClient.clear();
    }
  }, [queryClient]);

  const login = useCallback(async (credentials) => {
    const response = await loginRequest(credentials);
    const nextUser = mapUser(response.data.usuario);
    const token = response.data.accessToken || response.data.token;
    if (token) setAccessToken(token);
    setUser(nextUser);
    return nextUser;
  }, []);

  useEffect(() => {
    let active = true;
    try {
      localStorage.removeItem('inventory_pro_token');
    } catch {
      // ignore
    }

    async function boot() {
      try {
        const response = await getPerfilRequest();
        if (active) {
          setUser(mapUser(response.data));
        }
      } catch {
        if (active) {
          clearAccessToken();
          setUser(null);
        }
      } finally {
        if (active) setBooting(false);
      }
    }

    boot();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      booting,
      isAuthenticated: Boolean(user),
      login,
      logout
    }),
    [user, booting, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
