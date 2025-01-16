export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// For appointments
export interface UserAppointment {
  id: string;
  service: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

// For reviews
export interface UserReview {
  id: string;
  appointmentId: string;
  service: string;
  date: string;
  rating: number;
  comment: string;
}
