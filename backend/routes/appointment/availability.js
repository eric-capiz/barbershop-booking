const express = require("express");
const router = express.Router();
const BarberAvailability = require("../../model/admin/BarberAvailability");

// @route   GET /api/availability
// @desc    Get barber's availability (public)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const availability = await BarberAvailability.findOne();

    if (!availability) {
      return res.status(404).json({ message: "No availability found" });
    }

    res.json(availability);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
