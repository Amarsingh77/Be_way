import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="font-display text-9xl font-black text-gradient mb-4">404</div>
        <h2 className="font-display text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center gap-2"><Home className="w-4 h-4" /> Go Home</Link>
          <button onClick={() => window.history.back()} className="btn-secondary flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Go Back</button>
        </div>
      </motion.div>
    </div>
  );
}
