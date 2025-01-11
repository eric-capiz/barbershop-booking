import axios from "axios";
import { GalleryItem } from "@/types/gallery.types";

export const galleryService = {
  getGallery: async (): Promise<GalleryItem[]> => {
    const { data } = await axios.get<GalleryItem[]>("/api/admin/gallery");
    return data;
  },

  addGalleryItem: async (formData: FormData): Promise<GalleryItem> => {
    const { data } = await axios.post<GalleryItem>(
      "/api/admin/gallery",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          // Make sure your auth token is being included
          // If you're using axios interceptors for auth, you can skip this
        },
      }
    );
    return data;
  },

  updateGalleryItem: async (
    id: string,
    formData: FormData
  ): Promise<GalleryItem> => {
    const { data } = await axios.put<GalleryItem>(
      `/api/admin/gallery/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  },

  deleteGalleryItem: async (id: string): Promise<void> => {
    await axios.delete(`/api/admin/gallery/${id}`);
  },
};
