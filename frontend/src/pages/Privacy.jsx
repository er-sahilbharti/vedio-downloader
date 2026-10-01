export default function PrivacyPage() {
  return (
    <div className="page-shell">
      <div className="card p-8">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-4 text-slate-600">
          This application processes only the information required to validate a submitted URL, retrieve authorized media metadata, and manage temporary download records.
        </p>
        <p className="mt-3 text-slate-600">
          We do not expose API keys or database credentials. Temporary files are stored only for the configured retention window and are removed automatically when expired. Download history is associated with an anonymous session identifier when authentication is not enabled.
        </p>
        <p className="mt-3 text-slate-600">
          Users are responsible for ensuring they have permission to download any content they submit. We do not handle or store access credentials or personal account details unless configured separately.
        </p>
      </div>
    </div>
  );
}
