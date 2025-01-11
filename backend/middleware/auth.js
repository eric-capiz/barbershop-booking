const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Get token from header
  const bearerHeader = req.header("Authorization");

  // Debug logging
  console.log("Authorization Header:", bearerHeader);

  // Check if no bearer header
  if (!bearerHeader) {
    console.log("No Authorization header found");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Get token from Bearer
    const token = bearerHeader.split(" ")[1];
    console.log("Extracted Token:", token ? "exists" : "missing");

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded User:", decoded.user);

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};
