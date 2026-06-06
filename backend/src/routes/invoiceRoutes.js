import express from 'express';
import { body } from 'express-validator';
import { 
  getInvoices, createInvoice, getInvoiceById, sendInvoice, markInvoicePaid, downloadInvoicePDF 
} from '../controllers/invoiceController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/', getInvoices);

router.post('/', authorize('admin', 'procurement_officer'), [
  body('purchaseOrderId', 'Purchase Order ID is required').notEmpty(),
  validateRequest
], createInvoice);

router.get('/:id', getInvoiceById);

router.put('/:id/send', authorize('admin', 'procurement_officer'), sendInvoice);

router.put('/:id/pay', authorize('admin', 'procurement_officer'), markInvoicePaid);

router.get('/:id/download', downloadInvoicePDF);

export default router;
