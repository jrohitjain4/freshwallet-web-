import { motion } from 'framer-motion';

const STATS = [
  {
    value: '10M+',
    label: 'Registered Merchants',
    sub: 'Empowering retail shops across 18,000+ pincodes',
    percent: 94,
  },
  {
    value: '₹50,000 Cr+',
    label: 'Annual Transaction Volume',
    sub: 'Processed securely via UPI, QR, and POS',
    percent: 96,
  },
  {
    value: '₹12,000 Cr+',
    label: 'Credit & Loans Facilitated',
    sub: 'Disbursed to MSMEs and local retailers',
    percent: 88,
  },
  {
    value: '99.98%',
    label: 'Gateway & Cloud Uptime',
    sub: 'Bank-grade multi-switch resilience',
    percent: 99,
  },
];

export default function Stats() {
  return (
    <section className="relative w-full bg-gradient-to-r from-primary via-orange-600 to-secondary py-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      
      {/* Decorative background shapes */}
      <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-50%] right-[-20%] w-[600px] h-[600px] bg-black/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-14 text-white">
          <span className="text-xs uppercase tracking-widest font-extrabold bg-white/20 px-3.5 py-1.5 rounded-full">
            Our Scale & Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-3 tracking-tight">
            Transforming Bharat&#39;s Financial Backbone
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col text-left text-white bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-lg"
            >
              {/* Stat Value */}
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight mb-1.5 text-white">
                {stat.value}
              </h3>
              
              {/* Stat Label */}
              <span className="text-sm font-bold text-white mb-1">
                {stat.label}
              </span>

              {/* Subtitle */}
              <span className="text-xs font-normal text-white/70 mb-6">
                {stat.sub}
              </span>

              {/* Progress bar container */}
              <div className="mt-auto">
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stat.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                    className="bg-white h-full rounded-full"
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-white/60">Performance Index</span>
                  <span className="text-[10px] font-bold text-white">{stat.percent}%</span>
                </div>
              </div>

            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
