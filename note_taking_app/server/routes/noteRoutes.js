import express from 'express';
import {
    getAllUserNotes,
    getUserNotesById,
    addNote,
    updateNote,
    deleteNote,

} from '../controllers/noteControllers.js'

import { ensureAuthenticated } from '../middleware/authMiddleware.js'

export const router = express.Router()

router.get('/', ensureAuthenticated, getAllUserNotes);
router.get('/:id', ensureAuthenticated, getUserNotesById);
router.post('/', ensureAuthenticated, addNote);
router.put('/:id', ensureAuthenticated, updateNote)
router.delete('/:id', ensureAuthenticated, deleteNote);