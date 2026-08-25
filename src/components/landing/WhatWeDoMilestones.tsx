import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WhatWeDoMilestones() {
  const navigate = useNavigate();

  return (
    <section id="what-we-do-milestones" className="w-full bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Milestone 1: Insurance Marketplace */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full text-xs font-bold text-primary">
              <ShieldCheck size={14} /> Flagship Insurance Distribution
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-navy leading-tight">
              We launched our flagship insurance platform in 2008
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              To respond to consumers&#39; need for more awareness, choice and transparency and create a consumer-pull based, provider-neutral model for digital insurance distribution. We enable 100% paperless research, comparison, and instant claim assistance.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-primary hover:bg-orange-600 px-5 py-2.5 rounded-xl shadow-soft transition-all cursor-pointer"
              >
                Explore Insurance <ArrowRight size={13} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-2xl p-6 border border-orange-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                <span className="text-xs font-bold text-navy">Digital Insurance Metrics</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Policies Facilitated:</span>
                  <span className="font-bold text-navy">71.6 Million+</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Insurance Partners:</span>
                  <span className="font-bold text-primary">50+ Top Insurers</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Claim Settlement Support:</span>
                  <span className="font-bold text-emerald-600">24x7 Dedicated Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone 2: Credit & Lending Platform */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            <div className="w-full max-w-sm bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-2xl p-6 border border-orange-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                <span className="text-xs font-bold text-navy">Lending & Credit Stack</span>
                <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">Pre-Approved</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Loan Disbursals ARR:</span>
                  <span className="font-bold text-navy">₹175 Billion+</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Credit Score Users:</span>
                  <span className="font-bold text-primary">60.6 Million+</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Disbursal Turnaround:</span>
                  <span className="font-bold text-emerald-600">&lt; 24 Hours Paperless</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 text-left order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full text-xs font-bold text-primary">
              <TrendingUp size={14} /> Credit & MSME Financing
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-navy leading-tight">
              In 2014, we launched our credit platform to transform how Indians access personal credit
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              By accentuating ease, convenience and transparency in selecting a wide variety of personal loans, MSME business credit lines, and credit cards. Our platform is also widely used by millions to access and improve their free monthly credit scores.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 text-xs font-bold text-navy bg-orange-50 hover:bg-orange-100 border border-orange-200 px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Check Free Credit Score <Sparkles size={13} className="text-primary" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
