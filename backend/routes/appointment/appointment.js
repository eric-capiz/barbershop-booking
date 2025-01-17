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

    // Format the date to match the schedule date format
    const bookingDate = new Date(appointmentDate);
    bookingDate.setUTCHours(0, 0, 0, 0);

    const availability = await BarberAvailability.findOne({
      adminId,
    });

    if (!availability) {
      return res
        .status(400)
        .json({ message: "No availability found for this date" });
    }

    // Find the specific day in the schedule
    const scheduleDay = availability.schedule.find((day) => {
      const scheduleDate = new Date(day.date);
      scheduleDate.setUTCHours(0, 0, 0, 0);
      const matches = scheduleDate.getTime() === bookingDate.getTime();

      return matches;
    });

    if (!scheduleDay || !scheduleDay.isWorkingDay) {
      return res.status(400).json({
        message: "Not a working day",
        debug: {
          scheduleDay,
          bookingDate: bookingDate.toISOString(),
        },
      });
    }

    // Check if the requested time slot falls within working hours
    const requestedStart = new Date(timeSlot.start);
    const requestedEnd = new Date(timeSlot.end);
    const workStart = new Date(scheduleDay.workHours.start);
    const workEnd = new Date(scheduleDay.workHours.end);

    // Set work hours to the same date as the booking
    workStart.setFullYear(
      requestedStart.getFullYear(),
      requestedStart.getMonth(),
      requestedStart.getDate()
    );
    workEnd.setFullYear(
      requestedStart.getFullYear(),
      requestedStart.getMonth(),
      requestedStart.getDate()
    );

    if (requestedStart < workStart || requestedEnd > workEnd) {
      return res.status(400).json({
        message: "Time slot outside working hours",
        debug: {
          requestedStart: requestedStart.toISOString(),
          requestedEnd: requestedEnd.toISOString(),
          workStart: workStart.toISOString(),
          workEnd: workEnd.toISOString(),
        },
      });
    }

    const newAppointment = new Appointment({
      userId: req.user.id,
      adminId,
      serviceId,
      appointmentDate: bookingDate,
      timeSlot,
      contactInfo,
      status: "pending",
    });

    let appointment = await newAppointment.save();

    // Changed the populate chain
    appointment = await Appointment.findById(appointment._id)
      .populate("adminId", "name")
      .populate("serviceId", "name duration price");

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Move reschedule route here, before isAdmin middleware
router.put("/:id/reschedule", async (req, res) => {
  try {
    const { proposedDate, proposedTimeSlot } = req.body;
    console.log("Received reschedule request:", {
      appointmentId: req.params.id,
      proposedDate,
      proposedTimeSlot,
    });

    let appointment = await Appointment.findById(req.params.id);
    console.log("Found appointment:", appointment);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Only allow reschedule for pending or confirmed appointments
    if (!["pending", "confirmed"].includes(appointment.status)) {
      return res.status(400).json({
        message: "Only pending or confirmed appointments can be rescheduled",
      });
    }

    // Users can only reschedule their own appointments
    if (appointment.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Update these fields
    appointment.status = "reschedule-pending";
    appointment.rescheduleRequest = {
      requestedBy: "user",
      proposedDate: new Date(proposedDate),
      proposedTimeSlot: {
        start: new Date(proposedTimeSlot.start),
        end: new Date(proposedTimeSlot.end),
      },
      status: "pending",
    };

    console.log("Updated appointment before save:", appointment);
    await appointment.save();
    console.log("Appointment saved successfully");

    // Fetch updated appointment with populated fields
    appointment = await Appointment.findById(appointment._id)
      .populate("adminId", "name")
      .populate("userId", "name email")
      .populate("serviceId", "name duration price")
      .populate("review");

    console.log("Final appointment:", appointment);
    res.json(appointment);
  } catch (err) {
    console.error("Reschedule error:", err);
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
    if (
      (status === "confirmed" || status === "no-show") &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Users can only cancel their own appointments
    if (status === "cancelled") {
      // Check if user is admin OR if it's their own appointment
      if (
        req.user.role !== "admin" &&
        appointment.userId.toString() !== req.user.id
      ) {
        return res.status(401).json({ message: "Not authorized" });
      }
    }

    appointment.status = status;
    await appointment.save();

    appointment = await Appointment.findById(appointment._id)
      .populate("adminId", "name")
      .populate("userId", "name email")
      .populate("serviceId", "name duration price")
      .populate("review")
      .exec();

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

// Add admin response route (after isAdmin middleware)
router.put("/:id/reschedule-response", async (req, res) => {
  try {
    const { status } = req.body; // status can be 'confirm' or 'reject'
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status !== "reschedule-pending") {
      return res.status(400).json({ message: "No pending reschedule request" });
    }

    if (status === "confirm") {
      appointment.status = "reschedule-confirmed";
      appointment.appointmentDate = appointment.rescheduleRequest.proposedDate;
      appointment.timeSlot = appointment.rescheduleRequest.proposedTimeSlot;
    } else {
      appointment.status = "reschedule-rejected";
    }

    await appointment.save();

    appointment = await Appointment.findById(appointment._id)
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
