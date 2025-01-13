const express = require("express");
const router = express.Router();

const UserAppointment = require("../../model/user/UserAppointment");

// @route   GET /api/admin/appointments
// @desc    Get all upcoming appointments
// @access  Private/Admin
router.get("/", async (req, res) => {
  try {
    const appointments = await UserAppointment.find({
      adminId: req.user.id,
      appointmentDate: { $gte: new Date() },
    })
      .populate("userId", "name email")
      .populate("serviceId", "name duration price")
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/appointments/history
// @desc    Get past appointments
// @access  Private/Admin
router.get("/history", async (req, res) => {
  try {
    const appointments = await UserAppointment.find({
      adminId: req.user.id,
      appointmentDate: { $lt: new Date() },
    })
      .populate("userId", "name email")
      .populate("serviceId", "name duration price")
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/appointments/:id/status
// @desc    Update appointment status (confirm, cancel, complete)
// @access  Private/Admin
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    let appointment = await UserAppointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.adminId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    appointment.status = status;
    await appointment.save();

    await appointment
      .populate("userId", "name email")
      .populate("serviceId", "name duration price");

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/appointments/:id/reschedule
// @desc    Request to reschedule appointment
// @access  Private/Admin
router.put("/:id/reschedule", async (req, res) => {
  try {
    const { proposedDate } = req.body;

    let appointment = await UserAppointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.adminId.toString() !== req.user.id) {
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
      requestedBy: "admin",
      proposedDate: proposedDate,
      status: "pending",
    };

    await appointment.save();

    await appointment
      .populate("userId", "name email")
      .populate("serviceId", "name duration price");

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/appointments/date/:date
// @desc    Get appointments for specific date
// @access  Private/Admin
router.get("/date/:date", async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    const appointments = await UserAppointment.find({
      adminId: req.user.id,
      appointmentDate: {
        $gte: date,
        $lt: nextDay,
      },
    })
      .populate("userId", "name email")
      .populate("serviceId", "name duration price")
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
