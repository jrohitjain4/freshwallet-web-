import { Home, QrCode, Wallet, BookOpen, MoreHorizontal, type LucideIcon } from 'lucide-react';

export type NavItem = {
  to: string;
  icon: LucideIcon;
  label: string;
};

export const APP_NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', icon: Home, label: 'home' },
  { to: '/receive', icon: QrCode, label: 'receive' },
  { to: '/send', icon: Wallet, label: 'send' },
  { to: '/ledger', icon: BookOpen, label: 'ledger' },
  { to: '/more', icon: MoreHorizontal, label: 'more' },
];
