import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { LoginCredentials, RegisterData } from "../types/auth.types";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setIsAdmin = useAuthStore((state) => state.setIsAdmin);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAdmin", String(!!data.isAdmin));
      setIsAuthenticated(true);
      setIsAdmin(!!data.isAdmin);
      queryClient.invalidateQueries({
        queryKey: [data.isAdmin ? "admin" : "user"],
      });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  return useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: (data) => {
      // Store the token
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setIsAdmin = useAuthStore((state) => state.setIsAdmin);
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setIsAuthenticated(false);
    setIsAdmin(false);
    queryClient.removeQueries();
    navigate("/");
  };
};
