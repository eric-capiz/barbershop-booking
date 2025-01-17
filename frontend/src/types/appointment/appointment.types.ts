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

export interface RejectionDetails {
  note: string;
  rejectedAt: Date | null;
}

export interface Appointment {
  _id: string;
  adminId: AdminProfile;
  userId: User;
  serviceId: Service;
  appointmentDate: Date;
  timeSlot: {
    start: Date;
    end: Date;
  };
  status: AppointmentStatus;
  contactInfo: {
    email: string;
    phone: string;
  };
  rejectionDetails?: RejectionDetails;
  rescheduleRequest?: {
    requestedBy: "admin" | "user" | null;
    proposedDate: Date;
    proposedTimeSlot: {
      start: Date;
      end: Date;
    };
    status: "pending" | "accepted" | "rejected" | null;
  };
  review: Review | null;
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
