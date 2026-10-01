import Download from '../models/Download.js';
import { deleteTempFile } from '../utils/fileManager.js';
import { env } from '../config/env.js';

export async function cleanupExpiredFiles() {
  const cutoff = new Date(Date.now() - env.tempFileRetentionMinutes * 60 * 1000);

  const expiredRecords = await Download.find({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { status: { $in: ['failed', 'expired'] } },
      { createdAt: { $lt: cutoff } },
    ],
  });

  for (const record of expiredRecords) {
    if (record.filePath) deleteTempFile(record.filePath);
    record.status = 'expired';
    record.expiresAt = new Date();
    await record.save();
  }

  return expiredRecords.length;
}

export function startCleanupScheduler() {
  const intervalMs = 60 * 1000;
  return setInterval(() => {
    cleanupExpiredFiles().catch(() => undefined);
  }, intervalMs);
}
