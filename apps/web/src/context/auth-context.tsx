import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { User } from "@medlearn/shared";
import { mockApp } from "../data/mock-app";

const AUTH_KEY = "medlearn.auth.userId";

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: { fullName: string; email: string; examTrack: User["examTrack"] }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userId = window.localStorage.getItem(AUTH_KEY);
    if (userId) {
      setUser(mockApp.getUser(userId));
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      async login(email, password) {
        const nextUser = mockApp.login(email, password);
        window.localStorage.setItem(AUTH_KEY, nextUser.id);
        setUser(nextUser);
      },
      async signup(payload) {
        const nextUser = mockApp.signup(payload);
        window.localStorage.setItem(AUTH_KEY, nextUser.id);
        setUser(nextUser);
      },
      logout() {
        window.localStorage.removeItem(AUTH_KEY);
        setUser(null);
      },
    }),
    [user],
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
