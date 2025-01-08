import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";

export const useUser = () => {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: [isAdmin ? "admin" : "user"],
    queryFn: authService.getCurrentUser,
    enabled: !!localStorage.getItem("token"),
    onSuccess: (data) => {
      setUser(data);
    },
  });
};
