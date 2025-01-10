import { create } from "zustand";
import { Review } from "../types/review.types";

interface ReviewsStore {
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
}

export const useReviewsStore = create<ReviewsStore>((set) => ({
  reviews: [],
  setReviews: (reviews) => set({ reviews }),
}));
