import Note from "../models/Note.js";

// GET /api/notes
export const getAllUserNotes = async (req, res) => {
    try {
        const notes = await Note.find ({});
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};

// GET /api/notes/:id
export const getUserNotesById = async (req,res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({message: "Note not found"});
        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};

//POST /api/notes
export const addNote = async (req,res) => {
  try {
    const { title, content } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const newNote = new Note({
      title,
      content,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/notes/:id
export const updateNote = async (req,res) => {

    try {
        const {title, content} = req.body;
    
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json ({message: "Note not found"});
    
        if (title) note.title = title;
        if (content) note.content = content;
    
        await note.save();
    
        res.json(note);     
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};

//DELETE /api/notes/:id
export const deleteNote = async (req,res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({message: "Note not found"});

        await Note.deleteOne({_id: req.params.id});

        res.json({message: "Note deleted"});
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({message: "Server error"});
    }
};
