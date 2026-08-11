import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_NAV_ITEMS } from './nav-items';
import { cn } from '../../lib/cn';

export function DesktopNav() {
  const { t } = useTranslation();

  return (
    <nav className="mb-6 hidden border-b border-orange-100 bg-white/80 px-4 py-2 backdrop-blur md:block md:rounded-2xl md:border md:shadow-sm md:mx-8">
      <div className="flex items-center justify-center gap-1 lg:gap-2">
        {APP_NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-brand'
              )
            }
          >
            <Icon size={18} />
            <span>{t(label)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
