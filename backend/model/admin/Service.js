const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ["haircut", "facial-hair", "eyebrows", "combo", "other"],
      default: "haircut",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
