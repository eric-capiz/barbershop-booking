import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import { useAuthStore } from "../components/store/authStore";

export const useUser = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ["user"],
    queryFn: userService.getCurrentUser,
    enabled: !!localStorage.getItem("token"),
    onSuccess: (data) => {
      setUser(data);
    },
  });
};
