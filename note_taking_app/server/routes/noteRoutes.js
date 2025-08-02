import express from 'express';
import {
    getAllUserNotes,
    getUserNotesById,
    addNote,
    updateNote,
    deleteNote,

} from '../controllers/noteControllers.js'

export const router = express.Router()

router.get('/', getAllUserNotes);
router.get('/:id', getUserNotesById);
router.post('/', addNote);
router.put('/:id', updateNote)
router.delete('/:id', deleteNote);