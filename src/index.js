import dotenv from 'dotenv';
import express from 'express'; 
import pool from './database/index.js';
const app = express();
dotenv.config();
app.use(express.json());

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de gestión de stock de materiales!');
  });
  

app.use('/api/users', usersRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});