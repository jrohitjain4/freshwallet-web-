import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import heroGraphic from '../../assets/fintech-home-graphic-orange.svg';

export default function Hero() {
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section id="about" className="relative w-full overflow-hidden bg-white pt-12 pb-20 px-4 sm:px-8 lg:px-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Exact PB Fintech Title & Copywriting */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 flex flex-col justify-center text-left"
          >
            {/* Main Headline matching exact PB Fintech hero */}
            <motion.h1 
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1a2b49] leading-[1.25] tracking-tight mb-6"
            >
              We have built India&#39;s most powerful digital wallet for{' '}
              <strong className="font-extrabold text-primary">Merchant Payments &amp; Payouts</strong>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              variants={itemVariants}
              className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed font-normal max-w-xl"
            >
              Accept instant UPI payments with custom QR codes, send secure bank payouts to suppliers, pay utility bills, and track business expenses with real-time ledger analytics.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(255, 107, 0, 0.25)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-orange-600 hover:to-primary text-white font-bold text-base px-7 py-3.5 rounded-2xl shadow-soft transition-all duration-200 cursor-pointer"
              >
                Go to Login <ArrowRight size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/register/welcome')}
                className="flex items-center gap-2 border border-gray-300 hover:border-primary text-[#1a2b49] font-bold text-base px-6 py-3.5 rounded-2xl hover:bg-orange-50/30 bg-white shadow-xs transition-all duration-200 cursor-pointer"
              >
                Open Merchant Account
              </motion.button>
            </motion.div>

          </motion.div>

          {/* Right Column: Exact Vector SVG Illustration in Orange theme */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 w-full flex justify-center items-center"
          >
            <div className="w-full max-w-lg lg:max-w-xl flex justify-center">
              <img 
                src={heroGraphic} 
                alt="FreshWallet Merchant Payments and Payouts Illustration" 
                className="w-full h-auto max-h-[420px] object-contain drop-shadow-sm select-none"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
