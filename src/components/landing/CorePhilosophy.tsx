import { motion } from 'framer-motion';
import easyIcon from '../../assets/products/easy.svg';
import transIcon from '../../assets/products/trans.svg';
import limitedIcon from '../../assets/products/limited.svg';

export default function CorePhilosophy() {
  return (
    <section id="what-we-do" className="w-full bg-[#f4f7fc] py-20 px-4 sm:px-8 lg:px-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Title & Sub-text with vertical green/orange bar */}
          <div className="lg:col-span-5 text-left space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a2b49] leading-[1.2] tracking-tight">
              Leveraging the power of technology, data and innovation
            </h2>

            <div className="border-l-4 border-primary pl-4 py-1">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal">
                Our FreshWallet platform offers merchants and businesses a unified payment suite to collect instant payments and process automated daily payouts.
              </p>
            </div>
          </div>

          {/* Right Column: 3 Cards matching exact PB Fintech layout */}
          <div className="lg:col-span-7 space-y-5">
            {/* Top Row: 2 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Card 1: Easy Access */}
              <motion.div 
                whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.06)' }}
                className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-gray-100 flex flex-col text-left transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">
                  <img src={easyIcon} alt="Easy Access" className="w-6 h-6 object-contain" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#1a2b49] mb-3 leading-snug">
                  Accept payments instantly with dynamic UPI QRs
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                  Generate custom dynamic UPI QR codes and accept payments instantly from any UPI app (GPay, PhonePe, Paytm) with zero processing fees.
                </p>
              </motion.div>

              {/* Card 2: Transparency */}
              <motion.div 
                whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.06)' }}
                className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-gray-100 flex flex-col text-left transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-5">
                  <img src={transIcon} alt="Transparency" className="w-6 h-6 object-contain" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#1a2b49] mb-3 leading-snug">
                  Real-time ledger and cash flow analytics
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                  Track every credit and debit transaction in real-time, monitor daily revenue trends, view commission splits, and easily reconcile payments.
                </p>
              </motion.div>

            </div>

            {/* Bottom Row: 1 Full-width Card */}
            <motion.div 
              whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.06)' }}
              className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-gray-100 flex flex-col text-left transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-5">
                <img src={limitedIcon} alt="Partnership" className="w-6 h-6 object-contain" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#1a2b49] mb-3 leading-snug">
                Streamline supplier payments and automated settlements
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                Distribute payouts directly to bank accounts or UPI IDs. Set up instant settlements (T+0 cycle) to maintain healthy business liquidity and avoid payment delays.
              </p>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
