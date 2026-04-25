import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Lock, Shield, Settings, Camera, LogOut, Package, Heart, Leaf, Sparkles, CheckCircle, Save, Recycle } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import api from '../utils/api';

const TABS = [
  { id: 'general', label: 'Identity', icon: User },
  { id: 'contact', label: 'Residence', icon: MapPin },
  { id: 'security', label: 'Security', icon: Shield },
];

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : '';

export default function ProfilePage() {
  const { user, updateUser, token, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form States
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    relocationMode: user?.relocationMode || false,
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        bio: user.bio || '',
        relocationMode: user.relocationMode || false,
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', profileForm);
      updateUser(data);
      toast.success('Profile elegantly updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser(data);
      toast.success('Visual identity updated');
    } catch (err) {
      toast.error('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setSaving(true);
    try {
      await api.put('/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Security credential updated');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-200 py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Profile Header */}
        <section className="relative">
          <div className="absolute inset-0 bg-primary-900/5 blur-[120px] rounded-full -z-10" />
          <div className="flex flex-col md:flex-row items-center gap-10 p-10 glass-card border-white/[0.03] shadow-luxury">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full border-4 border-primary-500/20 overflow-hidden bg-dark-800 shadow-gold group-hover:border-primary-500 transition-colors duration-500">
                {user?.avatar ? (
                  <img src={user.avatar.startsWith('http') ? user.avatar : `${API_URL}${user.avatar}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-display font-bold text-primary-500">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 w-10 h-10 bg-primary-600 hover:bg-primary-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110">
                <Camera className="w-5 h-5 text-dark-900" />
                <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" disabled={loading} />
              </label>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">{user?.name}</h1>
                <p className="serif text-xl text-gray-500 italic font-light">{user?.email}</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="badge-gold px-4 py-1.5 rounded-full glass border-primary-500/10">
                  <Sparkles className="w-3.5 h-3.5" /> Curatour Since {new Date(user?.createdAt).getFullYear()}
                </div>
                {user?.role === 'admin' && (
                  <div className="badge-purple px-4 py-1.5 rounded-full border-purple-500/20 font-bold">
                    <Shield className="w-3.5 h-3.5" /> Platform Admin
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 text-center">
              {[
                { label: 'CO₂ Saved', val: user?.impact?.co2Saved || 0, unit: 'kg', icon: Leaf },
                { label: 'Donated', val: user?.impact?.itemsDonated || 0, unit: 'pcs', icon: Heart },
                { label: 'Circular', val: user?.impact?.itemsSold || 0, unit: 'items', icon: Recycle },
              ].map((stat, i) => (
                <div key={i} className="px-6 py-4 glass border-white/[0.04] rounded-2xl">
                  <stat.icon className="w-4 h-4 mx-auto mb-2 text-primary-500/60" />
                  <p className="font-display text-2xl font-bold text-white tracking-tighter">{stat.val}<span className="text-[10px] ml-0.5 text-gray-500">{stat.unit}</span></p>
                  <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Settings Navigation */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-64 glass border-white/[0.03] rounded-2xl p-3 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar sticky top-24">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 whitespace-nowrap lg:w-full ${activeTab === tab.id ? 'bg-primary-600 text-dark-900 font-bold shadow-gold' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                <tab.icon className="w-5 h-5 shrink-0" />
                <span className="text-xs uppercase tracking-[0.15em]">{tab.label}</span>
              </button>
            ))}
            <div className="h-px bg-white/5 mx-4 my-2 hidden lg:block" />
            <button onClick={logout} className="flex items-center gap-4 px-6 py-4 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 w-full">
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="text-xs uppercase tracking-[0.15em] font-bold">Terminate Session</span>
            </button>
          </aside>

          {/* Tab Content */}
          <main className="flex-1 w-full relative">
            <AnimatePresence mode="wait">
              {activeTab === 'general' && (
                <motion.div key="general" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                  <div className="glass-card border-white/[0.03] p-10 lg:p-14">
                    <div className="mb-10">
                      <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Public Identity</h2>
                      <p className="serif text-lg text-gray-500 italic">How you appear in the BeWay collective</p>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-600" />
                            <input type="text" value={profileForm.name}
                              onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                              className="input-field pl-14" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Email (Primary)</label>
                          <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-800" />
                            <input type="email" value={user?.email} className="input-field pl-14 opacity-40 cursor-not-allowed" disabled />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Personal Narrative (Bio)</label>
                        <textarea value={profileForm.bio} rows={4}
                          onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                          className="input-field resize-none h-32 py-4" placeholder="Briefly describe your fashion philosophy..." />
                      </div>

                      <div className="p-6 glass border-primary-500/10 rounded-2xl flex items-center justify-between group transition-border duration-500 hover:border-primary-500/30">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white tracking-widest uppercase">Relocation Mode</p>
                          <p className="serif text-sm text-gray-500 italic">Prioritize fast circularity for moving or clearing collections</p>
                        </div>
                        <button type="button" 
                          onClick={() => setProfileForm({ ...profileForm, relocationMode: !profileForm.relocationMode })}
                          className={`w-14 h-8 rounded-full transition-all duration-500 relative flex items-center px-1 ${profileForm.relocationMode ? 'bg-primary-600 shadow-gold' : 'bg-white/10'}`}>
                          <motion.div 
                            animate={{ x: profileForm.relocationMode ? '1.5rem' : '0' }}
                            className={`w-6 h-6 rounded-full shadow-lg ${profileForm.relocationMode ? 'bg-dark-900' : 'bg-gray-500'}`} />
                        </button>
                      </div>

                      <div className="pt-6 flex justify-end">
                        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                          {saving ? 'Preserving...' : <><Save className="w-4 h-4" /> Save Identity</>}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {activeTab === 'contact' && (
                <motion.div key="contact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                  <div className="glass-card border-white/[0.03] p-10 lg:p-14">
                    <div className="mb-10">
                      <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Residence & Communication</h2>
                      <p className="serif text-lg text-gray-500 italic">Your sanctuary and contact details</p>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Direct Contact (Phone)</label>
                        <div className="relative">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-600" />
                          <input type="tel" value={profileForm.phone}
                            onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="input-field pl-14" placeholder="+91 00000 00000" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Physical Locale (Address)</label>
                        <div className="relative">
                          <MapPin className="absolute left-5 top-6 w-4.5 h-4.5 text-gray-600" />
                          <textarea value={profileForm.address} rows={3}
                            onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                            className="input-field pl-14 py-4 resize-none h-28" placeholder="Street, City, Pincode" />
                        </div>
                      </div>

                      <div className="pt-6 flex justify-end">
                        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                          <Save className="w-4 h-4" /> Save Residence
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div key="security" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                  <div className="glass-card border-white/[0.03] p-10 lg:p-14">
                    <div className="mb-10">
                      <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Security Credentials</h2>
                      <p className="serif text-lg text-gray-500 italic">Safeguard your access to the Collective</p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Current Password</label>
                        <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-600" />
                          <input type="password" value={passwordForm.currentPassword}
                            onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="input-field pl-14" required />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-white/[0.03]">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">New Password</label>
                          <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-600" />
                            <input type="password" placeholder="Min. 6 chars" value={passwordForm.newPassword}
                              onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                              className="input-field pl-14" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Confirm New Password</label>
                          <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-600" />
                            <input type="password" value={passwordForm.confirmPassword}
                              onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                              className="input-field pl-14" required />
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 flex justify-end">
                        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                          <Lock className="w-4 h-4" /> Update Credentials
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
