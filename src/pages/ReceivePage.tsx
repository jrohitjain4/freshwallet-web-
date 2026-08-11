import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';
import {
  Store,
  QrCode,
  Download,
  Share2,
  Printer,
  CheckCircle2,
  Sparkles,
  Clock,
  CreditCard,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { ActionModal } from '../components/ui/ActionModal';
import { fetchWalletBalance } from '../lib/sendPayment';
import { apiGet, apiPost } from '../lib/api';
import { cn } from '../lib/cn';
import { formatAppDate } from '../lib/locale';
import { formatCurrency } from '../lib/auth';
import { getRazorpayKeyId, useRazorpay } from '../hooks/useRazorpay';

type QrData = {
  imageUrl: string;
  qrString?: string;
  amount: number | null;
  qrCodeId: string;
  paymentId?: string;
  collectSource?: 'qr_code' | 'payment_link';
};

type PaymentRow = {
  id: string;
  amount: number;
  status: string;
  paymentMethod?: string | null;
  createdAt: string;
  commission?: { amount: number } | null;
};

export default function ReceivePage() {
  const { t, i18n } = useTranslation();
  const qrRef = useRef<HTMLDivElement>(null);
  const { ready: razorpayReady, openCheckout } = useRazorpay();
  const [tab, setTab] = useState<'static' | 'dynamic' | 'checkout'>('static');
  const [staticQr, setStaticQr] = useState<QrData | null>(null);
  const [dynamicQr, setDynamicQr] = useState<QrData | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [razorpayEnabled, setRazorpayEnabled] = useState<boolean | null>(null);
  const [recentPayments, setRecentPayments] = useState<PaymentRow[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [addPaymentModalOpen, setAddPaymentModalOpen] = useState(false);
  const [manualAmount, setManualAmount] = useState('');
  const [manualMethod, setManualMethod] = useState<'UPI' | 'CASH' | 'CARD'>('UPI');
  const [manualNote, setManualNote] = useState('');
  const [manualLoading, setManualLoading] = useState(false);

  const [walletBalance, setWalletBalance] = useState(0);

  const refreshBalance = useCallback(() => {
    fetchWalletBalance()
      .then(setWalletBalance)
      .catch(() => {});
  }, []);

  const loadPayments = useCallback(() => {
    apiGet<PaymentRow[]>('/payments?limit=10')
      .then(setRecentPayments)
      .catch(() => setRecentPayments([]));
    refreshBalance();
  }, [refreshBalance]);

  useEffect(() => {
    apiGet<{
      business?: { name?: string };
      razorpayEnabled?: boolean;
      limitTouched?: boolean;
      remainingLimit?: number;
    }>('/merchants/me')
      .then((m) => {
        setBusinessName(m?.business?.name || t('merchant'));
        setRazorpayEnabled(m?.razorpayEnabled ?? false);
        if (m?.limitTouched) {
          toast.warning(`Maximum limit reached! Allowed buffer limit remaining: ₹${m.remainingLimit?.toLocaleString('en-IN')}.`, {
            toastId: 'daily-limit-warning',
          });
        }
      })
      .catch(() => setRazorpayEnabled(false));

    apiGet<{ enabled: boolean }>('/payments/razorpay-status')
      .then((s) => setRazorpayEnabled(s.enabled))
      .catch(() => {});

    loadPayments();
    const interval = setInterval(loadPayments, 5000);
    return () => clearInterval(interval);
  }, [loadPayments]);

  useEffect(() => {
    if (tab === 'static' && !staticQr && razorpayEnabled) {
      apiPost<QrData>('/qr/generate', {})
        .then(setStaticQr)
        .catch(() => {});
    }
  }, [tab, staticQr, razorpayEnabled]);

  const generateQr = async () => {
    const num = amount ? parseFloat(amount) : undefined;
    if (tab === 'dynamic' && (!num || num <= 0)) return;

    setLoading(true);
    try {
      const payload = num && num > 0 ? { amount: num } : {};
      const qr = await apiPost<QrData>('/qr/generate', payload);
      if (tab === 'static') setStaticQr(qr);
      else setDynamicQr(qr);
    } finally {
      setLoading(false);
    }
  };

  const startCheckout = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;
    setCheckoutLoading(true);
    try {
      const order = await apiPost<{
        paymentId: string;
        orderId: string;
        amount: number;
        keyId: string;
      }>('/payments/checkout', { amount: num, note: note || undefined });

      openCheckout({
        key: order.keyId || getRazorpayKeyId(),
        amount: Math.round(order.amount * 100),
        currency: 'INR',
        name: businessName || 'FreshWallet',
        description: note || t('paymentDefault'),
        order_id: order.orderId,
        onSuccess: async (response) => {
          await apiPost('/payments/verify', {
            paymentId: order.paymentId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
          loadPayments();
        },
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const submitManualPayment = async () => {
    const amt = parseFloat(manualAmount);
    if (!amt || amt <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setManualLoading(true);
    try {
      const response = await apiPost<{
        balance: number;
        netAmount: number;
        commissionAmount: number;
        limitTouched?: boolean;
        remainingLimit?: number;
      }>('/payments/receive-manual', {
        amount: amt,
        paymentMethod: manualMethod,
        note: manualNote.trim() || undefined,
      });
      toast.success(`Payment added successfully!\nNet added to wallet: ₹${response.netAmount.toFixed(2)} (Commission cut: ₹${response.commissionAmount.toFixed(2)})`);
      if (response?.limitTouched) {
        toast.warning(`Maximum limit reached! Allowed buffer limit remaining: ₹${response.remainingLimit?.toLocaleString('en-IN')}.`, {
          toastId: 'daily-limit-warning',
        });
      }
      setManualAmount('');
      setManualNote('');
      setAddPaymentModalOpen(false);
      loadPayments();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add manual payment');
    } finally {
      setManualLoading(false);
    }
  };

  const activeQr = tab === 'static' ? staticQr : dynamicQr;
  const qrPayload = activeQr?.qrString || activeQr?.imageUrl;
  const useSvgQr =
    !qrPayload ||
    activeQr?.collectSource === 'payment_link' ||
    /rzp\.io\/l\//i.test(qrPayload) ||
    qrPayload.startsWith('upi://');

  const downloadQr = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (svg) {
      const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
        type: 'image/svg+xml',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'freshwallet-qr.svg';
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    if (qrPayload) window.open(qrPayload, '_blank');
  };

  const shareWhatsApp = () => {
    const payLink = qrPayload || '';
    const text = encodeURIComponent(
      `Pay ${businessName} via FreshWallet${amount ? ` — ₹${amount}` : ''}${payLink ? ` ${payLink}` : ''}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const printQr = () => window.print();

  const successPayments = recentPayments.filter((p) => p.status === 'SUCCESS');

  return (
    <AppShell title={t('receivePayments')} showTopBar>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-navy">{t('receivePayments')}</h1>
            <p className="text-sm text-gray-500">{t('receiveSubLong')}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-orange-100 bg-orange-50/30 px-4 py-2 text-right shadow-sm">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Wallet Balance</span>
              <span className="text-lg font-black text-[#FF6B00]">{formatCurrency(walletBalance)}</span>
            </div>
            <button
              type="button"
              onClick={() => setAddPaymentModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] hover:bg-orange-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-300"
            >
              <Plus size={18} />
              Add Payment
            </button>
          </div>
        </div>



        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border-2 border-primary bg-white p-6 shadow-sm">
            <div className="mb-5 flex rounded-xl bg-[#F5F0EB] p-1">
              {(['static', 'dynamic', 'checkout'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={cn(
                    'flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all',
                    tab === key
                      ? 'border border-gray-200 bg-white text-navy shadow-sm'
                      : 'text-gray-500'
                  )}
                >
                  {key === 'static'
                    ? t('staticQr')
                    : key === 'dynamic'
                      ? t('dynamicQr')
                      : t('wallet', 'Wallet')}
                </button>
              ))}
            </div>

            <div className="mb-5 flex items-start gap-3 rounded-xl bg-[#FFF5F0] px-4 py-3">
              {tab === 'checkout' ? (
                <CreditCard className="mt-0.5 shrink-0 text-brand" size={20} />
              ) : (
                <QrCode className="mt-0.5 shrink-0 text-brand" size={20} />
              )}
              <p className="text-sm text-gray-600">
                {tab === 'checkout' ? t('collectPaymentSub') : t('qrFormHint')}
              </p>
            </div>

            <label className="mb-1.5 block text-sm font-medium text-brand">
              {tab === 'static' ? t('amountOptionalStatic') : t('amount')}
            </label>
            <div className="mb-4 flex overflow-hidden rounded-xl border border-gray-200 bg-white">
              <span className="flex items-center px-4 text-lg font-semibold text-gray-400">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                disabled={tab === 'static'}
                className="flex-1 py-3 text-lg font-semibold text-navy outline-none disabled:bg-gray-50"
              />
            </div>

            {(tab === 'checkout' || tab === 'dynamic') && (
              <>
                <label className="mb-1.5 block text-sm font-medium text-navy">
                  {t('customerOrder')}
                </label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t('optional')}
                  className="mb-6 w-full rounded-xl border border-gray-200 px-4 py-3 text-navy outline-none focus:border-primary/40"
                />
              </>
            )}

            {tab === 'checkout' ? (
              <Button
                className="w-full gap-2 py-3.5 text-base"
                onClick={startCheckout}
                disabled={checkoutLoading || !razorpayReady || !razorpayEnabled}
              >
                {checkoutLoading ? t('loadingEllipsis') : t('payViaRazorpayCheckout')}
                <CreditCard size={18} />
              </Button>
            ) : (
              <Button
                className="w-full gap-2 py-3.5 text-base"
                onClick={generateQr}
                disabled={loading || !razorpayEnabled}
              >
                {loading ? t('loadingEllipsis') : t('generateQrCode')}
                <Sparkles size={18} />
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {tab !== 'checkout' && (
              <div className="rounded-2xl border-2 border-primary bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-black">{t('yourBusinessQr')}</h2>
                    <p className="text-sm font-semibold text-gray-500">
                      {t('merchant')}: <span className="text-black">{businessName}</span>
                    </p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold',
                      razorpayEnabled ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    )}
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        razorpayEnabled ? 'bg-green-500' : 'bg-red-500'
                      )}
                    />
                    {razorpayEnabled ? t('active', 'ACTIVE') : t('inactive', 'INACTIVE')}
                  </span>
                </div>

                <div className="mb-4 flex justify-center">
                  <div ref={qrRef} className="rounded-2xl border border-orange-100 bg-white p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    {!razorpayEnabled ? (
                      <div className="flex h-[180px] w-[180px] flex-col items-center justify-center p-2 text-center">
                        <AlertCircle className="mb-3 text-red-500" size={36} />
                        <span className="text-sm font-bold text-black leading-tight">Account Not Approved</span>
                        <span className="mt-1.5 text-[10px] font-semibold text-gray-500 leading-tight">Wait for approval to view your QR</span>
                      </div>
                    ) : qrPayload ? (
                      <div className="relative inline-block">
                        {useSvgQr ? (
                          <QRCodeSVG value={qrPayload} size={180} level="M" />
                        ) : (
                          <img
                            src={qrPayload}
                            alt="Payment QR"
                            className="h-[180px] w-[180px] object-contain"
                            onError={(e) => {
                              const img = e.currentTarget;
                              img.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary">
                          <Store className="text-white" size={18} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-[180px] w-[180px] items-center justify-center text-sm font-bold text-black">
                        {t('loadingQr')}
                      </div>
                    )}
                    {razorpayEnabled && <p className="mt-2 text-sm font-bold text-black">FreshWallet</p>}
                  </div>
                </div>

                <p className="mb-4 text-center text-base font-bold text-black">
                  {businessName}
                </p>

                {activeQr?.collectSource === 'payment_link' && (
                  <p className="mb-4 text-center text-xs text-gray-500">
                    Test mode: scan opens a Razorpay payment page (card / UPI). Use Checkout tab for in-app pay.
                  </p>
                )}

                {activeQr?.amount != null && activeQr.amount > 0 && (
                  <p className="mb-4 text-center text-xl font-bold text-navy">
                    ₹{Number(activeQr.amount).toLocaleString('en-IN')}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={downloadQr}
                    className="flex flex-col items-center gap-2 rounded-xl py-3 text-center transition hover:bg-gray-50"
                  >
                    <Download className="text-gray-600" size={22} />
                    <span className="text-[11px] font-medium text-gray-500">{t('downloadQr')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={shareWhatsApp}
                    className="flex flex-col items-center gap-2 rounded-xl py-3 text-center transition hover:bg-gray-50"
                  >
                    <Share2 className="text-gray-600" size={22} />
                    <span className="text-[11px] font-medium text-gray-500">
                      {t('shareWhatsapp')}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={printQr}
                    className="flex flex-col items-center gap-2 rounded-xl py-3 text-center transition hover:bg-gray-50"
                  >
                    <Printer className="text-gray-600" size={22} />
                    <span className="text-[11px] font-medium text-gray-500">{t('printQr')}</span>
                  </button>
                </div>
              </div>
            )}

            {tab === 'checkout' && (
              <div className="rounded-2xl border-2 border-primary bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-lg font-bold text-navy">{t('checkoutInfoTitle')}</h2>
                <p className="text-sm text-gray-500">{t('checkoutInfoSub')}</p>
              </div>
            )}

            {successPayments.slice(0, 3).map((p) => {
              const gross = Number(p.amount);
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3"
                >
                  <CheckCircle2 className="shrink-0 text-green-600" size={20} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-green-800">
                      {t('receivedAmount', { amount: formatCurrency(gross) })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatAppDate(p.createdAt, i18n.language)}
                      {p.paymentMethod ? ` · ${p.paymentMethod}` : ''}
                    </p>
                  </div>
                </div>
              );
            })}

            {recentPayments.length === 0 && (
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <Clock className="shrink-0 text-gray-400" size={20} />
                <div>
                  <p className="font-semibold text-navy">{t('noPaymentsYet')}</p>
                  <p className="text-xs text-gray-500">{t('noPaymentsHint')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ActionModal
        open={addPaymentModalOpen}
        onClose={() => {
          setAddPaymentModalOpen(false);
          setManualAmount('');
          setManualMethod('UPI');
          setManualNote('');
        }}
        title="Add Payment (Manual)"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand">Amount (₹)</label>
            <div className="flex overflow-hidden rounded-xl border border-orange-100 bg-white">
              <span className="flex items-center px-4 text-lg font-semibold text-gray-400">₹</span>
              <input
                type="number"
                value={manualAmount}
                onChange={(e) => setManualAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 py-3 text-lg font-semibold text-navy outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {(['UPI', 'CASH', 'CARD'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setManualMethod(method)}
                  className={cn(
                    'rounded-xl py-3 text-sm font-bold border transition-all duration-300',
                    manualMethod === method
                      ? 'border-primary bg-orange-50/40 text-primary shadow-sm'
                      : 'border-orange-100 bg-white text-gray-500 hover:bg-orange-50/10'
                  )}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand">Note / Customer Details (Optional)</label>
            <input
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              placeholder="e.g. Table 4 dinner, Customer name, order no..."
              className="w-full rounded-xl border border-orange-100 px-4 py-3 text-navy outline-none focus:border-primary transition-all duration-300 font-medium"
            />
          </div>
        </div>

        <Button
          className="mt-6 w-full py-3.5"
          onClick={submitManualPayment}
          disabled={manualLoading || !manualAmount || parseFloat(manualAmount) <= 0}
        >
          {manualLoading ? t('loadingEllipsis') : 'Add Payment'}
        </Button>
        <button
          type="button"
          onClick={() => {
            setAddPaymentModalOpen(false);
            setManualAmount('');
            setManualMethod('UPI');
            setManualNote('');
          }}
          className="mt-3 w-full text-center text-sm text-brand underline"
        >
          {t('cancel')}
        </button>
      </ActionModal>
    </AppShell>
  );
}
