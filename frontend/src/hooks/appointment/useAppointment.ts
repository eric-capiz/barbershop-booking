import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointment/appointmentService";
import {
  CreateAppointmentDTO,
  RescheduleRequest,
} from "@/types/appointment/appointment.types";
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
    mutationFn: (params: {
      appointmentId: string;
      status: AppointmentStatus;
      rejectionDetails?: {
        note: string;
        rejectedAt?: string;
      };
    }) => appointmentService.updateAppointmentStatus(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
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

  // Reschedule Appointment Mutation
  const rescheduleAppointment = useMutation({
    mutationFn: ({
      appointmentId,
      rescheduleData,
    }: {
      appointmentId: string;
      rescheduleData: RescheduleRequest;
    }) =>
      appointmentService.rescheduleAppointment(appointmentId, rescheduleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "user"] });
      queryClient.invalidateQueries({ queryKey: ["booking-availability"] });
    },
  });

  // Respond to Reschedule Mutation
  const respondToReschedule = useMutation({
    mutationFn: ({
      appointmentId,
      status,
    }: {
      appointmentId: string;
      status: "confirm" | "reject";
    }) => appointmentService.respondToReschedule(appointmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "user"] });
      queryClient.invalidateQueries({ queryKey: ["booking-availability"] });
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

    // Reschedule Appointment
    rescheduleAppointment,
    respondToReschedule,
  };
};
