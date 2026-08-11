import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { StepSidebar } from '../components/layout/StepSidebar';
import { Button } from '../components/ui/Button';
import { OtpInput } from '../components/ui/OtpInput';
import { apiPost } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { resolveHome, GuestOnly } from '../components/auth/RouteGuards';
import type { AuthUser } from '../lib/auth';

export default function VerifyOtpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const phone = (location.state as { phone?: string })?.phone || '';
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!phone) navigate('/login', { replace: true });
  }, [phone, navigate]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const formatPhone = (p: string) => {
    if (p.length === 10) return `+91 ${p.slice(0, 5)} ${p.slice(5)}`;
    return `+91 ${p}`;
  };

  const onVerify = async () => {
    if (otp.length !== 6) {
      setError(t('otpRequired'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiPost<{ user: AuthUser; tokens: { accessToken: string; refreshToken: string } }>(
        '/auth/verify-otp-login',
        { phone, otp }
      );
      login(data);
      navigate(resolveHome(data.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('invalidOtp'));
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    try {
      await apiPost('/auth/send-otp', { phone });
      setTimer(30);
    } catch {
      /* ignore */
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
          <h1 className="mb-2 text-2xl font-bold text-navy">{t('secureLogin')}</h1>
          <p className="mb-8 text-center text-sm text-gray-500">{t('loginSub')}</p>

          <div className="w-full max-w-md rounded-2xl border-2 border-[#FF6B00] bg-white p-6 shadow-md">
            <h2 className="mb-2 text-center text-lg font-bold text-navy">{t('verifyMobile')}</h2>
            <p className="mb-6 text-center text-sm text-gray-500">
              {t('otpSent')} <strong>{formatPhone(phone)}</strong>
            </p>

            <div className="mb-6">
              <OtpInput value={otp} onChange={setOtp} />
            </div>

            <p className="mb-6 text-center text-sm text-gray-500">
              {t('didntReceive')}{' '}
              {timer > 0 ? (
                <span className="text-primary">
                  {t('resendOtp')} {String(Math.floor(timer / 60)).padStart(2, '0')}:
                  {String(timer % 60).padStart(2, '0')}
                </span>
              ) : (
                <button type="button" onClick={onResend} className="font-semibold text-primary">
                  {t('sendOtp')}
                </button>
              )}
            </p>

            {error && <p className="mb-3 text-center text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => navigate('/login')}>
                {t('back')}
              </Button>
              <Button className="flex-1" onClick={onVerify} disabled={loading}>
                {loading ? t('loadingEllipsis') : t('submitOtp')}
              </Button>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-400">Dev OTP: 123456</p>
        </main>
      </div>
    </GuestOnly>
  );
}
