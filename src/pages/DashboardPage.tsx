import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Eye,
  EyeOff,
  Wallet,
  Banknote,
  TrendingUp,
  TrendingDown,
  QrCode,
  Send,
  Receipt,
  ShoppingCart,
  FileText,
  ArrowLeft,
  Filter,
  Download,
  ChevronRight,
  ShoppingBag,
  ArrowDownLeft,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { ActionModal } from '../components/ui/ActionModal';
import { Button } from '../components/ui/Button';
import { apiGet, apiPost } from '../lib/api';
import { formatCurrency } from '../lib/auth';
import { cn } from '../lib/cn';
import { formatAppDateShort } from '../lib/locale';
import {
  assertSufficientBalance,
  calcSendCharge,
  fetchWalletBalance,
  sendWalletPayment,
} from '../lib/sendPayment';
import { getRazorpayKeyId, useRazorpay } from '../hooks/useRazorpay';

type DashboardData = {
  totalBalance: number;
  todaySales: number;
  todayCommission?: number;
  totalCommission?: number;
  salesChangePercent: number;
  outflows: number;
  pendingBills: number;
  recentTransactions: {
    id: string;
    amount: number;
    commissionAmount?: number;
    netAmount?: number;
    status: string;
    partyName: string;
    paymentMethod?: string | null;
    createdAt: string;
    category?: string;
    type?: 'credit' | 'debit';
  }[];
};

type ModalType = 'send' | 'expense' | 'gst' | 'addMoney' | null;

