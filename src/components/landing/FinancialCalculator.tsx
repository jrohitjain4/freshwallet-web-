import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowRight, Sparkles, TrendingUp, DollarSign } from 'lucide-react';

export default function FinancialCalculator() {
  const navigate = useNavigate();
  const [calculatorType, setCalculatorType] = useState<'savings' | 'loan'>('savings');

  // Loan State
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(13.5);

  // Savings State
  const [monthlyVolume, setMonthlyVolume] = useState<number>(300000);
  const [traditionalMdrPercent, setTraditionalMdrPercent] = useState<number>(1.8);

  // Loan calculations
  const monthlyRate = interestRate / 12 / 100;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );
  const totalRepayment = emi * tenureMonths;
  const totalInterest = totalRepayment - loanAmount;

  // Savings calculations
  const monthlySavings = Math.round((monthlyVolume * traditionalMdrPercent) / 100);
  const annualSavings = monthlySavings * 12;

  return (
    <section id="calculator" className="relative w-full bg-white py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-primary bg-orange-100/80 px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
            <Calculator size={13} /> Interactive Financial Tools
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy tracking-tight mb-4">
            Calculate Your Savings & Loan Eligibility
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Estimate your monthly loan installments or calculate how much your business saves each year with FreshWallet’s zero-fee ecosystem.
          </p>
        </div>

        {/* Calculator Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-2">
            <button
              onClick={() => setCalculatorType('savings')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                calculatorType === 'savings'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-navy'
              }`}
            >
              <DollarSign size={16} className="text-primary" /> Fee Savings
            </button>
            <button
              onClick={() => setCalculatorType('loan')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                calculatorType === 'loan'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-navy'
              }`}
            >
              <TrendingUp size={16} className="text-primary" /> Loan EMI
            </button>
          </div>
        </div>

        {/* Interactive Calculator Body */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 rounded-3xl border border-orange-200/80 p-6 sm:p-10 shadow-lg">
          {calculatorType === 'savings' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Sliders Side */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Monthly Digital Collection Volume</label>
                    <span className="text-base font-black text-primary">₹{monthlyVolume.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={5000000}
                    step={25000}
                    value={monthlyVolume}
                    onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>₹50,000</span>
                    <span>₹25,00,000</span>
                    <span>₹50,00,000</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Other POS / Gateway Fee Rate</label>
                    <span className="text-base font-black text-navy">{traditionalMdrPercent}% MDR</span>
                  </div>
                  <input
                    type="range"
                    min={1.0}
                    max={3.0}
                    step={0.1}
                    value={traditionalMdrPercent}
                    onChange={(e) => setTraditionalMdrPercent(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>1.0%</span>
                    <span>1.8% (Avg)</span>
                    <span>3.0%</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>FreshWallet charges <strong>0% fee on all UPI QR & Soundbox collections</strong>, saving you 100% of these processing charges.</span>
                </div>
              </div>

              {/* Result Summary Box */}
              <div className="lg:col-span-5 bg-navy text-white rounded-2xl p-7 flex flex-col justify-between shadow-xl">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-orange-400 font-bold">Estimated Net Savings</span>
                  <div className="text-3xl sm:text-4xl font-black mt-2 text-white">
                    ₹{annualSavings.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-white/60 block mt-0.5">saved per year</span>
                  </div>

                  <div className="mt-6 space-y-2.5 border-t border-white/10 pt-4 text-xs">
                    <div className="flex justify-between text-white/80">
                      <span>Monthly MDR Savings:</span>
                      <span className="font-bold text-emerald-400">₹{monthlySavings.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Settlement Cycle:</span>
                      <span className="font-bold text-white">Instant / Multi-Cycle</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Setup Cost:</span>
                      <span className="font-bold text-emerald-400">₹0 (Zero)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/register/welcome')}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-orange-600 hover:to-primary text-white font-bold py-3.5 rounded-xl shadow-soft transition-all cursor-pointer"
                >
                  Start Saving Now <ArrowRight size={15} />
                </button>
              </div>

            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Loan Sliders Side */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Required Loan Amount</label>
                    <span className="text-base font-black text-primary">₹{loanAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={2500000}
                    step={25000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>₹50,000</span>
                    <span>₹10,00,000</span>
                    <span>₹25,00,000</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Tenure (Months)</label>
                    <span className="text-base font-black text-navy">{tenureMonths} Months</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={36}
                    step={1}
                    value={tenureMonths}
                    onChange={(e) => setTenureMonths(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>3 Months</span>
                    <span>18 Months</span>
                    <span>36 Months</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Annual Interest Rate (% p.a.)</label>
                    <span className="text-base font-black text-navy">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={9.5}
                    max={24}
                    step={0.5}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy"
                  />
                </div>
              </div>

              {/* Loan Result Summary */}
              <div className="lg:col-span-5 bg-navy text-white rounded-2xl p-7 flex flex-col justify-between shadow-xl">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-orange-400 font-bold">Estimated Monthly Installment</span>
                  <div className="text-3xl sm:text-4xl font-black mt-2 text-white">
                    ₹{emi.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-white/60 block mt-0.5">per month</span>
                  </div>

                  <div className="mt-6 space-y-2.5 border-t border-white/10 pt-4 text-xs">
                    <div className="flex justify-between text-white/80">
                      <span>Principal Amount:</span>
                      <span className="font-bold text-white">₹{loanAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Total Interest Payable:</span>
                      <span className="font-bold text-orange-400">₹{totalInterest.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Total Payable:</span>
                      <span className="font-bold text-white">₹{totalRepayment.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-orange-600 hover:to-primary text-white font-bold py-3.5 rounded-xl shadow-soft transition-all cursor-pointer"
                >
                  Check Pre-Approved Offer <ArrowRight size={15} />
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
}
