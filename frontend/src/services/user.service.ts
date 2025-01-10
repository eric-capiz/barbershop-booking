import axios from "axios";
import { User } from "@/types/auth.types";

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    const { data } = await axios.get<User>("/api/user/profile");
    return data;
  },
};
