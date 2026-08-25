import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, User } from 'lucide-react';
import logo from '../../assets/logo.svg';

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'What we do', href: '#what-we-do' },
    { name: 'What sets us apart', href: '#what-sets-us-apart' },
    { name: 'Investor relations', href: '#stats' },
    { name: 'FAQs', href: '#faqs' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-xs transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand Logo only (no duplicate text) */}
          <div 
            className="flex items-center cursor-pointer select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src={logo} alt="FreshWallet" className="h-10 w-auto hover:opacity-95 transition-opacity" />
          </div>

          {/* Center: Clean Nav Menu matching exact PB Fintech navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleScrollTo(link.href)}
                className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Right: Login & Register CTA Buttons with vibrant orange theme */}
          <div className="hidden sm:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 text-sm font-bold text-gray-800 hover:text-primary bg-orange-50/70 hover:bg-orange-100/70 border border-orange-200/60 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <User size={15} className="text-primary" />
              Login
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(255, 107, 0, 0.25)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register/welcome')}
              className="flex items-center gap-1.5 text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary hover:from-orange-600 hover:to-primary px-5 py-2 rounded-xl shadow-soft transition-all cursor-pointer"
            >
              Register
            </motion.button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-bold text-white bg-primary px-3.5 py-1.5 rounded-lg shadow-xs"
            >
              Login
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 shadow-xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleScrollTo(link.href)}
                  className="flex items-center justify-between text-left py-2.5 px-3 text-sm font-semibold text-gray-800 hover:bg-orange-50 hover:text-primary rounded-lg transition-all"
                >
                  {link.name}
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              ))}
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5 mt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full text-center py-2.5 text-sm font-bold text-gray-800 bg-orange-50 border border-orange-200 rounded-xl"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register/welcome');
                  }}
                  className="w-full text-center py-2.5 text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary rounded-xl shadow-soft"
                >
                  Register Free Account
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
