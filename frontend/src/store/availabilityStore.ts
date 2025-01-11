import { create } from "zustand";
import { BarberAvailability, ScheduleDay } from "@types/availability.types";

interface AvailabilityState {
  currentMonth: {
    month: number;
    year: number;
    isSet: boolean;
  };
  schedule: ScheduleDay[];
  selectedDate: string | null;
  setCurrentMonth: (month: number, year: number, isSet: boolean) => void;
  setSchedule: (schedule: ScheduleDay[]) => void;
  setSelectedDate: (date: string | null) => void;
  updateDaySchedule: (date: string, updates: Partial<ScheduleDay>) => void;
  resetStore: () => void;
}

const initialState = {
  currentMonth: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    isSet: false,
  },
  schedule: [],
  selectedDate: null,
};

export const useAvailabilityStore = create<AvailabilityState>((set) => ({
  ...initialState,

  setCurrentMonth: (month, year, isSet) =>
    set((state) => ({
      ...state,
      currentMonth: { month, year, isSet },
    })),

  setSchedule: (schedule) =>
    set((state) => ({
      ...state,
      schedule,
    })),

  setSelectedDate: (date) =>
    set((state) => ({
      ...state,
      selectedDate: date,
    })),

  updateDaySchedule: (date, updates) =>
    set((state) => ({
      ...state,
      schedule: state.schedule.map((day) =>
        day.date === date ? { ...day, ...updates } : day
      ),
    })),

  resetStore: () => set(initialState),
}));