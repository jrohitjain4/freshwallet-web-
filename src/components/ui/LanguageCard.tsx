import { Check } from 'lucide-react';
import { cn } from '../../lib/cn';

type Props = {
  native: string;
  english: string;
  code: string;
  selected: boolean;
  onSelect: () => void;
};

export function LanguageCard({ native, english, code, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative rounded-2xl bg-white py-8 px-6 text-center transition-all w-full',
        selected ? 'border-[3px] border-black shadow-md scale-[1.02]' : 'border-2 border-gray-200 hover:border-black/50'
      )}
    >
      <div className="text-2xl font-extrabold text-black mb-1">{native}</div>
      <div className="text-base font-bold text-black/80">{english}</div>
      <span className="sr-only">{code}</span>
    </button>
  );
}
