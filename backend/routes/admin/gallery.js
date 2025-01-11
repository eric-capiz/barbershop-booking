const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const upload = require("../../cloudinary/CloudinaryMiddleware");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../cloudinary/cloudinaryUtils");

const GalleryItem = require("../../model/admin/GalleryItem");

// @route   GET /api/admin/gallery
// @desc    Get all gallery items
// @access  Public
router.get("/", async (req, res) => {
  try {
    const gallery = await GalleryItem.find({ isActive: true }).populate(
      "serviceType",
      "name"
    ); // Populate service name
    res.json(gallery);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Apply auth middleware for protected routes
router.use(auth);
router.use(isAdmin);

// @route   POST /api/admin/gallery
// @desc    Add gallery items (up to 5 images)
// @access  Private/Admin
router.post("/", upload.single("images"), async (req, res) => {
  try {
    // Debug auth
    console.log("Auth Header:", req.headers.authorization);
    console.log("User from token:", req.user);

    const { description, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    // Debug request
    console.log("Received file:", req.file);
    console.log("Received body:", req.body);
    console.log("User ID:", req.user.id); // Changed from req.user._id to req.user.id

    try {
      const result = await uploadToCloudinary(req.file, "gallery");

      // Create new gallery item
      const newItem = new GalleryItem({
        adminId: req.user.id, // Changed from req.user._id to req.user.id
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
        description,
        tags: tags ? JSON.parse(tags) : [],
        isActive: true,
      });

      const savedItem = await newItem.save();
      await savedItem.populate("adminId", "name email");

      res.json(savedItem);
    } catch (error) {
      console.error("Inner error:", error);
      res.status(500).json({
        message: "Failed to save gallery item",
        error: error.message,
        stack: error.stack,
      });
    }
  } catch (err) {
    console.error("Outer error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
      stack: err.stack,
    });
  }
});

// @route   PUT /api/admin/gallery/:id
// @desc    Update a gallery item
// @access  Private/Admin
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { description, serviceType, tags, isActive } = req.body;

    let galleryItem = await GalleryItem.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    if (galleryItem.adminId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // If new image is uploaded, update it
    if (req.file) {
      try {
        // Delete old image from Cloudinary
        if (galleryItem.image.publicId) {
          await deleteFromCloudinary(galleryItem.image.publicId);
        }

        // Upload new image
        const result = await uploadToCloudinary(req.file, "gallery");
        galleryItem.image = {
          url: result.secure_url,
          publicId: result.public_id,
        };
      } catch (error) {
        return res.status(400).json({
          message: "Failed to update image",
          error: error.message,
        });
      }
    }

    galleryItem.description = description || galleryItem.description;
    galleryItem.serviceType = serviceType || galleryItem.serviceType;
    galleryItem.tags = tags || galleryItem.tags;
    galleryItem.isActive =
      isActive !== undefined ? isActive : galleryItem.isActive;

    await galleryItem.save();
    await galleryItem.populate("serviceType", "name");
    res.json(galleryItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/admin/gallery/:id
// @desc    Delete a gallery item
// @access  Private/Admin
router.delete("/:id", async (req, res) => {
  try {
    const galleryItem = await GalleryItem.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    if (galleryItem.adminId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    try {
      // Delete from Cloudinary first
      if (galleryItem.image.publicId) {
        await deleteFromCloudinary(galleryItem.image.publicId);
      }
    } catch (error) {
      console.error("Cloudinary deletion failed:", error);
      // Continue with DB deletion even if Cloudinary fails
    }

    await galleryItem.deleteOne();
    res.json({ message: "Gallery item removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
