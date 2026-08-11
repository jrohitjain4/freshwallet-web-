import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  Store,
  Users,
  Receipt,
  Landmark,
  ListChecks,
  Plus,
  Zap,
  Droplets,
  Flame,
  Wifi,
  ShieldPlus,
  RotateCcw,
  Send,
  Download,
  Upload,
  Wallet,
  TrendingUp,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { ActionModal } from '../components/ui/ActionModal';
import { Button } from '../components/ui/Button';
import { NameAvatar } from '../components/ui/NameAvatar';
import { apiGet, apiPost } from '../lib/api';
import { formatCurrency } from '../lib/auth';
import { formatAppDateShort } from '../lib/locale';
import { cn } from '../lib/cn';
import {
  assertSufficientBalance,
  bulkSendWalletPayments,
  calcSendCharge,
  fetchWalletBalance,
  sendWalletPayment,
  type BulkSendRow,
} from '../lib/sendPayment';
import {
  calcBulkTotalCharge,
  downloadDemoBulkCsv,
  parseBulkPayoutCsv,
} from '../lib/bulkPayoutCsv';

const CATEGORIES = [
  { icon: Store, label: 'vendors', color: 'text-primary bg-orange-50' },
  { icon: Users, label: 'employees', color: 'text-primary bg-orange-50' },
  { icon: Receipt, label: 'utilityBills', color: 'text-primary bg-orange-50' },
  { icon: Landmark, label: 'gstTax', color: 'text-primary bg-orange-50' },
];

const BILL_ICONS = [
  { icon: Zap, label: 'electricity' },
  { icon: Droplets, label: 'water' },
  { icon: Flame, label: 'gas' },
  { icon: Wifi, label: 'internet' },
  { icon: ShieldPlus, label: 'insurance' },
];

type Beneficiary = {
  id: string;
  name: string;
  ifscCode?: string | null;
  accountNumber?: string | null;
};

type PaymentRow = {
  id: string;
  amount: number | string;
  createdAt: string;
  direction: 'CREDIT' | 'DEBIT';
  status: string;
  partyId?: string | null;
  party?: { id: string; name: string } | null;
  metadata?: { beneficiary?: string } | null;
};

type OutflowItem = {
  id: string;
  name: string;
  amount: number;
  time: string;
  partyId?: string;
};

const emptyBeneficiaryForm = {
  name: '',
  ifscCode: '',
  accountNumber: '',
  confirmAccountNumber: '',
};

const emptyManualForm = { name: '', accountNumber: '', confirmAccountNumber: '', ifscCode: '', amount: '' };

function truncateName(name: string, max = 10) {
  return name.length > max ? `${name.slice(0, max - 2)}...` : name;
}

