export interface GalleryItem {
  _id: string;
  adminId: string;
  image: {
    url: string;
    publicId: string;
  };
  description: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
