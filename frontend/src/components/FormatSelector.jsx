export default function FormatSelector({ formats = [], selectedFormat, onSelect }) {
  if (!formats.length) {
    return (
      <div className="card p-5 text-sm text-slate-500">
        No authorized formats are available for this video.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {formats.map((format) => {
        const isSelected = selectedFormat && selectedFormat.id === format.id;

        return (
          <button
            key={format.id}
            type="button"
            className={`card flex w-full flex-col items-start gap-2 p-4 text-left transition ${isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'hover:border-slate-300'}`}
            onClick={() => onSelect(format)}
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-lg font-semibold text-slate-900">{format.label || 'MP4'}</span>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                {format.quality || 'Original'}
              </span>
            </div>
            <div className="text-sm text-slate-600">{format.resolution || 'Original quality'}</div>
            <div className="text-xs text-slate-400">{format.fileSize ? `${(format.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Size unavailable'}</div>
          </button>
        );
      })}
    </div>
  );
}
