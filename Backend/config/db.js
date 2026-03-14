require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    console.log("Mongo URI inside DB file:", uri);

    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;