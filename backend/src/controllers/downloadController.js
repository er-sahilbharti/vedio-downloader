import { startDownload, getDownloadStatus, getDownloadFile, buildDownloadFilename } from '../services/downloadService.js';

export async function startDownloadController(req, res, next) {
  try {
    const { url, formatId } = req.body;
    const userId = req.headers['x-anonymous-session'] || 'anonymous';
    const result = await startDownload({ url, formatId, userId });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getDownloadStatusController(req, res, next) {
  try {
    const { id } = req.params;
    const record = await getDownloadStatus(id);
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
}

export async function downloadFileController(req, res, next) {
  try {
    const { id } = req.params;
    const record = await getDownloadFile(id);
    const filename = buildDownloadFilename(record);
    res.download(record.filePath, filename);
  } catch (error) {
    next(error);
  }
}
