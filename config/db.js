const mongoose = require("mongoose");

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

const connectDB = async (retries = MAX_RETRIES) => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tech-collage";

    if (!mongoURI || mongoURI.includes("127.0.0.1") || mongoURI.includes("localhost")) {
      if (process.env.NODE_ENV === "production") {
        console.error("ERROR: Local MongoDB URI detected in production!");
        console.error("Please set MONGODB_URI environment variable");
        process.exit(1);
      }
    }

    const conn = await mongoose.connect(mongoURI, {
      // Connection pool settings
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });

  } catch (error) {
    console.error(`MongoDB connection error (attempt ${MAX_RETRIES - retries + 1}/${MAX_RETRIES}):`, error.message);
    
    if (retries > 0) {
      console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
      setTimeout(() => {
        connectDB(retries - 1);
      }, RETRY_DELAY);
    } else {
      console.error("Failed to connect to MongoDB after all retries");
      process.exit(1);
    }
  }
};

module.exports = connectDB;


