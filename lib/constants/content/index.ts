import { ru } from './ru';
import { en } from './en';
import { uk } from './uk';
import { zhTW } from './zh-TW';
import { CompatibilityTexts } from './types';
import { Locale } from '@/lib/constants/locales';

const content: Record<Locale, CompatibilityTexts> = {
  ru,
  en,
  uk,
  'zh-TW': zhTW,
};

export const getContent = (locale: Locale): CompatibilityTexts => {
  if (content[locale]) {
    return content[locale];
  }

  return content.en;
};
