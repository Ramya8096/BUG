import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bug, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 flex items-center justify-between px-8 shadow-sm">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
        <Bug size={32} />
        <span>BUGSPRINT</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/notifications" className="p-2 text-slate-500 hover:text-primary transition-colors relative">
          <Bell size={24} />
          {/* Add notification badge here if needed */}
        </Link>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={20} />
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
