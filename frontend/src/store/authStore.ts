import { create } from "zustand";
import { User, Admin } from "../types/auth.types";

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | Admin | null;
  setIsAuthenticated: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
  setUser: (user: User | Admin | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem("token"),
  isAdmin: false,
  user: null,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsAdmin: (value) => set({ isAdmin: value }),
  setUser: (user) => set({ user }),
}));
