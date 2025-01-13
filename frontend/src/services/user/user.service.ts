import axios from "axios";
import { User } from "@/types/user/user.types";

export const userService = {
  getProfile: async (): Promise<User> => {
    const { data } = await axios.get<User>("/api/user/profile");
    return data;
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const { data } = await axios.put<User>("/api/user/profile", profileData);
    return data;
  },

  // add these later when we implement the backend
  getAppointments: async () => {
    // TODO: Implement when backend is ready
    return Promise.resolve([]);
  },

  getReviews: async () => {
    // TODO: Implement when backend is ready
    return Promise.resolve([]);
  },
};
