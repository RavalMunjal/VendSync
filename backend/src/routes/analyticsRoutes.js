import express from 'express';
import { getDashboardAnalytics, getVendorPerformanceAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'manager', 'procurement_officer'));

router.get('/dashboard', getDashboardAnalytics);
router.get('/vendors', getVendorPerformanceAnalytics);

export default router;
