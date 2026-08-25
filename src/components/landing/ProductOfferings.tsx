import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import udyamAadhaarIcon from '../../assets/products/udyam-aadhaar-icon.svg';
import shareMarketIcon from '../../assets/products/share-market-icon.svg';
import onlinePurchasingIcon from '../../assets/products/online-purchasing-icon.svg';
import eMitraIcon from '../../assets/products/e-mitra-icon.svg';

export default function ProductOfferings() {
  const navigate = useNavigate();

  const offerings = [
    { name: 'Udyam Aadhaar', icon: udyamAadhaarIcon, tag: 'MSME Business' },
    { name: 'Share Market', icon: shareMarketIcon, tag: 'Stocks & Demat' },
    { name: 'Online Purchasing', icon: onlinePurchasingIcon, tag: 'Flipkart & Amazon' },
    { name: 'E-Mitra Services', icon: eMitraIcon, tag: 'Citizen Portal' },
  ];

  const groupBrands = [
    { name: 'FreshWallet Udyam & MSME', badge: 'Business ID' },
    { name: 'FreshWallet Share Market', badge: 'Trading' },
    { name: 'FreshWallet Online Shopping', badge: 'E-Commerce' },
    { name: 'FreshWallet E-Mitra', badge: 'Citizen Kiosk' },
    { name: 'FreshWallet Pay & QR', badge: 'Merchant' },
  ];

  return (
    <section id="offerings" className="w-full bg-white py-20 px-4 sm:px-8 lg:px-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Top Part: Offerings Header & Grid matching exact screenshot layout */}
        <div className="text-left space-y-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2b49] tracking-tight">
            FreshWallet&#39;s Offerings
          </h2>

          {/* Cards Grid matching screenshot layout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {offerings.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -4, boxShadow: '0 10px 24px rgba(0,0,0,0.06)' }}
                onClick={() => navigate('/login')}
                className="relative bg-orange-50/40 hover:bg-orange-100/60 border border-orange-100/80 hover:border-orange-300 rounded-2xl p-6 flex flex-col items-center justify-between text-center transition-all cursor-pointer min-h-[160px] group"
              >
                {/* Optional Tag Badge */}
                {item.tag && (
                  <span className="absolute -top-2.5 bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                    {item.tag}
                  </span>
                )}

                {/* Product Icon */}
                <div className="w-16 h-16 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <img src={item.icon} alt={item.name} className="max-w-full max-h-full object-contain" />
                </div>

                {/* Product Name */}
                <span className="text-sm sm:text-base font-bold text-[#1a2b49] group-hover:text-primary transition-colors leading-tight">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Part: Group Brands matching screenshot */}
        <div className="text-left pt-6 border-t border-gray-100 space-y-6">
          <h3 className="text-xl font-bold text-[#1a2b49] tracking-tight">
            Group Brands
          </h3>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {groupBrands.map((brand) => (
              <motion.div
                key={brand.name}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate('/login')}
                className="bg-gray-50 hover:bg-orange-50/60 border border-gray-200/80 hover:border-orange-200 px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs sm:text-sm font-bold text-[#1a2b49]">
                  {brand.name}
                </span>
                <span className="text-[10px] bg-gray-200/80 text-gray-700 px-1.5 py-0.5 rounded-md font-semibold">
                  {brand.badge}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
