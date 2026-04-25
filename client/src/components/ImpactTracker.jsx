import { motion } from 'framer-motion';
import { Leaf, Droplets, Recycle, TrendingUp } from 'lucide-react';

function StatCard({ icon: Icon, value, unit, label, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="glass rounded-xl p-4 text-center"
    >
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="font-display font-bold text-2xl text-white">{value}</div>
      <div className="text-xs text-gray-500 font-medium">{unit}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </motion.div>
  );
}

export default function ImpactTracker({ impact = {} }) {
  const stats = [
    {
      icon: Recycle,
      value: (impact.itemsListed || 0) + (impact.itemsDonated || 0) + (impact.itemsSold || 0),
      unit: 'items',
      label: 'Diverted from landfill',
      color: 'bg-primary-600',
      delay: 0,
    },
    {
      icon: Leaf,
      value: `${(impact.co2Saved || 0).toFixed(1)}`,
      unit: 'kg CO₂',
      label: 'Carbon saved',
      color: 'bg-green-600',
      delay: 0.1,
    },
    {
      icon: Droplets,
      value: impact.waterSaved > 1000 ? `${((impact.waterSaved || 0) / 1000).toFixed(1)}k` : (impact.waterSaved || 0),
      unit: 'litres',
      label: 'Water conserved',
      color: 'bg-blue-600',
      delay: 0.2,
    },
    {
      icon: TrendingUp,
      value: impact.itemsDonated || 0,
      unit: 'items',
      label: 'Donated to others',
      color: 'bg-accent-600',
      delay: 0.3,
    },
  ];

  return (
    <div>
      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
        <Leaf className="w-4 h-4 text-primary-400" /> Your Impact
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>
    </div>
  );
}
