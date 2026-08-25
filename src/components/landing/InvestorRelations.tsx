import { useNavigate } from 'react-router-dom';
import pbIcon1 from '../../assets/apart/pb-icon1.png';
import pbIcon2 from '../../assets/apart/pb-icon2.png';
import paisaIcon1 from '../../assets/apart/paisa-icon1.png';
import paisaIcon2 from '../../assets/apart/paisa-icon2.png';

export default function InvestorRelations() {
  const navigate = useNavigate();

  return (
    <section id="stats" className="w-full bg-[#f4f7fc] py-20 px-4 sm:px-8 lg:px-16 border-b border-gray-100">
      <div className="max-w-6xl mx-auto text-left space-y-10">
        
        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl font-black text-[#1a2b49] tracking-tight">
          Investor relations
        </h2>

        {/* 2-Column Metrics Card matching Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Column 1: Insurance Platform */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-primary tracking-tight">
                FreshWallet Insurance
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            </div>

            <div className="space-y-5">
              {/* Stat 1 */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <img src={pbIcon1} alt="Insurance Premium" className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Insurance Premium</p>
                  <div className="text-2xl sm:text-3xl font-black text-[#1a2b49]">
                    ₹355* Bn <span className="text-xs font-normal text-gray-500">(Q1FY27 ARR)</span>
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <img src={pbIcon2} alt="Policies Sold" className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Insurance Policies Sold</p>
                  <div className="text-2xl sm:text-3xl font-black text-[#1a2b49]">
                    71.6 Mn <span className="text-xs font-normal text-gray-500">(Till June 2026)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Lending & Credit Platform */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-primary tracking-tight">
                FreshWallet Lending
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            </div>

            <div className="space-y-5">
              {/* Stat 3 */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <img src={paisaIcon1} alt="Loan Disbursals" className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Loan Disbursals</p>
                  <div className="text-2xl sm:text-3xl font-black text-[#1a2b49]">
                    ₹175 Bn <span className="text-xs font-normal text-gray-500">(Q1FY27 ARR)</span>
                  </div>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <img src={paisaIcon2} alt="Credit Score Customers" className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Credit Score Customers</p>
                  <div className="text-2xl sm:text-3xl font-black text-[#1a2b49]">
                    60.6 Mn <span className="text-xs font-normal text-gray-500">(Till June 2026)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footnote and View reports button */}
        <div className="space-y-5 pt-4">
          <p className="text-xs text-gray-400 font-normal">
            *India Insurance Premium numbers exclude GST
          </p>

          <div>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary hover:bg-orange-600 text-white font-bold text-sm px-7 py-3 rounded-lg transition-all cursor-pointer shadow-sm"
            >
              View reports
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
