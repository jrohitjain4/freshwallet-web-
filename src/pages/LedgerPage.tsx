import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, Search, FileDown, Table, Plus } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { apiGet } from '../lib/api';
import { formatCurrency } from '../lib/auth';
import { formatAppDate } from '../lib/locale';
import { cn } from '../lib/cn';

type LedgerEntry = {
  id: string;
  createdAt: string;
  partyName: string;
  type: 'credit' | 'debit';
  label: string;
  amount: number;
  commissionAmount: number;
  totalCharge: number;
  paymentMethod?: string | null;
};

type LedgerData = {
  totalInflow: number;
  totalOutflow: number;
  netBalance: number;
  entries: LedgerEntry[];
};

const FILTERS = ['today', 'week', 'month', 'all'] as const;
type LedgerFilter = (typeof FILTERS)[number];

export default function LedgerPage() {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState<LedgerFilter>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LedgerData | null>(null);

  const [viewMode, setViewMode] = useState<'ledger' | 'commissions'>('ledger');
  const [commissions, setCommissions] = useState<any[]>([]);
  const [commissionsLoading, setCommissionsLoading] = useState(false);

  const loadLedger = useCallback((period: LedgerFilter) => {
    setLoading(true);
    return apiGet<LedgerData>(`/merchants/ledger?period=${period}`)
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const loadCommissions = useCallback(() => {
    setCommissionsLoading(true);
    return apiGet<any[]>('/merchants/commissions')
      .then(setCommissions)
      .catch(() => setCommissions([]))
      .finally(() => setCommissionsLoading(false));
  }, []);

  useEffect(() => {
    loadLedger(filter);
    loadCommissions();
  }, [filter, loadLedger, loadCommissions]);

  const inflow = data?.totalInflow ?? 0;
  const outflow = data?.totalOutflow ?? 0;
  const netBalance = data?.netBalance ?? 0;

  const filtered = (data?.entries ?? []).filter((r) =>
    r.partyName.toLowerCase().includes(search.toLowerCase())
  );

  const entriesWithRunningBalance = useMemo(() => {
    if (!filtered || filtered.length === 0) return [];
    
    // Sort oldest to newest
    const chron = [...filtered].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    let running = 0;
    const balanceMap = new Map<string, number>();
    
    for (const row of chron) {
      const isCredit = row.type === 'credit';
      if (isCredit) {
        running += row.amount - row.commissionAmount;
      } else {
        running -= row.totalCharge;
      }
      balanceMap.set(row.id, running);
    }
    
    // Return in original descending order
    return filtered.map((row) => ({
      ...row,
      runningBalance: balanceMap.get(row.id) ?? 0,
    }));
  }, [filtered]);

  return (
    <AppShell title={t('ledgerTitle')}>
      <div className="px-4 md:px-8">
        <h1 className="mb-1 text-xl font-bold text-navy md:text-2xl">{t('ledgerTitle')}</h1>
        <p className="mb-6 text-sm text-gray-500">{t('ledgerSub')}</p>

        <div className="mb-6 flex gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-orange-100 bg-white px-4 py-2 text-sm font-bold text-primary hover:border-primary hover:bg-orange-50/20 transition-all duration-300 shadow-sm"
          >
            <FileDown size={16} />
            {t('pdf')}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-orange-100 bg-white px-4 py-2 text-sm font-bold text-primary hover:border-primary hover:bg-orange-50/20 transition-all duration-300 shadow-sm"
          >
            <Table size={16} />
            {t('excel')}
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-gray-400">{t('totalInflow')}</p>
            <p className="text-2xl font-black text-green-600">{loading ? t('loadingEllipsis') : formatCurrency(inflow)}</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-gray-400">{t('totalOutflow')}</p>
            <p className="text-2xl font-black text-red-600">{loading ? t('loadingEllipsis') : formatCurrency(outflow)}</p>
          </div>
          <div className="rounded-2xl border-2 border-primary bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-1 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary">
              <Wallet size={14} className="text-primary" />
              {t('netBalance')}
            </div>
            <p className="text-2xl font-black text-navy">{loading ? t('loadingEllipsis') : formatCurrency(netBalance)}</p>
          </div>
        </div>

        <div className="mb-6 flex border-b border-orange-100">
          <button
            type="button"
            onClick={() => setViewMode('ledger')}
            className={cn(
              'border-b-2 px-6 py-3 text-sm font-extrabold tracking-wide uppercase transition-all duration-300',
              viewMode === 'ledger'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-primary'
            )}
          >
            Transaction Ledger
          </button>
          <button
            type="button"
            onClick={() => setViewMode('commissions')}
            className={cn(
              'border-b-2 px-6 py-3 text-sm font-extrabold tracking-wide uppercase transition-all duration-300',
              viewMode === 'commissions'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-primary'
            )}
          >
            Service Charges (Commissions)
          </button>
        </div>

        {viewMode === 'ledger' ? (
          <>
            <div className="mb-6 rounded-2xl border border-orange-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('searchParty')}
                  className="w-full rounded-xl border border-orange-50 py-3 pl-10 pr-4 outline-none focus:border-primary transition-all duration-300 font-medium text-navy text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={cn(
                      'rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300',
                      filter === f
                        ? 'bg-primary text-white shadow-soft'
                        : 'border border-orange-100 bg-white text-primary hover:bg-orange-50/20'
                    )}
                  >
                    {f === 'all' ? t('allTime') : t(f)}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <div className="hidden grid-cols-5 gap-2 bg-orange-50/30 px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider text-primary border-b border-orange-50 md:grid">
                <span>{t('date')}</span>
                <span>{t('partyName')}</span>
                <span>{t('type')}</span>
                <span className="text-right">{t('amount')}</span>
                <span className="text-right">Balance</span>
              </div>
              {loading ? (
                <p className="px-4 py-8 text-center text-sm text-gray-500">{t('loading')}</p>
              ) : entriesWithRunningBalance.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-gray-500">{t('noLedgerEntries')}</p>
              ) : (
                entriesWithRunningBalance.map((row) => {
                  const isCredit = row.type === 'credit';
                  const displayAmount = isCredit ? row.amount : row.totalCharge;
                  return (
                    <div
                      key={row.id}
                      className={cn(
                        "grid grid-cols-1 gap-2 border-b border-orange-50/50 px-5 py-4 text-sm transition-colors md:grid-cols-5 md:gap-2 md:items-center last:border-b-0",
                        isCredit 
                          ? "bg-green-50/10 hover:bg-green-50/20" 
                          : "bg-red-50/20 hover:bg-red-50/30"
                      )}
                    >
                      <span className={cn("text-gray-600", !isCredit && "text-red-700/80")}>
                        {formatAppDate(row.createdAt, i18n.language)}
                      </span>
                      <span className={cn("font-bold text-navy", !isCredit && "text-red-900")}>{row.partyName}</span>
                      <span className={cn("text-gray-700", !isCredit && "text-red-800")}>{row.label}</span>
                      <span
                        className={cn(
                          'font-bold md:text-right',
                          isCredit ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {isCredit ? '+' : '-'}
                        {formatCurrency(displayAmount)}
                        {row.commissionAmount > 0 && (
                          <span className="ml-1 block text-xs font-normal text-gray-400 md:inline md:ml-2">
                            ({isCredit ? 'Fee deducted:' : t('includesFee')} {formatCurrency(row.commissionAmount)})
                          </span>
                        )}
                      </span>
                      <span className={cn("font-extrabold md:text-right", isCredit ? "text-navy" : "text-red-900")}>
                        {formatCurrency(row.runningBalance)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="hidden grid-cols-6 gap-2 bg-orange-50/30 px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider text-primary border-b border-orange-50 md:grid">
              <span>Date</span>
              <span>Payment Ref</span>
              <span>Method</span>
              <span className="text-right">Original Amount</span>
              <span className="text-right">Rate</span>
              <span className="text-right">Commission Deducted</span>
            </div>
            {commissionsLoading ? (
              <p className="px-4 py-8 text-center text-sm text-gray-500">{t('loading')}</p>
            ) : commissions.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-500">No commission records found.</p>
            ) : (
              commissions.map((c) => {
                return (
                  <div
                    key={c.id}
                    className="grid grid-cols-2 gap-2 border-b border-orange-50/50 px-5 py-4 text-sm hover:bg-orange-50/10 transition-colors md:grid-cols-6 md:gap-2 md:items-center last:border-b-0"
                  >
                    <span className="text-gray-600 md:col-span-1">
                      {formatAppDate(c.createdAt, i18n.language)}
                    </span>
                    <span className="font-semibold text-navy md:col-span-1 break-all">
                      {c.payment?.gatewayRef || '—'}
                    </span>
                    <span className="text-gray-700 md:col-span-1 font-medium">
                      <span className="inline-block rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-primary uppercase">
                        {c.payment?.paymentMethod || '—'}
                      </span>
                    </span>
                    <span className="text-gray-900 md:text-right font-semibold md:col-span-1">
                      {formatCurrency(c.payment?.amount ?? 0)}
                    </span>
                    <span className="text-gray-700 md:text-right font-bold md:col-span-1">
                      {c.rate}%
                    </span>
                    <span className="font-extrabold text-red-600 md:text-right md:col-span-1">
                      -{formatCurrency(c.amount)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}

        <button
          type="button"
          className="fixed bottom-24 right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg hover:bg-orange-600 hover:scale-[1.05] transition-all duration-300 md:bottom-10"
          aria-label={t('addEntry')}
        >
          <Plus size={28} />
        </button>
      </div>
    </AppShell>
  );
}
