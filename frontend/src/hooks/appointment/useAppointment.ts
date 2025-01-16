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
      // Invalidate and refetch appointments after creating new one
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  // Get User Appointments Query
  const getUserAppointments = useQuery({
    queryKey: ["appointments", "user", user?.id],
    queryFn: appointmentService.getUserAppointments,
    enabled: !isAdmin && !!user?.id, // Add user.id check
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Get Admin Appointments Query
  const getAdminAppointments = useQuery({
    queryKey: ["appointments", "admin", user?.id],
    queryFn: appointmentService.getAdminAppointments,
    enabled: isAdmin && !!user?.id, // Add user.id check
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    // Mutations
    createAppointment,
    isCreating: createAppointment.isPending,
    createError: createAppointment.error,

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
