import axios from "axios";
import { BarberAvailability } from "@/types/admin/availability.types";

export const publicAvailabilityService = {
  getBarberAvailability: async (): Promise<BarberAvailability> => {
    const { data } = await axios.get<BarberAvailability>(`/api/availability`);
    return data;
  },
};
