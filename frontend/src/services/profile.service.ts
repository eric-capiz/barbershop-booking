import axios from "axios";
import { BarberProfile } from "../types/auth.types";

export const profileService = {
  getProfile: async (): Promise<BarberProfile> => {
    const { data } = await axios.get<BarberProfile>("/api/admin/profile");
    return data;
  },

  updateProfile: async (
    profileData: Partial<BarberProfile>
  ): Promise<BarberProfile> => {
    const { data } = await axios.put<BarberProfile>(
      "/api/admin/profile",
      profileData
    );
    return data;
  },

  updateProfileImage: async (imageFile: File): Promise<BarberProfile> => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const { data } = await axios.put<BarberProfile>(
      "/api/admin/profile/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  deleteProfileImage: async (): Promise<BarberProfile> => {
    const { data } = await axios.delete<BarberProfile>(
      "/api/admin/profile/image"
    );
    return data;
  },
};
