import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.svg';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full glass-card border-b border-orange-100/30 backdrop-blur-md px-6 py-4 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Area: Logo and Brand Info */}
        <div className="flex items-center select-none cursor-pointer" onClick={() => navigate('/welcome')}>
          <img src={logo} alt="FreshWallet" className="h-10 w-auto" />
        </div>

        {/* Right Area: CTA Buttons */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-navy hover:text-primary transition-colors px-4 py-2"
          >
            Login
          </motion.button>
          
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 20px rgba(255, 107, 0, 0.2)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary px-5 py-2.5 rounded-2xl shadow-soft"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
