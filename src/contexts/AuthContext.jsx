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
    const nextUser = response.data.usuario;
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
      // Si hay token en sessionStorage, Bearer ya irá en axios
      try {
        const response = await getPerfilRequest();
        if (active) {
          setUser({
            id_usuario: response.data.id_usuario,
            nombre_completo: response.data.nombre_completo,
            nombre_usuario: response.data.nombre_usuario,
            rol: response.data.rol
          });
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
