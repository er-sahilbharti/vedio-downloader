import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteHistory, getHistory } from '../services/api';

export default function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    try {
      const response = await getHistory();
      setRecords(response.data.data || []);
    } catch {
      setError('Unable to load your download history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteHistory(id);
      setRecords((current) => current.filter((item) => item.downloadId !== id));
    } catch {
      setError('Unable to delete this history item.');
    }
  };

  if (loading) {
    return <div className="page-shell"><div className="card p-5 text-slate-500">Loading download history...</div></div>;
  }

  if (error) {
    return <div className="page-shell"><div className="card border-red-200 bg-red-50 p-5 text-red-700">{error}</div></div>;
  }

  if (!records.length) {
    return (
      <div className="page-shell">
        <div className="card p-10 text-center">
          <p className="text-xl font-semibold text-slate-900">No downloads yet</p>
          <p className="mt-2 text-slate-500">Your previous authorized downloads will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Download History</h1>
      </div>

      <div className="grid gap-4">
        {records.map((item) => (
          <div key={item.downloadId} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img src={item.thumbnail || 'https://via.placeholder.com/120x70?text=Video'} alt={item.title} className="h-16 w-24 rounded-lg object-cover" />
              <div>
                <p className="text-lg font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">{item.source}</p>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2 py-1">{item.format}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">{item.quality}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">{item.status}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right text-sm text-slate-500">
                <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                <div>{item.fileSize ? `${(item.fileSize / 1024 / 1024).toFixed(2)} MB` : '—'}</div>
              </div>
              <button type="button" className="btn-secondary" onClick={() => handleDelete(item.downloadId)}>
                <Trash2 size={16} className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
