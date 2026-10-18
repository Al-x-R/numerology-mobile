// contexts/LanguageContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { setLocale, t, translations } from '@/lib/constants/locales';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'ru' | 'uk' | 'zh-TW';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = '@app_language';

export const useAppTranslation = () => {
  const { language } = useLanguage();

  const t = useCallback((key: string) => {
    const keys = key.split('.');

    // Ensure we use the correct key for zh-TW
    const localeKey = language === 'zh-TW' ? 'zh-TW' : language;
    let value: any = translations[localeKey];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }

    return value || key;
  }, [language]);

  return { t, language };
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (saved === 'en' || saved === 'ru' || saved === 'uk' || saved === 'zh-TW') {
          setLanguageState(saved as Language);
          setLocale(saved as Language);
          return;
        }

        const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
        let detected: Language = 'en';
        if (deviceLocale.startsWith('uk') || deviceLocale.startsWith('ua')) {
          detected = 'uk';
        } else if (deviceLocale.startsWith('ru')) {
          detected = 'ru';
        } else if (deviceLocale.startsWith('zh')) {
          detected = 'zh-TW';
        }

        setLanguageState(detected);
        setLocale(detected);
      } catch (e) {
        console.error('Language init error:', e);
      }
    })();
  }, []);

  const setLanguage = async (lang: Language) => {

    setLanguageState(lang);
    setLocale(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
