import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import termLifeIcon from '../../assets/products/term-life-icon.png';
import lifeInsuranceIcon from '../../assets/products/life-insurance-icon.svg';
import healthInsuranceIcon from '../../assets/products/health-insurance-icon.png';
import investmentIcon from '../../assets/products/investment-icon.png';
import carInsuranceIcon from '../../assets/products/car-insurance-icon.png';
import twoWheelerIcon from '../../assets/products/two-wheeler-insurance-icon.png';
import familyInsuranceIcon from '../../assets/products/family-insurance-icon.png';
import travelInsuranceIcon from '../../assets/products/travel-insurance-icon.png';
import termWomenIcon from '../../assets/products/term_insurance_women-term.png';
import guaranteedReturnIcon from '../../assets/products/guaranted-return-icon.png';
import childSavingIcon from '../../assets/products/child-saving-icon.png';
import retirementIcon from '../../assets/products/retirement-icon.png';
import homeInsuranceIcon from '../../assets/products/home-insurance-icon.png';

export default function ProductOfferings() {
  const navigate = useNavigate();

  const offerings = [
    { name: 'Term Insurance', icon: termLifeIcon, tag: null },
    { name: 'Life Insurance', icon: lifeInsuranceIcon, tag: null },
    { name: 'Health Insurance', icon: healthInsuranceIcon, tag: null },
    { name: 'Investment Plans', icon: investmentIcon, tag: 'In-Built Life Cover' },
    { name: 'Car Insurance', icon: carInsuranceIcon, tag: null },
    { name: '2 Wheeler Insurance', icon: twoWheelerIcon, tag: null },
    { name: 'Family Health Insurance', icon: familyInsuranceIcon, tag: null },
    { name: 'Travel Insurance', icon: travelInsuranceIcon, tag: null },
    { name: 'Term Insurance (Women)', icon: termWomenIcon, tag: null },
    { name: 'Guaranteed Return Plans', icon: guaranteedReturnIcon, tag: null },
    { name: 'Child Savings Plans', icon: childSavingIcon, tag: null },
    { name: 'Retirement Plans', icon: retirementIcon, tag: null },
    { name: 'Home Insurance', icon: homeInsuranceIcon, tag: null },
  ];

  const groupBrands = [
    { name: 'FreshWallet Insurance', badge: 'Flagship' },
    { name: 'FreshWallet Lending', badge: 'Credit' },
    { name: 'FreshWallet Pay & QR', badge: 'Merchant' },
    { name: 'FreshWallet SME', badge: 'MSME' },
    { name: 'FreshWallet Partners', badge: 'B2B' },
    { name: 'FreshWallet Pension', badge: 'Retirement' },
    { name: 'FreshWallet Money', badge: 'Personal' },
  ];

  return (
    <section id="offerings" className="w-full bg-white py-20 px-4 sm:px-8 lg:px-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Top Part: Offerings Header & Grid */}
        <div className="text-left space-y-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2b49] tracking-tight">
            FreshWallet&#39;s Offerings
          </h2>

          {/* 13 Cards Grid matching PB Fintech 2-row layout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 sm:gap-5">
            {offerings.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -4, boxShadow: '0 10px 24px rgba(0,0,0,0.06)' }}
                onClick={() => navigate('/login')}
                className="relative bg-orange-50/40 hover:bg-orange-100/60 border border-orange-100/80 hover:border-orange-300 rounded-2xl p-4 flex flex-col items-center justify-between text-center transition-all cursor-pointer min-h-[145px] group"
              >
                {/* Optional Tag Badge */}
                {item.tag && (
                  <span className="absolute -top-2.5 bg-emerald-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                    {item.tag}
                  </span>
                )}

                {/* Product Icon */}
                <div className="w-14 h-14 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <img src={item.icon} alt={item.name} className="max-w-full max-h-full object-contain" />
                </div>

                {/* Product Name */}
                <span className="text-xs font-bold text-[#1a2b49] group-hover:text-primary transition-colors leading-tight">
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
