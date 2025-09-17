import { createContext, useContext, useEffect, useState } from "react";
import api from "./api";

interface AuthContextType {
  user: { userId: string, name: string, email: string } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ userId: string, name: string, email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    const res = await api.get("/user/me");
    setUser(res.data);
  }

  const checkAuth = async () => {
    try {
      await getUser();
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // On mount, check if user is logged in via cookie
  useEffect(() => { checkAuth(); }, []);

  const login = async (email: string, password: string) => {
    await api.post("/login", { email, password });
    await getUser();
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
