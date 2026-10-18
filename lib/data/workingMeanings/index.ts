import { ru } from './ru';
import { en } from './en';
import { uk } from './uk';
import { Locale } from '@/lib/constants/locales';

const meanings: Record<string, Record<number, string>> = {
  ru,
  en,
  uk,
};

export const getWorkingMeanings = (locale: string): Record<number, string> => {
  return meanings[locale] || meanings.en;
};
