import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { LoginCredentials, RegisterData } from "@types/auth.types";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setIsAuthenticated, setIsAdmin, setAuthToken } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      setAuthToken(data.token);
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
  const { setIsAuthenticated, setAuthToken } = useAuthStore();

  return useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: (data) => {
      setAuthToken(data.token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { setIsAuthenticated, setIsAdmin } = useAuthStore();
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminExpiry");

    setIsAuthenticated(false);
    setIsAdmin(false);
    queryClient.removeQueries();
    navigate("/");
  };
};
