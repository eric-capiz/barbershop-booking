import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { LoginCredentials, RegisterData } from "@types/auth.types";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/user/userStore";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setIsAuthenticated, setIsAdmin, setAuthToken } = useAuthStore();
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: async (data) => {
      // First set the auth token and basic auth state
      setAuthToken(data.token);
      setIsAuthenticated(true);
      setIsAdmin(!!data.isAdmin);

      // Immediately fetch and set user data
      try {
        const userData = await authService.getCurrentUser();
        // Set user in user store with all necessary data
        setUser({
          id: userData._id,
          role: userData.role || (data.isAdmin ? "admin" : "user"),
          username: userData.username,
        });

        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        queryClient.invalidateQueries({ queryKey: ["appointments", "user"] });
        if (data.isAdmin) {
          queryClient.invalidateQueries({
            queryKey: ["appointments", "admin"],
          });
        }

        // Force a refetch of the user data
        await queryClient.refetchQueries({ queryKey: ["user"] });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
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
  const { clearAuth } = useAuthStore(); // Use clearAuth instead
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminExpiry");
    clearAuth();

    queryClient.removeQueries();
    navigate("/");
  };
};
