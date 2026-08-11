const LOCALE_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  ta: 'ta-IN',
  te: 'te-IN',
};

export function getIntlLocale(lang: string): string {
  return LOCALE_MAP[lang] ?? 'en-IN';
}

export function formatAppDate(iso: string, lang: string): string {
  return new Date(iso).toLocaleString(getIntlLocale(lang), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatAppDateShort(iso: string, lang: string): string {
  return new Date(iso).toLocaleDateString(getIntlLocale(lang), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatAppNumber(n: number, lang: string): string {
  return n.toLocaleString(getIntlLocale(lang));
}
