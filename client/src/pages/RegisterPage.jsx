import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Leaf, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const PERKS = [
  'AI-curated price evaluations',
  'Personal circular legacy tracker',
  'Exclusive access to premium pre-loved pieces'
];

export default function RegisterPage() {
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [proofFile, setProofFile] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Minimum 6 characters required'); return; }
    
    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('email', form.email);
      payload.append('password', form.password);
      payload.append('role', role);
      if (role === 'ngo') {
        if (!proofFile) { toast.error('NGO Proof Document required'); return; }
        payload.append('ngoProofDocument', proofFile);
      }

      await register(payload);
      toast.success(role === 'ngo' ? 'NGO collective established.' : 'Your journey begins. Welcome to BeWay.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="min-h-[95vh] flex items-center justify-center px-4 py-20 bg-dark-950">
      {/* Refined Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary-900/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-accent-900/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Atmosphere */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="hidden lg:block">
          <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-gold">
              <Leaf className="w-6 h-6 text-dark-900" />
            </div>
            <span className="font-display font-bold text-3xl text-white">Be<span className="text-primary-500">Way</span></span>
          </Link>
          <h2 className="section-title text-6xl mb-6">
            Join the Collective of <br />
            <span className="text-gradient italic serif font-light">Intentional Fashion</span>
          </h2>
          <p className="serif text-xl text-gray-500 mb-10 max-w-md font-light leading-relaxed">
            Begin your contribution to a more sustainable, elegant future. Your circular legacy starts here.
          </p>
          <div className="space-y-5">
            {PERKS.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-4 group">
                <div className="w-6 h-6 rounded-full border border-primary-500/20 flex items-center justify-center text-primary-500 group-hover:bg-primary-500/10 transition-colors">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">{p}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Register Form Module */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
          <div className="glass-card border-white/[0.03] p-10 lg:p-12 shadow-luxury">
            <div className="mb-10 text-center lg:text-left">
              <h1 className="font-display text-4xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
              <p className="serif text-lg text-gray-500 italic mb-8">Curate your identity with BeWay</p>
              
              <div className="flex bg-dark-900 rounded-lg p-1 w-max mx-auto lg:mx-0">
                <button type="button" onClick={() => setRole('user')} className={`px-6 py-2 rounded-md text-sm transition-all ${role === 'user' ? 'bg-primary-600 text-dark-900 font-bold shadow-gold' : 'text-gray-400 hover:text-white'}`}>Consumer</button>
                <button type="button" onClick={() => setRole('ngo')} className={`px-6 py-2 rounded-md text-sm transition-all ${role === 'ngo' ? 'bg-primary-600 text-dark-900 font-bold shadow-gold' : 'text-gray-400 hover:text-white'}`}>NGO Collective</button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">{role === 'ngo' ? 'NGO Name' : 'Full Identity'}</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="text" placeholder="Your name" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="input-field pl-14" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="email" placeholder="you@residence.com" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="input-field pl-14" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Account Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="input-field pl-14 pr-14" required />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-primary-500 transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {role === 'ngo' && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">NGO Registration Proof</label>
                  <div className="relative">
                    <input type="file" accept=".pdf,image/*" onChange={e => setProofFile(e.target.files[0])} className="w-full text-sm file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-xs file:uppercase file:font-bold file:bg-primary-500/10 file:text-primary-500 hover:file:bg-primary-500/20 file:transition-colors text-gray-500" required />
                  </div>
                </div>
              )}

              <button type="submit" disabled={isLoading} className="btn-primary w-full py-5 flex items-center justify-center gap-3 mt-4 disabled:opacity-50">
                {isLoading ? 'Verifying...' : <><span>Initialize Access</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                Already Registered?{' '}
                <Link to="/login" className="text-primary-500 hover:text-primary-400 transition-colors ml-2 underline underline-offset-4">Sign in Collector →</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
