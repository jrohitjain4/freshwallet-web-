import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I start accepting UPI payments on FreshWallet?',
      answer: 'You can instantly start accepting payments by generating a dynamic or static QR code from your dashboard. Customers can scan the QR code using any UPI app (GPay, PhonePe, Paytm, BHIM) to pay.',
    },
    {
      question: 'What are the charges for UPI payment collections?',
      answer: 'FreshWallet offers zero-fee (0%) processing on all UPI QR code and soundbox collections, helping you save 100% on transaction charges.',
    },
    {
      question: 'When will the collected funds be settled to my bank account?',
      answer: 'All collections are settled automatically on the same day (T+0 cycle) directly into your registered bank account. You can view details of the next scheduled settlement on your dashboard.',
    },
    {
      question: 'How do payouts and supplier payments work?',
      answer: 'You can load money into your FreshWallet account via secure payment options and use it to instantly send payouts directly to any bank account or UPI ID.',
    },
    {
      question: 'How can I track my business expenses and download GST reports?',
      answer: 'You can log business outflows under the "Add Expense" tab. Reconciled ledgers and itemized statements can be downloaded as GST-compliant reports from the dashboard for easy tax filing.',
    },
    {
      question: 'Is my business data and transactions secure on FreshWallet?',
      answer: 'Yes. FreshWallet uses bank-grade AES-256 data encryption, multi-factor verification, and real-time transaction fraud monitoring to keep your account, data, and payouts completely secure.',
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
