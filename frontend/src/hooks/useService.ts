import { useQuery } from "@tanstack/react-query";
import { servicesService } from "@/services/services.service";

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: servicesService.getServices,
  });
};
