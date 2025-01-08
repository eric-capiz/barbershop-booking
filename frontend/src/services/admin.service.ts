import axios from "axios";
import { Admin } from "../types/admin.types";

export const adminService = {
  getAdminProfile: async (): Promise<Admin> => {
    const { data } = await axios.get<Admin>("/api/admin/profile");
    return data;
  },
};
