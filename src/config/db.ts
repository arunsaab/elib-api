import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    if (!config.mongo_connection_url) {
      throw new Error("MongoDB connection URL is missing!");
    }

    // Move event listeners outside the try block
    mongoose.connection.on("connected", () => {
      console.log("✅ Connected successfully to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    await mongoose.connect(config.mongo_connection_url);
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
