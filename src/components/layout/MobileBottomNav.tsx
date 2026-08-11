import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_NAV_ITEMS } from './nav-items';
import { cn } from '../../lib/cn';

export function MobileBottomNav() {
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-orange-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden">
      <div className="mx-auto flex max-w-lg justify-around px-2 py-2">
        {APP_NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-2 py-1',
                isActive ? 'text-orange-600' : 'text-gray-500'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span
                  className={cn(
                    'text-[10px] font-medium',
                    isActive && 'border-b-2 border-orange-600 pb-0.5'
                  )}
                >
                  {t(label)}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
