import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AuthContextType, LoginInput, User } from "./auth.types";
import { getMe } from "./api";
import { authService } from "./auth.service";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  useEffect(() => {
    async function loadUser() {
      if (!token) return;
      try {
        const me = await getMe(token);
        setUser(me);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      }
    }
    loadUser();
  }, [token]);

  const login = async (data: LoginInput) => {
    const response = await authService.login(data);
    setUser(response.user);
    setToken(response.token);

    localStorage.setItem("token", response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
