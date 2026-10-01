import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const generalLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.generalRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' },
});

export const videoInfoLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.videoInfoRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Video info requests are rate limited.', code: 'RATE_LIMITED' },
});

export const downloadLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.downloadRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Downloads are rate limited. Please wait before trying again.', code: 'RATE_LIMITED' },
});
