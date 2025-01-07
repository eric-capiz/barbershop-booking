const mongoose = require("mongoose");

const GalleryItemSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
    },
    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    tags: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GalleryItem", GalleryItemSchema);
