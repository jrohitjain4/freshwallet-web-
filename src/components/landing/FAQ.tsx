import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'When did FreshWallet have its Initial Public Offer (IPO) and at what price?',
      answer: 'FreshWallet went public on 15 Nov, 2021 with an issue price of ₹980 per share and listing price of ₹1150 per share.',
    },
    {
      question: 'What is the Corporate Identification Number of the company?',
      answer: 'Corporate Identification Number (CIN) is L51909HR2008PLC037998.',
    },
    {
      question: 'What is the ISIN Code of the company?',
      answer: 'ISIN Code of the company is INE417T01026.',
    },
    {
      question: 'On which Stock Exchanges are the shares of FreshWallet listed and traded?',
      answer: 'The equity shares of the Company are listed and traded at National Stock Exchange of India Ltd. (NSE: FRESHWALLET) and Bombay Stock Exchange Ltd. (BSE: 543390).',
    },
    {
      question: 'What is the Registered Office and Corporate Office Address of the Company?',
      answer: 'Company has the same registered and corporate office: FreshWallet Limited, Plot 119, Sector 44, Gurugram- 122001, Haryana, India.',
    },
    {
      question: 'What is the face value of the Shares of the Company?',
      answer: 'Face Value of the equity shares of the Company is ₹2 per share.',
    },
    {
      question: 'What is the Financial Year of the Company?',
      answer: 'The Company’s financial year runs from 1st April to 31st March.',
    },
  ];

  return (
    <section id="faqs" className="w-full bg-white py-20 px-4 sm:px-8 lg:px-16 border-b border-gray-100">
      <div className="max-w-6xl mx-auto text-left space-y-8">
        
        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl font-black text-[#1a2b49] tracking-tight">
          FAQs
        </h2>

        {/* Clean Questions List matching Image 2 */}
        <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="py-4">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Play size={10} className={`fill-primary text-primary transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    <span className="text-sm sm:text-base font-medium text-gray-800 group-hover:text-primary transition-colors">
                      {faq.question}
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="pl-6 pt-3 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* View all FAQs button */}
        <div>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary hover:bg-orange-600 text-white font-bold text-sm px-7 py-3 rounded-lg transition-all cursor-pointer shadow-sm"
          >
            View all FAQs
          </button>
        </div>

      </div>
    </section>
  );
}
