import { create } from "zustand";
import { User, BarberProfile } from "../types/auth.types";

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | BarberProfile | null;
  setIsAuthenticated: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
  setUser: (user: User | BarberProfile | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem("token"),
  isAdmin: false,
  user: null,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsAdmin: (value) => set({ isAdmin: value }),
  setUser: (user) => set({ user }),
}));
