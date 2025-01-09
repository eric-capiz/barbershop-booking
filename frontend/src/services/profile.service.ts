import axios from "axios";
import { Profile } from "../types/profile.types";

export const profileService = {
  getBarberProfile: async (): Promise<Profile> => {
    const { data } = await axios.get<Profile>("/api/admin/profile");
    return data;
  },
};
