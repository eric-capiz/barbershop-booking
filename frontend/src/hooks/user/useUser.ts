import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { useUserStore } from "@/store/userStore";
import { User } from "@/types/user/user.types";

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

  return useMutation({
    mutationFn: (data: Partial<User>) => userService.updateProfile(data),
    onSuccess: (data) => {
      updateUser(data);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

// Placeholder hooks for future implementation
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
