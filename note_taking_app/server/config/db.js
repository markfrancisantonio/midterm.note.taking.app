import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
// Connect to MongoDB using URI from environment or fallback to local DB

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
