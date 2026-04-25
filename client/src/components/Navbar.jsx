import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, User, Menu, X, Leaf, LogOut, LayoutDashboard, Shield, Settings } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  const navLinks = [
    { to: '/browse', label: 'Explore' },
    { to: '/donate', label: 'Donate' },
    { to: '/charity', label: 'Charity' },
    { to: '/sell', label: 'List Item' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/[0.03]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-gold transition-transform duration-500 group-hover:rotate-12">
              <Leaf className="w-6 h-6 text-dark-900" />
            </div>
            <span className="font-display font-bold text-2xl text-white tracking-tight">Be<span className="text-primary-500">Way</span></span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className="px-5 py-2 rounded-lg text-gray-400 hover:text-primary-400 font-medium text-[13px] uppercase tracking-widest transition-all duration-300">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'admin' && (
                  <Link to="/admin" className="badge-purple px-4 py-1.5 rounded-full hover:bg-purple-900/20 transition-colors">
                    <Shield className="w-3 h-3" /> Admin
                  </Link>
                )}
                
                <div className="h-8 w-px bg-white/10 mx-2" />
                
                <Link to="/profile" className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/[0.04] transition group">
                  <div className="w-8 h-8 rounded-full border-2 border-primary-500/30 overflow-hidden bg-dark-800 flex items-center justify-center group-hover:border-primary-500 transition-colors">
                    {user.avatar ? (
                      <img src={user.avatar} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary-400 text-xs font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-bold leading-none">{user.name?.split(' ')[0]}</span>
                    <span className="text-gray-500 text-[10px] uppercase tracking-tighter mt-1">My Account</span>
                  </div>
                </Link>

                <Link to="/dashboard" className="p-2.5 rounded-xl hover:bg-white/[0.04] text-gray-500 hover:text-white transition tooltip" title="Dashboard">
                  <LayoutDashboard className="w-4.5 h-4.5" />
                </Link>
                
                <button onClick={handleLogout} className="p-2.5 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition" title="Logout">
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest px-4">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2.5 rounded-xl hover:bg-white/[0.05] text-white">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass border-t border-white/[0.03] px-4 pb-8 shadow-luxury">
            <div className="pt-6 flex flex-col gap-2">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                  className="px-6 py-4 rounded-xl text-gray-400 hover:text-primary-400 font-medium text-sm tracking-widest uppercase">
                  {l.label}
                </Link>
              ))}
              <div className="h-px bg-white/5 my-2" />
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setOpen(false)} className="px-6 py-4 rounded-xl text-white hover:bg-white/[0.04] transition font-bold flex items-center gap-3 tracking-widest uppercase text-sm">
                    <User className="w-4 h-4 text-primary-500" /> Profile & Settings
                  </Link>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="px-6 py-4 rounded-xl text-gray-400 hover:text-white transition font-medium flex items-center gap-3 tracking-widest uppercase text-sm">
                    <LayoutDashboard className="w-4 h-4" /> My Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setOpen(false)} className="px-6 py-4 rounded-xl text-primary-400 hover:bg-primary-900/10 transition font-bold flex items-center gap-3 tracking-widest uppercase text-sm">
                      <Shield className="w-4 h-4" /> Administration
                    </Link>
                  )}
                  <button onClick={handleLogout} className="px-6 py-4 rounded-xl text-red-400 hover:bg-red-400/5 transition font-bold flex items-center gap-3 tracking-widest uppercase text-sm text-left">
                    <LogOut className="w-4 h-4" /> Logout Session
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary text-center py-4">Login</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-center py-4">Join BeWay</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
