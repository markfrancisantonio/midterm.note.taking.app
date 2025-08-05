// Routes for user signup, login, logout, and profile management
// Some routes require the user to be authenticated (logged in)
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserProfile,
} from "../controllers/userControllers.js";

import { ensureAuthenticated } from "../middleware/authMiddleware.js";

export const router = express.Router();

// Public routes: register and login do not require authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
// Protected routes: require user to be logged in
router.get("/logout", ensureAuthenticated, logoutUser);
router.get("/me", ensureAuthenticated, getCurrentUser);
router.put("/me", ensureAuthenticated, updateUserProfile);
