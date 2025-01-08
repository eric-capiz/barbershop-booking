import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { LoginCredentials, RegisterData } from "../types/auth.types";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      // Store the token
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["user"] });
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

  return () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };
};
