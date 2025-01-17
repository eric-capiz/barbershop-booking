export interface AppointmentContactInfo {
  email: string;
  phone: string;
}

export interface AppointmentTimeSlot {
  start: Date;
  end: Date;
}

export interface RescheduleRequest {
  proposedDate: Date;
  proposedTimeSlot: {
    start: Date;
    end: Date;
  };
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no-show"
  | "rejected"
  | "reschedule-pending"
  | "reschedule-confirmed"
  | "reschedule-rejected";

export interface Appointment {
  _id: string;
  adminId: {
    _id: string;
    name: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  serviceId: {
    _id: string;
    name: string;
    duration: number;
    price: number;
  };
  appointmentDate: Date;
  timeSlot: AppointmentTimeSlot;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no-show";
  contactInfo: AppointmentContactInfo;
  rescheduleRequest: RescheduleRequest;
  review?: string | null;
  hasReview: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// For creating a new appointment
export interface CreateAppointmentDTO {
  adminId: string;
  serviceId: string;
  appointmentDate: Date;
  timeSlot: AppointmentTimeSlot;
  contactInfo: AppointmentContactInfo;
}

// For appointment responses
export interface AppointmentResponse {
  appointment: Appointment;
  message: string;
}
