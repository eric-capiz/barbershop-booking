import axios from "axios";
import { Review } from "@/types/review.types";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const reviewService = {
  getReviews: async (): Promise<Review[]> => {
    const { data } = await axios.get<Review[]>("/api/user/reviews");
    return data;
  },

  createReview: async (reviewData: {
    appointmentId: string;
    rating: number;
    feedback: string;
    image?: File;
  }): Promise<Review> => {
    try {
      const formData = new FormData();
      formData.append("appointmentId", reviewData.appointmentId);
      formData.append("rating", reviewData.rating.toString());
      formData.append("feedback", reviewData.feedback);
      if (reviewData.image) {
        formData.append("image", reviewData.image);
      }

      const { data } = await axios.post("/api/user/reviews", formData, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      console.error("Review creation error:", {
        message: error.response?.data?.message,
        details: error.response?.data?.details,
      });
      throw error;
    }
  },
};
