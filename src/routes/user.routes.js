import express from 'express';
import { registerUser, createTable } from '../controllers/users.controller.js';

const router = express.Router();

router.post('/create-table', createTable);

router.post('/register', registerUser);

export default router;
