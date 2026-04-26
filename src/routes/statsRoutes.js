import express from 'express';
import { GlobalController } from '../controllers/globalController.js';

const router = express.Router();

router.get('/stats', GlobalController.getStats);

export default router;