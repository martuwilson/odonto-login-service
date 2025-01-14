import Joi from 'joi';
import { createUser, getUserByEmail, createUsersTable, updateUser } from '../models/userModel.js';
import { hashPassword, comparePasswords } from '../utils/hash-password.js';

const userSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  user_role: Joi.string().valid('viewer', 'admin').optional(),
});

export const createTable = async (req, res) => {
    try {
      await createUsersTable();
      res.status(200).json({ message: 'Tabla de usuarios creada exitosamente.' });
    } catch (error) {
      console.error('Error al crear la tabla de usuarios:', error);
      res.status(500).json({ error: 'Error al crear la tabla de usuarios.' });
    }
  };

export const registerUser = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password, ...rest } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'Email ya registrado.' });

    const hashedPassword = await hashPassword(password);
    const newUser = await createUser({ ...rest, email, password: hashedPassword });

    res.status(201).json({ message: 'Usuario registrado exitosamente.', user: newUser });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

export const updateUser = async (req, res) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(255).optional(),
    lastName: Joi.string().min(2).max(255).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(8).optional(),
    userRole: Joi.string().valid('viewer', 'admin', 'editor').optional(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { id } = req.params;

  try {
    let updatedFields = { ...value };

    if (value.password) {
      const hashedPassword = await bcrypt.hash(value.password, 10);
      updatedFields.password = hashedPassword;
    }

    const updatedUser = await updateUser(id, updatedFields);

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario actualizado exitosamente', user: updatedUser });
  } catch (err) {
    console.error('Error al actualizar el usuario:', err);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

