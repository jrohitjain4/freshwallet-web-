import { cn } from '../../lib/cn';
import { ArrowRight } from 'lucide-react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
  showArrow?: boolean;
};

export function Button({ variant = 'primary', showArrow, className, children, ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all disabled:opacity-60',
        variant === 'primary' && 'bg-primary text-white shadow-md hover:bg-[#e55f00]',
        variant === 'secondary' && 'bg-gray-100 text-navy hover:bg-gray-200',
        variant === 'outline' && 'border border-gray-300 bg-white text-navy hover:bg-gray-50',
        className
      )}
      {...props}
    >
      {children}
      {showArrow && <ArrowRight size={18} />}
    </button>
  );
}
