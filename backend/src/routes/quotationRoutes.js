import express from 'express';
import { body } from 'express-validator';
import { 
  getQuotations, submitQuotation, getQuotationById, withdrawQuotation
} from '../controllers/quotationController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/', getQuotations);

router.post('/', authorize('vendor'), [
  body('rfq', 'RFQ ID is required').notEmpty(),
  body('items', 'Items are required').isArray({ min: 1 }),
  body('deliveryDays', 'Delivery days is required').isNumeric(),
  validateRequest
], submitQuotation);

router.get('/:id', getQuotationById);

router.put('/:id/withdraw', authorize('vendor'), withdrawQuotation);

export default router;
