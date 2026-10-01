import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const tempRoot = path.resolve('temp');

if (!fs.existsSync(tempRoot)) {
  fs.mkdirSync(tempRoot, { recursive: true });
}

export function createTempFilePath(originalName = 'download.bin') {
  const cleanName = sanitizeFilename(originalName);
  const extension = path.extname(cleanName) || '.bin';
  const randomName = `${uuidv4()}${extension}`;
  return path.join(tempRoot, randomName);
}

export function deleteTempFile(filePath) {
  if (!filePath) return false;
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function fileExists(filePath) {
  if (!filePath) return false;
  return fs.existsSync(filePath);
}

export function getFileSize(filePath) {
  if (!fileExists(filePath)) return 0;
  const stats = fs.statSync(filePath);
  return stats.size;
}

export function sanitizeFilename(filename = 'download.bin') {
  const safe = String(filename)
    .replace(/[\\/]+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^\.+/, '')
    .trim();

  if (!safe || safe === '.' || safe === '..') {
    return 'download.bin';
  }

  const extension = path.extname(safe).toLowerCase();
  const disallowedExtensions = ['.exe', '.bat', '.cmd', '.com', '.scr', '.ps1', '.js', '.jar'];

  if (disallowedExtensions.includes(extension)) {
    return 'download.bin';
  }

  return safe;
}
