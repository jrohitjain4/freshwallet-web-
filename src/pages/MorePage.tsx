import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Store,
  Languages,
  ShieldCheck,
  Landmark,
  Settings,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { ActionModal } from '../components/ui/ActionModal';
import { LanguageSelector } from '../components/ui/LanguageSelector';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../lib/api';
import { setLanguage } from '../i18n';

const MENU = [
  { icon: Store, label: 'businessProfile', path: '/onboarding/business' },
  { icon: Languages, label: 'languageSupport', action: 'language' as const },
  { icon: ShieldCheck, label: 'kycStatus', path: '/onboarding/kyc' },
  { icon: Landmark, label: 'bankAccounts' },
  { icon: Settings, label: 'settings' },
  { icon: HelpCircle, label: 'helpSupport' },
];

export default function MorePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [gstin, setGstin] = useState('27AAAAA0000A1Z5');
  const [businessName, setBusinessName] = useState('FreshWallet Merchant');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  useEffect(() => {
    setSelectedLang(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    apiGet<{ business?: { name?: string; gst?: string | null } }>('/merchants/me')
      .then((m) => {
        if (m?.business?.name) setBusinessName(m.business.name);
        if (m?.business?.gst) setGstin(m.business.gst);
      })
      .catch(() => {});
  }, []);

  const onMenuClick = (item: (typeof MENU)[number]) => {
    if (item.action === 'language') {
      setSelectedLang(i18n.language);
      setLanguageOpen(true);
      return;
    }
    if (item.path) navigate(item.path);
  };

  const onConfirmLanguage = () => {
    setLanguage(selectedLang);
    setLanguageOpen(false);
  };

  return (
    <AppShell title={t('more')}>
      <div className="px-4 md:px-8">
        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <img
            src="https://i.pravatar.cc/80?img=12"
            alt=""
            className="h-16 w-16 rounded-full border-2 border-orange-100 object-cover"
          />
          <div>
            <h1 className="text-lg font-bold text-brand md:text-xl">{businessName}</h1>
            <p className="text-sm text-gray-500">
              {t('gstinLabel')}: {gstin}
            </p>
            <p className="mt-1 text-xs font-bold tracking-wide text-brand">{t('premiumMember')}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {MENU.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onMenuClick(item)}
                className={`flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-orange-50 ${
                  idx > 0 ? 'border-t border-gray-50' : ''
                }`}
              >
                <Icon className="shrink-0 text-brand" size={22} />
                <span className="flex-1 font-medium text-brand">{t(item.label)}</span>
                <ChevronRight className="text-gray-400" size={18} />
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
          <p className="text-sm text-gray-500">{user?.phone}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 w-full rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600"
          >
            {t('logout')}
          </button>
        </div>
      </div>

      <ActionModal
        open={languageOpen}
        onClose={() => setLanguageOpen(false)}
        title={t('chooseLanguage')}
        className="max-w-lg"
      >
        <p className="mb-4 text-sm text-gray-500">{t('selectLanguage')}</p>
        <LanguageSelector
          selected={selectedLang}
          onSelect={setSelectedLang}
          compact
        />
        <button
          type="button"
          onClick={onConfirmLanguage}
          className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white"
        >
          {t('continue')}
        </button>
      </ActionModal>
    </AppShell>
  );
}
