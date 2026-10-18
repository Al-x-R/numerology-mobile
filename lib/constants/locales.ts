// constants/locales.ts
import { ru } from './locales/ru';
import { en } from './locales/en';
import { uk } from './locales/uk';

export type Locale = 'ru' | 'en' | 'uk';

type TranslationValue = string | ((...args: any[]) => string);
type TranslationNode = TranslationValue | Translations | any[] | Record<string, any>;

export interface Translations {
  [key: string]: TranslationNode;
}

interface LocaleData {
  [lang: string]: Translations;
}

export const translations: LocaleData = {
  ru,
  en,
  uk,
};

let currentLocale: Locale = 'en';

export const setLocale = (locale: Locale) => {
  currentLocale = locale;
};

export const getCurrentLocale = (): Locale => {
  return currentLocale;
};

export const t = (path: string, lang?: Locale): string => {
  const locale = lang || currentLocale;
  const keys = path.split('.');
  let result: any = translations[locale];

  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return path; // fallback
  }

  // Support simple placeholder replacement for {value} or {number}
  if (typeof result === 'string' && (result.includes('{value}') || result.includes('{number}'))) {
    // This is a template string - return as is for now
    // Components will need to handle replacement manually
  }

  return typeof result === 'string' ? result : path;
};

export const tArray = (path: string, lang?: Locale): any[] => {
  const locale = lang || currentLocale;
  const keys = path.split('.');
  let result: any = translations[locale];

  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return [];
  }

  return Array.isArray(result) ? result : [];
};

export const tObject = (path: string, lang?: Locale): Record<string, any> => {
  const locale = lang || currentLocale;
  const keys = path.split('.');
  let result: any = translations[locale];

  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return {};
  }

  return typeof result === 'object' && result !== null && !Array.isArray(result) ? result : {};
};
