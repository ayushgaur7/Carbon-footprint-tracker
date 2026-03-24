import { Link, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        isActive(to)
          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center p-1.5 transition-all">
            <Leaf className="w-full h-full text-emerald-600" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">EcoTracker</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-2">
          {token ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/activities">Activities</NavLink>
              <NavLink to="/achievements">Achievements</NavLink>
              <NavLink to="/leaderboard">Leaderboard</NavLink>
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link
                to="/register"
                className="px-5 py-2 rounded-full text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}