const QUICK_ACTIONS = [
  { id: 'qr', icon: QrCode, labelKey: 'generateQr', color: 'text-orange-600 bg-orange-50', action: 'navigate' as const },
  { id: 'send', icon: Send, labelKey: 'sendMoney', color: 'text-orange-600 bg-orange-50', action: 'send' as const },
  { id: 'bills', icon: Receipt, labelKey: 'payBills', color: 'text-orange-600 bg-orange-50', action: 'send' as const },
  { id: 'expense', icon: ShoppingCart, labelKey: 'addExpense', color: 'text-red-600 bg-red-50', action: 'expense' as const },
  { id: 'gst', icon: FileText, labelKey: 'gstReports', color: 'text-amber-600 bg-amber-50', action: 'gst' as const },
];

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const normalized = status.toUpperCase();
  const isSuccess = normalized === 'SUCCESS' || normalized === 'COMPLETED';
  const isPending = normalized === 'PENDING' || normalized === 'PROCESSING';
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          isSuccess ? 'bg-green-500' : isPending ? 'bg-orange-400' : 'bg-red-400'
        )}
      />
      <span
        className={cn(
          isSuccess ? 'text-green-700' : isPending ? 'text-orange-600' : 'text-red-600'
        )}
      >
        {isSuccess ? t('completed') : isPending ? t('processing') : t('failed')}
      </span>
    </span>
  );
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { ready: razorpayReady, openCheckout } = useRazorpay();
  const [data, setData] = useState<DashboardData | null>(null);
  const [hideBalance, setHideBalance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [gstin, setGstin] = useState('27AAAAA0000A1Z5');
  const [businessName, setBusinessName] = useState('FreshWallet');
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [commissionRate, setCommissionRate] = useState(2);
  const [addMoneyForm, setAddMoneyForm] = useState({ amount: '500' });
  const [addMoneyLoading, setAddMoneyLoading] = useState(false);

  const [sendForm, setSendForm] = useState({
    beneficiary: 'amit.supplier@okaxis',
    amount: '5000',
    note: 'Invoice #8821',
  });
  const [expenseForm, setExpenseForm] = useState({
    category: 'OTHERS',
    amount: '3200',
    description: 'Weekly stock purchase',
  });
  const [saving, setSaving] = useState(false);

  const loadDashboard = useCallback(() => {
    return apiGet<DashboardData>('/merchants/dashboard')
      .then((d) => {
        setData(d);
        setLoadError(false);
      })
      .catch(() => {
        setData(null);
        setLoadError(true);
      });
  }, []);

  useEffect(() => {
    loadDashboard().finally(() => setLoading(false));

    apiGet<{
      business?: { name?: string; gst?: string | null };
      razorpayEnabled?: boolean;
      commissionRate?: number;
      limitTouched?: boolean;
      remainingLimit?: number;
    }>('/merchants/me')
      .then((m) => {
        if (m?.business?.gst) setGstin(m.business.gst);
        if (m?.business?.name) setBusinessName(m.business.name);
        setRazorpayEnabled(m?.razorpayEnabled ?? false);
        if (m?.commissionRate != null) setCommissionRate(Number(m.commissionRate));
        if (m?.limitTouched) {
          toast.warning(`Maximum limit reached! Allowed buffer limit remaining: ₹${m.remainingLimit?.toLocaleString('en-IN')}.`, {
            toastId: 'daily-limit-warning',
          });
        }
      })
      .catch(() => {});

    apiGet<{ enabled: boolean }>('/payments/razorpay-status')
      .then((s) => setRazorpayEnabled(s.enabled))
      .catch(() => {});
  }, [loadDashboard]);

  const balance = data?.totalBalance ?? 0;
  const todaySales = data?.todaySales ?? 0;
  const todayCommission = data?.todayCommission ?? 0;
  const salesChange = data?.salesChangePercent ?? 0;
  const salesDiff = Math.round((todaySales * salesChange) / 100);
  const outflows = data?.outflows ?? 0;
  const pendingBills = data?.pendingBills ?? 0;

  const sendPreview = useMemo(() => {
    const sendAmount = parseFloat(sendForm.amount) || 0;
    return calcSendCharge(sendAmount, commissionRate);
  }, [sendForm.amount, commissionRate]);

  const walletBalance = data?.totalBalance ?? 0;

  const apiTransactions = (data?.recentTransactions ?? []).map((tx, i) => {
    const isCredit = tx.type === 'credit';
    const gross = tx.amount;
    const commission = tx.commissionAmount ?? 0;
    const totalDeducted = isCredit ? gross : gross + commission;
    const netToReceiver = isCredit ? gross : gross;
    return {
      id: tx.id,
      partyName: tx.partyName,
      category: tx.paymentMethod || (isCredit ? t('payment') : t('sendPaymentLabel')),
      createdAt: tx.createdAt,
      status: tx.status,
      gross,
      commission,
      amount: totalDeducted,
      netToReceiver,
      type: (tx.type ?? (isCredit ? 'credit' : 'debit')) as 'credit' | 'debit',
      icon: isCredit ? ArrowDownLeft : ShoppingBag,
      iconBg: isCredit ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600',
      key: `${tx.id}-${i}`,
    };
  });

  const onQuickAction = (item: (typeof QUICK_ACTIONS)[number]) => {
    if (item.action === 'navigate') {
      navigate('/receive');
      return;
    }
    setModal(item.action);
  };

  const submitSend = async () => {
    const amount = parseFloat(sendForm.amount);
    if (!amount || amount <= 0) {
      alert(t('invalidAmount'));
      return;
    }
    if (!sendForm.beneficiary.trim()) {
      alert(t('beneficiaryRequired'));
      return;
    }

    const beneficiary = sendForm.beneficiary.trim();
    const { totalCharge } = calcSendCharge(amount, commissionRate);
    const balance = data?.totalBalance ?? (await fetchWalletBalance());

    try {
      assertSufficientBalance(totalCharge, balance, t('insufficientBalance'));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('insufficientBalance'));
      return;
    }

    setSaving(true);
    try {
      await sendWalletPayment({
        amount,
        beneficiary,
        note: sendForm.note.trim() || undefined,
      });
      setModal(null);
      await loadDashboard();
    } catch (err) {
      alert(err instanceof Error ? err.message : t('sendFailed'));
    } finally {
      setSaving(false);
    }
  };

  const submitExpense = async () => {
    setSaving(true);
    try {
      await apiPost('/expenses', {
        category: expenseForm.category,
        amount: parseFloat(expenseForm.amount),
        description: expenseForm.description,
      });
      setModal(null);
    } catch {
      setModal(null);
    } finally {
      setSaving(false);
    }
  };

  const startAddMoney = async () => {
    const num = parseFloat(addMoneyForm.amount);
    if (!num || num <= 0) return;
    if (!razorpayEnabled) {
      alert(t('razorpayNotEnabled'));
      return;
    }
    if (!razorpayReady) {
      alert(t('razorpayLoading'));
      return;
    }

    setAddMoneyLoading(true);
    try {
      const order = await apiPost<{
        paymentId: string;
        orderId: string;
        amount: number;
        keyId: string;
      }>('/payments/checkout', { amount: num, note: t('addMoneyToWallet') });

      setModal(null);

      openCheckout({
        key: order.keyId || getRazorpayKeyId(),
        amount: Math.round(order.amount * 100),
        currency: 'INR',
        name: businessName || 'FreshWallet',
        description: t('addMoneyToWallet'),
        order_id: order.orderId,
        onSuccess: async (response) => {
          await apiPost('/payments/verify', {
            paymentId: order.paymentId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
          await loadDashboard();
        },
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : t('paymentStartFailed'));
    } finally {
      setAddMoneyLoading(false);
    }
  };

  return (
    <AppShell title={t('overview')}>
      {/* Stats row */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-lg lg:col-span-5">
          <div className="mb-1 flex items-start justify-between">
            <p className="text-sm font-medium text-white/90">{t('totalBalance')}</p>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
              {t('current')}
            </span>
          </div>
          <div className="mb-6 flex items-center gap-3">
            <p className="text-3xl font-bold lg:text-4xl">
              {loading ? t('loadingEllipsis') : hideBalance ? '••••••' : formatCurrency(balance)}
            </p>
            <button
              type="button"
              onClick={() => setHideBalance(!hideBalance)}
              className="rounded-lg bg-white/20 p-1.5"
            >
              {hideBalance ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setModal('addMoney')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-primary transition hover:bg-white/95"
            >
              <Wallet size={18} /> {t('addMoney')}
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/25 py-2.5 text-sm font-semibold text-white">
              <Banknote size={18} /> {t('withdraw')}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-primary bg-white p-5 shadow-sm lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
              <TrendingUp className="text-green-600" size={18} />
            </div>
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600">
              +{salesChange}% ↑
            </span>
          </div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            {t('todaySales')}
          </p>
          <p className="mb-1 text-2xl font-bold text-navy">
            {loading ? t('loadingEllipsis') : formatCurrency(todaySales)}
          </p>
          <p className="text-xs text-green-600">+{formatCurrency(salesDiff)} {t('vsYesterday')}</p>
          {!loading && todayCommission > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              {t('commissionToday')}: {formatCurrency(todayCommission)}
            </p>
          )}
        </div>

        <div className="rounded-2xl border-2 border-primary bg-white p-5 shadow-sm lg:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
              <TrendingDown className="text-red-600" size={18} />
            </div>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-red-500">
              {t('urgent')}
            </span>
          </div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            {t('outflows')}
          </p>
          <p className="mb-1 text-2xl font-bold text-navy">
            {loading ? t('loadingEllipsis') : formatCurrency(outflows)}
          </p>
          <p className="text-xs text-gray-500">
            {pendingBills} {t('pendingBillsCount')}
          </p>
        </div>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load dashboard data. Please refresh the page.
        </div>
      )}


      {/* Analytics Charts Row */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Weekly Revenue Bar Graph */}
        <div className="rounded-2xl border-2 border-primary bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-navy">{t('weeklyRevenue', 'Weekly Revenue')}</h2>
            <span className="text-xs font-semibold text-primary bg-orange-50 px-2 py-0.5 rounded-full">
              +12% vs last week
            </span>
          </div>
          <div className="flex h-48 items-end justify-between gap-2 px-2 pt-4">
            {[
              { day: 'Mon', sales: 1200, percentage: 25 },
              { day: 'Tue', sales: 3400, percentage: 65 },
              { day: 'Wed', sales: 2100, percentage: 40 },
              { day: 'Thu', sales: 5600, percentage: 95 },
              { day: 'Fri', sales: 4300, percentage: 80 },
              { day: 'Sat', sales: 2800, percentage: 55 },
              { day: 'Sun', sales: 1500, percentage: 30 },
            ].map((item) => (
              <div key={item.day} className="group relative flex flex-col items-center flex-1">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden rounded bg-navy px-2.5 py-1 text-[10px] font-bold text-white group-hover:block whitespace-nowrap shadow-md z-10">
                  {formatCurrency(item.sales)}
                </div>
                {/* Bar */}
                <div
                  style={{ height: `${item.percentage * 1.4}px` }}
                  className="w-full max-w-[28px] rounded-t-lg bg-orange-100 group-hover:bg-primary transition-all duration-300 shadow-sm cursor-pointer"
                />
                <span className="mt-2.5 text-xs font-semibold text-gray-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Category Circle Analytics */}
        <div className="rounded-2xl border-2 border-primary bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-navy">{t('expenseAnalytics', 'Expense Analytics')}</h2>
            <span className="text-xs font-semibold text-primary bg-orange-50 px-2 py-0.5 rounded-full">
              Monthly Limit: 80%
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            {/* Donut Chart SVG */}
            <div className="relative h-36 w-36 flex-shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                {/* Base background circle */}
                <circle cx="50" cy="50" r="40" className="stroke-gray-100 fill-none" strokeWidth="12" />
                {/* Stock Circle - 45% */}
                <circle cx="50" cy="50" r="40" className="stroke-primary fill-none" strokeWidth="12"
                  strokeDasharray="113.04 251.2" strokeDashoffset="0" strokeLinecap="round" />
                {/* Bills Circle - 30% */}
                <circle cx="50" cy="50" r="40" className="stroke-orange-400 fill-none" strokeWidth="12"
                  strokeDasharray="75.36 251.2" strokeDashoffset="-113.04" strokeLinecap="round" />
                {/* Logistics Circle - 15% */}
                <circle cx="50" cy="50" r="40" className="stroke-amber-500 fill-none" strokeWidth="12"
                  strokeDasharray="37.68 251.2" strokeDashoffset="-188.4" strokeLinecap="round" />
                {/* Others Circle - 10% */}
                <circle cx="50" cy="50" r="40" className="stroke-amber-300 fill-none" strokeWidth="12"
                  strokeDasharray="25.12 251.2" strokeDashoffset="-226.08" strokeLinecap="round" />
              </svg>
              {/* Inner Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-navy">₹13.3K</span>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Outflow</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="flex flex-col gap-2.5 w-full max-w-[160px]">
              {[
                { name: 'Stock Supply', percent: 45, val: '₹6.0K', color: 'bg-primary' },
                { name: 'Utility Bills', percent: 30, val: '₹4.0K', color: 'bg-orange-400' },
                { name: 'Logistics', percent: 15, val: '₹2.0K', color: 'bg-amber-500' },
                { name: 'Others', percent: 10, val: '₹1.3K', color: 'bg-amber-300' },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-3 w-3 rounded-full", item.color)} />
                    <span className="font-semibold text-gray-600">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-navy block">{item.val}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{item.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions & Quick Actions Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Recent Transactions & Settlements */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="rounded-2xl border-2 border-primary bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-lg font-bold text-navy">{t('recentTransactions')}</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:text-navy"
                  aria-label={t('filter')}
                >
                  <Filter size={16} />
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:text-navy"
                  aria-label={t('download')}
                >
                  <Download size={16} />
                </button>
              </div>
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-3 font-medium">{t('transactionName')}</th>
                    <th className="px-5 py-3 font-medium">{t('category')}</th>
                    <th className="px-5 py-3 font-medium">{t('date')}</th>
                    <th className="px-5 py-3 font-medium">{t('status')}</th>
                    <th className="px-5 py-3 text-right font-medium">{t('gross')}</th>
                    <th className="px-5 py-3 text-right font-medium">{t('net')}</th>
                  </tr>
                </thead>
                <tbody>
                  {apiTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                        {t('noTransactionsYet')}
                      </td>
                    </tr>
                  ) : (
                  apiTransactions.map((tx) => {
                    const Icon = tx.icon;
                    return (
                      <tr key={tx.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn('flex h-9 w-9 items-center justify-center rounded-full', tx.iconBg)}>
                              <Icon size={16} />
                            </div>
                            <div>
                              <p className="font-semibold text-navy">{tx.partyName}</p>
                              <p className="text-xs text-gray-400">{tx.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                            {tx.category}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-600">{formatAppDateShort(tx.createdAt, i18n.language)}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={tx.status} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="font-medium text-gray-600">
                            {formatCurrency(tx.gross)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span
                            className={cn(
                              'font-bold',
                              tx.type === 'credit' ? 'text-green-600' : 'text-navy'
                            )}
                          >
                            {tx.type === 'credit' ? '+' : '-'}
                            {formatCurrency(tx.amount)}
                          </span>
                          {tx.commission > 0 && (
                            <p className="text-xs text-gray-400">
                              {t('fee')} {formatCurrency(tx.commission)}
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile transaction list */}
            <div className="divide-y divide-gray-100 md:hidden">
              {apiTransactions.map((tx) => {
                const Icon = tx.icon;
                return (
                  <div key={tx.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-9 w-9 items-center justify-center rounded-full', tx.iconBg)}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy">{tx.partyName}</p>
                        <p className="text-xs text-gray-400">{tx.id}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'text-sm font-bold',
                        tx.type === 'credit' ? 'text-green-600' : 'text-navy'
                      )}
                    >
                      {tx.type === 'credit' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100 py-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/ledger')}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {t('viewAllHistory')}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Settlements Insights Card */}
          <div className="rounded-2xl border-2 border-primary bg-white px-5 py-[35px] shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-navy">{t('settlementStatus', 'Settlement Status')}</h3>
              <span className="flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {t('scheduled', 'Scheduled')}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Next Settlement</p>
                <p className="text-lg font-extrabold text-navy">₹13,340.00</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Estimated: Tomorrow, 06:00 AM</p>
              </div>
              <div className="border-t border-gray-100 pt-3 sm:border-t-0 sm:border-l sm:border-gray-100 sm:pt-0 sm:pl-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Receiving Bank</p>
                <p className="text-sm font-bold text-navy">State Bank of India</p>
                <p className="text-xs text-gray-500 mt-0.5">A/C: **********5432</p>
              </div>
              <div className="border-t border-gray-100 pt-3 sm:border-t-0 sm:border-l sm:border-gray-100 sm:pt-0 sm:pl-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Settlement Cycle</p>
                <p className="text-sm font-bold text-navy">Instant (T+0)</p>
                <p className="text-xs text-gray-500 mt-0.5">Auto-transfer enabled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border-2 border-primary bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-navy">{t('quickActions')}</h2>
            </div>
            <div className="flex flex-col gap-3">
              {QUICK_ACTIONS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onQuickAction(item)}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition hover:border-primary hover:shadow-md text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('rounded-xl p-2.5', item.color)}>
                        <Icon size={20} />
                      </div>
                      <span className="text-sm font-bold text-navy">{t(item.labelKey)}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ActionModal open={modal === 'addMoney'} onClose={() => setModal(null)} title={t('addMoney')}>
        <p className="mb-4 text-sm text-gray-500">{t('addMoneySub')}</p>
        {!razorpayEnabled && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {t('addMoneyUnavailable')}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-brand">{t('amountRupee')}</label>
            <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white">
              <span className="flex items-center px-4 text-lg font-semibold text-gray-400">₹</span>
              <input
                type="number"
                min="1"
                step="1"
                className="flex-1 py-3 text-lg font-semibold text-navy outline-none"
                value={addMoneyForm.amount}
                onChange={(e) => setAddMoneyForm({ amount: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[100, 500, 1000, 5000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAddMoneyForm({ amount: String(preset) })}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-primary hover:text-primary"
              >
                ₹{preset.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>
        <Button
          className="mt-6 w-full"
          onClick={startAddMoney}
          disabled={addMoneyLoading || !razorpayEnabled || !razorpayReady}
        >
          {addMoneyLoading ? t('loadingEllipsis') : t('payViaRazorpay')}
        </Button>
        <button
          type="button"
          onClick={() => setModal(null)}
          className="mt-3 w-full text-center text-sm text-brand underline"
        >
          {t('cancel')}
        </button>
      </ActionModal>

      <ActionModal open={modal === 'send'} onClose={() => setModal(null)} title={t('sendPayment')}>
        <div className="mb-4 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm">
          <span className="text-gray-600">{t('availableBalance')}</span>
          <span className="font-semibold text-navy">{formatCurrency(walletBalance)}</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-brand">{t('beneficiaryUpi')}</label>
            <input
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
              value={sendForm.beneficiary}
              onChange={(e) => setSendForm({ ...sendForm, beneficiary: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-brand">{t('amountRupee')}</label>
            <input
              type="number"
              min="1"
              step="1"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
              value={sendForm.amount}
              onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
            />
            <p className="mt-1 text-xs text-gray-400">{t('sendAmountHint')}</p>
          </div>
          {sendPreview.sendAmount > 0 && (
            <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{t('sendAmount')}</span>
                <span className="font-medium text-navy">{formatCurrency(sendPreview.sendAmount)}</span>
              </div>
              <div className="mt-2 flex justify-between text-gray-600">
                <span>
                  {t('platformFee')} ({commissionRate}%)
                </span>
                <span className="font-medium text-navy">{formatCurrency(sendPreview.commission)}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-orange-200 pt-3 font-semibold text-navy">
                <span>{t('totalDebit')}</span>
                <span className="text-primary">{formatCurrency(sendPreview.totalCharge)}</span>
              </div>
            </div>
          )}
          {sendPreview.sendAmount > 0 && sendPreview.totalCharge > walletBalance && (
            <p className="text-sm font-medium text-red-600">{t('insufficientBalance')}</p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-brand">{t('note')}</label>
            <input
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
              value={sendForm.note}
              onChange={(e) => setSendForm({ ...sendForm, note: e.target.value })}
            />
          </div>
        </div>
        <Button
          className="mt-6 w-full"
          onClick={submitSend}
          disabled={saving || sendPreview.sendAmount <= 0 || sendPreview.totalCharge > walletBalance}
        >
          {saving
            ? t('loadingEllipsis')
            : sendPreview.sendAmount > 0
              ? t('confirmSendTotal', { total: formatCurrency(sendPreview.totalCharge) })
              : t('sendPayment')}
        </Button>
        <button
          type="button"
          onClick={() => setModal(null)}
          className="mt-3 w-full text-center text-sm text-brand underline"
        >
          {t('cancel')}
        </button>
      </ActionModal>

      <ActionModal open={modal === 'expense'} onClose={() => setModal(null)} title={t('addExpense')}>
        <p className="mb-4 text-sm text-gray-500">{t('demoFlow')}</p>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-brand">{t('category')}</label>
            <select
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
              value={expenseForm.category}
              onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
            >
              <option value="OTHERS">Inventory</option>
              <option value="RENT">Rent</option>
              <option value="SALARY">Salary</option>
              <option value="FUEL">Fuel</option>
              <option value="ELECTRICITY">Electricity</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-brand">{t('amountRupee')}</label>
            <input
              type="number"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-brand">{t('description')}</label>
            <input
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
            />
          </div>
        </div>
        <Button className="mt-6 w-full" onClick={submitExpense} disabled={saving}>
          {saving ? t('loadingEllipsis') : t('saveExpense')}
        </Button>
        <button
          type="button"
          onClick={() => setModal(null)}
          className="mt-3 w-full text-center text-sm text-brand underline"
        >
          {t('cancel')}
        </button>
      </ActionModal>

      <ActionModal open={modal === 'gst'} onClose={() => setModal(null)} title={t('gstReports')} className="max-w-lg">
        <div className="rounded-2xl border border-gray-800 bg-white p-5">
          <p className="mb-4 text-sm text-gray-500">
            {t('gstinLabel')}: {gstin}
          </p>
          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-green-100 p-4">
              <p className="mb-1 text-sm text-gray-600">{t('outputGst')}</p>
              <p className="text-xl font-bold text-navy">₹12,400</p>
            </div>
            <div className="rounded-xl p-4">
              <p className="mb-1 text-sm text-gray-600">{t('inputGst')}</p>
              <p className="text-xl font-bold text-navy">₹8,200</p>
            </div>
          </div>
          <button
            type="button"
            className="mb-3 w-full rounded-xl border border-gray-800 bg-gray-100 py-3 text-sm font-semibold text-brand"
          >
            {t('downloadGstr1')}
          </button>
          <button
            type="button"
            className="w-full rounded-xl border border-gray-800 bg-primary py-3 text-sm font-bold text-white"
          >
            {t('downloadGstr3b')}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setModal(null)}
          className="mt-4 flex w-full items-center justify-center gap-2 text-sm text-brand"
        >
          <ArrowLeft size={16} />
          {t('back')}
        </button>
      </ActionModal>
    </AppShell>
  );
}
