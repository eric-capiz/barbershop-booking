import axios from "axios";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types/auth.types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await axios.post<AuthResponse>(
      "/api/auth/login",
      credentials
    );
    return data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await axios.post<AuthResponse>(
      "/api/auth/register",
      userData
    );
    return data;
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const { data } = await axios.get(
      isAdmin ? "/api/admin/profile" : "/api/user/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },
};
