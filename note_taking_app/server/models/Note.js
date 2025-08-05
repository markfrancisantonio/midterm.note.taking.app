// Note model defines the structure of notes saved by users in the database.
// Each note has a title, content, and is linked to a specific user.
// Timestamps (createdAt, updatedAt) are automatically added by Mongoose.
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String },
    content: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
