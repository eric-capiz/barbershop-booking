const mongoose = require("mongoose");

const BusinessHoursSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    weeklyHours: {
      monday: {
        isOpen: { type: Boolean, default: true },
        open: { type: String, default: "09:00" },
        close: { type: String, default: "17:00" },
      },
      tuesday: {
        isOpen: { type: Boolean, default: true },
        open: { type: String, default: "09:00" },
        close: { type: String, default: "17:00" },
      },
      wednesday: {
        isOpen: { type: Boolean, default: true },
        open: { type: String, default: "09:00" },
        close: { type: String, default: "17:00" },
      },
      thursday: {
        isOpen: { type: Boolean, default: true },
        open: { type: String, default: "09:00" },
        close: { type: String, default: "17:00" },
      },
      friday: {
        isOpen: { type: Boolean, default: true },
        open: { type: String, default: "09:00" },
        close: { type: String, default: "17:00" },
      },
      saturday: {
        isOpen: { type: Boolean, default: true },
        open: { type: String, default: "09:00" },
        close: { type: String, default: "17:00" },
      },
      sunday: {
        isOpen: { type: Boolean, default: false },
        open: { type: String, default: "00:00" },
        close: { type: String, default: "00:00" },
      },
    },
    holidays: [
      {
        date: {
          type: Date,
          required: true,
        },
        description: {
          type: String,
        },
      },
    ],
    isShopOpen: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusinessHours", BusinessHoursSchema);
