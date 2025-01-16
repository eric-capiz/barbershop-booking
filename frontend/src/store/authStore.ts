import { create } from "zustand";
import { User, BarberProfile } from "@/types/auth.types";
import { authService } from "@/services/auth.service";

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | BarberProfile | null;
  setIsAuthenticated: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
  setUser: (user: User | BarberProfile | null) => void;
  initializeAuth: () => Promise<void>;
  setAuthToken: (token: string) => void;
  clearAuth: () => void;
}

const TOKEN_EXPIRY = 60 * 60 * 1000;

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsAdmin: (value) => {
    set({ isAdmin: value });
    if (value) {
      localStorage.setItem("isAdmin", String(value));
      localStorage.setItem("adminExpiry", String(Date.now() + TOKEN_EXPIRY));
    } else {
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminExpiry");
    }
  },
  setUser: (user) => set({ user }),
  clearAuth: () =>
    set({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
    }),
  setAuthToken: (token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiry", String(Date.now() + TOKEN_EXPIRY));
  },
  initializeAuth: async () => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const adminExpiry = localStorage.getItem("adminExpiry");

    // Check if token has expired
    if (token && tokenExpiry && Number(tokenExpiry) < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminExpiry");
      set({ isAuthenticated: false, isAdmin: false, user: null });
      return;
    }

    // Check if admin status has expired
    if (adminExpiry && Number(adminExpiry) < Date.now()) {
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminExpiry");
      set({ isAdmin: false });
    }

    if (token) {
      try {
        const user = await authService.getCurrentUser();
        set({
          user,
          isAuthenticated: true,
          isAdmin: user.role === "admin" || user.role === "superadmin",
        });
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("adminExpiry");
        set({
          isAuthenticated: false,
          isAdmin: false,
          user: null,
        });
      }
    }
  },
}));
