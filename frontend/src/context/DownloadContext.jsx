import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useDownload } from '../hooks/useDownload';
import { getHistory } from '../services/api';

const DownloadContext = createContext();

export function DownloadProvider({ children }) {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const {
    downloadId,
    status,
    progress,
    fileUrl,
    error,
    startDownload,
    resetDownload,
    trackProgress,
    handleSuccess,
    handleError,
  } = useDownload();

  const refreshHistory = async () => {
    try {
      const response = await getHistory();
      setDownloadHistory(response.data.data || []);
    } catch {
      setDownloadHistory([]);
    }
  };

  useEffect(() => {
    refreshHistory();
  }, []);

  const value = useMemo(
    () => ({
      currentVideo,
      selectedFormat,
      downloadStatus: status,
      downloadProgress: progress,
      downloadError: error,
      downloadHistory,
      downloadId,
      fileUrl,
      setVideo: setCurrentVideo,
      setFormat: setSelectedFormat,
      startDownload,
      resetDownload,
      refreshHistory,
      trackProgress,
      handleSuccess,
      handleError,
    }),
    [currentVideo, selectedFormat, status, progress, error, downloadHistory, downloadId, fileUrl, startDownload, resetDownload, trackProgress, handleSuccess, handleError]
  );

  return <DownloadContext.Provider value={value}>{children}</DownloadContext.Provider>;
}

export function useDownloadContext() {
  return useContext(DownloadContext);
}
