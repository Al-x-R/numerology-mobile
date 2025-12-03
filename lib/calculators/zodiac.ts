// lib/calculators/zodiac.ts

export type ZodiacSign = 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export const getZodiacSign = (date: Date): ZodiacSign => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // 1-12

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
};

export const getZodiacName = (sign: ZodiacSign, language: 'ru' | 'en'): string => {
  const names = {
    aries: { ru: 'Овен', en: 'Aries' },
    taurus: { ru: 'Телец', en: 'Taurus' },
    gemini: { ru: 'Близнецы', en: 'Gemini' },
    cancer: { ru: 'Рак', en: 'Cancer' },
    leo: { ru: 'Лев', en: 'Leo' },
    virgo: { ru: 'Дева', en: 'Virgo' },
    libra: { ru: 'Весы', en: 'Libra' },
    scorpio: { ru: 'Скорпион', en: 'Scorpio' },
    sagittarius: { ru: 'Стрелец', en: 'Sagittarius' },
    capricorn: { ru: 'Козерог', en: 'Capricorn' },
    aquarius: { ru: 'Водолей', en: 'Aquarius' },
    pisces: { ru: 'Рыбы', en: 'Pisces' },
  };
  return names[sign][language];
};
