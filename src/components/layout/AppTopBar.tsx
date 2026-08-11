import { Search, LogOut, Store } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiGet } from '../../lib/api';

type Props = {
  title?: string;
};

export function AppTopBar({ title }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [businessName, setBusinessName] = useState<string>('FreshWallet Merchant');

  useEffect(() => {
    apiGet<{ business?: { name?: string } }>('/merchants/me')
      .then((m) => {
        if (m?.business?.name) {
          setBusinessName(m.business.name);
        }
      })
      .catch(() => {});
  }, []);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="search"
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-navy shadow-sm outline-none placeholder:text-gray-400 focus:border-primary/40"
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-sm font-bold text-navy bg-orange-50/40 border border-orange-200 px-3.5 py-2 rounded-xl shadow-sm">
          <Store size={16} className="text-orange-500" />
          <span>{businessName}</span>
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 transition-colors"
          aria-label="Logout"
        >
          <LogOut size={16} />
          Logout
        </button>
        <h1 className="hidden text-lg font-bold text-navy lg:block">{title || t('overview')}</h1>
      </div>
    </header>
  );
}
