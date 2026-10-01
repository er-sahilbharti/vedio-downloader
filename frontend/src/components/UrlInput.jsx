import { useState } from 'react';
import { CheckCircle2, Clipboard, Loader2, Search, Trash2 } from 'lucide-react';

const isValidHttpUrl = (value) => {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) && !!parsed.hostname;
  } catch {
    return false;
  }
};

export default function UrlInput({ onSubmit, loading = false, compact = false }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();

    if (!trimmed) {
      setError('Please enter a video URL.');
      return;
    }

    if (!isValidHttpUrl(trimmed)) {
      setError('Please enter a valid http or https URL.');
      return;
    }

    setError('');
    onSubmit(trimmed);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue(text);
      setError('');
    } catch {
      setError('Clipboard access is unavailable.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-3' : 'space-y-4'} noValidate>
      <label htmlFor="video-url" className="sr-only">Video URL</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            id="video-url"
            type="url"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Paste your authorized video URL here..."
            className="input-field pl-11 pr-3"
            aria-invalid={!!error}
            aria-describedby={error ? 'video-url-error' : undefined}
          />
        </div>

        <button type="button" className="btn-secondary" onClick={handlePaste} aria-label="Paste URL from clipboard">
          <Clipboard size={18} className="mr-2" />
          Paste
        </button>

        <button type="button" className="btn-secondary" onClick={() => setValue('')} aria-label="Clear URL field">
          <Trash2 size={18} className="mr-2" />
          Clear
        </button>

        <button type="submit" className="btn-primary min-w-[160px]" disabled={loading} aria-live="polite">
          {loading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <CheckCircle2 size={18} className="mr-2" />
              Get Video Info
            </>
          )}
        </button>
      </div>

      {error ? (
        <p id="video-url-error" className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
