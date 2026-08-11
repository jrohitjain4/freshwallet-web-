import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { StepSidebar } from '../components/layout/StepSidebar';
import { Button } from '../components/ui/Button';
import { apiPost } from '../lib/api';
import { digitsOnly, formatIndianMobile, isValidIndianMobile } from '../lib/phone';
import { GuestOnly } from '../components/auth/RouteGuards';

export default function RegisterAuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referBy, setReferBy] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const digits = digitsOnly(phone);
    if (!isValidIndianMobile(phone)) {
      setError(t('invalidMobile') || 'Please enter a valid 10-digit mobile number');
      return;
    }
    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters)');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const payload: Record<string, string> = { phone: digits, email: email.trim(), password, name: name.trim() };
      if (referBy.trim()) payload.referBy = referBy.trim().toUpperCase();
      await apiPost('/auth/register', payload);
      navigate('/verify-otp', { state: { phone: digits } });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('otpSendFailed') || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestOnly>
      <div className="flex h-screen overflow-hidden bg-page">
        <StepSidebar active="authentication" stepNumber={2} />
        <main className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4 md:p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white">
            <Shield className="text-navy" size={22} />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-navy md:text-3xl">{t('secureLogin') || 'Secure Authentication'}</h1>
          <p className="mb-8 max-w-md text-center text-sm text-gray-500">{t('loginSub') || 'Enter details to register your merchant account'}</p>

          <form
            onSubmit={onSubmit}
            className="w-full max-w-md rounded-2xl border-2 border-[#FF6B00] bg-white p-6 shadow-md"
          >
            {/* Full Name */}
            <label className="mb-1 block text-sm font-medium text-brand">Full Name</label>
            <div className="mb-4 flex overflow-hidden rounded-xl border border-orange-200">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="flex-1 px-4 py-3 text-navy outline-none font-bold text-sm"
                required
              />
            </div>

            {/* Mobile Number */}
            <label className="mb-1 block text-sm font-medium text-brand">{t('mobileNumber') || 'Mobile Number'}</label>
            <div className="mb-4 flex overflow-hidden rounded-xl border border-orange-200">
              <span className="flex items-center bg-gray-50 px-4 text-sm font-medium text-gray-600">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phone}
                onChange={(e) => setPhone(formatIndianMobile(e.target.value))}
                placeholder={t('phonePlaceholder') || '98765 43210'}
                maxLength={11}
                className="flex-1 px-4 py-3 text-navy outline-none font-bold"
                required
              />
            </div>

            {/* Email Address */}
            <label className="mb-1 block text-sm font-medium text-brand">Email Address</label>
            <div className="mb-4 flex overflow-hidden rounded-xl border border-orange-200">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="flex-1 px-4 py-3 text-navy outline-none font-bold text-sm"
                required
              />
            </div>

            {/* Password */}
            <label className="mb-1 block text-sm font-medium text-brand">Password</label>
            <div className="mb-4 flex overflow-hidden rounded-xl border border-orange-200 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="flex-1 px-4 py-3 text-navy outline-none font-bold text-sm pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Refer By (optional) */}
            <label className="mb-1 block text-sm font-medium text-brand">Refer By <span className="text-gray-400 font-normal">(Optional – Manager ID)</span></label>
            <div className="mb-4 flex overflow-hidden rounded-xl border border-orange-200">
              <input
                type="text"
                value={referBy}
                onChange={(e) => setReferBy(e.target.value)}
                placeholder="e.g. MGR-0001"
                className="flex-1 px-4 py-3 text-navy outline-none font-bold text-sm uppercase"
                maxLength={20}
              />
            </div>

            {error && <p className="mb-3 text-sm text-red-600 font-semibold">{error}</p>}
            <Button type="submit" className="w-full" showArrow disabled={loading}>
              {loading ? t('loadingEllipsis') || 'Sending...' : 'Register & Send OTP'}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs text-brand">
            <Shield size={14} />
            {t('secureBadge') || '256-bit SSL encrypted connection'}
          </div>
        </main>
      </div>
    </GuestOnly>
  );
}
