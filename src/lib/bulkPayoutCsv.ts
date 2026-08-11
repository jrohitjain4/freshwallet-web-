import type { BulkSendRow } from './sendPayment';

export const DEMO_BULK_CSV = `name,account_number,ifsc_code,amount
Amit Supplier,123456789012,SBIN0001234,5000
Sunil Staff,987654321098,HDFC0001234,25000
Rohan Mehta,112233445566,ICIC0001234,7500`;

function normalizeHeader(h: string) {
  return h.trim().toLowerCase().replace(/\s+/g, '_');
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  cells.push(current.trim());
  return cells;
}

function columnIndex(headers: string[], aliases: string[]) {
  for (const alias of aliases) {
    const idx = headers.indexOf(alias);
    if (idx >= 0) return idx;
  }
  return -1;
}

export function downloadDemoBulkCsv(filename = 'freshwallet-bulk-payout-demo.csv') {
  const blob = new Blob([DEMO_BULK_CSV], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function parseBulkPayoutCsv(text: string): BulkSendRow[] {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error('CSV must include a header row and at least one data row.');
  }

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const nameIdx = columnIndex(headers, ['name', 'beneficiary_name', 'beneficiary']);
  const accountIdx = columnIndex(headers, ['account_number', 'account', 'account_no']);
  const ifscIdx = columnIndex(headers, ['ifsc_code', 'ifsc']);
  const amountIdx = columnIndex(headers, ['amount', 'send_amount']);

  if (nameIdx < 0 || accountIdx < 0 || ifscIdx < 0 || amountIdx < 0) {
    throw new Error('CSV must include columns: name, account_number, ifsc_code, amount');
  }

  const rows: BulkSendRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]);
    if (cells.every((c) => !c)) continue;

    const name = (cells[nameIdx] ?? '').trim();
    const accountNumber = (cells[accountIdx] ?? '').replace(/\D/g, '');
    const ifscCode = (cells[ifscIdx] ?? '').trim().toUpperCase();
    const amount = parseFloat((cells[amountIdx] ?? '').replace(/[^\d.]/g, ''));

    if (!name || !accountNumber || !ifscCode || !amount || amount <= 0) {
      throw new Error(`Invalid data on row ${i + 1}. Check name, account, IFSC, and amount.`);
    }

    rows.push({ name, accountNumber, ifscCode, amount });
  }

  if (rows.length === 0) {
    throw new Error('No valid payout rows found in CSV.');
  }
  if (rows.length > 100) {
    throw new Error('Maximum 100 payouts allowed per upload.');
  }

  return rows;
}

export function calcBulkTotalCharge(rows: BulkSendRow[], commissionRate: number) {
  return rows.reduce((sum, row) => {
    const commission = Math.round(((row.amount * commissionRate) / 100) * 100) / 100;
    return sum + row.amount + commission;
  }, 0);
}
