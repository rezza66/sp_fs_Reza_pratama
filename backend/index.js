import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js';
import userRoutes from './routes/userRoutes.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', membershipRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);


app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});