// constants/locales.ts
export type Locale = 'ru' | 'en';

interface Translations {
  [key: string]: string | ((...args: any[]) => string);
}

interface LocaleData {
  [key: string]: Translations;
}

const translations: LocaleData = {
  ru: {
    title: 'Код Даты',
    subtitle: 'Рассчитайте свой Квадрат Пифагора',
    inputPlaceholder: 'Введите дату рождения (ДД.ММ.ГГГГ)',
    buttonText: 'Рассчитать',
    loadingText: 'Расчёт...',

    errorEmpty: 'Введите дату',
    errorFormat: 'Формат: ДД.ММ.ГГГГ',
    errorInvalid: 'Некорректная дата',
  },
  en: {
    title: 'Date Code',
    subtitle: 'Calculate your Pythagorean Square',
    inputPlaceholder: 'Enter birth date (DD.MM.YYYY)',
    buttonText: 'Calculate',
    loadingText: 'Calculating...',

    errorEmpty: 'Enter a date',
    errorFormat: 'Format: DD.MM.YYYY',
    errorInvalid: 'Invalid date',
  },
};

let currentLocale: Locale = 'ru';

export const setLocale = (locale: Locale) => {
  currentLocale = locale;
};

export const t = (key: keyof typeof translations.ru): string => {
  return translations[currentLocale][key] as string;
};
