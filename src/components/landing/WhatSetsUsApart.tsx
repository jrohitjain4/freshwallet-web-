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
      title: 'Strong, consumer friendly brands',
      desc: 'We offer wide choice, transparency and the ability for Consumers to research and access insurance and personal credit products offered by our Insurer and Lending Partners. Through our Consumer-centric approach, we have created strong brands which are recognised throughout India.',
      colorBar: 'bg-[#FF6B00]',
      image: img01,
      reverse: false,
    },
    {
      num: '02',
      title: 'Our Proprietary Technology, Data and Intelligence Stack',
      desc: 'Our proprietary technology stack helps us design user-friendly Consumer journeys across all of our processes by automating various aspects across the product value chain We also leverage technology to provide high quality consumer service.',
      colorBar: 'bg-[#10b981]',
      image: img02,
      reverse: true,
    },
    {
      num: '03',
      title: 'Service and Responsiveness',
      desc: 'We provide convenient servicing options to our Consumers using technology integrations with our insurer and lending Partners, supported by our experienced, qualified and knowledgeable staff.',
      colorBar: 'bg-[#8b5cf6]',
      image: img03,
      reverse: false,
    },
    {
      num: '04',
      title: 'Collaborative partner for Insurer and Lending Partners',
      desc: 'In addition to providing our partners with a low cost platform to target the right customers, we leverage our technology and insights to help our partners improve their risk assessment models, fraud detection and underwriting capabilities as well as help them create customised products. The consumer acquisition cost for our Insurer and Lending Partners is one of the lowest through our platforms.',
      colorBar: 'bg-[#f59e0b]',
      image: img04,
      reverse: true,
    },
    {
      num: '05',
      title: 'Asset light capital strategy',
      desc: 'We have an asset-light capital strategy and do not underwrite any insurance or retain any credit risk on our books.',
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
