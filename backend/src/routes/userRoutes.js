import express from 'express';
import { getUsers, getUserById, updateUser, toggleUserStatus, deleteUser, getUsersByRole, getUserStats } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.get('/stats/overview', getUserStats);
router.get('/role/:role', getUsersByRole);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.put('/:id/toggle-status', toggleUserStatus);
router.delete('/:id', deleteUser);

export default router;
