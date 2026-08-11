import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import { LanguageSelector } from '../components/ui/LanguageSelector';
import { Button } from '../components/ui/Button';
import { StepSidebar } from '../components/layout/StepSidebar';
import { setLanguage } from '../i18n';
import { GuestOnly } from '../components/auth/RouteGuards';

export default function RegisterWelcomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(localStorage.getItem('freshwallet_lang') || 'en');

  const onContinue = () => {
    setLanguage(selected);
    navigate('/register/auth');
  };

  const onSelectLanguage = (code: string) => {
    setSelected(code);
    setLanguage(code);
  };

  return (
    <GuestOnly>
      <div className="flex h-screen overflow-hidden bg-page">
        <StepSidebar active="language" stepNumber={1} />
        <main className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4 md:p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white">
            <Building2 className="text-brand" size={22} />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-navy md:text-3xl">
            {t('welcome')}{' '}
            <span className="font-serif text-brand">{t('brand')}</span>
          </h1>
          <p className="mb-8 max-w-md text-center text-sm text-gray-500">{t('welcomeSub')}</p>

          <div className="w-full max-w-lg rounded-2xl border-2 border-[#FF6B00] bg-white p-8 shadow-md">
            <p className="mb-4 text-xs font-semibold tracking-wider text-gray-400">{t('selectLanguage')}</p>
            <div className="mb-6">
              <LanguageSelector selected={selected} onSelect={onSelectLanguage} />
            </div>

            <Button className="w-full" showArrow onClick={onContinue}>
              {t('getStarted')}
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500 max-w-md">
            {t('terms')}{' '}
            <button type="button" className="text-brand underline">
              {t('termsLink')}
            </button>
          </p>
        </main>
      </div>
    </GuestOnly>
  );
}
