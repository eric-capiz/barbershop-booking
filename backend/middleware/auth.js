const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Get token from header
  const bearerHeader = req.header("Authorization");

  // Check if no bearer header
  if (!bearerHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Get token from Bearer
    const token = bearerHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
