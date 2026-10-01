import express from 'express';
import { startDownloadController, getDownloadStatusController, downloadFileController } from '../controllers/downloadController.js';
import { validateDownloadRequest } from '../middleware/validateRequest.js';
import { downloadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', downloadLimiter, validateDownloadRequest, startDownloadController);
router.get('/status/:id', getDownloadStatusController);
router.get('/file/:id', downloadFileController);

export default router;
