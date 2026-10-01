import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, DownloadCloud } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import DownloadButton from '../components/DownloadButton';
import FormatSelector from '../components/FormatSelector';
import Loader from '../components/Loader';
import ProgressBar from '../components/ProgressBar';
import UrlInput from '../components/UrlInput';
import VideoPreview from '../components/VideoPreview';
import { useDownloadContext } from '../context/DownloadContext';
import { getVideoInfo } from '../services/api';

export default function DownloadPage() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeUrl, setActiveUrl] = useState(location.state?.url || '');
  const {
    currentVideo,
    selectedFormat,
    setVideo,
    setFormat,
    downloadStatus,
    downloadProgress,
    downloadError,
    fileUrl,
    startDownload,
    refreshHistory,
  } = useDownloadContext();

  const fetchVideoInfo = async (url) => {
    if (!url) return;
    setLoading(true);
    setError('');

    try {
      const response = await getVideoInfo(url);
      const videoData = response.data.data;
      const normalizedVideo = {
        ...videoData,
        url,
      };
      setVideo(normalizedVideo);
      if (videoData.formats?.length) {
        setFormat(videoData.formats[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to fetch video information.');
      setVideo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeUrl) {
      fetchVideoInfo(activeUrl);
    }
  }, [activeUrl]);

  const handleUrlSubmit = (url) => {
    setActiveUrl(url);
  };

  const handleDownload = async () => {
    if (!currentVideo || !selectedFormat) {
      setError('Choose a valid video and format before downloading.');
      return;
    }

    try {
      await startDownload({ url: currentVideo.url, formatId: selectedFormat.id });
      await refreshHistory();
    } catch {
      setError('Unable to start this download.');
    }
  };

  const progressData = useMemo(
    () => ({
      percentage: downloadProgress,
      downloaded: (downloadProgress / 100) * 60,
      total: 60,
      status: downloadStatus === 'processing' ? 'Downloading...' : downloadStatus,
    }),
    [downloadProgress, downloadStatus]
  );

  return (
    <div className="page-shell">
      <div className="mb-6 flex items-center gap-3 text-slate-900">
        <DownloadCloud size={24} className="text-blue-600" />
        <h1 className="text-3xl font-bold">Download Center</h1>
      </div>

      <div className="card p-5 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">1. URL</h2>
        <UrlInput onSubmit={handleUrlSubmit} loading={loading} compact />
        {error ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            <AlertTriangle size={16} />
            {error}
          </div>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">2. Video metadata</h2>
            {loading ? <Loader label="Fetching video metadata..." /> : <VideoPreview video={currentVideo} />}
          </div>

          <div className="card p-5">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">3. Format selector</h2>
            <FormatSelector formats={currentVideo?.formats || []} selectedFormat={selectedFormat} onSelect={setFormat} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">4. Download</h2>
            <DownloadButton
              status={downloadStatus}
              onClick={handleDownload}
              disabled={!currentVideo || !selectedFormat || loading || downloadStatus === 'processing'}
              fileUrl={downloadStatus === 'completed' ? fileUrl : ''}
            />
          </div>

          <div className="card p-5">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">5. Progress</h2>
            {downloadStatus === 'idle' ? <p className="text-sm text-slate-500">No active download.</p> : <ProgressBar {...progressData} />}
          </div>

          {downloadError ? (
            <div className="card border-red-200 bg-red-50 p-5 text-sm text-red-700">
              {downloadError}
            </div>
          ) : null}

          {downloadStatus === 'completed' ? (
            <div className="card border-green-200 bg-green-50 p-5 text-green-800">
              <p className="text-lg font-semibold">Your file is ready.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
