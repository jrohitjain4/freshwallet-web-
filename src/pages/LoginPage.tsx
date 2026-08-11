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
      <div className="flex flex-col min-h-screen lg:h-screen lg:overflow-hidden bg-white font-sans antialiased text-navy select-none">
        
        {/* ========================================== */}
        {/* HEADER NAVBAR                              */}
        {/* ========================================== */}
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/welcome')}>
              <img src={logo} alt="FreshWallet" className="h-10 w-auto" />
            </div>

            {/* Header Right Buttons */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/register/welcome')}
                className="flex items-center justify-center bg-primary hover:bg-orange-600 text-xs font-extrabold text-white px-6 py-2.5 rounded-2xl shadow-soft hover:shadow-premium transition-all duration-300"
              >
                Start your registration
              </button>
            </div>
          </div>
        </header>

        {/* ========================================== */}
        {/* MAIN BODY                                  */}
        {/* ========================================== */}
        <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 py-4 lg:py-6 items-center">
          
          {/* COLUMN 1: Content/Copywriting */}
          <div className="flex flex-col text-left">
            {/* Trusted Badge */}
            <div className="inline-flex items-center gap-1.5 bg-orange-50/50 border border-orange-100/30 px-3.5 py-1.5 rounded-full w-fit mb-4">
              <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-white">
                <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </div>
              <span className="text-[10px] font-bold text-primary tracking-wide">Trusted by 10M+ merchants across India</span>
            </div>

            {/* Main Header */}
            <h2 className="text-3xl sm:text-4xl font-black text-navy leading-[1.1] tracking-tight mb-2">
              Bharosa <br />
              <span className="text-primary bg-clip-text">Har Payment ka</span>
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4">
              Accept payments, manage settlements and grow your business with India's trusted financial platform.
            </p>

            {/* 3 Bullet Features */}
            <div className="flex flex-col gap-3.5 mb-5">
              {/* Point 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-2xl bg-orange-50/80 text-primary flex items-center justify-center shadow-sm">
                  <Shield size={20} className="text-primary fill-orange-50" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-navy">100% Secure</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Bank-grade security to keep your transactions safe.</p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-2xl bg-orange-50/80 text-primary flex items-center justify-center shadow-sm">
                  <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-navy">Instant Payments</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Receive payments instantly with zero hassle.</p>
                </div>
              </div>

              {/* Point 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-2xl bg-orange-50/80 text-primary flex items-center justify-center shadow-sm">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" /></svg>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-navy">Grow Your Business</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Powerful tools and insights to scale your business.</p>
                </div>
              </div>
            </div>

            {/* Bottom Row Metrics */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
              {/* Stat 1 */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-50 text-primary flex items-center justify-center">
                  <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-navy leading-none">10M+</span>
                  <span className="text-[9px] text-gray-400 font-bold mt-0.5">Merchants</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-50 text-primary flex items-center justify-center">
                  <Shield size={16} className="fill-orange-50 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-navy leading-none">100%</span>
                  <span className="text-[9px] text-gray-400 font-bold mt-0.5">Secure</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-50 text-primary flex items-center justify-center">
                  <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-navy leading-none">Instant</span>
                  <span className="text-[9px] text-gray-400 font-bold mt-0.5">Settle</span>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-50 text-primary flex items-center justify-center">
                  <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.57a1 1 0 00-1.01.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4a1 1 0 00-1 1c0 9.39 7.61 17 17 17a1 1 0 001-1v-3.5c0-.55-.45-1-1-1z"/></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-navy leading-none">24x7</span>
                  <span className="text-[9px] text-gray-400 font-bold mt-0.5">Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Generated 3D Image Mockup */}
          <div className="flex items-center justify-center select-none w-full h-[520px] lg:h-[600px]">
            <img 
              src={fintechIllustration} 
              alt="FreshWallet 3D Ecosystem" 
              className="max-h-full w-auto object-contain transform hover:scale-[1.02] transition-transform duration-500"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>

          {/* COLUMN 3: Welcome Back Login Card */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-[400px] rounded-[24px] bg-white border border-gray-100 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
              <h3 className="text-xl font-extrabold text-navy tracking-tight mb-1 text-center">Welcome Back</h3>
              <p className="text-xs text-gray-400 font-medium text-center mb-5">Login to your FreshWallet account</p>

              {error && <p className="mb-3 text-xs font-semibold text-red-600 bg-red-50/50 border border-red-100 p-2.5 rounded-xl">{error}</p>}

              <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
                
                {/* Mobile Number Field */}
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400 mb-1">Email / Mobile Number</label>
                  <div className="flex items-center rounded-2xl border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 overflow-hidden transition-all duration-300">
                    <div className="h-9 w-9 flex items-center justify-center bg-orange-50 rounded-xl m-1 text-primary">
                      {/[a-zA-Z@]/.test(phone) ? (
                        <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                      ) : (
                        <Phone size={14} />
                      )}
                    </div>
                    {!/[a-zA-Z@]/.test(phone) && <span className="text-xs font-semibold text-gray-500 pl-2 pr-1">+91</span>}
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => handleIdentifierChange(e.target.value)}
                      placeholder="Enter Mobile Number or Email"
                      className="flex-1 px-3 py-2 text-xs font-bold text-navy bg-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400">Password</label>
                    <button type="button" className="text-[10px] font-bold text-primary hover:text-orange-600 transition-colors">Forgot Password?</button>
                  </div>
                  <div className="flex items-center rounded-2xl border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 overflow-hidden transition-all duration-300 relative">
                    <div className="h-9 w-9 flex items-center justify-center bg-orange-50 rounded-xl m-1 text-primary">
                      <Lock size={14} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="flex-1 px-3 py-2 text-xs font-bold text-navy bg-transparent outline-none pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-gray-400 hover:text-navy transition-colors"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center gap-2 mb-1">
                  <input type="checkbox" id="rememberMe" className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5" />
                  <label htmlFor="rememberMe" className="text-[11px] text-gray-400 font-semibold cursor-pointer">Remember me on this device</label>
                </div>

                {/* Login Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white font-extrabold py-2.5 rounded-2xl shadow-soft hover:shadow-premium hover:translate-y-[-1px] active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Logging in...' : (
                    <>Login <ArrowRight size={14} /></>
                  )}
                </button>

                {/* Sign Up bottom link */}
                <p className="text-center text-[10px] text-gray-500 mt-2">
                  Don't have an account? <span onClick={() => navigate('/register/welcome')} className="font-bold text-primary hover:underline cursor-pointer">Sign Up</span>
                </p>

              </form>
            </div>
          </div>
        </main>

      </div>
    </GuestOnly>
  );
}
