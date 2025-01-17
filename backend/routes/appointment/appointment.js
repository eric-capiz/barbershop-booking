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

    const scheduleDay = availability.schedule.find((day) => {
      const scheduleDate = new Date(day.date);
      scheduleDate.setUTCHours(0, 0, 0, 0);
      return scheduleDate.getTime() === bookingDate.getTime();
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

    const requestedStart = new Date(timeSlot.start);
    const requestedEnd = new Date(timeSlot.end);
    const workStart = new Date(scheduleDay.workHours.start);
    const workEnd = new Date(scheduleDay.workHours.end);

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
    appointment = await Appointment.findById(appointment._id)
      .populate("adminId", "name")
      .populate("serviceId", "name duration price");

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

    if (!["pending", "confirmed"].includes(appointment.status)) {
      return res.status(400).json({
        message: "Only pending or confirmed appointments can be rescheduled",
      });
    }

    if (appointment.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Store current status before updating to reschedule-pending
    const currentStatus = appointment.status;

    appointment.status = "reschedule-pending";
    appointment.rescheduleRequest = {
      requestedBy: "user",
      previousStatus: currentStatus,
      proposedDate: new Date(proposedDate),
      proposedTimeSlot: {
        start: new Date(proposedTimeSlot.start),
        end: new Date(proposedTimeSlot.end),
      },
      status: "pending",
    };

    await appointment.save();

    appointment = await Appointment.findById(appointment._id)
      .populate("adminId", "name")
      .populate("userId", "name email")
      .populate("serviceId", "name duration price")
      .populate("review");

    res.json(appointment);
  } catch (err) {
    console.error("Reschedule error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { status, rejectionDetails } = req.body;
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Store the previous status before any reschedule request
    const previousStatus =
      appointment.status === "reschedule-pending"
        ? appointment.rescheduleRequest?.previousStatus || "pending"
        : appointment.status;

    // Handle reschedule rejection differently
    if (status === "reschedule-rejected") {
      // Revert to previous status
      appointment.status = previousStatus;
      appointment.rejectionDetails = {
        note: rejectionDetails?.note || "",
        rejectedAt: new Date(),
      };
      // Keep reschedule request for history but mark as rejected
      appointment.rescheduleRequest = {
        ...appointment.rescheduleRequest,
        status: "rejected",
      };
    }
    // Handle regular rejection
    else if (status === "rejected") {
      appointment.status = status;
      appointment.rejectionDetails = {
        note: rejectionDetails?.note || "",
        rejectedAt: new Date(),
      };
    }
    // Handle reschedule confirmation
    else if (
      status === "confirmed" &&
      appointment.status === "reschedule-pending"
    ) {
      appointment.status = "reschedule-confirmed";
      appointment.appointmentDate = appointment.rescheduleRequest.proposedDate;
      appointment.timeSlot = appointment.rescheduleRequest.proposedTimeSlot;
      appointment.rescheduleRequest.status = "confirmed";
    }
    // Handle other status updates
    else {
      appointment.status = status;
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

router.put("/:id/reschedule-response", async (req, res) => {
  try {
    const { status } = req.body;
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
      appointment.rescheduleRequest.status = "confirmed";
    } else {
      // Revert to previous status when rejecting
      appointment.status =
        appointment.rescheduleRequest.previousStatus || "pending";
      appointment.rescheduleRequest.status = "rejected";
      appointment.rejectionDetails = {
        note: req.body.rejectionDetails?.note || "",
        rejectedAt: new Date(),
      };
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
