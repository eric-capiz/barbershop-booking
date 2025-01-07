const express = require("express");
const router = express.Router();

const Review = require("../../model/review/Review");
const UserAppointment = require("../../model/user/UserAppointment");

// @route   POST /api/user/reviews
// @desc    Create a review for a completed appointment
// @access  Private
router.post("/", async (req, res) => {
  try {
    const { appointmentId, rating, feedback, image } = req.body;

    // Check if appointment exists and belongs to user
    const appointment = await UserAppointment.findOne({
      _id: appointmentId,
      userId: req.user.id,
      status: "completed", // Can only review completed appointments
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found or not eligible for review",
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ appointmentId });
    if (existingReview) {
      return res.status(400).json({
        message: "Review already exists for this appointment",
      });
    }

    const newReview = new Review({
      userId: req.user.id,
      appointmentId,
      rating,
      feedback,
      image,
      isActive: true,
    });

    const review = await newReview.save();

    await review.populate("userId", "name");
    await review.populate("appointmentId", "appointmentDate");

    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/user/reviews
// @desc    Get all reviews by the user
// @access  Private
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({
      userId: req.user.id,
      isActive: true,
    })
      .populate("appointmentId", "appointmentDate")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/user/reviews/:id
// @desc    Update a review
// @access  Private
router.put("/:id", async (req, res) => {
  try {
    const { rating, feedback, image } = req.body;

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if review belongs to user
    if (review.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (rating) review.rating = rating;
    if (feedback) review.feedback = feedback;
    if (image) review.image = image;

    await review.save();

    await review.populate("userId", "name");
    await review.populate("appointmentId", "appointmentDate");

    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/user/reviews/:id
// @desc    Soft delete a review (set isActive to false)
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if review belongs to user
    if (review.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    review.isActive = false;
    await review.save();

    res.json({ message: "Review removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
