import axios from "axios";
import { Service } from "@/types/services.types";

export const servicesService = {
  getServices: async (): Promise<Service[]> => {
    const { data } = await axios.get<Service[]>("/api/admin/services");
    return data;
  },
};
