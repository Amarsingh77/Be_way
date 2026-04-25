import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Sparkles, Image, Package, DollarSign, Tag, Check, ArrowRight, ChevronLeft, MapPin, Heart, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import AIPriceBadge from '../components/AIPriceBadge';

const CATEGORIES = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories', 'Ethnic', 'Sportswear', 'Kids', 'Other'];
const CONDITIONS = [
  { val: 'new', label: 'Brand New (With Tags)' },
  { val: 'like_new', label: 'Pristine (Like New)' },
  { val: 'good', label: 'Gentle (Good)' },
  { val: 'fair', label: 'Vintage (Fair)' },
  { val: 'poor', label: 'Raw (Poor)' },
];
const GENDERS = ['Men', 'Women', 'Unisex', 'Kids'];
const USAGE_OPTIONS = ['New', '< 6 Months', '6-12 Months', '1-2 Years', '2+ Years'];

const STEPS = [
  { label: 'Curation', icon: Image },
  { label: 'Details', icon: Tag },
  { label: 'Value', icon: DollarSign },
  { label: 'Review', icon: Check },
];

export default function SellPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [aiPrice, setAiPrice] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({
    title: '', description: '', category: 'Tops', condition: 'good', type: 'sell',
    price: '', size: '', brand: '', color: '', gender: 'Unisex', charityName: '',
    aiTags: [], location: '', isRelocation: false, usageDuration: 'New'
  });

  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleImages = (files) => {
    const arr = Array.from(files).slice(0, 5);
    setImages(arr);
    setPreviews(arr.map(f => URL.createObjectURL(f)));
  };

  const fetchAIPrice = async () => {
    setLoadingAI(true);
    try {
      const { data } = await api.post('/ai/price', { category: form.category, condition: form.condition, brand: form.brand });
      setAiPrice(data);
      if (!form.price) setF('price', String(data.suggested));
    } catch { toast.error('AI valuation currently unavailable'); }
    finally { setLoadingAI(false); }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'aiTags') fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      images.forEach(img => fd.append('images', img));
      const { data } = await api.post('/listings', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Your piece is now live in the collection.');
      navigate(`/product/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Publishing failed');
    } finally { setSubmitting(false); }
  };

  const stepContent = [
    // Step 0: Curation (Photos)
    <div key={0} className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Image Curation</h2>
        <p className="serif text-lg text-gray-500 italic">Capture the soul of your piece</p>
      </div>
      
      <div
        onClick={() => fileRef.current.click()}
        className="border-2 border-dashed border-white/[0.05] hover:border-primary-500/30 rounded-3xl p-16 text-center cursor-pointer transition-all duration-500 group bg-white/[0.01]"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary-900/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary-500/10 transition-all duration-700">
          <Upload className="w-8 h-8 text-primary-500" />
        </div>
        <p className="text-white font-bold uppercase tracking-widest text-sm mb-2">Upload Visuals</p>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-relaxed">High fidelity images<br />increase curated interest</p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e => handleImages(e.target.files)} />
      
      {previews.length > 0 && (
        <div className="flex gap-4 mt-8 flex-wrap">
          {previews.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="relative w-32 h-32 rounded-2xl overflow-hidden group shadow-luxury border border-white/[0.03]">
              <img src={p} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
              <button onClick={() => { const imgs = [...images]; imgs.splice(i,1); setImages(imgs); const ps=[...previews]; ps.splice(i,1); setPreviews(ps); }}
                className="absolute top-2 right-2 p-1.5 bg-red-500/80 backdrop-blur-md rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>,

    // Step 1: Details
    <div key={1} className="space-y-8">
      <div className="mb-2">
        <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Narrative Details</h2>
        <p className="serif text-lg text-gray-500 italic">The story behind the piece</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Piece Title</label>
          <input placeholder="Ex. Vintage Silk Kurta in Indigo" value={form.title} onChange={e => setF('title', e.target.value)} className="input-field" />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Composition & History (Description)</label>
          <textarea placeholder="Describe the texture, fit, and memory of this item..." value={form.description} onChange={e => setF('description', e.target.value)} rows={4} className="input-field resize-none h-32 py-4" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Category</label>
            <select value={form.category} onChange={e => setF('category', e.target.value)} className="input-field appearance-none">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Condition</label>
            <select value={form.condition} onChange={e => setF('condition', e.target.value)} className="input-field">
              {CONDITIONS.map(c => <option key={c.val} value={c.val}>{c.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Brand Heritage</label>
            <input placeholder="Ex. Zara, Sabyasachi, Raw Mango" value={form.brand} onChange={e => setF('brand', e.target.value)} className="input-field" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Sizing</label>
            <input placeholder="Ex. EU 40, Oversized, S" value={form.size} onChange={e => setF('size', e.target.value)} className="input-field" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Origin (Location)</label>
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input placeholder="City, State" value={form.location} onChange={e => setF('location', e.target.value)} className="input-field pl-14" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Usage Duration</label>
            <select value={form.usageDuration} onChange={e => setF('usageDuration', e.target.value)} className="input-field">
              {USAGE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>,

    // Step 2: Value
    <div key={2} className="space-y-10">
      <div className="mb-2">
        <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Market Value</h2>
        <p className="serif text-lg text-gray-500 italic">Select the circular path for this piece</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { val: 'sell', emoji: <Package />, label: 'Market', sub: 'Sell for value' },
          { val: 'donate', emoji: <Heart />, label: 'Spirit', sub: 'Gift for free' },
          { val: 'charity', emoji: <Leaf />, label: 'Legacy', sub: 'Help a cause' }
        ].map((it) => (
          <button key={it.val} onClick={() => setF('type', it.val)}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-500 group ${form.type === it.val ? 'border-primary-500 bg-primary-900/10 shadow-gold' : 'border-white/[0.03] hover:border-white/10 glass'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors ${form.type === it.val ? 'text-primary-500' : 'text-gray-600'}`}>
              {it.emoji}
            </div>
            <div className={`font-bold uppercase tracking-widest text-[10px] mb-1 ${form.type === it.val ? 'text-white' : 'text-gray-500'}`}>{it.label}</div>
            <div className="text-[9px] text-gray-600 font-medium whitespace-nowrap">{it.sub}</div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {form.type === 'sell' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Price Point (₹)</label>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <input type="number" placeholder="0.00" value={form.price} onChange={e => setF('price', e.target.value)} className="input-field" />
              </div>
              <button onClick={fetchAIPrice} disabled={loadingAI} className="btn-secondary whitespace-nowrap flex items-center gap-3 px-8">
                <Sparkles className={`w-4 h-4 ${loadingAI ? 'animate-spin' : 'text-primary-500'}`} />
                {loadingAI ? 'Calculating...' : 'AI Valuation'}
              </button>
            </div>
            {aiPrice && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="p-5 glass border-primary-500/10 rounded-2xl flex items-center gap-6 shadow-luxury">
                <div className="p-3 bg-primary-900/10 rounded-xl text-primary-500">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1">AI Curated Suggestion</p>
                  <p className="text-xl font-display font-bold text-white">₹{aiPrice.suggested}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                   <div className="h-4 w-px bg-white/5 mx-2" />
                   <p className="text-[10px] text-gray-600 font-medium">Confidence: <span className="text-primary-400">94%</span></p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
        
        {form.type === 'charity' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Beneficiary Name</label>
            <input placeholder="Enter Charity or NGO Organization" value={form.charityName} onChange={e => setF('charityName', e.target.value)} className="input-field" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>,

    // Step 3: Review
    <div key={3} className="space-y-10">
      <div className="mb-2">
        <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Final Preview</h2>
        <p className="serif text-lg text-gray-500 italic">Review before publishing to the Collective</p>
      </div>

      <div className="glass-card border-white/[0.03] overflow-hidden p-8 shadow-luxury">
        <div className="flex gap-8">
          <div className="w-48 aspect-[4/5] rounded-2xl overflow-hidden bg-dark-800 shrink-0 shadow-lg">
            {previews[0] ? <img src={previews[0]} className="w-full h-full object-cover grayscale-[0.2]" /> : <div className="w-full h-full flex items-center justify-center text-gray-700 bg-white/5"><Image /></div>}
          </div>
          <div className="flex-1 space-y-4 pt-2">
            <div>
              <div className="flex gap-2 mb-3">
                <span className="badge-gold border-primary-500/20">{form.category}</span>
                <span className="badge-gold border-primary-500/20">{form.condition.replace('_',' ')}</span>
              </div>
              <h3 className="text-3xl font-display font-bold text-white tracking-tight leading-none mb-3">{form.title || 'Untitled Piece'}</h3>
              <p className="serif text-gray-500 text-sm line-clamp-3 leading-relaxed italic">{form.description || 'No description provided.'}</p>
            </div>
            <div className="pt-4 border-t border-white/[0.03] flex items-center justify-between">
              <div className="text-3xl font-display font-bold text-primary-500 tracking-tighter">
                {form.type === 'donate' ? 'FREE' : `₹${form.price || '0'}`}
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-[10px] uppercase tracking-widest font-bold">
                 <Package className="w-3 h-3" /> Circular Type: <span className="text-white ml-2">{form.type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full py-6 flex items-center justify-center gap-4 text-lg disabled:opacity-50 shadow-gold">
        {submitting ? 'Integrating into Collective...' : <><Package className="w-5 h-5" /> Publish to Marketplace</>}
      </button>
    </div>,
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-24 min-h-screen">
      <section className="relative mb-16 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-500/5 blur-[100px] -z-10 rounded-full" />
        <h1 className="section-title text-6xl mb-4">Curate Your <span className="text-gradient">Legacy</span></h1>
        <p className="section-subtitle">Introduce your pre-loved fashion to a new home</p>
      </section>

      {/* Elegant Progress Steps */}
      <div className="flex items-center gap-3 mb-16 px-4">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-4 flex-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-700 ${i <= step ? 'bg-primary-600 text-dark-900 shadow-gold' : 'bg-white/5 border border-white/5 text-gray-600'}`}>
              {i < step ? <Check className="w-5 h-5" /> : <s.icon className={`w-5 h-5 ${i === step ? 'animate-pulse' : ''}`} />}
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px transition-all duration-1000 ${i < step ? 'bg-primary-500/50' : 'bg-white/5'}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <motion.div key={step} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card border-white/[0.03] p-10 lg:p-14 shadow-luxury mb-10">
        <AnimatePresence mode="wait">
          {stepContent[step]}
        </AnimatePresence>
      </motion.div>

      {/* Navigation Controls */}
      {step < 3 && (
        <div className="flex gap-6">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="btn-secondary !bg-dark-800 hover:!bg-dark-700 flex items-center gap-2 px-10">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          <button onClick={() => setStep(s => s + 1)} className="btn-primary flex-1 flex items-center justify-center gap-3 py-4"
            disabled={step === 0 && previews.length === 0}>
            {step === 2 ? 'Final Preview' : 'Continue Curation'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
