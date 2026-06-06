import express from 'express';
import { body } from 'express-validator';
import { 
  getRFQs, createRFQ, getRFQById, updateRFQ, assignVendors, getRFQQuotations, closeRFQ 
} from '../controllers/rfqController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/', getRFQs);

router.post('/', authorize('procurement_officer', 'manager', 'admin'), [
  body('title', 'Title is required').notEmpty(),
  body('deadline', 'Valid deadline is required').isISO8601(),
  body('items', 'At least one item is required').isArray({ min: 1 }),
  validateRequest
], createRFQ);

router.get('/:id', getRFQById);

router.put('/:id', authorize('procurement_officer', 'manager', 'admin'), updateRFQ);

router.post('/:id/assign', authorize('procurement_officer', 'manager', 'admin'), [
  body('vendorIds', 'Vendor IDs must be an array').isArray({ min: 1 }),
  validateRequest
], assignVendors);

router.get('/:id/quotations', authorize('procurement_officer', 'manager', 'admin'), getRFQQuotations);

router.put('/:id/close', authorize('procurement_officer', 'manager', 'admin'), closeRFQ);

export default router;
