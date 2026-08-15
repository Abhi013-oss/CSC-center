import express from 'express';
import {
  getAdminTasks,
  createTask,
  updateTaskStatus,
  getWorkQueue
} from '../controllers/taskController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/', getAdminTasks);
router.post('/', createTask);
router.patch('/:id/status', updateTaskStatus);
router.get('/work-queue', getWorkQueue);

export default router;
