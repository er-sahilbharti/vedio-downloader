export default function ProgressBar({ percentage = 0, downloaded = 0, total = 0, status = 'Downloading...' }) {
  const percent = Math.min(100, Math.max(0, Number(percentage) || 0));
  const totalSize = total ? `${(total / 1024 / 1024).toFixed(2)} MB` : 'Unknown';
  const downloadedSize = downloaded ? `${(downloaded / 1024 / 1024).toFixed(2)} MB` : '0.00 MB';

  return (
    <div className="card space-y-4 p-5">
      <div className="flex items-center justify-between text-sm font-medium text-slate-700">
        <span>{status}</span>
        <span>{percent}%</span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{downloadedSize}</span>
        <span>{totalSize}</span>
      </div>
    </div>
  );
}
