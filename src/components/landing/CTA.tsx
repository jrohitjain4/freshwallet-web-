import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, UserCheck, Sparkles, ShieldCheck } from 'lucide-react';

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 select-none overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-navy via-slate-900 to-navy text-white rounded-3xl p-8 sm:p-14 text-center overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Background shapes */}
          <div className="absolute top-[-40%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-40%] left-[-10%] w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-xs font-bold text-orange-400 mb-6 backdrop-blur-md">
            <Sparkles size={13} /> Ready to elevate your financial life?
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-5 tracking-tight leading-tight relative z-10 max-w-3xl mx-auto text-white">
            Join India&#39;s Fastest Growing Financial Network
          </h2>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed relative z-10 font-normal">
            Start accepting zero-fee QR payments, enable soundbox audio confirmations, unlock collateral-free working capital, and safeguard your store today.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 relative z-10">
            <motion.button
              whileHover={{ 
                scale: 1.04,
                boxShadow: '0 12px 30px rgba(255, 107, 0, 0.35)'
              }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-orange-600 hover:to-primary text-white font-extrabold px-8 py-4 rounded-2xl shadow-premium transition-all duration-200 cursor-pointer text-base"
            >
              <UserCheck size={18} /> Portal Login
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/register/welcome')}
              className="flex items-center gap-2 border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 text-white font-bold px-7 py-4 rounded-2xl transition-all duration-200 cursor-pointer text-base backdrop-blur-sm"
            >
              Open Free Account <ArrowRight size={16} />
            </motion.button>
          </div>

          {/* Bottom Security Note */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-6 text-xs text-white/50">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck size={14} /> 100% RBI & NPCI Partner Compliant
            </span>
            <span>•</span>
            <span>No Setup or Monthly Hidden Charges</span>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
