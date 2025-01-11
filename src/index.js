import dotenv from 'dotenv';
import express from 'express'; 
import pool from './database/index.js';
const app = express();
dotenv.config();
app.use(express.json());
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});