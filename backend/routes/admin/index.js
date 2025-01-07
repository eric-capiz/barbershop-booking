const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");

// Apply auth and isAdmin middleware to all admin routes
router.use(auth);
router.use(isAdmin);

// Admin routes
router.use("/profile", require("./profile"));
router.use("/services", require("./services"));
router.use("/availability", require("./availability"));
router.use("/gallery", require("./gallery"));
router.use("/appointments", require("./appointments"));

module.exports = router;
