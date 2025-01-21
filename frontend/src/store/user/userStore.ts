import { create } from "zustand";

interface User {
  id: string;
  role: "user" | "admin" | "superadmin";
  username: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (user: User) => void;
  clearUser: () => void;
  initializeFromStorage: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  updateUser: (user) => set({ user }),
  initializeFromStorage: () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ user: null });
      return;
    }
    // Let the auth process handle setting the user
  },
}));

// Initialize the store when the file is loaded
useUserStore.getState().initializeFromStorage();

// Re-initialize when local storage changes
window.addEventListener("storage", () => {
  useUserStore.getState().initializeFromStorage();
});
