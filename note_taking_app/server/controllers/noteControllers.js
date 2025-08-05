import Note from "../models/Note.js";

// Get all notes that belong to the logged-in user
export const getAllUserNotes = async (req, res) => {
  try {
    console.log("Fetching notes for user:", req.user._id); // remove after testing
    const notes = await Note.find({ user: req.user._id });
    console.log(`Found ${notes.length} notes for user ${req.user._id}`); //remove after testing
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get one specific note by its ID, only if it belongs to the logged-in user
export const getUserNotesById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new note for the logged-in user
export const addNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const newNote = new Note({
      title,
      content,
      user: req.user._id,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an existing note by ID, only if it belongs to the logged-in user
export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (title) note.title = title;
    if (content) note.content = content;

    await note.save();

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found" });

    await Note.deleteOne({ _id: req.params.id });

    res.json({ message: "Note deleted" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
