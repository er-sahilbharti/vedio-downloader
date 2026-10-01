import { CheckCircle2, Download, Loader2, RefreshCw, XCircle } from 'lucide-react';

export default function DownloadButton({ status = 'idle', onClick, disabled = false, fileUrl = '' }) {
  const configMap = {
    idle: { label: 'Download', icon: Download },
    preparing: { label: 'Preparing...', icon: Loader2 },
    processing: { label: 'Processing...', icon: Loader2 },
    downloading: { label: 'Downloading...', icon: Loader2 },
    completed: { label: 'Completed', icon: CheckCircle2 },
    failed: { label: 'Failed', icon: XCircle },
  };

  const config = configMap[status] || configMap.idle;
  const Icon = config.icon;

  return (
    <div className="flex flex-col gap-3">
      <button type="button" onClick={onClick} disabled={disabled || status === 'processing' || status === 'completed'} className="btn-primary w-full disabled:opacity-60" aria-live="polite">
        <Icon className={`mr-2 ${config.label.includes('...') ? 'animate-spin' : ''}`} size={18} />
        {config.label}
      </button>

      {status === 'completed' && fileUrl ? (
        <a href={fileUrl} target="_blank" rel="noreferrer" className="btn-secondary w-full text-center">
          <RefreshCw size={18} className="mr-2" />
          Download File
        </a>
      ) : null}
    </div>
  );
}
