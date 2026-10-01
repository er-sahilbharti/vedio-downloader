import { Clock3, User2, Video, Wand2 } from 'lucide-react';

export default function VideoPreview({ video, loading = false }) {
  if (loading) {
    return (
      <div className="card p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-52 w-full rounded-xl bg-slate-200" />
          <div className="h-4 w-3/4 rounded bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="card flex min-h-[220px] flex-col items-center justify-center gap-3 p-6 text-center text-slate-500">
        <Video className="h-10 w-10 text-slate-300" />
        <p className="text-lg font-medium">No video selected</p>
        <p className="text-sm">Paste a valid authorized URL to preview metadata.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[220px_1fr]">
        <div className="min-h-[180px] bg-slate-200">
          {video.thumbnail ? (
            <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600">
              <Wand2 className="h-12 w-12" />
            </div>
          )}
        </div>

        <div className="space-y-4 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">Video Info</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{video.title}</h3>
          </div>

          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 p-2 text-slate-600"><Video size={16} /></span>
              <span>{video.source || 'Direct source'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 p-2 text-slate-600"><Clock3 size={16} /></span>
              <span>{video.duration ? `${Math.round(video.duration / 60)} min` : 'Duration unavailable'}</span>
            </div>
            {video.uploader ? (
              <div className="flex items-center gap-2 sm:col-span-2">
                <span className="rounded-full bg-slate-100 p-2 text-slate-600"><User2 size={16} /></span>
                <span>{video.uploader}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
