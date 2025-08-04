import express from 'express';
import {
  inviteMember,
  getProjectMembers,
  removeMember,
} from '../controllers/membershipController.js';

import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/:projectId/invite', inviteMember);
router.get('/:projectId/members', getProjectMembers);
router.delete('/:projectId/members/:userId', removeMember);

export default router;
