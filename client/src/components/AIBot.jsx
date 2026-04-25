import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, ChevronUp } from 'lucide-react';
import api from '../utils/api';

export default function AIBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Welcome to BeWay. I am your Curatorial Guide. How may I assist you with exploring our circular collections or our philanthropic mission today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { if (isOpen) scrollToBottom(); }, [messages, isOpen]);

  const handleSubmit = async (e, textOverride = null) => {
    e?.preventDefault();
    const userMsg = textOverride || input.trim();
    if (!userMsg) return;
    
    if (!textOverride) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Forgive me, the archives are currently resting. Please try your inquiry again shortly." }]);
    } finally {
      setLoading(false);
    }
  };

  const PRESETS = [
    "Why should I donate my items?",
    "How does selling pieces fulfill dreams?",
    "What is the BeWay mission?"
  ];

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-primary-600 text-dark-950 flex items-center justify-center shadow-gold hover:scale-110 transition-transform duration-500 z-50 group"
          >
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-500" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 w-[90vw] max-w-[420px] h-[600px] max-h-[85vh] glass-card border-white/[0.05] shadow-luxury flex flex-col overflow-hidden z-50 p-0"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/[0.05] bg-dark-900/50 flex justify-between items-center backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 blur-[50px] rounded-full point-events-none -mr-16 -mt-16" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center border border-primary-500/20 shadow-gold">
                  <Sparkles className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-display font-medium text-white tracking-wide">BeWay Guide</h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-primary-500">Always Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors relative z-10"
              >
                <ChevronUp className="w-5 h-5 translate-y-1" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-dark-950/40 relative no-scrollbar">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-dark-800 border border-white/10' : 'bg-primary-900/30 border border-primary-500/20'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-gray-400" /> : <Bot className="w-4 h-4 text-primary-400" />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed serif italic border ${msg.role === 'user' ? 'bg-dark-800/80 border-white/5 text-gray-200 rounded-tr-sm' : 'bg-primary-900/10 border-primary-500/10 text-gray-300 rounded-tl-sm shadow-inner'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-900/30 border border-primary-500/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-400" />
                  </div>
                  <div className="bg-primary-900/10 border border-primary-500/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-1.5 h-12">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              {messages.length === 1 && !loading && (
                <div className="flex flex-col gap-2 pt-4">
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-600 mb-2 pl-1">Suggested Inquiries</p>
                  {PRESETS.map((p, i) => (
                    <button 
                      key={i} 
                      onClick={(e) => handleSubmit(e, p)}
                      className="text-left text-xs text-primary-400 py-2.5 px-4 rounded-xl border border-primary-500/10 bg-primary-900/5 hover:bg-primary-900/20 transition-all font-light tracking-wide w-max max-w-full"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/[0.05] bg-dark-900/80 backdrop-blur-md">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Inquire about our collection or mission..."
                  className="w-full bg-dark-950 border border-white/10 rounded-full pl-6 pr-14 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-primary-500/50 transition-colors font-light placeholder:text-gray-600"
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || loading}
                  className="absolute right-2 p-2 rounded-full bg-primary-600 text-dark-950 hover:bg-primary-500 disabled:opacity-50 disabled:hover:bg-primary-600 transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
