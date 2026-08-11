import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';
import gu from './locales/gu.json';
import ta from './locales/ta.json';
import te from './locales/te.json';

export const LANGUAGES = [
  { code: 'en', native: 'English', english: 'English' },
  { code: 'hi', native: 'हिंदी', english: 'Hindi' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  gu: { translation: gu },
  ta: { translation: ta },
  te: { translation: te },
};

const saved = (localStorage.getItem('freshwallet_lang') || 'en') as LanguageCode;

const applyDocumentLang = (code: string) => {
  document.documentElement.lang = code;
};

applyDocumentLang(saved);

i18n.use(initReactI18next).init({
  resources,
  lng: saved,
  fallbackLng: 'en',
  returnEmptyString: false,
  interpolation: { escapeValue: false },
});

export const setLanguage = (code: string) => {
  localStorage.setItem('freshwallet_lang', code);
  applyDocumentLang(code);
  void i18n.changeLanguage(code);
};

export default i18n;
