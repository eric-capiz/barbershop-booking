import axios from "axios";
import { Review } from "@/types/review.types";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const reviewService = {
  getPublicReviews: async (): Promise<Review[]> => {
    const { data } = await axios.get<Review[]>("/api/user/reviews/public");
    return data;
  },

  getUserReviews: async (): Promise<Review[]> => {
    const { data } = await axios.get<Review[]>("/api/user/reviews/my-reviews", {
      headers: getAuthHeader(),
    });
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

  deleteReview: async (reviewId: string): Promise<void> => {
    await axios.delete(`/api/user/reviews/${reviewId}`, {
      headers: getAuthHeader(),
    });
  },

  updateReview: async (
    reviewId: string,
    reviewData: {
      rating?: number;
      feedback?: string;
      image?: File;
    }
  ): Promise<Review> => {
    const formData = new FormData();
    if (reviewData.rating)
      formData.append("rating", reviewData.rating.toString());
    if (reviewData.feedback) formData.append("feedback", reviewData.feedback);
    if (reviewData.image) formData.append("image", reviewData.image);

    const { data } = await axios.patch(
      `/api/user/reviews/${reviewId}`,
      formData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },
};
