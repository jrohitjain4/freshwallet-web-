import { cn } from '../../lib/cn';

const AVATAR_COLORS = [
  'bg-amber-500',
  'bg-violet-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-rose-500',
  'bg-orange-600',
];

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase();
}

function colorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

type Props = {
  name: string;
  className?: string;
};

export function NameAvatar({ name, className }: Props) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-2xl font-semibold text-white',
        colorForName(name),
        className
      )}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}
