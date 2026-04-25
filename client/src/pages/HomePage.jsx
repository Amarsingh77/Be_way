import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShoppingBag, Heart, Recycle, Sparkles, TrendingUp, Users, Package, Eye } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import api from '../utils/api';

const HERO_STATS = [
  { icon: Package, value: '12K+', label: 'Items Reused', color: 'text-primary-500' },
  { icon: Heart, value: '3.2K+', label: 'Donations Made', color: 'text-accent-500' },
  { icon: Leaf, value: '24T', label: 'CO₂ Saved', color: 'text-primary-400' },
  { icon: Users, value: '8K+', label: 'Active Users', color: 'text-accent-400' },
];

const HOW_IT_WORKS = [
  { step: 'I', title: 'Inventory Curation', desc: 'Capture your pieces and let our AI suggest optimal pricing and categories.', icon: Package, color: 'from-primary-600 to-primary-800' },
  { step: 'II', title: 'Circular Choice', desc: 'Opt to sell for fine value, donate for spirit, or support curated charities.', icon: Heart, color: 'from-accent-600 to-accent-800' },
  { step: 'III', title: 'Global Impact', desc: 'Monitor your contribution to a more sustainable, elegant world of fashion.', icon: Leaf, color: 'from-primary-700 to-accent-700' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/listings?limit=6&sort=-createdAt')
      .then(r => setFeatured(r.data.listings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden bg-dark-900">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center">
        {/* Luxury Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px bg-primary-200/20"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 2, 1] }}
              transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              <div className="inline-flex items-center gap-3 badge-gold mb-8 py-2.5 px-6 rounded-full glass border-primary-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">The Future of Circular Luxury</span>
              </div>
              <h1 className="section-title text-6xl md:text-7xl lg:text-8xl mb-8">
                Elevate Your<br />
                <span className="text-gradient">Style’s Legacy</span>
              </h1>
              <p className="serif text-xl md:text-2xl text-gray-400 mb-12 max-w-lg font-light leading-relaxed">
                A refined marketplace for pre-loved fashion. Curate, sell, and donate with the intelligence of AI and the heart of sustainability.
              </p>
              <div className="flex justify-start gap-8 text-sm">
                <div className="flex flex-col gap-3">
                  <Link to="/browse" className="btn-primary flex items-center justify-center gap-3 px-12 py-5 w-full">
                    BUY <ArrowRight className="w-4 h-4" />
                  </Link>
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary-500 text-center">Consumer</div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link to="/charity" className="btn-secondary flex items-center justify-center gap-3 px-12 py-5 w-full">
                    <Heart className="w-4 h-4" /> DONATE
                  </Link>
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 text-center">NGO Collective</div>
                </div>
              </div>
            </motion.div>

            {/* Elegant Stats Card */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.2 }}
              className="relative group">
              <div className="absolute inset-0 bg-primary-500/5 blur-2xl rounded-3xl group-hover:bg-primary-500/10 transition-colors" />
              <div className="grid grid-cols-2 gap-4 relative">
                {HERO_STATS.map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="glass-card p-10 border-white/[0.03] hover:border-primary-500/20 transition-all duration-700">
                    <div className="mb-6 flex justify-center">
                      <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform duration-500">
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="font-display text-4xl font-bold text-white tracking-tighter mb-1">{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy / How It Works */}
      <section className="py-32 border-y border-white/[0.02] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="section-title">The <span className="text-gradient">BeWay</span> Philosophy</h2>
              <p className="section-subtitle">A seamless journey toward intentional fashion.</p>
            </motion.div>
            <div className="w-24 h-px bg-primary-500/20 hidden md:block mb-6" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group">
                <div className="text-primary-500/20 text-7xl font-display font-black mb-[-30px] ml-[-10px] select-none italic">{item.step}</div>
                <div className="relative pt-6 pl-2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-full glass border-primary-500/10 flex items-center justify-center group-hover:border-primary-500/40 transition-all duration-500`}>
                      <item.icon className="w-6 h-6 text-primary-500" />
                    </div>
                    <h3 className="font-display font-bold text-2xl text-white">{item.title}</h3>
                  </div>
                  <p className="serif text-lg text-gray-500 leading-relaxed font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-end justify-between mb-16 px-2">
            <div>
              <h2 className="section-title">Latest <span className="text-gradient">Additions</span></h2>
              <p className="section-subtitle">Curated pieces from the BeWay community.</p>
            </div>
            <Link to="/browse" className="text-primary-500 uppercase tracking-widest text-[11px] font-bold hover:text-primary-400 transition flex items-center gap-2 group mb-4">
              View Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card animate-pulse aspect-[4/5]" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((l, i) => <ListingCard key={l._id} listing={l} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-20 glass-card">
              <Package className="w-12 h-12 text-primary-500/30 mx-auto mb-6" />
              <p className="serif text-2xl text-gray-500 italic mb-8">The collection is currently being curated.</p>
              <Link to="/sell" className="btn-primary">Become a Curatour</Link>
            </div>
          )}
        </div>
      </section>

      {/* Impact Statement */}
      <section className="py-32 relative">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="glass-card border-primary-500/10 py-24 px-12 relative overflow-hidden shadow-luxury">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
            
            <Leaf className="w-10 h-10 text-primary-500/40 mx-auto mb-8" />
            <h2 className="section-title text-5xl mb-8">
              Redefining <span className="italic serif font-light text-primary-400">Environment</span> Impact
            </h2>
            <p className="serif text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              Every curated piece on BeWay contributes to a larger narrative. Together, we have diverted <span className="text-white font-bold">24 Tonnes</span> of fashion waste.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/register" className="btn-primary px-12">Join the Collective</Link>
              <Link to="/donate" className="btn-secondary px-12">Learn Our Story</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
