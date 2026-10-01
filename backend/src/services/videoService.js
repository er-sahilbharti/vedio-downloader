import axios from 'axios';
import { validateUrl, detectSource } from '../utils/urlValidator.js';

const supportedVideoExtensions = ['.mp4', '.webm', '.m4v', '.mov', '.mkv', '.avi', '.wmv'];

function getBaseTitle(url) {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.split('/').filter(Boolean).pop() || 'video';
    return decodeURIComponent(pathname.replace(/\.[a-z0-9]+$/i, '') || 'video');
  } catch {
    return 'Video';
  }
}

export async function getVideoInfo(url) {
  const parsedUrl = validateUrl(url);
  const source = detectSource(url);
  const lowerPath = parsedUrl.pathname.toLowerCase();
  const isDirectVideo = supportedVideoExtensions.some((extension) => lowerPath.endsWith(extension));

  if (source === 'youtube' || source === 'vimeo' || source === 'dropbox') {
    throw Object.assign(new Error('This source does not provide an authorized download method.'), {
      code: 'DOWNLOAD_NOT_SUPPORTED',
      statusCode: 400,
    });
  }

  if (!isDirectVideo && !lowerPath.includes('video') && !lowerPath.includes('download')) {
    throw Object.assign(new Error('This source is not a supported authorized video URL.'), {
      code: 'UNSUPPORTED_SOURCE',
      statusCode: 400,
    });
  }

  const response = await axios.head(parsedUrl.toString(), { timeout: 8000, maxRedirects: 5 });
  const contentType = response.headers['content-type'] || 'application/octet-stream';
  const contentLength = Number(response.headers['content-length'] || 0) || undefined;

  const extension = supportedVideoExtensions.find((ext) => lowerPath.endsWith(ext)) || '.mp4';

  return {
    title: getBaseTitle(url),
    thumbnail: null,
    duration: null,
    source: parsedUrl.hostname,
    uploader: null,
    formats: [
      {
        id: `direct-${extension.replace('.', '')}`,
        label: 'MP4',
        quality: 'Original',
        resolution: 'Original',
        extension: extension.replace('.', ''),
        mimeType: contentType,
        fileSize: contentLength || null,
      },
    ],
  };
}
