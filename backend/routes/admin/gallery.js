const express = require("express");
const router = express.Router();

const GalleryItem = require("../../model/admin/GalleryItem");

// @route   GET /api/admin/gallery
// @desc    Get all gallery items
// @access  Private/Admin
router.get("/", async (req, res) => {
  try {
    const gallery = await GalleryItem.find({ adminId: req.user.id }).populate(
      "serviceType",
      "name"
    ); // Populate service name
    res.json(gallery);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/admin/gallery
// @desc    Add a gallery item
// @access  Private/Admin
router.post("/", async (req, res) => {
  try {
    const { url, publicId, description, serviceType, tags } = req.body;

    const newItem = new GalleryItem({
      adminId: req.user.id,
      image: {
        url,
        publicId,
      },
      description,
      serviceType,
      tags,
      isActive: true,
    });

    const galleryItem = await newItem.save();

    // Populate service info before sending response
    await galleryItem.populate("serviceType", "name");
    res.json(galleryItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/gallery/:id
// @desc    Update a gallery item
// @access  Private/Admin
router.put("/:id", async (req, res) => {
  try {
    const { description, serviceType, tags, isActive } = req.body;

    let galleryItem = await GalleryItem.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    // Make sure admin owns gallery item
    if (galleryItem.adminId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
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

    // Make sure admin owns gallery item
    if (galleryItem.adminId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await galleryItem.deleteOne();
    res.json({ message: "Gallery item removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
