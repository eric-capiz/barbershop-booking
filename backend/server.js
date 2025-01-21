const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const appointmentRoutes = require("./routes/appointment/appointment");
const availabilityRoutes = require("./routes/appointment/availability");
const reviewRoutes = require("./routes/user/reviews");
const path = require("path");
require("dotenv").config();

const app = express();

// Add detailed logging middleware before other middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  console.log("Origin:", req.headers.origin);
  next();
});

// CORS configuration
const allowedOrigins = [
  "https://sanchez-barbershop.vercel.app",
  "https://barbershop-wcjp.vercel.app",
  "http://localhost:5173", //  local development
  "http://localhost:3000", //  local development
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Request origin:", origin);
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        console.log("CORS blocked for origin:", origin);
        return callback(new Error(msg), false);
      }
      console.log("CORS allowed for origin:", origin);
      return callback(null, true);
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Sanchez Barbershop API is up and running!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/user/reviews", reviewRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Handle React routing, return all requests to React app
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Add error handling with more details
app.use((err, req, res, next) => {
  console.error("Error details:");
  console.error(err);
  console.error("Stack trace:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Add a catch-all route at the end to log unmatched routes
app.use("*", (req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: "Route not found",
    requestedPath: req.originalUrl,
    method: req.method,
  });
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
