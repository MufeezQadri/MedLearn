import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { User } from "@medlearn/shared";

const AUTH_TOKEN_KEY = "medlearn.auth.token";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: { fullName: string; email: string; password: string; examTrack: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(window.localStorage.getItem(AUTH_TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const res = await fetch("http://localhost:4000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Token invalid");
        
        const data = await res.json();
        setUser(data.data as User);
      } catch (err) {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      async login(email, password) {
        const res = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to login");
        
        window.localStorage.setItem(AUTH_TOKEN_KEY, data.data.tokens.accessToken);
        setToken(data.data.tokens.accessToken);
        setUser(data.data.user);
      },
      async signup(payload) {
        const res = await fetch("http://localhost:4000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to sign up");
        
        window.localStorage.setItem(AUTH_TOKEN_KEY, data.data.tokens.accessToken);
        setToken(data.data.tokens.accessToken);
        setUser(data.data.user);
      },
      logout() {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        setToken(null);
        setUser(null);
      },
    }),
    [user, token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
