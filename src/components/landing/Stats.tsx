import { motion } from 'framer-motion';

const STATS = [
  {
    value: '10M+',
    label: 'Onboarded Merchants',
    sub: 'Active shops across India',
    percent: 85,
  },
  {
    value: '₹50B+',
    label: 'Monthly Volume',
    sub: 'Processed value',
    percent: 92,
  },
  {
    value: '99.99%',
    label: 'Success Rate',
    sub: 'API & Gateway uptime',
    percent: 99,
  },
  {
    value: '24×7',
    label: 'Merchant Support',
    sub: 'Quick query resolutions',
    percent: 100,
  },
];

export default function Stats() {
  return (
    <section className="relative w-full bg-gradient-to-r from-primary to-secondary py-20 px-6 sm:px-12 overflow-hidden select-none">
      
      {/* Decorative background shapes */}
      <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-50%] right-[-20%] w-[600px] h-[600px] bg-black/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col text-left text-white bg-white/5 backdrop-blur-sm p-6 rounded-[24px] border border-white/10"
            >
              {/* Stat Value */}
              <h3 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
                {stat.value}
              </h3>
              
              {/* Stat Label */}
              <span className="text-sm font-bold opacity-90 mb-1">
                {stat.label}
              </span>

              {/* Subtitle */}
              <span className="text-xs font-medium opacity-60 mb-6">
                {stat.sub}
              </span>

              {/* Progress bar container */}
              <div className="mt-auto">
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stat.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    className="bg-white h-full rounded-full"
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold opacity-50">Performance index</span>
                  <span className="text-[10px] font-bold opacity-80">{stat.percent}%</span>
                </div>
              </div>

            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
