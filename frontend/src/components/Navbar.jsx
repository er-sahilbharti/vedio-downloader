import { Link, NavLink } from 'react-router-dom';
import { DownloadCloud } from 'lucide-react';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Download', to: '/download' },
  { label: 'History', to: '/history' },
  { label: 'About', to: '/about' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-bold text-slate-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
            <DownloadCloud size={20} />
          </span>
          StreamSafe
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/download" className="btn-primary text-sm">
          Download Now
        </Link>
      </div>
    </header>
  );
}
