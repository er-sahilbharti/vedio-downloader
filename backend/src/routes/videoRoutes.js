import express from 'express';
import { getVideoInfoController } from '../controllers/videoController.js';
import { validateUrlRequest } from '../middleware/validateRequest.js';
import { videoInfoLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/info', videoInfoLimiter, validateUrlRequest, getVideoInfoController);

export default router;
