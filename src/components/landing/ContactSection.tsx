import { Send } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="contact" className="w-full bg-[#f4f7fc] py-20 px-4 sm:px-8 lg:px-16 border-b border-gray-100">
      <div className="max-w-6xl mx-auto space-y-12 text-left">
        
        {/* Contact Us Card matching Image 2 */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200/80 relative overflow-hidden space-y-8">
          
          <h2 className="text-3xl sm:text-4xl font-black text-[#1a2b49] tracking-tight">
            Contact Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            
            {/* Block 1: Write to us at */}
            <div className="space-y-2 text-xs text-gray-600">
              <div className="w-full h-1 bg-[#FF6B00] rounded-full mb-4" />
              <p className="text-gray-400 font-medium">Write to us at:</p>
              <p className="font-bold text-sm text-[#1a2b49]">Krishna Kumawat</p>
              <a href="mailto:krishna@freshwallet.in" className="text-primary hover:underline block font-semibold pt-1">
                krishna@freshwallet.in
              </a>
              <a href="tel:+919672863054" className="text-gray-700 hover:text-primary block font-medium">
                Phone: +91 96728 63054
              </a>
            </div>

            {/* Block 2: Compliance officer */}
            <div className="space-y-2 text-xs text-gray-600">
              <div className="w-full h-1 bg-[#8b5cf6] rounded-full mb-4" />
              <p className="text-gray-400 font-medium">Compliance officer:</p>
              <p className="font-bold text-sm text-[#1a2b49]">Gaurav Mahawar</p>
              <a href="mailto:gaurav@freshwallet.in" className="text-primary hover:underline block font-semibold pt-1">
                gaurav@freshwallet.in
              </a>
              <p>Contact No. +91 96604 23839</p>
              <p className="text-[11px] text-gray-400 pt-2 leading-relaxed">
                **For Redressal of Investor Grievances you may contact the Compliance Officer.
              </p>
            </div>

            {/* Block 3: Registered address */}
            <div className="space-y-2 text-xs text-gray-600">
              <div className="w-full h-1 bg-[#10b981] rounded-full mb-4" />
              <p className="text-gray-400 font-medium">Registered address:</p>
              <p className="font-bold text-sm text-[#1a2b49]">FreshWallet Limited</p>
              <p>SF-44B, JTM mall, Opposite railway apartments, Jagatpura, Jaipur</p>
              <p>Phone No: +91 96728 63054 / +91 96604 23839</p>
            </div>

          </div>

          {/* Paper plane subtle decoration */}
          <div className="absolute bottom-6 right-8 opacity-20 pointer-events-none hidden sm:block">
            <Send size={48} className="text-primary" />
          </div>

        </div>

        {/* Footnote text */}
        <p className="text-xs text-gray-500 text-center max-w-4xl mx-auto leading-relaxed font-normal">
          The company was incorporated as &quot;FreshWallet Private Limited&quot; on August 24, 2026.
        </p>

      </div>
    </section>
  );
}
