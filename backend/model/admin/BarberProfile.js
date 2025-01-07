const mongoose = require("mongoose");

const BarberProfileSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    bio: {
      type: String,
    },
    specialties: [
      {
        type: String,
      },
    ],
    yearsOfExperience: {
      type: Number,
    },
    profileImage: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    socialMedia: {
      instagram: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BarberProfile", BarberProfileSchema);
