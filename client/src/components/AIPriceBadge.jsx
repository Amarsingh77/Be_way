import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

export default function AIPriceBadge({ suggested, range, confidence, category }) {
  if (!suggested) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-xl p-4 border border-primary-500/30"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-400" />
        </div>
        <span className="text-sm font-semibold text-primary-400">AI Price Suggestion</span>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-display font-bold text-white">₹{suggested?.toLocaleString()}</span>
        <span className="text-sm text-gray-400">suggested</span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-gray-500">Range:</span>
        <span className="text-xs font-medium text-gray-300">
          ₹{range?.min?.toLocaleString()} – ₹{range?.max?.toLocaleString()}
        </span>
      </div>

      {/* Confidence Bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Confidence</span>
          <span className="text-primary-400 font-semibold">{confidence}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
          />
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-3 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        Based on category, condition & brand
      </p>
    </motion.div>
  );
}
