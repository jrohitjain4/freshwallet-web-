import { LanguageCard } from './LanguageCard';
import { LANGUAGES } from '../../i18n';

type Props = {
  selected: string;
  onSelect: (code: string) => void;
  compact?: boolean;
};

export function LanguageSelector({ selected, onSelect, compact }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {LANGUAGES.map((lang) => (
        <LanguageCard
          key={lang.code}
          {...lang}
          selected={selected === lang.code}
          onSelect={() => onSelect(lang.code)}
        />
      ))}
    </div>
  );
}
