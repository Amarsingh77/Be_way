import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, CheckCircle, Sparkles, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import ListingCard from '../components/ListingCard';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

export default function DonatePage() {
  const { user } = useAuthStore();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/listings?type=donate&status=active')
      .then(r => setListings(r.data.listings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-gray-200 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center mb-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-900/10 blur-[100px] -z-10 rounded-full" />
          <div className="inline-flex items-center gap-3 badge-gold px-6 py-2 rounded-full border-primary-500/20 mb-6 text-[10px] uppercase font-bold tracking-[0.2em] shadow-gold">
            <Gift className="w-4 h-4 text-primary-500" /> Circular Spirit
          </div>
          <h1 className="section-title text-6xl mb-6 leading-none">The <span className="text-gradient">Legacy</span> Collection</h1>
          <p className="serif text-xl text-gray-500 italic max-w-2xl mx-auto font-light leading-relaxed">
            Community treasures shared without expectation. Claim a piece and continue its story through conscious reuse.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="space-y-6 animate-pulse">
                <div className="aspect-[4/5] bg-white/[0.02] rounded-3xl" />
                <div className="space-y-3">
                  <div className="h-4 bg-white/[0.02] rounded w-3/4" />
                  <div className="h-4 bg-white/[0.02] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-12">
            {listings.map((l, i) => <ListingCard key={l._id} listing={l} index={i} />)}
          </motion.div>
        ) : (
          <div className="text-center py-48 glass-card border-white/[0.02] flex flex-col items-center space-y-8">
            <div className="w-24 h-24 rounded-full bg-white/[0.02] flex items-center justify-center text-gray-700">
               <Heart className="w-10 h-10" />
            </div>
            <div className="space-y-4">
               <h3 className="text-3xl font-display font-medium text-white italic">Generosity Awaiting</h3>
               <p className="serif text-gray-500 italic max-w-sm mx-auto">The legacy collection is currently refreshing. Check back soon for new treasures.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
