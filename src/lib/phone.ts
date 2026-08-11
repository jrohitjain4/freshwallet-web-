/** Format as 5 digits + space + 5 digits (max 10 digits). */
export function formatIndianMobile(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function digitsOnly(formatted: string): string {
  return formatted.replace(/\D/g, '').slice(0, 10);
}

export function isValidIndianMobile(formatted: string): boolean {
  return digitsOnly(formatted).length === 10;
}
