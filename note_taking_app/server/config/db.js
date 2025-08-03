//Import mongoose to connect to MongoDB
import mongoose from "mongoose";

//Function to connect to MongoDB
export const connectDB = async () => {
  try {
    // Try connecting using the URI from ENV and fallback to local MongoDB if no URI provided
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/myDatabase"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};