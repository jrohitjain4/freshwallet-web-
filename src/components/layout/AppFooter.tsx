import { Heart } from 'lucide-react';

export function AppFooter() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="mt-4 border-t border-gray-200/60 bg-[#F8FAFC] px-4 py-6 md:px-8">
      <div className="flex flex-col items-center justify-center gap-3 md:flex-row md:justify-between">
        <p className="text-xs font-medium text-gray-400">
          &copy; {year} FreshWallet. All rights reserved.
        </p>
        <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500">
          Developed with 
          <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
        </p>
      </div>
    </footer>
  );
}
