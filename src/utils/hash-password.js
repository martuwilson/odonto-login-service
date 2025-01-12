import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = async (password) => {
  return bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
