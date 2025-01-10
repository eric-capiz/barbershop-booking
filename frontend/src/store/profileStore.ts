import { create } from "zustand";
import { BarberProfile } from "../types/auth.types";

interface ProfileState {
  profile: BarberProfile | null;
  setProfile: (profile: BarberProfile | null) => void;
  updateProfile: (updates: Partial<BarberProfile>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),
}));
