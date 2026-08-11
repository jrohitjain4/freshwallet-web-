import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CloudUpload } from 'lucide-react';
import { StepSidebar } from '../components/layout/StepSidebar';
import { Button } from '../components/ui/Button';
import { OnboardingStepper } from '../components/ui/ProgressStepper';
import { apiPost, apiUpload } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const BUSINESS_TYPES = [
  { value: 'RETAIL', labelKey: 'retail' },
  { value: 'WHOLESALE', labelKey: 'wholesale' },
  { value: 'SERVICES', labelKey: 'services' },
  { value: 'OTHER', labelKey: 'other' },
];

export default function BusinessOnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  useEffect(() => {
    if (user?.onboardingStatus === 'COMPLETED') {
      navigate(user.kycSubmitted ? '/dashboard' : '/onboarding/kyc', { replace: true });
    }
  }, [user, navigate]);
  const [form, setForm] = useState({
    name: '',
    businessType: '',
    gst: '',
    address: '',
    city: '',
    state: '',
    logoUrl: '',
  });
  const [logoUploading, setLogoUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await apiUpload<{ fileUrl: string }>('/business/logo', fd);
      setForm((prev) => ({ ...prev, logoUrl: res.fileUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logo upload failed');
    } finally {
      setLogoUploading(false);
    }
  };

  const submit = async () => {
    if (!form.name || !form.businessType || !form.address || !form.city || !form.state) {
      setError(t('fillRequiredFields') || 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiPost('/business', form);
      await refreshProfile();
      navigate('/onboarding/kyc');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('businessSaveFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-page">
      <StepSidebar active="businessInfo" stepNumber={3} />
      <main className="flex-1 overflow-y-auto flex justify-center items-start p-4 py-8 md:p-8">
        <div className="w-full max-w-2xl rounded-2xl border-2 border-[#FF6B00] bg-white p-6 shadow-md md:p-8">
          <OnboardingStepper currentStep={3} />

          <h1 className="mb-2 text-2xl font-bold text-navy">{t('businessDetails')}</h1>
          <p className="mb-8 text-sm text-gray-500">{t('businessSub')}</p>

          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">
                {t('businessName')} <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary font-bold text-navy"
                placeholder={t('businessNamePlaceholder')}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">
                {t('businessType')} <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary font-bold text-navy"
                value={form.businessType}
                onChange={(e) => setForm({ ...form, businessType: e.target.value })}
              >
                <option value="">{t('selectBusinessType')}</option>
                {BUSINESS_TYPES.map((bt) => (
                  <option key={bt.value} value={bt.value}>
                    {t(bt.labelKey)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">{t('gstin')}</label>
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 uppercase outline-none focus:border-primary font-bold text-navy"
                placeholder={t('gstinPlaceholder')}
                value={form.gst}
                onChange={(e) => setForm({ ...form, gst: e.target.value })}
              />
              <p className="mt-1 text-xs text-gray-400">{t('gstinHint')}</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">
                {t('shopAddress')} <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary font-semibold text-navy"
                placeholder={t('addressPlaceholder')}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-navy">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary font-bold text-navy"
                  placeholder="e.g. Indore"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary font-bold text-navy"
                  placeholder="e.g. Madhya Pradesh"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  required
                />
              </div>
            </div>

          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              {t('saveExit')}
            </Button>
            <Button showArrow onClick={submit} disabled={loading}>
              {loading ? t('loadingEllipsis') : t('continue')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
