import express from 'express';
import { body } from 'express-validator';
import { 
  getVendors, createVendor, getVendorCategories, getVendorStats, 
  getVendorById, updateVendor, toggleVendorStatus, deleteVendor, 
  getVendorQuotations, getVendorPurchaseOrders 
} from '../controllers/vendorController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('procurement_officer', 'admin'), getVendors);
router.post('/', authorize('procurement_officer', 'admin'), [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Valid email is required').isEmail(),
  body('phone', 'Phone is required').notEmpty(),
  body('gstNumber', 'GST number is required').notEmpty(),
  body('category', 'Category is required').notEmpty(),
  validateRequest
], createVendor);

router.get('/categories/list', authorize('procurement_officer', 'admin'), getVendorCategories);
router.get('/stats/overview', authorize('admin'), getVendorStats);

router.get('/:id', authorize('procurement_officer', 'admin'), getVendorById);
router.put('/:id', authorize('procurement_officer', 'admin'), updateVendor);
router.put('/:id/toggle-status', authorize('admin'), toggleVendorStatus);
router.delete('/:id', authorize('admin'), deleteVendor);

router.get('/:id/quotations', authorize('procurement_officer', 'admin'), getVendorQuotations);
router.get('/:id/purchase-orders', authorize('procurement_officer', 'admin'), getVendorPurchaseOrders);

export default router;
