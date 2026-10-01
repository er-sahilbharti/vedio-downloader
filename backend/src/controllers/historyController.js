import { getHistory, deleteHistory } from '../services/downloadService.js';

export async function getHistoryController(req, res, next) {
  try {
    const userId = req.headers['x-anonymous-session'] || 'anonymous';
    const history = await getHistory(userId);
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
}

export async function deleteHistoryController(req, res, next) {
  try {
    const userId = req.headers['x-anonymous-session'] || 'anonymous';
    const isDeleted = await deleteHistory(req.params.id, userId);
    if (!isDeleted) {
      return res.status(404).json({ success: false, message: 'History record not found.', code: 'DOWNLOAD_FAILED' });
    }

    res.json({ success: true, message: 'History item deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
