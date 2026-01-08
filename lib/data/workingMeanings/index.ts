import { ru } from './ru';
import { en } from './en';
import { uk } from './uk';
import { zhTW } from './zh-TW';
import { Locale } from '@/lib/constants/locales';

const meanings: Record<string, Record<number, string>> = {
  ru,
  en,
  uk,
  'zh-TW': zhTW,
};

export const getWorkingMeanings = (locale: string): Record<number, string> => {
  return meanings[locale] || meanings.en;
};
