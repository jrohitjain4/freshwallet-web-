import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Rajesh Sharma',
    role: 'Owner, Sharma Kirana Store',
    text: 'Accepting payments is now extremely simple. Earlier, matching collections was a pain. Now, the instant notification and dashboard keep everything sorted. Recommended for every retailer!',
    initials: 'RS',
  },
  {
    name: 'Pooja Patel',
    role: 'Founder, Patel Clothing Studio',
    text: 'Integrating the online gateway took less than an hour. The customer checkout experience is premium, and settlements are incredibly fast. We saw a 15% increase in conversions.',
    initials: 'PP',
  },
  {
    name: 'Amit Kumar',
    role: 'Managing Partner, Kumar Auto Solutions',
    text: 'Managing permissions for multiple cashiers across our branches is very easy. The analytics panel helps us track peak store times and daily settlements directly to our account.',
    initials: 'AK',
  },
];

export default function Testimonials() {
  return (
    <section className="relative w-full bg-white py-24 px-6 sm:px-12 overflow-hidden select-none">
      
      {/* Background radial effects */}
      <div className="absolute top-[30%] left-[-10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[90px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[30%] right-[-10%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[90px] -z-10 animate-pulse-slow-reverse" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-orange-50 px-3.5 py-1.5 rounded-full">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mt-4 mb-4 tracking-tight">
            Loved by merchants across India
          </h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Read what other business owners, startups, and enterprises say about using FreshWallet.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ 
                y: -6,
                boxShadow: '0 20px 40px rgba(255, 107, 0, 0.04)',
              }}
              className="relative flex flex-col p-8 rounded-[24px] border border-orange-100/50 bg-light-bg/30 backdrop-blur-sm shadow-soft transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/10" />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-orange-400 text-orange-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>

              {/* Profile details */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-xs flex items-center justify-center shadow-soft">
                  {t.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-navy">{t.name}</span>
                  <span className="text-[10px] font-semibold text-gray-500">{t.role}</span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
