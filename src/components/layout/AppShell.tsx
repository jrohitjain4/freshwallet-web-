import type { ReactNode } from 'react';
import { AppTopBar } from './AppTopBar';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';

type Props = {
  children: ReactNode;
  title?: string;
  showTopBar?: boolean;
};

export function AppShell({ children, title, showTopBar = true }: Props) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-24 md:ml-64 md:pb-8">
        <div className="md:hidden">
          <AppHeader />
        </div>
        <main className="flex-1 px-4 py-4 md:px-8 md:py-6">
          {showTopBar && (
            <div className="hidden md:block">
              <AppTopBar title={title} />
            </div>
          )}
          {children}
        </main>
        <AppFooter />
      </div>
      <MobileBottomNav />
    </div>
  );
}
