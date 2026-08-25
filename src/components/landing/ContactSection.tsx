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
              <p className="font-bold text-sm text-[#1a2b49]">Mohit Khobragade</p>
              <p className="text-gray-500">Head, Investor Relations</p>
              <a href="mailto:investor.relations@freshwallet.in" className="text-primary hover:underline block font-semibold pt-2">
                investor.relations@freshwallet.in
              </a>
            </div>

            {/* Block 2: Compliance officer */}
            <div className="space-y-2 text-xs text-gray-600">
              <div className="w-full h-1 bg-[#8b5cf6] rounded-full mb-4" />
              <p className="text-gray-400 font-medium">Compliance officer:</p>
              <p className="font-bold text-sm text-[#1a2b49]">Bhasker Joshi</p>
              <p className="text-gray-500">Company Secretary & Compliance Officer</p>
              <a href="mailto:complianceofficer@freshwallet.in" className="text-primary hover:underline block font-semibold">
                complianceofficer@freshwallet.in
              </a>
              <p>Contact No. 0124-4562907</p>
              <p>Fax: 0124-4562902</p>
              <p className="text-[11px] text-gray-400 pt-2 leading-relaxed">
                **For Redressal of Investor Grievances you may contact the Compliance Officer.
              </p>
            </div>

            {/* Block 3: Registered address */}
            <div className="space-y-2 text-xs text-gray-600">
              <div className="w-full h-1 bg-[#10b981] rounded-full mb-4" />
              <p className="text-gray-400 font-medium">Registered address:</p>
              <p className="font-bold text-sm text-[#1a2b49]">FreshWallet Limited</p>
              <p>Plot 119, Sector 44, Gurugram- 122001, Haryana</p>
              <p>Phone No: 0124-4562907</p>
              <p>Fax: 0124-4562907</p>
            </div>

          </div>

          {/* Paper plane subtle decoration */}
          <div className="absolute bottom-6 right-8 opacity-20 pointer-events-none hidden sm:block">
            <Send size={48} className="text-primary" />
          </div>

        </div>

        {/* Footnote text matching Image 2 */}
        <p className="text-xs text-gray-500 text-center max-w-4xl mx-auto leading-relaxed font-normal">
          The company was incorporated as &quot;DocOnline Marketing and Consulting Pvt. Ltd.&quot; on June 4, 2008 under the Companies Act, 1956. The company name was changed to &quot;FreshWallet Pvt. Ltd.&quot; on September 18, 2020, to emphasise the nature of our fintech business and subsequently converted to a public limited company on June 30, 2021.
        </p>

      </div>
    </section>
  );
}
