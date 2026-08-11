import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full py-16 px-6 sm:px-12 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-primary to-secondary text-white rounded-[24px] px-8 py-16 sm:p-16 text-center overflow-hidden shadow-premium"
        >
          {/* Background shapes */}
          <div className="absolute top-[-50%] right-[-20%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-[-50%] left-[-20%] w-[500px] h-[500px] bg-black/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight leading-tight relative z-10 max-w-3xl mx-auto">
            Start accepting digital payments for your business today
          </h2>

          {/* Subheading */}
          <p className="text-sm sm:text-base opacity-80 mb-8 max-w-xl mx-auto leading-relaxed relative z-10">
            Join millions of retailers, merchants, and startups who rely on FreshWallet for seamless collections, settlement, and business growth.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-white text-primary font-extrabold px-6 py-4 rounded-2xl shadow-soft transition-all duration-300"
            >
              Get Started Now <ArrowRight size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 border border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white font-extrabold px-6 py-4 rounded-2xl transition-all duration-300"
            >
              <MessageSquare size={18} /> Contact Sales
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
