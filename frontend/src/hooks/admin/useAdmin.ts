import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";

export const useAdmin = () => {
  return useQuery({
    queryKey: ["admin"],
    queryFn: adminService.getAdminProfile,
    enabled: !!localStorage.getItem("token"),
  });
};
