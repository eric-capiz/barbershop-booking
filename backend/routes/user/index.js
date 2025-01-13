const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Public routes
router.use("/reviews", require("./reviews"));

// Protected user routes
router.use(auth);
router.use("/profile", require("./profile"));
router.use("/appointments", require("./appointments"));

module.exports = router;
