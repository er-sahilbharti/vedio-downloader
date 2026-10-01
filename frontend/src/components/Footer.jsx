import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">StreamSafe</h3>
          <p className="text-sm text-slate-300">Authorized video downloads for content you have permission to access.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Explore</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Contact</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>support@streamsafe.example</li>
            <li>Mon-Fri 9am-5pm</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Legal</h4>
          <p className="text-sm text-slate-300">Users are responsible for having permission to download the content they submit.</p>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} StreamSafe. All rights reserved.
      </div>
    </footer>
  );
}
