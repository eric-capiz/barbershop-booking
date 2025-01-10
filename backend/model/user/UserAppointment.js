const mongoose = require("mongoose");

const UserAppointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BarberProfile",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    rescheduleAttempted: {
      type: Boolean,
      default: false,
    },
    rescheduleInfo: {
      requestedBy: {
        type: String,
        enum: ["admin", "user", null],
        default: null,
      },
      proposedDate: Date,
      status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", null],
        default: null,
      },
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserAppointment", UserAppointmentSchema);
