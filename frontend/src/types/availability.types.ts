export interface TimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
  appointmentId?: string;
}

export interface ScheduleDay {
  date: string;
  isWorkingDay: boolean;
  workHours: {
    start: string;
    end: string;
  } | null;
  timeSlots: TimeSlot[];
}

export interface BarberAvailability {
  _id: string;
  adminId: string;
  currentMonth: {
    month: number;
    year: number;
    isSet: boolean;
  };
  schedule: ScheduleDay[];
}

export interface MonthSetupData {
  month: number;
  year: number;
  workingDays: number[];
}

export interface DayUpdateData {
  startTime: string | null;
  endTime: string | null;
}
