import express from 'express';
import { getHistoryController, deleteHistoryController } from '../controllers/historyController.js';

const router = express.Router();

router.get('/', getHistoryController);
router.delete('/:id', deleteHistoryController);

export default router;
