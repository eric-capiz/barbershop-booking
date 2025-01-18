import { useEffect } from "react";
import { usePublicReviews } from "@/hooks/useReviews";
import { useReviewsStore } from "@/store/reviewsStore";
import { FaStar } from "react-icons/fa";
import { format } from "date-fns";

const ReviewsSection = () => {
  const { data: reviewsData, isLoading } = usePublicReviews();
  const { reviews, setReviews } = useReviewsStore();

  useEffect(() => {
    if (reviewsData) {
      setReviews(reviewsData);
    }
  }, [reviewsData, setReviews]);

  if (isLoading) return <div className="loading">Loading reviews...</div>;

  if (!reviews?.length) {
    return (
      <section className="reviews-section">
        <h2>Client Reviews</h2>
        <div className="no-reviews">
          <p>No reviews yet. Be the first to leave a review!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="reviews-section">
      <h2>Client Reviews</h2>
      <div className="reviews-grid">
        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <div className="review-header">
              <h3>{review.userId?.name || "Anonymous"}</h3>
              <div className="rating">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={
                      index < review.rating ? "star-filled" : "star-empty"
                    }
                  />
                ))}
              </div>
            </div>
            <p className="review-text">{review.feedback}</p>
            {review.image?.url && (
              <div className="review-image">
                <img src={review.image.url} alt="Review" />
              </div>
            )}
            <div className="review-date">
              {format(new Date(review.createdAt), "MMMM d, yyyy")}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;
