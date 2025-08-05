import mongoose from "mongoose";

// Connect to MongoDB using URI from environment or fallback to local DB

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/myDatabase"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
