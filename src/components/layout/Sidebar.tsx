import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Home,
  QrCode,
  Wallet,
  BookOpen,
  FileBarChart,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiGet } from '../../lib/api';
import { cn } from '../../lib/cn';
import dashboardHero from '../../assets/dashboard_sidebar_hero_v3.png';
import logo from '../../assets/logo.svg';

const SIDEBAR_NAV = [
  { to: '/dashboard', icon: Home, label: 'home' },
  { to: '/receive', icon: QrCode, label: 'receive' },
  { to: '/send', icon: Wallet, label: 'wallet' },
  { to: '/ledger', icon: BookOpen, label: 'ledger' },
  { to: '/more', icon: FileBarChart, label: 'reports' },
];

interface SidebarProps {}

export function Sidebar({}: SidebarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [businessName, setBusinessName] = useState('FreshWallet Merchant');

  useEffect(() => {
    async function getProfile() {
      try {
        const data = await apiGet<{ name: string }>('/business/profile');
        if (data?.name) setBusinessName(data.name);
      } catch {}
    }
    getProfile();
  }, []);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white md:flex">
      <div className="flex items-center border-b border-gray-100 px-5 py-5 select-none">
        <img src={logo} alt="FreshWallet" className="h-9 w-auto" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {SIDEBAR_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={`${to}-${label}`}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-orange-50 text-primary'
                  : 'text-black hover:bg-gray-50'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-primary' : 'text-black'} />
                {t(label)}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Hero Image */}
      <div className="mt-auto px-2 py-4 text-center select-none border-t border-gray-100">
        <img 
          src={dashboardHero} 
          alt="FreshWallet" 
          className="mx-auto max-h-[190px] w-full object-contain filter drop-shadow-sm transition-transform hover:scale-105 duration-300"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>
    </aside>
  );
}
