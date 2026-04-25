import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, Sparkles, Filter, LayoutGrid, ListFilter } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import api from '../utils/api';
import { useSearchParams } from 'react-router-dom';

const CATEGORIES = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories', 'Ethnic', 'Sportswear', 'Kids', 'Other'];
const CONDITIONS = [
  { val: 'new', label: 'Pristine' },
  { val: 'like_new', label: 'Excellent' },
  { val: 'good', label: 'Gentle' },
  { val: 'fair', label: 'Vintage' },
  { val: 'poor', label: 'Raw' }
];

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    condition: '',
    gender: '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt',
    page: 1,
    relocation: false,
  });

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== false));
      const { data } = await api.get('/listings', { params });
      setListings(data.listings);
      setTotal(data.total);
      setPages(data.pages);
    } catch { setListings([]); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));

  const FilterChip = ({ label, active, onClick }) => (
    <button onClick={onClick}
      className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-500 border ${active ? 'bg-primary-600 border-primary-600 text-dark-950 shadow-gold' : 'bg-white/[0.02] border-white/[0.05] text-gray-500 hover:text-white hover:border-white/20'}`}>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-dark-950 text-gray-200 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Module */}
        <section className="relative mb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-900/5 blur-[120px] rounded-full -z-10" />
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary-500">The Archives</p>
              <h1 className="section-title text-6xl leading-none">Curated <span className="text-gradient">Selection</span></h1>
              <p className="serif text-xl text-gray-500 italic max-w-lg mb-0 font-light leading-relaxed">
                Discover pieces with a past, curated for the future of conscious living.
              </p>
            </div>
            <div className="flex items-center gap-4 pb-2">
               <div className="w-12 h-px bg-white/10" />
               <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                 {total.toLocaleString()} Curated Pieces Available
               </p>
            </div>
          </div>
        </section>

        {/* Global Controls */}
        <div className="sticky top-24 z-40 mb-12">
          <div className="glass-card border-white/[0.03] p-4 lg:p-6 shadow-luxury flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full lg:w-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Search collection, brands, narratives..."
                value={filters.search}
                onChange={e => setFilter('search', e.target.value)}
                className="input-field pl-16 !bg-dark-900/50 border-white/[0.02]"
              />
            </div>
            
            <div className="flex gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all duration-500 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap ${filtersOpen ? 'bg-primary-600 border-primary-600 text-dark-950 shadow-gold' : 'bg-dark-900 border-white/[0.05] text-gray-400 hover:text-white hover:border-white/10'}`}>
                <ListFilter className="w-4 h-4" /> 
                {filtersOpen ? 'Dismiss Selection' : 'Refine Palette'}
              </button>

              <div className="relative group w-48">
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                <select 
                  value={filters.sort} 
                  onChange={e => setFilter('sort', e.target.value)} 
                  className="input-field !bg-dark-900/50 border-white/[0.02] appearance-none pr-12 text-[10px] uppercase tracking-widest font-bold">
                  <option value="-createdAt">Newest In</option>
                  <option value="createdAt">Historical Order</option>
                  <option value="price">Value: Low–High</option>
                  <option value="-price">Value: High–Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Refinement Panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 12 }} 
                exit={{ opacity: 0, y: -20 }}
                className="glass-card border-white/[0.03] p-10 lg:p-14 shadow-luxury shadow-black/50">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                  <div className="space-y-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Circular Logic</p>
                    <div className="flex flex-wrap gap-2">
                      {['', 'sell', 'donate', 'charity'].map(t => (
                        <FilterChip key={t} label={t === '' ? 'Omni' : t === 'sell' ? 'Market' : t === 'donate' ? 'Spirit' : 'Legacy'}
                          active={filters.type === t} onClick={() => setFilter('type', t)} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Apparel Type</p>
                    <div className="flex flex-wrap gap-2 overflow-y-auto max-h-32 pr-2 no-scrollbar">
                      {['', ...CATEGORIES].map(c => (
                        <FilterChip key={c} label={c === '' ? 'Complete' : c} active={filters.category === c} onClick={() => setFilter('category', c)} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Condition</p>
                    <div className="flex flex-wrap gap-2">
                      {[{val: '', label: 'Any'}, ...CONDITIONS].map(c => (
                        <FilterChip key={c.val} label={c.label} active={filters.condition === c.val} onClick={() => setFilter('condition', c.val)} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Valuation Range</p>
                    <div className="flex items-center gap-3">
                      <input type="number" placeholder="Min ₹" value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} className="input-field !bg-dark-900/50 !h-12 text-xs" />
                      <div className="w-4 h-px bg-white/10" />
                      <input type="number" placeholder="Max ₹" value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} className="input-field !bg-dark-900/50 !h-12 text-xs" />
                    </div>
                    <label className="flex items-center gap-4 mt-6 cursor-pointer group">
                      <input type="checkbox" checked={filters.relocation} onChange={e => setFilter('relocation', e.target.checked)} className="peer hidden" />
                      <div className="w-10 h-6 bg-white/5 rounded-full border border-white/10 peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all duration-500 relative flex items-center px-1">
                        <div className="w-3.5 h-3.5 bg-gray-500 peer-checked:bg-dark-950 rounded-full transition-all duration-500" style={{ transform: filters.relocation ? 'translateX(1rem)' : 'translateX(0)' }} />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 group-hover:text-white transition-colors">Relocation Mode (Rapid Circularity)</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Listings Module */}
        <section className="min-h-[60vh]">
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
            <>
              <motion.div 
                layout
                className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-12">
                {listings.map((l, i) => <ListingCard key={l._id} listing={l} index={i} />)}
              </motion.div>
              
              {pages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-24">
                  {[...Array(pages)].map((_, i) => (
                    <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                      className={`w-12 h-12 rounded-2xl text-xs font-bold transition-all duration-700 border ${filters.page === i + 1 ? 'bg-primary-600 border-primary-600 text-dark-950 shadow-gold scale-110' : 'bg-white/[0.02] border-white/[0.05] text-gray-500 hover:text-white hover:border-white/20'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-48 glass-card border-white/[0.02] flex flex-col items-center space-y-8">
              <div className="w-24 h-24 rounded-full bg-white/[0.02] flex items-center justify-center text-gray-700">
                <Search className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                 <h3 className="text-3xl font-display font-medium text-white italic">No Treasures Located</h3>
                 <p className="serif text-gray-500 italic max-w-sm mx-auto">Expand your aesthetic refinement filters to discover more hidden collections.</p>
              </div>
              <button onClick={() => setFilters({ ...filters, search: '', category: '', type: '', condition: '', relocation: false })}
                className="btn-secondary !px-12">Clear Refinements</button>
            </div>
          )}
        </section>

        {/* Global Footer Accent */}
        <section className="mt-40 border-t border-white/[0.03] pt-24 text-center space-y-12 pb-12">
           <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-gray-700 mb-4">Integrity in Every Thread</p>
           <div className="flex justify-center gap-16 overflow-hidden max-w-4xl mx-auto">
             {['Hand-Curated Selection', 'AI Validated Values', 'Circular Tradition', 'Carbon Conscious Logics'].map((tag, i) => (
               <div key={i} className="flex items-center gap-4 whitespace-nowrap opacity-20 hover:opacity-100 transition-opacity duration-700">
                 <Sparkles className="w-4 h-4 text-primary-500" />
                 <p className="serif text-sm italic py-2">{tag}</p>
               </div>
             ))}
           </div>
        </section>
      </div>
    </div>
  );
}
