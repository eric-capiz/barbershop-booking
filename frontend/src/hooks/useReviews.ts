import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/review.service";

export const useReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: reviewService.getReviews,
  });
};
