import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointment/appointmentService";
import { CreateAppointmentDTO } from "@/types/appointment/appointment.types";
import { useUserStore } from "@/store/user/userStore";

export const useAppointment = () => {
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const isAdmin = user?.role === "admin";

  // Create Appointment Mutation
  const createAppointment = useMutation({
    mutationFn: (appointmentData: CreateAppointmentDTO) =>
      appointmentService.createAppointment(appointmentData),
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "user"] });
      queryClient.invalidateQueries({ queryKey: ["booking-availability"] });
    },
  });

  // Update Appointment Status Mutation
  const updateAppointmentStatus = useMutation({
    mutationFn: async ({
      appointmentId,
      status,
    }: {
      appointmentId: string;
      status: string;
    }) => {
      const response = await appointmentService.updateAppointmentStatus(
        appointmentId,
        status
      );
      return response;
    },
    onSuccess: () => {
      // Invalidate both admin and user appointment queries
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "user"] });
    },
  });

  // Get User Appointments Query
  const getUserAppointments = useQuery({
    queryKey: ["appointments", "user", user?.id],
    queryFn: appointmentService.getUserAppointments,
    enabled: !!user?.id,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Get Admin Appointments Query
  const getAdminAppointments = useQuery({
    queryKey: ["appointments", "admin", user?.id],
    queryFn: appointmentService.getAdminAppointments,
    enabled: !!user?.id && user?.role === "admin",
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: false,
    onError: () => {
      return;
    },
  });

  return {
    // Mutations
    createAppointment,
    updateAppointmentStatus,
    isCreating: createAppointment.isPending,
    isUpdating: updateAppointmentStatus.isPending,
    createError: createAppointment.error,
    updateError: updateAppointmentStatus.error,

    // User Appointments
    userAppointments: getUserAppointments.data,
    isLoadingUserAppointments: getUserAppointments.isLoading || !user?.id,
    userAppointmentsError: getUserAppointments.error,

    // Admin Appointments
    adminAppointments: getAdminAppointments.data,
    isLoadingAdminAppointments: getAdminAppointments.isLoading || !user?.id,
    adminAppointmentsError: getAdminAppointments.error,
  };
};
