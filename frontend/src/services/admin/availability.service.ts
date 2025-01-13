import axios from "axios";
import {
  BarberAvailability,
  MonthSetupData,
  DayUpdateData,
} from "@/types/admin/availability.types";

export const availabilityService = {
  getAvailability: async (): Promise<BarberAvailability> => {
    const { data } = await axios.get<BarberAvailability>(
      "/api/admin/availability"
    );
    return data;
  },

  setupMonth: async (
    monthData: MonthSetupData
  ): Promise<BarberAvailability> => {
    const { data } = await axios.post<BarberAvailability>(
      "/api/admin/availability/month",
      monthData
    );
    return data;
  },

  updateDay: async (
    date: string,
    dayData: DayUpdateData
  ): Promise<BarberAvailability> => {
    const { data } = await axios.put<BarberAvailability>(
      `/api/admin/availability/day/${date}`,
      dayData
    );
    return data;
  },
};
