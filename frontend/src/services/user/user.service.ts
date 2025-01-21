import axios from "axios";
import { User } from "@/types/user/user.types";

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    const { data } = await axios.get<User>("/api/user/profile");
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await axios.get<User>("/api/user/profile");
    return data;
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const { data } = await axios.put<User>("/api/user/profile", profileData);
    return data;
  },

  getAppointments: async () => {
    return Promise.resolve([]);
  },

  getReviews: async () => {
    return Promise.resolve([]);
  },
};
