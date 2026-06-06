import express from 'express';
import { body } from 'express-validator';
import { 
  getPurchaseOrders, createPO, getPOById, updatePOStatus 
} from '../controllers/purchaseOrderController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/', getPurchaseOrders);

router.post('/', authorize('procurement_officer', 'manager', 'admin'), [
  body('approvalId', 'Approval ID is required').notEmpty(),
  validateRequest
], createPO);

router.get('/:id', getPOById);

router.put('/:id/status', [
  body('status', 'Status is required').notEmpty(),
  validateRequest
], updatePOStatus);

export default router;
