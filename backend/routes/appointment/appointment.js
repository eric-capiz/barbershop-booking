const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const Appointment = require("../../model/appointment/Appointment");
const BarberAvailability = require("../../model/admin/BarberAvailability");

// Protected routes - both user and admin need auth
router.use(auth);

// User Routes
router.get("/user", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.user.id,
    })
      .populate("adminId", "name")
      .populate("serviceId", "name duration price")
      .populate("review")
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/book", async (req, res) => {
  try {
    const {
      adminId,
      serviceId,
      appointmentDate,
      timeSlot,
      contactInfo,
      notes,
    } = req.body;

    // Check if time slot is available
    const availability = await BarberAvailability.findOne({
      adminId,
      "schedule.date": appointmentDate,
    });

    if (!availability) {
      return res.status(400).json({ message: "Time slot not available" });
    }

    const newAppointment = new Appointment({
      userId: req.user.id,
      adminId,
      serviceId,
      appointmentDate,
      timeSlot,
      contactInfo,
      notes,
      status: "pending",
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

// Admin Routes
router.use(isAdmin);

router.get("/admin", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      adminId: req.user.id,
    })
      .populate("userId", "name email")
      .populate("serviceId", "name duration price")
      .populate("review")
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Shared routes with role checks
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Only admin can confirm or mark no-show
    if ((status === "confirmed" || status === "no-show") && !req.user.isAdmin) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Users can only cancel their own appointments
    if (!req.user.isAdmin && appointment.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    appointment.status = status;
    await appointment.save();

    await appointment
      .populate("adminId", "name")
      .populate("userId", "name email")
      .populate("serviceId", "name duration price")
      .populate("review");

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/reschedule", async (req, res) => {
  try {
    const { proposedDate, proposedTimeSlot } = req.body;
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Users can only reschedule their own appointments
    if (!req.user.isAdmin && appointment.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    appointment.rescheduleRequest = {
      requestedBy: req.user.isAdmin ? "admin" : "user",
      proposedDate,
      proposedTimeSlot,
      status: "pending",
    };

    await appointment.save();

    await appointment
      .populate("adminId", "name")
      .populate("userId", "name email")
      .populate("serviceId", "name duration price")
      .populate("review");

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
