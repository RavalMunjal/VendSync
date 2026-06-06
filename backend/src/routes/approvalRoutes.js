import express from 'express';
import { body } from 'express-validator';
import { 
  getApprovals, requestApproval, processApproval 
} from '../controllers/approvalController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('manager', 'admin', 'procurement_officer'), getApprovals);

router.post('/request', authorize('procurement_officer', 'admin'), [
  body('quotationId', 'Quotation ID is required').notEmpty(),
  validateRequest
], requestApproval);

router.put('/:id/process', authorize('manager', 'admin'), [
  body('action', 'Action must be approved or rejected').isIn(['approved', 'rejected']),
  validateRequest
], processApproval);

export default router;
