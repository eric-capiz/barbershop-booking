const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Apply auth middleware to all user routes
router.use(auth);

// User routes
router.use("/profile", require("./profile"));
router.use("/appointments", require("./appointments"));
router.use("/reviews", require("./reviews"));

module.exports = router;
