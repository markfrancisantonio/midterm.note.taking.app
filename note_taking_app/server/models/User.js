// User model for MongoDB using Mongoose
// Includes password hashing with bcrypt for security
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define user schema with basic profile info and password hash
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

// Static method to create a hashed password before saving
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// Method to check if a password is correct during login
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model("User", userSchema);
export default User;
