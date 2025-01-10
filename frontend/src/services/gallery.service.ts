import axios from "axios";
import { GalleryItem } from "../types/gallery.types";

export const galleryService = {
  getGallery: async (): Promise<GalleryItem[]> => {
    const { data } = await axios.get<GalleryItem[]>("/api/admin/gallery");
    return data;
  },
};
