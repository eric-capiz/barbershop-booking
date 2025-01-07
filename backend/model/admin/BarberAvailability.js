const mongoose = require("mongoose");

const BarberAvailabilitySchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    schedule: [
      {
        date: {
          type: Date,
          required: true,
        },
        timeSlots: [
          {
            startTime: {
              type: Date,
              required: true,
            },
            endTime: {
              type: Date,
              required: true,
            },
            isBooked: {
              type: Boolean,
              default: false,
            },
            appointmentId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Appointment",
              default: null,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BarberAvailability", BarberAvailabilitySchema);
