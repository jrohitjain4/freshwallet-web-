import { motion, type Variants } from 'framer-motion';
import { ShieldCheck, Zap, BarChart3, ArrowRight, Play } from 'lucide-react';
import PhoneMockup from './PhoneMockup';

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative w-full overflow-hidden bg-white pt-10 pb-20 px-6 sm:px-12">
      {/* Background Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[140px] -z-10 animate-pulse-slow-reverse" />
      
      {/* Subtle Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] -z-25"
        style={{
          backgroundImage: `radial-gradient(var(--color-navy) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Side: Copywriting & Bullet Features */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col justify-center text-left"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 px-3.5 py-1.5 rounded-full w-fit mb-6"
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="text-xs font-bold text-primary">Trusted by 10M+ Merchants Across India</span>
          </motion.div>

          {/* Heading */}
          <motion.h2 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy leading-[1.1] mb-6 tracking-tight"
          >
            Accept <span className="text-primary bg-clip-text">Digital Payments</span> & Grow Your Business <span className="text-primary">Faster</span>
          </motion.h2>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed max-w-2xl"
          >
            Empower your store with instant UPI QR payments, multiple card checkouts, and an advanced online payment gateway. Track operations, analyze settlements, and disburse payouts easily via a powerful Merchant Dashboard.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-4 mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-bold px-6 py-4 rounded-2xl shadow-soft hover:shadow-premium transition-all duration-300"
            >
              Get Started Now <ArrowRight size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 border border-gray-200 hover:border-orange-200 text-navy font-bold px-6 py-4 rounded-2xl hover:bg-orange-50/20 transition-all duration-300"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-50 text-primary">
                <Play size={12} className="ml-0.5 fill-primary" />
              </div>
              Watch Demo Video
            </motion.button>
          </motion.div>

          {/* Bottom Bullet Feature Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-8"
          >
            {/* Feature 1 */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-orange-50 text-primary flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-navy">Secure Payments</h4>
                <p className="text-xs text-gray-500 mt-0.5">PCI-DSS Compliant transactions</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-orange-50 text-primary flex items-center justify-center">
                <Zap size={20} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-navy">Instant Settlement</h4>
                <p className="text-xs text-gray-500 mt-0.5">Real-time bank transfers</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-orange-50 text-primary flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-navy">Business Analytics</h4>
                <p className="text-xs text-gray-500 mt-0.5">Automated reports & insights</p>
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* Right Side: Interactive Phone Mockup with floating elements */}
        <div className="lg:col-span-5 w-full flex justify-center items-center">
          <PhoneMockup />
        </div>

      </div>
    </section>
  );
}
