require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const { errorResponse } = require('./utils/response');

const app = express();   // ✅ CREATE APP FIRST

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        origin.includes("localhost") ||
        origin.includes("vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    },
    credentials: true
  })
);