export default function AboutPage() {
  return (
    <div className="page-shell">
      <div className="card p-8">
        <h1 className="text-3xl font-bold text-slate-900">About</h1>
        <p className="mt-4 text-slate-600">
          StreamSafe helps users manage authorized video downloads for content they own or are explicitly permitted to access. The service focuses on metadata lookup, format selection, and secure temporary download processing.
        </p>
        <p className="mt-3 text-slate-600">
          It is designed for direct media URLs and other supported sources that provide a legitimate, authorized download mechanism. It does not bypass login protections, access controls, CAPTCHA systems, or digital rights protection measures.
        </p>
      </div>
    </div>
  );
}