export default function SendPage() {
  const { t, i18n } = useTranslation();

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [outflows, setOutflows] = useState<OutflowItem[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState<'manual' | 'csv'>('manual');
  const [sendTarget, setSendTarget] = useState<Beneficiary | null>(null);
  const [beneficiaryForm, setBeneficiaryForm] = useState(emptyBeneficiaryForm);
  const [sendForm, setSendForm] = useState({ amount: '', note: '' });
  const [bulkRows, setBulkRows] = useState<BulkSendRow[]>([]);
  const [bulkFileName, setBulkFileName] = useState('');
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkResults, setBulkResults] = useState<{
    name: string;
    amount: number;
    status: 'success' | 'failed';
    error?: string;
  }[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [sending, setSending] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [incomingAmount, setIncomingAmount] = useState(0);
  const [commissionRate, setCommissionRate] = useState(2);

  const [manualEntryForm, setManualEntryForm] = useState(emptyManualForm);
  const [manualEntryError, setManualEntryError] = useState('');

  const [genericSendOpen, setGenericSendOpen] = useState(false);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState('');
  const [manualBeneficiaryName, setManualBeneficiaryName] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendNote, setSendNote] = useState('');
  const [sendLoading, setSendLoading] = useState(false);

  const loadBeneficiaries = useCallback(() => {
    return apiGet<Beneficiary[]>('/parties/beneficiaries')
      .then((list) => setBeneficiaries(list ?? []))
      .catch(() => setBeneficiaries([]));
  }, []);

  const loadOutflows = useCallback(() => {
    return apiGet<PaymentRow[]>('/payments?limit=30')
      .then((list) => {
        const debits = (list ?? [])
          .filter((p) => p.direction === 'DEBIT' && p.status === 'SUCCESS')
          .slice(0, 8)
          .map((p) => {
            const meta = (p.metadata ?? {}) as { beneficiary?: string };
            return {
              id: p.id,
              name: p.party?.name ?? meta.beneficiary ?? t('beneficiary'),
              amount: Number(p.amount),
              time: formatAppDateShort(p.createdAt, i18n.language),
              partyId: p.party?.id ?? p.partyId ?? undefined,
            };
          });
        setOutflows(debits);
      })
      .catch(() => setOutflows([]));
  }, [i18n.language, t]);

  const refreshBalance = useCallback(() => {
    return apiGet<{ netBalance: number; totalInflow: number }>('/merchants/ledger?period=all')
      .then((d) => {
        setWalletBalance(d.netBalance);
        setIncomingAmount(d.totalInflow);
      })
      .catch(() => {
        setWalletBalance(0);
        setIncomingAmount(0);
      });
  }, []);

  useEffect(() => {
    loadBeneficiaries();
    loadOutflows();
    refreshBalance();

    apiGet<{
      commissionRate?: number;
      limitTouched?: boolean;
      remainingLimit?: number;
    }>('/merchants/me')
      .then((m) => {
        if (m?.commissionRate != null) setCommissionRate(Number(m.commissionRate));
        if (m?.limitTouched) {
          toast.warning(`Maximum limit reached! Allowed buffer limit remaining: ₹${m.remainingLimit?.toLocaleString('en-IN')}.`, {
            toastId: 'daily-limit-warning',
          });
        }
      })
      .catch(() => {});
  }, [loadBeneficiaries, loadOutflows, refreshBalance]);

  const sendPreview = useMemo(() => {
    const sendAmount = parseFloat(sendForm.amount) || 0;
    return calcSendCharge(sendAmount, commissionRate);
  }, [sendForm.amount, commissionRate]);

  const bulkPreviewTotal = useMemo(
    () => (bulkRows.length ? calcBulkTotalCharge(bulkRows, commissionRate) : 0),
    [bulkRows, commissionRate]
  );

  const submitAddBeneficiary = async () => {
    const name = beneficiaryForm.name.trim();
    const ifscCode = beneficiaryForm.ifscCode.trim().toUpperCase();
    const accountNumber = beneficiaryForm.accountNumber.trim();
    const confirmAccountNumber = beneficiaryForm.confirmAccountNumber.trim();

    if (name.length < 2) {
      alert(t('beneficiaryNameRequired'));
      return;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      alert(t('invalidIfsc'));
      return;
    }
    if (!/^\d{9,18}$/.test(accountNumber)) {
      alert(t('invalidAccountNumber'));
      return;
    }
    if (accountNumber !== confirmAccountNumber) {
      alert(t('accountMismatch'));
      return;
    }

    setAdding(true);
    try {
      await apiPost('/parties/beneficiaries', {
        name,
        ifscCode,
        accountNumber,
        confirmAccountNumber,
      });
      setBeneficiaryForm(emptyBeneficiaryForm);
      setAddModalOpen(false);
      await loadBeneficiaries();
    } catch (err) {
      alert(err instanceof Error ? err.message : t('addBeneficiaryFailed'));
    } finally {
      setAdding(false);
    }
  };

  const submitSend = async () => {
    if (!sendTarget) return;

    const amount = parseFloat(sendForm.amount);
    if (!amount || amount <= 0) {
      alert(t('invalidAmount'));
      return;
    }

    const beneficiary = sendTarget.name.trim();
    const { totalCharge } = calcSendCharge(amount, commissionRate);

    try {
      assertSufficientBalance(totalCharge, walletBalance, t('insufficientBalance'));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('insufficientBalance'));
      return;
    }

    setSending(true);
    try {
      const result = await sendWalletPayment({
        amount,
        beneficiary,
        partyId: sendTarget.id || undefined,
        note: sendForm.note.trim() || undefined,
      });

      setWalletBalance(result.balance);
      setSendTarget(null);
      setSendForm({ amount: '', note: '' });
      await Promise.all([loadOutflows(), loadBeneficiaries()]);
      alert(t('paymentSentSuccess', { name: beneficiary, amount: formatCurrency(amount) }));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('sendFailed'));
    } finally {
      setSending(false);
    }
  };

  const handleBulkFile = async (file: File | null) => {
    if (!file) return;
    try {
      const text = await file.text();
      const rows = parseBulkPayoutCsv(text);
      setBulkRows(rows);
      setBulkFileName(file.name);
      setBulkResults(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : t('bulkCsvInvalid'));
      setBulkRows([]);
      setBulkFileName('');
    }
  };

  const submitBulkPayout = async () => {
    if (bulkRows.length === 0) {
      alert(t('bulkCsvRequired'));
      return;
    }

    try {
      assertSufficientBalance(bulkPreviewTotal, walletBalance, t('insufficientBalance'));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('insufficientBalance'));
      return;
    }

    setBulkProcessing(true);
    setBulkResults(null);
    try {
      const result = await bulkSendWalletPayments(bulkRows);
      setWalletBalance(result.balance);
      setBulkResults(
        result.results.map((r) => ({
          name: r.name,
          amount: r.amount,
          status: r.status,
          error: r.error,
        }))
      );
      await Promise.all([loadOutflows(), loadBeneficiaries(), refreshBalance()]);
      if (result.failedCount === 0) {
        alert(t('bulkPayoutComplete', { count: result.successCount }));
      } else {
        alert(
          t('bulkPayoutPartial', {
            success: result.successCount,
            failed: result.failedCount,
          })
        );
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : t('bulkPayoutFailed'));
    } finally {
      setBulkProcessing(false);
    }
  };

  const addManualRow = () => {
    setManualEntryError('');
    const name = manualEntryForm.name.trim();
    const ifscCode = manualEntryForm.ifscCode.trim().toUpperCase();
    const accountNumber = manualEntryForm.accountNumber.trim();
    const confirmAccountNumber = manualEntryForm.confirmAccountNumber.trim();
    const amount = parseFloat(manualEntryForm.amount);

    if (name.length < 2) { setManualEntryError('Name must be at least 2 characters'); return; }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) { setManualEntryError('Invalid IFSC code (e.g. SBIN0001234)'); return; }
    if (!/^\d{9,18}$/.test(accountNumber)) { setManualEntryError('Account number must be 9–18 digits'); return; }
    if (accountNumber !== confirmAccountNumber) { setManualEntryError('Account numbers do not match'); return; }
    if (!amount || amount <= 0) { setManualEntryError('Enter a valid amount'); return; }

    setBulkRows((prev) => [...prev, { name, accountNumber, ifscCode, amount }]);
    setManualEntryForm(emptyManualForm);
  };

  const removeManualRow = (idx: number) => {
    setBulkRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const openBulkModal = () => {
    setBulkRows([]);
    setBulkFileName('');
    setBulkResults(null);
    setBulkMode('manual');
    setManualEntryForm(emptyManualForm);
    setManualEntryError('');
    setBulkModalOpen(true);
    refreshBalance();
  };

  const openSendModal = (beneficiary: Beneficiary) => {
    setSendForm({ amount: '', note: '' });
    setSendTarget(beneficiary);
    refreshBalance();
  };

  const handleSendSubmit = async () => {
    const amt = parseFloat(sendAmount);
    const totalCharge = amt + Math.round(((amt * commissionRate) / 100) * 100) / 100;
    if (totalCharge > walletBalance) {
      alert('Insufficient balance');
      return;
    }

    setSendLoading(true);
    try {
      const res = await apiPost<{ balance: number; limitTouched?: boolean; remainingLimit?: number }>(
        '/payments/send',
        {
          amount: amt,
          beneficiary: manualBeneficiaryName.trim(),
          partyId: selectedBeneficiaryId !== 'manual' && selectedBeneficiaryId ? selectedBeneficiaryId : undefined,
          note: sendNote.trim() || undefined,
        }
      );
      toast.success('Payment sent successfully!');
      if (res?.limitTouched) {
        toast.warning(`Maximum limit reached! Allowed buffer limit remaining: ₹${res.remainingLimit?.toLocaleString('en-IN')}.`, {
          toastId: 'daily-limit-warning',
        });
      }
      setGenericSendOpen(false);
      setSelectedBeneficiaryId('');
      setManualBeneficiaryName('');
      setSendAmount('');
      setSendNote('');
      
      // Refresh balance and list of recent outflows
      await Promise.all([loadOutflows(), refreshBalance()]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send payment');
    } finally {
      setSendLoading(false);
    }
  };

  const repeatOutflow = (item: OutflowItem) => {
    const match = beneficiaries.find((b) => b.id === item.partyId || b.name === item.name);
    if (match) {
      openSendModal(match);
      setSendForm((f) => ({ ...f, amount: String(item.amount) }));
      return;
    }
    setSendForm({ amount: String(item.amount), note: '' });
    setSendTarget({
      id: item.partyId ?? '',
      name: item.name,
    });
  };

  return (
    <AppShell title={t('sendMoneyPayouts')}>
      <div className="px-4 md:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="mb-1 text-xl font-bold text-navy md:text-2xl">{t('sendMoneyPayouts')}</h1>
            <p className="text-sm text-gray-500">{t('sendSub')}</p>
          </div>
          <button
            type="button"
            onClick={() => setGenericSendOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] hover:bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-300"
          >
            <Send size={18} />
            Send Money
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Available Wallet Balance Card */}
          <div className="rounded-2xl border-2 border-primary bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-1 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary">
              <Wallet size={14} className="text-primary" />
              Available Balance
            </div>
            <p className="text-2xl font-black text-navy">
              {formatCurrency(walletBalance)}
            </p>
          </div>

          {/* Total Incoming Card */}
          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="mb-1 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-green-600">
              <TrendingUp size={14} className="text-green-600" />
              Total Incoming
            </div>
            <p className="text-2xl font-black text-green-600">
              {formatCurrency(incomingAmount)}
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-2 md:gap-4">
          {CATEGORIES.map(({ icon: Icon, label, color }) => (
            <button
              key={label}
              type="button"
              className="flex flex-col items-center rounded-2xl border border-orange-100 hover:border-primary bg-white p-3 shadow-sm transition hover:scale-[1.02] duration-300 md:p-4"
            >
              <div className={cn('mb-2 rounded-full p-2.5', color)}>
                <Icon size={22} />
              </div>
              <span className="text-center text-[10px] font-medium leading-tight text-navy md:text-xs">
                {t(label)}
              </span>
            </button>
          ))}
        </div>

        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-orange-100 bg-orange-50/30 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="mb-1 font-bold text-navy">{t('automateTransfers')}</h2>
            <p className="text-sm text-gray-600">{t('automateSub')}</p>
          </div>
          <button
            type="button"
            onClick={openBulkModal}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary hover:bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-300"
          >
            <ListChecks size={18} />
            {t('bulkPayout')}
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-navy">{t('recentBeneficiaries')}</h2>
          <button
            type="button"
            className="rounded-lg border border-orange-100 bg-white px-3 py-1 text-xs font-medium text-primary hover:border-primary transition-colors"
          >
            {t('viewAll')}
          </button>
        </div>

        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="flex w-20 shrink-0 flex-col items-center gap-2 rounded-2xl border border-dashed border-orange-200 bg-white p-3 transition hover:border-primary hover:bg-orange-50/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-orange-300">
              <Plus className="text-primary" size={20} />
            </div>
            <span className="text-xs text-gray-600">{t('new')}</span>
          </button>
          {beneficiaries.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => openSendModal(b)}
              className="flex w-20 shrink-0 flex-col items-center gap-2 rounded-2xl p-1 transition hover:bg-orange-50/40 border border-transparent hover:border-orange-100"
            >
              <NameAvatar name={b.name} className="h-14 w-14 text-sm" />
              <span className="max-w-full truncate text-xs text-gray-700" title={b.name}>
                {truncateName(b.name)}
              </span>
            </button>
          ))}
        </div>

        <div className="mb-8 rounded-2xl border border-orange-100 bg-orange-50/10 p-5 shadow-sm">
          <h2 className="mb-4 font-bold text-navy">{t('quickBillPay')}</h2>
          <div className="grid grid-cols-5 gap-2">
            {BILL_ICONS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                className="flex flex-col items-center gap-2 rounded-xl border border-orange-50 hover:border-primary/50 transition-all bg-white py-3 shadow-sm hover:scale-[1.02] duration-300"
              >
                <Icon className="text-primary" size={22} />
                <span className="text-[10px] font-medium text-navy">{t(label)}</span>
              </button>
            ))}
          </div>
        </div>

        <h2 className="mb-4 font-bold text-navy">{t('recentOutflows')}</h2>
        <div className="space-y-3">
          {outflows.length === 0 && (
            <p className="rounded-2xl border border-orange-100 bg-white p-4 text-sm text-gray-500">
              {t('noPaymentsYet')}
            </p>
          )}
          {outflows.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm hover:border-primary/40 transition-colors"
            >
              <NameAvatar name={item.name} className="h-11 w-11 shrink-0 text-xs" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-navy">{item.name}</p>
                <p className="text-xs text-gray-400">{item.time}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-600">- {formatCurrency(item.amount)}</p>
                <button
                  type="button"
                  onClick={() => repeatOutflow(item)}
                  className="mt-1 inline-flex items-center gap-1 rounded-lg border border-orange-100 bg-orange-50/50 hover:bg-primary hover:text-white transition-all duration-300 px-2 py-0.5 text-xs font-semibold text-primary"
                >
                  <RotateCcw size={12} />
                  {t('repeat')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ActionModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setBeneficiaryForm(emptyBeneficiaryForm);
        }}
        title={t('addBeneficiary')}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-brand">{t('beneficiaryName')}</label>
            <input
              className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none focus:border-primary transition-all duration-300 font-medium"
              value={beneficiaryForm.name}
              onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, name: e.target.value })}
              placeholder={t('beneficiaryName')}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-brand">{t('ifscCode')}</label>
            <input
              className="w-full rounded-xl border border-orange-100 px-4 py-3 uppercase outline-none focus:border-primary transition-all duration-300 font-medium"
              value={beneficiaryForm.ifscCode}
              onChange={(e) =>
                setBeneficiaryForm({ ...beneficiaryForm, ifscCode: e.target.value.toUpperCase() })
              }
              placeholder="SBIN0001234"
              maxLength={11}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-brand">{t('accountNumber')}</label>
            <input
              className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none focus:border-primary transition-all duration-300 font-medium"
              value={beneficiaryForm.accountNumber}
              onChange={(e) =>
                setBeneficiaryForm({ ...beneficiaryForm, accountNumber: e.target.value.replace(/\D/g, '') })
              }
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-brand">{t('confirmAccountNumber')}</label>
            <input
              className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none focus:border-primary transition-all duration-300 font-medium"
              value={beneficiaryForm.confirmAccountNumber}
              onChange={(e) =>
                setBeneficiaryForm({
                  ...beneficiaryForm,
                  confirmAccountNumber: e.target.value.replace(/\D/g, ''),
                })
              }
              inputMode="numeric"
            />
          </div>
        </div>
        <Button className="mt-6 w-full" onClick={submitAddBeneficiary} disabled={adding}>
          {adding ? t('loadingEllipsis') : t('addBeneficiary')}
        </Button>
        <button
          type="button"
          onClick={() => {
            setAddModalOpen(false);
            setBeneficiaryForm(emptyBeneficiaryForm);
          }}
          className="mt-3 w-full text-center text-sm text-brand underline"
        >
          {t('cancel')}
        </button>
      </ActionModal>

      <ActionModal
        open={!!sendTarget}
        onClose={() => setSendTarget(null)}
        title={sendTarget ? t('sendTo', { name: sendTarget.name }) : t('sendPayment')}
      >
        {sendTarget && (
          <>
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/40 p-3">
              <NameAvatar name={sendTarget.name} className="h-12 w-12 text-sm" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-navy">{sendTarget.name}</p>
                {sendTarget.ifscCode && sendTarget.accountNumber && (
                  <p className="text-xs text-gray-500">
                    {sendTarget.ifscCode} · ****{sendTarget.accountNumber.slice(-4)}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-4 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm">
              <span className="text-gray-600">{t('availableBalance')}</span>
              <span className="font-semibold text-navy">{formatCurrency(walletBalance)}</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-brand">{t('amountRupee')}</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none focus:border-primary transition-all duration-300 font-medium"
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
                  className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none focus:border-primary transition-all duration-300 font-medium"
                  value={sendForm.note}
                  onChange={(e) => setSendForm({ ...sendForm, note: e.target.value })}
                />
              </div>
            </div>
            <Button
              className="mt-6 w-full"
              onClick={submitSend}
              disabled={sending || sendPreview.sendAmount <= 0 || sendPreview.totalCharge > walletBalance}
            >
              {sending ? (
                t('loadingEllipsis')
              ) : sendPreview.sendAmount > 0 ? (
                t('confirmSendTotal', { total: formatCurrency(sendPreview.totalCharge) })
              ) : (
                <>
                  <Send size={16} />
                  {t('sendPayment')}
                </>
              )}
            </Button>
            <button
              type="button"
              onClick={() => setSendTarget(null)}
              className="mt-3 w-full text-center text-sm text-brand underline"
            >
              {t('cancel')}
            </button>
          </>
        )}
      </ActionModal>

      <ActionModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        title={t('bulkPayout')}
      >
        {/* Balance bar */}
        <div className="mb-4 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm">
          <span className="text-gray-600">{t('availableBalance')}</span>
          <span className="font-semibold text-navy">{formatCurrency(walletBalance)}</span>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex rounded-xl border border-orange-100 bg-orange-50/30 p-1 gap-1">
          {(['manual', 'csv'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setBulkMode(tab); setBulkRows([]); setBulkResults(null); setBulkFileName(''); setManualEntryForm(emptyManualForm); setManualEntryError(''); }}
              className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all duration-200 ${bulkMode === tab ? 'bg-primary text-white shadow' : 'text-gray-500 hover:text-primary'}`}
            >
              {tab === 'manual' ? '✏️ Manual Entry' : '📄 Upload CSV'}
            </button>
          ))}
        </div>

        {/* ── MANUAL ENTRY TAB ── */}
        {bulkMode === 'manual' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Add recipient details</p>

            {/* Entry form */}
            <div className="rounded-2xl border border-orange-100 bg-white p-4 space-y-3 shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-brand">Full Name</label>
                  <input
                    className="w-full rounded-xl border border-orange-100 px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    placeholder="Ramesh Kumar"
                    value={manualEntryForm.name}
                    onChange={(e) => { setManualEntryForm(f => ({ ...f, name: e.target.value })); setManualEntryError(''); }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-brand">IFSC Code</label>
                  <input
                    className="w-full rounded-xl border border-orange-100 px-3 py-2.5 text-sm uppercase outline-none focus:border-primary transition-all"
                    placeholder="SBIN0001234"
                    maxLength={11}
                    value={manualEntryForm.ifscCode}
                    onChange={(e) => { setManualEntryForm(f => ({ ...f, ifscCode: e.target.value.toUpperCase() })); setManualEntryError(''); }}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-brand">Account Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-orange-100 px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
                  placeholder="Enter account number"
                  value={manualEntryForm.accountNumber}
                  onChange={(e) => { setManualEntryForm(f => ({ ...f, accountNumber: e.target.value.replace(/\D/g, '') })); setManualEntryError(''); }}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-brand">Confirm Account Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-all ${manualEntryForm.confirmAccountNumber && manualEntryForm.confirmAccountNumber !== manualEntryForm.accountNumber ? 'border-red-300 focus:border-red-400' : 'border-orange-100 focus:border-primary'}`}
                  placeholder="Re-enter account number"
                  value={manualEntryForm.confirmAccountNumber}
                  onChange={(e) => { setManualEntryForm(f => ({ ...f, confirmAccountNumber: e.target.value.replace(/\D/g, '') })); setManualEntryError(''); }}
                />
                {manualEntryForm.confirmAccountNumber && manualEntryForm.confirmAccountNumber !== manualEntryForm.accountNumber && (
                  <p className="mt-1 text-xs text-red-500">Account numbers do not match</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-brand">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-xl border border-orange-100 px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
                  placeholder="0.00"
                  value={manualEntryForm.amount}
                  onChange={(e) => { setManualEntryForm(f => ({ ...f, amount: e.target.value })); setManualEntryError(''); }}
                />
              </div>

              {manualEntryError && (
                <p className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                  ⚠️ {manualEntryError}
                </p>
              )}

              <button
                type="button"
                onClick={addManualRow}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-50 border border-orange-200 hover:bg-primary hover:text-white hover:border-primary px-4 py-2.5 text-sm font-bold text-primary transition-all duration-300"
              >
                + Add to List
              </button>
            </div>

            {/* Added rows preview */}
            {bulkRows.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-gray-400">
                  Recipients ({bulkRows.length})
                </p>
                <div className="max-h-44 overflow-y-auto rounded-xl border border-orange-100 bg-white shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-orange-50/60 border-b border-orange-100 text-primary font-bold uppercase sticky top-0">
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Account</th>
                        <th className="px-3 py-2">IFSC</th>
                        <th className="px-3 py-2 text-right">Amount</th>
                        <th className="px-2 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkRows.map((r, idx) => (
                        <tr key={idx} className="border-b border-orange-50 last:border-b-0 hover:bg-orange-50/10">
                          <td className="px-3 py-2 font-bold text-navy">{r.name}</td>
                          <td className="px-3 py-2 text-gray-500">****{r.accountNumber.slice(-4)}</td>
                          <td className="px-3 py-2 text-gray-500 uppercase">{r.ifscCode}</td>
                          <td className="px-3 py-2 text-right font-semibold text-primary">{formatCurrency(r.amount)}</td>
                          <td className="px-2 py-2">
                            <button
                              type="button"
                              onClick={() => removeManualRow(idx)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                              title="Remove"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="mt-3 rounded-xl border border-orange-100 bg-orange-50/60 p-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{t('bulkRecipients')}</span>
                    <span className="font-medium text-navy">{bulkRows.length}</span>
                  </div>
                  <div className="mt-2 flex justify-between font-semibold text-navy border-t border-orange-200 pt-2">
                    <span>{t('totalDebit')}</span>
                    <span className="text-primary">{formatCurrency(bulkPreviewTotal)}</span>
                  </div>
                  {bulkPreviewTotal > walletBalance && (
                    <p className="mt-2 text-xs font-medium text-red-600">{t('insufficientBalance')}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CSV UPLOAD TAB ── */}
        {bulkMode === 'csv' && (
          <div className="space-y-4">
            {/* Download demo */}
            <button
              type="button"
              onClick={() => downloadDemoBulkCsv()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
            >
              <Download size={18} />
              {t('downloadDemoCsv')}
            </button>

            {/* Upload zone — transforms after file selected */}
            {!bulkFileName ? (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-orange-200 hover:border-primary bg-white px-4 py-8 text-center transition duration-300 group">
                <Upload className="text-gray-300 group-hover:text-primary transition-colors" size={32} />
                <span className="text-sm font-semibold text-navy">{t('uploadCsv')}</span>
                <span className="text-xs text-gray-400">{t('bulkCsvHint')}</span>
                <span className="mt-1 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-bold text-primary">Browse file</span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => void handleBulkFile(e.target.files?.[0] ?? null)}
                />
              </label>
            ) : (
              <div className="rounded-xl border-2 border-green-200 bg-green-50/50 px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                      <span className="text-lg">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-800">{bulkFileName}</p>
                      <p className="text-xs text-green-600">{bulkRows.length} recipient{bulkRows.length !== 1 ? 's' : ''} loaded</p>
                    </div>
                  </div>
                  <label className="cursor-pointer rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all">
                    Change file
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      className="hidden"
                      onChange={(e) => void handleBulkFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Loaded rows list */}
            {bulkRows.length > 0 && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400">CSV Recipients</p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{bulkRows.length} entries</span>
                </div>
                <div className="max-h-52 overflow-y-auto rounded-xl border border-orange-100 bg-white shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-orange-50/60 border-b border-orange-100 text-primary font-bold uppercase sticky top-0">
                        <th className="px-3 py-2">#</th>
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Account No.</th>
                        <th className="px-3 py-2">IFSC</th>
                        <th className="px-3 py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkRows.map((r, idx) => (
                        <tr key={idx} className="border-b border-orange-50 last:border-b-0 hover:bg-orange-50/20">
                          <td className="px-3 py-2.5 text-gray-400 font-medium">{idx + 1}</td>
                          <td className="px-3 py-2.5 font-bold text-navy">{r.name}</td>
                          <td className="px-3 py-2.5 font-mono text-gray-500 text-[10px]">****{r.accountNumber.slice(-4)}</td>
                          <td className="px-3 py-2.5 text-gray-500 uppercase font-mono text-[10px]">{r.ifscCode}</td>
                          <td className="px-3 py-2.5 text-right font-bold text-primary">{formatCurrency(r.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-orange-50/80 border-t border-orange-200">
                        <td colSpan={4} className="px-3 py-2.5 font-bold text-navy text-xs">{t('totalDebit')}</td>
                        <td className="px-3 py-2.5 text-right font-bold text-primary">{formatCurrency(bulkPreviewTotal)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                {bulkPreviewTotal > walletBalance && (
                  <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                    ⚠️ {t('insufficientBalance')} — Available: {formatCurrency(walletBalance)}
                  </p>
                )}
              </div>
            )}
          </div>
        )}


        {/* Results after processing */}
        {bulkResults && (
          <div className="mt-4 max-h-40 space-y-2 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs">
            {bulkResults.map((r, i) => (
              <div key={`${r.name}-${i}`} className="flex justify-between gap-2">
                <span className="truncate text-navy">
                  {r.name} · {formatCurrency(r.amount)}
                </span>
                <span className={r.status === 'success' ? 'text-green-600 font-semibold' : 'text-red-600'}>
                  {r.status === 'success' ? '✓ Sent' : r.error ?? t('failed')}
                </span>
              </div>
            ))}
          </div>
        )}

        <Button
          className="mt-6 w-full"
          onClick={submitBulkPayout}
          disabled={bulkProcessing || bulkRows.length === 0 || bulkPreviewTotal > walletBalance}
        >
          {bulkProcessing ? t('bulkProcessing') : t('startBulkPayout')}
        </Button>
        <button
          type="button"
          onClick={() => setBulkModalOpen(false)}
          className="mt-3 w-full text-center text-sm text-brand underline"
        >
          {t('cancel')}
        </button>
      </ActionModal>


      <ActionModal
        open={genericSendOpen}
        onClose={() => {
          setGenericSendOpen(false);
          setSelectedBeneficiaryId('');
          setManualBeneficiaryName('');
          setSendAmount('');
          setSendNote('');
        }}
        title="Send Money"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand">Select Beneficiary</label>
            <select
              value={selectedBeneficiaryId}
              onChange={(e) => {
                setSelectedBeneficiaryId(e.target.value);
                if (e.target.value !== 'manual') {
                  const b = beneficiaries.find((x) => x.id === e.target.value);
                  setManualBeneficiaryName(b ? b.name : '');
                } else {
                  setManualBeneficiaryName('');
                }
              }}
              className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 outline-none focus:border-primary transition-all duration-300 font-semibold text-navy text-sm"
            >
              <option value="">-- Choose Beneficiary --</option>
              {beneficiaries.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} {b.accountNumber ? `(****${b.accountNumber.slice(-4)})` : ''}
                </option>
              ))}
              <option value="manual">Enter details manually</option>
            </select>
          </div>

          {selectedBeneficiaryId === 'manual' && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand">Beneficiary Name</label>
              <input
                value={manualBeneficiaryName}
                onChange={(e) => setManualBeneficiaryName(e.target.value)}
                placeholder="Enter beneficiary's name"
                className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none focus:border-primary transition-all duration-300 font-semibold text-navy text-sm"
              />
            </div>
          )}

          {manualBeneficiaryName && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand">Amount (₹)</label>
                <div className="flex overflow-hidden rounded-xl border border-orange-100 bg-white">
                  <span className="flex items-center px-4 text-lg font-semibold text-gray-400">₹</span>
                  <input
                    type="number"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 py-3 text-lg font-semibold text-navy outline-none"
                  />
                </div>
              </div>

              {parseFloat(sendAmount) > 0 && (
                <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Send Amount</span>
                    <span className="font-medium text-navy">{formatCurrency(parseFloat(sendAmount))}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-gray-600">
                    <span>
                      Platform Fee ({commissionRate}%)
                    </span>
                    <span className="font-medium text-navy">
                      {formatCurrency(Math.round(((parseFloat(sendAmount) * commissionRate) / 100) * 100) / 100)}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-orange-200 pt-3 font-semibold text-navy">
                    <span>Total Debit</span>
                    <span className="text-primary">
                      {formatCurrency(
                        parseFloat(sendAmount) +
                          Math.round(((parseFloat(sendAmount) * commissionRate) / 100) * 100) / 100
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand">Note (Optional)</label>
                <input
                  value={sendNote}
                  onChange={(e) => setSendNote(e.target.value)}
                  placeholder="e.g. Settle invoice, Salary..."
                  className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none focus:border-primary transition-all duration-300 font-semibold text-navy text-sm"
                />
              </div>
            </>
          )}
        </div>

        <Button
          className="mt-6 w-full py-3.5"
          onClick={handleSendSubmit}
          disabled={
            sendLoading ||
            !manualBeneficiaryName ||
            !sendAmount ||
            parseFloat(sendAmount) <= 0 ||
            parseFloat(sendAmount) +
              Math.round(((parseFloat(sendAmount) * commissionRate) / 100) * 100) / 100 >
              walletBalance
          }
        >
          {sendLoading ? t('loadingEllipsis') : 'Send Payment'}
        </Button>
        <button
          type="button"
          onClick={() => {
            setGenericSendOpen(false);
            setSelectedBeneficiaryId('');
            setManualBeneficiaryName('');
            setSendAmount('');
            setSendNote('');
          }}
          className="mt-3 w-full text-center text-sm text-brand underline"
        >
          Cancel
        </button>
      </ActionModal>
    </AppShell>
  );
}
