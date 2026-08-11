import { motion } from 'framer-motion';
import { 
  Wallet, 
  QrCode, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  Shield, 
  CreditCard as CardIcon, 
  IndianRupee,
  History,
  Smartphone,
  ChevronRight
} from 'lucide-react';

export default function PhoneMockup() {
  // Animation configurations for different floating elements
  const floatTransition = (delay = 0) => ({
    y: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut' as const,
      delay,
    },
  });

  return (
    <div className="relative w-full max-w-[500px] h-[650px] mx-auto flex items-center justify-center select-none">
      
      {/* Background glow effects */}
      <div className="absolute w-[350px] h-[350px] bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse-slow" />
      <div className="absolute w-[250px] h-[250px] bg-secondary/15 rounded-full blur-[80px] -z-10 animate-pulse-slow-reverse" />

      {/* ========================================================================= */}
      {/* 3D FLOATING OUTSIDE CARDS                                                 */}
      {/* ========================================================================= */}

      {/* 1. Payment Successful (Top Left) */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={floatTransition(0)}
        className="absolute top-10 left-[-40px] z-20 flex items-center gap-3 glass-card px-4 py-3 rounded-2xl shadow-soft border border-orange-100"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-500">
          <CheckCircle2 size={22} className="fill-green-500 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Payment Received</span>
          <span className="text-sm font-bold text-navy">₹2,450.00</span>
        </div>
      </motion.div>

      {/* 2. Revenue Card (Top Right) */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={floatTransition(0.5)}
        className="absolute top-4 right-[-30px] z-20 glass-card p-4 rounded-2xl shadow-soft border border-orange-100 w-44"
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Today's Revenue</span>
          <span className="text-xs text-green-500 bg-green-50 px-1.5 py-0.5 rounded-lg font-bold flex items-center">
            <TrendingUp size={10} className="mr-0.5" /> +18%
          </span>
        </div>
        <h3 className="text-xl font-extrabold text-navy">₹42,890</h3>
        <div className="w-full bg-gray-100 h-1 rounded-full mt-2 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary h-full w-[78%] rounded-full" />
        </div>
      </motion.div>

      {/* 3. Secure Shield (Middle Left) */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={floatTransition(1.2)}
        className="absolute top-[240px] left-[-70px] z-20 flex items-center gap-2.5 glass-card px-3.5 py-2.5 rounded-2xl shadow-soft border border-orange-100"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-primary">
          <Shield size={18} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-navy">100% Secure</span>
          <span className="text-[9px] text-gray-400">Bank-grade Encryption</span>
        </div>
      </motion.div>

      {/* 4. Credit Card (Middle Right) */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [2, -2, 2] }}
        transition={floatTransition(0.8)}
        className="absolute top-[280px] right-[-80px] z-20 bg-gradient-to-br from-navy to-gray-800 text-white p-4 rounded-2xl shadow-premium w-48 border border-white/10"
      >
        <div className="flex justify-between items-start mb-6">
          <CardIcon size={24} className="text-white/80" />
          <span className="text-[9px] font-mono tracking-widest text-white/50">PLATINUM</span>
        </div>
        <div className="text-xs font-medium tracking-widest mb-1.5 opacity-80">•••• •••• •••• 8432</div>
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[8px] opacity-40 uppercase">Merchant Card</span>
            <span className="text-[10px] font-bold">FreshWallet Business</span>
          </div>
          <span className="text-xs font-bold text-primary">VISA</span>
        </div>
      </motion.div>

      {/* 5. Daily Collection & QR Accepted (Bottom Left) */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={floatTransition(1.5)}
        className="absolute bottom-16 left-[-60px] z-20 glass-card p-3.5 rounded-2xl shadow-soft border border-orange-100 w-44"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
            <QrCode size={12} className="text-primary" />
          </div>
          <span className="text-[9px] font-bold text-navy">QR Payments</span>
        </div>
        <span className="text-[10px] text-gray-400">QR Accepted Status</span>
        <div className="text-sm font-extrabold text-navy mt-0.5 flex items-center text-green-600">
          <CheckCircle2 size={12} className="mr-1 fill-green-600 text-white" />
          Activated
        </div>
      </motion.div>

      {/* 6. Merchant Statistics (Bottom Right) */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={floatTransition(2)}
        className="absolute bottom-10 right-[-50px] z-20 glass-card p-4 rounded-2xl shadow-soft border border-orange-100 w-40"
      >
        <span className="text-[9px] text-gray-400 uppercase font-semibold">Active Terminals</span>
        <div className="text-2xl font-black text-navy mt-1">12</div>
        <span className="text-[9px] text-green-500 font-bold bg-green-50 px-1 py-0.5 rounded">All systems online</span>
      </motion.div>

      {/* ========================================================================= */}
      {/* CENTRAL PHONE MOCKUP                                                     */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-[290px] h-[580px] bg-navy rounded-[40px] p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.4)] border-4 border-gray-800"
      >
        {/* Notch */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-black rounded-full z-30 flex justify-center items-center">
          <div className="w-3 h-3 rounded-full bg-gray-900 mr-8" />
          <div className="w-10 h-1 bg-gray-800 rounded-full" />
        </div>

        {/* Screen Content */}
        <div className="w-full h-full bg-white rounded-[32px] overflow-hidden flex flex-col pt-8 px-4 select-none relative">
          
          {/* Internal Header */}
          <div className="flex justify-between items-center mb-4 mt-1">
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-[10px] font-black text-primary">F</span>
              </div>
              <span className="text-[10px] font-extrabold text-navy">FreshWallet</span>
            </div>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>

          {/* Wallet Balance Card */}
          <div className="bg-gradient-to-br from-primary to-secondary text-white p-4 rounded-3xl shadow-md mb-4 relative overflow-hidden">
            <div className="absolute top-[-10px] right-[-10px] w-20 h-20 bg-white/10 rounded-full blur-xl" />
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-medium opacity-80 flex items-center gap-1">
                <Wallet size={10} /> Wallet Balance
              </span>
              <Smartphone size={10} className="opacity-60" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <IndianRupee size={16} className="font-extrabold" />
              <span className="text-2xl font-black tracking-tight">1,84,320.50</span>
            </div>
            <span className="text-[8px] opacity-70 mt-1 block">Auto settlement enabled</span>
          </div>

          {/* Core App Actions */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Scan & Pay */}
            <div className="bg-orange-50 border border-orange-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-orange-100/50 transition-colors">
              <QrCode size={20} className="text-primary mb-1.5" />
              <span className="text-[10px] font-bold text-navy">Scan & Pay</span>
            </div>
            {/* Payment History */}
            <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100/50 transition-colors">
              <History size={20} className="text-gray-500 mb-1.5" />
              <span className="text-[10px] font-bold text-navy">History</span>
            </div>
          </div>

          {/* Analytics Summary */}
          <div className="bg-gray-50 border border-gray-100/80 p-3.5 rounded-2xl mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-navy">Weekly Overview</span>
              <ChevronRight size={10} className="text-gray-400" />
            </div>
            <div className="flex gap-2 items-end h-[60px] justify-between px-1">
              <div className="w-3 bg-primary/20 h-[30%] rounded-t-sm" />
              <div className="w-3 bg-primary/20 h-[50%] rounded-t-sm" />
              <div className="w-3 bg-primary/20 h-[40%] rounded-t-sm" />
              <div className="w-3 bg-primary/20 h-[65%] rounded-t-sm" />
              <div className="w-3 bg-primary h-[85%] rounded-t-sm" />
              <div className="w-3 bg-primary/40 h-[60%] rounded-t-sm" />
              <div className="w-3 bg-secondary h-[95%] rounded-t-sm" />
            </div>
          </div>

          {/* Recent Transactions List */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-navy">Recent Settlements</span>
              <span className="text-[8px] text-primary font-bold">View All</span>
            </div>
            
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-0.5">
              
              {/* Txn 1 */}
              <div className="flex justify-between items-center p-2 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                    <ArrowUpRight size={12} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-navy">HDFC Bank Settled</span>
                    <span className="text-[7px] text-gray-400">Today, 11:20 AM</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-green-600">+₹12,450</span>
              </div>

              {/* Txn 2 */}
              <div className="flex justify-between items-center p-2 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-orange-100 flex items-center justify-center text-primary">
                    <QrCode size={12} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-navy">Ramesh Store</span>
                    <span className="text-[7px] text-gray-400">Today, 09:15 AM</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-navy">₹2,450</span>
              </div>

              {/* Txn 3 */}
              <div className="flex justify-between items-center p-2 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-orange-100 flex items-center justify-center text-primary">
                    <QrCode size={12} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-navy">Karan Auto Parts</span>
                    <span className="text-[7px] text-gray-400">Yesterday</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-navy">₹1,180</span>
              </div>

            </div>
          </div>

        </div>
      </motion.div>

    </div>
  );
}
