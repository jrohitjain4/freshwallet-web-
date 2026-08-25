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
                Our FreshWallet platform offerings address the large and highly under penetrated online insurance and lending markets.
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
                  Get easy access to insurance, credit & other financial products
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                  We aim to create awareness amongst Indian households about the financial impact of death, disease, and damage.
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
                  We seek to increase transparency for consumers
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                  Through our consumer-centric approach, we seek to enable online research-based purchases of insurance and lending products. This helps consumers to make informed choices.
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
                We are not only limited to making things easy for consumers
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                We also facilitate our Insurer and Lending partners in the financial services industry to innovate & design customised products for Consumers leveraging our extensive data insights and data analytics capabilities.
              </p>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
