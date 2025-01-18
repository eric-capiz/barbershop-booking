import { create } from "zustand";
import { Review } from "@/types/review.types";

interface ReviewsStore {
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  deleteReview: (reviewId: string) => void;
  updateReview: (reviewId: string, updatedReview: Partial<Review>) => void;
}

export const useReviewsStore = create<ReviewsStore>((set) => ({
  reviews: [],
  setReviews: (reviews) => set({ reviews }),
  deleteReview: (reviewId) =>
    set((state) => ({
      reviews: state.reviews.filter((review) => review._id !== reviewId),
    })),
  updateReview: (reviewId, updatedReview) =>
    set((state) => ({
      reviews: state.reviews.map((review) =>
        review._id === reviewId ? { ...review, ...updatedReview } : review
      ),
    })),
}));
