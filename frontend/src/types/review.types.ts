export interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  appointmentId: string;
  rating: number;
  feedback: string;
  image: {
    url: string;
    publicId: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
