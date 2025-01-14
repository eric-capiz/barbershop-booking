import axios from "axios";
import {
  Appointment,
  CreateAppointmentDTO,
  AppointmentResponse,
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
    const { data } = await axios.get<Appointment[]>(
      `${APPOINTMENT_URL}/admin`,
      {
        headers: {
          ...getAuthHeader(),
        },
      }
    );
    return data;
  },
};
