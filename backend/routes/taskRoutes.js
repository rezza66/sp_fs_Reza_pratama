import express from 'express';
import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus
} from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Task CRUD
router.post('/:projectId/tasks', createTask);
router.get('/:projectId/tasks', getTasksByProject);
router.get('/task/:taskId', getTaskById);
router.put('/task/:taskId', updateTask);
router.patch('/task/:taskId/status', updateTaskStatus);
router.delete('/task/:taskId', deleteTask);

export default router;
