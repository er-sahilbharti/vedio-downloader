import net from 'net';

const dangerousProtocols = ['javascript:', 'data:', 'file:', 'blob:'];
const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '[::1]'];

function isPrivateAddress(ip) {
  if (!ip) return false;
  if (ip === 'localhost') return true;
  if (net.isIP(ip) === 4) {
    const parts = ip.split('.').map(Number);
    return (
      parts[0] === 10 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      parts[0] === 127 ||
      (parts[0] === 169 && parts[1] === 254) ||
      (parts[0] === 0 && parts[1] === 0 && parts[2] === 0 && parts[3] === 0)
    );
  }

  if (net.isIP(ip) === 6) {
    return ip === '::1' || ip.startsWith('fc') || ip.startsWith('fd') || ip.startsWith('fe80') || ip.startsWith('::ffff:') || ip.startsWith('::');
  }

  return false;
}

export function validateUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') {
    throw Object.assign(new Error('URL is required.'), { code: 'INVALID_URL', statusCode: 400 });
  }

  const trimmedUrl = inputUrl.trim();
  if (!trimmedUrl) {
    throw Object.assign(new Error('URL is required.'), { code: 'INVALID_URL', statusCode: 400 });
  }

  let parsed;
  try {
    parsed = new URL(trimmedUrl);
  } catch {
    throw Object.assign(new Error('Malformed URL.'), { code: 'INVALID_URL', statusCode: 400 });
  }

  const protocol = parsed.protocol.toLowerCase();
  if (!['http:', 'https:'].includes(protocol)) {
    throw Object.assign(new Error('Only http and https URLs are allowed.'), { code: 'INVALID_URL', statusCode: 400 });
  }

  if (dangerousProtocols.includes(protocol)) {
    throw Object.assign(new Error('Dangerous URL scheme is not allowed.'), { code: 'INVALID_URL', statusCode: 400 });
  }

  if (parsed.hostname.toLowerCase().includes('localhost') || blockedHosts.includes(parsed.hostname.toLowerCase())) {
    throw Object.assign(new Error('Local and internal URLs are not allowed.'), { code: 'INVALID_URL', statusCode: 400 });
  }

  const resolved = parsed.hostname;
  if (isPrivateAddress(resolved) || isPrivateAddress(parsed.hostname.replace(/\[|\]/g, ''))) {
    throw Object.assign(new Error('Private network URLs are not allowed.'), { code: 'INVALID_URL', statusCode: 400 });
  }

  if (!parsed.hostname || parsed.hostname.length < 3) {
    throw Object.assign(new Error('Invalid hostname.'), { code: 'INVALID_URL', statusCode: 400 });
  }

  return parsed;
}

export function detectSource(url) {
  const parsed = validateUrl(url);
  const hostname = parsed.hostname.toLowerCase();

  if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube';
  if (hostname.includes('vimeo.com')) return 'vimeo';
  if (hostname.includes('dropbox.com')) return 'dropbox';
  if (hostname.includes('googlevideo.com') || hostname.includes('media')) return 'direct';

  const path = parsed.pathname.toLowerCase();
  if (/\.(mp4|webm|m4v|mov|mkv|avi|wmv|flv|m3u8)(\?|$)/.test(path)) {
    return 'direct';
  }

  return 'direct';
}
