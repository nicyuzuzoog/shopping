import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-100 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
      {/* Date & Title */}
      <div>
        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
          Today
        </span>
        <h2 className="text-xs sm:text-sm font-bold text-slate-800">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notification Icon */}
        <button 
          className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-100 hidden sm:block" />

        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'User'}</p>
            <p className="text-[10px] font-semibold text-slate-400 capitalize">{user?.role || 'Staff'}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-extrabold text-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}