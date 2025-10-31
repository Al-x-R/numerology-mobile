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

    // TOOLTIPS
    tooltip_weak_character: 'Слабая воля',
    tooltip_strong_character: 'Лидер от рождения',
    tooltip_weak_energy: 'Нет энергии',
    tooltip_strong_energy: 'Экстрасенс',
    tooltip_develop: 'Нужно развивать',
    tooltip_superpower: 'Суперсила!',
    tooltip_genius: 'Гениальность',
    tooltip_godlike: 'Божественный дар',

    // ADDITIONAL NUMBERS
    working1_title: '1-е Рабочее Число',
    working1_desc: 'Это "сырой" жизненный потенциал.',
    working2_title: '2-е Рабочее Число',
    working2_desc: 'Это ваша главная жизненная задача и миссия.',
    working3_title: '3-е Рабочее Число',
    working3_desc: 'Это "кармическая поправка" — то, что нужно отработать.',
    working4_title: '4-е Рабочее Число',
    working4_desc: 'Это "ключ" к решению кармических задач.',
    destiny_title: 'Число Судьбы',
    destiny_desc: 'Это ваша путеводная звезда.',
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

    // TOOLTIPS
    tooltip_weak_character: 'Weak will',
    tooltip_strong_character: 'Born leader',
    tooltip_weak_energy: 'No energy',
    tooltip_strong_energy: 'Psychic',
    tooltip_develop: 'Needs development',
    tooltip_superpower: 'Superpower!',
    tooltip_genius: 'Genius',
    tooltip_godlike: 'Godlike',

    // ADDITIONAL NUMBERS
    working1_title: '1st Working Number',
    working1_desc: 'This is the “raw” life potential you bring into the world.',
    working2_title: '2nd Working Number (Life Path Number)',
    working2_desc: 'It reveals your main life task and mission.',
    working3_title: '3rd Working Number',
    working3_desc: 'This is the “karmic adjustment” – the lesson you must work through.',
    working4_title: '4th Working Number',
    working4_desc: 'It is the practical “key” to solving the karmic tasks.',
    destiny_title: 'Life Path Number',
    destiny_desc: 'It is your guiding star throughout life.',
  },
};

let currentLocale: Locale = 'ru';

export const setLocale = (locale: Locale) => {
  currentLocale = locale;
};

export const t = (key: keyof typeof translations.ru): string => {
  return translations[currentLocale][key] as string;
};
