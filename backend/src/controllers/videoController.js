import { getVideoInfo } from '../services/videoService.js';

export async function getVideoInfoController(req, res, next) {
  try {
    const { url } = req.body;
    const data = await getVideoInfo(url);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
