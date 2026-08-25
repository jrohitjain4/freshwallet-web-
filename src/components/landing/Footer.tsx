export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#f4f7fc] text-gray-500 py-8 px-4 sm:px-8 border-t border-gray-200/80 text-xs">
      <div className="max-w-6xl mx-auto space-y-4 text-center">
        
        {/* Footer Links matching exact PB Fintech footer */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-gray-600">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <span>|</span>
          <a href="#" className="hover:text-primary transition-colors">Terms of Use</a>
          <span>|</span>
          <a href="#" className="hover:text-primary transition-colors">Disclaimer</a>
          <span>|</span>
          <a href="#" className="hover:text-primary transition-colors">Purchase Order Terms and Conditions</a>
        </div>

        {/* Registered Address */}
        <div className="text-gray-500 text-xs">
          Registered Address: Plot 119, Sector 44, Gurugram- 122001, Haryana
        </div>

        {/* Copyright & CIN line */}
        <p className="text-[11px] text-gray-400 font-medium">
          &copy; {currentYear} FreshWallet Limited | CIN- L51909HR2008PLC037998
        </p>

      </div>
    </footer>
  );
}
