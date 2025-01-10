import axios from "axios";
import { Review } from "@/types/review.types";

export const reviewService = {
  getReviews: async (): Promise<Review[]> => {
    const { data } = await axios.get<Review[]>("/api/user/reviews");
    return data;
  },
};
