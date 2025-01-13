import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user/user.service";
import { useUserStore } from "@/store/user/userStore";
import { User } from "@/types/user/user.types";
import { useAuthStore } from "@/store/authStore";

export const useUser = () => {
  const setUser = useUserStore((state) => state.setUser);

  return useQuery({
    queryKey: ["userProfile"],
    queryFn: userService.getProfile,
    onSuccess: (data) => {
      setUser(data);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const updateUser = useUserStore((state) => state.updateUser);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: Partial<User>) => userService.updateProfile(data),
    onSuccess: (data) => {
      updateUser(data);
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
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
