import { motion, type Variants } from 'framer-motion';
import { 
  Smartphone, 
  QrCode, 
  Globe, 
  Zap, 
  BarChart4, 
  ShieldCheck 
} from 'lucide-react';

const FEATURES = [
  {
    icon: Smartphone,
    title: 'UPI Payments',
    description: 'Accept instant peer-to-peer payments via any UPI application (GPay, PhonePe, Paytm) securely with zero fee limits.',
  },
  {
    icon: QrCode,
    title: 'QR Code Payments',
    description: 'Generate dynamic or static QR stands for counter payments. Auto-synced audio confirmation notifications supported.',
  },
  {
    icon: Globe,
    title: 'Payment Gateway',
    description: 'Integrate custom APIs and SDKs to process Cards, NetBanking, and Wallets on your web or mobile store seamlessly.',
  },
  {
    icon: Zap,
    title: 'Instant Settlements',
    description: 'Get earnings transferred directly to your registered bank account instantly. Multiple daily cycle schedules available.',
  },
  {
    icon: BarChart4,
    title: 'Business Dashboard',
    description: 'Track daily collections, monitor cash flow trends, manage employee page permissions, and download GST reports.',
  },
  {
    icon: ShieldCheck,
    title: 'Advanced Security',
    description: 'Protected with industry-grade AES-256 data encryption and real-time transaction fraud detection algorithms.',
  },
];

export default function Features() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative w-full bg-light-bg py-24 px-6 sm:px-12">
      {/* Background blobs */}
      <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[100px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse-slow-reverse" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-orange-50 px-3.5 py-1.5 rounded-full">
            Our Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mt-4 mb-4 tracking-tight">
            Everything your business needs to manage payments
          </h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Accept online and offline payments, track analytics in real-time, and settle earnings directly to your bank account with premium technology.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {FEATURES.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -8,
                  boxShadow: '0 20px 40px rgba(255, 107, 0, 0.06)',
                }}
                className="relative group bg-white p-8 rounded-[24px] border border-orange-100/50 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Border Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Icon Container */}
                <div className="relative z-10 h-12 w-12 rounded-2xl bg-orange-50 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={24} />
                </div>

                {/* Title */}
                <h3 className="relative z-10 text-lg font-bold text-navy mb-3">
                  {feat.title}
                </h3>

                {/* Description */}
                <p className="relative z-10 text-sm text-gray-500 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
