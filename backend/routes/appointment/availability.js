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
    const activeAppointments = await Appointment.find({
      status: {
        $in: [
          "pending",
          "confirmed",
          "reschedule-pending",
          "reschedule-confirmed",
        ],
      },
    });

    const bookedSlots = activeAppointments.flatMap((appointment) => {
      const slots = [];

      // Add the original time slot if it's not a confirmed reschedule
      if (!["reschedule-confirmed"].includes(appointment.status)) {
        slots.push({
          date: appointment.timeSlot.start,
        });
      }

      // Add the proposed time slot if it's a reschedule request
      if (
        ["reschedule-pending", "reschedule-confirmed"].includes(
          appointment.status
        ) &&
        appointment.rescheduleRequest
      ) {
        slots.push({
          date: appointment.rescheduleRequest.proposedTimeSlot.start,
        });
      }

      return slots;
    });

    res.json({ bookedSlots });
  } catch (err) {
    console.error("Error in booked-slots route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
