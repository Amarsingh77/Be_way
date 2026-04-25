import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Leaf, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success('Welcome back to the Collective.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Access denied');
    }
  };

  return (
    <div className="min-h-[95vh] flex items-center justify-center px-4 bg-dark-950">
      {/* Luxury Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-primary-900/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-accent-900/5 rounded-full blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="w-full max-w-lg relative z-10">
        <div className="glass-card p-10 lg:p-14 border-white/[0.03] shadow-luxury">
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center justify-center gap-3 mb-8 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-gold transition-transform duration-500 group-hover:scale-110">
                <Leaf className="w-8 h-8 text-dark-900" />
              </div>
            </Link>
            <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
            <p className="serif text-lg text-gray-500 italic">Enter the world of BeWay</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Email Identifier</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-600" />
                <input type="email" placeholder="collector@residence.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-field pl-14" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Secret Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-600" />
                <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pl-14 pr-14" required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-primary-500 transition-colors">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-5 flex items-center justify-center gap-3 mt-4 disabled:opacity-50">
              {isLoading ? 'Authenticating...' : <><span>Grant Access</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-white/[0.03]">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              New to the Collective?{' '}
              <Link to="/register" className="text-primary-500 hover:text-primary-400 transition-colors ml-2 underline underline-offset-4">Join Now →</Link>
            </p>
          </div>

          {/* Luxury Hint */}
          <div className="mt-8 p-4 rounded-xl bg-primary-900/5 border border-primary-500/10">
            <p className="text-[10px] uppercase tracking-tighter text-gray-600 text-center font-bold">
              Demo Curator: <span className="text-primary-400">admin@beway.com</span> | <span className="text-primary-400">admin123</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
