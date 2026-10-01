import { useCallback, useEffect, useRef, useState } from 'react';
import { getDownloadStatus, startDownload as startApiDownload } from '../services/api';

const initialState = {
  downloadId: null,
  status: 'idle',
  progress: 0,
  fileUrl: '',
  error: null,
};

export function useDownload() {
  const [state, setState] = useState(initialState);
  const timerRef = useRef(null);

  const trackProgress = useCallback(async () => {
    if (!state.downloadId) return;

    try {
      const response = await getDownloadStatus(state.downloadId);
      const download = response.data.data;
      const progressValue = Number(download.progress || 0);
      const status = download.status || 'processing';

      setState((current) => ({
        ...current,
        status,
        progress: progressValue,
        error: download.errorMessage || null,
      }));

      if (status === 'completed') {
        setState((current) => ({
          ...current,
          fileUrl: `/api/download/file/${current.downloadId}`,
          status: 'completed',
        }));
        if (timerRef.current) clearInterval(timerRef.current);
      } else if (status === 'failed' || status === 'expired') {
        setState((current) => ({
          ...current,
          error: download.errorMessage || 'The download failed.',
          status: 'failed',
        }));
        if (timerRef.current) clearInterval(timerRef.current);
      }
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error.response?.data?.message || 'Unable to track the download progress.',
        status: 'failed',
      }));
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [state.downloadId]);

  const handleSuccess = useCallback(() => {
    setState((current) => ({
      ...current,
      status: 'completed',
      progress: 100,
      error: null,
      fileUrl: current.downloadId ? `/api/download/file/${current.downloadId}` : '',
    }));
  }, []);

  const handleError = useCallback((message) => {
    setState((current) => ({
      ...current,
      status: 'failed',
      error: message,
    }));
  }, []);

  const resetDownload = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState(initialState);
  }, []);

  const startDownload = useCallback(
    async ({ url, formatId }) => {
      try {
        setState((current) => ({
          ...current,
          status: 'preparing',
          progress: 5,
          error: null,
        }));

        const response = await startApiDownload({ url, formatId });
        const downloadId = response.data.downloadId;

        setState((current) => ({
          ...current,
          downloadId,
          status: 'processing',
          progress: 10,
        }));

        timerRef.current = setInterval(() => {
          trackProgress();
        }, 1500);

        return { downloadId };
      } catch (error) {
        const message = error.response?.data?.message || 'Unable to start the download.';
        handleError(message);
        throw error;
      }
    },
    [handleError, trackProgress]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    downloadId: state.downloadId,
    status: state.status,
    progress: state.progress,
    fileUrl: state.fileUrl,
    error: state.error,
    startDownload,
    trackProgress,
    handleSuccess,
    handleError,
    resetDownload,
  };
}
