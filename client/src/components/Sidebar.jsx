import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, Package, Users, LogOut, Menu, X, ClipboardList } from 'lucide-react';
import logo from '../assets/logo.png';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { to: '/pos', label: 'Point of Sale', icon: ShoppingCart, adminOnly: false },
  { to: '/inventory', label: 'Inventory', icon: Package, adminOnly: true },
  { to: '/manage-users', label: 'Manage Users', icon: Users, adminOnly: true },
  { to: '/clients-report', label: 'Clients Report', icon: ClipboardList, adminOnly: false },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filtered = navItems.filter((item) => !item.adminOnly || user?.role === 'admin');

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="KNAX" className="w-8 h-8 rounded-lg object-contain bg-white" />
          <span className="font-extrabold text-slate-900 tracking-tight text-sm">KNAX_250 POS</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section */}
        <div>
          <div className="hidden lg:flex items-center gap-3 px-2 mb-8">
            <img src={logo} alt="KNAX" className="w-10 h-10 rounded-xl object-contain bg-white shadow-md" />
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                KNAX_250
              </h1>
              <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                POS System
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 mt-2 lg:mt-0">
            {filtered.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50/80 text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    >
                      <item.icon size={18} />
                    </div>
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Badge & Logout */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] font-medium text-slate-400 capitalize truncate">
                  {user?.role || 'Staff'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}