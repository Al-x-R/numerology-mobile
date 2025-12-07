// hooks/useZodiacForecast.ts
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/contexts/LanguageContext';
import { ForecastSection } from '@/components/UniversalForecastCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PeriodType = 'day' | 'month' | 'year';

export const useZodiacForecast = (type: PeriodType, sign: string | null) => {
  const [data, setData] = useState<ForecastSection | null>(null);
  const [loading, setLoading] = useState(true); // Start loading as true to check cache first
  const { language } = useLanguage();

  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async (forceUpdate = false) => {
    if (!sign) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const d = new Date();
      let docId = '';

      // Generate docId based on type
      if (type === 'day') {
        docId = d.toISOString().split('T')[0];
      } else if (type === 'month') {
        docId = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      } else if (type === 'year') {
        docId = `${d.getFullYear()}`;
      }

      const collectionName = `${type === 'day' ? 'daily' : type === 'month' ? 'monthly' : 'yearly'}_zodiac`;

      // Generate unique cache key
      // Example: @zodiac_day_2023-10-27_aries_ru
      const cacheKey = `@zodiac_${type}_${docId}_${sign}_${language}`;

      // 1. Try to load from cache first (if not force update)
      if (!forceUpdate) {
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
          console.log(`📦 Loaded zodiac from cache: ${cacheKey}`);
          setData(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
      }

      // 2. Fetch from Firebase
      console.log(`📡 Fetching ${collectionName}/${docId} for sign ${sign}...`);
      const docRef = doc(db, collectionName, docId);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const raw = snapshot.data();
        const signData = raw[sign];

        if (signData) {
          const localized = signData[language];
          // Fallback logic
          const fallbackData = localized || signData['ru'] || Object.values(signData).find(d => d);
          const finalData = fallbackData || null;

          setData(finalData);

          // 3. Save to cache
          if (finalData) {
            await AsyncStorage.setItem(cacheKey, JSON.stringify(finalData));
          }
        } else {
          setData(null);
        }
      } else {
        console.log(`No zodiac doc found for ${collectionName}/${docId}`);
        setData(null);
      }
    } catch (e) {
      console.error("Zodiac fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [type, sign, language]);

  useEffect(() => {
    fetchData(false);
  }, [fetchData, refreshKey]);

  const refetch = useCallback(() => {
    // Force update ignores cache and fetches fresh data
    fetchData(true);
  }, [fetchData]);

  return { data, loading, refetch };
};
