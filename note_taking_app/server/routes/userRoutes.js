// POST /api/users/register   --> Register a new user
// POST /api/users/login      --> Log in a user
// GET  /api/users/logout     --> Log out the user
// GET  /api/users/me         --> Get current user info


import express from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser

} from '../controllers/userControllers.js'

import { ensureAuthenticated } from '../middleware/authMiddleware.js';

export const router = express.Router()


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', ensureAuthenticated, logoutUser)
router.get('/me', ensureAuthenticated, getCurrentUser);