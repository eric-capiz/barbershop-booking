const express = require("express");
const router = express.Router();

const BarberProfile = require("../../model/admin/BarberProfile");
const Admin = require("../../model/admin/Admin");

// @route   GET /api/admin/profile
// @desc    Get admin's barber profile
// @access  Private/Admin
router.get("/", async (req, res) => {
  try {
    const profile = await BarberProfile.findOne({ adminId: req.user.id });
    const admin = await Admin.findById(req.user.id).select("-password");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json({ profile, admin });
  } catch (error) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/profile
// @desc    Update admin's barber profile
// @access  Private/Admin
router.put("/", async (req, res) => {
  try {
    const {
      // Admin fields
      name,
      email,
      username,

      // BarberProfile fields
      bio,
      specialties,
      yearsOfExperience,
      socialMedia,
    } = req.body;

    // Update Admin info
    let admin = await Admin.findById(req.user.id);

    // Check for unique fields before updating
    if (username && username !== admin.username) {
      const existingUser = await Admin.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      admin.username = username;
    }

    if (email && email !== admin.email) {
      const existingUser = await Admin.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      admin.email = email;
    }

    if (name) admin.name = name;
    await admin.save();

    // Update BarberProfile
    let profile = await BarberProfile.findOne({ adminId: req.user.id });
    if (!profile) {
      profile = new BarberProfile({
        adminId: req.user.id,
        bio,
        specialties,
        yearsOfExperience,
        socialMedia,
      });
    } else {
      if (bio) profile.bio = bio;
      if (specialties) profile.specialties = specialties;
      if (yearsOfExperience) profile.yearsOfExperience = yearsOfExperience;
      if (socialMedia) profile.socialMedia = socialMedia;
    }

    await profile.save();

    // Return both updated admin and profile info
    const updatedAdmin = await Admin.findById(req.user.id).select("-password");
    res.json({ profile, admin: updatedAdmin });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/profile/image
// @desc    Update profile image
// @access  Private/Admin
router.put("/image", async (req, res) => {
  try {
    const { url, publicId } = req.body;

    let profile = await BarberProfile.findOne({ adminId: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.profileImage = {
      url: url || profile.profileImage.url,
      publicId: publicId || profile.profileImage.publicId,
    };

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
