// contexts/LanguageContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { setLocale, t, translations } from '@/lib/constants/locales';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProfile } from './ProfileContext';

type Language = 'en' | 'ru';

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

    let value: any = translations[language];

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
  const { user, updateUserProfile } = useProfile();


  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (saved === 'en' || saved === 'ru') {
          setLanguageState(saved);
          setLocale(saved);
          return;
        }

        const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
        const detected: Language = deviceLocale.startsWith('ru') ? 'ru' : 'en';

        setLanguageState(detected);
        setLocale(detected);
      } catch (e) {
        console.error('Language init error:', e);
      }
    })();
  }, []);

  useEffect(() => {
    // @ts-ignore
    const userLang = user?.language as Language | undefined;

    if (userLang && (userLang === 'en' || userLang === 'ru') && userLang !== language) {
      console.log('Syncing language from user profile:', userLang);
      setLanguageState(userLang);
      setLocale(userLang);
      AsyncStorage.setItem(LANGUAGE_KEY, userLang);
    }
  }, [user]);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setLanguage = async (lang: Language) => {

    setLanguageState(lang);
    setLocale(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);

    if (user) {

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      // 2. Планируем новый запрос через 2 секунды
      saveTimerRef.current = setTimeout(async () => {
        try {
          console.log(`⏳ Debounce: Saving language "${lang}" to Firestore...`);
          // await updateUserProfile({ language: lang });
        } catch (e) {
          console.error('Failed to sync language to cloud:', e);
        }
      }, 20000);
    }
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
