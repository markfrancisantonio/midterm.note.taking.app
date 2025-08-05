import express from "express";
// Import controller functions that handle the actual logic for notes
import {
  getAllUserNotes,
  getUserNotesById,
  addNote,
  updateNote,
  deleteNote,
} from "../controllers/noteControllers.js";

// Middleware to protect routes: only allow authenticated users
import { ensureAuthenticated } from "../middleware/authMiddleware.js";

// Create a new router instance to define note-related routes
export const router = express.Router();

// Note-related API routes
// All routes require user authentication
router.get("/", ensureAuthenticated, getAllUserNotes);
router.get("/:id", ensureAuthenticated, getUserNotesById);
router.post("/", ensureAuthenticated, addNote);
router.put("/:id", ensureAuthenticated, updateNote);
router.delete("/:id", ensureAuthenticated, deleteNote);
