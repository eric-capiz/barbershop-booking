const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");

// Public routes
router.use("/profile", require("./profile"));
router.use("/services", require("./services"));
router.use("/gallery", require("./gallery"));

// Protected admin routes
router.use(auth);
router.use(isAdmin);
router.use("/availability", require("./availability"));

module.exports = router;
