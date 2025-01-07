const express = require("express");
const router = express.Router();

const UserAppointment = require("../../model/user/UserAppointment");
const BarberAvailability = require("../../model/admin/BarberAvailability");

// @route   GET /api/user/appointments
// @desc    Get user's upcoming appointments
// @access  Private
router.get("/", async (req, res) => {
  try {
    const appointments = await UserAppointment.find({
      userId: req.user.id,
      appointmentDate: { $gte: new Date() },
    })
      .populate("adminId", "name")
      .populate("serviceId", "name duration price")
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/user/appointments/history
// @desc    Get user's past appointments
// @access  Private
router.get("/history", async (req, res) => {
  try {
    const appointments = await UserAppointment.find({
      userId: req.user.id,
      appointmentDate: { $lt: new Date() },
    })
      .populate("adminId", "name")
      .populate("serviceId", "name duration price")
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/user/appointments
// @desc    Book a new appointment
// @access  Private
router.post("/", async (req, res) => {
  try {
    const { adminId, serviceId, appointmentDate } = req.body;

    // Check if time slot is available
    const availability = await BarberAvailability;

    // Create new appointment
    const newAppointment = new UserAppointment({
      userId: req.user.id,
      adminId,
      serviceId,
      appointmentDate,
      notes,
      status: "pending",
      rescheduleAttempted: false,
    });

    const appointment = await newAppointment.save();

    await appointment
      .populate("adminId", "name")
      .populate("serviceId", "name duration price");

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/user/appointments/:id/reschedule
// @desc    Request to reschedule appointment
// @access  Private
router.put("/:id/reschedule", async (req, res) => {
  try {
    const { proposedDate } = req.body;

    let appointment = await UserAppointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Check if reschedule was already attempted
    if (appointment.rescheduleAttempted) {
      return res.status(400).json({
        message: "Appointment has already been rescheduled once",
      });
    }

    appointment.rescheduleAttempted = true;
    appointment.rescheduleInfo = {
      requestedBy: "user",
      proposedDate,
      status: "pending",
    };

    await appointment.save();

    await appointment
      .populate("adminId", "name")
      .populate("serviceId", "name duration price");

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/user/appointments/:id/cancel
// @desc    Cancel appointment
// @access  Private
router.put("/:id/cancel", async (req, res) => {
  try {
    let appointment = await UserAppointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    await appointment
      .populate("adminId", "name")
      .populate("serviceId", "name duration price");

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
