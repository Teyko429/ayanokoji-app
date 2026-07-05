import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat';
import exerciseRoutes from './routes/exercises';
import userRoutes from './routes/user';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes);
app.use('/api', exerciseRoutes);
app.use('/api', userRoutes);

app.listen(PORT, () => {
  console.log(`Ayanokoji backend running on http://localhost:${PORT}`);
});