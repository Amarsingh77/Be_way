import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Package, ShoppingBag, Leaf, TrendingUp, Edit3, LogOut, LayoutDashboard, Heart, Sparkles, ArrowRight, ShieldCheck, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import ImpactTracker from '../components/ImpactTracker';
import ListingCard from '../components/ListingCard';
import useAuthStore from '../store/authStore';
import api from '../utils/api';

const TABS = [
  { id: 'listings', label: 'Collection', icon: Package },
  { id: 'orders', label: 'Acquisitions', icon: ShoppingBag },
  { id: 'donations', label: 'Legacy', icon: Heart },
  { id: 'impact', label: 'Philosophy', icon: Leaf },
];

export default function DashboardPage() {
  const { user, logout, refreshUser } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshUser();
    Promise.all([
      api.get('/listings/my'),
      api.get('/orders/my'),
      api.get('/donations/my'),
    ]).then(([l, o, d]) => {
      setListings(l.data);
      setOrders(o.data);
      setDonations(d.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleHideOrder = async (id) => {
    if (!window.confirm('Remove this acquisition record from your view?')) return;
    try {
      await api.patch(`/orders/${id}/hide`);
      setOrders(prev => prev.filter(o => o._id !== id));
      toast.success('Record removed from view');
    } catch (err) {
      toast.error('Failed to remove record');
    }
  };

  const handleHideDonation = async (id) => {
    if (!window.confirm('Remove this legacy record from your view?')) return;
    try {
      await api.patch(`/donations/${id}/hide`);
      setDonations(prev => prev.filter(d => d._id !== id));
      toast.success('Record removed from view');
    } catch (err) {
      toast.error('Failed to remove record');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Permanently remove this piece from the platform?')) return;
    try {
      await api.delete(`/listings/${id}`);
      setListings(prev => prev.filter(l => l._id !== id));
      toast.success('Piece permanently removed');
    } catch (err) {
      toast.error('Failed to remove piece');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-200 py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Atelier Header */}
        <section className="relative">
          <div className="absolute inset-x-0 -top-20 h-64 bg-primary-900/5 blur-[120px] rounded-full -z-10" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            className="flex flex-col md:flex-row items-center gap-10 p-10 lg:p-14 glass-card border-white/[0.03] shadow-luxury">
            <div className="relative group">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-primary-500/20 overflow-hidden bg-dark-800 shadow-gold group-hover:border-primary-500 transition-colors duration-700">
                {user?.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-display font-bold text-primary-500">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 p-2 bg-primary-600 rounded-lg shadow-gold">
                 <ShieldCheck className="w-4 h-4 text-dark-950" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-500">Curator Atelier</p>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-none">{user?.name}</h1>
                <p className="serif text-lg text-gray-500 italic font-light">{user?.email}</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <Link to="/profile" className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-primary-500 transition-colors flex items-center gap-2">
                  <Edit3 className="w-3 h-3" /> Edit Identity
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-[10px] uppercase tracking-widest font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2">
                    <LayoutDashboard className="w-3 h-3" /> Admin Module
                  </Link>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 text-center">
              {[
                { label: 'Collection', val: listings.length, icon: Package },
                { label: 'Acquisitions', val: orders.length, icon: ShoppingBag },
                { label: 'Legacy Points', val: user?.impact?.points || 0, icon: Sparkles },
              ].map((stat, i) => (
                <div key={i} className="px-6 py-4 glass border-white/[0.04] rounded-2xl min-w-[120px]">
                  <p className="font-display text-2xl font-bold text-white tracking-tighter">{stat.val}</p>
                  <p className="text-[8px] lg:text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1 group-hover:text-primary-500 transition-colors">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Workspace Controls */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-72 lg:sticky lg:top-32 space-y-10">
            <div className="glass border-white/[0.03] rounded-3xl p-3 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 whitespace-nowrap lg:w-full ${activeTab === t.id ? 'bg-primary-600 text-dark-950 font-bold shadow-gold' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                  <t.icon className={`w-5 h-5 shrink-0 ${activeTab === t.id ? 'stroke-[2.5px]' : ''}`} />
                  <span className="text-[10px] uppercase tracking-[0.2em]">{t.label}</span>
                </button>
              ))}
              <div className="h-px bg-white/5 mx-4 my-2 hidden lg:block" />
              <button onClick={() => { logout(); navigate('/'); toast.success('Atelier session terminated.'); }}
                className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 w-full">
                <LogOut className="w-5 h-5 shrink-0" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Terminate Session</span>
              </button>
            </div>

            <div className="glass-card border-primary-500/10 p-8 hidden lg:block space-y-6">
               <h3 className="font-display text-xl text-white italic">Curator's Tip</h3>
               <p className="text-gray-500 text-sm leading-relaxed">Pieces with high-fidelity narratives and verified heritage see 40% faster circularity.</p>
               <Link to="/sell" className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3">
                 <Package className="w-4 h-4" /> Add to Collection
               </Link>
            </div>
          </aside>

          {/* Dynamic Content */}
          <main className="flex-1 w-full min-h-[60vh] relative">
            <AnimatePresence mode="wait">
              {activeTab === 'listings' && (
                <motion.div key="listings" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.6 }}>
                  {listings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 glass-card border-white/[0.02]">
                      <div className="w-20 h-20 rounded-3xl bg-white/[0.02] flex items-center justify-center text-gray-700">
                        <Package className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-display font-medium text-white">Your Collection is Waiting</h3>
                        <p className="serif text-gray-500 italic">Introduce your first circular piece to the collective</p>
                      </div>
                      <Link to="/sell" className="btn-primary px-12 py-4">Begin Curation</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                      {listings.map((l, i) => (
                        <div key={l._id} className="relative group/item">
                          <ListingCard listing={l} index={i} />
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteListing(l._id); }} className="absolute top-4 right-4 z-10 p-2.5 bg-dark-950/80 backdrop-blur-md text-gray-400 hover:text-red-400 rounded-xl lg:opacity-0 group-hover/item:opacity-100 transition-all duration-300 border border-white/10 shadow-luxury">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 glass-card border-white/[0.02]">
                       <div className="w-20 h-20 rounded-3xl bg-white/[0.02] flex items-center justify-center text-gray-700">
                        <ShoppingBag className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-display font-medium text-white">Zero Acquisitions</h3>
                        <p className="serif text-gray-500 italic">Discover pre-loved treasures in the marketplace</p>
                      </div>
                      <Link to="/browse" className="btn-primary px-12 py-4">Explore Marketplace</Link>
                    </div>
                  ) : orders.map(o => (
                    <div key={o._id} className="glass-card flex flex-col md:flex-row items-center gap-8 p-8 border-white/[0.02] group hover:border-primary-500/20 transition-all duration-700">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden bg-dark-800 shrink-0 shadow-lg grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700">
                        {o.listing?.images?.[0] && <img src={o.listing.images[0].startsWith('http') ? o.listing.images[0] : `http://localhost:5001${o.listing.images[0]}`} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 text-center md:text-left space-y-2">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Order ID: #{o._id.slice(-6)}</p>
                        <h3 className="text-2xl font-display font-bold text-white tracking-tight">{o.listing?.title}</h3>
                        <p className="serif text-lg text-primary-500/80 font-bold">₹{o.amount?.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                         <span className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border ${o.status === 'delivered' ? 'badge-green border-green-500/20' : o.status === 'cancelled' ? 'badge-red border-red-500/20' : 'badge-gold border-primary-500/20'}`}>
                          {o.status}
                        </span>
                        <div className="flex items-center gap-4">
                          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Est. Arrival: 4-6 Cycles</p>
                          <button onClick={() => handleHideOrder(o._id)} className="p-2 text-gray-700 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'donations' && (
                <motion.div key="donations" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                  {donations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 glass-card border-white/[0.02]">
                       <div className="w-20 h-20 rounded-3xl bg-white/[0.02] flex items-center justify-center text-gray-700">
                        <Heart className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-display font-medium text-white">Legacy Empty</h3>
                        <p className="serif text-gray-500 italic">Donate items to build your sustainability spirit</p>
                      </div>
                      <Link to="/sell" className="btn-primary px-12 py-4">Start Legacy</Link>
                    </div>
                  ) : donations.map(d => (
                    <div key={d._id} className="glass-card flex flex-col md:flex-row items-center gap-8 p-8 border-white/[0.02] group hover:border-primary-500/20 transition-all duration-700">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                           <Heart className="w-4 h-4 text-primary-500" />
                           <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Spirit Tradition</p>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white tracking-tight">{d.listing?.title}</h3>
                        <div className="flex items-center gap-3 pt-2">
                          <User className="w-3.5 h-3.5 text-gray-600" />
                          <p className="serif text-sm text-gray-400 italic">Acquired by <span className="text-primary-400">{d.recipient?.name || 'Waiting for Curatour'}</span></p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                        <div className="px-8 py-3 rounded-2xl glass border-primary-500/10 text-center">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${d.status === 'delivered' ? 'text-green-400' : 'text-primary-500'}`}>
                            {d.status}
                          </span>
                        </div>
                        <button onClick={() => handleHideDonation(d._id)} className="p-2 text-gray-700 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'impact' && (
                <motion.div key="impact" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-3xl">
                  <div className="glass-card border-white/[0.03] p-10 lg:p-14 space-y-12 shadow-luxury overflow-hidden">
                    <div className="relative">
                      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-900/10 rounded-full blur-[100px] -z-10" />
                      <h2 className="text-4xl font-display font-bold text-white mb-2 leading-none">Sustainability Philosophy</h2>
                      <p className="serif text-xl text-gray-500 italic">Your specific contribution to the BeWay collective</p>
                    </div>

                    <ImpactTracker impact={user?.impact} />

                    <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <TrendingUp className="w-6 h-6 text-primary-500" />
                          <h3 className="text-lg font-display font-bold text-white tracking-wide">Evolution Log</h3>
                        </div>
                        <div className="space-y-5">
                          {[
                            { icon: Leaf, text: `Reserved ${(user?.impact?.co2Saved || 0).toFixed(1)}kg of Carbon Emissions`, sub: `Equivalent to ${Math.round((user?.impact?.co2Saved || 0) / 21)} mature trees` },
                            { icon: Sparkles, text: `Maintained ${(user?.impact?.waterSaved || 0).toLocaleString()}L of Aquatic Resources`, sub: `Preserved the cycle of pristine water` },
                            { icon: Package, text: `Diverted ${(user?.impact?.itemsListed || 0) + (user?.impact?.itemsDonated || 0)} Pieces from Landfill`, sub: `Extending the narrative of fashion` },
                          ].map((line, i) => (
                            <div key={i} className="flex gap-4 group">
                              <line.icon className="w-5 h-5 text-primary-500/40 mt-1 shrink-0 group-hover:text-primary-500 transition-colors" />
                              <div className="space-y-0.5">
                                <p className="text-sm font-bold text-white leading-relaxed">{line.text}</p>
                                <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">{line.sub}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-8 rounded-3xl bg-white/[0.01] border border-white/[0.03] flex flex-col justify-center text-center space-y-4">
                         <div className="w-16 h-16 rounded-full bg-primary-900/10 flex items-center justify-center mx-auto mb-2">
                           <ShieldCheck className="w-8 h-8 text-primary-500" />
                         </div>
                         <h4 className="text-xl font-display font-bold text-white italic">Diamond Curator Status</h4>
                         <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold leading-relaxed px-4">Your circular integrity is within the top 5% of the collective members.</p>
                      </div>
                    </div>
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
