import { Link } from 'react-router-dom';
import { Leaf, Mail, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">Be<span className="text-gradient">Way</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Transforming clothing waste into economic and social value. Join the circular fashion revolution.
            </p>
            <div className="flex gap-3 mt-4">
            {[Mail, Globe, Heart].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-primary-400 hover:border-primary-500/50 transition-all">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              {[['Browse', '/browse'], ['Donate', '/donate'], ['Charity', '/charity'], ['Sell/List', '/sell']].map(([label, to]) => (
                <li key={to}><Link to={to} className="text-gray-400 hover:text-primary-400 text-sm transition">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Impact</h4>
            <ul className="space-y-2">
              {['Sustainability', 'Circular Economy', 'NGO Partners', 'About Us'].map(item => (
                <li key={item}><span className="text-gray-400 text-sm cursor-default">{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2024 BeWay. All rights reserved.</p>
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            Made with <span className="text-primary-400">♻</span> for a sustainable future
          </p>
        </div>
      </div>
    </footer>
  );
}
