import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Lock, 
  ChevronDown, 
  Phone,
  ArrowRight
} from 'lucide-react';
import { apiPost } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { resolveHome, GuestOnly } from '../components/auth/RouteGuards';
import { digitsOnly, formatIndianMobile, isValidIndianMobile } from '../lib/phone';
import type { AuthUser } from '../lib/auth';
import fintechIllustration from '../assets/merchant_welcome_3d.png';
import logo from '../assets/logo.svg';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIdentifierChange = (val: string) => {
    if (/[a-zA-Z@\.]/.test(val)) {
      setPhone(val);
    } else {
      setPhone(formatIndianMobile(val));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let loginIdentifier = phone.trim();
    const isEmail = loginIdentifier.includes('@') || /[a-zA-Z]/.test(loginIdentifier);

    if (isEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier)) {
        setError('Please enter a valid email address');
        return;
      }
    } else {
      const digits = digitsOnly(loginIdentifier);
      if (!isValidIndianMobile(loginIdentifier)) {
        setError(t('invalidMobile') || 'Please enter a valid 10-digit mobile number');
        return;
      }
      loginIdentifier = digits;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    try {
      const data = await apiPost<{ user: AuthUser; tokens: { accessToken: string; refreshToken: string } }>(
        '/auth/login',
        { phone: loginIdentifier, password }
      );
      login(data);
      navigate(resolveHome(data.user));
    } catch (err) {
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Lock, 
  ChevronDown, 
  Phone,
  ArrowRight
} from 'lucide-react';
import { apiPost } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { resolveHome, GuestOnly } from '../components/auth/RouteGuards';
import { digitsOnly, formatIndianMobile, isValidIndianMobile } from '../lib/phone';
import type { AuthUser } from '../lib/auth';
import fintechIllustration from '../assets/merchant_welcome_3d.png';
import logo from '../assets/logo.svg';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIdentifierChange = (val: string) => {
    if (/[a-zA-Z@\.]/.test(val)) {
      setPhone(val);
    } else {
      setPhone(formatIndianMobile(val));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let loginIdentifier = phone.trim();
    const isEmail = loginIdentifier.includes('@') || /[a-zA-Z]/.test(loginIdentifier);

    if (isEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier)) {
        setError('Please enter a valid email address');
        return;
      }
    } else {
      const digits = digitsOnly(loginIdentifier);
      if (!isValidIndianMobile(loginIdentifier)) {
        setError(t('invalidMobile') || 'Please enter a valid 10-digit mobile number');
        return;
      }
      loginIdentifier = digits;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    try {
      const data = await apiPost<{ user: AuthUser; tokens: { accessToken: string; refreshToken: string } }>(
        '/auth/login',
        { phone: loginIdentifier, password }
      );
      login(data);
      navigate(resolveHome(data.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid mobile number or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestOnly>
      <div className="flex flex-col min-h-screen bg-white font-sans antialiased text-navy select-none">

        {/* HEADER NAVBAR */}
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 px-5 py-3 lg:py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/welcome')}>
              <img src={logo} alt="FreshWallet" className="h-8 lg:h-10 w-auto" />
            </div>
            <button
              onClick={() => navigate('/register/welcome')}
              className="bg-primary hover:bg-orange-600 text-[11px] lg:text-xs font-extrabold text-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-orange-200/60 transition-all duration-200"
            >
              Start registration
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 lg:gap-6 lg:px-6 lg:py-6 items-start lg:items-center">

          {/* ── Desktop only: Left copywriting column ── */}
          <div className="hidden lg:flex flex-col text-left justify-center">
            <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-3.5 py-1.5 rounded-full w-fit mb-5">
              <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-white">
                <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-primary tracking-wide">Trusted by 10M+ merchants</span>
            </div>
            <h2 className="text-4xl font-black text-navy leading-[1.1] tracking-tight mb-3">
              Bharosa <br /><span className="text-primary">Har Payment ka</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Accept payments, manage settlements and grow your business with India's trusted financial platform.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { icon: <Shield size={18} />, title: '100% Secure', desc: 'Bank-grade security for every transaction.' },
                { icon: <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>, title: 'Instant Payments', desc: 'Receive money instantly, zero hassle.' },
                { icon: <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" /></svg>, title: 'Grow Business', desc: 'Analytics & insights to scale fast.' },
              ].map(f => (
                <div key={f.title} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-orange-50 text-primary flex items-center justify-center">{f.icon}</div>
                  <div>
                    <h4 className="text-sm font-bold text-navy">{f.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Desktop only: Middle 3D image ── */}
          <div className="hidden lg:flex items-center justify-center h-[580px]">
            <img
              src={fintechIllustration}
              alt="FreshWallet"
              className="h-full object-contain hover:scale-[1.02] transition-transform duration-500"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>

          {/* ── Form column (full width on mobile, right column on desktop) ── */}
          <div className="flex flex-col w-full lg:order-last">

            {/* Mobile only: orange branded hero band */}
            <div className="lg:hidden bg-gradient-to-br from-[#FF6B00] to-[#FF9A3C] px-6 pt-10 pb-16 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute top-4 right-16 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
              <span className="inline-block text-[10px] font-semibold text-white/80 bg-white/20 px-3 py-1 rounded-full mb-4 tracking-wide">
                🇮🇳 India's Most Trusted Payments
              </span>
              <h1 className="text-[28px] font-black text-white leading-snug">
                Bharosa<br/>
                <span className="text-orange-100">Har Payment ka</span>
              </h1>
              <p className="text-[12px] text-white/70 mt-2 leading-relaxed max-w-[260px]">
                10M+ merchants trust FreshWallet for fast &amp; secure payments every day.
              </p>
            </div>

            {/* Form card — overlaps the orange band on mobile */}
            <div className="
              relative -mt-7 lg:mt-0
              mx-0 lg:mx-auto
              w-full lg:max-w-[400px]
              bg-white
              rounded-t-[32px] lg:rounded-[24px]
              px-6 pt-8 pb-10
              lg:border lg:border-gray-100 lg:shadow-[0_20px_50px_rgba(0,0,0,0.08)]
            ">
              <h3 className="text-2xl font-extrabold text-navy tracking-tight mb-1">Welcome Back 👋</h3>
              <p className="text-sm text-gray-400 mb-8">Login to your FreshWallet account</p>

              {error && (
                <p className="mb-5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">{error}</p>
              )}

              <form onSubmit={onSubmit} className="flex flex-col gap-5">

                {/* Phone / Email */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Mobile / Email</label>
                  <div className="flex items-center h-[54px] rounded-2xl border border-gray-200 bg-gray-50 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all px-4 gap-3">
                    {/[a-zA-Z@]/.test(phone) ? (
                      <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                    ) : (
                      <Phone className="text-gray-400 flex-shrink-0" size={18} />
                    )}
                    {!/[a-zA-Z@]/.test(phone) && (
                      <span className="text-sm font-bold text-gray-500 border-r border-gray-200 pr-3 leading-none">+91</span>
                    )}
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => handleIdentifierChange(e.target.value)}
                      placeholder="9876543210 or email"
                      className="flex-1 bg-transparent text-[15px] font-semibold text-navy placeholder:text-gray-300 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Password</label>
                    <button type="button" className="text-xs font-bold text-primary hover:text-orange-600 transition-colors">
                      Forgot Password?
                    </button>
                  </div>
                  <div className="flex items-center h-[54px] rounded-2xl border border-gray-200 bg-gray-50 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all px-4 gap-3">
                    <Lock className="text-gray-400 flex-shrink-0" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="flex-1 bg-transparent text-[15px] font-semibold text-navy placeholder:text-gray-300 outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-navy transition-colors flex-shrink-0"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2.5">
                  <input type="checkbox" id="rememberMe" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" />
                  <label htmlFor="rememberMe" className="text-xs text-gray-500 font-medium cursor-pointer select-none">
                    Remember me on this device
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[54px] bg-gradient-to-r from-primary to-orange-500 hover:from-orange-600 hover:to-primary text-white font-extrabold rounded-2xl shadow-md hover:shadow-orange-200/50 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-[15px]"
                >
                  {loading ? 'Logging in...' : (<>Login <ArrowRight size={16} /></>)}
                </button>

                {/* Sign Up */}
                <p className="text-center text-xs text-gray-500 pt-1">
                  Don't have an account?{' '}
                  <span
                    onClick={() => navigate('/register/welcome')}
                    className="font-bold text-primary cursor-pointer hover:underline"
                  >
                    Sign Up Free
                  </span>
                </p>

              </form>
            </div>
          </div>

        </main>
      </div>
    </GuestOnly>
  );
}
