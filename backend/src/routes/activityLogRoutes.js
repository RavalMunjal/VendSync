import express from 'express';
import { getActivityLogs, clearActivityLogs } from '../controllers/activityLogController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // Only admins can view system logs

router.get('/', getActivityLogs);
router.delete('/clear', clearActivityLogs);

export default router;
