import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, changePassword, forgotPassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  validateRequest
], register);

router.post('/login', authLimiter, [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists(),
  validateRequest
], login);

router.get('/me', protect, getMe);

router.put('/change-password', protect, [
  body('currentPassword', 'Current password is required').exists(),
  body('newPassword', 'New password must be 6 or more characters').isLength({ min: 6 }),
  validateRequest
], changePassword);

router.post('/forgot-password', authLimiter, [
  body('email', 'Please include a valid email').isEmail(),
  validateRequest
], forgotPassword);

export default router;
