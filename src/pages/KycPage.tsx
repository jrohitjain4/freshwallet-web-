import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CreditCard, Home, CloudUpload, Info, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { KycDocProgress, OnboardingStepper } from '../components/ui/ProgressStepper';
import { StepSidebar } from '../components/layout/StepSidebar';
import { apiGet, apiUpload, apiPost } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type KycDoc = { docType: string; fileUrl: string; status: string };

export default function KycPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  useEffect(() => {
    if (user?.kycSubmitted) navigate('/dashboard', { replace: true });
  }, [user, navigate]);
  const [docs, setDocs] = useState<KycDoc[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await apiGet<{ documents: KycDoc[] }>('/kyc/status');
      setDocs(data.documents || []);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (docType: 'PAN' | 'AADHAAR', file: File) => {
    setUploading(docType);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('docType', docType);
      await apiUpload('/kyc/upload', fd);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const onSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await apiPost('/kyc/submit');
      await refreshProfile();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  const panDoc = docs.find((d) => d.docType === 'PAN');
  const aadhaarDoc = docs.find((d) => d.docType === 'AADHAAR');

  return (
    <div className="flex h-screen overflow-hidden bg-page">
      <StepSidebar active="kycVerification" stepNumber={4} />
      <main className="flex-1 overflow-y-auto flex justify-center items-start p-4 py-8 md:p-8">
        <div className="w-full max-w-2xl rounded-2xl border-2 border-[#FF6B00] bg-white p-6 shadow-md md:p-8">
          <OnboardingStepper currentStep={4} />

          <div className="mb-6 mt-6 flex items-center justify-between border-b border-gray-100 pb-4">
            <button
              type="button"
              onClick={() => navigate('/onboarding/business')}
              className="flex items-center gap-2 text-sm text-gray-600 font-semibold hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} /> Back to Business Info
            </button>
            <button type="button" className="rounded-xl border border-gray-300 px-4 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
              Need Help?
            </button>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-navy">{t('verifyIdentity')}</h1>
          <p className="mb-6 text-sm text-gray-500">{t('verifySub')}</p>

          <KycDocProgress hasPan={!!panDoc} hasAadhaar={!!aadhaarDoc} />

          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2 font-semibold text-navy">
              <CreditCard size={20} className="text-blue-600" />
              {t('panProof')}
            </div>
            {panDoc ? (
              <div className="flex items-center justify-between rounded-xl border bg-gray-50 px-4 py-3">
                <span className="text-sm">{panDoc.fileUrl.split('/').pop()}</span>
                <span className="text-sm font-medium text-primary">{t('verifying')}</span>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 hover:border-primary">
                <input
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => e.target.files?.[0] && upload('PAN', e.target.files[0])}
                />
                <CloudUpload className="mb-2 text-blue-400" size={32} />
                <span>
                  <span className="text-primary">{t('clickUpload')}</span> {t('dragDrop')}
                </span>
                <span className="mt-1 text-xs text-gray-400">{t('fileTypes')}</span>
                {uploading === 'PAN' && <span className="mt-2 text-sm text-primary">Uploading...</span>}
              </label>
            )}
          </div>

          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2 font-semibold text-navy">
              <Home size={20} className="text-blue-600" />
              {t('aadhaarProof')}
            </div>
            {aadhaarDoc ? (
              <div className="flex items-center justify-between rounded-xl border bg-gray-50 px-4 py-3">
                <span className="text-sm">{aadhaarDoc.fileUrl.split('/').pop()}</span>
                <span className="text-sm font-medium text-primary">{t('verifying')}</span>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 hover:border-primary">
                <input
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => e.target.files?.[0] && upload('AADHAAR', e.target.files[0])}
                />
                <CloudUpload className="mb-2 text-blue-400" size={32} />
                <span>
                  <span className="text-primary">{t('clickUpload')}</span> {t('dragDrop')}
                </span>
                <span className="mt-1 text-xs text-gray-400">{t('fileTypes')}</span>
                {uploading === 'AADHAAR' && <span className="mt-2 text-sm text-primary">Uploading...</span>}
              </label>
            )}
          </div>

          <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="mb-2 flex items-center gap-2 font-semibold text-navy">
              <Info size={18} className="text-blue-600" />
              {t('whyNeed')}
            </div>
            <p className="text-sm text-gray-600">{t('whyNeedText')}</p>
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <Button className="mb-3 w-full" showArrow onClick={onSubmit} disabled={submitting}>
            {submitting ? t('loadingEllipsis') : t('submitVerification')}
          </Button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full rounded-xl border border-gray-300 py-3 text-sm font-medium text-navy"
          >
            {t('saveLater')}
          </button>
        </div>
      </main>
    </div>
  );
}
