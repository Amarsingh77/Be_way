import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, Tag, Sparkles, MapPin, ArrowUpRight } from 'lucide-react';

const CONDITION_COLORS = {
  new: 'badge-gold', like_new: 'badge-blue', good: 'badge-gold', fair: 'badge-gold', poor: 'badge-red',
};
const TYPE_COLORS = { sell: 'badge-gold', donate: 'badge-green', charity: 'badge-purple' };
const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : '';

export default function ListingCard({ listing, index = 0 }) {
  const imgSrc = listing.images?.[0]
    ? (listing.images[0].startsWith('http') ? listing.images[0] : `${API_URL}${listing.images[0]}`)
    : `https://picsum.photos/seed/${listing._id}/400/500`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link to={`/product/${listing._id}`}>
        <div className="glass-card p-0 overflow-hidden border-white/[0.03] hover:border-primary-500/20 shadow-luxury transition-all duration-700">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden bg-dark-800">
            <img
              src={imgSrc}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out grayscale-[0.2] group-hover:grayscale-0"
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${listing._id}/400/500`; }}
            />
            
            {/* Badges overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className={TYPE_COLORS[listing.type] || 'badge-gold'}>
                {listing.type === 'charity' ? 'Charity' : listing.type === 'donate' ? 'Donation' : 'Market'}
              </span>
              {listing.aiSuggestedPrice > 0 && listing.type === 'sell' && (
                <span className="badge-gold bg-primary-900/40 backdrop-blur-md border-primary-500/30">
                  <Sparkles className="w-3 h-3" /> AI Valued
                </span>
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
              <div className="flex items-center gap-2 text-[10px] text-white/50 uppercase tracking-widest font-bold">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {listing.views || 0}</span>
                <span className="h-3 w-px bg-white/10 mx-1" />
                <span>View Details <ArrowUpRight className="w-3 h-3 inline ml-0.5" /></span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="font-display font-bold text-white text-lg line-clamp-1 flex-1 tracking-tight">{listing.title}</h3>
            </div>

            <div className="flex flex-wrap gap-1 mb-6">
              <span className="tag">{listing.category}</span>
              <span className="tag">{listing.size || 'One Size'}</span>
              <span className="tag">{listing.condition?.replace('_', ' ')}</span>
              {listing.usageDuration && <span className="tag bg-primary-500/10 text-primary-400">{listing.usageDuration}</span>}
            </div>

            <div className="flex items-end justify-between border-t border-white/[0.03] pt-6">
              <div>
                {listing.type === 'donate' ? (
                  <span className="text-primary-500 font-display text-2xl font-bold tracking-tighter">Gratis</span>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-white font-display text-2xl font-bold tracking-tighter">₹{listing.price?.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-1.5">
                {listing.location && (
                  <span className="text-gray-600 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 group-hover:text-primary-500 transition-colors">
                    <MapPin className="w-3 h-3" /> {listing.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
