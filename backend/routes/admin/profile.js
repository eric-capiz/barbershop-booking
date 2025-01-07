const express = require("express");
const router = express.Router();

const BarberProfile = require("../../model/admin/BarberProfile");

// @route   GET /api/admin/profile
// @desc    Get admin's barber profile
// @access  Private/Admin
router.get("/", async (req, res) => {
  try {
    const profile = await BarberProfile.findOne({ adminId: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
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
    const { bio, specialties, yearsOfExperience, socialMedia } = req.body;

    let profile = await BarberProfile.findOne({ adminId: req.user.id });

    if (!profile) {
      // Create new profile
      profile = new BarberProfile({
        adminId: req.user.id,
        bio,
        specialties,
        yearsOfExperience,
        socialMedia,
      });
    } else {
      // Update existing profile
      profile.bio = bio || profile.bio;
      profile.specialties = specialties || profile.specialties;
      profile.yearsOfExperience =
        yearsOfExperience || profile.yearsOfExperience;
      profile.socialMedia = socialMedia || profile.socialMedia;
    }

    await profile.save();
    res.json(profile);
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
