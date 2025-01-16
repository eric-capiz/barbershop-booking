const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { format, parse, setMinutes } = require("date-fns");

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

    // Filter out booked slots before sending
    const processedSchedule = availability.schedule.map((day) => ({
      ...day.toObject(),
      timeSlots: day.timeSlots.filter((slot) => !slot.isBooked),
    }));

    res.json({
      ...availability.toObject(),
      schedule: processedSchedule,
    });
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
    let { startTime, endTime } = req.body;
    const date = new Date(req.params.date);

    // Validate and round times to nearest half hour
    if (startTime && endTime) {
      // Parse the times
      let start = new Date(startTime);
      let end = new Date(endTime);

      // Round minutes to nearest 30
      const startMinutes = start.getMinutes();
      const endMinutes = end.getMinutes();

      // Round start time
      if (startMinutes > 0 && startMinutes < 30) {
        start = setMinutes(start, 30);
      } else if (startMinutes > 30) {
        start = setMinutes(start, 0);
        start.setHours(start.getHours() + 1);
      }

      // Round end time
      if (endMinutes > 0 && endMinutes < 30) {
        end = setMinutes(end, 30);
      } else if (endMinutes > 30) {
        end = setMinutes(end, 0);
        end.setHours(end.getHours() + 1);
      }

      startTime = start;
      endTime = end;
    }

    let availability = await BarberAvailability.findOne({
      adminId: req.user.id,
    });

    if (!availability) {
      availability = new BarberAvailability({
        adminId: req.user.id,
        currentMonth: {
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          isSet: true,
        },
        schedule: [
          {
            date: date,
            isWorkingDay: startTime && endTime ? true : false,
            workHours:
              startTime && endTime ? { start: startTime, end: endTime } : null,
            timeSlots:
              startTime && endTime ? generateTimeSlots(startTime, endTime) : [],
          },
        ],
      });
    } else {
      const dayIndex = availability.schedule.findIndex(
        (day) =>
          format(new Date(day.date), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
      );

      if (dayIndex === -1) {
        availability.schedule.push({
          date: date,
          isWorkingDay: startTime && endTime ? true : false,
          workHours:
            startTime && endTime ? { start: startTime, end: endTime } : null,
          timeSlots:
            startTime && endTime ? generateTimeSlots(startTime, endTime) : [],
        });
      } else {
        if (!startTime || !endTime) {
          availability.schedule[dayIndex].isWorkingDay = false;
          availability.schedule[dayIndex].workHours = null;
          availability.schedule[dayIndex].timeSlots = [];
        } else {
          availability.schedule[dayIndex].isWorkingDay = true;
          availability.schedule[dayIndex].workHours = {
            start: startTime,
            end: endTime,
          };
          availability.schedule[dayIndex].timeSlots = generateTimeSlots(
            startTime,
            endTime
          );
        }
      }
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
