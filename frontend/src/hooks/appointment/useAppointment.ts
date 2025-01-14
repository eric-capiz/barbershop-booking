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
    queryKey: ["appointments", "user"],
    queryFn: appointmentService.getUserAppointments,
    enabled: !isAdmin && !!user, // Only fetch if user is logged in and not admin
  });

  // Get Admin Appointments Query
  const getAdminAppointments = useQuery({
    queryKey: ["appointments", "admin"],
    queryFn: appointmentService.getAdminAppointments,
    enabled: isAdmin && !!user, // Only fetch if user is admin and logged in
  });

  return {
    // Mutations
    createAppointment,
    isCreating: createAppointment.isPending,
    createError: createAppointment.error,

    // User Appointments
    userAppointments: getUserAppointments.data,
    isLoadingUserAppointments: getUserAppointments.isLoading,
    userAppointmentsError: getUserAppointments.error,

    // Admin Appointments
    adminAppointments: getAdminAppointments.data,
    isLoadingAdminAppointments: getAdminAppointments.isLoading,
    adminAppointmentsError: getAdminAppointments.error,
  };
};
