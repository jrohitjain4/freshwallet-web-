import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export default function PartnerEcosystem() {
  const [showAll, setShowAll] = useState(false);

  const initialPartners = [
    'HDFC ERGO General Insurance',
    'HDFC Life Insurance',
    'ICICI Lombard General Insurance',
    'ICICI Prudential Life Insurance',
    'SBI General Insurance',
    'SBI Life Insurance',
    'Tata AIG General Insurance',
    'Tata AIA Life Insurance',
    'Star Health & Allied Insurance',
    'Bajaj Allianz General Insurance',
    'Bajaj Allianz Life Insurance',
    'Max Life Insurance',
    'Care Health Insurance',
    'Digit General Insurance',
    'Kotak Mahindra Life Insurance',
    'Aditya Birla Health Insurance',
  ];

  const extraPartners = [
    'Niva Bupa Health Insurance',
    'Canara HSBC Life Insurance',
    'Bharti AXA Life Insurance',
    'Chola MS General Insurance',
    'ManipalCigna Health Insurance',
    'New India Assurance',
    'United India Insurance',
    'Oriental Insurance',
    'National Insurance',
    'Universal Sompo General Insurance',
    'Liberty General Insurance',
    'Future Generali India Insurance',
    'Shriram General Insurance',
    'Reliance General Insurance',
    'Raheja QBE General Insurance',
    'Star Union Dai-ichi Life Insurance',
    'PNB MetLife Insurance',
    'IndiaFirst Life Insurance',
    'ZUNO Health Insurance',
    'Life Insurance Corporation of India (LIC)',
  ];

  const displayedPartners = showAll ? [...initialPartners, ...extraPartners] : initialPartners;

  return (
    <section className="w-full bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-orange-400 bg-white/10 px-3.5 py-1.5 rounded-full mb-3">
            <Building2 size={13} /> Institutional Network
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Our Insurance & Lending Partners
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Collaborating with India&#39;s premier insurance providers and financial institutions to bring transparent choices to millions.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          <AnimatePresence>
            {displayedPartners.map((partner, idx) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: (idx % 8) * 0.03 }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl flex items-center gap-2.5 transition-all text-left group"
              >
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 group-hover:scale-125 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold text-white/90 group-hover:text-white line-clamp-2">
                  {partner}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View All Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-primary hover:bg-orange-600 px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-soft"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp size={15} />
              </>
            ) : (
              <>
                View All Partners ({initialPartners.length + extraPartners.length}+) <ChevronDown size={15} />
              </>
            )}
          </button>
        </div>

        {/* Compliance Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 text-xs text-white/50">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck size={14} /> IRDAI Licensed Partner Network
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-orange-400">
            <ShieldCheck size={14} /> RBI Regulated Banking & NBFC Gateways
          </span>
        </div>

      </div>
    </section>
  );
}
