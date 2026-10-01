import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || '',
  tempFileRetentionMinutes: Number(process.env.TEMP_FILE_RETENTION_MINUTES || 30),
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 500),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  videoInfoRateLimit: Number(process.env.VIDEO_INFO_RATE_LIMIT || 30),
  downloadRateLimit: Number(process.env.DOWNLOAD_RATE_LIMIT || 10),
  generalRateLimit: Number(process.env.GENERAL_RATE_LIMIT || 100),
};
