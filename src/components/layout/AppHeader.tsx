import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Store } from 'lucide-react';
import { apiGet } from '../../lib/api';
import logo from '../../assets/logo.svg';

export function AppHeader() {
  const { t } = useTranslation();
  const [businessName, setBusinessName] = useState<string>('');

  useEffect(() => {
    apiGet<{ business?: { name?: string } }>('/merchants/me')
      .then((m) => {
        if (m?.business?.name) {
          setBusinessName(m.business.name);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="flex items-center justify-between px-4 py-3 md:px-8">
      <div className="flex items-center">
        <img
          src={logo}
          alt="FreshWallet Logo"
          className="h-8 w-auto object-contain"
        />
      </div>
      {businessName && (
        <span className="flex items-center gap-1.5 text-xs font-bold text-navy bg-orange-50/40 border border-orange-200 px-2.5 py-1.5 rounded-xl shadow-sm max-w-[160px] truncate">
          <Store size={13} className="text-orange-500 flex-shrink-0" />
          <span className="truncate">{businessName}</span>
        </span>
      )}
    </header>
  );
}
