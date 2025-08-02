import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
            ref: "User",
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
        },
    },
    { timestamps: true }
);

const Note = mongoose.model ("Note", noteSchema)

export default Note;