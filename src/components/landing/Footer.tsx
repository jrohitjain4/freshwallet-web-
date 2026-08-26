import { useState } from 'react';
import { X } from 'lucide-react';
import logo from '../../assets/logo.svg';

const termsContent = [
  {
    title: 'Acceptance',
    text: 'By accessing or using FreshWallet services, users agree to these Terms & Conditions.'
  },
  {
    title: 'Nature of Service',
    text: 'FreshWallet is a technology platform and not a bank. Services are provided through authorized banking and payment partners.'
  },
  {
    title: 'Eligibility',
    text: 'Users must provide accurate information and complete KYC requirements where applicable.'
  },
  {
    title: 'Permitted Use',
    text: 'The platform may be used only for lawful business and financial activities.'
  },
  {
    title: 'Prohibited Activities',
    text: 'Fraud, money laundering, misuse of accounts, illegal transactions, unauthorized access attempts and regulatory violations are prohibited.'
  },
  {
    title: 'Payments & Settlements',
    text: 'Processing timelines depend on partner banks, payment networks and compliance checks.'
  },
  {
    title: 'Merchant Responsibilities',
    text: 'Merchants are responsible for customer communications, lawful operations and compliance with applicable regulations.'
  },
  {
    title: 'Refunds & Cancellations',
    text: 'Refunds, reversals and cancellations are subject to partner-bank rules, transaction status and applicable policies.'
  },
  {
    title: 'AML/KYC Compliance',
    text: 'FreshWallet may suspend or reject accounts or transactions that fail compliance reviews.'
  },
  {
    title: 'Grievance Process',
    text: 'Users may contact support for complaints, disputes or service issues.'
  },
  {
    title: 'Limitation of Liability',
    text: 'FreshWallet is not responsible for delays, outages or failures caused by banking partners, networks, force majeure events or regulatory actions.'
  },
  {
    title: 'Termination',
    text: 'Accounts may be suspended or terminated for policy violations, fraud risk or compliance concerns.'
  },
  {
    title: 'Jurisdiction',
    text: 'Any dispute shall be subject to the jurisdiction of Jaipur, Rajasthan, India.'
  },
  {
    title: 'Contact',
    text: 'FreshWallet Private Limited, SF-44B, JTM Mall, Opposite Railway Apartments, Jagatpura, Jaipur–302017.\nEmail: Support@freshwallet.com | Phone: 9660423839 | Website: https://freshwallet.in'
  }
];

const privacyContent = [
  {
    title: 'Introduction',
    text: 'FreshWallet Private Limited is a technology platform providing payment and financial technology services. This Privacy Policy explains how information is collected, used, stored and protected.'
  },
  {
    title: 'Information Collected',
    text: 'We may collect personal information, business information, KYC documents, contact details, bank account details, transaction information, device information, IP address and compliance-related information.'
  },
  {
    title: 'Purpose of Processing',
    text: 'Information is processed for onboarding, KYC verification, fraud prevention, transaction processing, settlements, customer support, regulatory compliance and service improvement.'
  },
  {
    title: 'KYC & Compliance',
    text: 'KYC verification is mandatory where applicable. Users consent to verification through authorized partners and regulatory requirements.'
  },
  {
    title: 'Data Sharing',
    text: 'Information may be shared with banking partners, payment processors, service providers, regulators and law enforcement authorities when required.'
  },
  {
    title: 'Data Security',
    text: 'Industry-standard administrative, technical and physical safeguards are used to protect data from unauthorized access, misuse or disclosure.'
  },
  {
    title: 'AML & Fraud Monitoring',
    text: 'Transactions may be monitored to detect suspicious activity, money laundering, fraud, abuse or violations of law.'
  },
  {
    title: 'Retention',
    text: 'Data may be retained for regulatory, audit, legal and operational requirements.'
  },
  {
    title: 'User Rights',
    text: 'Users may request correction of inaccurate information subject to legal and regulatory obligations.'
  },
  {
    title: 'Grievance Redressal',
    text: 'Complaints may be submitted through the support channels listed below.'
  },
  {
    title: 'Contact',
    text: 'FreshWallet Private Limited, SF-44B, JTM Mall, Opposite Railway Apartments, Jagatpura, Jaipur–302017.\nEmail: Support@freshwallet.com | Phone: 9660423839 | Website: https://freshwallet.in'
  }
];

export default function Footer() {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);
  const currentYear = new Date().getFullYear();

  const openPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalType('privacy');
  };

  const openTerms = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalType('terms');
  };

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <footer className="w-full bg-[#f4f7fc] text-gray-500 py-8 px-4 sm:px-8 border-t border-gray-200/80 text-xs">
      <div className="max-w-6xl mx-auto space-y-4 text-center">
        
        {/* Brand Logo */}
        <div className="flex justify-center mb-2">
          <img src={logo} alt="FreshWallet Logo" className="h-10 w-auto" />
        </div>
        
        {/* Footer Links matching exact PB Fintech footer */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-gray-600">
          <a href="#" onClick={openPrivacy} className="text-primary font-bold hover:underline transition-colors">Privacy Policy</a>
          <span>|</span>
          <a href="#" onClick={openTerms} className="text-primary font-bold hover:underline transition-colors">Terms & Conditions</a>
        </div>

        {/* Registered Address */}
        <div className="text-gray-500 text-xs">
          Registered Address: SF-44B, JTM mall, Opposite railway apartments, Jagatpura, Jaipur
        </div>

        {/* Copyright & CIN line */}
        <p className="text-[11px] text-gray-400 font-medium">
          &copy; {currentYear} FreshWallet Limited | CIN- L51909HR2008PLC037998
        </p>

      </div>

      {/* Modal Dialog for Privacy or Terms */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-hidden">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col border border-gray-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1a2b49]">
                {modalType === 'privacy' ? 'FreshWallet Privacy Policy' : 'FreshWallet Terms & Conditions'}
              </h2>
              <button 
                onClick={closeModal} 
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 text-left text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
              {(modalType === 'privacy' ? privacyContent : termsContent).map((section, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h3 className="font-bold text-[#1a2b49] text-sm sm:text-base">
                    {idx + 1}. {section.title}
                  </h3>
                  <p className="whitespace-pre-line text-gray-500">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
              <button 
                onClick={closeModal}
                className="bg-primary hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-colors shadow-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </footer>
  );
}
