import axios from "axios";
import {
  Appointment,
  CreateAppointmentDTO,
  AppointmentResponse,
  RescheduleRequest,
} from "@/types/appointment/appointment.types";

const BASE_URL = "http://localhost:5000";
const APPOINTMENT_URL = `${BASE_URL}/api/appointments`;

// Helper function to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const appointmentService = {
  // Create new appointment
  createAppointment: async (
    appointmentData: CreateAppointmentDTO
  ): Promise<AppointmentResponse> => {
    try {
      const { data } = await axios.post<AppointmentResponse>(
        `${APPOINTMENT_URL}/book`,
        appointmentData,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Booking error details:", {
        message: error.response?.data?.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // Get user's appointments
  getUserAppointments: async (): Promise<Appointment[]> => {
    const { data } = await axios.get<Appointment[]>(`${APPOINTMENT_URL}/user`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return data;
  },

  // Get admin's appointments
  getAdminAppointments: async (): Promise<Appointment[]> => {
    try {
      const { data } = await axios.get<Appointment[]>(
        `${APPOINTMENT_URL}/admin`,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Error fetching admin appointments:", error);
      throw error;
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (
    appointmentId: string,
    status: string
  ): Promise<Appointment> => {
    try {
      const headers = getAuthHeader();

      const { data } = await axios.put<Appointment>(
        `${APPOINTMENT_URL}/${appointmentId}/status`,
        { status },
        {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Status update error details:", {
        message: error.response?.data?.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  rescheduleAppointment: async (
    appointmentId: string,
    rescheduleData: RescheduleRequest
  ): Promise<Appointment> => {
    try {
      const { data } = await axios.put<Appointment>(
        `${APPOINTMENT_URL}/${appointmentId}/reschedule`,
        rescheduleData,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Reschedule error details:", error);
      throw error;
    }
  },

  respondToReschedule: async (
    appointmentId: string,
    status: "confirm" | "reject"
  ): Promise<Appointment> => {
    try {
      const { data } = await axios.put<Appointment>(
        `${APPOINTMENT_URL}/${appointmentId}/reschedule-response`,
        { status },
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Reschedule response error:", error);
      throw error;
    }
  },
};
