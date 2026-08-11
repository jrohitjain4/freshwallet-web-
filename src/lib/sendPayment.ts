import { apiGet, apiPost } from './api';

export type SendChargePreview = {
  sendAmount: number;
  commission: number;
  totalCharge: number;
};

export type WalletSendResult = {
  paymentId: string;
  amount: number;
  commissionAmount: number;
  commissionRate: number;
  totalCharge: number;
  balance: number;
};

export type BulkSendRow = {
  name: string;
  accountNumber: string;
  ifscCode: string;
  amount: number;
};

export type BulkSendResult = {
  results: {
    name: string;
    accountNumber: string;
    ifscCode: string;
    amount: number;
    status: 'success' | 'failed';
    paymentId?: string;
    error?: string;
  }[];
  successCount: number;
  failedCount: number;
  balance: number;
};

export function calcSendCharge(amount: number, commissionRate: number): SendChargePreview {
  if (amount <= 0) {
    return { sendAmount: 0, commission: 0, totalCharge: 0 };
  }
  const commission = Math.round(((amount * commissionRate) / 100) * 100) / 100;
  return { sendAmount: amount, commission, totalCharge: amount + commission };
}

export async function fetchWalletBalance(): Promise<number> {
  const data = await apiGet<{ totalBalance: number }>('/merchants/dashboard');
  return Number(data?.totalBalance ?? 0);
}

export function assertSufficientBalance(
  totalCharge: number,
  balance: number,
  message = 'Transaction failed due to insufficient balance'
): void {
  if (totalCharge > balance) {
    throw new Error(message);
  }
}

export async function sendWalletPayment(body: {
  amount: number;
  beneficiary: string;
  partyId?: string;
  note?: string;
}): Promise<WalletSendResult> {
  return apiPost<WalletSendResult>('/payments/send', body);
}

export async function bulkSendWalletPayments(rows: BulkSendRow[]): Promise<BulkSendResult> {
  return apiPost<BulkSendResult>('/payments/bulk-send', { rows });
}
