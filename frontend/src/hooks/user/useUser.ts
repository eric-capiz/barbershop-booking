import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user/user.service";
import { useUserStore } from "@/store/user/userStore";
import { User } from "@/types/user/user.types";
import { useAuthStore } from "@/store/authStore";

export const useUser = () => {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const setUser = useAuthStore((state) => state.setUser);
  const setUserStore = useUserStore((state) => state.setUser);

  return useQuery({
    queryKey: [isAdmin ? "admin" : "user"],
    queryFn: userService.getCurrentUser,
    enabled: !!localStorage.getItem("token"),
    onSuccess: (data) => {
      setUser(data);
      setUserStore(data);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const setUserStore = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: Partial<User>) => userService.updateProfile(data),
    onSuccess: (data) => {
      setUserStore(data);
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useUserAppointments = () => {
  return useQuery({
    queryKey: ["userAppointments"],
    queryFn: userService.getAppointments,
  });
};

export const useUserReviews = () => {
  return useQuery({
    queryKey: ["userReviews"],
    queryFn: userService.getReviews,
  });
};
