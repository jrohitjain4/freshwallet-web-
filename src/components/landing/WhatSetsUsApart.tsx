import { motion } from 'framer-motion';

import img01 from '../../assets/apart/consumer-friendly.png';
import img02 from '../../assets/apart/proprietary.png';
import img03 from '../../assets/apart/service-and-responsiveness.png';
import img04 from '../../assets/apart/collaborative-partner.png';
import img05 from '../../assets/apart/asset-light.png';

export default function WhatSetsUsApart() {
  const items = [
    {
      num: '01',
      title: 'Trusted, merchant-centric payment ecosystem',
      desc: 'We provide a comprehensive, secure, and zero-fee UPI collection system alongside instant supplier payout features. Through our merchant-first philosophy, we have built a platform trusted by businesses across India to run their daily billing operations.',
      colorBar: 'bg-[#FF6B00]',
      image: img01,
      reverse: false,
    },
    {
      num: '02',
      title: 'Proprietary ledger and instant settlement technology',
      desc: 'Our proprietary payment routing and automated ledger stack streamlines cash flow management. By automating payment verification and dynamic QR generation, we ensure high transaction success rates and immediate account reconciliation.',
      colorBar: 'bg-[#10b981]',
      image: img02,
      reverse: true,
    },
    {
      num: '03',
      title: 'Unmatched service speed and T+0 settlements',
      desc: 'We prioritize liquidity for small businesses and merchants. With automated T+0 settlement cycles, funds collected via UPI are directly transferred to your registered bank account on the same day without delays.',
      colorBar: 'bg-[#8b5cf6]',
      image: img03,
      reverse: false,
    },
    {
      num: '04',
      title: 'Collaborative banking and payment integrations',
      desc: 'Through direct integrations with leading payment gateways and authorized banking partners, we offer robust payouts and multi-channel collection interfaces. This enables lower costs, minimal downtime, and higher transaction limits for your business.',
      colorBar: 'bg-[#f59e0b]',
      image: img04,
      reverse: true,
    },
    {
      num: '05',
      title: 'Advanced risk monitoring and compliance safeguards',
      desc: 'Our platform employs real-time fraud monitoring, secure AES-256 data protection, and automated AML/KYC checks. We ensure your business transactions remain compliant with regulatory standards while safeguarding your funds.',
      colorBar: 'bg-[#f97316]',
      image: img05,
      reverse: false,
    },
  ];

  return (
    <section id="what-sets-us-apart" className="w-full bg-white py-20 px-4 sm:px-8 lg:px-16 border-b border-gray-100">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Heading matching screenshot */}
        <div className="text-left">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1a2b49] tracking-tight">
            What sets us apart
          </h2>
        </div>

        {/* 5 Alternating Items with exact illustrations */}
        <div className="space-y-16 sm:space-y-20">
          {items.map((item) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 ${
                item.reverse ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Text Side */}
              <div className="w-full lg:w-1/2 text-left space-y-3">
                <span className="text-3xl font-light text-orange-300 tracking-wider">
                  {item.num}
                </span>
                
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1a2b49] leading-snug">
                    {item.title}
                  </h3>
                  <div className={`w-12 h-1 mt-2 mb-3 rounded-full ${item.colorBar}`} />
                </div>

                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              {/* Illustration Side */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="w-full max-w-sm sm:max-w-md flex justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-auto max-h-64 sm:max-h-72 object-contain select-none"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
