const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const BarberAvailability = require("../../model/admin/BarberAvailability");

// @route   GET /api/admin/availability
// @desc    Get barber's current month availability
// @access  Private/Admin
router.get("/", async (req, res) => {
  try {
    const availability = await BarberAvailability.findOne({
      adminId: req.user.id,
    });

    if (!availability) {
      return res.status(404).json({ message: "No availability found" });
    }

    res.json(availability);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/admin/availability/month
// @desc    Initial setup for next month's schedule
// @access  Private/Admin
router.post("/month", async (req, res) => {
  try {
    const { month, year, workingDays } = req.body;

    // Create array of all days in the month with workingDay status
    const schedule = workingDays.map((day) => ({
      date: new Date(year, month - 1, day),
      isWorkingDay: true,
      workHours: null,
      timeSlots: [],
    }));

    let availability = await BarberAvailability.findOne({
      adminId: req.user.id,
    });

    if (!availability) {
      availability = new BarberAvailability({
        adminId: req.user.id,
        currentMonth: { month, year, isSet: true },
        schedule,
      });
    } else {
      // Clear existing month data
      await BarberAvailability.updateOne(
        { adminId: req.user.id },
        {
          $set: {
            currentMonth: { month, year, isSet: true },
            schedule,
          },
        }
      );
    }

    await availability.save();
    res.json(availability);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/availability/day/:date
// @desc    Set or update working hours for a specific day
// @access  Private/Admin
router.put("/day/:date", async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    const date = new Date(req.params.date);

    let availability = await BarberAvailability.findOne({
      adminId: req.user.id,
    });

    if (!availability) {
      return res.status(404).json({ message: "No availability found" });
    }

    // Find the day in schedule
    const dayIndex = availability.schedule.findIndex(
      (day) =>
        day.date.toISOString().split("T")[0] ===
        date.toISOString().split("T")[0]
    );

    if (dayIndex === -1) {
      return res.status(404).json({ message: "Date not found in schedule" });
    }

    // If startTime and endTime are null, mark as not working
    if (!startTime || !endTime) {
      availability.schedule[dayIndex].isWorkingDay = false;
      availability.schedule[dayIndex].workHours = null;
      availability.schedule[dayIndex].timeSlots = [];
    } else {
      // Generate 30-minute slots between start and end time
      const slots = generateTimeSlots(new Date(startTime), new Date(endTime));

      availability.schedule[dayIndex].isWorkingDay = true;
      availability.schedule[dayIndex].workHours = {
        start: startTime,
        end: endTime,
      };
      availability.schedule[dayIndex].timeSlots = slots;
    }

    await availability.save();
    res.json(availability);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper function to generate 30-minute slots
const generateTimeSlots = (start, end) => {
  const slots = [];
  let current = new Date(start);

  while (current < end) {
    slots.push({
      startTime: new Date(current),
      endTime: new Date(current.getTime() + 30 * 60000), // 30 minutes in milliseconds
      isBooked: false,
    });
    current = new Date(current.getTime() + 30 * 60000);
  }

  return slots;
};

module.exports = router;
