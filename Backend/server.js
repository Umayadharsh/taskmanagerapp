require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const { errorResponse } = require('./utils/response');

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://taskmanagerapp-frontendapp.netlify.app"
    ],
    credentials: true
  })
);
/* ───────────────── SECURITY MIDDLEWARE ───────────────── */

app.use(helmet());

/* ───────────────── CORS CONFIGURATION ───────────────── */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://taskmanagerapp-frontendapp.netlify.app"
    ],
    credentials: true
  })
);

// Handle preflight requests
app.options(/.*/, cors());

/* ───────────────── RATE LIMITING ───────────────── */

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many authentication attempts. Try again later."
  }
});

app.use(generalLimiter);

/* ───────────────── BODY PARSER ───────────────── */

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ───────────────── LOGGING ───────────────── */

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

/* ───────────────── HEALTH CHECK ───────────────── */

app.get("/", (req, res) => {
  res.send("🚀 Task Manager API is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Task Manager API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

/* ───────────────── ROUTES ───────────────── */

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/tasks", taskRoutes);

/* ───────────────── 404 HANDLER ───────────────── */

app.use((req, res) => {
  return errorResponse(res, 404, `Route ${req.method} ${req.originalUrl} not found.`);
});

/* ───────────────── GLOBAL ERROR HANDLER ───────────────── */

app.use((err, req, res, next) => {

  console.error("Unhandled error:", err);

  if (err.message && err.message.startsWith("CORS")) {
    return errorResponse(res, 403, err.message);
  }

  if (err.name === "CastError") {
    return errorResponse(res, 400, "Invalid ID format.");
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, 409, `${field} already exists.`);
  }

  return errorResponse(
    res,
    err.status || 500,
    process.env.NODE_ENV === "production"
      ? "Something went wrong."
      : err.message
  );
});

/* ───────────────── DATABASE + SERVER ───────────────── */

const PORT = process.env.PORT || 5000;

const startServer = async () => {

  try {

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
    });

  } catch (err) {

    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);

  }
};

/* ───────────────── HANDLE PROMISE ERRORS ───────────────── */

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
  process.exit(1);
});

startServer();

module.exports = app;