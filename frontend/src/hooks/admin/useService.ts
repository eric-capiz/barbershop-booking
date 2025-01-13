import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesService } from "@/services/admin/services.service";
import { Service } from "@/types/services.types";

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: servicesService.getServices,
  });
};

export const useAddService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: servicesService.addService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      serviceData,
    }: {
      id: string;
      serviceData: Partial<Service>;
    }) => servicesService.updateService(id, serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: servicesService.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
