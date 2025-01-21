import { create } from "zustand";

interface User {
  id: string;
  role: "user" | "admin";
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
  initializeFromStorage: () => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token) {
      // Decode the JWT token to get user info
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      const user = {
        id: tokenData.user.id,
        role: tokenData.user.role,
        username: tokenData.user.username || username,
      };
      set({ user });
    }
  },
}));

// Initialize the store when the file is loaded
useUserStore.getState().initializeFromStorage();
