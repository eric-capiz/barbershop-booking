const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const upload = require("../../cloudinary/CloudinaryMiddleware");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../cloudinary/cloudinaryUtils");

const Review = require("../../model/review/Review");
const Appointment = require("../../model/appointment/Appointment");

// @route   GET /api/user/reviews
// @desc    Get all active reviews
// @access  Public
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ isActive: true })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Apply auth middleware for protected routes
router.use(auth);

// @route   POST /api/user/reviews
// @desc    Create a review for a completed appointment
// @access  Private
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { appointmentId, rating, feedback } = req.body;

    const appointment = await UserAppointment.findOne({
      _id: appointmentId,
      userId: req.user.id,
      status: "completed",
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found or not eligible for review",
      });
    }

    const existingReview = await Review.findOne({ appointmentId });
    if (existingReview) {
      return res.status(400).json({
        message: "Review already exists for this appointment",
      });
    }

    let image = {};
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file, "reviews");
        image = {
          url: result.secure_url,
          publicId: result.public_id,
        };
      } catch (error) {
        return res.status(400).json({
          message: "Failed to upload image",
          error: error.message,
        });
      }
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

// @route   PUT /api/user/reviews/:id
// @desc    Update a review
// @access  Private
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Handle image update if new image is uploaded
    if (req.file) {
      try {
        // Delete old image if exists
        if (review.image && review.image.publicId) {
          await deleteFromCloudinary(review.image.publicId);
        }

        // Upload new image
        const result = await uploadToCloudinary(req.file, "reviews");
        review.image = {
          url: result.secure_url,
          publicId: result.public_id,
        };
      } catch (error) {
        return res.status(400).json({
          message: "Failed to update image",
          error: error.message,
        });
      }
    }

    if (rating) review.rating = rating;
    if (feedback) review.feedback = feedback;

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
// @desc    Soft delete a review and remove image
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Delete image from Cloudinary if exists
    if (review.image && review.image.publicId) {
      try {
        await deleteFromCloudinary(review.image.publicId);
        review.image = {}; // Clear image data
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
      }
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
