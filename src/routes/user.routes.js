import express from 'express';
import { registerUser, createTable, updateUser } from '../controllers/users.controller.js';

const router = express.Router();

router.post('/create-table', createTable);

router.post('/register', registerUser);

router.put('/:id', updateUser);

export default router;
