import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Share2, MapPin, User, Tag, Sparkles, ChevronLeft, ChevronRight, MessageCircle, Gift, Package, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import ListingCard from '../components/ListingCard';
import AIPriceBadge from '../components/AIPriceBadge';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : '';
const CONDITION_LABELS = {
  new: 'Pristine Heritage',
  like_new: 'Excellent Selection',
  good: 'Gentle Narrative',
  fair: 'Vintage Soul',
  poor: 'Raw Character'
};

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [imgIdx, setImgIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [aiPrice, setAiPrice] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/listings/${id}`)
      .then(r => {
        setListing(r.data);
        return api.get(`/listings/recommended/${id}`);
      })
      .then(r => setRecommended(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (listing) {
      api.post('/ai/price', { category: listing.category, condition: listing.condition, brand: listing.brand })
        .then(r => setAiPrice(r.data))
        .catch(() => {});
    }
  }, [listing]);

  const handleBuy = async () => {
    if (!user) { toast.error('Please login to acquire this piece'); navigate('/login'); return; }
    setBuying(true);
    try {
      await api.post('/orders', {
        listingId: listing._id,
        shippingAddress: { name: user.name, city: user.address?.split(',')[0] || 'Unknown', pincode: '000000', phone: user.phone || '' },
      });
      toast.success('Acquisition complete. Welcome to the circular inner circle.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction failed');
    } finally { setBuying(false); }
  };

  const handleClaim = async () => {
    if (!user) { toast.error('Please login to claim this spirit'); navigate('/login'); return; }
    try {
      await api.post('/donations', { listingId: listing._id });
      toast.success('🎁 Spirit claimed! Access your legacy tracker.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Claim failed');
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-24 bg-dark-900 min-h-screen">
      <div className="grid lg:grid-cols-2 gap-20">
        <div className="aspect-[4/5] bg-white/[0.02] rounded-3xl animate-pulse" />
        <div className="space-y-10">
          <div className="h-12 bg-white/[0.02] rounded-xl w-3/4" />
          <div className="h-6 bg-white/[0.02] rounded-lg w-1/2" />
          <div className="h-40 bg-white/[0.02] rounded-2xl" />
        </div>
      </div>
    </div>
  );

  if (!listing) return (
    <div className="text-center py-40 bg-dark-900 min-h-screen">
      <Package className="w-16 h-16 text-primary-500/20 mx-auto mb-6" />
      <p className="serif text-2xl text-gray-500 italic">This piece has returned to the archives.</p>
      <button onClick={() => navigate('/browse')} className="btn-secondary mt-8">Explore Other Treasures</button>
    </div>
  );

  const images = listing.images?.length > 0 ? listing.images : [`https://picsum.photos/seed/${id}/600/800`];
  const imgSrc = images[imgIdx]?.startsWith('http') ? images[imgIdx] : `${API_URL}${images[imgIdx]}`;

  return (
    <div className="min-h-screen bg-dark-900 pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24 mb-32">
          
          {/* Gallery Module */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass border-white/[0.03] shadow-luxury group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              <img src={imgSrc} alt={listing.title} className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-[1.5s] ease-out"
                onError={e => { e.target.src = `https://picsum.photos/seed/${id}/600/800`; }} />
              
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/40 to-transparent pointer-events-none" />

              {images.length > 1 && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                    className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white/10 transition backdrop-blur-md">
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                    className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white/10 transition backdrop-blur-md">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </div>
              )}
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${imgIdx === i ? 'w-8 bg-primary-500 shadow-gold' : 'w-2 bg-white/20'}`} />
                ))}
              </div>
            </motion.div>

            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {images.map((img, i) => {
                  const src = img.startsWith('http') ? img : `${API_URL}${img}`;
                  return (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-500 shrink-0 ${imgIdx === i ? 'border-primary-500 shadow-gold scale-105' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                      <img src={src} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info & Acquisition Module */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="lg:col-span-5 flex flex-col pt-4">
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className={`badge-gold px-4 py-1.5 rounded-full border-primary-500/20 text-[10px] uppercase font-bold tracking-widest`}>
                {listing.type === 'donate' ? 'Spirit Donation' : listing.type === 'charity' ? 'Legacy Acquisition' : 'Circular Selection'}
              </span>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <span className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em]">{CONDITION_LABELS[listing.condition]}</span>
            </div>

            <h1 className="section-title text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight leading-none">
              {listing.title}
            </h1>

            <div className="mb-10">
              {listing.type === 'donate' ? (
                <div className="flex items-center gap-4">
                  <span className="font-display text-5xl font-bold text-primary-500 tracking-tighter italic">Gratis</span>
                  <div className="badge-green rounded-full px-4 py-1 border-green-500/20 font-bold text-[10px]">CLAIMABLE</div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                   <div className="flex items-baseline gap-4">
                    <span className="font-display text-5xl font-bold text-white tracking-tighter italic">₹{listing.price?.toLocaleString()}</span>
                    {listing.type === 'charity' && (
                      <span className="text-primary-400 serif text-sm italic">Supports: {listing.charityName} 🤝</span>
                    )}
                  </div>
                  {aiPrice && (
                    <div className="flex items-center gap-2 text-primary-500/60 text-[10px] uppercase tracking-widest font-bold mt-2">
                       <Sparkles className="w-3 h-3" /> AI Valued: ₹{aiPrice.suggested}
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="serif text-xl text-gray-500 leading-relaxed font-light italic mb-12 border-l-2 border-primary-500/10 pl-6">
              "{listing.description}"
            </p>

            {/* Structured Details */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-12 px-2">
              {[
                { label: 'Category', val: listing.category },
                { label: 'Size', val: listing.size || 'Unique Fit' },
                { label: 'Heritage (Brand)', val: listing.brand || 'House of BeWay' },
                { label: 'Gender', val: listing.gender },
                { label: 'Palette', val: listing.color || 'Dynamic' },
                { label: 'Locale', val: listing.location || 'Global' },
                { label: 'Usage History', val: listing.usageDuration || 'Under Evaluation' },
              ].map((item, i) => (
                <div key={i} className="group">
                  <p className="text-gray-600 text-[9px] uppercase tracking-[0.2em] font-bold mb-1.5 transition-colors group-hover:text-primary-500">{item.label}</p>
                  <p className="text-white text-lg font-display font-medium tracking-tight h-8 truncate">{item.val}</p>
                </div>
              ))}
            </div>

            {/* Interaction Area */}
            <div className="space-y-6 mt-auto">
              <div className="glass-card border-white/[0.03] p-6 flex items-center justify-between group hover:border-primary-500/20 transition-all duration-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-dark-800 border-2 border-primary-500/20 overflow-hidden flex items-center justify-center text-primary-500 font-display font-bold text-xl group-hover:border-primary-500 transition-colors">
                    {listing.seller?.avatar ? (
                      <img src={listing.seller.avatar} className="w-full h-full object-cover" />
                    ) : listing.seller?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest mb-1">Presented By</p>
                    <p className="text-white font-display font-bold text-lg">{listing.seller?.name || 'Anonymous Curator'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end opacity-40 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-primary-500 uppercase font-bold tracking-tighter">Verified Curator</span>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => <Sparkles key={i} className="w-2 h-2 text-primary-500" />)}
                  </div>
                </div>
              </div>

              {listing.seller?._id !== user?._id && (
                <div className="flex gap-4">
                  {listing.type === 'donate' ? (
                    <button onClick={handleClaim} className="btn-primary flex-1 flex items-center justify-center gap-3 py-5 px-8">
                       Take Away <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={handleBuy} disabled={buying} className="btn-primary flex-1 flex items-center justify-center gap-3 py-5 px-8">
                       {buying ? 'Processing...' : 'Buy Now'} <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link shared.'); }}
                    className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/[0.03] shadow-luxury">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex items-center gap-4 px-2">
               <ShieldCheck className="w-5 h-5 text-primary-500/40" />
               <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">100% Circular authenticity guaranteed by BeWay</p>
            </div>
          </motion.div>
        </div>

        {/* Similar Pieces */}
        {recommended.length > 0 && (
          <section className="relative mt-32">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
              <div>
                <h2 className="section-title text-4xl">Similar <span className="text-gradient">Additions</span></h2>
                <p className="section-subtitle">Curated specifically for your current selection</p>
              </div>
              <div className="w-24 h-px bg-primary-500/20 hidden md:block mb-4" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8">
              {recommended.map((l, i) => <ListingCard key={l._id} listing={l} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
