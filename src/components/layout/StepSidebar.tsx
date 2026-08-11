import { Globe, Lock, Briefcase, ShieldCheck, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';

const steps = [
  { key: 'language', icon: Globe },
  { key: 'authentication', icon: Lock },
  { key: 'businessInfo', icon: Briefcase },
  { key: 'kycVerification', icon: ShieldCheck },
] as const;

type Props = {
  active: (typeof steps)[number]['key'];
  stepNumber?: number;
};

import sidebarHero from '../../assets/merchant_welcome_3d.png';
import logo from '../../assets/logo.svg';

export function StepSidebar({ active, stepNumber = 2 }: Props) {
  const { t } = useTranslation();

  return (
    <aside className="hidden h-screen w-72 flex-shrink-0 flex-col border-r border-gray-200 bg-[#e8f0f7] p-8 md:flex">
      <div className="mb-8 select-none">
        <img src={logo} alt="FreshWallet" className="h-10 w-auto" />
      </div>
      <h2 className="text-lg font-bold text-navy">{t('onboarding')}</h2>
      <p className="mb-8 text-sm text-black font-medium">{t('step', { n: stepNumber })}</p>
      <nav className="space-y-2">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = s.key === active;
          const isDone = steps.findIndex((x) => x.key === active) > idx;
          return (
            <div
              key={s.key}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium',
                isActive && 'bg-primary text-white',
                !isActive && 'text-black font-semibold'
              )}
            >
              {isDone ? <Check size={18} /> : <Icon size={18} />}
              {t(s.key)}
            </div>
          );
        })}
      </nav>

      {/* 3D Illustration at the bottom of the sidebar */}
      <div className="mt-auto pt-6 text-center select-none">
        <img 
          src={sidebarHero} 
          alt="FreshWallet Illustration" 
          className="max-w-full h-auto object-contain mx-auto opacity-90 filter drop-shadow-sm hover:scale-[1.03] transition-transform duration-300"
          style={{ mixBlendMode: 'multiply', maxHeight: '200px' }}
        />
      </div>
    </aside>
  );
}
