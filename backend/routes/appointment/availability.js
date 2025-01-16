const express = require("express");
const router = express.Router();
const BarberAvailability = require("../../model/admin/BarberAvailability");
const Appointment = require("../../model/appointment/Appointment");

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

// New route for booked time slots
// @route   GET /api/availability/booked-slots
// @desc    Get all booked time slots (no customer info)
// @access  Public
router.get("/booked-slots", async (req, res) => {
  try {
    // First, let's see all appointments regardless of status
    const allAppointments = await Appointment.find({});

    // Then check non-cancelled ones
    const activeAppointments = await Appointment.find({
      status: { $ne: "cancelled" },
    });

    const bookedSlots = activeAppointments.map((appointment) => ({
      date: appointment.timeSlot.start,
    }));

    res.json({ bookedSlots });
  } catch (err) {
    console.error("Error in booked-slots route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
