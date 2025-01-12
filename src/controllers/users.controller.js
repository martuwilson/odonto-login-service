import Joi from 'joi';
import { createUser, getUserByEmail } from '../models/userModel.js';
import { hashPassword, comparePasswords } from '../utils/hash-password.js';

// Validación de usuario
const userSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  user_role: Joi.string().valid('viewer', 'admin').optional(),
});

export const registerUser = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password, ...rest } = req.body;

    // Verifica si el email ya existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'Email ya registrado.' });

    // Hashea la contraseña y crea el usuario
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser({ ...rest, email, password: hashedPassword });

    res.status(201).json({ message: 'Usuario registrado exitosamente.', user: newUser });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
