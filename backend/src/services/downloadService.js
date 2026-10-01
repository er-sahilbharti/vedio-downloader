import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Download from '../models/Download.js';
import { getVideoInfo } from './videoService.js';
import { createTempFilePath, deleteTempFile, fileExists, getFileSize, sanitizeFilename } from '../utils/fileManager.js';
import { env } from '../config/env.js';

const MAX_FILE_SIZE = (env.maxFileSizeMb || 500) * 1024 * 1024;

export async function startDownload({ url, formatId, userId = 'anonymous' }) {
  const metadata = await getVideoInfo(url);
  const selectedFormat = metadata.formats.find((format) => format.id === formatId);

  if (!selectedFormat) {
    throw Object.assign(new Error('The selected format is not available for this video.'), {
      code: 'FORMAT_NOT_AVAILABLE',
      statusCode: 400,
    });
  }

  const downloadId = uuidv4();
  const filePath = createTempFilePath(`${metadata.title || 'download'}.${selectedFormat.extension || 'mp4'}`);

  const record = await Download.create({
    userId,
    downloadId,
    sourceUrl: url,
    source: metadata.source,
    title: metadata.title,
    thumbnail: metadata.thumbnail || null,
    format: selectedFormat.label || 'MP4',
    quality: selectedFormat.quality || 'Original',
    fileSize: 0,
    filePath,
    status: 'pending',
    progress: 0,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
  });

  processDownload(record._id, url, filePath, selectedFormat).catch((error) => {
    Download.findByIdAndUpdate(record._id, {
      status: 'failed',
      progress: 0,
      errorMessage: error.message,
      completedAt: new Date(),
    }).catch(() => undefined);
  });

  return { success: true, downloadId: record.downloadId, status: record.status };
}

async function processDownload(recordId, url, filePath, selectedFormat) {
  const response = await axios({
    method: 'get',
    url,
    responseType: 'stream',
    timeout: 20000,
    maxContentLength: MAX_FILE_SIZE,
  });

  await Download.findByIdAndUpdate(recordId, { status: 'processing', progress: 5 });

  const totalSize = Number(response.headers['content-length'] || 0);
  const writer = fs.createWriteStream(filePath);

  let downloaded = 0;
  response.data.on('data', (chunk) => {
    downloaded += chunk.length;
    const progress = totalSize ? Math.min(100, Math.round((downloaded / totalSize) * 100)) : 50;
    Download.findByIdAndUpdate(recordId, {
      progress,
      status: progress >= 100 ? 'completed' : 'processing',
      fileSize: downloaded,
    }).catch(() => undefined);
  });

  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
    response.data.on('error', reject);
  });

  const finalSize = getFileSize(filePath);
  const result = await Download.findByIdAndUpdate(recordId, {
    status: 'completed',
    progress: 100,
    fileSize: finalSize,
    completedAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
  }, { new: true });

  return result;
}

export async function getDownloadStatus(downloadId) {
  const record = await Download.findOne({ downloadId });
  if (!record) {
    throw Object.assign(new Error('Download record not found.'), { code: 'DOWNLOAD_FAILED', statusCode: 404 });
  }

  return record;
}

export async function getDownloadFile(downloadId) {
  const record = await Download.findOne({ downloadId });
  if (!record) {
    throw Object.assign(new Error('Download record not found.'), { code: 'DOWNLOAD_FAILED', statusCode: 404 });
  }

  if (record.status === 'expired' || record.expiresAt <= new Date()) {
    if (record.filePath && fileExists(record.filePath)) deleteTempFile(record.filePath);
    record.status = 'expired';
    await record.save();
    throw Object.assign(new Error('This download has expired.'), { code: 'FILE_EXPIRED', statusCode: 410 });
  }

  if (!record.filePath || !fileExists(record.filePath)) {
    throw Object.assign(new Error('The file is no longer available.'), { code: 'DOWNLOAD_FAILED', statusCode: 404 });
  }

  return record;
}

export async function getHistory(userId = 'anonymous') {
  return Download.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function deleteHistory(downloadId, userId) {
  const isRemoved = await Download.findOneAndDelete({ downloadId, userId });
  if (isRemoved?.filePath && fileExists(isRemoved.filePath)) deleteTempFile(isRemoved.filePath);
  return !!isRemoved;
}

export function buildDownloadFilename(record) {
  const fallback = sanitizeFilename(`${record.title || 'download'}.${record.format ? record.format.toLowerCase() : 'mp4'}`);
  return fallback;
}
