import { useRef, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn';

type Props = {
  value: string;
  onChange: (v: string) => void;
  length?: number;
};

export function OtpInput({ value, onChange, length = 6 }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(length, ' ').split('').slice(0, length);

  const setDigit = (index: number, char: string) => {
    const arr = value.split('');
    while (arr.length < length) arr.push('');
    arr[index] = char;
    onChange(arr.join('').replace(/\s/g, '').slice(0, length));
  };

  const onKey = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index]?.trim() && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() || ''}
          onChange={(e) => {
            const c = e.target.value.replace(/\D/g, '').slice(-1);
            setDigit(i, c);
            if (c && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => onKey(i, e)}
          className={cn(
            'h-12 w-10 rounded-xl border-2 text-center text-lg font-bold text-navy sm:h-14 sm:w-12',
            i === value.length ? 'border-primary' : 'border-gray-200'
          )}
        />
      ))}
    </div>
  );
}
